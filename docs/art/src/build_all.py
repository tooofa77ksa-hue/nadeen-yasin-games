import sys;sys.path.insert(0,'/tmp/artwork')
from lessons import *
CSS=open('/tmp/artwork/printing.py').read().split('CSS="""')[1].split('"""')[0]
CSS+="""
.steps{display:flex;gap:6px;justify-content:center;align-items:flex-end;flex-wrap:wrap}.fig{text-align:center;font-weight:800;font-size:13px;padding:0 4px}.fig .t{margin-top:2px}
.blank{border:3px dashed #bbb;border-radius:14px;min-height:200px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;padding:8px;background:#fff}
.tip{background:#fff8e6;border:3px dashed #b8895a;border-radius:12px;padding:6px 12px;font-size:14px;margin:8px 0}
.pgtag{color:#888;font-size:12px;text-align:center}"""
def fig(s,t): return f'<div class="fig">{s}<div class="t">{t}</div></div>'
def page(title,sub,need,steps,blank,tip=''):
    return f'<div class="pg"><h1>{title}</h1><p class="s">{sub}</p><div class="b"><h2>المطلوب (من الكتاب)</h2>{need}</div><div class="b"><h2>نموذج للتقليد</h2><div class="steps">{steps}</div></div><div class="b"><h2>جرّبي أنتِ ✏️</h2><div class="blank">{blank}</div></div>{("<div class=tip>"+tip+"</div>") if tip else ""}</div>'
sq=lambda extra='',s=170: svg(s,s,f'<rect x="4" y="4" width="192" height="192" fill="#fff" stroke="{INK}" stroke-width="4"/>{extra}','0 0 200 200')
vax='<line x1="100" y1="4" x2="100" y2="196" stroke="#e0765a" stroke-width="3" stroke-dasharray="7 5"/>'
dia='<line x1="4" y1="4" x2="196" y2="196" stroke="#e0765a" stroke-width="3"/><line x1="196" y1="4" x2="4" y2="196" stroke="#e0765a" stroke-width="3"/>'
pages=[]
# 1
pages.append(page('🎨 مبادئ التكوين الفني','الفنية · الرابع / ٢ · الوحدة الأولى (الرسم) · ص١٥–٢٢','الكتاب يسألك (نشاط ١ و٢ و٣): <b>أي ترتيب أجمل؟ وليش؟</b> وما فيه رسم مطلوب. ولنتدرب: <b>رتّبي أشياء في مستطيل</b> (ص١٥–١٧)، وخلي الشيء <b>الأهم</b> هو الأكبر والأوضح (ص١٨–١٩).',
 fig(comp(False,False).replace('width="300" height="210"','width="170" height="119"'),'ترتيب عشوائي ✗ (ص١٥)')+fig(comp(True,True).replace('width="300" height="210"','width="170" height="119"'),'ترتيب منتظم ✓: الجرة الكبيرة عند تقاطع الخطين')+fig(svg(150,119,jar(60,30,0.9)+bottle(115,50,0.45),'0 0 170 130'),'الشيء المهم أكبر وأوضح (ص١٨)'),
 comp(True,True,True).replace('width="300" height="210"','width="470" height="330"'),
 'خطوات: ١) ارسمي مستطيلاً. ٢) قسّميه بخطين أفقيين وخطين رأسيين (أثلاث). ٣) ضعي الجرة الكبيرة عند تقاطع خطين. ٤) ضعي الزجاجة الصغيرة بعيداً عنها. ٥) لوّني.'))
# 2
pages.append(page('🍎 الضوء والظل والثمار','الفنية · الرابع / ٢ · الوحدة الأولى (الرسم) · ص٢٣–٢٩','<b>نشاط ١ (ص٢٥):</b> ارسمي <b>الدائرة</b> بدون تردد وكرّري. <b>ص٢٨:</b> ارسمي ثمرة (تفاحة) خطوة خطوة ثم لوّنيها. وظلّلي بالتخطيط (ص٢٥).',
 fig(apple(1),'١ دائرة')+fig(apple(2),'٢ خطا المنتصف')+fig(apple(3),'٣ الشكل الرئيسي')+fig(apple(4),'٤ تلوين')+fig(apple(5),'٥ ظل وخطوط'),
 circle_dots()+svg(170,170,'<circle cx="100" cy="100" r="70" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="4 6"/><line x1="100" y1="30" x2="100" y2="170" stroke="#eee"/><line x1="30" y1="100" x2="170" y2="100" stroke="#eee"/>','0 0 200 200')+circle_dots(),
 'ظلّلي الجهة البعيدة عن الضوء بخطوط مائلة (تخطيط)، وارسمي ظلاً صغيراً تحت التفاحة. تقدرين تستعملين الأقلام الرصاص أو الألوان الخشبية.'))
# 3
leaf_blank=svg(200,230,f'<path d="{LEAF}" fill="none" stroke="{INK}" stroke-width="4"/>','20 10 160 190')
pages.append(page('🍃 رسم أوراق الشجر','الفنية · الرابع / ٢ · الوحدة الأولى (الرسم) · ص٣٠–٣٥','<b>نشاط ١ (ص٣٤):</b> لوّني أوراق الشجر بألوانك المفضلة وأبرزي <b>تفاصيل الخطوط</b>. <b>ص٣٣:</b> ارسمي الورقة بالخطوط (التخطيط).',
 fig(leaf(1),'١ شكل الورقة')+fig(leaf(2),'٢ العرق الوسطي')+fig(leaf(3),'٣ العروق الجانبية')+fig(leaf(4),'٤ تلوين'),
 leaf_blank+leaf_blank,'ارسمي ورقة من الحديقة أو من البيت وهي أمامك. وفي موقعك لعبة «مستكشفة الخطوط» تساعدك على الرسم.'))
# 4
pages.append(page('🔷 الزخرفة الهندسية (المحاور)','الفنية · الرابع / ٢ · الوحدة الثانية (الزخرفة) · ص٣٩–٤٤','<b>ص٤٣–٤٤:</b> ارسمي <b>وحدة زخرفية متماثلة</b>: ارسمي الشكل، حدّدي <b>المحور</b>، ارسمي أشكالاً هندسية على النصفين، ثم لوّني.',
 fig(sq(),'١ الشكل (مربع)')+fig(sq(vax),'٢ المحور العمودي')+fig(decor_vert(False,True),'٣ نصف الأشكال')+fig(decor_vert(True),'٤ النصف الثاني + تلوين'),
 sq(vax,190)+svg(190,190,'<circle cx="100" cy="100" r="94" fill="#fff" stroke="'+INK+'" stroke-width="4"/>'+vax,'0 0 200 200')+svg(190,120,'<rect x="4" y="4" width="192" height="92" fill="#fff" stroke="'+INK+'" stroke-width="4"/><line x1="100" y1="4" x2="100" y2="96" stroke="#e0765a" stroke-width="3" stroke-dasharray="7 5"/>','0 0 200 100'),
 'الأشكال اللي ترسمينها في النصف الأيمن تنعكس مثلها في الأيسر: وهذا اسمه <b>التماثل</b>.'))
# 5
pages.append(page('✖️ الأقطار في الزخرفة الهندسية','الفنية · الرابع / ٢ · الوحدة الثانية (الزخرفة) · ص٤٥–٥٠','<b>ص٤٦–٤٧:</b> أ) ارسمي مربعاً. ب) ارسمي <b>الأقطار</b>. ج) ارسمي زخارف على الأقطار. د) لوّني. <b>نشاط ٣ (ص٤٧):</b> وحدة زخرفية بالمحاور والأقطار معاً.',
 fig(sq(),'أ مربع')+fig(sq(dia),'ب الأقطار')+fig(decor_diag(3),'ج د زخارف وتلوين'),
 sq(dia,190)+sq(dia,190)+sq(dia+vax+'<line x1="4" y1="100" x2="196" y2="100" stroke="#e0765a" stroke-width="3" stroke-dasharray="7 5"/>',190),
 'القُطر خط مائل يقسم الشكل لقسمين متطابقين. المربع الثالث فيه المحاور والأقطار معاً (شكل ٦٠).'))
# 6 pottery 1
pages.append(page('🏺 تشكيل أواني بطريقة الحبال','الفنية · الرابع / ٢ · الوحدة الرابعة (الخزف) · ص٧٢–٨٠','الكتاب: <b>تشكيل إناء بالحبال</b> من الطين الصلصال (ص٧٥–٧٧): قاعدة، ثم لفّ الحبل فوق الحافة، ودمج الحبال، وامسحي الخارج. <b>نشاط ٣ (ص٨٠):</b> إناء من جزأين (اختياري).',
 fig(pot(1),'١ قاعدة مفرودة')+fig(pot(2),'٢ نلفّ حبلاً على الحافة')+fig(pot(3),'٣ نبني الجدران بحبال')+fig(pot(4),'٤ ندمج ونمسح الخارج'),
 '<div style="text-align:center;font-size:15px;line-height:1.9;width:100%"><b>عجينة من البيت بدل الطين:</b><br>كوب دقيق + نصف كوب ملح + نصف كوب ماء، اعجنيها حتى تلين.<br>اتركي الإناء ينشف يوماً أو يومين. <b>مو للأكل 🚫</b>، ومع ماما.<br><br><b>ارسمي هنا شكل الإناء اللي تبين تصنعينه:</b></div>',
 'البديل البيتي (عجينة الدقيق والملح) من عندنا، والكتاب يستعمل الطين الصلصال. اسألي المعلمة لو تبينها بالطين.'))
# 7 pottery 2
pages.append(page('🌀 تشكيلات مبتكرة بالحبال','الفنية · الرابع / ٢ · الوحدة الرابعة (الخزف) · ص٨١–٨٩','الابتكار: <b>شكّلي الحبل بأشكال مختلفة</b> (لولب، ضفيرة) واصنعي إناءً مبتكراً (ص٨٣–٨٤). <b>نشاط ٥ (ص٨٨):</b> فكّري بأشياء أخرى تُصنع بالحبال.',
 fig(svg(150,100,'<path d="M30 50 a20 20 0 1 1 20 20 a12 12 0 1 1 -12 -12" fill="none" stroke="#8a5a2b" stroke-width="10" stroke-linecap="round"/>','0 0 100 100'),'حبل لولب')+fig(svg(150,100,'<path d="M10 40 q15 -25 30 0 t30 0 t30 0" fill="none" stroke="#8a5a2b" stroke-width="9"/><path d="M10 60 q15 25 30 0 t30 0 t30 0" fill="none" stroke="#a8683a" stroke-width="9"/>','0 0 100 100'),'حبلان ضفيرة')+fig(pot_fancy(),'إناء مزخرف بحبال'),
 '<div style="text-align:center;width:100%">ارسمي فكرة إناء مبتكر لك<br>(لولب؟ ضفيرة؟ فتحات؟)</div>',
 'ابدئي من الإناء البسيط في الدرس السابق، وأضيفي عليه حبالاً صغيرة تزيّنه.'))
# 8 project
pages.append(f'<div class="pg"><h1>⭐ المشروع الفصلي</h1><p class="s">الفنية · الرابع / ٢ · ص٩١–٩٣</p><div class="b"><h2>المطلوب (من الكتاب ص٩٣)</h2>تكتبين: <b>اسم المشروع</b> · فردي أو جماعي · <b>الأدوات والخامات</b> · <b>تخطيط فكرة العمل</b> (رسمة) · نفّذ أو لم ينفذ · التقويم.</div><div class="b"><h2>أفكار بسيطة بخامات البيت</h2><ul><li>🎨 <b>لوحة طباعة</b> بقالب الشكل والأرضية (من درس الطباعة).</li><li>🏺 <b>إناء من عجينة</b> بالحبال ومزخرف.</li><li>🔷 <b>وحدة زخرفية متماثلة</b> بالمحاور والأقطار، ملوّنة.</li></ul></div><div class="b"><h2>تخطيط فكرتك ✏️</h2><div class="blank" style="min-height:360px"><div>ارسمي فكرتك هنا</div></div></div><div class="tip">اسألي المعلمة عن المشروع المطلوب بالضبط، وهل هو فردي أو جماعي.</div></div>')
open('/home/user/nadeen-yasin-games/docs/art/fanniyat.html','w',encoding='utf-8').write(f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>')
print(len(pages))
