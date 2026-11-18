# -*- coding: utf-8 -*-
import json,re,glob,sys
AR='٠١٢٣٤٥٦٧٨٩'
a=lambda n:str(n).translate(str.maketrans('0123456789',AR))
def num(s):
    d=''.join(str(AR.index(c)) if c in AR else c for c in s if c in AR or c.isdigit());return int(d) if d else None
def rng(pages):
    ps=sorted(set(pages));o=[];i=0
    while i<len(ps):
        j=i
        while j+1<len(ps) and ps[j+1]==ps[j]+1:j+=1
        o.append(f'ص{a(ps[i])}' if i==j else f'ص{a(ps[i])}–{a(ps[j])}');i=j+1
    return '، '.join(o) if o else '—'
FF=''.join("@font-face{font-family:'Baloo';font-weight:%d;src:url('file:///home/user/nadeen-yasin-games/darb/fonts/baloo-%d.ttf') format('truetype')}"%(w,w) for w in (400,500,600,700,800))
CSS=FF+'''@page{size:A4;margin:10mm}*{box-sizing:border-box}body{font-family:"Baloo","Noto Naskh Arabic",Tahoma,sans-serif;direction:rtl;font-size:13px;color:#2b2140;margin:0}
.ban{background:linear-gradient(135deg,#7048e8,#f06595);color:#fff;border-radius:16px;padding:10px;text-align:center;margin-bottom:8px}.ban h1{margin:0;font-size:26px}.ban div{font-size:13px}
.box{border:3px solid #7048e8;border-radius:12px;padding:6px 10px;margin:6px 0;background:#f8f5ff;break-inside:avoid}.g{background:#ebfbee;border-color:#2f9e44}.r{background:#fff0f0;border-color:#e03131}.y{background:#fff9db;border-color:#f59f00}
h2{margin:6px 0 3px;font-size:16px;color:#c2410c}table{width:100%;border-collapse:collapse;margin-bottom:6px}td,th{border:1.5px solid #7048e8;padding:3px 6px;font-size:12px;vertical-align:top}th{background:#e5dbff}
.ok{background:#d3f9d8}.low{background:#fff3bf}.no{background:#ffe3e3;font-weight:800}.pb{break-before:page}.ft{text-align:center;font-size:9px;color:#777;margin-top:6px}.big{font-size:20px;font-weight:800}'''
FT='<div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله، ولا يُعتمد عليه وحده</div>'
def status(n):
    return ('no','❌ لا أسئلة') if n==0 else (('low','⚠️ قليل') if n<=2 else ('ok','✅ جاء'))
# ---------- رياضيات ----------
sys.path.insert(0,'/home/user/nadeen-yasin-games/tools/math/scripts')
import book_pages as B
rows=json.load(open('/tmp/mh/mrows.json'))
CHR={1:(12,43),2:(46,75),3:(78,101),4:(104,135),5:(138,171),6:(174,199)}
CHN={1:'القيمة المنزلية',2:'الجمع والطرح',3:'تنظيم البيانات وعرضها وتفسيرها',4:'الأنماط والجبر',5:'الضرب في عدد من رقم واحد',6:'الضرب في عدد من رقمين'}
tot=sum(r['n'] for r in rows);app=sum(r['app'] for r in rows)
L=[r for r in rows if r['k']!='—'];Z=[r for r in L if r['n']==0]
body=f'<div class="ban"><h1>📖 أين جاءت أسئلة المركزية في كتاب الرياضيات؟</h1><div>رابع ابتدائي · الفصل الدراسي الأول · الفصول ١–٦ · اختبارات مركزية ١٤٤٧</div></div>'
body+=f'<div class="box g"><b>الخلاصة:</b> {a(tot)} سؤالاً مختلفاً (جاءت {a(app)} مرة إذا حسبنا التكرار بين المناطق) موزّعة على <b>{a(len(L)-len(Z))} من {a(len(L))}</b> درساً في الكتاب. <b>{a(len(Z))} دروس لم يأتِ عليها أي سؤال:</b> '+'، '.join(f'الدرس {r["k"].replace("-","&#8206;-&#8206;")} ({r["t"]}، {rng(range(r["s"],r["e"]+1))})' for r in Z)+'.</div>'
body+='<div class="box y"><b>كيف قرأتُ هذا؟</b> كل سؤال مربوط بدرسه في فهرس الكتاب (ص٦–٧)، فالتغطية هنا <b>بالدرس وصفحاته</b>، وليست بالصفحة الواحدة. ولا تدخل «اختبار الفصل / الاختبار التراكمي / اختبر نفسك» لأنها ليست دروساً. والأسئلة الثلاثة التي أثارت شكاً محسوبة: سؤال «موقع الرقم في العدد» (حائل) يُعرض بقراءتين، وسؤالا الشرقية (القيمة المنزلية ٢٦٠٥٧٩٢٨، وتقديرات النخيل) نعرض نسختيهما الأوضح من حفر الباطن.</div>'
for ch in range(1,7):
    rs=[r for r in L if r['ch']==ch]
    t='<table><tr><th>الدرس</th><th>صفحاته</th><th>كم سؤالاً جاء</th><th>مرات المجيء</th><th>الحالة</th></tr>'
    for r in rs:
        c,l=status(r['n']);t+=f'<tr class="{c}"><td>{r["k"].replace("-","&#8206;-&#8206;")} {r["t"]}</td><td>{rng(range(r["s"],r["e"]+1))}</td><td>{a(r["n"])}</td><td>{a(r["app"])}</td><td>{l}</td></tr>'
    t+='</table>'
    a0,b0=CHR[ch];cov=set();nq=set()
    for r in rs:
        (cov if r['n']>0 else nq).update(range(r['s'],r['e']+1))
    allp=set(range(a0,b0+1));outside=allp-cov-nq
    body+=f'<h2>الفصل {a(ch)}: {CHN[ch]} (ص{a(a0)}–{a(b0)})</h2>{t}'
    body+=f'<div class="box"><b>صفحات عليها أسئلة:</b> {rng(cov)}<br><b>صفحات دروس بلا أسئلة:</b> <span style="color:#c92a2a">{rng(nq)}</span><br><b>صفحات ليست دروساً</b> (مدخل الفصل، اختبار منتصف الفصل، مراجعة، اختبار الفصل…): {rng(outside)}</div>'
    if ch in (2,4,6): body+='<div class="pb"></div>'
body+='<div class="box r"><b>ما معنى «لا أسئلة»؟</b> أنها لم تظهر في الأوراق المركزية التي حلّلناها (حائل، الشرقية، حفر الباطن، تبوك، جازان…). لا يعني أنها مستبعدة من الاختبار، فقد تأتي في اختبار آخر. ولا يغني هذا عن مراجعة الكتاب.</div>'+FT
open('/tmp/mh/cov_math.html','w',encoding='utf-8').write(f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>')
# ---------- علوم ----------
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
C=json.load(open('/tmp/sci/clusters.json'))
FIN={}
for f in glob.glob('/tmp/sci/final/final_*.json'):
    for r in json.load(open(f)): FIN[r['id']]=r
pageq={}
for c in C:
    pg=FIN.get(c['id'],{}).get('book_page_exact','') or ''
    if not re.match(r'^ص',pg): pg='ص'+c.get('book_pages','')
    ns=[num(x) for x in re.split(r'[–\-]',pg.replace('ص','')) if num(x)]
    if len(ns)==2: ps=list(range(ns[0],ns[1]+1))
    elif ns: ps=ns
    else: ps=[]
    for p in ps: pageq.setdefault(p,[]).append(c['id'])
GA=json.load(open('/tmp/sci/gamedata_all.json'))
HFN={}
for q in GA:
    if q['id'].startswith('hf-'): HFN[q['les']]=HFN.get(q['les'],0)+1
lessons=[]
for ch in TOC:
    for l in ch['lessons']:
        qs=[c for c in C if c.get('lesson')==l['id']]
        pp=[p for p in range(l['start'],l['end']+1)]
        cov=[p for p in pp if p in pageq]
        lessons.append(dict(ch=ch,l=l,n=len(qs),app=sum(c['count'] for c in qs),rep=sum(1 for c in qs if c['count']>=2),cov=cov,unc=[p for p in pp if p not in pageq]))
intro=[c for c in C if not c.get('lesson') or c.get('lesson') not in [x['l']['id'] for x in lessons]]
tn=sum(x['n'] for x in lessons)
tp=sum(len(range(x['l']['start'],x['l']['end']+1)) for x in lessons);cp=sum(len(x['cov']) for x in lessons)
body=f'<div class="ban"><h1>📖 أين جاءت أسئلة المركزية في كتاب العلوم؟</h1><div>رابع ابتدائي · الفصل الدراسي الأول · أربع مناطق (الشرقية، حائل، عسير، الحدود الشمالية) · إجابات الأستاذة موضي الحربي</div></div>'
body+=f'<div class="box g"><b>الخلاصة:</b> {a(len(C))} سؤالاً مختلفاً (منها {a(len(intro))} من مدخل الطريقة العلمية). أسئلة الدروس {a(tn)} سؤالاً على <b>{a(len([x for x in lessons if x["n"]]))} من {a(len(lessons))}</b> درساً، وغطّت الأسئلة <b>{a(cp)} من {a(tp)}</b> صفحة من صفحات الدروس (<b>{a(round(100*cp/tp))}٪</b>). أي أن الأسئلة <b>تغطي معظم الكتاب لكن ليس كله</b>؛ والصفحات التي بلا أسئلة موضحة تحت.</div>'
body+=f'<div class="box g"><b>أسئلة المعلم هشام فرغلي:</b> {a(sum(HFN.values()))} سؤالاً إضافياً بإجاباته (من «تدريبات الاختبارات المركزية»)، موزّعة على الدروس كما في العمود الأخير. وهي أسئلة تدريب بمستوى المركزية، وبعضها نُقل من نماذج مناطق. لم تُحسب في تغطية الصفحات لأن مكانها في الكتاب تقريبي.</div>'
body+='<div class="box y"><b>كيف قرأتُها؟</b> كل سؤال له صفحة مكانه في الكتاب (من تحليلي للأجوبة والكتاب)، فالتغطية هنا <b>بالصفحة</b>. إذا كان مكان السؤال «ص٥٩–٦٢» عددتُ كل صفحاته. وبعض الأسئلة المدمجة مكانها تقريبي.</div>'
for ch in TOC:
    ls=[x for x in lessons if x['ch']['id']==ch['id']]
    body+=f'<h2>الفصل {ch["id"]}: {ch["title"]} (ص{a(ch["start"])}–{a(ch["end"])})</h2><table><tr><th>الدرس</th><th>صفحاته</th><th>أسئلة موضي</th><th>منها تكرر</th><th>الحالة</th><th>صفحات عليها أسئلة</th><th>صفحات بلا أسئلة</th><th>أسئلة هشام فرغلي</th></tr>'
    for x in ls:
        c,lab=status(x['n']);l=x['l']
        body+=f'<tr class="{c}"><td>{l["id"].replace("-","&#8206;-&#8206;")} {l["title"]}</td><td>{rng(range(l["start"],l["end"]+1))}</td><td>{a(x["n"])}</td><td>{a(x["rep"])}</td><td>{lab}</td><td>{rng(x["cov"])}</td><td style="color:#c92a2a">{rng(x["unc"])}</td><td>{a(HFN.get(l["id"],0))}</td></tr>'
    body+='</table>'
    allp=set(range(ch['start'],ch['end']+1));inl=set()
    for x in ls: inl.update(range(x['l']['start'],x['l']['end']+1))
    body+=f'<div class="box"><b>صفحات ليست ضمن دروس</b> (مدخل الفصل، مراجعة، اختبار…): {rng(allp-inl)}</div>'
body+=f'<div class="box r"><b>مهم:</b> «بلا أسئلة» تعني أنها لم تظهر في أوراق المناطق الأربع التي حلّلناها، وقد تأتي في اختبار آخر. ولا تُهمَل هذه الصفحات في المذاكرة (قلعة الذاكرة في حديقة العلوم تغطي أفكار كل الدروس).</div>'+FT
open('/tmp/mh/cov_sci.html','w',encoding='utf-8').write(f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>')
print('math',tot,app,len(Z),'sci',len(C),tn,cp,tp)
