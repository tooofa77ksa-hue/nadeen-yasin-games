import json,sys,re
sys.path.insert(0,'/tmp/m4/coach')
import validate
T=open('/tmp/m4/coach/template.html',encoding='utf-8').read()
out='/home/user/nadeen-yasin-games/nadeen/'
b4=json.load(open('book_ch4.json')); b5=json.load(open('book_ch5.json')); c=json.load(open('central_ch45.json'))
l4=json.load(open('ch4_lessons.json'))
for f in ('book_ch4.json','book_ch5.json','central_ch45.json'):
    e=validate.check('/tmp/m4/coach/'+f); assert not e,(f,e)
T4={'1':'٤-١ العبارات والجمل العددية','2':'٤-٢ تمثيل الجمل العددية وكتابتها','3':'٤-٣ خطة حل المسألة: الاستدلال المنطقي','4':'٤-٤ اكتشاف قاعدة من جدول','5':'٤-٥ جداول الدوال: الجمع والطرح','6':'٤-٦ استقصاء حل المسألة','7':'٤-٧ جداول الضرب والقسمة'}
T5={'1':'٥-١ القواسم والمضاعفات','2':'٥-٢ الضرب في مضاعفات ١٠ و١٠٠ و١٠٠٠','3':'٥-٣ تقدير معقولية الإجابة','4':'٥-٤ تقدير نواتج الضرب','5':'٥-٥ ضرب عدد من رقمين في رقم واحد دون إعادة تجميع','6':'٥-٦ ضرب عدد من رقمين في رقم واحد مع إعادة التجميع','7':'٥-٧ استقصاء حل المسألة: اختيار الخطة','8':'٥-٨ ضرب عدد من ثلاثة أرقام في رقم واحد'}
AR='٠١٢٣٤٥٦٧٨٩'
def lesson_key(s,ch):
    m=re.search(ch+r'-([١-٧٨])',s)
    if m: return ('L',AR.index(m.group(1)))
    if 'التهيئة' in s: return ('P',0)
    return ('R',99)
def group_title(k,ch,T):
    if k[0]=='P': return 'التهيئة: مراجعة قبل الفصل'
    if k[0]=='R': return f'مراجعة الفصل {"الرابع" if ch=="٤" else "الخامس"} (اختبار الفصل · الاختبار التراكمي · اختبر نفسك)'
    return T[str(k[1])]
def strip(p):
    q={k:v for k,v in p.items() if k not in ('orig_text','uid','lesson')}
    return q
def result(p):
    prev=None
    for s in p.get('steps',[]):
        s.pop('result',None)
        a=prev if s['a']=='prev' else s['a']; b=prev if s['b']=='prev' else s['b']
        r={'+':a+b,'−':a-b,'×':a*b,'÷':a//b if b else 0}[s['op']]; s['result']=int(r); prev=int(r)
    return p
for ch,chs,book,Tm,name in ((4,'٤',b4,T4,'الفصل الرابع (الأنماط والجبر)'),(5,'٥',b5,T5,'الفصل الخامس (الضرب في عدد من رقم واحد)')):
    items=[]
    for p in book:
        les=(l4[p['id']][0] if ch==4 else p['lesson'])
        k=lesson_key(les,chs); q=result(strip(p)); q['_k']=k; items.append(q)
    keys=sorted({q['_k'] for q in items},key=lambda k:({'P':0,'L':1,'R':2}[k[0]],k[1]))
    groups=[]
    for i,k in enumerate(keys):
        ids=[q['id'] for q in items if q['_k']==k]; title=group_title(k,chs,Tm)
        for q in items:
            if q['_k']==k: q['group']=title
        groups.append({'id':f'g{i}','title':title,'ids':ids})
    for q in items: q.pop('_k')
    cen=[result(strip(p)) for p in c if p['chapter']==ch]
    for q in cen: q['group']='من الاختبارات المركزية'
    if ch==4:
        per=[result(strip(p)) for p in json.load(open('period_ch4.json'))]
        for q in per: q['group']='من اختبارات الفترة الثانية'
        cen=per+cen
    deck=items+cen
    html=T.replace('__TITLE__','مدرّبة المسائل اللفظية: '+name).replace('__CH__',str(ch)).replace('__DECK__',json.dumps(deck,ensure_ascii=False)).replace('__GROUPS__',json.dumps(groups,ensure_ascii=False))
    open(out+f'masail_ch{ch}.html','w',encoding='utf-8').write(html)
    print(ch,len(items),len(cen),[(g['title'][:20],len(g['ids'])) for g in groups])

# ---- الفصل الثالث: مسائل لفظية ----
w=json.load(open('ch3w.json'))
T3={'٣-١':'٣-١ جمع البيانات وتنظيمها','٣-٢':'٣-٢ خطة حل المسألة: إنشاء جدول','٣-٣':'٣-٣ التمثيل بالأعمدة','٣-٤':'٣-٤ التمثيل بالخطوط','٣-٥':'٣-٥ التمثيل بالقطاعات الدائرية','٣-٦':'٣-٦ الاحتمال'}
book3=[];cen3=[]
for p in w:
    q=result(strip(p)) if p.get('mode')!='choose' else strip(p)
    q.pop('lesson',None)
    if p['origin']=='book':
        q['group']=T3.get(p.get('lesson'),'مراجعة الفصل الثالث'); book3.append((p.get('lesson'),q))
    else:
        q['group']='من الاختبارات المركزية'; cen3.append(q)
order=list(T3)+['اختبار منتصف الفصل','مراجعة']
titles=[]
for L_ in order:
    t=T3.get(L_,'مراجعة الفصل الثالث (اختبار منتصف الفصل · مراجعة)')
    if t not in titles and any(((T3.get(l,'مراجعة الفصل الثالث (اختبار منتصف الفصل · مراجعة)'))==t) for l,_ in book3): titles.append(t)
groups3=[];items3=[]
for i,t in enumerate(titles):
    ids=[]
    for l,q in book3:
        if T3.get(l,'مراجعة الفصل الثالث (اختبار منتصف الفصل · مراجعة)')==t: q['group']=t; ids.append(q['id']);items3.append(q)
    groups3.append({'id':f'g{i}','title':t,'ids':ids})
deck3=items3+cen3
html=T.replace('__TITLE__','مدرّبة المسائل اللفظية: الفصل الثالث (تنظيم البيانات)').replace('__CH__','3').replace('__DECK__',json.dumps(deck3,ensure_ascii=False)).replace('__GROUPS__',json.dumps(groups3,ensure_ascii=False))
open(out+'masail_ch3w.html','w',encoding='utf-8').write(html);print('ch3w',len(items3),len(cen3))
open(out+'mult_game.html','w',encoding='utf-8').write(open('/tmp/m4/coach/mult.html',encoding='utf-8').read())
