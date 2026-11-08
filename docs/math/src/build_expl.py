CSS = """@font-face{font-family:'B';font-weight:500;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-Medium.ttf')}
@font-face{font-family:'B';font-weight:800;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf')}
@page{size:A4;margin:11mm 13mm}
*{box-sizing:border-box}
body{font-family:'B',sans-serif;font-weight:500;color:#000;font-size:14px;margin:0;line-height:1.55}
h1{font-size:21px;font-weight:800;margin:0;text-align:center}
.sub{text-align:center;margin:2px 0 8px;font-size:13px}
.hd{border:2px solid #000;border-radius:6px;padding:6px 12px;margin-bottom:8px;text-align:center}
.q{border:1.5px solid #000;border-radius:8px;padding:6px 10px;margin:7px 0;page-break-inside:avoid}
.qh{font-weight:800;font-size:15px;border-bottom:1.5px solid #000;margin-bottom:4px}
.a{font-weight:800}
.l{margin:2px 0}
.tip{border:1.5px dashed #000;border-radius:8px;padding:5px 10px;margin:6px 0;font-size:13px}
ul{margin:2px 0;padding-right:20px}
"""

def q(title, body):
    return f'<div class="q"><div class="qh">{title}</div>{body}</div>'

body = f'''
<div class="hd"><h1>اختبار الفصل الثالث: تنظيم البيانات وعرضها وتفسيرها</h1>
<div class="sub">الرياضيات · الصف الرابع · الإجابات مع الشرح</div></div>
<div class="tip"><b>يا نادين،</b> اقرئي كل إجابة مع سبب اختيارها. أول شيء نفعله دائماً: <b>نقرأ الرسم بهدوء</b>، ثم نعدّ أو نقارن، ثم نكتب الجواب.</div>

{q('س١) لوحة الإشارات والتكرار', """
<div class="l">نقرأ قائمة النشاطات ونعدّ كل نشاط، ونرسم إشارة واحدة لكل مرة:</div>
<ul>
<li><span class="a">كرة القدم:</span> ظهرت ٤ مرات، فنرسم <b>||||</b> والتكرار <span class="a">٤</span>.</li>
<li><span class="a">الرسم:</span> ظهر ٣ مرات، فنرسم <b>|||</b> والتكرار <span class="a">٣</span>.</li>
<li><span class="a">السباحة:</span> ظهرت ٥ مرات، فنرسم أربع إشارات وخطاً مائلاً فوقها يجمعها، والتكرار <span class="a">٥</span>.</li>
<li><span class="a">القراءة:</span> ظهرت ٣ مرات، فنرسم <b>|||</b> والتكرار <span class="a">٣</span>.</li>
</ul>
<div class="l"><b>نتأكد:</b> ٤ + ٣ + ٥ + ٣ = ١٥، وهذا عدد الإجابات في القائمة (٥ صفوف × ٣ أعمدة).</div>
""")}

{q('س٢) التمثيل بالأعمدة (المكان المفضل لقضاء الإجازة)', """
<div class="l"><b>١) الجواب: جـ) ١٩.</b> قرأنا ارتفاع كل عمود: الطائف ٧، الباحة ٢، أبها ٩، الخبر ١. ثم جمعنا: ٧ + ٢ + ٩ + ١ = ١٩.</div>
<div class="l"><b>٢) الجواب: د) الخبر.</b> لأن عمود الخبر هو <b>الأقصر</b> (ارتفاعه ١)، وأقل عمود يعني أقل عدد من الطلاب.</div>
<div class="l"><b>٣) الجواب: أ) ٢.</b> لأن عمود الباحة يصل إلى الرقم ٢ على الخط الجانبي.</div>
""")}

{q('س٣) التمثيل بالخطوط (دقائق مشاهدة التلفاز)', """
<div class="l"><b>أ) الجواب: الخميس.</b> لأن نقطة الخميس هي <b>أعلى نقطة</b> على الخط، والأعلى يعني وقتاً أطول (نحو ١٥٠ دقيقة).</div>
<div class="l"><b>ب) الجواب: الثلاثاء.</b> لأن نقطة الثلاثاء هي <b>أدنى نقطة</b> على الخط، والأدنى يعني وقتاً أقصر (نحو ٣٠ دقيقة).</div>
""")}

{q('س٤) التمثيل بالقطاعات (وجبة الإفطار)', """
<div class="l"><b>أ) الأكثر تفضيلاً: الحليب (٢٠) وعصير البرتقال (١٠).</b> لأنهما صاحبا <b>أكبر عددين</b> وأكبر قطاعين في الدائرة.</div>
<div class="l"><b>ب) الأقل تفضيلاً: عصير التفاح (٦) والماء (٤).</b> لأنهما صاحبا <b>أصغر عددين</b> وأصغر قطاعين.</div>
""")}

{q('س٥) أكمل الفراغات', """
<div class="l"><b>١) الجواب: ١٦٠ دقيقة.</b> نلاحظ أن الوقت يزيد ٤٠ كل يوم: ٤٠ ثم ٨٠ ثم ١٢٠. إذن اليوم الرابع: ١٢٠ + ٤٠ = ١٦٠.</div>
<div class="l"><b>٢) الخضراء: أقل احتمالاً. الصفراء: أكثر احتمالاً.</b> عددنا الكرات في الكيس: ١٠ كرات (خضراء واحدة، و٣ حمراء، و٦ صفراء). الخضراء واحدة فقط، فاحتمالها أقل. والصفراء أكثر من كل لون، فاحتمالها أكبر.</div>
<div class="l"><b>٣) الجواب: ٥ من ٥ (مؤكد).</b> على المؤشر ٥ حروف: س، ع، و، د، ي، وهي كلها حروف كلمة «سعودي». فمهما وقف المؤشر نحصل على حرف من الكلمة، أي <b>٥ من ٥</b>.</div>
""")}

{q('س٦) صح أو خطأ', """
<div class="l"><b>١) خطأ.</b> نستطيع تنظيم البيانات بطرق أخرى غير لوحة الإشارات، مثل الجدول والأعمدة والخطوط والقطاعات.</div>
<div class="l"><b>٢) صح.</b> التمثيل بالخطوط يبيّن كيف تتغير البيانات مع مرور الزمن، مثل أيام الأسبوع.</div>
<div class="l"><b>٣) خطأ.</b> البطاقات مرقمة من ١ إلى ١٠، فلا توجد بطاقة عليها عدد أكبر من ١٠. إذن سحبها <b>مستحيل</b> وليس مؤكداً.</div>
<div class="l"><b>٤) خطأ.</b> فرصة حدوث الناتج تسمى <b>الاحتمال</b>.</div>
""")}

{q('س٧) أيهما كان تمثيله صحيحاً؟', """
<div class="l"><b>الجواب: سعد.</b> السبب: عدد الطلاب ٦، فتُقسم الدائرة إلى ٦ أجزاء متساوية.</div>
<div class="l">عند <b>سعد</b>: ٢/٦ + ٣/٦ + ١/٦ = ٦/٦، وهذا يساوي الدائرة كاملة، فتمثيله صحيح.</div>
<div class="l">عند <b>أحمد</b>: ٢/٨ + ٣/٨ + ١/٨ = ٦/٨، وهذا أقل من الدائرة كاملة، فتمثيله خطأ.</div>
""")}

<div class="tip"><b>تذكّري قبل الاختبار:</b>
<ul><li>العمود أو النقطة <b>الأعلى</b> = الأكثر، و<b>الأدنى</b> = الأقل.</li>
<li>عدد الكلّ = نجمع كل الأعمدة أو الأقسام.</li>
<li>الاحتمال: <b>مؤكد</b> (يحدث دائماً)، <b>مستحيل</b> (لا يحدث أبداً)، <b>أكثر احتمالاً</b> أو <b>أقل احتمالاً</b> حسب العدد.</li></ul>
<div style="margin-top:4px">ركّزتِ فوصلتِ بتوفيق الله، والخطأ نتعلم منه.</div></div>
'''

html = f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
open('/tmp/mq/expl.html', 'w', encoding='utf-8').write(html)
print('ok')
