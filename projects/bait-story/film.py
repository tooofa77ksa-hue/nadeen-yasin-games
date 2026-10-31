"""Nadeen lesson film engine — layered motion from one spec (all timings in one place).
usage: python3 film.py spec.py out.mp4 [first_scene last_scene]
Each scene: background plate + separate sprite layers that move on their own, word-triggered entrances/labels/events,
captions timed by edge-tts word boundaries, sprites marked talk=True bounce with the voice."""
import json, math, os, random, subprocess, sys, wave, re
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FF = '/usr/bin/ffmpeg'
W, H, FPS, SR = 1280, 720, 25, 24000
KB = '/home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf'; NB = '/home/user/nadeen-yasin-games/shared/fonts/Baloo-Bold.ttf'
HERE = os.path.dirname(os.path.abspath(__file__))
SPEC = {}; exec(open(sys.argv[1], encoding='utf-8').read(), SPEC)
OUT = sys.argv[2]; RNG = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else None
LAY, VOX = SPEC['LAY'], SPEC['VOX']; XF = 0.45
random.seed(7)

def F(s, f=KB): return ImageFont.truetype(f, s, layout_engine=ImageFont.Layout.RAQM)
def tb(d, t, f): b = d.textbbox((0, 0), t, font=f, direction='rtl', language='ar'); return b, b[2] - b[0], b[3] - b[1]
def ease(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def back(x):
    x = min(max(x, 0.0), 1.0); c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2
def bump(x): return math.sin(min(max(x, 0), 1) * math.pi)
def strip(s): return re.sub(r'[ً-ْـ]', '', s)

def decode(p, a=None, b=None):
    cmd = [FF, '-v', 'error'] + (['-ss', str(a), '-to', str(b)] if a is not None else []) + ['-i', p, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.int16).astype(np.float32) / 32768

# ---------- cached drawing helpers ----------
_sp = {}
def sprite(name, h, flip=False):
    k = (name, h, flip)
    if k not in _sp:
        im = Image.open(os.path.join(LAY, name + '.png')).convert('RGBA'); im = im.crop(im.getchannel('A').getbbox())
        im = im.resize((max(1, int(im.width * h / im.height)), h), Image.LANCZOS)
        _sp[k] = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
    return _sp[k]
_bg = {}
def bgimg(name, blur=0):
    if (name, blur) not in _bg:
        im = Image.open(os.path.join(LAY, name + '.png')).convert('RGB'); w, h = im.size; th = int(w * 9 / 16)
        if th <= h: y = (h - th) // 2; im = im.crop((0, y, w, y + th))
        im = im.resize((int(W * 1.12), int(H * 1.12)), Image.LANCZOS)
        if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
        _bg[(name, blur)] = im
    return _bg[(name, blur)]

def chip_img(text, color, size=32, font=NB, pad=22):
    f = F(size, font); d0 = ImageDraw.Draw(Image.new('RGBA', (4, 4))); b, w, h = tb(d0, text, f)
    im = Image.new('RGBA', (w + 2 * pad, h + pad + 6), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 4, im.width - 1, im.height - 1), 22, fill=(0, 0, 0, 70))
    d.rounded_rectangle((0, 0, im.width - 1, im.height - 5), 22, fill=tuple(color) + (255,), outline=(255, 255, 255, 255), width=3)
    d.text((pad - b[0], (im.height - 5 - h) / 2 - b[1]), text, font=f, fill='white', direction='rtl', language='ar'); return im
_chips = {}
def chip(text, color, size=32):
    k = (text, tuple(color), size)
    if k not in _chips: _chips[k] = chip_img(text, color, size)
    return _chips[k]

def caption_img(text):
    f = F(36, NB); d0 = ImageDraw.Draw(Image.new('RGBA', (4, 4))); words = text.split(); lines = []; cur = ''
    for w_ in words:
        c = (cur + ' ' + w_).strip()
        if tb(d0, c, f)[1] > W - 200 and cur: lines.append(cur); cur = w_
        else: cur = c
    lines.append(cur); lh = 58; hh = lh * len(lines) + 20
    im = Image.new('RGBA', (W, hh + 30), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    wmax = max(tb(d0, l, f)[1] for l in lines)
    d.rounded_rectangle(((W - wmax) / 2 - 34, 10, (W + wmax) / 2 + 34, 10 + hh), 26, fill=(14, 20, 40, 210))
    for i, l in enumerate(lines):
        b, w, h = tb(d0, l, f); d.text(((W - w) / 2 - b[0], 20 + i * lh + (lh - h) / 2 - b[1]), l, font=f, fill='white', direction='rtl', language='ar')
    return im

def title_chip(title, page, color):
    f = F(34); fp = F(22); d0 = ImageDraw.Draw(Image.new('RGBA', (4, 4))); b, w, h = tb(d0, title, f); pb, pw, ph = tb(d0, page, fp)
    im = Image.new('RGBA', (w + pw + 90, 80), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 4, im.width - 1, 76), 26, fill=(0, 0, 0, 60)); d.rounded_rectangle((0, 0, im.width - 1, 72), 26, fill=tuple(color) + (255,))
    d.rounded_rectangle((16, 16, 16 + pw + 24, 56), 18, fill=(255, 255, 255, 240))
    d.text((28 - pb[0], 36 - ph / 2 - pb[1]), page, font=fp, fill=tuple(color), direction='rtl', language='ar')
    d.text((pw + 64 - b[0], 36 - h / 2 - b[1]), title, font=f, fill='white', direction='rtl', language='ar'); return im

MARK = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(MARK).text((24, H - 32), SPEC.get('MARK', ''), font=F(17, NB), fill=(255, 255, 255, 210), direction='rtl', language='ar')

def paste(base, im, cx, by, ang=0.0, sx=1.0, sy=1.0, alpha=1.0, anchor='bottom'):
    if sx != 1 or sy != 1: im = im.resize((max(1, int(im.width * sx)), max(1, int(im.height * sy))), Image.BILINEAR)
    if anchor == 'center': by = by + im.height / 2
    if ang:
        pad = Image.new('RGBA', (im.width, im.height * 2), (0, 0, 0, 0)); pad.paste(im, (0, 0))
        im = pad.rotate(ang, resample=Image.BICUBIC, expand=True); cy = im.height / 2
    else: cy = im.height
    if alpha < 0.999:
        im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v, a=alpha: int(v * a)))
    base.alpha_composite(im, (int(cx - im.width / 2), int(by - cy)))
    return (cx - im.width / 2, by - cy, cx + im.width / 2, by - cy + im.height)

def wave_sprite(im, t, amp=9, k=40.0, sp=2.2, start=0.0):
    A = np.array(im); h, w = A.shape[:2]; yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    wgt = np.clip((xx / w - start) / (1 - start + 1e-6), 0, 1)
    dy = amp * np.sin(2 * math.pi * sp * t - xx / k) * wgt
    return Image.fromarray(cv2.remap(A, xx, yy - dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0)))

# ---------- scene preparation ----------
scenes = SPEC['SCENES']
if RNG: scenes = scenes[RNG[0]:RNG[1]]
t0 = 0.0; audio = []
for sc in scenes:
    lead, tail = sc.get('pad', (0.6, 0.8))
    if 'voice' in sc:
        a = decode(os.path.join(VOX, sc['voice'] + '.mp3'))
        words = json.load(open(os.path.join(VOX, sc['voice'] + '.words.json'), encoding='utf-8'))
        sc['words'] = [[lead + w[0], lead + w[0] + w[1], w[2]] for w in words]
        sc['text'] = SPEC['TEXT'][sc['voice']]
    elif 'audio' in sc:
        a = decode(sc['audio'][0], sc['audio'][1], sc['audio'][2]); sc['words'] = []
    else: a = np.zeros(0, np.float32); sc['words'] = []
    dur = sc.get('dur') or (lead + len(a) / SR + tail)
    sc.update(t0=t0, dur=dur, lead=lead)
    if len(a): audio.append((t0 + lead, a * sc.get('gain', 1.0)))
    env = np.zeros(int(dur * FPS) + 2)
    if len(a):
        for i in range(len(env)):
            s = int((i / FPS - lead) * SR)
            if 0 <= s < len(a): env[i] = float(np.sqrt(np.mean(a[s:s + SR // FPS] ** 2)))
        env = np.convolve(env / (env.max() + 1e-6), np.ones(3) / 3, 'same')
    sc['env'] = env
    for s in sc.get('sfx', []):
        audio.append((t0 + s[1] if isinstance(s[1], (int, float)) else t0, decode(s[0]) * s[2] if len(s) > 2 else decode(s[0]) * .3))
    t0 += dur
TOTAL = t0
print('total', round(TOTAL, 1), 's', len(scenes), 'scenes')

def when(sc, at):
    """time (scene-local) for a trigger: number, or word substring (optionally 'word#n' for nth match)"""
    if at is None: return 0.0
    if isinstance(at, (int, float)): return float(at)
    n = 0
    if '#' in at: at, n = at.split('#'); n = int(n)
    hits = [w for w in sc['words'] if strip(at) in strip(w[2])]
    if not hits: raise SystemExit(f'trigger {at!r} not found in {sc.get("voice")}')
    return hits[min(n, len(hits) - 1)][0]

for sc in scenes:
    sc['caps'] = []
    if sc.get('words') and not sc.get('nocap'):
        toks = sc['text'].split(); ws = sc['words']; phrase = []; i = 0
        for tok in toks:
            phrase.append(tok)
            if re.search(r'[،.!؟?:]$', tok) or tok is toks[-1]:
                n = len(phrase); s = ws[min(i, len(ws) - 1)][0]; e = ws[min(i + n - 1, len(ws) - 1)][1]
                if n < 3 and tok is not toks[-1]: continue
                sc['caps'].append([s, e, caption_img(' '.join(phrase))]); i += n; phrase = []
    for c in sc.get('lyrics', []): sc['caps'].append([c[0], c[1], caption_img(c[2])])
    for j in range(len(sc['caps']) - 1): sc['caps'][j][1] = min(sc['caps'][j][1], sc['caps'][j + 1][0] - .5)
    sc['chipimg'] = title_chip(sc['title'], sc['page'], sc.get('color', SPEC['COLOR'])) if sc.get('title') else None
    for sp in sc.get('sprites', []): sp['t_in'] = when(sc, sp.get('at')) if sp.get('at') is not None else sp.get('t', 0.0)
    for lb in sc.get('labels', []): lb['t_in'] = when(sc, lb['at'])
    for ev in sc.get('events', []): ev['t_in'] = when(sc, ev['at'])

# ---------- audio track ----------
buf = np.zeros(int((TOTAL + 1) * SR), np.float32)
for st, a in audio:
    i = int(st * SR); buf[i:i + len(a)] += a[:max(0, len(buf) - i)]
pk = np.abs(buf).max(); buf = np.clip(buf / max(pk, 1e-6) * 0.92, -1, 1)
with wave.open(OUT + '.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype(np.int16).tobytes())

# ---------- fx ----------
RAYS = Image.new('L', (W * 2, H), 0); d_ = ImageDraw.Draw(RAYS)
for i in range(14):
    x = random.randint(0, W * 2); w_ = random.randint(30, 90)
    d_.polygon([(x, 0), (x + w_, 0), (x + w_ * 3 - 160, H), (x - 160, H)], fill=random.randint(40, 90))
RAYS = RAYS.filter(ImageFilter.GaussianBlur(18))
BUB = [dict(x=random.uniform(40, W - 40), s=random.uniform(4, 12), v=random.uniform(40, 95), p=random.uniform(0, 30)) for _ in range(24)]
SPARK = [dict(x=random.uniform(0, W), y=random.uniform(0, H * .7), p=random.uniform(0, 6)) for _ in range(30)]

def fx(f, kinds, t):
    d = ImageDraw.Draw(f)
    if 'rays' in kinds:
        rr = RAYS.crop((int(t * 22) % W, 0, int(t * 22) % W + W, H)); g = Image.new('RGBA', (W, H), (220, 240, 255, 0))
        g.putalpha(rr.point(lambda v: int(v * (0.5 + 0.2 * math.sin(t * 1.3))))); f.alpha_composite(g)
    if 'bubbles' in kinds:
        for b in BUB:
            y = H - ((t + b['p']) * b['v']) % (H + 60); x = b['x'] + 8 * math.sin(t * 2 + b['p'])
            d.ellipse((x - b['s'], y - b['s'], x + b['s'], y + b['s']), outline=(220, 245, 255, 160), width=2)
            d.ellipse((x - b['s'] * .5, y - b['s'] * .6, x - b['s'] * .1, y - b['s'] * .2), fill=(255, 255, 255, 170))
    if 'sparkle' in kinds:
        for s in SPARK:
            a = max(0, math.sin(t * 2.5 + s['p'])); r = 3 + 4 * a
            if a > 0.2: d.ellipse((s['x'] - r, s['y'] - r, s['x'] + r, s['y'] + r), fill=(255, 250, 200, int(200 * a)))
    if 'ripples' in kinds:
        for i in range(4):
            ph = ((t * 0.5 + i * .25) % 1); r = 30 + ph * 140; cx, cy = 300 + i * 220, 560 + (i % 2) * 40
            d.ellipse((cx - r, cy - r * .25, cx + r, cy + r * .25), outline=(255, 255, 255, int(120 * (1 - ph))), width=3)

def thermo(d, x, y, level, color):
    d.rounded_rectangle((x - 16, y - 170, x + 16, y + 10), 16, fill=(255, 255, 255, 235), outline=(90, 90, 110, 255), width=3)
    d.ellipse((x - 30, y - 6, x + 30, y + 54), fill=color + (255,), outline=(90, 90, 110, 255), width=3)
    top = y - 20 - 140 * level; d.rectangle((x - 8, top, x + 8, y + 10), fill=color + (255,))
    for k in range(6): d.line((x + 16, y - 20 - k * 28, x + 28, y - 20 - k * 28), fill=(90, 90, 110, 255), width=3)

# ---------- render ----------
def render(sc, lt):
    zoom = 1 + sc.get('zoom', 0.05) * ease(lt / sc['dur']); pan = sc.get('pan', (0, 0))
    bg = bgimg(sc['bg'], sc.get('blur', 0)); bw, bh = bg.size; cw, ch = bw / (1.12 * zoom), bh / (1.12 * zoom)
    cx = bw / 2 + pan[0] * (bw - cw) / 2 * ease(lt / sc['dur']); cy = bh / 2 + pan[1] * (bh - ch) / 2 * ease(lt / sc['dur'])
    f = bg.resize((W, H), Image.BILINEAR, box=(cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2)).convert('RGBA')
    fx(f, sc.get('fx', []), sc['t0'] + lt)
    d = ImageDraw.Draw(f)
    if sc.get('draw'): sc['draw'](f, d, lt, sc, globals())
    env = sc['env'][min(int(lt * FPS), len(sc['env']) - 1)]
    boxes = {}
    for sp in sorted(sc.get('sprites', []), key=lambda s: s.get('z', 0)):
        u = lt - sp['t_in']
        if u < 0 or (sp.get('until') is not None and lt > when(sc, sp['until']) + 0.4): continue
        out_a = 1 - ease((lt - when(sc, sp['until'])) / 0.4) if sp.get('until') is not None else 1
        im = sprite(sp['img'], sp['h'], sp.get('flip', False)); x, y = sp['x'], sp['y']; ang = 0; sx = sy = 1; m = sp.get('move', 'idle')
        ph = sp.get('ph', hash(sp['img']) % 7)
        # entrance
        e = sp.get('enter', 'pop'); k = back(u / 0.7)
        if e == 'left': x -= (1 - k) * (x + im.width)
        elif e == 'right': x += (1 - k) * (W - x + im.width)
        elif e == 'below': y += (1 - k) * (H - y + im.height + 40)
        elif e == 'above': y -= (1 - k) * (y + 40)
        elif e == 'pop': s_ = max(0.01, k); sx *= s_; sy *= s_
        # motion
        if m == 'idle': ang += 1.2 * math.sin(lt * 2.0 + ph); sy *= 1 + .01 * math.sin(lt * 3.3 + ph)
        elif m == 'walk':
            sp_ = sp.get('speed', 0); x += sp_ * min(u, sp.get('walk_for', 99)); moving = u < sp.get('walk_for', 99)
            if moving: y -= abs(math.sin(lt * 7 + ph)) * 8; ang += 3 * math.sin(lt * 7 + ph)
            else: ang += 1.2 * math.sin(lt * 2 + ph)
        elif m == 'hop':
            hp = ((lt + ph) % sp.get('period', 1.8)) / sp.get('period', 1.8); hh = bump(hp / 0.45) * sp.get('hop', 40)
            y -= hh; sy *= 1 - 0.08 * bump((hp - .45) / .15) if hp > .45 else 1
        elif m == 'swim':
            x += sp.get('speed', -60) * u; y += 14 * math.sin(lt * 1.6 + ph); ang += 5 * math.sin(lt * 8 + ph)
            im = wave_sprite(im, lt, amp=sp.get('amp', 6), k=35, sp=2.4, start=.3) if sp.get('wave', True) else im
        elif m == 'fly':
            x += sp.get('speed', -90) * u; y += 26 * math.sin(lt * 2.2 + ph); sy *= 1 - .07 * abs(math.sin(lt * 14))
        elif m == 'float': y += 10 * math.sin(lt * 1.5 + ph); ang += 2 * math.sin(lt * 1.1 + ph)
        elif m == 'slither': im = wave_sprite(im, lt, amp=7, k=30, sp=1.6, start=.0); ang += 2 * math.sin(lt * 1.5)
        if sp.get('talk'): sy *= 1 + .05 * env; sx *= 1 - .015 * env; y -= 8 * env
        for ev in sc.get('events', []):
            if ev['sprite'] != sp['id']: continue
            v = lt - ev['t_in']
            if ev['do'] == 'hop': y -= bump(v / .5) * 45
            elif ev['do'] == 'wiggle': ang += 8 * math.sin(v * 25) * (1 - ease(v / .8)) if 0 < v < .8 else 0
            elif ev['do'] == 'grow': g = 1 + .18 * bump(v / .8); sx *= g; sy *= g
            elif ev['do'] == 'lean': ang += 6 * bump(v / 1.2)
            elif ev['do'] == 'glow' and v > 0:
                r = im.height * .62 + 8 * math.sin(lt * 6); a_ = int(200 * ease(v / .4))
                d.ellipse((x - r, y - im.height / 2 - r * .8, x + r, y - im.height / 2 + r * .8), outline=(255, 235, 110, a_), width=7)
        boxes[sp['id']] = paste(f, im, x, y, ang, sx, sy, out_a)
    # labels
    for lb in sc.get('labels', []):
        v = lt - lb['t_in']
        if v < 0: continue
        if lb.get('until') is not None and lt > when(sc, lb['until']) + .3: continue
        s = back(v / .45) * (1 - ease((lt - when(sc, lb['until'])) / .3) if lb.get('until') is not None else 1)
        im = chip(lb['text'], lb.get('color', sc.get('color', SPEC['COLOR'])), lb.get('size', 30)); lx, ly = lb['pos']
        if lb.get('to') and lb['to'] in boxes:
            bx = boxes[lb['to']]; tx = bx[0] + (bx[2] - bx[0]) * lb.get('tx', .5); ty = bx[1] + (bx[3] - bx[1]) * lb.get('ty', .3)
            d.line((lx, ly, tx, ty), fill=(255, 255, 255, int(230 * min(s, 1))), width=4); d.ellipse((tx - 7, ty - 7, tx + 7, ty + 7), fill=(255, 255, 255, int(230 * min(s, 1))))
        if s > 0.02:
            sm = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BILINEAR); f.alpha_composite(sm, (int(lx - sm.width / 2), int(ly - sm.height / 2)))
    if sc.get('over'): sc['over'](f, ImageDraw.Draw(f), lt, sc, globals())
    if sc['chipimg'] is not None:
        c = back((lt - .25) / .5)
        if c > 0: f.alpha_composite(sc['chipimg'], (int(28 - (1 - c) * 320), 26))
    for s, e, im in sc['caps']:
        if s - .1 <= lt <= e + .45:
            a = min(ease((lt - s + .1) / .2), 1 - ease((lt - e - .25) / .2)); im2 = im.copy(); im2.putalpha(im.getchannel('A').point(lambda v, a=a: int(v * a)))
            f.alpha_composite(im2, (0, H - im.height - 18))
    f.alpha_composite(MARK)
    return f.convert('RGB')

p = subprocess.Popen([FF, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', OUT + '.wav',
                      '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
N = int(TOTAL * FPS)
for k in range(N):
    t = k / FPS; i = max(j for j, s in enumerate(scenes) if s['t0'] <= t + 1e-9); sc = scenes[i]; fr = render(sc, t - sc['t0'])
    if i + 1 < len(scenes) and t > sc['t0'] + sc['dur'] - XF:
        fr = Image.blend(fr, render(scenes[i + 1], 0), ease((t - (sc['t0'] + sc['dur'] - XF)) / XF))
    if t < .4: fr = Image.blend(Image.new('RGB', (W, H)), fr, ease(t / .4))
    if t > TOTAL - .6: fr = Image.blend(fr, Image.new('RGB', (W, H)), ease((t - TOTAL + .6) / .6))
    p.stdin.write(fr.tobytes())
    if k % 500 == 0: print(f'{k}/{N}', flush=True)
p.stdin.close(); p.wait(); os.remove(OUT + '.wav'); print('done', OUT, round(TOTAL, 1))
