# -*- coding: utf-8 -*-
import json,glob,re,html,os,sys,collections
_H=html.escape
_NUM=r'(?:[٠-٩0-9]+(?:[.,٫][٠-٩0-9]+)?|[△Δ▲▭□○●])'
_RUN=re.compile(r'(?:'+_NUM+r')(?:\s*[+\-−×÷=<>≈△Δ▲▭□○●]\s*(?:'+_NUM+r'))+')
def H(t):
    t=str(t); out=[];i=0
    for m in _RUN.finditer(t):
        out.append(_H(t[i:m.start()])); out.append('<bdi dir="ltr">'+_H(m.group(0))+'</bdi>'); i=m.end()
    out.append(_H(t[i:])); return ''.join(out)
ALL={x['uid']:x for x in json.load(open('/tmp/m4/all.json'))}
FIN={}
for f in sorted(glob.glob('/tmp/m4/final/chunk_*.json')):
    for r in json.load(open(f)):
        r['uid']=r['uid'].translate(str.maketrans('٠١٢٣٤٥٦٧٨٩','0123456789')); FIN[r['uid']]=r
from overrides import OV
for _u,_o in OV.items():
    if _u in FIN:
        FIN[_u].update(_o); FIN[_u]['status']='ok'; FIN[_u]['doubt_reason']=''
ORDER_CEN=['hail','tabuk','jazan','sharqia','hafr','qassim']
NAMES={'hail':'حائل','tabuk':'تبوك','jazan':'جازان','sharqia':'الشرقية','hafr':'حفر الباطن','qassim':'القصيم'}
AR=str.maketrans('0123456789','٠١٢٣٤٥٦٧٨٩')
def src_label(x):
    if x['src_id']=='p2':
        m=re.search(r'نموذج\s*([٠-٩0-9]+)',x.get('test_label',''))
        return 'اختبارات الفترة الثانية ١٤٤٨ ف١'+(f' (نموذج {m.group(1)})' if m else '')
    return x['src']
def chap_of(u): return FIN.get(u,{}).get('final_chapter')
def items_for(kind,chapters):
    out=[]
    for u,x in ALL.items():
        r=FIN.get(u)
        if not r: continue
        ch=r.get('final_chapter')
        try: ch=int(ch)
        except: continue
        if ch not in chapters: continue
        if (x['src_id']=='p2')!=(kind=='p2'): continue
        out.append((u,x,r))
    def k(t):
        u,x,r=t
        so=ORDER_CEN.index(x['src_id']) if x['src_id'] in ORDER_CEN else 0
        return (so,x['_file'],x['page'],u)
    out.sort(key=k); return out
SECS=[('word','مسائل لفظية'),('mcq','اختيار من متعدد'),('tf','صح أو خطأ'),('other','أكمل / احسب / اقرأ الجدول أو الرسم')]
def sec_of(x):
    t=x.get('type')
    if t=='word': return 'word'
    if t=='mcq': return 'mcq'
    if t=='tf': return 'tf'
    return 'other'
CSS="""@font-face{font-family:'B';font-weight:500;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-Medium.ttf')}
@font-face{font-family:'B';font-weight:800;src:url('file:///home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf')}
@page{size:A4;margin:11mm 11mm 13mm}*{box-sizing:border-box}
body{margin:0;font-family:'B',sans-serif;font-weight:500;color:#000;font-size:15px;line-height:1.55}
h1{font-weight:800;font-size:25px;text-align:center;margin:0 0 3px}
.sub{text-align:center;font-size:14px;margin-bottom:8px}
.note{border:2px solid #000;border-radius:10px;padding:4px 10px;margin:6px 0;font-size:13.5px}
h2{font-weight:800;font-size:19px;border-bottom:3px solid #000;margin:14px 0 6px;padding-bottom:2px;break-after:avoid}
.q{border:1.8px solid #000;border-radius:10px;padding:5px 10px;margin:7px 0;break-inside:avoid;position:relative}
.n{display:inline-block;min-width:26px;height:26px;border:2px solid #000;border-radius:50%;text-align:center;font-weight:800;font-size:14px;margin-left:6px;line-height:22px}
.t{font-weight:500}.opts{display:grid;grid-template-columns:1fr 1fr;gap:1px 14px;margin:3px 0 2px 0}
.fig{margin:4px 0;text-align:center}.fig img{max-width:100%;max-height:230px;border:1px solid #666;filter:grayscale(1) contrast(1.1)}
.fig2{display:flex;gap:10px;align-items:flex-start;margin:4px 0}.redr{flex:1;text-align:center}.redr img{max-width:100%;max-height:260px}.orig{width:30%;text-align:center;font-size:10.5px}.orig img{max-width:100%;max-height:110px;border:1px solid #666;filter:grayscale(1)}
.src{color:#c0141c;font-size:11px;font-weight:800;margin-top:2px}
.ln{border-bottom:1.5px dotted #000;height:20px;margin:3px 0}
.sol{margin-top:5px;border:2px solid #000;border-radius:8px;padding:4px 10px;background:#fff}
.red{color:#d00000;font-weight:800}.ans{font-weight:800;border:2px solid #000;border-radius:8px;display:inline-block;padding:0 8px;margin:2px 0}
.step{margin:1px 0}.why{font-size:14px;margin-top:2px}.tip{font-size:13px;margin-top:2px;font-style:normal}
.dbt{margin-top:5px;border:2px dashed #000;border-radius:8px;padding:3px 10px;font-size:13.5px}
table.ap{border-collapse:collapse;width:100%;font-size:12.5px}table.ap td,table.ap th{border:1.5px solid #000;padding:3px 6px;vertical-align:top}
"""
def fig_html(x,solved=False):
    f=x.get('figure')
    if not f or not os.path.exists(f): return ''
    nm=os.path.basename(f)[:-4]; rd=f'/tmp/m4/redraw/{nm}.png'
    UNSAFE={'p2_p35_2','p2_p35_4','p2_p35_5','qassim_p2_12','qassim_p2_13','qassim_p4_2t'}
    if not solved and nm in UNSAFE:
        return f'<div class="fig"><img src="file://{rd}" style="filter:none"></div>' if os.path.exists(rd) else ''
    if os.path.exists(rd) and not solved:
        return (f'<div class="fig2"><div class="redr"><img src="file://{rd}"></div>'
                f'<div class="orig"><img src="file://{f}"><div>الصورة الأصلية في الورقة</div></div></div>')
    return f'<div class="fig"><img src="file://{f}"></div>'
def q_html(i,x,r,solved):
    h=f'<div class="q"><span class="n">{str(i).translate(AR)}</span><span class="t">{H(x["text"])}</span>'
    if x.get('options'):
        h+='<div class="opts">'+''.join(f'<div>{H(o)}</div>' for o in x['options'])+'</div>'
    h+=fig_html(x,solved)
    if not solved and x.get('type') not in ('mcq','tf','match'):
        h+='<div class="ln"></div><div class="ln"></div>'
    elif not solved and x.get('type')=='tf':
        h+='<div style="margin-top:3px">( &nbsp;&nbsp;&nbsp;&nbsp; ) صح &nbsp;&nbsp; ( &nbsp;&nbsp;&nbsp;&nbsp; ) خطأ</div>'
    h+=f'<div class="src">جاء في: {H(src_label(x))}</div>'
    if solved:
        e=r.get('explain') or {}
        if r.get('status')!='ok':
            h+=f'<div class="dbt">⚠ <b>هذا السؤال في قائمة المشكوك فيها، لم نعتمد له جواباً.</b> {H(r.get("doubt_reason",""))}</div>'
        else:
            h+='<div class="sol">'
            if e.get('task'): h+=f'<div class="red">① أول شيء: {H(e["task"])}</div>'
            if e.get('think'): h+=f'<div><b>② {H(e["think"])}</b></div>'
            for s in e.get('steps',[]) or []: h+=f'<div class="step">• {H(s)}</div>'
            h+=f'<div class="ans">{H(e.get("answer") or r.get("final_answer",""))}</div>'
            if e.get('why'): h+=f'<div class="why"><b>ليش؟</b> {H(e["why"])}</div>'
            if e.get('tip'): h+=f'<div class="tip">💡 {H(e["tip"])}</div>'
            h+='</div>'
    return h+'</div>'
def build(kind,chapters,title,solved,out):
    rows=items_for(kind,chapters)
    kindname='الاختبارات المركزية (حائل، تبوك، جازان، الشرقية، حفر الباطن، القصيم)' if kind=='cen' else 'اختبارات الفترة الثانية (الصف الرابع)'
    srcnote='تم استخلاصه من الاختبارات المركزية نصاً كما هو.' if kind=='cen' else 'تم استخلاصه من اختبارات الفترة الثانية نصاً كما هو.'
    body=f'<h1>{H(title)}{" — محلول" if solved else ""}</h1><div class="sub">{srcnote}</div>'
    body+='<div class="note">'+('<b>طريقة الحل:</b> أول شيء نقرأ السؤال ونحدد المطلوب ونسأل أنفسنا: جمع؟ طرح؟ ضرب؟ قسمة؟ بعدين نحل ونتأكد. <b>الأحمر هو أول خطوة دايماً.</b>' if solved else '<b>للطالبة:</b> أقرأ السؤال أولاً، وأحدد المطلوب، وأسأل نفسي: جمع؟ طرح؟ ضرب؟ قسمة؟ ثم أحل.')+f' &nbsp;|&nbsp; عدد الأسئلة: {len(rows)}'.translate(AR)+'</div>'
    n=0
    for sk,sn in SECS:
        part=[(u,x,r) for u,x,r in rows if sec_of(x)==sk]
        if not part: continue
        body+=f'<h2>{sn} ({len(part)})'.translate(AR)+'</h2>'
        for u,x,r in part:
            n+=1; body+=q_html(n,x,r,solved)
    if solved:
        dl=[(u,x,r) for u,x,r in rows if r.get('status')!='ok']
        errs=[(u,x,r) for u,x,r in rows if r.get('notes') and re.search('خطأ|خاطئ',r['notes'])]
        body+='<h2 style="break-before:page">للأم: أخطاء وجدناها في الأوراق وصحّحناها</h2><table class="ap"><tr><th>المصدر</th><th>السؤال</th><th>الملاحظة</th></tr>'
        errs=[(u,x,r) for u,x,r in rows if r.get('notes') and re.search('خطأ|خاطئ',r['notes'])]
        for u,x,r in errs: body+=f'<tr><td>{H(src_label(x))}</td><td>{H(x["text"][:90])}</td><td>{H(r["notes"])}</td></tr>'
        body+='</table>'
    htm=f'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{body}</body></html>'
    p=f'/tmp/m4/out/{out}.html'; open(p,'w',encoding='utf-8').write(htm); return p,len(rows)
if __name__=='__main__':
    os.makedirs('/tmp/m4/out',exist_ok=True)
    spec=[('cen',[4],'الاختبارات المركزية — الفصل الرابع (الأنماط والجبر)','cen_ch4'),
          ('cen',[5],'الاختبارات المركزية — الفصل الخامس (الضرب في عدد من رقم واحد)','cen_ch5'),
          ('cen',[4,5],'الاختبارات المركزية — الفصلان الرابع والخامس معاً','cen_ch45'),
          ('p2',[4],'اختبارات الفترة الثانية — الفصل الرابع (الأنماط والجبر)','p2_ch4'),
          ('p2',[5],'اختبارات الفترة الثانية — الفصل الخامس (الضرب في عدد من رقم واحد)','p2_ch5'),
          ('p2',[4,5],'اختبارات الفترة الثانية — الفصلان الرابع والخامس معاً','p2_ch45')]
    for kind,ch,title,name in spec:
        for solved in (False,True):
            p,n=build(kind,ch,title,solved,name+('_solved' if solved else '_unsolved'))
            print(name,solved,n)
