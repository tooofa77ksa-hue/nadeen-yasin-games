# -*- coding: utf-8 -*-
import json,glob,os,re,subprocess
R='/home/user/nadeen-yasin-games/olom'
os.makedirs(R+'/img',exist_ok=True)
C=json.load(open('/tmp/sci/clusters.json'))
EXT={}
for f in ('sharqia','hail','asir','north'):
    for x in json.load(open(f'/tmp/sci/ext/{f}.json')): EXT[x['uid']]=x
FIN={}
for f in glob.glob('/tmp/sci/final/final_*.json'):
    for r in json.load(open(f)): FIN[r['id']]=r
TOC=json.load(open('/tmp/sci/book_toc.json'))['chapters']
LES={l['id']:(ch['id'],ch['title'],l['title'],l['start'],l['end']) for ch in TOC for l in ch['lessons']}
def img(src,name):
    if not src or not os.path.exists(src): return None
    out=f'{R}/img/{name}.jpg'
    subprocess.run(['convert',src,'-background','white','-flatten','-resize','720x720>','-quality','72',out],check=True)
    return f'img/{name}.jpg'
def clean(a): return re.sub(r'\s*\((محاطة|الكلمة الصحيحة|محاط)[^)]*\)','',a or '').strip()
Q=[]
for c in C:
    x=EXT[c['canonical_uid']];f=FIN.get(c['id'],{});e=f.get('explain') or {}
    ans=clean(x.get('model_answer'))
    typ='self'
    if x.get('options') and x.get('answer_letter') and len(ans)<60: typ='mcq'
    elif x['type']=='tf' and re.match(r'^(صح|خطأ|خطا)\s*$',ans): typ='tf'
    L=LES.get(c.get('lesson'))
    Q.append({'id':c['id'],'type':typ,'text':x['text'],'options':x.get('options') or [],'letter':x.get('answer_letter'),
     'table':x.get('table_text'),'fig':img(x.get('figure'),c['id']+'_q'),'ans':ans,
     'count':c['count'],'regions':c['regions'],
     'ch':L[0] if L else '—','chT':L[1] if L else 'مدخل الطريقة العلمية','les':c.get('lesson') or '—','lesT':L[2] if L else 'الطريقة العلمية',
     'les_pp':(f'ص{L[3]}–{L[4]}' if L else ''),'page':f.get('book_page_exact') or '',
     'think':re.sub(r'^(اسألي نفسك|نسأل أنفسنا)\s*:?\s*','',str(e.get('think') or '')).strip(),
     'task':e.get('task') or '','steps':e.get('steps') or [],'why':e.get('why') or '','tip':e.get('tip') or '',
     'quote':f.get('book_quote') if isinstance(f.get('book_quote'),str) else '','bfig':img(f.get('book_fig'),c['id']+'_b'),'bfigp':f.get('book_fig_page') or '','conf':f.get('conflict') or ''})
from collections import Counter
print(Counter(q['type'] for q in Q),len(Q))
json.dump(Q,open('/tmp/sci/gamedata.json','w'),ensure_ascii=False)
