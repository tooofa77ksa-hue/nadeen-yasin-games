# -*- coding: utf-8 -*-
import json,random,os,re
D=json.load(open('/tmp/masail.json'))
IMG='/home/user/nadeen-yasin-games/nadeen/'
def okop(x):
    if x.get('mode')!='op':return False
    for st in x['steps']:
        a,b,op=st['a'],st['b'],st['op']
        if not isinstance(a,(int,float)) or not isinstance(b,(int,float)):return False
        r={'+':a+b,'−':a-b,'×':a*b,'÷':(a/b if b else None)}[op]
        if r!=st['result']:return False
    return x['steps'][-1]['result']==x['answer_num']
WP3=[x for x in D['masail_ch3w'] if okop(x)];WP4=[x for x in D['masail_ch4'] if okop(x)]
MW=[x for x in D['masail_ch3w']+D['masail_ch4'] if x.get('mode')!='op' and x.get('options') and 'correct_index' in x]
def isT(a):return any(t in a for t in('✓','√','صح','صواب')) and not any(t in a for t in('✗','خطأ'))
def isF(a):return any(t in a for t in('✗','خطأ'))
def pool(key):
    g=[y for gg in D[key] for y in gg['items']]
    tf=[x for x in g if not x['options'] and (isT(x['answer']) or isF(x['answer'])) and len(x['text'])<130]
    tf+=[x for x in g if x['options'] and set(o.strip() for o in x['options'])=={'صواب','خطأ'}]
    mc=[x for x in g if len(x['options'])>=3 and 0<=x['ci']<len(x['options']) and len(x['text'])<150 and not any(w in x['options'][0] for w in ('صواب',))]
    return tf,mc
TF3,MC3=pool('masail_ch3');TF4,MC4=pool('masail_ch4_exam')
def tfval(x):
    if x['options']:return x['answer'].strip().startswith('صواب')
    return isT(x['answer']) and not isF(x['answer'])
print(len(WP3),len(WP4),len(MW),len(TF3),len(MC3),len(TF4),len(MC4))
AR='٠١٢٣٤٥٦٧٨٩'
def ar(n):
    s=('%g'%n) if isinstance(n,float) else str(n);return ''.join(AR[int(c)] if c.isdigit() else c for c in s)
def fig(x,solved):
    p=x.get('img')
    if p and os.path.exists(IMG+p):return '<div class="fig"><img src="file://%s%s"></div>'%(IMG,p)
    return ''
def mcq(x,i,solved):
    o=x['options'];ci=x['ci']
    h='<div class="q"><b>%d)</b> %s%s<br>'%(i,x['text'],fig(x,solved))
    h+=''.join('<span class="op%s">%s</span>'%(' ok' if solved and j==ci else '',(t if re.match(r'^[أبجد][\)\-]',t) else 'أبجدهوزح'[j]+') '+t)) for j,t in enumerate(o))
    if solved:h+='<div class="why">لماذا؟ %s</div>'%(x['explain'].get('why') or ' '.join(x['explain'].get('steps',[])[:2]) if isinstance(x.get('explain'),dict) else '')
    return h+'</div>'
def tfq(x,i,solved):
    t=tfval(x);txt=x['text']
    h='<div class="q"><b>%d)</b> %s &nbsp;<span class="bx%s">%s</span>'%(i,txt,' ok' if solved else '',('✓' if t else '✗') if solved else '')
    if solved and isinstance(x.get('explain'),dict) and x['explain'].get('why'):h+='<div class="why">لماذا؟ %s</div>'%x['explain']['why']
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
def pick(L,n,k,off=0):return [L[(n*k+off+i*1)%len(L)] for i in range(k)]
def model(n,solved):
    r=random.Random(n)
    secs=[('ضعي علامة ✓ أمام العبارة الصحيحة وعلامة ✗ أمام العبارة الخاطئة',6,[(tfq,x) for x in pick(TF3,n,2)+pick(TF4,n,4,1)]),
          ('اختاري الإجابة الصحيحة',8,[(mcq,x) for x in pick(MC3,n,5)+pick(MC4,n,3,2)]),
          ('حلي المسائل الآتية (اكتبي العملية ثم الجواب)',6,[(wp,x) for x in pick(WP3,n,2)+pick(WP4,n,3,1)]+[(wpm,pick(MW,n,1)[0])])]
    names=['الأول','الثاني','الثالث']
    head='<div class="hd"><div>المملكة العربية السعودية<br>وزارة التعليم</div><div class="c">المادة: الرياضيات · الصف الرابع الابتدائي<br>اختبار الفترة الثانية · الفصل الدراسي الأول 1448هـ · الفصلان 3 و4<br><b>نموذج %d%s</b></div><div>اسم الطالبة: ................<br>الدرجة: ...... / 20</div></div><div class="gn">الاختبار يحسب درجتكِ لا سرعتكِ: اقرئي السؤال جيداً مرتين، وتأكدي من إجابتك</div>'%(n,' — نموذج الإجابة' if solved else '')
    head+='<table class="sc"><tr><th>السؤال</th>'+''.join('<th>%s</th>'%names[i] for i in range(3))+'<th>المجموع</th></tr><tr><td>الدرجة</td>'+''.join('<td>%d</td>'%s[1] for s in secs)+'<td>20</td></tr></table>'
    b='';c=1
    for i,(t,m,items) in enumerate(secs):
        b+='<h2>السؤال %s: %s <span class="m">(%d)</span></h2>'%(names[i],t,m);
        for fn,x in items:
            b+=fn(x,c if i!=0 else c,solved);c+=1
    return '<div class="pg">%s%s<div class="ed">انتهت الأسئلة · مع تمنياتنا لكِ بالتوفيق والنجاح</div><div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077"><span dir="ltr">966580908077</span></a></div></div>'%(head,b)
CSS=open('/home/user/lugha/gen.py',encoding='utf8').read().split("CSS='''")[1].split("'''")[0]+'''.bx{display:inline-block;border:2px solid #000;border-radius:6px;min-width:34px;height:24px;text-align:center;vertical-align:middle}.bx.ok{font-weight:800;text-decoration:underline}.fig{text-align:center}.fig img{max-height:150px;max-width:75%;border:1.5px solid #000}.ans{border:2px solid #000;border-radius:8px;padding:1px 10px;margin:3px 0}'''
for solved,nm in((False,'student'),(True,'solved')):
    open('math_%s.html'%nm,'w',encoding='utf8').write('<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>%s</style><body>%s</body></html>'%(CSS,''.join(model(n,solved) for n in range(1,7))))
print('ok')
