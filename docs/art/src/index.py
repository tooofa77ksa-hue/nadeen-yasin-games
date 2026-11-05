CSS=open('/tmp/artwork/printing.py').read().split('CSS="""')[1].split('"""')[0].replace('font-size:15px;margin:0}','font-size:17px;margin:0}')
rows=[('١','مبادئ التكوين الفني','١٥–٢٢','راحت','صفحة ١'),('٢','الضوء والظل والثمار','٢٣–٢٩','راحت','صفحة ٢'),('٣','رسم أوراق الشجر','٣٠–٣٥','راحت','صفحة ٣'),('٤','الزخرفة الهندسية (المحاور)','٣٩–٤٤','راحت','صفحة ٤'),('٥','الأقطار في الزخرفة','٤٥–٥٠','راحت','صفحة ٥'),('٦','الطباعة بالقالب','٥٥–٦٨','اليوم 🌟','صفحتان ٦–٧'),('٧','تشكيل أواني بالحبال','٧٢–٨٠','قادم','صفحة ٨'),('٨','تشكيلات مبتكرة بالحبال','٨١–٨٩','قادم','صفحة ٩'),('٩','المشروع الفصلي','٩١–٩٣','قادم','صفحة ١٠')]
tr=''.join(f'<tr><td>{a}</td><td><b>{b}</b></td><td>{c}</td><td style="color:{"#c25a00" if "اليوم" in d else ("#999" if d=="قادم" else "#2a8a3a")}"><b>{d}</b></td><td>{e}</td></tr>' for a,b,c,d,e in rows)
html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}
table{{width:100%;border-collapse:collapse;margin:10px 0}}td,th{{border:2px solid #ffd2a8;padding:6px 8px;text-align:center}}th{{background:#fff2e0}}.how{{font-size:18px}}</style></head><body>
<h1>🎨 فنية نادين</h1><p class="s">الصف الرابع / ٢ · الفصل الأول · كتاب التربية الفنية (الجزء الأول)</p>
<div class="b"><h2>يا نادين، كذا تشتغلين 💗</h2><div class="how">١) افتحي صفحة الدرس.<br>٢) اقرئي <b>المطلوب</b> وشوفي <b>النموذج</b>.<br>٣) قلّدي النموذج في الإطار الفاضي أو في كراستك.<br>٤) خلّصتي؟ صوّري شغلك وأرسليه لماما، وراجعيها معي. 🌟<br><small>الخطأ شيء جميل: عرفناه الآن ونحسّنه. وركّزتِ فوصلتِ بتوفيق الله.</small></div></div>
<table><tr><th>#</th><th>الدرس</th><th>صفحات الكتاب</th><th>الحالة</th><th>في هذا الملف</th></tr>{tr}</table>
<div class="b">الأدوات من البيت: أقلام رصاص وألوان، ورق مقوى (أبيض وأخضر وأزرق)، صمغ، مقص (مع ماما)، فرشاة وألوان، كراستك.</div></body></html>'''
open('/home/user/nadeen-yasin-games/docs/art/index.html','w',encoding='utf-8').write(html)
