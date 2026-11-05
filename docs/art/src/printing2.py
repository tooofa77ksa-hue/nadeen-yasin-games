import sys,math;sys.path.insert(0,'/tmp/artwork')
from shapes import *
CSS=open('/tmp/artwork/printing.py').read().split('CSS="""')[1].split('"""')[0].replace('font-size:15px;margin:0}','font-size:18px;margin:0}')
CSS+=""".big{display:flex;gap:18px;justify-content:center;align-items:flex-start;flex-wrap:wrap}.card{text-align:center;font-weight:800;font-size:18px}.card small{font-weight:500;font-size:15px;color:#555}
.stp{display:flex;align-items:center;gap:14px;margin:9px 0}.stp .e{flex:none;width:76px;height:76px;border-radius:16px;background:#fff;border:3px solid #ffd2a8;display:flex;align-items:center;justify-content:center;font-size:42px}.stp .t{font-size:20px;font-weight:800}
.tag{display:inline-block;background:#ff9a4d;color:#fff;border-radius:999px;padding:1px 14px;font-weight:800;margin-left:8px}"""
PAL=['#e24b4b','#3d7bff','#34c25a','#b04dff','#ff8a3d','#e0a100']
def result_a():
    b='<rect x="4" y="4" width="312" height="312" fill="#fff" stroke="#444" stroke-width="3"/>'
    k=0
    for r in range(3):
        for c in range(3):
            b+=flower(58+c*102,58+r*102,34,PAL[k%2*0+ (r+c)%3],'#333',2);k+=1
    return f'<svg width="230" height="230" viewBox="0 0 320 320">{b}</svg>'
def result_b():
    b='<rect x="4" y="4" width="312" height="312" fill="#fff" stroke="#444" stroke-width="3"/>'
    for r in range(3):
        for c in range(3):
            x=8+c*101;y=8+r*101;cx=x+50;cy=y+50
            if (r+c)%2==0: b+=flower(cx,cy,34,'#e24b4b','#333',2)   # شكل: الزهرة ملونة
            else: b+=f'<rect x="{x}" y="{y}" width="98" height="98" fill="#3d7bff"/>'+flower(cx,cy,34,'#fff','#fff',2)  # أرضية: الخلفية ملونة والزهرة بيضاء
    return f'<svg width="230" height="230" viewBox="0 0 320 320">{b}</svg>'
S=227
pat=lambda shp:f'<svg width="{S+16}" height="{S+16}" viewBox="-8 -8 {S+16} {S+16}">{square(0,0,S)}{shp}</svg>'
fl=pat(flower(S/2,S/2,S*0.36));st=pat(star(S/2,S/2,S*0.36))
def mold(kind):
    base='<rect x="8" y="8" width="104" height="104" rx="8" fill="#d9a066" stroke="#8a5a2b" stroke-width="3"/>'
    if kind=='shape': return f'<svg width="110" height="110" viewBox="0 0 120 120">{base}{flower(60,60,34,"#fff","#8a5a2b",2)}</svg>'
    return f'<svg width="110" height="110" viewBox="0 0 120 120">{base}<rect x="20" y="20" width="80" height="80" fill="#fff" stroke="#8a5a2b" stroke-width="2"/>{flower(60,60,30,"#d9a066","#8a5a2b",2)}</svg>'
def print_result(kind):
    if kind=='shape': return f'<svg width="110" height="110" viewBox="0 0 120 120"><rect x="8" y="8" width="104" height="104" fill="#fff" stroke="#999" stroke-width="2"/>{flower(60,60,34,"#e24b4b","#333",2)}</svg>'
    return f'<svg width="110" height="110" viewBox="0 0 120 120"><rect x="8" y="8" width="104" height="104" fill="#3d7bff" stroke="#999" stroke-width="2"/>{flower(60,60,34,"#fff","#fff",2)}</svg>'
def mini_grid():
    cells=''.join('<div style="width:54px;height:54px;border:2px solid #666;display:inline-block;vertical-align:top;background:%s"></div>'%('#fff' if (i+j)%2==0 else '#3d7bff') for i in range(2) for j in range(2))
    return cells
grid=''.join('<div class="cell">%s</div>'%('ش' if (i+j)%2==0 else 'أ') for i in range(3) for j in range(3))
steps1=[('⬜','١) اقصّي <b>مربعين أبيضين</b> (٦ سم) والصقيهما فوق بعض. هذي القاعدة القوية.'),('🟩','٢) انقلي الزهرة بالقلم على الورق <b>الأخضر</b> واقصّيها <b>مرتين</b>.'),('🧴','٣) الصقي الزهرتين فوق بعض، ثم الصقيهما على القاعدة. اتركيها تنشف.'),('🎨','٤) حطّي <b>لون خفيف</b> على الزهرة بفرشاة (بدون ماء كثير).'),('📓','٥) في <b>كراستك</b>: حطّي ورقة قديمة تحت الصفحة، ثم <b>اضغطي</b> الزهرة بقوة.'),('🌼','٦) <b>ارفعيها</b> بسرعة… طلعت الزهرة! كرّري.')]
st1=''.join(f'<div class="stp"><div class="e">{e}</div><div class="t">{t}</div></div>' for e,t in steps1)
html=f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="pg"><h1>🎨 الطباعة بالقالب</h1><p class="s">الفنية · الرابع / ٢ · ص٥٥–٦٨</p>
<div class="b"><h2>شو راح تسوين؟ هذا شكل الشغل بعد ما تخلصين 👇</h2><div class="big"><div class="card">{result_a()}<br>١) زهور مطبوعة بنفس القالب<br><small>(الدرس الأول)</small></div><div class="card">{result_b()}<br>٢) زهرة، ثم أرضية، بالتبادل<br><small>(الدرس الثاني)</small></div></div></div>
<div class="b"><h2>تحتاجين من البيت</h2><div class="mat"><span>⬜ ورق مقوى أبيض (القاعدة)</span><span>🟩 ورق مقوى أخضر (الزهرة)</span><span>🟦 ورق مقوى أزرق (الأرضية)</span><span>📓 كراستك</span><span>🖌️ فرشاة</span><span>✂️ مقص (مع ماما)</span><span>🧴 صمغ</span><span>🎨 ألوان</span><span>📰 ورقة قديمة تحت الصفحة</span></div></div>
<div class="safe">⚠️ المقص حاد: استعمليه مع ماما.</div></div>
<div class="pg"><h1>١) القالب الأول: الزهرة</h1><p class="s">اتبعي الخطوات بالترتيب</p><div class="b">{st1}</div>
<div class="b"><div class="big"><div class="card">{mold('shape')}<br><small>قالبك جاهز</small></div><div class="card" style="font-size:40px;align-self:center">⬅️</div><div class="card">{print_result('shape')}<br><small>هذا اللي يطلع على الورقة</small></div></div></div></div>
<div class="pg"><h1>✂️ نموذج جاهز للقص</h1><p class="s">قصّي الزهرة من الورقة، والورقة اللي فيها الفتحة احتفظي فيها</p><div class="row">{fl}{st}</div>
<div class="b"><h2>٢) قالب الأرضية 🔲</h2><div class="big"><div class="card">{mold('ground')}<br><small>مربع أزرق فيه فتحة بشكل الزهرة، ملصوق على قاعدة بيضاء</small></div><div class="card" style="font-size:40px;align-self:center">⬅️</div><div class="card">{print_result('ground')}<br><small>اللون حول الزهرة، والزهرة بيضاء</small></div></div></div>
<div class="b"><div class="stp"><div class="e">🟩</div><div class="t">الزهرة الخضراء = قالب <b>الشكل</b>.</div></div><div class="stp"><div class="e">🟦</div><div class="t">اقصّي مربعاً أزرق، واقطعي منه الزهرة (تصير <b>فتحة</b>)، والصقيه <b>بطبقتين</b> على قاعدة بيضاء: هذا قالب <b>الأرضية</b>.</div></div></div></div>
<div class="pg"><h1>📓 اطبعي في كراستك</h1><p class="s"><span class="tag">ش</span>اطبعي بقالب <b>الشكل</b> &nbsp; <span class="tag">أ</span>اطبعي بقالب <b>الأرضية</b></p>
<div class="g">{grid}</div><p class="cap" style="font-size:18px">قسّمي صفحة كراستك بالقلم الرصاص لمربعات بحجم القالب، ثم اطبعي بالتبادل: زهرة، أرضية، زهرة… 🌈<br><small>حطّي ورقة قديمة تحت الصفحة، واتركيها تنشف قبل ما تقفلين الكراسة.</small></p></div>
</body></html>'''
open('/home/user/nadeen-yasin-games/docs/art/printing.html','w',encoding='utf-8').write(html)
