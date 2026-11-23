# -*- coding: utf-8 -*-
import random,sys
# ===== بنوك الأسئلة (بسيطة، من قواعد الكتاب: الفاعل مرفوع ضمة، المفعول به منصوب فتحة، المبتدأ والخبر مرفوعان، الاسم المجرور كسرة)
PAST_T=[('فتحَ','الولدُ','البابَ'),('شربَ','الطفلُ','الحليبَ'),('حملَ','العاملُ','الصندوقَ'),('سمعَ','التلميذُ','الشرحَ'),('حفظَ','الطالبُ','الدرسَ'),('كتبَ','المعلمُ','الواجبَ'),('قرأَ','الطالبُ','الكتابَ'),('زرعَ','الفلاحُ','القمحَ'),('غسلَ','الولدُ','الوجهَ'),('رسمَ','الطفلُ','الشجرةَ')]
PRES_T=[('يفتحُ','الولدُ','البابَ'),('يشربُ','الطفلُ','الماءَ'),('يحملُ','العاملُ','الحقيبةَ'),('يسمعُ','التلميذُ','الشرحَ'),('يحفظُ','الطالبُ','الدرسَ'),('يكتبُ','المعلمُ','الدرسَ'),('يقرأُ','الطالبُ','القصةَ'),('يزرعُ','الفلاحُ','الشجرةَ')]
PAST_I=[('نامَ','الطفلُ'),('وصلَ','مشعلٌ'),('جلسَ','الضيفُ'),('ركضَ','الولدُ'),('ضحكَ','الطفلُ'),('حضرَ','المعلمُ'),('سافرَ','الأبُ'),('نجحَ','الطالبُ')]
PRES_I=[('يلعبُ','الطفلُ'),('يسافرُ','الأبُ'),('يحضرُ','المعلمُ'),('ينامُ','الولدُ'),('يجلسُ','الضيفُ'),('يركضُ','الطفلُ')]
IMP=[('اكتبْ','الدرسَ'),('افتحْ','البابَ'),('احفظْ','الدرسَ'),('اشربْ','الماءَ'),('اقرأْ','الكتابَ'),('اسمعْ','الشرحَ')]
NOM=[('الجوُّ','جميلٌ'),('الطالبُ','مجتهدٌ'),('الحديقةُ','واسعةٌ'),('الكتابُ','مفيدٌ'),('الماءُ','باردٌ'),('السماءُ','صافيةٌ'),('الأمطارُ','غزيرةٌ'),('المعلمةُ','نشيطةٌ'),('التفاحةُ','لذيذةٌ'),('البيتُ','نظيفٌ')]
JAR=[('ذهبَ الولدُ إلى المدرسةِ.','إلى','المدرسةِ'),('جلسَ الطفلُ على الكرسيِّ.','على','الكرسيِّ'),('وصلَ الضيفُ إلى البيتِ.','إلى','البيتِ'),('سافرَ الأبُ من المدينةِ.','من','المدينةِ'),('الكتابُ في الحقيبةِ.','في','الحقيبةِ'),('نظرَ الولدُ إلى السماءِ.','إلى','السماءِ'),('خرجَ الطفلُ من البيتِ.','من','البيتِ'),('لعبَ الأولادُ في الحديقةِ.','في','الحديقةِ')]
# إملاء: (السؤال, [خيارات], رقم الصحيح, السبب)
IMLA=[('الكلمة التي بها همزة قطع في: «أكرمَ المعلمُ التلميذَ»',['أكرمَ','المعلمُ','التلميذَ'],0,'«أكرم» تبدأ بهمزة قطع (أ)، وتُنطق دائماً في أول الكلام.'),
 ('الكلمة المكتوبة بالتاء الصحيحة:',['المنطقت','المنطقة','المنطقه'],1,'«المنطقة» اسم مؤنث ينتهي بتاء مربوطة (ة).'),
 ('الكلمة المكتوبة كتابة صحيحة:',['هاذا','هذا','هذأ'],1,'نكتب «هذا» بحذف الألف من وسطها.'),
 ('الكلمة المكتوبة كتابة صحيحة:',['لاكن','لكن','لكنّا'],1,'نكتب «لكن» بحذف الألف من وسطها.'),
 ('الكلمة المكتوبة بالتاء الصحيحة:',['السبة','السبت','السبه'],1,'«السبت» تاء مفتوحة لأن قبلها حرفاً ساكناً صحيحاً (الباء).'),
 ('الكلمة التي بها همزة وصل في: «اقرأ الكتابَ»',['اقرأ','الكتابَ','ليس فيها'],0,'«اقرأ» فعل أمر، همزته همزة وصل لا تُنطق إذا وصلنا الكلام.'),
 ('الكلمة المكتوبة كتابة صحيحة:',['ذالك','ذلك','ذلكا'],1,'نكتب «ذلك» بحذف الألف من وسطها.'),
 ('الكلمة المكتوبة كتابة صحيحة:',['هؤلاء','هاؤلاء','هؤلاأ'],0,'نكتب «هؤلاء» بحذف الألف بعد الهاء.'),
 ('الكلمة المكتوبة بالتاء الصحيحة:',['سيارت','سيارة','سياره'],1,'«سيارة» اسم مؤنث ينتهي بتاء مربوطة (ة).'),
 ('الكلمة التي بها همزة قطع في: «أخذَ أحمدُ الكتابَ»',['أخذَ','الكتابَ','ليس فيها'],0,'«أخذ» همزتها همزة قطع.'),
 ('الكلمة المكتوبة كتابة صحيحة:',['يخطئ','يخطيء','يخطئء'],0,'نكتب «يخطئ» الهمزة على نبرة لأن قبلها كسرة.'),
 ('الكلمة المكتوبة بالتاء الصحيحة:',['وقة','وقت','وقه'],1,'«وقت» تاء مفتوحة لأن قبلها حرفاً ساكناً صحيحاً (القاف).')]
COPY=['اجعل غذاءك دواءك.','حُسْنُ الْخَطِّ يَزِيدُ الْحَقَّ وُضُوحًا.','العلمُ نورٌ.','النظافةُ من الإيمانِ.','من جدَّ وجدَ.','الصدقُ منجاةٌ.']
def sent_past(t):return '%s %s %s.'%t
def build(n,solved):
    r=random.Random(n)
    P=lambda L,k,s=0:[L[(n*3+s+i)%len(L)] for i in range(k)]
    body=''
    sc=[]
    # س1 نوع الفعل
    q1=[]
    pa=P(PAST_T,1,0)[0];pr=P(PRES_T,1,2)[0];im=P(IMP,1,1)[0];pi=P(PRES_I,1,0)[0] if n%2 else P(PAST_I,1,0)[0]
    rows=[('%s %s %s.'%pa,pa[0],'فعل ماضٍ'),('%s %s %s.'%pr,pr[0],'فعل مضارع'),('%s %s.'%im,im[0],'فعل أمر'),(('%s %s.'%pi),pi[0],'فعل مضارع' if n%2 else 'فعل ماضٍ')]
    r.shuffle(rows)
    h='<div class="hint">اكتبي نوع الفعل (ماضٍ / مضارع / أمر):</div><table class="t"><tr><th>الجملة</th><th>الفعل</th><th>نوعه</th></tr>'
    for s,v,a in rows:h+='<tr><td>%s</td><td>%s</td><td>%s</td></tr>'%(s,('<b class="a">%s</b>'%v) if solved else '',('<b class="a">%s</b>'%a) if solved else '')
    h+='</table>'
    if solved:h+='<div class="why">لماذا؟ الماضي يقبل تاء المتكلم (كتبتُ)، والمضارع يبدأ بأحد حروف (نأيت) وتدخل عليه «سوف»، والأمر نطلب به عملاً.</div>'
    sc.append(('الفعل وأنواعه',4,h))
    # س2 فاعل ومفعول
    S=[x for x in P(PAST_T,3,4)]
    I=[('%s %s.'%x,x[1]) for x in P(PAST_I,2,1)]
    h='<div class="hint">أ) استخرجي الفاعل من كل جملة:</div><table class="t"><tr><th>الجملة</th><th>الفاعل</th></tr>'
    FA=[('%s %s %s.'%x,x[1]) for x in S[:2]]+I[:1]
    for s,a in FA:h+='<tr><td>%s</td><td>%s</td></tr>'%(s,('<b class="a">%s</b>'%a) if solved else '')
    h+='</table><div class="hint">ب) استخرجي المفعول به من كل جملة:</div><table class="t"><tr><th>الجملة</th><th>المفعول به</th></tr>'
    MA=[('%s %s %s.'%x,x[2]) for x in P(PRES_T,2,n)]
    for s,a in MA:h+='<tr><td>%s</td><td>%s</td></tr>'%(s,('<b class="a">%s</b>'%a) if solved else '')
    h+='</table>'
    if solved:h+='<div class="why">لماذا؟ الفاعل: نسأل بعد الفعل «من؟» ويكون مرفوعاً. المفعول به: نسأل «ماذا؟» ويكون منصوباً (آخره فتحة).</div>'
    sc.append(('الوظيفة النحوية: الفاعل والمفعول به',5,h))
    # س3 إعراب اختياري
    items=[]
    x=P(PAST_T,1,6)[0];items.append(('%s %s %s.'%x,x[1],['فاعل مرفوع وعلامة رفعه الضمة','مفعول به منصوب وعلامة نصبه الفتحة','خبر مرفوع وعلامة رفعه الضمة'],0))
    x=P(PRES_T,1,5)[0];items.append(('%s %s %s.'%x,x[2],['فاعل مرفوع وعلامة رفعه الضمة','مفعول به منصوب وعلامة نصبه الفتحة','اسم مجرور وعلامة جره الكسرة'],1))
    x=P(NOM,1,2)[0];items.append(('%s %s.'%x,x[0],['مبتدأ مرفوع وعلامة رفعه الضمة','خبر مرفوع وعلامة رفعه الضمة','فاعل مرفوع وعلامة رفعه الضمة'],0))
    x=P(NOM,1,7)[0];items.append(('%s %s.'%x,x[1],['مبتدأ مرفوع وعلامة رفعه الضمة','خبر مرفوع وعلامة رفعه الضمة','مفعول به منصوب وعلامة نصبه الفتحة'],1))
    h='<div class="hint">أعربي ما تحته خط (اختاري الإعراب الصحيح):</div>'
    for i,(s,w,o,a) in enumerate(items,1):
        # ضع خطاً تحت الكلمة
        ss=s.replace(w,'<u>%s</u>'%w,1)
        h+='<div class="q"><b>%d)</b> %s<br>%s</div>'%(i,ss,''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and j==a else '','أبج'[j],t) for j,t in enumerate(o)))
    sc.append(('الإعراب',4,h))
    # س4 مبتدأ وخبر + جار ومجرور
    nm=P(NOM,1,1)[0];jr=P(JAR,1,0)[0]
    h='<div class="hint">1) استخرجي المبتدأ والخبر من الجملة: «%s %s.»</div><table class="t"><tr><th>المبتدأ</th><th>الخبر</th></tr><tr><td>%s</td><td>%s</td></tr></table>'%(nm[0],nm[1],('<b class="a">%s</b>'%nm[0]) if solved else '',('<b class="a">%s</b>'%nm[1]) if solved else '')
    h+='<div class="hint">2) استخرجي حرف الجر والاسم المجرور من الجملة: «%s»</div><table class="t"><tr><th>حرف الجر</th><th>الاسم المجرور</th></tr><tr><td>%s</td><td>%s</td></tr></table>'%(jr[0],('<b class="a">%s</b>'%jr[1]) if solved else '',('<b class="a">%s</b>'%jr[2]) if solved else '')
    if solved:h+='<div class="why">لماذا؟ المبتدأ والخبر مرفوعان. والاسم بعد حرف الجر يكون مجروراً وعلامة جره الكسرة.</div>'
    sc.append(('المبتدأ والخبر وحروف الجر',2,h))
    # س5 إملاء
    im=[IMLA[(n*3+i*4)%len(IMLA)] for i in range(3)]
    h='<div class="hint">اختاري الإجابة الصحيحة:</div>'
    for i,(q,o,a,w) in enumerate(im,1):
        h+='<div class="q"><b>%d)</b> %s<br>%s'%(i,q,''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and j==a else '','أبج'[j],t) for j,t in enumerate(o)))
        if solved:h+='<div class="why">لماذا؟ %s</div>'%w
        h+='</div>'
    sc.append(('الظاهرة الإملائية',3,h))
    # س6 رسم كتابي
    c=COPY[n%len(COPY)]
    h='<div class="hint">اكتبي ما يلي بخط النسخ على السطر:</div><div class="cp">%s</div><div class="ln"></div><div class="ln"></div>'%c
    sc.append(('الرسم الكتابي',2,h))
    names=['الأول','الثاني','الثالث','الرابع','الخامس','السادس']
    assert sum(s[1] for s in sc)==20
    head='<div class="hd"><div>المملكة العربية السعودية<br>وزارة التعليم</div><div class="c">المادة: لغتي · الصف الرابع الابتدائي<br>نموذج اختبار الفترة الثانية · الفصل الدراسي الأول 1448هـ<br><b>نموذج %d%s</b></div><div>اسم الطالبة: ................<br>الدرجة: ...... / 20</div></div>'%(n,' — نموذج الإجابة' if solved else '')
    head+='<div class="gn">الاختبار يحسب درجتكِ لا سرعتكِ: اقرئي السؤال جيداً مرتين، وتأكدي من إجابتك</div>'
    head+='<table class="sc"><tr><th>المهارة</th>'+''.join('<th>%s</th>'%t for t,_,_ in sc)+'<th>المجموع</th></tr><tr><td>الدرجة</td>'+''.join('<td>%d</td>'%m for _,m,_ in sc)+'<td>20</td></tr></table>'
    b=''
    for i,(t,m,h) in enumerate(sc):b+='<h2>السؤال %s: %s <span class="m">(%d)</span></h2>%s'%(names[i],t,m,h)
    return '<div class="pg">%s%s<div class="ed">انتهت الأسئلة · مع تمنياتنا لكِ بالتوفيق والنجاح</div><div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077"><span dir="ltr">966580908077</span></a></div></div>'%(head,b)
CSS='''@font-face{font-family:B;font-weight:700;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-700.ttf')}
@font-face{font-family:B;font-weight:800;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-800.ttf')}
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:B,sans-serif;font-weight:700;color:#000;font-size:15.5px;line-height:1.75;background:#fff}
.pg{width:794px;min-height:1123px;padding:26px 40px 46px;position:relative;page-break-after:always}
.hd{border:2.5px solid #000;border-radius:10px;padding:6px 14px;display:flex;justify-content:space-between;align-items:center;font-size:14px;line-height:1.6}.hd .c{text-align:center;font-size:16px}
.gn{border:2px solid #000;border-radius:8px;text-align:center;margin:6px 0;font-size:13.5px}
.sc{border-collapse:collapse;margin:4px auto;font-size:12.5px}.sc td,.sc th{border:1.5px solid #000;padding:1px 8px;text-align:center}
h2{break-after:avoid;font-size:19px;margin:10px 0 3px;border-bottom:2.5px solid #000;padding-bottom:1px}h2 .m{float:left;font-size:15px}
.hint{font-size:14px;margin:3px 0}.t{width:100%;border-collapse:collapse;margin:3px 0}.t td,.t th{border:1.5px solid #000;padding:2px 8px;text-align:center;height:30px}.t th{background:#fff;font-weight:800}
.q{margin:5px 0;break-inside:avoid}.op{display:inline-block;padding:0 3px;margin-left:10px}.op.ok{border:2px solid #000;border-radius:6px;font-weight:800;text-decoration:underline}
.a{border:2px solid #000;border-radius:6px;padding:0 8px;font-weight:800}.why{font-size:13px;border-right:4px solid #000;padding-right:8px;margin:3px 0}
.cp{font-size:22px;text-align:center;margin:4px 0}.ln{border-bottom:1.5px dotted #000;height:34px}.ed{text-align:center;font-size:12px;margin-top:6px}
.ft{position:absolute;bottom:14px;left:0;right:0;text-align:center;font-size:11px}.ft a{color:#000;text-decoration:none}u{text-decoration:underline;text-underline-offset:4px}'''
def doc(pages):return '<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>%s</style><body>%s</body></html>'%(CSS,''.join(pages))
