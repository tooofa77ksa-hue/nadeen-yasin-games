import sys,math;sys.path.insert(0,'/tmp/artwork')
from shapes import *
from lessons import leaf,INK
CSS=open('/tmp/artwork/printing.py').read().split('CSS="""')[1].split('"""')[0].replace('font-size:15px;margin:0}','font-size:18px;margin:0}')
CSS+=""".steps{display:flex;gap:8px;align-items:flex-end;justify-content:center}.fig{text-align:center;font-weight:800;font-size:16px}.arr{font-size:34px;align-self:center}.rowl{display:flex;align-items:center;gap:10px;margin:4px 0}.nm{flex:none;width:90px;text-align:center;font-weight:800;font-size:24px}
.b3{border:4px solid #ff9a4d;border-radius:16px;padding:8px 12px;margin:5px 0;background:#fffaf3}"""
def svg(w,h,body,vb):
    if (w,h) in ((130,130),(150,150)): w=h=int(w*0.82)
    return f'<svg width="{w}" height="{h}" viewBox="{vb}">{body}</svg>'
VB='0 0 120 120'
def fl_steps(k):
    if k==1: return svg(100,100,f'<circle cx="60" cy="60" r="12" fill="none" stroke="{INK}" stroke-width="4"/>',VB)
    if k==2:
        b=f'<circle cx="60" cy="60" r="12" fill="none" stroke="{INK}" stroke-width="4"/>'
        for i in range(5):
            a=math.radians(i*72-90);x=60+30*math.cos(a);y=60+30*math.sin(a);b+=f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="13" ry="19" transform="rotate({i*72} {x:.1f} {y:.1f})" fill="none" stroke="#bbb" stroke-width="3" stroke-dasharray="4 4"/>'
        return svg(100,100,b,VB)
    return svg(100,100,flower(60,60,40,'#e24b4b',INK,3),VB)
def heart(k):
    if k==1: return svg(100,100,'<circle cx="44" cy="48" r="20" fill="none" stroke="#999" stroke-width="4" stroke-dasharray="4 4"/><circle cx="76" cy="48" r="20" fill="none" stroke="#999" stroke-width="4" stroke-dasharray="4 4"/>',VB)
    if k==2: return svg(100,100,'<circle cx="44" cy="48" r="20" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/><circle cx="76" cy="48" r="20" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/><polygon points="26,58 94,58 60,104" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/>',VB)
    return svg(100,100,f'<path d="M60 104 C20 70,16 40,38 30 C50 25,58 32,60 40 C62 32,70 25,82 30 C104 40,100 70,60 104 Z" fill="#e24b4b" stroke="{INK}" stroke-width="3"/>',VB)
def star3(k):
    if k==1: return svg(100,100,'<polygon points="60,14 100,95 20,95" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/>',VB)
    if k==2: return svg(100,100,'<polygon points="60,14 100,95 20,95" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/><polygon points="60,106 20,35 100,35" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="4 4"/>',VB)
    return svg(100,100,star(60,62,48,'#ffd54a',INK,3),VB)
def row(name,f):
    return f'<div class="rowl"><div class="nm">{name}</div><div class="steps">'+f'{f(1)}<div class="arr">←</div>{f(2)}<div class="arr">←</div>{f(3)}</div></div>'
def lf(k): return leaf(k if k<4 else 4).replace('width="130" height="150"','width="100" height="115"')
def lf3(k): return leaf({1:1,2:2,3:4}[k]).replace('width="130" height="150"','width="100" height="115"')
# page 2 pieces
def sqr(inner,fill='none',s=130): return svg(s,s,f'<rect x="6" y="6" width="108" height="108" fill="{fill}" stroke="{INK}" stroke-width="4" rx="4"/>{inner}',VB)
p2_draw=sqr(flower(60,60,38,'none',INK,3))
INNER='<rect x="6" y="6" width="108" height="108" fill="none" stroke="'+INK+'" stroke-width="4"/>'
p2_frame=svg(150,150,'<rect x="4" y="4" width="132" height="132" fill="none" stroke="#e0765a" stroke-width="3" stroke-dasharray="8 6"/><g transform="translate(10,10)">'+INNER+flower(60,60,38,"none",INK,3)+'</g>','0 0 140 140')
green=svg(130,130,f'{flower(60,60,38,"#58b45a",INK,3)}',VB)
blue=svg(130,130,f'<rect x="8" y="8" width="104" height="104" fill="#4a8fe0" stroke="{INK}" stroke-width="3"/>{flower(60,60,36,"#fff",INK,3)}',VB)
mold_shape=svg(130,130,f'<rect x="8" y="8" width="104" height="104" rx="6" fill="#fff" stroke="#8a5a2b" stroke-width="4"/>{flower(60,60,34,"#58b45a","#2c6a2e",2)}',VB)
mold_ground=svg(130,130,f'<rect x="8" y="8" width="104" height="104" rx="6" fill="#fff" stroke="#8a5a2b" stroke-width="4"/><rect x="18" y="18" width="84" height="84" fill="#4a8fe0" stroke="#2a5aa0" stroke-width="3"/>{flower(60,60,32,"#fff","#2a5aa0",2)}',VB)
res_shape=svg(130,130,f'<rect x="8" y="8" width="104" height="104" fill="#fff" stroke="#999" stroke-width="2"/>{flower(60,60,34,"#e24b4b",INK,2)}',VB)
res_ground=svg(130,130,f'<rect x="8" y="8" width="104" height="104" fill="#e24b4b" stroke="#999" stroke-width="2"/>{flower(60,60,34,"#fff","#fff",2)}',VB)
def fg(s,t): return f'<div class="fig">{s}<br>{t}</div>'
arrow='<div class="arr">←</div>'
html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="pg"><h1>✏️ كيف أرسم شكل القالب؟</h1><p class="s">اختاري شكل واحد وارسميه في ٣ خطوات (بالقلم الرصاص)، ثم لوّنيه</p>
<div class="b3">{row('🌸 زهرة',fl_steps)}</div><div class="b3">{row('❤️ قلب',heart)}</div><div class="b3">{row('⭐ نجمة',star3)}</div><div class="b3">{row('🍃 ورقة',lf3)}</div>
<div class="b3" style="text-align:center">رسمتي <b>بسيطة وكبيرة</b> (بدون تفاصيل صغيرة) عشان تنقص بالمقص بسهولة ✂️</div></div>
<div class="pg"><h1>✂️ من الرسمة إلى القالب إلى الطباعة</h1><p class="s">اتبعي الصور بالترتيب</p>
<div class="b3"><div class="steps">{fg(p2_draw,'١ ارسمي شكلك<br>في مربع ٦ سم')}{arrow}{fg(p2_frame,'٢ ارسمي مربعاً كبيراً<br>حول الشكل (الإطار)')}</div></div>
<div class="b3"><div class="steps">{fg(green,'٣ اقصّي الشكل<br>من الورق الأخضر')}{fg(blue,'اقصّي الإطار من الأزرق<br>وانزعي الشكل منه (فتحة)')}</div></div>
<div class="b3"><div class="steps">{fg(mold_shape,'٤ الصقي على قاعدة:<br>قالب <b>الشكل</b>')}{fg(mold_ground,'قالب <b>الأرضية</b>')}</div></div>
<div class="b3"><div class="steps">{fg(res_shape,'٥ اطبعي: الشكل ملوّن')}{fg(res_ground,'والأرضية: حوله ملوّن')}</div></div>
<div class="b3" style="text-align:center">اطبعي بالتبادل في كراستك: شكل ثم أرضية ثم شكل 🌈</div></div>
</body></html>'''
open('/home/user/nadeen-yasin-games/docs/art/draw_guide.html','w',encoding='utf-8').write(html)
