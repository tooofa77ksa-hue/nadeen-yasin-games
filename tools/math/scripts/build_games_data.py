# -*- coding: utf-8 -*-
import sys,re,json,os,shutil;sys.path.insert(0,'/tmp/m4')
import build_chapter as B
OUT='/home/user/nadeen-yasin-games/markaz'
os.makedirs(OUT+'/img',exist_ok=True)
D2E=str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789')
def parse_ans(fa,opts,x):
    fa=str(fa or '').strip()
    ci=-1
    if opts:
        m=re.match(r'\s*(هـ|[أبجد])\s*\)?',fa)
        if m:
            for i,o in enumerate(opts):
                if o.strip().startswith(m.group(1)+')'): ci=i
        if ci<0:
            norm=lambda s:re.sub(r'^[أبجد]\)\s*','',s).strip()
            for i,o in enumerate(opts):
                if norm(o)==norm(fa): ci=i
        if ci>=0: return ('mcq',ci)
    if x.get('type')=='tf' or re.match(r'^(صح|خطأ|خطا|✓|✗)',fa):
        if fa.startswith('صح') or fa.startswith('✓'): return ('tf',True)
        if fa.startswith('خط') or fa.startswith('✗'): return ('tf',False)
    nums=re.findall(r'\d+(?:\.\d+)?',fa.translate(D2E))
    if len(nums)==1 and len(fa)<40 and not opts: return ('num',float(nums[0]))
    return ('self',None)
OPS={'+':['نجمع','جمع','نضم'],'−':['نطرح','طرح'],'×':['نضرب','ضرب'],'÷':['نقسم','قسمة']}
def guess_op(ex):
    t=' '.join([ex.get('think') or '',' '.join(ex.get('steps') or []),ex.get('answer') or ''])
    hit=[o for o,ws in OPS.items() if any(w in t for w in ws)]
    return hit[0] if len(hit)==1 else None
def tohtml(s): return s
def build():
    data={}
    for ch in (1,2,3,4,5,6):
        es=B.entries(ch)
        keep=[]
        for e in es:
            ms=[m for m in e['models'] if not m.startswith('M')]
            if ms: keep.append(dict(e,models=ms,n=len(ms),sim_models=[m for m in e['sim_models'] if not m.startswith('M')]))
        keep.sort(key=lambda e:({'tf':0,'mcq':1,'word':2,'other':3}[B.sec(B.ITEMS[e['canon']])],-e['n'],B.ITEMS[e['canon']]['page']))
        items=[]
        for e in keep:
            x=B.ITEMS[e['canon']];r=B.rec(e['canon'],ch)
            if r is None: continue
            ex=r.get('explain') or {}
            opts=x.get('options') or []
            kind,ans=parse_ans(r.get('final_answer'),opts,x)
            img=orig=None;f=x.get('figure')
            if f and os.path.exists(f):
                nm=os.path.basename(f)[:-4];rd=f'/tmp/m4/redraw/{nm}.png'
                src=rd if os.path.exists(rd) else f
                shutil.copy(src,f'{OUT}/img/{nm}.png');img=f'img/{nm}.png'
                m=re.match(r'p2_p(\d+)_',nm)
                if os.path.exists(rd) and not(nm in B.UNSAFE or (m and int(m.group(1)) in B.ANS_PAGES)):
                    from PIL import Image
                    im=Image.open(f).convert('L');im.thumbnail((300,300));im.save(f'{OUT}/img/{nm}_o.jpg',quality=70);orig=f'img/{nm}_o.jpg'
            sim=B.place_label(e['sim_models']) if e['sim_models'] else ''
            items.append({'id':e['canon'],'k':B.sec(x),'kind':kind,'ans':ans,'q':x['text'],'o':opts,'img':img,'orig':orig,'src':B.place_label(e['models']),'n':e['n'],'sim':sim,'lesson':r.get('lesson',''),'ex':ex,'fa':str(r.get('final_answer','')),'op':guess_op(ex) if B.sec(x)=='word' else None})
        data[ch]=items
    return data
if __name__=='__main__':
    d=build()
    import collections
    for ch,it in d.items():print(ch,len(it),collections.Counter(i['kind'] for i in it),sum(1 for i in it if i['n']>=2),sum(1 for i in it if i['op']))
    json.dump(d,open('/tmp/m4/games_data.json','w'),ensure_ascii=False)
