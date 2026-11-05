import sys;sys.path.insert(0,'/tmp/artwork')
from shapes import *
S=227
pat=lambda shp:f'<svg width="{S+16}" height="{S+16}" viewBox="-8 -8 {S+16} {S+16}">{square(0,0,S)}{shp}</svg>'
fl=pat(flower(S/2,S/2,S*0.36));st=pat(star(S/2,S/2,S*0.36))
def mini(kind):
    base='<rect x="10" y="10" width="100" height="100" rx="6" fill="#d9a066" stroke="#8a5a2b" stroke-width="3"/>'
    if kind=='shape': return f'<svg width="84" height="84" viewBox="0 0 120 120">{base}{flower(60,60,34,"#fff","#8a5a2b",2)}</svg>'
    return f'<svg width="84" height="84" viewBox="0 0 120 120">{base}<rect x="22" y="22" width="76" height="76" fill="#fff" stroke="#8a5a2b" stroke-width="2"/>{flower(60,60,28,"#d9a066","#8a5a2b",2)}</svg>'
grid=''.join('<div class="cell %s">%s</div>'%(('s','ش') if (i+j)%2==0 else ('a','أ')) for i in range(3) for j in range(3))
CSS="""@font-face{font-family:'Baloo Bhaijaan 2';font-weight:500;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-Medium.ttf')}@font-face{font-family:'Baloo Bhaijaan 2';font-weight:800;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf')}
@page{size:A4;margin:11mm}body{font-family:'Baloo Bhaijaan 2',sans-serif;font-weight:500;color:#222;font-size:15px;margin:0}
h1{text-align:center;color:#c25a00;margin:0;font-weight:800;font-size:30px}p.s{text-align:center;color:#666;margin:2px 0 10px}.pg{page-break-after:always}.pg:last-child{page-break-after:auto}
.b{border:4px solid #ff9a4d;border-radius:16px;padding:6px 12px;margin:6px 0;background:#fffaf3}.b h2{margin:0 0 4px;font-size:20px;font-weight:800;color:#c25a00}
.st{display:flex;align-items:center;gap:10px;margin:4px 0}.n{flex:none;width:34px;height:34px;border-radius:50%;background:#ff9a4d;color:#fff;font-weight:800;text-align:center;line-height:34px;font-size:20px}
.mat{display:flex;flex-wrap:wrap;gap:8px}.mat span{background:#fff;border:3px solid #ffd2a8;border-radius:12px;padding:3px 10px}
.row{display:flex;gap:14px;justify-content:center;align-items:center;margin:8px 0;flex-wrap:wrap}.cap{text-align:center;font-weight:800}
.g{display:grid;grid-template-columns:repeat(3,6cm);grid-template-rows:repeat(3,6cm);gap:0;margin:8px auto;width:18cm;border:3px solid #444}.cell{border:2px dashed #999;display:flex;align-items:flex-start;justify-content:flex-end;padding:4px 8px;font-weight:800;font-size:20px;color:#bbb}
.safe{background:#fff0f0;border:3px dashed #e05555;border-radius:12px;padding:5px 10px;font-size:14px}"""
html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="pg"><h1>🎨 الطباعة بالقالب</h1><p class="s">الفنية · الرابع / ٢ · الوحدة الثالثة (ص٥٥–٦٨)</p>
<div class="b"><h2>المطلوب</h2>تصنعين <b>قالبًا بسيطًا</b> وتطبعين به نموذجًا جميلًا على الورق (نشاط ٣ و٤).</div>
<div class="b"><h2>أدواتك من البيت</h2><div class="mat"><span>📦 كرتون (علبة قديمة)</span><span>✂️ مقص (مع ماما)</span><span>🧴 صمغ</span><span>🧽 إسفنجة صغيرة</span><span>🎨 ألوان جواش أو أكريليك</span><span>📄 ورق أبيض</span><span>🧵 قماش أو ورق سميك</span></div></div>
<div class="b"><h2>١) القالب الأول (ص٥٥–٦١)</h2>
<div class="st"><div class="n">١</div><div>قصّي <b>مربعًا من الكرتون</b> (٦ سم). هذا قاعدة القالب.</div></div>
<div class="st"><div class="n">٢</div><div>ارسمي <b>شكلًا بسيطًا</b> (نجمة أو زهرة) وقصّيه من القماش أو الورق السميك.</div></div>
<div class="st"><div class="n">٣</div><div><b>الصقي</b> الشكل على القاعدة واتركيه <b>يجف</b>.</div></div>
<div class="st"><div class="n">٤</div><div>ضعي <b>اللون</b> على القالب بالإسفنجة.</div></div>
<div class="st"><div class="n">٥</div><div><b>اضغطي</b> القالب على الورقة بقوة، ثم <b>ارفعيه</b>.</div></div>
<div class="st"><div class="n">٦</div><div><b>كرّري</b> الطباعة حتى تملئي الورقة.</div></div></div>
<div class="b"><h2>٢) قالب الشكل وقالب الأرضية (ص٦٢–٦٨)</h2>
<div class="row"><div class="cap">{mini('shape')}<br>قالب <b>الشكل</b><br><small>الشكل هو البارز</small></div><div class="cap">{mini('ground')}<br>قالب <b>الأرضية</b><br><small>الخلفية هي البارزة</small></div></div>
<div class="st"><div class="n">١</div><div>اقصّي كرتونتين <b>متساويتين</b>. على الأولى الصقي <b>الشكل</b>.</div></div>
<div class="st"><div class="n">٢</div><div>على الثانية الصقي <b>الإطار</b> الذي حول الشكل (والشكل مفتوح بداخله).</div></div>
<div class="st"><div class="n">٣</div><div>اطبعي <b>بالتبادل</b>: مرة الشكل، ومرة الأرضية، على ورقة المربعات (الصفحة ٣).</div></div></div>
<div class="safe">⚠️ المقص من الأدوات الحادة: استعمليه بحذر وبإشراف ماما، واغسلي يديك بعد الألوان.</div></div>
<div class="pg"><h1>✂️ نموذج جاهز للقص</h1><p class="s">قصّيه من الورقة، واستعمليه كنموذج على الكرتون (انقليه بالقلم الرصاص)</p>
<div class="row">{fl}{st}</div>
<div class="b"><b>كيف تستعملينه؟</b><div class="st"><div class="n">١</div><div>قصّي <b>الزهرة</b> (أو النجمة) من الورقة. هذا هو <b>قالب الشكل</b> على الكرتون.</div></div><div class="st"><div class="n">٢</div><div>الورقة التي بقيت وفيها <b>الفتحة</b> (الإطار): انقليها على كرتونة ثانية، وهذا <b>قالب الأرضية</b>.</div></div><div class="st"><div class="n">٣</div><div>الصقي كل قطعة على كرتونة قاعدة، واتركيها <b>تجف</b>.</div></div></div>
<div class="row">{fl}{st}</div></div>
<div class="pg"><h1>🟦 ورقة الطباعة بالتبادل</h1><p class="s">ش = اطبعي بقالب <b>الشكل</b> · أ = اطبعي بقالب <b>الأرضية</b></p>
<div class="g">{grid}</div><p class="cap">كرّري بالتبادل حتى تمتلئ المربعات، ثم اتركي الألوان تجف 🌈</p></div>
</body></html>'''
open('/home/user/nadeen-yasin-games/docs/art/printing.html','w',encoding='utf-8').write(html)
