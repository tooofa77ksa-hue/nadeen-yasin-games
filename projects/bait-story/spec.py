import json
HERE='/tmp/story/'
LAY=HERE+'lay'; VOX=HERE+'vox'
TEXT=json.load(open(VOX+'/text.json',encoding='utf-8'))
COLOR=(255,138,61)
MARK='تصميم عواطف الجهني · جميع الحقوق محفوظة  |  إهداء من نادين إلى صديقاتها ومعلمتها الأستاذة دلال السناني'
CH={'past':(214,25,95),'present':(47,123,216),'amr':(26,154,74),'maful':(225,29,72),'harf':(123,69,201),'majrur':(70,70,90)}
def blend_bg(name2, t_from, t_to):
    def draw(f,d,lt,sc,G):
        a=min(max((lt-t_from)/max(t_to-t_from,0.01),0),1)
        if a<=0: return
        from PIL import Image
        bg=G['bgimg'](name2); bw,bh=bg.size
        zoom=1+sc.get('zoom',0.05)*G['ease'](lt/sc['dur']); cw,ch=bw/(1.12*zoom),bh/(1.12*zoom)
        im=bg.resize((G['W'],G['H']),Image.BILINEAR,box=(bw/2-cw/2,bh/2-ch/2,bw/2+cw/2,bh/2+ch/2)).convert('RGBA')
        im.putalpha(int(255*a)); f.alpha_composite(im)
    return draw
def sp(id,img,x,**k):
    d=dict(id=id,img=img,x=x,y=k.pop('y',700),h=k.pop('h',430)); d.update(k); return d
SCENES=[
 dict(voice='v0',bg='bg_house',blur=6,title='قصة بيت القواعد',page='كتاب لغتي ص٩٤–١١٨',zoom=.04,fx=['sparkle'],
      sprites=[sp('a','stand_past',250,h=330,enter='left',talk=True,at=.4),sp('b','stand_present',420,h=330,enter='left',at=.6),sp('c','stand_amr',590,h=330,enter='left',at=.8),
               sp('d','stand_maful',760,h=330,enter='left',at=1.0),sp('e','stand_harf',930,h=330,enter='left',at=1.2),sp('f','stand_majrur',1100,h=330,enter='left',at=1.4)]),
 dict(voice='v1',bg='bg_desert',zoom=.06,pan=(.3,0),
      sprites=[sp('p','walk_present',250,enter='left',move='walk',speed=70,walk_for=6,z=2),sp('q','stand_amr',420,enter='left',move='walk',speed=70,walk_for=6,z=1,at=.4),
               sp('r','stand_maful',590,enter='left',move='walk',speed=70,walk_for=6,at=.7),sp('s','stand_past',760,enter='left',move='walk',speed=70,walk_for=6,at=1.0),sp('t','stand_harf',930,enter='left',move='walk',speed=70,walk_for=6,at=1.3)],
      labels=[dict(text='تائهون في الصحراء',at='تائهين',pos=(640,120),color=(214,25,95))]),
 dict(voice='v2',bg='bg_site_empty',zoom=.05,title='الفعل الماضي',page='ص٩٥',color=CH['past'],draw=blend_bg('bg_site_wall',8.0,10.5),
      sprites=[sp('m','hand_wave_past',420,enter='left',talk=True,move='idle',h=480)],
      labels=[dict(text='الماضي: مبني على الفتح',at='مبنيٌّ',pos=(900,170),to='m',color=CH['past']),dict(text='بنى + فتح',at='بنى',pos=(900,260),color=CH['past'])],
      events=[dict(sprite='m',at='سأبنيهِ',do='hop'),dict(sprite='m',at='افتتحَ',do='grow')]),
 dict(voice='v3',bg='bg_site_wall',zoom=.05,title='الفعل المضارع',page='ص٩٥',color=CH['present'],
      sprites=[sp('m','carry_present',250,enter='left',move='walk',speed=80,walk_for=9,talk=True,h=470)],
      labels=[dict(text='المضارع: مرفوع',at='مرفوعٌ',pos=(1000,160),to='m',color=CH['present']),dict(text='علامة رفعه: الضمة',at='الضمّةُ',pos=(1000,250),color=CH['present'])]),
 dict(voice='v4',bg='bg_inside',zoom=.05,title='فعل الأمر',page='ص٩٥',color=CH['amr'],
      sprites=[sp('m','relax_amr',560,enter='below',talk=True,move='idle',h=560)],
      labels=[dict(text='الأمر: مبني على السكون',at='مبنيٌّ',pos=(960,170),to='m',color=CH['amr']),dict(text='اسكنْ!',at='اسكنْ',pos=(260,170),color=CH['amr'])],
      events=[dict(sprite='m',at='اسكنْ',do='lean')]),
 dict(voice='v5',bg='bg_tent',zoom=.05,title='المفعول به',page='ص١١٥',color=CH['maful'],
      sprites=[sp('m','sad_maful',420,enter='right',move='idle',talk=True,h=470)],
      labels=[dict(text='المفعول به: منصوب',at='منصوبٌ',pos=(930,170),to='m',color=CH['maful']),dict(text='علامة نصبه: الفتحة',at='الفتحةُ',pos=(930,260),color=CH['maful'])]),
 dict(voice='v6',bg='bg_house',zoom=.05,title='حرف الجر',page='ص٨٤',color=CH['harf'],
      sprites=[sp('h','pull_harf',380,enter='left',talk=True,h=470,z=2),sp('j','stand_majrur',850,enter='right',move='walk',speed=-35,walk_for=6,h=430)],
      labels=[dict(text='حرف الجر: يجرّ الاسم الذي بعده',at='يجرُّ',pos=(420,120),to='h',color=CH['harf']),dict(text='الاسم المجرور: علامته الكسرة',at='الكسرةُ',pos=(900,120),to='j',color=CH['majrur'])]),
 dict(voice='v7',bg='bg_house',zoom=.06,fx=['sparkle'],
      sprites=[sp('a','stand_past',200,h=360,enter='below',at=.3),sp('b','stand_present',380,h=360,enter='below',at=.6),sp('c','stand_amr',560,h=360,enter='below',at=.9),sp('d','stand_maful',740,h=360,enter='below',at=1.2),sp('e','stand_harf',920,h=360,enter='below',at=1.5),sp('f','stand_majrur',1090,h=360,enter='below',at=1.8)],
      events=[dict(sprite=k,at=2.4+i*.15,do='hop') for i,k in enumerate('abcdef')]),
 dict(voice='v8',bg='bg_house',blur=10,zoom=.03,title='جملة الحفظ',page='ص٩٥',pad=(0.5,2.5),fx=['sparkle'],
      labels=[dict(text='الماضي بنى وفتح',at='الماضي',pos=(640,140),color=CH['past'],size=40),dict(text='والمضارع رفعٌ',at='والمضارعُ',pos=(640,235),color=CH['present'],size=40),
              dict(text='والأمر سكن',at='والأمرُ',pos=(640,330),color=CH['amr'],size=40),dict(text='والمفعول به نصبٌ وفتحٌ',at='والمفعولُ',pos=(640,425),color=CH['maful'],size=40),
              dict(text='وحرف الجر جرٌّ',at='وحرفُ',pos=(640,520),color=CH['harf'],size=40)]),
]
