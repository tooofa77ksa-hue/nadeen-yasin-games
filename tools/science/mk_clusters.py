import json,collections
R={'sharqia':'الشرقية','hail':'حائل','asir':'عسير','north':'الشمالية'}
Q={}
for r in R:
    for q in json.load(open(f'/tmp/sci/ext/{r}.json')): Q[q['uid']]=q
toc=json.load(open('/tmp/sci/book_toc.json'))
L={}
for c in toc['chapters']:
    for l in c['lessons']: L[l['id']]=(c['title'],l['title'],l['start'],l['end'])
def ar(n): return str(n).translate(str.maketrans('0123456789','٠١٠٢٣٤٥٦٧٨٩'.replace('٠١٠','٠١٢')))
def ar(n): return ''.join('٠١٢٣٤٥٦٧٨٩'[int(c)] for c in str(n))
# lesson assignment
LS={
'١-١':"sharqia-1-4 sharqia-1-9 sharqia-3b-1 sharqia-3c-1 hail-1-1 hail-1-2 hail-1-3 hail-1-7 hail-2a-2 hail-4b-1 asir-1-10 asir-4a asir-4b asir-4c-1 north-1a-1 north-1a-2 north-2a-1 north-2a-2 north-2a-12 north-2a-13 north-4-1",
'١-٢':"sharqia-1-7 sharqia-2a-4 hail-1-5 hail-1-6 hail-2a-3 hail-3ب hail-4b-3 asir-3a-6 north-4-5",
'٢-١':"sharqia-3a sharqia-3b-2 sharqia-3c-2 hail-1-8 hail-1-9 hail-1-12 hail-3ج hail-4b-2 asir-2a-1 north-1a-3 north-1b-1",
'٢-٢':"sharqia-3c-3 sharqia-4-4a hail-1-11 hail-2a-4 hail-3a asir-1-4 asir-2a-3 asir-3a-2 asir-3a-5 asir-3c north-1a-4 north-2a-3 north-2a-11",
'٢-٣':"sharqia-1-2 sharqia-1-8 sharqia-2a-3 hail-1-10 hail-2a-5 hail-3د asir-1-5 asir-1-6 asir-2a-2 north-1a-5 north-2a-4",
'٣-١':"sharqia-1-10 sharqia-2b-2 hail-1-13 hail-2a-10 asir-1-1 asir-3a-3 asir-4c-2 north-1a-6 north-2a-5",
'٣-٢':"sharqia-3b-3 sharqia-4-3a sharqia-4-3b hail-1-14 hail-2a-6 hail-4a hail-4c asir-1-2 asir-2b north-1a-7 north-2a-6 north-2a-14",
'٣-٣':"sharqia-2a-1 sharqia-2a-6 sharqia-2b-1 asir-3a-1 asir-3a-4 north-1a-8 north-4-2",
'٤-١':"sharqia-1-6 sharqia-2a-5 sharqia-4-2 hail-1-15 hail-2a-7 hail-2a-8 asir-1-9 asir-2a-5 north-1a-9 north-2a-7 north-2a-10 north-3-1 north-4-3",
'٤-٢':"sharqia-1-1 sharqia-2a-2 sharqia-2c asir-1-8 asir-2a-4 north-2a-8",
'٥-١':"sharqia-1-3 sharqia-1-5 sharqia-5-2 asir-2c asir-3b north-2b-1 north-2b-2 north-2a-15",
'٥-٢':"sharqia-4-1 sharqia-4-4b sharqia-4-5 hail-1-4 hail-2a-9 asir-1-3 asir-1-7 north-1a-10 north-2a-9 north-4-4",
'م':"sharqia-5-1 hail-2a-1 asir-2a-6",
}
lesson_of={}
for k,v in LS.items():
    for u in v.split(): lesson_of[u]=k
missing=[u for u in Q if u not in lesson_of]; extra=[u for u in lesson_of if u not in Q]
assert not missing and not extra,(missing,extra)
G=[ # members, kind
("sharqia-2a-5 north-4-3","similar"),
("asir-1-9 north-2a-10","similar"),
("north-1a-9 sharqia-4-2","similar"),
("hail-2a-8 asir-2a-5 north-2a-7","identical"),
("sharqia-2a-4 north-4-5","identical"),
("asir-1-10 north-2a-1","identical"),
("sharqia-3b-1 north-2a-2 north-2a-13 asir-4b","similar"),
("hail-4b-1 north-1a-2","similar"),
("sharqia-1-4 hail-2a-2 north-1a-1","similar"),
("sharqia-1-9 hail-1-3","similar"),
("sharqia-1-7 sharqia-3b-2 hail-1-9 north-2a-3 asir-3c","similar"),
("asir-2a-1 sharqia-3c-2 hail-1-8","similar"),
("sharqia-3c-3 hail-1-11 asir-1-4 north-1a-4 asir-3a-5","similar"),
("asir-2a-3 north-2a-11","similar"),
("sharqia-4-4a hail-2a-4","similar"),
("hail-2a-5 asir-2a-2 north-2a-4","similar"),
("sharqia-2a-3 north-1a-5","similar"),
("sharqia-1-8 asir-1-5","similar"),
("sharqia-2a-2 north-2a-8 asir-2a-4","similar"),
("asir-1-1 north-1a-6","similar"),
("sharqia-2b-2 hail-1-13 north-2a-5 asir-3a-3 asir-4c-2","similar"),
("asir-1-2 north-2a-6","identical"),
("north-1a-7 sharqia-4-3a sharqia-4-3b hail-4a hail-2a-6","similar"),
("sharqia-3b-3 asir-2b north-2a-14 hail-4c","similar"),
("asir-3a-1 north-1a-8","similar"),
("sharqia-1-3 asir-3b north-2b-1 north-2b-2","similar"),
("sharqia-5-2 asir-2c","similar"),
("asir-1-3 north-1a-10 sharqia-4-5","identical"),
("asir-1-7 north-2a-9 hail-2a-9","similar"),
("hail-1-4 north-1a-9x","similar"),
("sharqia-5-1 asir-2a-6 hail-2a-1","similar"),
]
G=[(m.replace('north-1a-9x','hail-2a-7'),k) for m,k in G]
# obesity: north-1a-9 already in non-infectious group -> hail-1-4 pairs with hail-2a-7? fix: keep hail-1-4 alone and hail-2a-7 alone
G=[(m,k) for m,k in G if m!="hail-1-4 hail-2a-7"]
seen=collections.Counter(u for m,_ in G for u in m.split())
assert all(c==1 for c in seen.values()),[u for u,c in seen.items() if c>1]
assert all(u in Q for u in seen)
for m,_ in G:
    ls={lesson_of[u] for u in m.split()}
    if len(ls)>1: print('mixed lesson',m,ls)
groups=[(m.split(),k) for m,k in G]
ing={u for m,_ in groups for u in m}
for u in Q:
    if u not in ing: groups.append(([u],'single'))
tname={'mcq':'اختيار من متعدد','tf':'صح وخطأ','fill':'إكمال/تصويب','word_fill':'إكمال/تصويب','short':'سؤال قصير','match':'مطابقة','table':'جدول','diagram':'رسم/شكل'}
tmap={'mcq':'mcq','tf':'tf','fill':'fill','word_fill':'fill','short':'short','match':'match','table':'short','diagram':'diagram'}
order={u:i for i,u in enumerate(Q)}
out=[]
for m,k in groups:
    m=sorted(m,key=lambda u:order[u])
    regs=[]
    for u in m:
        r=R[Q[u]['region']and u.split('-')[0]]
        if r not in regs: regs.append(r)
    les=lesson_of[m[0]]
    if 'sharqia-1-7' in m: les='٢-٢'
    if les=='م':
        lid='';lt='الطريقة العلمية (مدخل الكتاب)';bp='١٠';ch='مدخل'
    else:
        c,lt,s,e=L[les];lid=les;bp=f'{ar(s)}–{ar(e)}';ch=c
    types=[Q[u]['type'] for u in m]
    t=tmap[collections.Counter(types).most_common(1)[0][0]]
    note=''
    if k!='single' and len(set(types))>1 or (k!='single' and len(regs)>1):
        parts=[]
        for u in m:
            q=Q[u];parts.append(f"{R[u.split('-')[0]]} ({q['q_label']}): {tname.get(q['type'],q['type'])}")
        note='؛ '.join(parts)
    if len(m)==1 and Q[m[0]]['type']=='match': t='match'
    out.append({"canonical_uid":m[0],"members":m,"kind":k,"regions":regs,"count":len(regs),"form_note":note,"chapter":ch,"lesson":lid,"lesson_title":lt,"book_pages":bp,"type":t,"answer_conflict":""})
out.sort(key=lambda x:order[x['canonical_uid']])
for i,o in enumerate(out,1):
    o={'id':f's-{i:03d}',**o}; out[i-1]=o
json.dump(out,open('/tmp/sci/clusters.json','w'),ensure_ascii=False,indent=1)
print(len(Q),len(out),sum(1 for o in out if o['count']>=2))
for o in sorted([o for o in out if o['count']>=2 or len(o['members'])>1],key=lambda o:(-o['count'],-len(o['members']))):
    print(o['id'],o['count'],len(o['members']),o['kind'],o['lesson'],o['members'][:3],Q[o['members'][0]]['text'][:40])
d=collections.Counter(); dd=collections.Counter()
for o in out: d[o['chapter']]+=1; dd[(o['lesson'],o['lesson_title'])]+=1
print(d);print(dd)
