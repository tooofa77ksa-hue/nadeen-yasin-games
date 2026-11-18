# -*- coding: utf-8 -*-
import sys,re,random;sys.path.insert(0,'/tmp/m4')
import build_chapter as B, build_booklet as K
random.seed(14481)
def pick(ch,k=10):
    es=[]
    for e in B.entries(ch):
        ms=[m for m in e['models'] if m.startswith('M')]
        if ms: es.append(dict(e,models=ms,n=len(ms),sim_models=[m for m in e['sim_models'] if m.startswith('M')]))
    order={'tf':0,'mcq':1,'word':2,'other':3}
    es.sort(key=lambda e:(order[B.sec(B.ITEMS[e['canon']])] if B.sec(B.ITEMS[e['canon']])!='other' else 3,-e['n'],random.random()))
    good=[e for e in es if B.sec(B.ITEMS[e['canon']])!='other']
    pool=good[:k]
    if len(pool)<k: pool+= [e for e in es if e not in pool][:k-len(pool)]
    return pool
def sheet(solved):
    allq=[]
    for ch in (3,4):
        for e in pick(ch): allq.append((ch,e))
    order={'tf':0,'mcq':1,'word':2,'other':3}
    allq.sort(key=lambda t:order[B.sec(B.ITEMS[t[1]['canon']])])
    b=f'<div class="note"><b>ورقة مخلوطة من ٢٠ سؤالاً:</b> ١٠ أسئلة من الفصل الثالث (تنظيم البيانات) و١٠ من الفصل الرابع (الأنماط والجبر)، كلها من نماذج اختبارات الفترة الثانية، مرتبة: صح وخطأ، ثم اختيار من متعدد، ثم مسائل لفظية، ثم جداول ورسوم.</div>'
    b+=('' if solved else '')
    n=0;cur=None
    for ch,e in allq:
        sk=B.sec(B.ITEMS[e['canon']])
        if sk!=cur:
            cur=sk;b+='<h2>'+dict(B.ORDER)[sk].replace('أولاً: ','').replace('ثانياً: ','').replace('ثالثاً: ','').replace('رابعاً: ','')+'</h2>'
        n+=1;h=B.q_html_ch(n,e,ch,solved)
        h=h.replace('<span class="n">','<span class="n">',1)
        if not solved: h=h.replace('<span class="t">','<span class="cue">🔎 ركّزي: ما المطلوب؟ ما المعطيات؟ ثم حلّلي</span><br><span class="t">',1)
        b+=h
    foot='<div class="dua">إعداد: عواطف الجهني<br><span style="font-size:13px;color:#555">هذا جهد شخصي لوجه الله، ولا يُعتمد عليه وحده؛ ارجعي دائماً إلى كتابك ومعلمتك.</span><br>اللهم بارك لي في أولادي ووفّقهم، واحفظ أمي وأبي وإخواني، وارزقنا جميعاً العلم النافع والتوفيق. آمين.</div>'
    title='ورقة مخلوطة (٢٠ سؤالاً): الفصلان ٣ و٤'+(' — محلولة ومشروحة' if solved else '')
    html=f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{B.CSS}{K.CSS2}</style></head><body><h1>{title}</h1><div class="sub">رياضيات · الصف الرابع الابتدائي · نماذج الفترة الثانية</div>{b}{foot}</body></html>'
    name='mixed20_solved' if solved else 'mixed20_student'
    open(f'/tmp/m4/out/{name}.html','w',encoding='utf-8').write(html);return name
if __name__=='__main__': print(sheet(True),sheet(False))
