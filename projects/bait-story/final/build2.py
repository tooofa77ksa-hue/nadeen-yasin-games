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
    f=F(12,FM); t='تصميم عواطف الجهني · جميع الحقوق محفوظة'; b=sz(d,t,f); d.text((12-b[0],H-20-b[1]),t,font=f,fill=(150,150,150,190),direction='rtl',language='ar')
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
    lines=[('مهمة أدائية · مشروع لغتي',50,'#ffd36b'),('قصة بيت القواعد',78,'white'),('الطالبة: نادين الشمراني · الصف الرابع / ٢',38,'white'),('مقدَّمة للمعلمة: دلال السَّناني',38,'#ffd36b')]
card(lines,O.replace('orig/','')+'s1.png',f'title_{variant}.png')
endl=[('الماضي بنى وفتح',44,'#ff8a8a'),('والمضارع رفع',44,'#7ab8ff'),('والأمر سكن',44,'#8ae28a'),('والمفعول به نصب وفتح',44,'#ffffff'),('وحرف الجر جرّ',44,'#caa0ff')]
card(endl if variant=='site' else endl,O.replace('orig/','')+'s12.png',f'end_{variant}.png')

A='/tmp/story/aud/'
def adur(n): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',A+n+'.wav']).decode())
SC={1:['n1'],2:['n2'],3:['p3'],4:['n3','p4'],5:['pres','n4'],6:['n5'],7:['amr','n6'],8:['n7'],9:['maful','n8'],10:['harf','n10'],11:['n11'],12:['n12']}
GAP=0.35
seg=[('title_%s.png'%variant,4,None,[])]
for i in range(1,13):
    cd=dur(O+f's{i}.mp4'); offs=[];t=0.4
    for n in SC[i]: offs.append((n,t)); t+=adur(n)+GAP
    seg.append((O+f's{i}.mp4',max(cd,t+0.4),CAP[i],offs,cd))
seg.append(('end_%s.png'%variant,5,None,[]))
cmd=['ffmpeg','-y','-loglevel','error']
for k,x in enumerate(seg):
    s_,d=x[0],x[1]
    if s_.endswith('.png'): cmd+=['-loop','1','-t',str(d),'-framerate','24','-i',s_]
    else: cmd+=['-i',s_]
parts=[]
for k,x in enumerate(seg):
    s_,d,c=x[0],x[1],x[2]
    base=f'[{k}:v]scale={W}:{H},fps=24,setsar=1'
    if len(x)>4 and d>x[4]+0.01: base+=f',tpad=stop_mode=clone:stop_duration={d-x[4]+0.1}'
    base+=f',trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p'
    parts.append(base+f'[b{k}]')
capidx={}
for k,x in enumerate(seg):
    if x[2]:
        cap(x[2]).save(f'cap{k}.png'); capidx[k]=len(seg)+len(capidx); cmd+=['-loop','1','-t',str(x[1]),'-framerate','24','-i',f'cap{k}.png']
# audio inputs
ai=len(seg)+len(capidx); aud=[];tstart=0;ad=[]
for k,x in enumerate(seg):
    for n,off in (x[3] if len(x)>3 else []):
        cmd+=['-i',A+n+'.wav']; ms=int((tstart+off)*1000); ad.append(f'[{ai}:a]adelay={ms}|{ms},volume=1.0[a{ai}]'); aud.append(f'[a{ai}]'); ai+=1
    tstart+=x[1]
chain=[]
for k,x in enumerate(seg):
    if x[2]: chain.append(f'[b{k}][{capidx[k]}:v]overlay=0:0:shortest=1,format=yuv420p[v{k}]')
    else: chain.append(f'[b{k}]null[v{k}]')
fl=';'.join(parts+chain+ad)+';'+''.join(f'[v{k}]' for k in range(len(seg)))+f'concat=n={len(seg)}:v=1:a=0[out];'+''.join(aud)+f'amix=inputs={len(aud)}:normalize=0:dropout_transition=0,apad[am]'
tot=sum(x[1] for x in seg)
cmd+=['-filter_complex',fl,'-map','[out]','-map','[am]','-t',str(tot),'-c:v','libx264','-crf','20','-preset','medium','-c:a','aac','-b:a','160k','-movflags','+faststart',f'story_{variant}_v2.mp4']
subprocess.check_call(cmd); print(variant,'ok',tot)
