# -*- coding: utf-8 -*-
import sys,random,html as H_
sys.path.insert(0,'.')
exec(open('bank.py',encoding='utf8').read().replace('print(len(MCQ)','#').replace("for k,v in [('MCQ'","for k,v in []:#"))
LET='أبجد'
BANK='المنطقة الحيوية – شبكة غذائية – تنقرض – الموطن – المستهلكات – النظام البيئي – المنتجات – التلوث – الوراثة – المواءمة – إعادة الاستخدام'
CSS='''
@font-face{font-family:B;font-weight:700;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-700.ttf')}
@font-face{font-family:B;font-weight:800;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-800.ttf')}
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:B,sans-serif;font-weight:700;color:#1d1a24;font-size:15.5px;line-height:1.7}
.pg{width:794px;min-height:1123px;padding:26px 38px 44px;position:relative;page-break-after:always;overflow:hidden}
.hd{border:3px solid #222;border-radius:12px;padding:6px 14px;display:flex;justify-content:space-between;align-items:center;font-size:14px;line-height:1.55}
.hd .c{text-align:center;font-size:17px}.green{background:#d8f2d0;border:2.5px solid #2f9e44;border-radius:10px;text-align:center;margin:6px 0;padding:2px;font-size:14px}
h2{break-after:avoid;font-size:21px;margin:10px 0 2px;background:#eee;border-radius:8px;padding:2px 12px}.hint{break-after:avoid;font-size:13.5px;color:#444;margin:0 0 4px}
.q{margin:7px 0;page-break-inside:avoid}.q .n{display:inline-block;min-width:26px;font-weight:800}
.op{display:inline-block;width:49%;padding:0 4px}.op.ok{background:#c8f0c0;border-radius:6px;font-weight:800}
.tf{display:inline-block;border:2px solid #222;border-radius:8px;padding:0 12px;margin-right:8px}.tf.ok{background:#c8f0c0}
.fig{text-align:center}.fig img{max-height:190px;max-width:70%;border:2px solid #aaa;border-radius:8px}
.ans{background:#e3f6dc;border:2px solid #2f9e44;border-radius:8px;padding:2px 10px;margin-top:3px;font-size:14.5px}
.ln{border-bottom:2px dotted #666;height:26px}.bank{border:2px dashed #555;border-radius:8px;padding:2px 10px;margin:3px 0;font-size:14px}
.src{font-size:11.5px;color:#666}.sum{background:#fff6d6;border:3px solid #e0a800;border-radius:14px;padding:6px 18px;margin:8px 0}
.sum li{margin:5px 0}.ft{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:11px;color:#555}
.step{background:#e4efff;border:3px solid #3b8fd9;border-radius:14px;padding:8px 16px;margin:8px 0}
'''
def esc(s):return s
def header(title,sub):
    return '<div class="hd"><div>المملكة العربية السعودية<br>وزارة التعليم</div><div class="c">%s<br><span style="font-size:14px">%s</span></div><div>اسم الطالبة: ........................<br>الشعبة: ........ &nbsp; الدرجة: ...... / ......</div></div><div class="green">🌷 الاختبار يحسب درجتكِ لا سرعتكِ: اقرئي السؤال جيداً مرتين، وتأكدي من إجابتك</div>'%(title,sub)
def foot():return '<div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077" style="color:inherit;text-decoration:none"><span dir="ltr">966580908077</span></a></div>'
def mcq(q,n,solved):
    h='<div class="q"><span class="n">%d)</span> %s'%(n,q['t'])
    if q.get('fig'):h+='<div class="fig"><img src="%s"></div>'%q['fig']
    h+='<br>'+''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and i==q['a'] else '',LET[i],o) for i,o in enumerate(q['o']))
    if solved:h+='<div class="src">الإجابة: %s) %s · المصدر: %s</div>'%(LET[q['a']],q['o'][q['a']],q['src'])
    return h+'</div>'
def tf(q,n,solved):
    ok=q['a']
    return '<div class="q"><span class="n">%d)</span> %s &nbsp; <span class="tf%s">✓ صح</span><span class="tf%s">✗ خطأ</span>%s</div>'%(n,q['t'],' ok' if solved and ok else '',' ok' if solved and not ok else '','' if not solved else ' <span class="src">(%s)</span>'%q['src'])
def fig(q,n,solved):
    h='<div class="q"><span class="n">%d)</span> %s<div class="fig"><img src="%s"></div>'%(n,q['t'],q['img'])
    if q['opts']:
        h+=''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and q['ans'].replace(' ','').endswith(o.replace(' ','')) and i==[j for j,x in enumerate(q['opts']) if q['ans'].replace(' ','').endswith(x.replace(' ',''))][0] else '',LET[i],o) for i,o in enumerate(q['opts']))
    elif not solved:h+='<div class="ln"></div><div class="ln"></div>'
    if solved:
        h+='<div class="ans">✔ %s</div>'%q['ans']
        if q.get('ans_img'):h+='<div class="fig"><img src="%s"></div>'%q['ans_img']
        h+='<div class="src">المصدر: %s</div>'%q['src']
    return h+'</div>'
def corr(q,n,solved):
    return '<div class="q"><span class="n">%d)</span> %s &nbsp; ← الكلمة الصحيحة: %s</div>'%(n,q['t'],('<span class="ans" style="display:inline">%s</span>'%q['a']) if solved else '..............')
def fill(q,n,solved):
    t=q['t'];
    return '<div class="q"><span class="n">%d)</span> %s%s</div>'%(n,t,(' <span class="ans" style="display:inline">%s</span>'%q['a']) if solved else '')
def ess(q,n,solved):
    h='<div class="q"><span class="n">%d)</span> %s <span class="src">(%s)</span>'%(n,q['t'],'درجتان' if q['pts']==2 else 'درجة')
    h+=('<div class="ans">✔ %s</div>'%q['a']) if solved else '<div class="ln"></div><div class="ln"></div>'
    return h+'</div>'
def section(title,hint,items,fn,solved,start=1,extra=''):
    if not items:return '',start
    h='<h2>%s</h2><div class="hint">%s</div>%s'%(title,hint,extra)
    for k,q in enumerate(items):h+=fn(q,start+k,solved)
    return h,start+len(items)
def exam(l,solved,pool=None,title=None):
    names=['الأول','الثاني','الثالث','الرابع']
    P=pool or dict(M=[q for q in MCQ if q['l']==l],T=[q for q in TF if q['l']==l],F=[q for q in FIG if q['l']==l],C=[q for q in CORR if q['l']==l],B=[q for q in FILL if q['l']==l],E=[q for q in ESS if q['l']==l])
    ttl=title or '%s (%s)'%LES[l]
    body=header('اختبار الفترة الثانية — العلوم — الصف الرابع الابتدائي',ttl+(' — الإجابات' if solved else ''))
    n=1
    s,n=section('السؤال الأول: اختاري الإجابة الصحيحة','اقرئي السؤال ثم ضعي دائرة حول الحرف الصحيح.',P['M'],mcq,solved);body+=s
    s,n=section('السؤال الثاني: ضعي علامة ✓ أو ✗','✓ إذا كانت الجملة صحيحة، و✗ إذا كانت خاطئة.',P['T'],tf,solved,1);body+=s
    s,n=section('السؤال الثالث: الرسومات','انظري إلى الصورة جيداً ثم أجيبي.',P['F'],fig,solved,1);body+=s
    s2,n=section('السؤال الرابع: صوّبي الكلمة التي تحتها خط','اكتبي الكلمة الصحيحة مكان الكلمة التي تحتها خط.',P['C'],corr,solved,1);body+=s2
    bank=[q for q in P['B']]
    s3,n=section('السؤال الخامس: أكملي','اكتبي الكلمة المناسبة في الفراغ (يمكنك الاستعانة ببنك الكلمات).',bank,fill,solved,1,'<div class="bank">بنك الكلمات: %s</div>'%BANK if any(q['bank'] for q in bank) else '');body+=s3
    s4,n=section('السؤال السادس: مقالي قصير','أجيبي بجملة أو جملتين.',P['E'],ess,solved,1);body+=s4
    return '<div class="pg">%s%s</div>'%(body,foot())
def overview(solved):
    return '<div class="pg"><h1 style="font-size:30px;margin:6px 0">📘 الفصل الثالث: استكشاف الأنظمة البيئية</h1><div class="hint">كتاب العلوم · رابع ابتدائي · ص 96–137 · اختبار الفترة الثانية · %s</div><div class="step"><b>كيف أراجع وأخرج وأنا عارفة؟</b><br>1) أقرأ <b>الدرس من كتابي</b> مرة واحدة بتأنٍّ، ثم أقرأ «ما يجب أن أعرفه» في ورقة الدرس.<br>2) أغلق الكتاب وأجيب عن الأسئلة <b>من ذاكرتي</b> بالقلم.<br>3) أفتح وأصحح، وأضع علامة على ما أخطأت فيه.<br>4) أعيد <b>الأخطاء فقط</b> بعد ساعة، ثم مساءً، ثم بعد يومين.<br>5) آخر خطوة: الاختبار الشامل في آخر الملف.</div><div class="step" style="background:#fff6d6;border-color:#e0a800"><b>ما في هذا الملف:</b><br>• ثلاث أوراق (لكل درس): ما يجب أن أعرفه، ثم اختبار بنفس شكل الفترة الثانية.<br>• اختبار شامل مخلوط الترتيب من الدروس الثلاثة.<br>• أنواع الأسئلة: اختيار من متعدد، صح وخطأ، رسومات، صوّبي، أكملي، ومقالي قصير.<br>• مصادر الأسئلة: مذكرة المعلم هشام فرغلي (تدريباته)، والاختبارات المركزية (تجميع موضي الحربي ونماذج الفترة الثانية). وتحت كل سؤال في ورقة الإجابات مصدره.</div><div class="step" style="background:#e3f6dc;border-color:#2f9e44">⚠️ هذه مساعدة بسيطة، والمرجع هو الكتاب ومعلمتك. إن اختلف السؤال أو الإجابة عن كتابك فالصحيح ما في الكتاب.</div>%s</div>'%('ورقة الإجابات' if solved else 'ورقة الطالبة',foot())
def summary(l):
    return '<div class="pg"><h1 style="font-size:26px;margin:6px 0">⭐ ما يجب أن أعرفه — %s</h1><div class="hint">في كتابي: %s</div><div class="sum"><ol>%s</ol></div><div class="step">بعد أن تقرئي: اغلقي الورقة، وقولي بصوتك أهم 3 أشياء تذكرتها، ثم أجيبي الاختبار.</div>%s</div>'%(LES[l][0],LES[l][1],''.join('<li>%s</li>'%s for s in SUM[l]),foot())
def comp(solved):
    rnd=random.Random(3)
    def pick(lst,k):
        s=lst[:];rnd.shuffle(s);return s[:k]
    P=dict(M=pick(MCQ,14),T=pick(TF,12),F=pick(FIG,3),C=pick(CORR,2),B=pick(FILL,6),E=pick(ESS,6))
    return exam('0',solved,P,'اختبار شامل مخلوط (الدروس 3-1 و3-2 و3-3)')
def build(solved):
    pages=[overview(solved)]
    for l in '123':pages.append(summary(l));pages.append(exam(l,solved))
    pages.append(comp(solved))
    return '<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>%s</style><body>%s</body></html>'%(CSS,''.join(pages))
for s,nm in((False,'student'),(True,'solved')):
    open('ch3_%s.html'%nm,'w',encoding='utf8').write(build(s))
print('built')
