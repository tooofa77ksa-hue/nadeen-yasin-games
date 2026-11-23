# -*- coding: utf-8 -*-
# مولّد نماذج رياضيات الفترة الثانية (الفصل ٣ أو ٤) من ٢٠ درجة، أبيض وأسود
import json,random,os,re
REPO=os.environ.get('REPO','/home/user/nadeen-yasin-games')
HERE=os.path.dirname(os.path.abspath(__file__))
D=json.load(open(os.path.join(HERE,'masail.json')))
IMG=REPO+'/nadeen/'
AR='٠١٢٣٤٥٦٧٨٩'
def ar(n):
    s=('%g'%n) if isinstance(n,float) else str(n);return ''.join(AR[int(c)] if c.isdigit() else c for c in s)
def okop(x):
    if x.get('mode')!='op':return False
    prev=None
    for st in x['steps']:
        a,b,op=st['a'],st['b'],st['op']
        a=prev if a=='prev' else a;b=prev if b=='prev' else b
        if not isinstance(a,(int,float)) or not isinstance(b,(int,float)):return False
        r={'+':a+b,'−':a-b,'×':a*b,'÷':(a/b if b else None)}[op]
        if r!=st['result']:return False
        prev=r
    return prev==x['answer_num']
def isT(a):return any(t in a for t in('✓','√','صح','صواب')) and not any(t in a for t in('✗','خطأ'))
def isF(a):return any(t in a for t in('✗','خطأ'))
def pool(key):
    g=[y for gg in D[key] for y in gg['items']]
    tf=[x for x in g if not x['options'] and (isT(x['answer']) or isF(x['answer'])) and len(x['text'])<130]
    tf+=[x for x in g if x['options'] and set(o.strip() for o in x['options'])=={'صواب','خطأ'}]
    mc=[x for x in g if len(x['options'])>=3 and 0<=x['ci']<len(x['options']) and len(x['text'])<150 and 'صواب' not in x['options'][0]]
    return tf,mc
def tfval(x):
    if x['options']:return x['answer'].strip().startswith('صواب')
    return isT(x['answer']) and not isF(x['answer'])
TF={3:pool('masail_ch3')[0],4:pool('masail_ch4_exam')[0]}
MC={3:pool('masail_ch3')[1],4:pool('masail_ch4_exam')[1]}
WPALL=D['masail_ch3w']+D['masail_ch4']
WP={3:[x for x in D['masail_ch3w'] if okop(x)],4:[x for x in D['masail_ch4'] if okop(x)]}
MW={3:[x for x in D['masail_ch3w'] if x.get('mode')!='op' and x.get('options') and 'correct_index' in x],4:[x for x in D['masail_ch4'] if x.get('mode')!='op' and x.get('options') and 'correct_index' in x]}
def fig(x):
    p=x.get('img')
    if p and os.path.exists(IMG+p):return '<div class="fig"><img src="file://%s%s"></div>'%(IMG,p)
    return ''
def why(x):
    e=x.get('explain')
    if isinstance(e,dict):return e.get('why') or ' '.join(e.get('steps',[])[:2])
    return ''
def mcq(x,i,solved):
    o=x['options'];ci=x['ci']
    h='<div class="q"><b>%d)</b> %s%s<br>'%(i,x['text'],fig(x))
    h+=''.join('<span class="op%s">%s</span>'%(' ok' if solved and j==ci else '',(t if re.match(r'^[أبجد][\)\-]',t) else 'أبجدهوزح'[j]+') '+t)) for j,t in enumerate(o))
    if solved and why(x):h+='<div class="why">لماذا؟ %s</div>'%why(x)
    return h+'</div>'
def tfq(x,i,solved):
    t=tfval(x)
    h='<div class="q"><b>%d)</b> %s%s &nbsp;<span class="bx%s">%s</span>'%(i,x['text'],fig(x),' ok' if solved else '',('✓' if t else '✗') if solved else '')
    if solved and why(x):h+='<div class="why">لماذا؟ %s</div>'%why(x)
    return h+'</div>'
def wp(x,i,solved):
    h='<div class="q"><b>%d)</b> %s'%(i,x['text'])
    if solved:
        ops=' ، '.join('%s = %s'%(s['write'],ar(s['result'])) for s in x['steps'])
        h+='<div class="ans">الحل: %s ← الإجابة: <b>%s %s</b></div><div class="why">لماذا؟ %s</div>'%(ops,ar(x['answer_num']),x.get('answer_unit',''),x.get('final_note',''))
    else:h+='<div class="ln"></div><div class="ln"></div>'
    return h+'</div>'
def wpm(x,i,solved):
    h='<div class="q"><b>%d)</b> %s<br>'%(i,x['text'])+''.join('<span class="op%s">%s</span>'%(' ok' if solved and j==x['correct_index'] else '','أبجدهوزح'[j]+') '+re.sub(r'^[أبجد][\)\-]\s*','',t)) for j,t in enumerate(x['options']))
    if solved and x.get('why_correct'):h+='<div class="why">لماذا؟ %s</div>'%x['why_correct']
    return h+'</div>'
def sample(L,k,rnd):
    seen=set();U=[]
    for x in L:
        t=x['text'].strip()
        if t not in seen:seen.add(t);U.append(x)
    L=U;rnd.shuffle(L)
    while len(L)<k:L+=L
    return L[:k]
def model_html(n,ch,solved):
    rnd=random.Random(n*10+ch)
    nw=[(wp,x) for x in sample(WP[ch],5,rnd)]+[(wpm,sample(MW[ch] or WP[ch],1,rnd)[0])] if MW[ch] else [(wp,x) for x in sample(WP[ch],6,rnd)]
    nw=[(wpm if ('options' in x and 'steps' not in x) else wp,x) for _,x in nw]
    secs=[('ضعي علامة ✓ أمام العبارة الصحيحة وعلامة ✗ أمام العبارة الخاطئة',6,[(tfq,x) for x in sample(TF[ch],6,rnd)]),
          ('اختاري الإجابة الصحيحة',8,[(mcq,x) for x in sample(MC[ch],8,rnd)]),
          ('حلي المسائل الآتية (اكتبي العملية ثم الجواب)',6,nw)]
    names=['الأول','الثاني','الثالث']
    head='<div class="hd"><div>المملكة العربية السعودية<br>وزارة التعليم</div><div class="c">المادة: الرياضيات · الصف الرابع الابتدائي<br>اختبار الفترة الثانية · الفصل الدراسي الأول 1448هـ · الفصل %s<br><b>نموذج %d%s</b></div><div>اسم الطالبة: ................<br>الدرجة: ...... / 20</div></div><div class="gn">الاختبار يحسب درجتكِ لا سرعتكِ: اقرئي السؤال جيداً مرتين، وتأكدي من إجابتك</div>'%(ar(ch),n,' — نموذج الإجابة' if solved else '')
    head+='<table class="sc"><tr><th>السؤال</th>'+''.join('<th>%s</th>'%names[i] for i in range(3))+'<th>المجموع</th></tr><tr><td>الدرجة</td>'+''.join('<td>%d</td>'%s[1] for s in secs)+'<td>20</td></tr></table>'
    b='';c=1
    for i,(t,m,items) in enumerate(secs):
        b+='<h2>السؤال %s: %s <span class="m">(%d)</span></h2>'%(names[i],t,m)
        for fn,x in items:b+=fn(x,c,solved);c+=1
    return '<div class="pg">%s%s<div class="ed">انتهت الأسئلة · مع تمنياتنا لكِ بالتوفيق والنجاح</div><div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077"><span dir="ltr">966580908077</span></a></div></div>'%(head,b)
CSS=open('/home/user/lugha/gen.py',encoding='utf8').read().split("CSS='''")[1].split("'''")[0] if os.path.exists('/home/user/lugha/gen.py') else open(os.path.join(HERE,'common.css'),encoding='utf8').read()
CSS+='''.bx{display:inline-block;border:2px solid #000;border-radius:6px;min-width:34px;height:24px;text-align:center;vertical-align:middle}.bx.ok{font-weight:800;text-decoration:underline}.fig{text-align:center}.fig img{max-height:150px;max-width:75%;border:1.5px solid #000}.ans{border:2px solid #000;border-radius:8px;padding:1px 10px;margin:3px 0}'''
open(os.path.join(HERE,'common.css'),'w',encoding='utf8').write(CSS)
def doc(pages):return '<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>%s</style><body>%s</body></html>'%(CSS,''.join(pages))
if __name__=='__main__':
    print({c:(len(TF[c]),len(MC[c]),len(WP[c]),len(MW[c])) for c in (3,4)})
