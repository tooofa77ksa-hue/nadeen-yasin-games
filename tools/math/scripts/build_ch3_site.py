# -*- coding: utf-8 -*-
import json,re,os,shutil,sys
import sys;sys.path.insert(0,"/tmp/m4")
import build_chapter as BC
from build_chapter import *
REPO='/home/user/nadeen-yasin-games/nadeen'
os.makedirs(REPO+'/img/ch3',exist_ok=True)
import re
def mk(ch,src):
    es=entries(ch)
    out=[]
    for e in es:
        ms=[m for m in e['models'] if m.startswith('M')==(src=='period')]
        if ms: out.append(dict(e,models=ms,n=len(ms)))
    out.sort(key=lambda e:({'tf':0,'mcq':1,'word':2,'other':3}[sec(ITEMS[e['canon']])],-e['n'],ITEMS[e['canon']]['page']))
    EX=[]
    for e in out:
        x=ITEMS[e['canon']];r=rec(e['canon'],ch);ex=r.get('explain') or {}
        fa=str(r.get('final_answer',''))
        ci=-1;opts=x.get('options') or []
        if opts:
            m=re.match(r'\s*(هـ|[أبجد])\s*\)?',fa)
            if m:
                for i,o in enumerate(opts):
                    if o.strip().startswith(m.group(1)+')'): ci=i
            if ci<0:
                for i,o in enumerate(opts):
                    if re.sub(r'^[أبجد]\)\s*','',o).strip()==re.sub(r'^[أبجد]\)\s*','',fa).strip(): ci=i
        img=orig=None;f=x.get('figure')
        if f and os.path.exists(f):
            nm=os.path.basename(f)[:-4];rd=f'/tmp/m4/redraw/{nm}.png'
            if os.path.exists(rd):
                shutil.copy(rd,f'{REPO}/img/ch3/{nm}.png');img=f'img/ch3/{nm}.png'
                m=re.match(r'p2_p(\d+)_',nm)
                if not(nm in UNSAFE or (m and int(m.group(1)) in ANS_PAGES)):
                    from PIL import Image
                    im=Image.open(f).convert('L');im.thumbnail((300,300));im.save(f'{REPO}/img/ch3/{nm}_o.jpg',quality=70);orig=f'img/ch3/{nm}_o.jpg'
            else:
                shutil.copy(f,f'{REPO}/img/ch3/{nm}.png');img=f'img/ch3/{nm}.png'
        EX.append({'text':x['text'],'options':opts,'ci':ci,'img':img,'orig':orig,'src':place_label(e['models']),'lesson':r.get('lesson',''),'explain':ex,'answer':fa})
    return EX
T=open('/tmp/m4/coach/ch3_template.html',encoding='utf-8').read()
def page(name,title,h1,ch,nosets):
    groups=[]
    for src,t,sub in (('period','من نماذج اختبارات الفترة الثانية','أسئلة جاءت في نماذج الفترة الثانية، بنصها، مرتبة: صح وخطأ ثم متعدد ثم لفظية'),('central','من الاختبارات المركزية','أسئلة جاءت في الاختبارات المركزية (٦ مناطق)، بنصها كما هي')):
        groups.append({'id':src,'title':t,'sub':sub,'items':mk(ch,src)})
    h=T.replace('__EXAMS__',json.dumps(groups,ensure_ascii=False)).replace('__TITLE__',title).replace('__H1__',h1).replace('__NOSETS__','true' if nosets else 'false')
    open(f'{REPO}/{name}','w',encoding='utf-8').write(h)
    print(name,[(g['id'],len(g['items']),sum(1 for q in g['items'] if q['ci']>=0)) for g in groups])
page('masail_ch3.html','مدرّبة قراءة الرسوم: الفصل الثالث','📊 مدرّبة قراءة الرسوم: الفصل الثالث',3,False)
page('masail_ch4_exam.html','الفصل الرابع: أسئلة الاختبارات','📝 الفصل الرابع: أسئلة الاختبارات',4,True)
