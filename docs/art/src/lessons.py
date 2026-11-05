import sys,math;sys.path.insert(0,'/tmp/artwork')
from shapes import *
INK='#3a2a1a'
def svg(w,h,body,vb=None): return f'<svg width="{w}" height="{h}" viewBox="{vb or f"0 0 {w} {h}"}">{body}</svg>'
# ---------- apple ----------
APPLE="M100 55 C80 40,40 50,38 100 C36 150,70 175,100 168 C130 175,164 150,162 100 C160 50,120 40,100 55 Z"
def apple(step):
    b=''
    if step==1: b+='<circle cx="100" cy="108" r="62" fill="none" stroke="#999" stroke-width="3" stroke-dasharray="6 5"/>'
    if step==2: b+='<circle cx="100" cy="108" r="62" fill="none" stroke="#999" stroke-width="3"/><line x1="100" y1="46" x2="100" y2="170" stroke="#e05555" stroke-width="3"/><line x1="38" y1="108" x2="162" y2="108" stroke="#e05555" stroke-width="3"/>'
    if step>=3: b+=f'<path d="{APPLE}" fill="{"#e24b4b" if step>=4 else "none"}" stroke="{INK}" stroke-width="4"/><path d="M100 55 C100 40,104 30,112 22" fill="none" stroke="{INK}" stroke-width="4"/><path d="M104 40 C120 20,145 28,150 35 C135 48,115 50,104 40 Z" fill="{"#58b45a" if step>=4 else "none"}" stroke="{INK}" stroke-width="3"/>'
    if step>=4: b+='<ellipse cx="72" cy="90" rx="9" ry="16" fill="#fff" opacity=".55" transform="rotate(20 72 90)"/>'
    if step>=5:
        b+='<clipPath id="ac"><path d="'+APPLE+'"/></clipPath><g clip-path="url(#ac)" stroke="#8c1d1d" stroke-width="2.5" opacity=".75">'+''.join(f'<line x1="{x}" y1="190" x2="{x+60}" y2="60"/>' for x in range(60,210,11))+'</g><ellipse cx="108" cy="178" rx="62" ry="9" fill="#555" opacity=".35"/>'
    return svg(160,160,b,'0 10 200 190')
def circle_dots(): return svg(160,160,'<circle cx="100" cy="100" r="70" fill="none" stroke="#ccc" stroke-width="3" stroke-dasharray="4 6"/>','0 0 200 200')
# ---------- sphere shading ----------
def sphere(kind):
    b='<circle cx="100" cy="100" r="62" fill="#fff" stroke="'+INK+'" stroke-width="4"/>'
    b+='<clipPath id="sc"><circle cx="100" cy="100" r="62"/></clipPath>'
    if kind=='hatch': b+='<g clip-path="url(#sc)" stroke="#555" stroke-width="2.5">'+''.join(f'<line x1="{x}" y1="170" x2="{x+50}" y2="40"/>' for x in range(70,210,9))+'</g>'
    if kind=='dots':
        import random;random.seed(3);b+='<g clip-path="url(#sc)" fill="#444">'+''.join(f'<circle cx="{x}" cy="{y}" r="2.2"/>' for x in range(50,160,7) for y in range(50,160,7) if ((x-70)**2+(y-70)**2)>1500 and random.random()<0.9)+'</g>'
    if kind=='smudge': b+='<defs><radialGradient id="g" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#555"/></radialGradient></defs><circle cx="100" cy="100" r="62" fill="url(#g)" stroke="'+INK+'" stroke-width="4"/>'
    b+='<ellipse cx="118" cy="172" rx="62" ry="9" fill="#555" opacity=".3"/>'
    return svg(130,130,b,'20 20 160 170')
# ---------- leaf ----------
LEAF="M100 20 C150 50,160 110,100 180 C40 110,50 50,100 20 Z"
def leaf(step):
    b=''
    if step>=1: b+=f'<path d="{LEAF}" fill="{"#7fc66b" if step>=4 else "none"}" stroke="{INK}" stroke-width="4"/>'
    if step>=2: b+='<path d="M100 20 C102 80,98 130,100 180" fill="none" stroke="'+INK+'" stroke-width="4"/>'
    if step>=3:
        for y in range(55,160,22):
            w=40-abs(y-100)*0.35
            b+=f'<path d="M100 {y+14} Q{100-w*0.6} {y+2} {100-w} {y-14}" fill="none" stroke="{INK}" stroke-width="3"/><path d="M100 {y+14} Q{100+w*0.6} {y+2} {100+w} {y-14}" fill="none" stroke="{INK}" stroke-width="3"/>'
    if step>=4: b+='<path d="M100 20 C102 80,98 130,100 180" fill="none" stroke="#3a7a2f" stroke-width="5"/>'
    return svg(130,150,b,'20 10 160 190')
# ---------- composition ----------
def jar(x,y,s=1,fill='#d98a5c'): return f'<g transform="translate({x},{y}) scale({s})"><path d="M-30 0 C-52 20,-52 70,-30 90 L30 90 C52 70,52 20,30 0 Z" fill="{fill}" stroke="{INK}" stroke-width="3"/><rect x="-16" y="-14" width="32" height="16" rx="4" fill="{fill}" stroke="{INK}" stroke-width="3"/></g>'
def bottle(x,y,s=1,fill='#7fb6d9'): return f'<g transform="translate({x},{y}) scale({s})"><path d="M-12 -40 L12 -40 L12 -8 C34 6,34 70,24 90 L-24 90 C-34 70,-34 6,-12 -8 Z" fill="{fill}" stroke="{INK}" stroke-width="3"/></g>'
def comp(good=True,grid=True,blank=False):
    W,H=300,210;b=f'<rect x="2" y="2" width="{W-4}" height="{H-4}" fill="#fffdf6" stroke="{INK}" stroke-width="3"/>'
    if grid: b+=''.join(f'<line x1="{W*i/3}" y1="2" x2="{W*i/3}" y2="{H-2}" stroke="#e0765a" stroke-width="2" stroke-dasharray="6 5"/>' for i in (1,2))+''.join(f'<line x1="2" y1="{H*i/3}" x2="{W-2}" y2="{H*i/3}" stroke="#e0765a" stroke-width="2" stroke-dasharray="6 5"/>' for i in (1,2))
    if not blank:
        if good: b+=jar(W*2/3,H/3+4,1.0)+bottle(W/3-36,H*2/3-60,0.8)+'<circle cx="%d" cy="%d" r="8" fill="#e0765a"/>'%(W*2/3,H/3)
        else: b+=jar(40,40,0.7)+bottle(260,160,0.5)+jar(150,150,0.5,'#cfa')
    return svg(W,H,b)
# ---------- geometric decoration ----------
def octagon(cx,cy,r,fill):
    pts=' '.join(f'{cx+r*math.cos(math.radians(22.5+i*45)):.1f},{cy+r*math.sin(math.radians(22.5+i*45)):.1f}' for i in range(8))
    return f'<polygon points="{pts}" fill="{fill}" stroke="{INK}" stroke-width="3"/>'
def decor_vert(color=True,half=False):
    b='<rect x="4" y="4" width="192" height="192" fill="#f6e3b0" stroke="'+INK+'" stroke-width="4"/><line x1="100" y1="4" x2="100" y2="196" stroke="#e0765a" stroke-width="3" stroke-dasharray="7 5"/>'
    def side(): return octagon(50,100,30,'#3d7bff' if color else 'none')+f'<circle cx="50" cy="100" r="12" fill="{"#ffd54a" if color else "none"}" stroke="{INK}" stroke-width="3"/><polygon points="50,20 62,36 38,36" fill="{"#e24b4b" if color else "none"}" stroke="{INK}" stroke-width="3"/><polygon points="50,180 62,164 38,164" fill="{"#e24b4b" if color else "none"}" stroke="{INK}" stroke-width="3"/>'
    b+=side()
    if not half: b+=f'<g transform="translate(200,0) scale(-1,1)">{side()}</g>'
    return svg(150,150,b,'0 0 200 200')
def decor_diag(step):
    b='<rect x="4" y="4" width="192" height="192" fill="'+('#f6e3b0' if step>=3 else '#fff')+'" stroke="'+INK+'" stroke-width="4"/>'
    if step>=2: b+='<line x1="4" y1="4" x2="196" y2="196" stroke="#e0765a" stroke-width="3"/><line x1="196" y1="4" x2="4" y2="196" stroke="#e0765a" stroke-width="3"/>'
    if step>=3:
        for (x,y,r) in ((52,52,0),(148,52,90),(148,148,180),(52,148,270)): b+=f'<polygon points="{x},{y-28} {x+16},{y+14} {x-16},{y+14}" transform="rotate({r+45} {x} {y})" fill="#3d7bff" stroke="{INK}" stroke-width="3"/>'
        b+='<circle cx="100" cy="100" r="22" fill="#ffd54a" stroke="'+INK+'" stroke-width="3"/>'
    return svg(130,130,b,'0 0 200 200')
# ---------- coil pot ----------
def pot(step):
    if step==1: return svg(150,110,'<ellipse cx="100" cy="60" rx="70" ry="22" fill="#d9a066" stroke="#8a5a2b" stroke-width="4"/><text x="100" y="66" text-anchor="middle" font-size="18" fill="#8a5a2b">قاعدة</text>','0 20 200 80')
    if step==2: return svg(150,110,'<ellipse cx="100" cy="60" rx="70" ry="22" fill="#d9a066" stroke="#8a5a2b" stroke-width="4"/><ellipse cx="100" cy="56" rx="54" ry="16" fill="none" stroke="#8a5a2b" stroke-width="12" opacity=".8"/>','0 20 200 80')
    n=6 if step==3 else 9;b=''
    for i in range(n):
        y=170-i*14;w=44+ 30*math.sin(i/ (n-1)*math.pi*0.9)
        b+=f'<rect x="{100-w}" y="{y-8}" width="{2*w}" height="16" rx="8" fill="#d98a5c" stroke="#8a5a2b" stroke-width="3"/>'
    if step==4: b+='<ellipse cx="100" cy="%d" rx="46" ry="8" fill="#a8683a" stroke="#8a5a2b" stroke-width="3"/>'%(170-8*14-8)
    return svg(150,150,b,'0 20 200 170')
def pot_fancy():
    b=''
    for i in range(9):
        y=170-i*14;w=44+30*math.sin(i/8*math.pi*0.9);b+=f'<rect x="{100-w}" y="{y-8}" width="{2*w}" height="16" rx="8" fill="#d98a5c" stroke="#8a5a2b" stroke-width="3"/>'
    b+='<path d="M70 120 q10 -16 20 0 t20 0 t20 0" fill="none" stroke="#8a5a2b" stroke-width="5"/><circle cx="100" cy="92" r="7" fill="none" stroke="#8a5a2b" stroke-width="4"/>'
    return svg(150,150,b,'0 20 200 170')
