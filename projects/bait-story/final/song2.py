import sys,subprocess,os,math
variant=sys.argv[1]; sys.argv=['x',variant]
src=open('build2.py').read(); exec(src[:src.index("A='/tmp/story/aud/'")])
from PIL import Image,ImageDraw,ImageFont,ImageChops
C='/tmp/story/k3/clips/'; D='/tmp/story/k3/orig/'
FBB='/home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf'
MARKS={'fatha':('فَتْحَة','ـَ',(255,138,61)),'damma':('ضَمَّة','ـُ',(61,123,255)),'sukun':('سُكُون','ـْ',(46,170,90)),'kasra':('كَسْرَة','ـِ',(150,90,230))}
S=420;FR=58
def ease(x): return 1-(1-x)**3
def thick(d,pts,w,col):
    d.line(pts,fill=col,width=w,joint='curve')
    for p in (pts[0],pts[-1]): d.ellipse((p[0]-w/2,p[1]-w/2,p[0]+w/2,p[1]+w/2),fill=col)
def shape(kind,col,prog):
    """draw mark progressively: returns RGBA layer SxS"""
    L=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(L); c=col+(255,)
    d.line((70,205,350,205),fill=(210,210,210,255),width=18)  # baseline (tatweel)
    if kind=='fatha': thick(d,[(130,135),(290,85)],40,c)
    elif kind=='kasra': thick(d,[(130,255),(290,305)],40,c); 
    elif kind=='damma':
        d.ellipse((190,70,260,140),fill=c); thick(d,[(255,110),(285,150),(255,200)],34,c)
    else: d.ellipse((165,60,255,150),outline=c,width=26)
    # reveal: wipe
    m=Image.new('L',(S,S),0); w=int(S*ease(prog))
    ImageDraw.Draw(m).rectangle((0,0,w,S) if kind!='kasra' else (0,0,S,200+int(110*ease(prog))),fill=255)
    if kind!='kasra':
        # baseline always visible
        base=Image.new('RGBA',(S,S),(0,0,0,0)); ImageDraw.Draw(base).line((70,205,350,205),fill=(210,210,210,255),width=18)
    al=ImageChops.multiply(L.split()[3],m); L.putalpha(al)
    return L
def sticker(kind):
    os.makedirs(f'st_{kind}',exist_ok=True); lab,mk,col=MARKS[kind]
    fl=ImageFont.truetype(FBB,54,layout_engine=ImageFont.Layout.RAQM)
    for f in range(FR):
        t=f/24; p=min(t/0.4,1)
        sc=0.02 if t<=0 else (ease(p)*1.15 if p<0.7 else (1.15-0.15*((p-0.7)/0.3) if p<1 else 1+0.025*math.sin((t-0.4)*7)))
        a=255 if t<FR/24-0.35 else int(255*max(0,(FR/24-t)/0.35))
        card=Image.new('RGBA',(S,S),(0,0,0,0)); cd=ImageDraw.Draw(card)
        cd.rounded_rectangle((20,20,S-20,S-20),radius=70,fill=(255,255,255,255),outline=col+(255,),width=12)
        cd.rounded_rectangle((26,S-118,S-26,S-26),radius=62,fill=col+(255,))
        bb=cd.textbbox((0,0),lab,font=fl,direction='rtl',language='ar'); cd.text(((S-(bb[2]-bb[0]))/2-bb[0],S-100-bb[1]),lab,font=fl,fill='white',direction='rtl',language='ar')
        prog=min(max((t-0.3)/0.8,0),1)
        card=Image.alpha_composite(card,shape(kind,col,prog))
        w=max(int(S*sc),2); card2=card.resize((w,w),Image.LANCZOS)
        out=Image.new('RGBA',(S,S),(0,0,0,0)); out.paste(card2,((S-w)//2,(S-w)//2),card2)
        if a<255: out.putalpha(out.split()[3].point(lambda v:v*a//255))
        out.save(f'st_{kind}/{f:03d}.png')
for k in MARKS: sticker(k)
# sections: (start,end,clip,caption,loop)
SEC=[(0,16.76,C+'dance.mp4','بيتُ القواعدِ… كلُّنا فيهِ'),(16.76,22.0,D+'s4.mp4','الماضي: بنى · مبنيٌّ على الفتح'),(22.0,26.5,D+'s5.mp4','المضارع: رفع · مرفوع علامته الضمة'),(26.5,31.4,D+'s7.mp4','الأمر: سكن · مبنيٌّ على السكون'),(31.4,36.0,D+'s4.mp4','المفعول به: نصب · منصوب علامته الفتحة'),(36.0,40.66,D+'s10.mp4','حرف الجر: جرّ · مجرور علامته الكسرة'),(40.66,55.3,C+'dance.mp4','الماضي بنى وفتح · المضارع رفع · الأمر سكن · المفعول به نصب وفتح · حرف الجر جرّ')]
ST=[('fatha',20.2),('damma',25.0),('sukun',29.6),('fatha',34.5),('kasra',39.4)]
cmd=['ffmpeg','-y','-loglevel','error']; n=len(SEC)+1
for a,b,cl,t in SEC: cmd+=['-stream_loop','-1','-t',str(b-a),'-i',cl]
cmd+=['-loop','1','-t',str(60.84-55.3),'-framerate','24','-i',f'end_{variant}.png','-i','/tmp/story/aud/song.mp3']
for i,(a,b,cl,t) in enumerate(SEC): cap(t).save(f'sc{i}.png'); cmd+=['-loop','1','-t',str(b-a),'-framerate','24','-i',f'sc{i}.png']
base=n+1+len(SEC)
for k,(kind,t) in enumerate(ST): cmd+=['-framerate','24','-i',f'st_{kind}/%03d.png']
fc=[]
for i,(a,b,cl,t) in enumerate(SEC):
    fc.append(f'[{i}:v]scale={W}:{H},fps=24,setsar=1,trim=duration={b-a},setpts=PTS-STARTPTS,format=yuv420p[z{i}]')
    fc.append(f'[z{i}][{n+1+i}:v]overlay=0:0:shortest=1[c{i}]')
fc.append(f'[{len(SEC)}:v]scale={W}:{H},fps=24,setsar=1,format=yuv420p[ce]')
fc.append(''.join(f'[c{i}]' for i in range(len(SEC)))+'[ce]'+f'concat=n={n}:v=1:a=0[bg]')
cur='bg'
for k,(kind,t) in enumerate(ST):
    idx=base+k
    fc.append(f'[{idx}:v]setpts=PTS+{t}/TB[s{k}]')
    fc.append(f'[{cur}][s{k}]overlay=x=({W}-{S})/2:y=30:eof_action=pass:repeatlast=0[o{k}]'); cur=f'o{k}'
cmd+=['-filter_complex',';'.join(fc),'-map',f'[{cur}]','-map',f'{n}:a','-t','60.84','-c:v','libx264','-crf','20','-c:a','aac','-b:a','160k',f'song_{variant}_v4.mp4']
subprocess.check_call(cmd)
tot=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'story_{variant}_v2.mp4']).decode())-5
subprocess.check_call(['ffmpeg','-y','-loglevel','error','-t',str(tot),'-i',f'story_{variant}_v2.mp4','-i',f'song_{variant}_v4.mp4','-filter_complex','[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]','-map','[v]','-map','[a]','-c:v','libx264','-crf','20','-c:a','aac','-b:a','160k','-movflags','+faststart',f'story_{variant}_v4.mp4'])
print('ok')
