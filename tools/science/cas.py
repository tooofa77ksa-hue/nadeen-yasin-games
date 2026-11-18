# -*- coding: utf-8 -*-
import json,re,glob,os
Q=json.load(open('/tmp/sci/gamedata.json'))
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
cas={}
def add(les,t,p,src='من كتابك'):
    t=re.sub(r'\s+',' ',t).strip().rstrip('.')+'.'
    if len(t.split())>32 or len(t.split())<4: return
    L=cas.setdefault(les,[])
    k=re.sub(r'[^ء-ي]','',t)[:28]
    if any(re.sub(r'[^ء-ي]','',x['t'])[:28]==k for x in L): return
    L.append({'t':t,'p':p,'s':src})
for q in Q:
    if q['quote'] and not q['quote'].startswith('لم أجد') and q['les']!='—': add(q['les'],q['quote'],q['page'])
for ch in TOC:
    for l in ch['lessons']:
        for k in l['key_ideas']:
            m=re.match(r'^\[(.*?)\]\s*(.*)$',k)
            if m: add(l['id'],m.group(2),m.group(1))
for f in glob.glob('/tmp/sci/ki/*.json'):
    les=os.path.basename(f)[:-5].replace('-','-')
    les=''.join('٠١٢٣٤٥٦٧٨٩'[int(c)] if c.isdigit() else c for c in les)
    for x in json.load(open(f)): add(les,x['t'],x['p'])
BAD=re.compile(r'مو[تت]|تموت|موته|ميت|قتل|يقضي|تقضي|القضاء|الصيد الجائر|فريسة|فرائس|مفترس')
AD='٠١٢٣٤٥٦٧٨٩'
for f in sorted(glob.glob('/tmp/hf/mz_*.json')):
    for x in json.load(open(f)):
        les=x.get('lesson','')
        if les not in [l['id'] for ch in TOC for l in ch['lessons']]: continue
        t=(x['title']+': '+x['text']) if x['kind']=='term' else (x['title']+': '+x['text'] if x['kind']=='compare' else x['text'])
        if BAD.search(t) or BAD.search(x.get('note','')): continue
        pg=''.join(AD[int(c)] for c in str(x['page']))
        add(les,t,'ص'+pg+' من المذكرة','مذكرة هشام فرغلي')
# sort each lesson by page number
def pg(x):
    d=''.join(str('٠١٢٣٤٥٦٧٨٩'.index(c)) for c in x['p'] if c in '٠١٢٣٤٥٦٧٨٩');return int(d or 0)
for k in cas: cas[k].sort(key=lambda x:(1 if 'المذكرة' in x['p'] else 0,pg(x)))
print({k:len(v) for k,v in sorted(cas.items())})
open('/home/user/nadeen-yasin-games/olom/cas.js','w',encoding='utf-8').write('window.CAS='+json.dumps(cas,ensure_ascii=False)+';')
