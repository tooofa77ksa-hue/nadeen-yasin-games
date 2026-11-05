import math
DASH=' stroke-dasharray="10 7"'
def flower(cx,cy,r,fill='none',stroke='#222',sw=3):
    s=''
    for i in range(5):
        a=math.radians(i*72-90);x=cx+r*0.62*math.cos(a);y=cy+r*0.62*math.sin(a)
        s+=f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="{r*0.36:.1f}" ry="{r*0.5:.1f}" transform="rotate({i*72} {x:.1f} {y:.1f})" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
    return s+f'<circle cx="{cx}" cy="{cy}" r="{r*0.22:.1f}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def star(cx,cy,r,fill='none',stroke='#222',sw=3):
    pts=[]
    for i in range(10):
        a=math.radians(i*36-90);rr=r if i%2==0 else r*0.45;pts.append(f'{cx+rr*math.cos(a):.1f},{cy+rr*math.sin(a):.1f}')
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>'
def square(x,y,s,dash=True):
    d=DASH if dash else ''
    return f'<rect x="{x}" y="{y}" width="{s}" height="{s}" fill="none" stroke="#e0765a" stroke-width="3"{d}/>'
