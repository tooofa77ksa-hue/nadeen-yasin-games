# -*- coding: utf-8 -*-
import sys,json,glob,re;sys.path.insert(0,'/tmp/m4')
import build_chapter as B
D2E=str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789')
def norm(s):
    s=str(s).translate(D2E).strip()
    m=re.match(r'^(هـ|[أبجدو])\s*\)',s)
    if m:return ('L',m.group(1))
    if s.startswith(('صح','✓')) :return ('T',True)
    if s.startswith(('خط','✗')):return ('T',False)
    n=re.findall(r'\d+(?:\.\d+)?',s)
    return ('N',tuple(n)) if n else ('S',re.sub(r'\s+','',s)[:20])
def main():
    chunks={}
    for f in glob.glob('/tmp/m4/bv/chunk_*.json'):
        for x in json.load(open(f)):chunks[x['uid']]=x
    bl={}
    for f in glob.glob('/tmp/m4/bv/blind_*.json'):
        for r in json.load(open(f)):bl[r['uid']]=r
    miss=[u for u in chunks if u not in bl];print('أعمى:',len(bl),'من',len(chunks),'ناقص:',len(miss))
    bad=[]
    for u,b in bl.items():
        x=chunks[u];ch=x['chapter']
        r=B.rec(u,ch) or B.rec(u,3) or B.rec(u,4)
        if r is None: print('لا رد معتمد',u);continue
        fa=r.get('final_answer','')
        if u in B.DUAL: continue
        a,c=norm(fa),norm(b['answer'])
        ok=a==c
        if not ok and a[0]=='N' and c[0]=='N' and set(a[1])<=set(c[1]) or (a[0]=='N' and c[0]=='N' and set(c[1])<=set(a[1])): ok=True
        if not ok and a[0]=='L' and c[0]=='N':  # أعمى كتب العدد لا الحرف
            opt=[o for o in (x.get('options') or []) if o.strip().startswith(a[1]+')')]
            if opt and norm(opt[0])[1]==c[1]: ok=True
        if not ok: bad.append((u,ch,str(fa)[:60],str(b['answer'])[:60],b['confidence'],str(b.get('note'))[:80]))
    print('فروق:',len(bad))
    for r in bad:print(r)
    json.dump(bad,open('/tmp/m4/bv/diffs.json','w'),ensure_ascii=False,indent=1)
main()
