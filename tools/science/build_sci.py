# -*- coding: utf-8 -*-
import sys,json,glob,os,re,html,subprocess
sys.path.insert(0,'/tmp/m4')
import build_chapter as B
import build_booklet as K
H=B.H
AR='٠١٢٣٤٥٦٧٨٩'
a=lambda n:str(n).translate(str.maketrans('0123456789',AR))
C=json.load(open('/tmp/sci/clusters.json'))
EXT={}
for f in ('sharqia','hail','asir','north'):
    for x in json.load(open(f'/tmp/sci/ext/{f}.json')): EXT[x['uid']]=x
FIN={}
for f in glob.glob('/tmp/sci/final/final_*.json'):
    for r in json.load(open(f)): FIN[r['id']]=r
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
LES={}
for ch in TOC:
    for l in ch['lessons']: LES[l['id']]=(ch,l)
def lkey(c):
    l=c.get('lesson') or ''
    return l if l in LES else ''
def thumb(page):
    p=f'/tmp/sci/booktn/p{page}.jpg'
    if not os.path.exists(p):
        subprocess.run(f'pdftoppm -r 42 -jpeg -f {page} -l {page} /tmp/sci/book.pdf /tmp/sci/booktn/t && mv /tmp/sci/booktn/t-*{page}.jpg {p}',shell=True)
    return p if os.path.exists(p) else None
ORDER={'tf':0,'mcq':1,'fill':2,'word_fill':2,'short':3,'match':4,'table':5,'diagram':5,'other':6}
CSS=B.CSS+K.CSS2+'''
.les{background:#e7f5ff;border:3px solid #1c7ed6;border-radius:14px;padding:6px 12px;margin:8px 0;break-inside:avoid}
.les img{float:left;margin:0 10px 4px 0;max-height:150px;border:2px solid #1c7ed6;border-radius:6px}
.ki{font-size:12.5px;margin:2px 0}
.bookfig{margin-top:5px;font-size:11.5px;text-align:center}.bookfig img{max-height:210px;border:2px solid #1c7ed6;border-radius:6px}
.quote{background:#fff9db;border-right:4px solid #f59f00;padding:2px 8px;margin-top:4px;font-size:12.5px}
.ans{background:#2f9e44;color:#fff;border-radius:8px;padding:2px 10px;margin:4px 0;font-weight:800;display:inline-block}
.region{display:inline-block;background:#fff;border:1.5px solid #e03131;color:#e03131;border-radius:8px;padding:0 6px;margin:0 2px;font-size:11.5px}
'''
def kis(l):
    o=''
    for k in l['key_ideas'][:4]:
        m=re.search(r"\[(.*?)\]",k);txt=re.sub(r"^\[[^\]]*\]\s*","",k)
        o+='<div class="ki">• '+H(txt)+' <span class="small">('+(H(m.group(1)) if m else '')+')</span></div>'
    return o
def qhtml(n,c,solved):
    x=EXT[c['canonical_uid']];f=FIN.get(c['id'],{})
    star=''
    h=f'<div class="q"><span class="n">{a(n)}</span>'
    if c['count']>=2: h+=f'<span class="rep">🔁 تكرر في {a(c["count"])} مناطق</span> '+''.join(f'<span class="region">{H(r)}</span>' for r in c['regions'])+'<br>'
    else: h+=f'<span class="region" style="border-color:#868e96;color:#555">جاء في {H(c["regions"][0])} فقط</span><br>'
    h+=f'<span class="t">{H(x["text"])}</span>'
    if x.get('options'): h+='<div class="opts">'+''.join(f'<div>{H(o)}</div>' for o in x['options'])+'</div>'
    if x.get('table_text'): h+=f'<div style="font-size:13px;margin:3px 0;border:1.5px solid #adb5bd;border-radius:6px;padding:3px 8px">{H(x["table_text"]).replace(chr(10),"<br>")}</div>'
    fg=x.get('figure')
    if fg and os.path.exists(fg): h+=f'<div class="fig"><img src="file://{fg}" style="filter:none"></div>'
    if not solved:
        if x['type'] in ('fill','word_fill','short','table','diagram','match'): h+='<div class="ln"></div><div class="ln"></div>'
        elif x['type']=='tf': h+='<div style="margin-top:3px">( &nbsp;&nbsp;&nbsp;&nbsp; ) صح &nbsp;&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp; ) خطأ</div>'
    if c['count']>=2 and c.get('form_note'): h+=f'<div class="src" style="color:#555;font-size:11px">كيف جاء: {H(c["form_note"])}</div>'
    pg=f.get('book_page_exact') or c.get('book_pages')
    L=LES.get(lkey(c))
    if L: where=f'<b>الفصل {H(L[0]["id"])}: {H(L[0]["title"])}</b> · <b>الدرس {H(L[1]["id"])}: {H(L[1]["title"])}</b> (من ص{a(L[1]["start"])} إلى ص{a(L[1]["end"])}) · <b>مكانه بالضبط: {H(pg)}</b>'
    else: where=f'<b>مدخل الطريقة العلمية</b> · <b>{H(pg)}</b>'
    h+=f'<div class="src" style="background:#e7f5ff;border-color:#1c7ed6;color:#0b5394;font-size:13px">📖 في كتابك: {where}</div>'
    if solved:
        e=f.get('explain') or {}
        th=re.sub(r'^(اسألي نفسك|نسأل أنفسنا)\s*:?\s*','',str(e.get('think') or '')).strip() or 'ماذا يريدون منا؟'
        h+=f'<div class="par">👨‍👩‍👧 اسألي بنتك: «{H(th)}»</div>'
        h+='<div class="sol">'
        h+=f'<div class="red">① {H(e.get("task") or "المطلوب: "+x["text"][:60])}</div>'
        if e.get('think'): h+=f'<div><b>② {H(e["think"])}</b></div>'
        for s in e.get('steps') or []: h+=f'<div>• {H(s)}</div>'
        h+=f'<div class="ans">إجابة الأستاذة موضي الحربي ✔ {H(f.get("model_answer") or x.get("model_answer") or "")}</div>'
        if e.get('why'): h+=f'<div class="why"><b>ليش؟</b> {H(e["why"])}</div>'
        if e.get('tip'): h+=f'<div class="tip">💡 {H(e["tip"])}</div>'
        if f.get('book_quote'): h+=f'<div class="quote">📖 من كتابك ({H(f.get("book_page_exact",""))}): «{H(f["book_quote"])}»</div>'
        bf=f.get('book_fig')
        if bf and os.path.exists(bf): h+=f'<div class="bookfig"><img src="file://{bf}"><div>الصورة في كتابك ({H(f.get("book_fig_page",""))})</div></div>'
        if f.get('conflict'): h+=f'<div class="par" style="border-color:#e03131;color:#c92a2a">تنبيه للأم: {H(f["conflict"])}</div>'
        h+='</div>'
    return h+'</div>'
GUIDE_S='''<div class="pb"></div><h1 style="color:#7048e8">👨‍👩‍👧 كيف تشرحين لبنتك؟</h1><div class="sub">دليل الوالدين في ١٠ دقائق · لا تحتاجين أن تكوني معلمة علوم</div>
<div class="box"><b>قبل أن تبدئي:</b> قولي «بسم الله»، واجلسا هادئتين <b>١٥ دقيقة</b>، وخذي <b>٣ أسئلة فقط</b> في الجلسة. <b style="color:#e03131">القاعدة الذهبية:</b> لا نعطيها الجواب، <b>نسألها</b>.</div>
<h2>الخطوات لأي سؤال</h2><table class="st"><tr><th>الخطوة</th><th>ماذا تفعلين؟</th><th>ماذا تقولين لها؟</th></tr>
<tr><td><b style="color:#e03131">① اقرئي</b></td><td>تقرأ السؤال معك مرتين.</td><td>«اقرئي ببطء.»</td></tr>
<tr><td><b style="color:#e03131">② المطلوب</b></td><td>تضع خطاً تحت ما يسأل عنه.</td><td>«ماذا يريدون منا؟»</td></tr>
<tr><td><b style="color:#1c7ed6">③ الدرس</b></td><td>تفتح الكتاب على صفحة الدرس (مكتوبة تحت كل سؤال 📖) وتنظر الصورة.</td><td>«أين قرأنا هذا؟ ماذا يقول الكتاب؟»</td></tr>
<tr><td><b style="color:#2f9e44">④ تجيب</b></td><td>تختار أو تكتب بكلماتها.</td><td>«بكلماتك أنتِ، ثم نقارن.»</td></tr>
<tr><td><b style="color:#c2410c">⑤ تقارن</b></td><td>تقارن بإجابة الأستاذة موضي (الأخضر).</td><td>«ما الذي اختلف؟ ولماذا؟»</td></tr></table>
<div class="pb"></div><h1 style="color:#7048e8">ماذا تقولين إذا أخطأت؟</h1>
<div class="box"><b>١)</b> «اقرئي السؤال مرة ثانية.» <b>٢)</b> «ما المطلوب؟» <b>٣)</b> اقرئي السطر البنفسجي «👨‍👩‍👧 اسألي بنتك» تحت السؤال. <b>٤)</b> افتحا الكتاب على الصفحة المكتوبة وانظرا الصورة معاً. <b>٥)</b> فقط إن لم تصل: اقرئي لها جملة الكتاب (الأصفر) ثم اتركيها تعيد الجواب.</div>
<table class="st"><tr><th style="background:#d3f9d8">قوليها ✅</th><th style="background:#ffe3e3">تجنّبيها ❌</th></tr><tr><td>«ممتاز لأنك فكّرتِ.» · «خلّينا نراجع معاً.» · «اجتهدتِ، والتوفيق من الله.»</td><td>«غلطتِ!» · «ما تفهمين.» · «شوفي أختك.»</td></tr></table>
<div class="box">• 🔁 <b>تكرر</b>: جاء في أكثر من منطقة، فاهتمي به. • الأخضر = إجابة الأستاذة موضي الحربي النموذجية. • الأصفر = جملة من كتابك. • بعد المراجعة أعطيها <b>النسخة غير المحلولة</b>.</div>
<div class="small">إجابات الأستاذة موضي هي المرجع المعتمد. وهذه الملزمة جهد شخصي لا تغني عن الكتاب ولا عن المعلمة.</div>'''
def build(solved):
    byl={}
    for c in C: byl.setdefault(lkey(c),[]).append(c)
    n=0;secs='';idx=[]
    order=[(ch,l) for ch in TOC for l in ch['lessons']]
    for ch,l in order:
        cs=byl.get(l['id'],[])
        cs.sort(key=lambda c:(-c['count'],ORDER.get(c['type'],6),c['id']))
        secs+=f'<h2 class="pb">الفصل {H(ch["id"])}: {H(ch["title"])} — الدرس {H(l["id"])} {H(l["title"])}</h2>'
        tn=thumb(l['start']);ki=kis(l)
        secs+=f'<div class="les">{f"<img src=file://{tn}>" if tn else ""}<b>📖 صفحات الدرس في كتابك: ص{a(l["start"])}–{a(l["end"])}</b>{ki}<div style="clear:both"></div></div>'
        nums=[]
        for c in cs:
            n+=1;nums.append(n);secs+=qhtml(n,c,solved)
        idx.append((ch,l,nums))
    rest=byl.get('',[])
    if rest:
        secs+='<h2 class="pb">مدخل: الطريقة العلمية</h2>'
        nums=[]
        for c in sorted(rest,key=lambda c:-c['count']):
            n+=1;nums.append(n);secs+=qhtml(n,c,solved)
        idx.append((None,{'id':'—','title':'مدخل الطريقة العلمية (الفرضية والمتغير)','start':10,'end':10},nums))
    # فهرس
    ih='<h2 class="pb">فهرس الأسئلة: أين تجدين كل سؤال في كتابك؟</h2><table class="st"><tr><th>الفصل</th><th>الدرس</th><th>صفحات الكتاب</th><th>عدد الأسئلة</th><th>أرقامها</th></tr>'
    for ch,l,nums in idx:
        ih+=f'<tr><td>{H(ch["id"]+" "+ch["title"]) if ch else "—"}</td><td style="text-align:right">{H(l["id"])} {H(l["title"])}</td><td>ص{a(l["start"])}–{a(l["end"])}</td><td>{a(len(nums))}</td><td style="font-size:11px">{"، ".join(a(x) for x in nums)}</td></tr>'
    ih+='</table>'
    tot=sum(c['count'] for c in C)
    top=sorted(C,key=lambda c:-c['count'])[:8]
    st=f'<div class="box"><b>ماذا ركّزت عليه الاختبارات المركزية في العلوم؟</b><br>جمعنا اختبارات ٤ مناطق (الشرقية، حائل، عسير، الحدود الشمالية): <b>{a(tot)}</b> سؤالاً، منها <b>{a(len(C))}</b> سؤالاً مختلفاً، وتكرر <b>{a(sum(1 for c in C if c["count"]>=2))}</b> منها في أكثر من منطقة.'
    st+='<table class="st"><tr><th>الفصل</th><th>أسئلة مختلفة</th><th>تكرر منها</th></tr>'
    for ch in TOC:
        cc=[c for c in C if lkey(c) and LES[lkey(c)][0]['id']==ch['id']]
        st+=f'<tr><td style="text-align:right">{H(ch["id"]+" "+ch["title"])}</td><td>{a(len(cc))}</td><td>{a(sum(1 for c in cc if c["count"]>=2))}</td></tr>'
    st+='</table><b>الأكثر تكراراً (ابدئي بها):</b> '+'، '.join(f'{H(c["lesson_title"])} (جاء في {a(c["count"])} مناطق)' for c in top[:6])+'</div>'
    ver='محلولة ومشروحة (بإجابات الأستاذة موضي الحربي)' if solved else 'للطالبة (تحلّها بالورق)'
    cover=f'<div class="cover"><div style="font-size:60px">🔬</div><div class="big">ما جاء في الاختبارات المركزية</div><div class="big" style="font-size:26px">العلوم · الصف الرابع الابتدائي · الفصل الدراسي الأول</div><div style="font-size:22px;background:#ffd8a8;border-radius:12px;display:inline-block;padding:4px 18px;margin:8px">{ver}</div><div class="box"><b>كيف أقرأ هذه الملزمة؟</b><br>• الأسئلة مرتبة <b>بالدروس</b> كما في كتابك، والمتكرر أولاً.<br>• كل سؤال: كم مرة تكرر وفي أي منطقة، وكيف جاء، وصورته، وتحته <b>📖 صفحته في كتابك</b>.<br>• {"الحل بالأخضر هو إجابة الأستاذة موضي الحربي النموذجية، ومعه شرح بسيط وجملة من الكتاب وصورة الكتاب." if solved else "قبل كل سؤال: ركّزي، ما المطلوب؟ ثم أجيبي، وقارني بالنسخة المحلولة."}</div>{st}</div>'
    foot='<div class="dua">إعداد: عواطف الجهني ✨ اللهم بارك لي في أولادي ووالديّ وإخواني ووفّقهم · جهد شخصي لوجه الله، ولا يُعتمد عليه وحده</div>'
    if not solved: secs=secs.replace('<span class="t">','<span class="cue">🔎 ركّزي: ما المطلوب؟ ثم اسألي نفسك ثم أجيبي</span><br><span class="t">')
    html_=f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}{B.SOLVED_CSS if solved else ""}</style></head><body>{cover}{GUIDE_S if solved else ""}{ih}{secs}{foot}</body></html>'
    nm='sci_solved' if solved else 'sci_student'
    open(f'/tmp/sci/out/{nm}.html','w',encoding='utf-8').write(html_);return nm,n
if __name__=='__main__': print(build(True),build(False))
