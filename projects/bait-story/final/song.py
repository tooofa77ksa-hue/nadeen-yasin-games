import sys,subprocess
variant=sys.argv[1]; sys.argv=['x',variant]
src=open('build2.py').read(); exec(src[:src.index("A='/tmp/story/aud/'")])
IMG='/tmp/story/k3/'
SEC=[(0,8.4,'s1','بيتُ القواعدِ… كلُّنا فيهِ'),(8.4,16.7,'s11','بيتُ القواعدِ… كلُّنا فيهِ'),(16.7,20.5,'s4','الماضي: بنى · مبنيٌّ على الفتح'),(20.5,25,'s5','المضارع: رفع · مرفوع علامته الضمة'),(25,30,'s7','الأمر: سكن · مبنيٌّ على السكون'),(30,35.5,'s9','المفعول به: نصب · منصوب علامته الفتحة'),(35.5,40.7,'s10','حرف الجر: جرّ · مجرور علامته الكسرة'),(40.7,46,'s12','الماضي بنى وفتح · المضارع رفع'),(46,50.5,'s6','الأمر سكن · المفعول به نصب وفتح'),(50.5,55.3,'s12','وحرف الجر جرّ · وحرف الجر جرّ')]
END=(55.3,60.84)
cmd=['ffmpeg','-y','-loglevel','error']; fc=[]; n=0
for a,b,im,t in SEC:
    d=b-a; cap(t).save(f'sc{n}.png')
    cmd+=['-loop','1','-t',str(d),'-framerate','24','-i',IMG+im+'.png']; n+=1
cmd+=['-loop','1','-t',str(END[1]-END[0]),'-framerate','24','-i',f'end_{variant}.png']
cmd+=['-i','/tmp/story/aud/song.mp3']
for i in range(len(SEC)): cmd+=['-loop','1','-t',str(SEC[i][1]-SEC[i][0]),'-framerate','24','-i',f'sc{i}.png']
N=len(SEC)+1
for i in range(N):
    z=f"zoompan=z='1+0.0012*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps=24" if i<len(SEC) else f"scale={W}:{H},fps=24"
    d=(SEC[i][1]-SEC[i][0]) if i<len(SEC) else END[1]-END[0]
    fc.append(f'[{i}:v]{"scale=1920:1080," if i<len(SEC) else ""}{z},setsar=1,trim=duration={d},setpts=PTS-STARTPTS,format=yuv420p[z{i}]')
    if i<len(SEC): fc.append(f'[z{i}][{N+1+i}:v]overlay=0:0:shortest=1,format=yuv420p[v{i}]')
    else: fc.append(f'[z{i}]null[v{i}]')
fc.append(''.join(f'[v{i}]' for i in range(N))+f'concat=n={N}:v=1:a=0[out]')
cmd+=['-filter_complex',';'.join(fc),'-map','[out]','-map',f'{N}:a','-t','60.84','-c:v','libx264','-crf','20','-c:a','aac','-b:a','160k',f'song_{variant}.mp4']
subprocess.check_call(cmd)
# main trimmed (drop 5s end card) + song
tot=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'story_{variant}_v2.mp4']).decode())-5
subprocess.check_call(['ffmpeg','-y','-loglevel','error','-t',str(tot),'-i',f'story_{variant}_v2.mp4','-i',f'song_{variant}.mp4','-filter_complex','[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a]','-map','[v]','-map','[a]','-c:v','libx264','-crf','20','-c:a','aac','-b:a','160k','-movflags','+faststart',f'story_{variant}_v3.mp4'])
print('ok',tot)
