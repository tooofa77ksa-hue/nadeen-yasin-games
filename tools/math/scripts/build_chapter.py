# -*- coding: utf-8 -*-
import json,glob,re,os,html,sys,collections
sys.path.insert(0,'/tmp/m4')
exec(open('/tmp/m4/build_pdfs.py',encoding='utf-8').read().split("if __name__")[0])   # FIN(ch4/5), H, CSS, SECS...
ITEMS={x['uid']:x for x in json.load(open('/tmp/m4/rep/all_items.json'))}
F3={}
for f in sorted(glob.glob('/tmp/m4/ch3/final3_*.json')):
    for r in json.load(open(f)):
        r['uid']=r['uid'].translate(str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789')); F3[r['uid']]=r
REG={'hail':'حائل','tabuk':'تبوك','jazan':'جازان','sharqia':'الشرقية','hafr':'حفر الباطن','qassim':'القصيم'}
ANS_PAGES={3,6,9,10,13,14,17,18,21,22,25,26,33,35,36,41,46,48,51,53,54,55,60,61,62,63}
UNSAFE={'p2_p35_2','p2_p35_4','p2_p35_5','qassim_p2_12','qassim_p2_13','qassim_p4_2t','sharqia_p4_4b','qassim_p4_2z_draw','qassim_p4_3hh','qassim_p3_2c'}
F7={}
for f in sorted(glob.glob('/tmp/m4/c126/final7_*.json')):
    for r in json.load(open(f)): F7[r['uid'].translate(str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789'))]=r
def rec(u,ch):
    if ch in (1,2,6):
        r=F7.get(u)
        if not r or str(r.get('final_chapter'))!=str(ch) or r.get('unsafe'): return None
        return r
    if ch==5:
        r=FIN.get(u)
        if not r or str(r.get('final_chapter'))!='5': return None
        return r
    if ch==4:
        r=FIN.get(u); 
        if not r or str(r.get('final_chapter'))!='4': return None
        return r
    r=F3.get(u)
    if not r or str(r.get('final_chapter'))!='3': return None
    return r
def place_label(models):
    cen=[REG[m] for m in REG if m in models]
    p2=sorted(int(m[1:]) for m in models if m.startswith('M'))
    s=[]
    if cen: s.append('تعليم '+'، تعليم '.join(cen))
    if p2: s.append('الفترة الثانية: '+('نموذج ' if len(p2)==1 else 'نماذج ')+'، '.join(str(n).translate(AR) for n in p2))
    return ' · '.join(s)
def sec(x):
    t=x.get('type');return 'word' if t=='word' else 'mcq' if t=='mcq' else 'tf' if t=='tf' else 'other'
HIDE={'p2-209','p2-324'}  # جواب غير مؤكد أو خطأ في السؤال نفسه: لا تُعرض على نادين حتى تراجعها ولية الأمر
def entries(ch):
    import os as _os
    out=json.load(open(f'/tmp/m4/rep/out_all_{ch}.json' if _os.path.exists(f'/tmp/m4/rep/out_all_{ch}.json') else f'/tmp/m4/rep/out_{ch}.json'))
    dups=set()
    for pair in out.get('dups_within_model',[]):
        pair=[u for u in pair if u in ITEMS]
        for u in pair[1:]: dups.add(u)
    uids=[u for u,x in ITEMS.items() if x['chapter']==ch or (rec(u,ch) is not None)]
    uids=[u for u in uids if rec(u,ch) is not None and u not in dups]
    exact={};sim=collections.defaultdict(set)
    par={}
    def f(a):
        while par.setdefault(a,a)!=a: par[a]=par[par[a]]; a=par[a]
        return a
    for k in out.get('clusters',[]):
        ms=[u for u in k['members'] if u in uids]
        if k['kind']=='مطابق':
            for u in ms[1:]: par[f(u)]=f(ms[0])
    groups=collections.defaultdict(list)
    for u in uids: groups[f(u)].append(u)
    sim_of=collections.defaultdict(set)
    for k in out.get('clusters',[]):
        ms=[u for u in k['members'] if u in uids]
        if k['kind']!='مطابق':
            for u in ms: sim_of[f(u)].update(f(v) for v in ms if v!=u)
    ents=[]
    for root,ms in groups.items():
        if any(u in HIDE for u in ms): continue
        canon=None
        for k in out.get('clusters',[]):
            if k['canonical_uid'] in ms: canon=k['canonical_uid'];break
        if canon is None: canon=max(ms,key=lambda u:(bool(ITEMS[u].get('figure')),len(ITEMS[u]['text'])))
        models=sorted({ITEMS[u]['model'] for u in ms})
        sims=set()
        for r2 in sim_of.get(root,()):
            for u in groups.get(r2,[]): sims.add(ITEMS[u]['model'])
        ents.append({'canon':canon,'members':ms,'models':models,'sim_models':sorted(sims-set(models)),'n':len(models)})
    return ents
def fig_html_ch(x,solved):
    f=x.get('figure')
    if not f or not os.path.exists(f): return ''
    nm=os.path.basename(f)[:-4]; rd=f'/tmp/m4/redraw/{nm}.png'
    m=re.match(r'p2_p(\d+)_',nm); anspage=bool(m and int(m.group(1)) in ANS_PAGES)
    if solved: return f'<div class="fig"><img src="file://{f}"></div>'
    if os.path.exists(rd):
        if nm in UNSAFE or anspage: return f'<div class="fig"><img src="file://{rd}" style="filter:none"></div>'
        return f'<div class="fig2"><div class="redr"><img src="file://{rd}"></div><div class="orig"><img src="file://{f}"><div>الصورة الأصلية في الورقة</div></div></div>'
    return f'<div class="fig"><img src="file://{f}"></div>'
def q_html_ch(i,e,ch,solved):
    x=ITEMS[e['canon']];r=rec(e['canon'],ch)
    h=f'<div class="q"><span class="n">{str(i).translate(AR)}</span><span class="t">{H(x["text"])}</span>'
    if x.get('options'): h+='<div class="opts">'+''.join(f'<div>{H(o)}</div>' for o in x['options'])+'</div>'
    h+=fig_html_ch(x,solved)
    if not solved:
        if x.get('type') not in ('mcq','tf','match'): h+='<div class="ln"></div><div class="ln"></div>'
        elif x.get('type')=='tf': h+='<div style="margin-top:3px">( &nbsp;&nbsp;&nbsp;&nbsp; ) صح &nbsp;&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp; ) خطأ</div>'
    src='جاء في: '+place_label(e['models'])+(f' — تكرر في {str(e["n"]).translate(AR)} نماذج' if e['n']>=2 else '')
    h+=f'<div class="src">{H(src)}</div>'
    if e['sim_models']: h+=f'<div class="src" style="color:#555">ونفس الفكرة بأرقام أخرى جاءت في: {H(place_label(e["sim_models"]))}</div>'
    if solved:
        ex=r.get('explain') or {}
        h+='<div class="sol">'
        if ex.get('task'): h+=f'<div class="red">① أول شيء: {H(ex["task"])}</div>'
        if ex.get('think'): h+=f'<div><b>② {H(ex["think"])}</b></div>'
        for s in ex.get('steps',[]) or []: h+=f'<div class="step">• {H(s)}</div>'
        h+=f'<div class="ans">{H(ex.get("answer") or r.get("final_answer",""))}</div>'
        if ex.get('why'): h+=f'<div class="why"><b>ليش؟</b> {H(ex["why"])}</div>'
        if ex.get('tip'): h+=f'<div class="tip">💡 {H(ex["tip"])}</div>'
        h+='</div>'
    return h+'</div>'
ORDER=[('tf','أولاً: صح وخطأ'),('mcq','ثانياً: اختيار من متعدد'),('word','ثالثاً: مسائل لفظية'),('other','رابعاً: جداول ورسوم وأسئلة أخرى')]
CHN={1:'الفصل الأول: القيمة المنزلية',2:'الفصل الثاني: الجمع والطرح',5:'الفصل الخامس: الضرب في عدد من رقم واحد',6:'الفصل السادس: الضرب في عدد من رقمين',3:'الفصل الثالث: تنظيم البيانات وعرضها وتفسيرها',4:'الفصل الرابع: الأنماط والجبر'}
def build_ch(ch,solved,src=None,body_only=False):
    es=entries(ch)
    if src:
        keep=[]
        for e in es:
            ms=[m for m in e['models'] if (m.startswith('M'))==(src=='period')]
            if ms: e=dict(e,models=ms,n=len(ms),sim_models=[m for m in e['sim_models'] if (m.startswith('M'))==(src=='period')]);keep.append(e)
        es=keep
    es.sort(key=lambda e:(-e['n'],ITEMS[e['canon']]['src_id'],ITEMS[e['canon']]['page']))
    tot=len(es); rep=sum(1 for e in es if e['n']>=2)
    b=f'<h1>{CHN[ch]}{" — محلول" if solved else ""}</h1><div class="sub">'+({'period':'من نماذج اختبارات الفترة الثانية فقط','central':'من الاختبارات المركزية (٦ مناطق) فقط',None:'من الاختبارات المركزية ونماذج الفترة الثانية'}[src])+' ، نصاً كما هو. السؤال المتكرر مكتوب مرة واحدة وتحته مواضع تكراره.</div>'
    b+='<div class="note">'+('<b>طريقة الحل:</b> أول شيء نقرأ السؤال ونحدد المطلوب ونسأل أنفسنا: ماذا يُطلب؟ ماذا أعرف؟ بعدين نحل ونتأكد. <b>الأحمر هو أول خطوة دايماً.</b>' if solved else '<b>للطالبة:</b> أقرأ السؤال أولاً، وأحدد المطلوب، وأسأل نفسي: ماذا أعرف؟ ماذا أريد؟ ثم أحل.')+f' &nbsp;|&nbsp; عدد الأسئلة: {tot} (منها {rep} تكررت في أكثر من نموذج)'.translate(AR)+'</div>'
    n=0
    for sk,sn in ORDER:
        part=[e for e in es if sec(ITEMS[e['canon']])==sk]
        if not part: continue
        b+=f'<h2>{sn} ({len(part)})'.translate(AR)+'</h2>'
        for e in part:
            n+=1;b+=q_html_ch(n,e,ch,solved)
    if solved:
        flaws=[(e,rec(e['canon'],ch)) for e in es if rec(e['canon'],ch).get('flaw') or (rec(e['canon'],ch).get('notes') and re.search('خطأ|خاطئ',str(rec(e['canon'],ch).get('notes'))))]
        b+='<h2 style="break-before:page">للأم: ما صحّحناه في الأوراق (لا يُعرض على الطالبة)</h2><table class="ap"><tr><th>المصدر</th><th>السؤال</th><th>الملاحظة وما اعتمدناه</th></tr>'
        for e,r in flaws:
            x=ITEMS[e['canon']];b+=f'<tr><td>{H(place_label(e["models"]))}</td><td>{H(x["text"][:90])}</td><td>{H(str(r.get("flaw") or "")+" "+str(r.get("notes") or ""))}</td></tr>'
        b+='</table>'
    if body_only: return b
    htm=f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{b}</body></html>'
    name=f'chapter{ch}{"_"+src if src else ""}_{"solved" if solved else "unsolved"}'
    open(f'/tmp/m4/out/{name}.html','w',encoding='utf-8').write(htm);return name,tot,rep
if __name__=='__main__':
    for ch in (3,4):
        for sr in ('period','central'):
            for s in (False,True): print(build_ch(ch,s,sr))
