# -*- coding: utf-8 -*-
import sys,random,os
REPO=os.environ.get('REPO','/home/user/nadeen-yasin-games')
SD=REPO+'/tools/science/ch3'
src=open(SD+'/bank.py',encoding='utf8').read().replace('print(len(MCQ)','#').replace("for k,v in [('MCQ'","for k,v in []:#")
exec(src)
exec(open('build.py',encoding='utf8').read().split("def esc(s)")[0].split("exec(open('bank.py'")[0]) if False else None
LET='أبجد'
def _f(i):return [f for f in FIG if f['t']==H[i]['text'].strip()][0] if False else None
FN={}
_byimg={f['img']:f for f in FIG}
def F(name):return _byimg['figs/'+name]
_b=dict(F('B_p16_q6_أ.png'));_b['t']='انظري إلى الصورة. اذكري عاملين حيويين وعاملين لاحيويين.';_b['ans']='العوامل الحيوية: الأعشاب – النباتات – السمك – الغزال – الضفدع. والعوامل اللاحيوية: الماء – الهواء – الصخور.';_b['img']='file://'+SD+'/figs/B_p16_q6_أ.png'
for _f in FIG:_f['img']='file://'+SD+'/'+_f['img']
_byimg={f['img']:f for f in FIG}
def F(name):return _byimg['file://'+SD+'/figs/'+name]
FIGS=[F('B_p12_q2.png'),F('B_p12_q7.png'),_b,F('B_p16_q6b.png'),F('B_p17_q3.png'),F('B_p17_q4.png'),F('B_p17_q5.png'),F('B_p12_q1.png'),F('B_p12_q3.png'),F('B_p12_q4.png'),F('sharqia-desert.png'),F('sharqia-foodchain.png'),F('sharqia-pyramid.png')]
CSS=open(SD+'/build.py',encoding='utf8').read().split("CSS='''")[1].split("'''")[0]
CSS+='''.sc{border-collapse:collapse;margin:4px auto;font-size:13px}.sc td,.sc th{border:2px solid #222;padding:1px 9px;text-align:center}
.mt{width:100%;border-collapse:collapse}.mt td{padding:2px 8px;vertical-align:top;border:1.5px solid #bbb}.bx{display:inline-block;border:2px solid #222;border-radius:6px;min-width:34px;height:24px;text-align:center;vertical-align:middle}
.bx.ok{background:#c8f0c0}.ord span{display:inline-block;border:2px solid #222;border-radius:8px;padding:0 12px;margin:3px}'''
BANK1='النظام البيئي - المنتجات - هرم الطاقة - الشبكة الغذائية - التنافس - المحللات - الموطن'
BANK2='المنطقة الحيوية - تنقرض - المواءمة - الموطن - التلوث'
BANK3='النظام البيئي - المواءمة - المحللات - الصحراء - المجتمع الحيوي'
MATCH=[ # (عمود أ , عمود ب مرتب مطابق)
 [('الموطن','مكان يعيش فيه المخلوق الحي ويجد فيه ما يلائمه'),('المستهلكات','مخلوقات حية لا تستطيع صنع غذائها بنفسها'),('التنافس','صراع بين المخلوقات الحية على الماء والغذاء'),('التلوث','إضافة أشياء ضارة للماء والهواء والتربة')],
 [('الطحالب','منتجات في المحيط'),('الانقراض','اختفاء أفراد النوع كلها'),('التلوث','إضافة أشياء ضارة للبيئة'),('الظواهر الطبيعية','البراكين والزلازل والأعاصير')],
 [('المحللات','مخلوقات تحلل المواد الميتة للحصول على الطاقة'),('هرم الطاقة','يوضح كمية الطاقة في كل مستوى'),('النظام البيئي','تفاعل العوامل الحيوية مع العوامل اللاحيوية'),('الموطن','مكان يعيش فيه المخلوق الحي ويلائم طريقة عيشه')],
 [('المنطقة الحيوية','نظام بيئي كبير له نباتاته وحيواناته الخاصة'),('الجماعة الحيوية','جميع أفراد النوع الواحد في نظام بيئي'),('المجتمع الحيوي','كل الجماعات في النظام البيئي'),('المواءمة','استجابة الحيوان للتغير الحادث في بيئته')],
 [('المنتجات','مخلوقات حية تصنع غذاءها بنفسها'),('المفترس','آكل لحوم يصطاد ليحصل على طعامه'),('الفريسة','المخلوق الحي الذي يُصطاد'),('الشبكة الغذائية','ينتج عن تداخل السلاسل الغذائية')],
 [('الصحراء','منطقة حيوية أمطارها نادرة وتربتها رملية جافة'),('الغابة','منطقة حيوية أمطارها طوال السنة وتربتها خصبة'),('البحيرة','من الأنظمة البيئية المائية'),('الانقراض','اختفاء أفراد النوع كلها')]]
ORDER=[['عشب','جرادة','ضفدع','صقر'],['الجزر','الأرنب','الثعلب','الأسد'],['نبات الشوك','يرقة','سرعوف','سحلية'],['طحلب','ذبابة مائية','سمكة الشمس','طائر مالك الحزين'],['عشب','أرنب','ثعلب','نسر'],['نبات','جرادة','ضفدع','ثعبان']]
CLASS=[(['الديدان','الغزال','الأسد','الأرنب','البكتيريا','النمر'],{'آكلات أعشاب':['الغزال','الأرنب'],'آكلات لحوم':['الأسد','النمر'],'محللات':['الديدان','البكتيريا']}),
 (['البقرة','الصقر','الفطريات','الخروف','الثعلب','الديدان'],{'آكلات أعشاب':['البقرة','الخروف'],'آكلات لحوم':['الصقر','الثعلب'],'محللات':['الفطريات','الديدان']})]
EXA=[('مستهلك يأكل الأعشاب','الجرادة، الخروف، البقرة (أي واحد)'),('من المحللات','الديدان، البكتيريا، الفطريات (أي واحد)'),('من المنتجات','النباتات الخضراء والطحالب (أي واحد)'),('مثال لظاهرة طبيعية تغير النظام البيئي','البراكين، الزلازل، الأعاصير، الفيضانات (أي واحد)'),('مثال لشيء يفعله الإنسان ويغير النظام البيئي','قطع الأشجار، التلوث، الاكتظاظ السكاني (أي واحد)')]
TERMS1=[('مخلوقات حية وأشياء غير حية يتفاعل بعضها مع بعض في بيئة معينة','النظام البيئي'),('المكان الذي يعيش فيه المخلوق الحي','الموطن'),('المخلوق الحي الذي يستخدم طاقة الشمس لصنع الغذاء','المنتجات'),('صراع بين المخلوقات الحية على الطعام والماء','التنافس'),('ينتج عن تداخل السلاسل الغذائية معاً','الشبكة الغذائية'),('تقوم بتحليل المواد الميتة للحصول على الطاقة','المحللات'),('يوضح كمية الطاقة في كل مستوى من الشبكة الغذائية','هرم الطاقة')]
TERMS2=[('النظام البيئي الكبير الذي له نباتاته وحيواناته الخاصة يسمى','المنطقة الحيوية'),('عند اختفاء أو عدم وجود أفراد النوع كلها فإن الأنواع','تنقرض'),('استجابة المخلوق الحي للتغيرات في نظامه البيئي تسمى','المواءمة'),('المكان الذي يعيش فيه المخلوق الحي ويجد فيه جميع احتياجاته','الموطن'),('إضافة أشياء ضارة إلى الماء أو الهواء أو التربة تسمى','التلوث')]
def mk(sec,mark,items,fn):return dict(sec=sec,mark=mark,items=items,fn=fn)
# ---- مولّدات الأقسام
def s_tf(items,solved):
    h=''
    for i,q in enumerate(items,1):
        h+='<div class="q"><span class="n">%d)</span> %s &nbsp; <span class="bx%s">%s</span></div>'%(i,q['t'],' ok' if solved else '',('✓' if q['a'] else '✗') if solved else '')
    return h
def s_match(set_,solved,rnd):
    ra=[a for a,b in set_];rb=[b for a,b in set_];shuf=list(range(4));rnd.shuffle(shuf)
    h='<table class="mt"><tr><td style="width:36%"><b>المجموعة (أ)</b> (اكتبي الحرف المناسب في المربع)</td><td><b>المجموعة (ب)</b></td></tr>'
    for k in range(4):
        let=LET[[j for j in range(4) if shuf[j]==k][0]]
        h+='<tr><td>%d) %s &nbsp; <span class="bx%s">%s</span></td><td>%s) %s</td></tr>'%(k+1,ra[k],' ok' if solved else '',let if solved else '',LET[k],rb[shuf[k]])
    return h+'</table>'
def s_fill(terms,bank,solved):
    h='<div class="bank">%s</div>'%bank
    for i,(t,a) in enumerate(terms,1):h+='<div class="q"><span class="n">%d)</span> %s ........... %s</div>'%(i,t,('<span class="ans" style="display:inline">%s</span>'%a) if solved else '')
    return h
def s_mcq(items,solved):
    h=''
    for i,q in enumerate(items,1):
        h+='<div class="q"><span class="n">%d)</span> %s<br>%s</div>'%(i,q['t'],''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and j==q['a'] else '',LET[j],o) for j,o in enumerate(q['o'])))
    return h
def s_fig(items,solved):
    h=''
    for i,q in enumerate(items,1):
        h+='<div class="q"><span class="n">%d)</span> %s<div class="fig"><img src="%s"></div>'%(i,q['t'],q['img'])
        if q['opts']:h+=''.join('<span class="op%s">%s) %s</span>'%(' ok' if solved and q['ans'].replace(' ','').split(')')[-1]==o.replace(' ','') else '',LET[j],o) for j,o in enumerate(q['opts']))
        elif not solved:h+='<div class="ln"></div>'
        if solved:h+='<div class="ans">✔ %s</div>'%q['ans']+(('<div class="fig"><img src="%s"></div>'%q['ans_img']) if q.get('ans_img') else '')
        h+='</div>'
    return h
def s_order(chain,solved,rnd):
    sh=chain[:];rnd.shuffle(sh)
    h='<div class="ord">'+''.join('<span>%s</span>'%x for x in sh)+'</div>رتبي السلسلة الغذائية (بالأسهم):<br>'
    h+=('<div class="ans">✔ '+' ← '.join(chain)+'</div>') if solved else '<div class="ln"></div>'
    return h
def s_class(cl,solved):
    words,g=cl;h='<div class="bank">'+' - '.join(words)+'</div><table class="mt"><tr>'+''.join('<td><b>%s</b></td>'%k for k in g)+'</tr><tr>'+''.join('<td>%s</td>'%(('، '.join(v)) if solved else '<div class="ln"></div><div class="ln"></div>') for v in g.values())+'</tr></table>'
    return h
def s_exa(rows,solved):
    return ''.join('<div class="q"><span class="n">%d)</span> %s: %s</div>'%(i,t,('<span class="ans" style="display:inline">%s</span>'%a) if solved else '...............') for i,(t,a) in enumerate(rows,1))
def s_ess(items,solved):
    h=''
    for i,q in enumerate(items,1):h+='<div class="q"><span class="n">%d)</span> %s'%(i,q['t'])+(('<div class="ans">✔ %s</div>'%q['a']) if solved else '<div class="ln"></div>')+'</div>'
    return h
def corr(q):return q
def make_model(n,spec,solved,rnd):
    names=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع']
    tot=sum(s[1] for s in spec)
    assert abs(tot-20)<1e-6,(n,tot)
    h='<div class="hd"><div>المملكة العربية السعودية<br>وزارة التعليم</div><div class="c">اختبار مادة العلوم — الصف الرابع الابتدائي<br><span style="font-size:14px">الفصل الدراسي الأول (الفترة الثانية) 1448هـ · الفصل الثالث · نموذج %d%s</span></div><div>اسم الطالبة: ..................<br>الدرجة: ...... / 20</div></div><div class="green">🌷 الاختبار يحسب درجتكِ لا سرعتكِ: اقرئي السؤال جيداً مرتين، وتأكدي من إجابتك</div>'%(n,' — نموذج الإجابة' if solved else '')
    h+='<table class="sc"><tr><th>السؤال</th>'+''.join('<th>%s</th>'%names[i] for i in range(len(spec)))+'<th>المجموع</th></tr><tr><td>الدرجة</td>'+''.join('<td>%g</td>'%s[1] for s in spec)+'<td>20</td></tr></table>'
    for i,(title,mark,body) in enumerate(spec):
        h+='<h2>السؤال %s: %s <span style="float:left;font-size:15px">(%g درجات)</span></h2>%s'%(names[i],title,mark,body(solved))
    return '<div class="pg">%s<div class="src" style="text-align:center">انتهت الأسئلة · مع تمنياتنا لكِ بالتوفيق والنجاح</div><div class="ft">إعداد: عواطف الجهني · جهد شخصي لوجه الله · اللهم تقبّله منا واجعله نافعاً · للتواصل فقط: <a href="https://wa.me/966580908077" style="color:inherit;text-decoration:none"><span dir="ltr">966580908077</span></a></div></div>'%h
def pickn(pool,start,k):return [pool[(start+i)%len(pool)] for i in range(k)]
def fig_by(ans_key):return [f for f in FIG if ans_key in f['img']]
def specs(n,solved):
    rnd=random.Random(100+n);LY=(n-1)%6+1
    M=lambda k,s=None:(lambda sv:s_mcq(pickn(MCQ,(n*7+(s or 0)),k),sv))
    T=lambda k,s=0:(lambda sv:s_tf(pickn(TF,(n*5+s),k),sv))
    MA=lambda i:(lambda sv:s_match(MATCH[(n+i)%len(MATCH)],sv,random.Random(n*11+i)))
    OR=lambda i:(lambda sv:s_order(ORDER[(n+i)%len(ORDER)],sv,random.Random(n*3+i)))
    CL=lambda sv:s_class(CLASS[n%2],sv)
    EX=lambda sv:s_exa(EXA[(n%2):(n%2)+3] if n%2==0 else EXA[1:4],sv)
    TM1=lambda sv:s_fill(TERMS1[:4] if n%2 else TERMS1[3:],BANK1,sv)
    TM2=lambda sv:s_fill(TERMS2[:4],BANK2,sv)
    FG=lambda a,b:(lambda sv:s_fig([FIGS[a%len(FIGS)],FIGS[b%len(FIGS)]],sv))
    ES=lambda k,s=0:(lambda sv:s_ess(pickn(ESS,n*3+s,k),sv))
    if LY==1:return [('ضعي علامة ✓ أمام العبارة الصحيحة وعلامة ✗ أمام العبارة الخاطئة',3,T(4)),('صلي المجموعة (أ) بما يناسبها من المجموعة (ب) بكتابة الرقم',3,MA(0)),('أجيبي من خلال الصورة',4,FG(0,3)),('أكملي الفراغات بالكلمة المناسبة',3,TM2),('اختاري الإجابة الصحيحة',4,M(4)),('أجيبي من خلال الصورة',3,FG(11,12))]
    if LY==2:return [('اكتبي المصطلح المناسب للعبارات التالية',4,TM1),('مثلي لكل مما يلي',2,EX),('صلي العمود (أ) بما يناسبه في العمود (ب)',3,MA(1)),('ضعي علامة ✓ أو ✗',3,T(4,9)),('رتبي السلسلة الغذائية الآتية',2,OR(0)),('اختاري الإجابة الصحيحة',4,M(4,3)),('صنفي المخلوقات الحية التالية',2,CL)]
    if LY==3:return [('اختاري الإجابة الصحيحة',5,M(5,5)),('صلي العمود (أ) بما يناسبه من العمود (ب)',3,MA(2)),('اكتبي المصطلحات الآتية أمام جملها المناسبة',3,TM2),('أجيبي من خلال الصورة',4,FG(4,5)),('رتبي السلسلة الغذائية الآتية',2,OR(1)),('ضعي علامة ✓ أو ✗',3,T(4,2))]
    if LY==4:return [('ضعي علامة ✓ أو ✗',3,T(5,14)),('اختاري الإجابة الصحيحة',4,M(4,11)),('أكملي الفراغات بالكلمة المناسبة',3,lambda sv:s_fill(TERMS1[2:6] if False else TERMS1[1:5],BANK1,sv)),('صنفي المخلوقات الحية التالية',3,lambda sv:s_class(CLASS[1],sv)),('انظري إلى الصورة وأجيبي',4,FG(1,2)),('أجيبي عن السؤال',3,ES(2,2))]
    if LY==5:return [('اختاري الإجابة الصحيحة',4,M(4,20)),('ضعي علامة ✓ أو ✗',3,T(4,20)),('صلي العمود (أ) بما يناسبه من العمود (ب)',3,MA(3)),('رتبي السلسلة الغذائية الآتية',2,OR(2)),('أكملي الفراغات بالكلمة المناسبة',3,TM2),('أجيبي من خلال الصورة',3,FG(8,10)),('مثلي لكل مما يلي',2,lambda sv:s_exa(EXA[2:5],sv))]
    if LY==6:return [('اكتبي المصطلح المناسب',3,lambda sv:s_fill(TERMS1[3:6],BANK1,sv)),('ضعي علامة ✓ أو ✗',3,T(4,28)),('اختاري الإجابة الصحيحة',4,M(4,28)),('صلي العمود (أ) بما يناسبه',3,MA(4)),('أجيبي من خلال الصورة',4,FG(6,9)),('أجيبي عن الأسئلة التالية',3,ES(3,6))]
BWCSS='.green{background:#fff!important;border-color:#000!important}h2{background:#fff!important;border-bottom:2.5px solid #000!important;border-radius:0!important}.op.ok,.bx.ok,.tf.ok{background:#fff!important;border:2px solid #000!important;font-weight:800;text-decoration:underline}.ans{background:#fff!important;border:2px solid #000!important}.bank{border-color:#000!important}.hd{border-color:#000!important}img{filter:grayscale(1)}'
def doc(pages):return '<!doctype html><html dir="rtl" lang="ar"><meta charset="utf-8"><style>%s%s</style><body>%s</body></html>'%(CSS,BWCSS,''.join(pages))
def model_html(n,solved):return make_model(n,specs(n,solved),solved,random.Random(n))
