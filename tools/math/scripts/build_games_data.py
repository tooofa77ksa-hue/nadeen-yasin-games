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
def figure_html(f):
    if not f: return None
    nm=os.path.basename(f)[:-4];p=f'/tmp/m4/redraw/{nm}.html'
    if os.path.exists(p):
        h=open(p,encoding='utf-8').read()
        return h if len(h)<20000 else None
    return None
OPSPEC={
'sharqia-123':(['−'],'تبقى معه'),'hail-005':(['+'],'فكم دفع ثمناً لذلك (الكل)'),'jazan-078':(['+'],'فكم عدد اللعب التي لديها'),'qassim-177':(['+'],'في النشاطين'),
'qassim-178':(['−'],'غادر منهم'),'tabuk-053':(['−'],'بقي معه'),'jazan-091':(['−'],'فكم مللتراً من الزيت يتبقى'),'jazan-092':(['+','−'],'أعطى أصدقاءه … كم ستبقى'),
'sharqia-116':(['+'],'في الشهرين'),'tabuk-074':(['+'],'فكم دفع ثمناً لذلك'),'jazan-080':(['÷'],'كم كتاباً يمكن شحنه'),'jazan-086':(['÷'],'كم ساعة … ليتقاضى'),
'qassim-188':(['÷','×'],'٦ دببة … فما عدد النمل الذي تأكله ٣ دببة'),'tabuk-043':(['×'],'لتغليف ١٠ هدايا (كل هدية نفس الوقت)'),'qassim-174':(['×'],'لتغليف ١٠ هدايا (كل هدية نفس الوقت)'),
'hail-013':(['×'],'كل يوم'),'hail-015':(['×'],'في كل منها'),'qassim-186':(['×'],'كل يوم'),'qassim-187':(['×'],'للفرد'),'qassim-189':(['×'],'كل يوم'),'qassim-191':(['×'],'ملاعق لكل كوب'),
'sharqia-132':(['×'],'معدل … في ١٢ مباراة'),'qassim-190':(['×'],'في كل أسبوع'),'sharqia-137':(['×'],'في كل صف'),'jazan-094':(['+','−'],'أعطاها والدها … وأعطت أخاها'),'sharqia-140':(['+','−'],'أعطاها والدها … وأعطت أخاها'),
}
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
            if e['canon'] in B.DUAL: kind,ans='self',None
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
            items.append({'id':e['canon'],'k':B.sec(x),'kind':kind,'ans':ans,'q':x['text'],'o':opts,'img':img,'orig':orig,'src':B.place_label(e['models']),'n':e['n'],'sim':sim,'lesson':r.get('lesson',''),'bk':B.BP.label(r.get('lesson'),ch),'ex':ex,'fa':str(r.get('final_answer','')),'op':(OPSPEC.get(e['canon']) or (None,None))[0],'kw':(OPSPEC.get(e['canon']) or (None,None))[1],'html':figure_html(f)})
        data[ch]=items
    return data
if __name__=='__main__':
    d=build()
    import collections
    for ch,it in d.items():print(ch,len(it),collections.Counter(i['kind'] for i in it),sum(1 for i in it if i['n']>=2),sum(1 for i in it if i['op']))
    json.dump(d,open('/tmp/m4/games_data.json','w'),ensure_ascii=False)
