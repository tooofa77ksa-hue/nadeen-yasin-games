import os, sys
from PIL import Image

SRC = '/tmp/mq/x/word/media/'
OUT = '/tmp/mq/gray/'
os.makedirs(OUT, exist_ok=True)
for i in range(1, 10):
    im = Image.open(f'{SRC}image{i}.png').convert('L')
    # raise contrast a little for black & white printing
    im = im.point(lambda v: 255 if v > 245 else int(v * 0.95))
    im.save(f'{OUT}g{i}.png')

CSS = """@font-face{font-family:'B';font-weight:500;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-Medium.ttf')}
@font-face{font-family:'B';font-weight:800;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf')}
@page{size:A4;margin:11mm 12mm}
*{box-sizing:border-box}
body{font-family:'B',sans-serif;font-weight:500;color:#000;font-size:13px;margin:0;line-height:1.45}
.hd{border:2px solid #000;border-radius:6px;padding:6px 12px;display:flex;justify-content:space-between;margin-bottom:8px}
.hd b{font-weight:800}
.q{border-bottom:1.5px solid #000;padding:4px 0 6px;margin:0}
.q:last-child{border-bottom:none}
.qt{font-weight:800}
.row{display:flex;gap:14px;align-items:flex-start}
.row>div{flex:1}
img{max-width:100%}
table.t{border-collapse:collapse;width:100%}
table.t td,table.t th{border:1.5px solid #000;padding:5px 8px;text-align:center}
.mc{display:flex;gap:18px;margin:2px 0 6px}
.dot{border-bottom:1.5px dotted #000;height:18px;margin:3px 0}
.pb{page-break-before:always}
.ans{font-weight:800}
.ak td{vertical-align:top;text-align:right}
.note{font-size:12px}
"""

def tab_q1():
    rows = ''.join(f'<tr><td>{n}</td><td></td><td></td></tr>' for n in ['كرة القدم', 'الرسم', 'السباحة', 'القراءة'])
    return f'<table class="t"><tr><th>الفطيرة</th><th>الإشارات</th><th>التكرار</th></tr>{rows}</table>'

def questions():
    g = lambda i, w=None: f'<img src="file://{OUT}g{i}.png"' + (f' style="width:{w}px"' if w else '') + '>'
    return f'''
<div class="hd"><div><b>اختبار الفصل الثالث</b> · الرياضيات · الصف الرابع</div><div>الاسم: ................................... الصف: ........</div></div>
<div class="q"><div class="qt">س١) أُجري مسح حول نشاطات الطلاب في أوقات فراغهم على النحو التالي. نظّمي البيانات في لوحة إشارات وتكرار:</div>
<div class="row"><div>{g(1,250)}</div><div>{tab_q1()}</div></div></div>
<div class="q"><div class="qt">س٢) أستعمل التمثيل المجاور وأختار الإجابة الصحيحة:</div>
<div class="row"><div>{g(3,270)}</div><div>
<div>ما العدد الكلي للطلاب الذين شملهم المسح؟</div><div class="mc"><span>أ) ٥</span><span>ب) ١٨</span><span>جـ) ١٩</span><span>د) ٢٠</span></div>
<div>أيُّ مكان فضّله أقل عدداً من الطلاب؟</div><div class="mc"><span>أ) الباحة</span><span>ب) أبها</span><span>جـ) الطائف</span><span>د) الخبر</span></div>
<div>ما عدد الطلاب الذين قالوا إن الباحة هي المكان المفضّل لقضاء الإجازة؟</div><div class="mc"><span>أ) ٢</span><span>ب) ٣</span><span>جـ) ٤</span><span>د) ٥</span></div>
</div></div></div>
<div class="q"><div class="qt">س٣) الشكل المجاور يمثل عدد الدقائق التي يقضيها خالد أمام التلفاز يومياً. أجيبي عن الآتي:</div>
<div class="row"><div>{g(4,270)}</div><div>
<div>أ) أي يوم يقضي خالد وقتاً أطول في مشاهدة التلفاز؟</div><div class="dot"></div>
<div>ب) أي يوم يقضي خالد وقتاً أقصر في مشاهدة التلفاز؟</div><div class="dot"></div>
</div></div></div>
<div class="q"><div class="qt">س٤) الشكل التالي يمثل وجبة إفطار:</div>
<div class="row"><div>{g(5,190)}</div><div>
<div>أ) ما المشروبان الأكثر تفضيلاً لدى الطلاب في وجبة الإفطار؟</div><div class="dot"></div>
<div>ب) ما المشروبان الأقل تفضيلاً لدى الطلاب في وجبة الإفطار؟</div><div class="dot"></div>
</div></div></div>
<div class="q pb"><div class="qt">س٥) أكمل الفراغات الآتية:</div>
<div class="row" style="margin-top:6px"><div>١) يقضي محمد ٤٠ دقيقة يومياً في ممارسة المشي. عدد الدقائق التي يقطعها في اليوم الرابع:<div class="dot"></div></div><div>{g(6,200)}</div></div>
<div class="row" style="margin-top:8px"><div>٢) اختر كرة زجاجية من الكيس دون النظر إليها، مستعملاً الكلمات (مؤكد، أو أكثر احتمالاً، أو متساوي الإمكانية، أو أقل احتمالاً):<br>خضراء ........................ ، صفراء ........................</div><div>{g(7,120)}</div></div>
<div class="row" style="margin-top:8px"><div>٣) إذا تم تدوير المؤشر، استعمل الأعداد لوصف احتمال الحصول على حرف من كلمة (سعودي):<div class="dot"></div></div><div>{g(8,140)}</div></div></div>
<div class="q"><div class="qt">س٦) ضع صح أو خطأ أمام العبارات الآتية:</div>
<table class="t" style="margin-top:6px"><tr><td style="text-align:right">١) يمكن تنظيم البيانات في لوحة الإشارات فقط</td><td style="width:70px">( )</td></tr>
<tr><td style="text-align:right">٢) يوضح التمثيل بالخطوط تغيّر مجموعة من البيانات مع مرور الزمن</td><td>( )</td></tr>
<tr><td style="text-align:right">٣) صندوق يحتوي على عشر بطاقات مرقمة من ١ إلى ١٠: احتمال سحب بطاقة عليها عدد أكبر من ١٠ مؤكد</td><td>( )</td></tr>
<tr><td style="text-align:right">٤) تسمى فرصة الحصول على ناتج المسح</td><td>( )</td></tr></table></div>
<div class="q"><div class="qt">س٧) مثّل كل من أحمد وسعد نتائج استطلاع رأي ٦ طلاب حول اللون المفضل لديهم. أيهما كان تمثيله صحيحاً؟ أذكر السبب؟</div>
<div style="text-align:center;margin:6px 0">{g(9,430)}</div><div class="dot"></div><div class="dot"></div></div>
<div class="note" style="text-align:left;direction:ltr;margin-top:2px">أ/ نعيمة العتيبي</div>
'''

def answers():
    return '''
<div class="pb"></div>
<div class="hd"><div><b>ورقة الإجابات النموذجية</b> · اختبار الفصل الثالث · الرياضيات · الصف الرابع</div><div>للمعلمة / ولي الأمر</div></div>
<table class="t ak">
<tr><th style="width:55px">السؤال</th><th>الإجابة النموذجية</th><th style="width:36%">التوضيح</th></tr>
<tr><td><b>س١</b></td><td>كرة القدم: ||||  = ٤<br>الرسم: |||  = ٣<br>السباحة: |||| (٥ بالخط المائل)  = ٥<br>القراءة: |||  = ٣</td><td>نعدّ كل نشاط في القائمة (١٥ إجابة: ٤ + ٣ + ٥ + ٣)، ونرسم إشارة لكل إجابة، والتكرار هو عدد الإشارات.</td></tr>
<tr><td><b>س٢</b></td><td>١) <b>جـ) ١٩</b><br>٢) <b>د) الخبر</b><br>٣) <b>أ) ٢</b></td><td>الطائف ٧ + الباحة ٢ + أبها ٩ + الخبر ١ = ١٩. أقصر عمود: الخبر (١). عمود الباحة = ٢.</td></tr>
<tr><td><b>س٣</b></td><td>أ) <b>الخميس</b> (نحو ١٥٠ دقيقة)<br>ب) <b>الثلاثاء</b> (نحو ٣٠ دقيقة)</td><td>أعلى نقطة على الخط هي الخميس، وأدنى نقطة هي الثلاثاء.</td></tr>
<tr><td><b>س٤</b></td><td>أ) <b>الحليب</b> (٢٠) و<b>عصير البرتقال</b> (١٠)<br>ب) <b>عصير التفاح</b> (٦) و<b>الماء</b> (٤)</td><td>أكبر قطاعين للأكثر تفضيلاً، وأصغر قطاعين للأقل تفضيلاً.</td></tr>
<tr><td><b>س٥</b></td><td>١) <b>١٦٠ دقيقة</b><br>٢) خضراء: <b>أقل احتمالاً</b><br>&nbsp;&nbsp;&nbsp;صفراء: <b>أكثر احتمالاً</b><br>٣) <b>٥ من ٥</b> (مؤكد)</td><td>١) يزيد ٤٠ كل يوم: ٤٠، ٨٠، ١٢٠، ١٦٠.<br>٢) في الكيس: ١ خضراء، ٣ حمراء، ٦ صفراء (١٠ كرات).<br>٣) حروف المؤشر الخمسة (س، ع، و، د، ي) هي حروف كلمة «سعودي».</td></tr>
<tr><td><b>س٦</b></td><td>١) <b>خطأ</b><br>٢) <b>صح</b><br>٣) <b>خطأ</b><br>٤) <b>خطأ</b></td><td>١) هناك طرق أخرى: جدول تكراري، أعمدة، خطوط، قطاعات.<br>٣) سحب عدد أكبر من ١٠ <b>مستحيل</b>.<br>٤) تسمى فرصة الحصول على ناتج: <b>الاحتمال</b>.<br><span class="note">(العبارة ٤ غير مكتملة في الورقة الأصلية، فأُجيب خطأ؛ تُراجَع مع المعلمة.)</span></td></tr>
<tr><td><b>س٧</b></td><td><b>سعد</b></td><td>عدد الطلاب ٦، فقسّم سعد الدائرة إلى ٦ أجزاء متساوية (٢ + ٣ + ١ = ٦ أي ٦/٦ = ١). أما أحمد فجعل المقام ٨ ومجموع كسوره ٦/٨ وهو أقل من ١.</td></tr>
</table>
<div class="note" style="margin-top:8px">أ/ نعيمة العتيبي · الإجابات من الرسومات المرفقة في الاختبار.</div>
'''

def doc(body):
    return f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'

open('/tmp/mq/test_q.html', 'w', encoding='utf-8').write(doc(questions()))
open('/tmp/mq/test_qa.html', 'w', encoding='utf-8').write(doc(questions() + answers()))
print('ok')
