# -*- coding: utf-8 -*-
import json,re,glob,os,subprocess,difflib
R='/home/user/nadeen-yasin-games/olom'
Q=json.load(open('/tmp/sci/gamedata.json'))
# رجّع أي إضافات سابقة (إعادة بناء نظيفة من mkgame)
Q=[q for q in Q if not q['id'].startswith('hf-')]
for q in Q:
    q.setdefault('qs','كتابك'); q['src2']=[]
CAS=json.loads(open(R+'/cas.js',encoding='utf-8').read().split('=',1)[1].rstrip().rstrip(';'))
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
LES={l['id']:(ch['id'],ch['title'],l['title'],l['start'],l['end']) for ch in TOC for l in ch['lessons']}
AD='٠١٢٣٤٥٦٧٨٩'
ar=lambda n:''.join(AD[int(c)] for c in str(n))
def norm(t): return re.sub(r'[^ء-ي0-9]','',re.sub(r'[ً-ْ]','',t or ''))
def words(t): return set(w for w in re.findall(r'[ء-ي]{3,}',re.sub(r'[ً-ْ]','',t or '')))
def img(src,name):
    if not src or not os.path.exists(src): return None
    out=f'{R}/img/{name}.jpg'
    subprocess.run(['convert',src,'-background','white','-flatten','-resize','720x720>','-quality','72',out],check=True)
    return f'img/{name}.jpg'
H=[]
for f in sorted(glob.glob('/tmp/hf/td_*.json')): H+=json.load(open(f))
added=merged=0
for x in H:
    les=x.get('lesson') or ''
    if x.get('answer') in (None,''): continue
    L=LES.get(les)
    typ={'mcq':'mcq','tf':'tf'}.get(x['type'],'self')
    ans=str(x['answer']).strip()
    text=x['text'].strip()
    opts=x.get('options') or []
    tbl=None
    if x['type']=='match' and opts: tbl='الخيارات: '+' | '.join(opts)
    if x['type']=='fill' and x.get('note','').startswith('من بنك الكلمات'): tbl=x['note']
    letter=None
    if typ=='mcq':
        m=re.match(r'^\s*([أبجد])\s*\)',ans)
        if not m or len(opts)<2: typ='self'
        else: letter=m.group(1)
    if typ=='tf':
        a=re.sub(r'[✓✗✔✘\s]','',ans)
        if a not in('صح','خطأ','خطا'): typ='self'
        else: ans='صح' if a=='صح' else 'خطأ'
    srcline='تدريبات المركزية — هشام فرغلي ص'+ar(x['page'])+(' س'+ar(x['num']) if str(x['num']).isdigit() else (' س'+str(x['num'])))
    # دمج المكرر
    dup=None
    nt=norm(text)
    for q in Q:
        if q['type']==typ and q['ch']==(L[0] if L else q['ch']) and difflib.SequenceMatcher(None,norm(q['text'])[:120],nt[:120]).ratio()>0.86 and norm(q['ans'])[:12]==norm(ans)[:12]:
            dup=q;break
    if dup:
        if srcline not in dup['src2']: dup['src2'].append(srcline)
        merged+=1;continue
    # أقرب جملة من القلعة لنفس الدرس
    ww=words(text+' '+ans);best=None;bs=0
    for c in CAS.get(les,[]):
        sc=len(ww&words(c['t']))
        if sc>bs: bs,best=sc,c
    quote=best['t'] if best and bs>=2 else ''
    Q.append({'id':f'hf-{x["page"]}-{x["num"]}','type':typ,'text':text,'options':opts if typ=='mcq' else [],'letter':letter,'table':tbl,
      'fig':img(x.get('fig'),f'hf_{x["page"]}_{x["num"]}'),'ans':ans,'count':1,'regions':[],'src':srcline,'src2':[],
      'ch':L[0] if L else '—','chT':L[1] if L else '','les':les or '—','lesT':L[2] if L else '','les_pp':(f'ص{L[3]}–{L[4]}' if L else ''),
      'page':best['p'] if quote else '','think':'','task':'','steps':[],'why':'','tip':'','quote':quote,'qs':best['s'] if quote else '','bfig':None,'bfigp':'','conf':''})
    added+=1
NOTE='للأم (لا تظهر لنادين في اللعبة): قرار ولية الأمر أن إجابة المعلم هشام فرغلي هي المعتمدة عند التعارض. في هذا السؤال إجابة الأستاذة موضي «الكروموسوم»، وفي كتاب نادين ص٣٠ أن النواة تتحكم في أنشطة الخلية.'
byid={q['id']:q for q in Q}
s35=byid.get('s-035');h21=byid.get('hf-3-21')
if s35 and h21:
    s35.update({'letter':'أ','ans':h21['ans'],'ovr':True,'conf':'','pconf':NOTE,'steps':[],'why':'','tip':'','think':'','quote':'','qs':'','page':''})
    s35['src2']=[h21['src']]
    Q=[q for q in Q if q['id']!='hf-3-21']
json.dump(Q,open('/tmp/sci/gamedata_all.json','w'),ensure_ascii=False)
open(R+'/data.js','w',encoding='utf-8').write('window.SCI='+json.dumps(Q,ensure_ascii=False)+';')
print('added',added,'merged',merged,'total',len(Q))
