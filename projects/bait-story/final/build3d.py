import subprocess,json,sys
from PIL import Image,ImageDraw,ImageFont,ImageFilter
O='/tmp/story/k3/orig/'; W,H=1280,720
FB='/home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf'; FM='/home/user/nadeen-yasin-games/shared/fonts/Baloo-SemiBold.ttf'
def F(s,f=FB): return ImageFont.truetype(f,s,layout_engine=ImageFont.Layout.RAQM)
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
CAP={1:'قصة بيت القواعد',2:'تاه الأصدقاء في الصحراء',3:'الماضي: أنا أبني!',4:'الفعل الماضي: مبنيّ على الفتح (ص٩٥)',5:'الفعل المضارع: مرفوع وعلامة رفعه الضمة (ص٩٥)',6:'اكتمل البيت!',7:'فعل الأمر: مبنيّ على السكون (ص٩٥)',8:'المفعول به حزين عند خيمته',9:'المفعول به: منصوب وعلامة نصبه الفتحة (ص١١٥)',10:'الاسم المجرور: علامة جرّه الكسرة (ص٨٩)',11:'جلس الأصدقاء معًا في البيت',12:'الماضي بنى وفتح · المضارع رفع · الأمر سكن · المفعول به نصب وفتح · حرف الجر جرّ'}
def sz(d,t,f):
    b=d.textbbox((0,0),t,font=f,direction='rtl',language='ar'); return b
def cap(text,credit=True):
    im=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(im)
    f=F(40 if len(text)<45 else 32); b=sz(d,text,f); w=b[2]-b[0]; h=b[3]-b[1]
    x=(W-w)/2; y=H-120
    d.rounded_rectangle((x-30,y-14,x+w+30,y+h+22),radius=26,fill=(0,0,0,150))
    d.text((x-b[0],y-b[1]),text,font=f,fill='white',direction='rtl',language='ar')
    if credit: add_credit(d)
    return im
def add_credit(d):
    f=F(18,FM); t='تصميم عواطف الجهني'; b=sz(d,t,f); d.text((20-b[0],H-34-b[1]),t,font=f,fill=(255,255,255,200),direction='rtl',language='ar')
def card(lines,bg,name):
    im=Image.open(bg).convert('RGB').resize((W,H)).filter(ImageFilter.GaussianBlur(6)).convert('RGBA')
    ov=Image.new('RGBA',(W,H),(30,20,10,150)); im=Image.alpha_composite(im,ov); d=ImageDraw.Draw(im)
    y=H/2-len(lines)*34
    for t,s,c in lines:
        f=F(s); b=sz(d,t,f); w=b[2]-b[0]; d.text(((W-w)/2-b[0],y-b[1]),t,font=f,fill=c,direction='rtl',language='ar'); y+=s+22
    add_credit(d); im.convert('RGB').save(name)
variant=sys.argv[1]
if variant=='site':
    lines=[('قصة بيت القواعد',72,'#ffd36b'),('لغتي · الصف الرابع',38,'white')]
else:
    lines=[('مهمة أدائية · مشروع لغتي',50,'#ffd36b'),('قصة بيت القواعد',78,'white'),('الطالبة: نادين الشمراني · الصف الرابع / ٢',38,'white'),('مقدَّمة للمعلمة: دلال السناني',38,'#ffd36b')]
card(lines,O.replace('orig/','')+'s1.png',f'title_{variant}.png')
endl=[('الماضي بنى وفتح',44,'#ff8a8a'),('والمضارع رفع',44,'#7ab8ff'),('والأمر سكن',44,'#8ae28a'),('والمفعول به نصب وفتح',44,'#ffffff'),('وحرف الجر جرّ',44,'#caa0ff')]
card(endl if variant=='site' else endl,O.replace('orig/','')+'s12.png',f'end_{variant}.png')
# timeline
inputs=[];fc=[];t=0;n=0;ov=[]
seg=[('title_%s.png'%variant,4,None)]
for i in range(1,13): seg.append((O+f's{i}.mp4',dur(O+f's{i}.mp4'),CAP[i]))
seg.append(('end_%s.png'%variant,5,None))
cmd=['ffmpeg','-y','-loglevel','error']
for s,d,c in seg:
    if s.endswith('.png'): cmd+=['-loop','1','-t',str(d),'-framerate','24','-i',s]
    else: cmd+=['-i',s]
parts=[]
for k,(s,d,c) in enumerate(seg):
    base=f'[{k}:v]scale={W}:{H},fps=24,setsar=1,format=yuv420p'
    if c:
        cap(c).save(f'cap{k}.png'); 
    parts.append(base+f'[b{k}]')
# add caption inputs
capidx={}
for k,(s,d,c) in enumerate(seg):
    if c: capidx[k]=len(seg)+len(capidx); cmd+=['-loop','1','-t',str(d),'-framerate','24','-i',f'cap{k}.png']
chain=[]
for k,(s,d,c) in enumerate(seg):
    if c: chain.append(f'[b{k}][{capidx[k]}:v]overlay=0:0:shortest=1,format=yuv420p[v{k}]')
    else: chain.append(f'[b{k}]null[v{k}]')
fl=';'.join(parts+chain)+';'+''.join(f'[v{k}]' for k in range(len(seg)))+f'concat=n={len(seg)}:v=1:a=0[out]'
cmd+=['-filter_complex',fl,'-map','[out]','-c:v','libx264','-crf','20','-preset','medium','-movflags','+faststart',f'story_{variant}.mp4']
subprocess.check_call(cmd); print(variant,'ok',sum(d for _,d,_ in seg))
