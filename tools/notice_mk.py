# -*- coding: utf-8 -*-
import sys
SUB={
'lugha':("اللغة العربية (لغتي)","✍️","#8E5BD6","#f6f0ff",["فيه نماذج اختبار على <b>القواعد والإملاء</b>: نوع الفعل، الفاعل والمفعول به، المبتدأ والخبر، حروف الجر، والظاهرة الإملائية، والرسم الكتابي.","ليس فيه <b>فهم المقروء</b>، فاقرئي نصوص كتابك وأجيبي عن أسئلتها منه.","القواعد مأخوذة من كتابك: المبتدأ والخبر (ص 77–82)، حروف الجر (ص 84–89)، الفعل وأنواعه (ص 96)، الفاعل والمفعول به (ص 103–110). والجمل أمثلة بسيطة كتبتها أنا."]),
'math':("الرياضيات","📐","#3B8FD9","#eef6ff",[
 "فيه <b>181 سؤالاً مختلفاً</b> من أسئلة الاختبارات المركزية، موزعة على <b>33 درساً من 39</b> في كتاب الرياضيات (الفصول 1–6)، وكل سؤال مربوط بدرسه وصفحته.",
 "لم يأتِ عليها أي سؤال، فهي <b>ناقصة من هذا الملف</b> وعليكِ مراجعتها من الكتاب نفسه:<br>• استقصاء حل المسألة: اختيار الخطة المناسبة (ص 37–38، وكذلك ص 161–162)<br>• مهارة حل المسألة: التقدير أو الإجابة الدقيقة (ص 54–55)<br>• خطة حل المسألة: إنشاء جدول (ص 82–83)<br>• مهارة حل المسألة: تقدير معقولية الإجابة (ص 145–146)<br>• خطة حل المسألة: تمثيل المسألة (ص 183–184)",
 "ليس فيه: «اختبار الفصل» و«الاختبار التراكمي» و«اختبر نفسك» الموجودة في آخر كل فصل بالكتاب، فتدرّبي عليها من الكتاب.",
 "تقرير كامل بالدرس والصفحة: ملف «أين جاءت أسئلة المركزية في كتاب الرياضيات»."]),
'science':("العلوم","🔬","#2FA36B","#eefaf2",[
 "فيه <b>77 سؤالاً مختلفاً</b> من أسئلة المركزية ببعض المناطق، تغطي <b>12 درساً من 12</b>، لكنها تغطي <b>54 صفحة فقط من 108</b> من صفحات الدروس (نحو النصف).",
 "فيه أيضاً 258 سؤال تدريب إضافي، ومكانها في الكتاب <b>تقريبي</b> وليس مضبوطاً.",
 "الصفحات التي ليس عليها أسئلة <b>ناقصة من هذا الملف</b>، فاقرئيها من الكتاب نفسه بعد أن تنهي الأسئلة. وهي مكتوبة لكل درس في ملف «أين جاءت أسئلة المركزية في كتاب العلوم».",
 "ليس فيه: مدخل الفصل والمراجعة والاختبار في آخر كل فصل بالكتاب، فتدرّبي عليها من الكتاب."])}
H='''<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>
@font-face{font-family:B;font-weight:700;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-700.ttf')}
@font-face{font-family:B;font-weight:800;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-800.ttf')}
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:B;font-weight:700;color:#2a2233}
.pg{width:794px;height:1123px;padding:30px 44px;position:relative;background:%(bg)s}
.fr{position:absolute;inset:10px;border:6px solid %(c)s;border-radius:26px}
h1{font-size:34px;margin:6px 0;text-align:center}.sub{text-align:center;font-size:20px}
.b{border:3px solid #2a2233;border-radius:18px;background:#fff;padding:6px 16px;margin:8px 0;font-size:16.5px;line-height:1.7;box-shadow:0 6px 0 rgba(0,0,0,.15)}
.b h2{margin:0 0 4px;font-size:21px}.y{background:#fff3cf}.g{background:#e3f6dc}
.ft{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:12px;color:#555}
</style><body><div class="pg"><div class="fr"></div>
<div style="text-align:center;font-size:44px">%(em)s</div><h1>ملاحظة مهمة قبل أن تبدئي</h1><div class="sub">ملفات %(name)s</div>
<div class="b y"><h2>1) هذا الملف مساعدة بسيطة مني</h2>وليس بديلاً عن الكتاب. <b>لا نعتمد عليه وحده</b>، بل نعتمد على <b>الكتاب</b>، والمرجع هو الكتاب ومعلمتك.</div>
<div class="b g"><h2>2) بعد أن تنتهي من الكتاب، ارجعي لهذا الملف</h2>وانظري: <b>ما الذي وضعته فيه</b>، و<b>ما الذي ناقص</b> منه، لتكملي الناقص من الكتاب.</div>
<div class="b"><h2>ما الذي فيه وما الناقص؟</h2>%(items)s</div>
<div class="b y"><h2>3) قد يكون فيه خطأ أو نقص</h2>إن وجدتِ فرقاً بين هذا الملف والكتاب، فالصحيح <b>ما في الكتاب</b>. وأخبري أمك لتصحّحه.</div>
<div class="b g" style="text-align:center">لا تستعجلي ولا تخافي: المهم أن تفهمي بتأنٍّ، والتوفيق من الله 🌷</div>
<div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077" style="color:inherit;text-decoration:none"><span dir="ltr">966580908077</span></a></div>
</div></body></html>'''
for k,(name,em,c,bg,items) in SUB.items():
    it=''.join('<div style="margin:5px 0">• %s</div>'%i if not i.startswith('تقرير') else '<div style="margin:5px 0">📎 %s</div>'%i for i in items)
    open('%s.html'%k,'w',encoding='utf-8').write(H%dict(name=name,em=em,c=c,bg=bg,items=it))
