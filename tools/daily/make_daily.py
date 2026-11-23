# -*- coding: utf-8 -*-
"""
python3 tools/daily/make_daily.py daily OUTDIR [YYYY-MM-DD]   ← نماذج اليوم (علوم ف٣، رياضيات ف٣، رياضيات ف٤، لغتي) نموذج واحد لكل مادة، بنسختين
python3 tools/daily/make_daily.py set OUTDIR math3|math4|sci3|lugha [K]  ← K نماذج في ملف واحد (افتراضي ٦)
كل ملف: صفحة «ملاحظة مهمة» + النماذج. أبيض وأسود، ٢٠ درجة.
"""
import sys,os,datetime,subprocess,importlib
HERE=os.path.dirname(os.path.abspath(__file__));sys.path.insert(0,HERE)
os.environ.setdefault('REPO',os.path.abspath(os.path.join(HERE,'..','..')))
from pypdf import PdfReader,PdfWriter
import sci_gen,lugha_gen,math_gen
def pdf(html_path,out):subprocess.run(['node',os.path.join(HERE,'render.js'),html_path,out],check=True)
def with_notice(subject,body,out):
    w=PdfWriter();w.append(PdfReader(os.path.join(HERE,'notice_%s.pdf'%subject)));w.append(PdfReader(body))
    w.compress_identical_objects(remove_duplicates=True,remove_unreferenced=True);w.write(out)
def make(kind,ns,solved,tmp):
    if kind=='math3':pages=[math_gen.model_html(n,3,solved) for n in ns];d=math_gen.doc(pages);s='math'
    elif kind=='math4':pages=[math_gen.model_html(n,4,solved) for n in ns];d=math_gen.doc(pages);s='math'
    elif kind=='sci3':pages=[sci_gen.model_html(n,solved) for n in ns];d=sci_gen.doc(pages);s='science'
    else:pages=[lugha_gen.build(n,solved) for n in ns];d=lugha_gen.doc(pages);s='lugha'
    h=os.path.join(tmp,'%s_%s.html'%(kind,'s' if solved else 'q'));open(h,'w',encoding='utf8').write(d)
    b=h.replace('.html','.pdf');pdf(h,b);return s,b
def build(kind,ns,outdir,tag):
    os.makedirs(outdir,exist_ok=True);tmp=os.path.join(outdir,'_tmp');os.makedirs(tmp,exist_ok=True);res=[]
    for solved,nm in((False,'student'),(True,'solved')):
        s,b=make(kind,ns,solved,tmp);o=os.path.join(outdir,'%s_%s_%s.pdf'%(kind,tag,nm));with_notice(s,b,o);res.append(o)
    return res
if __name__=='__main__':
    mode=sys.argv[1];out=sys.argv[2]
    if mode=='daily':
        day=datetime.date.fromisoformat(sys.argv[3]) if len(sys.argv)>3 else datetime.date.today()
        n=(day-datetime.date(2026,11,22)).days+7   # رقم النموذج لهذا اليوم (يبدأ بعد النماذج الستة الأولى)
        for kind in ('sci3','math3','math4','lugha'):
            for f in build(kind,[n],out,day.isoformat()):print(f)
    else:
        kind=sys.argv[3];k=int(sys.argv[4]) if len(sys.argv)>4 else 6
        for f in build(kind,list(range(1,k+1)),out,'set%d'%k):print(f)
