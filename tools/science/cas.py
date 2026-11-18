# -*- coding: utf-8 -*-
import json,re,glob,os
Q=json.load(open('/tmp/sci/gamedata.json'))
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
cas={}
def add(les,t,p):
    t=re.sub(r'\s+',' ',t).strip().rstrip('.')+'.'
    if len(t.split())>32 or len(t.split())<4: return
    L=cas.setdefault(les,[])
    k=re.sub(r'[^ء-ي]','',t)[:28]
    if any(re.sub(r'[^ء-ي]','',x['t'])[:28]==k for x in L): return
    L.append({'t':t,'p':p})
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
# sort each lesson by page number
def pg(x):
    d=''.join(str('٠١٢٣٤٥٦٧٨٩'.index(c)) for c in x['p'] if c in '٠١٢٣٤٥٦٧٨٩');return int(d or 0)
for k in cas: cas[k].sort(key=pg)
print({k:len(v) for k,v in sorted(cas.items())})
open('/home/user/nadeen-yasin-games/olom/cas.js','w',encoding='utf-8').write('window.CAS='+json.dumps(cas,ensure_ascii=False)+';')
