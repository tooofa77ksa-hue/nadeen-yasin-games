# -*- coding: utf-8 -*-
import sys,re;sys.path.insert(0,'/tmp/m4')
import build_chapter as B
CSS2='''
body{color:#1b1b1b}
h1{color:#4a2fc0;font-size:27px}
h2{color:#fff;background:#4a2fc0;border:none;border-radius:10px;padding:5px 12px;font-size:18px}
.q{border:2px solid #4a2fc0;background:#fff}
.n{background:#4a2fc0;color:#fff;border-color:#4a2fc0}
.src{background:#fff3bf;border:1.5px solid #f59f00;border-radius:8px;padding:2px 8px;margin-top:5px;font-size:12.5px;color:#7a4b00!important}
.rep{background:#e03131;color:#fff;border-radius:8px;padding:0 8px;font-weight:800}
.focus{background:#e7f5ff;border:2px solid #1c7ed6;border-radius:10px;padding:2px 10px;margin:6px 0;font-size:13px}
.sol{background:#f4fff7;border:2px solid #2f9e44;border-radius:10px;padding:5px 10px;margin-top:6px}
.sol .red{color:#e03131;font-weight:800}
.sol .ans{background:#2f9e44;color:#fff;border-radius:8px;padding:2px 10px;margin:4px 0;font-weight:800;display:inline-block}
.sol .why{color:#1c7ed6}.sol .tip{color:#c2410c}
.cover{text-align:center;padding-top:20mm}
.cover .big{font-size:34px;color:#4a2fc0;font-weight:800;margin:10px 0}
.box{border:3px solid #4a2fc0;border-radius:14px;padding:8px 14px;margin:10px 0;text-align:right}
.box b{color:#e03131}
table.st{width:100%;border-collapse:collapse;margin:6px 0}table.st td,table.st th{border:2px solid #4a2fc0;padding:4px 8px;text-align:center}table.st th{background:#e5dbff}
.dua{border:none;padding:0;margin-top:12px;text-align:center;color:#8a8a8a;font-size:10.5px;line-height:1.6;break-inside:avoid}
.cue{background:#e7f5ff;border:2px dashed #1c7ed6;border-radius:8px;padding:1px 8px;margin-bottom:4px;font-size:12.5px;color:#1c7ed6}
.pb{break-before:page}
'''
def body(ch,solved):
    b=B.build_ch(ch,solved,'central',body_only=True)
    b=re.sub(r'<h1>.*?</div><div class="note">','<div class="note">',b,count=1,flags=re.S)  # نحذف العنوان الصغير والوصف
    b=b.replace(' — تكرر في ',' — <span class="rep">🔁 تكرر في ').replace(' نماذج</div>',' نماذج</span></div>')
    if not solved:
        b=b.replace('<span class="t">','<span class="cue">🔎 ركّزي: ما المطلوب؟ ما المعطيات؟ ثم حلّلي</span><br><span class="t">')
    return b
def index_html():
    import book_pages as P
    h='<h2 class="pb">فهرس الأسئلة: أين تجدين كل سؤال في كتابك؟</h2><div class="small">لكل فصل: الدرس، وصفحاته في الكتاب، وكم سؤالاً جاء منه في المركزية، وأرقام الأسئلة في هذه الملزمة (رقم السؤال داخل الفصل).</div>'
    for ch in (1,2,3,4,5,6):
        rows=B.IDX.get(ch,[]);d={}
        for n,c in sorted(set(rows)):d.setdefault(c,[]).append(n)
        h+=f'<h3 style="color:#4a2fc0;margin:10px 0 3px">{B.CHN[ch]}</h3><table class="st"><tr><th>الدرس</th><th>صفحات الكتاب</th><th>عدد الأسئلة</th><th>أرقام الأسئلة</th></tr>'
        for k,t,sp,ep in P.LES[ch]:
            ns=d.get(k,[]);pg=f'ص{P.a(sp)}' if sp==ep else f'ص{P.a(sp)}–{P.a(ep)}'
            h+=f'<tr><td style="text-align:right">{k.replace("-","&#8206;-&#8206;")} {t}</td><td>{pg}</td><td>{P.a(len(ns)) if ns else "—"}</td><td style="font-size:12px">{"، ".join(P.a(x) for x in ns) if ns else "لم يأتِ"}</td></tr>'
        rest=d.get(None,[])
        if rest:h+=f'<tr><td style="text-align:right">مراجعة الفصل</td><td style="font-size:11px">{P.REVIEW[ch]}</td><td>{P.a(len(rest))}</td><td>{"، ".join(P.a(x) for x in rest)}</td></tr>'
        h+='</table>'
    return h
def booklet(solved):
    B.IDX.clear()
    secs=''.join(f'<h2 class="pb">{B.CHN[c]}</h2>'+body(c,solved) for c in (1,2,3,4,5,6))
    ver='نموذج الإجابة (مع شرح المعلّم)' if solved else 'نموذج تحلّه الطالبة'
    cover=f'''<div class="cover"><div style="font-size:60px">📘</div><div class="big">ما جاء في الاختبارات المركزية</div><div class="big" style="font-size:26px">الرياضيات · الصف الرابع الابتدائي</div><div style="font-size:21px;margin:8px 0">الفصول من الأول إلى السادس</div><div style="font-size:22px;background:#ffd8a8;border-radius:12px;display:inline-block;padding:4px 18px;margin:8px">{ver}</div>
<div class="box"><b>كيف أقرأ هذه الملزمة؟</b><br>• كل سؤال جاء في الاختبارات المركزية (حائل، تبوك، جازان، الشرقية، حفر الباطن، القصيم) مكتوب <b>مرة واحدة</b>.<br>• تحته «جاء في» (أي منطقة)، وإذا تكرر تجدين <span class="rep">🔁 تكرر في كذا</span>.<br>• إذا جاءت الفكرة نفسها بأرقام أخرى أو بصيغة ثانية، نكتب: «ونفس الفكرة بأرقام أخرى جاءت في …».<br>• الأسئلة مرتبة: صح وخطأ، ثم اختيار من متعدد، ثم مسائل لفظية، ثم جداول ورسوم.<br>• {"🟢 الأخضر هو الحل، 🔴 الأحمر أول خطوة: ماذا يُطلب؟، 🔵 الأزرق لماذا، 🟠 البرتقالي نصيحة." if solved else "🔎 قبل كل سؤال: ركّزي، اقرئي مرتين، ما المطلوب؟ ما المعطيات؟ ثم حلّلي."}</div>
<div class="box"><b>ماذا ركّزت عليه الاختبارات المركزية؟</b>
<table class="st"><tr><th>الفصل</th><th>عدد الأسئلة في الاختبارات المركزية (تقريباً)</th></tr><tr><td>١ القيمة المنزلية</td><td>٣٨</td></tr><tr><td>٢ الجمع والطرح</td><td><b style="color:#e03131">٤٤ (الأكثر)</b></td></tr><tr><td>٣ تنظيم البيانات</td><td>٣٨ (منها ٣٥ سؤالاً مختلفاً، تكرر ٢ منها)</td></tr><tr><td>٤ الأنماط والجبر</td><td>٣٧ (منها ٣٠ سؤالاً مختلفاً، تكرر ٦ منها)</td></tr><tr><td>٥ الضرب في رقم</td><td>٣٩</td></tr><tr><td>٦ الضرب في رقمين</td><td>١١ (الأقل)</td></tr></table>
<div class="small">الفصل الثاني ثم الخامس هما الأكثر أسئلة، والفصلان ٣ و٤ لهما نصيب كبير أيضاً. أعداد الفصول من تصنيف أولي لأسئلة المركزيات.</div></div></div>'''
    idx=index_html()
    foot='''<div class="dua">إعداد: عواطف الجهني ✨ اللهم بارك لي في أولادي ووالديّ وإخواني ووفّقهم · جهد شخصي لوجه الله، ولا يُعتمد عليه وحده</div>'''
    h1_3='<h2 class="pb">الفصل الثالث: تنظيم البيانات وعرضها وتفسيرها</h2>'
    h1_4='<h2 class="pb">الفصل الرابع: الأنماط والجبر</h2>'
    html=f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{B.CSS}{CSS2}</style></head><body>{cover}{idx}{secs}{foot}</body></html>'
    name='central_all_solved' if solved else 'central_all_student'
    open(f'/tmp/m4/out/{name}.html','w',encoding='utf-8').write(html);return name
if __name__=='__main__':
    print(booklet(True),booklet(False))
