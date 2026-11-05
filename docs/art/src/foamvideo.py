import os, math, subprocess, asyncio, json, sys
os.environ['SSL_CERT_FILE'] = '/root/.ccr/ca-bundle.crt'
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS = 720, 1280, 24
FB = '/home/user/nadeen-yasin-games/shared/fonts/Baloo-ExtraBold.ttf'
FM = '/home/user/nadeen-yasin-games/shared/fonts/Baloo-SemiBold.ttf'
EM = '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
OUT = '/tmp/artwork/foam'
os.makedirs(OUT, exist_ok=True)

def F(s, f=FB):
    return ImageFont.truetype(f, s, layout_engine=ImageFont.Layout.RAQM)

_ec = {}
def emoji(e, size):
    k = (e, size)
    if k in _ec: return _ec[k]
    im = Image.new('RGBA', (136, 128), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((0, 0), e, font=ImageFont.truetype(EM, 109), embedded_color=True)
    im = im.crop(im.getbbox() or (0, 0, 136, 128))
    r = size / max(im.size)
    im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    _ec[k] = im
    return im

def ease(x): x = max(0, min(1, x)); return 1 - (1 - x) ** 3
def inout(x): x = max(0, min(1, x)); return 3 * x * x - 2 * x ** 3

GREEN = (88, 180, 90); BLUE = (74, 143, 224); RED = (226, 75, 75); YEL = (255, 200, 40)
INK = (58, 42, 26)

def bg():
    g = Image.new('RGB', (1, H)); px = g.load()
    for y in range(H):
        t = y / H
        px[0, y] = (int(255 * (1 - t) + 255 * t), int(247 * (1 - t) + 233 * t), int(234 * (1 - t) + 207 * t))
    return g.resize((W, H)).convert('RGBA')

BG = bg()

def flower_pts(cx, cy, R, n=180, rot=0.0):
    pts = []
    for i in range(n):
        th = 2 * math.pi * i / n
        r = R * (0.62 + 0.38 * abs(math.cos(2.5 * th)))
        pts.append((cx + r * math.cos(th + rot), cy + r * math.sin(th + rot)))
    return pts

def rrect(d, box, r, fill, outline=None, width=0):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def foam_square(im, cx, cy, s, color, hole=False, hole_R=None, alpha=255):
    """a foam square; hole=True cuts a flower-shaped hole showing what is behind"""
    layer = Image.new('RGBA', (int(s) + 16, int(s) + 16), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    rrect(d, (8, 8, s + 8, s + 8), 10, color + (255,), tuple(max(0, c - 60) for c in color) + (255,), 4)
    for i in range(14):
        x = 20 + (i * 53) % int(s - 30); y = 20 + (i * 97) % int(s - 30)
        d.ellipse((x, y, x + 5, y + 5), fill=tuple(min(255, c + 30) for c in color) + (255,))
    if hole:
        mask = Image.new('L', layer.size, 255)
        ImageDraw.Draw(mask).polygon(flower_pts(layer.width / 2, layer.height / 2, hole_R), fill=0)
        a = layer.split()[3]
        layer.putalpha(Image.composite(a, Image.new('L', layer.size, 0), mask))
        d2 = ImageDraw.Draw(layer)
        d2.line(flower_pts(layer.width / 2, layer.height / 2, hole_R) + [flower_pts(layer.width / 2, layer.height / 2, hole_R)[0]], fill=tuple(max(0, c - 60) for c in color) + (255,), width=3)
    if alpha < 255:
        layer.putalpha(layer.split()[3].point(lambda v: v * alpha // 255))
    im.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))

def foam_flower(im, cx, cy, R, color, angle=0, scale=1.0):
    S = int(R * 2.6)
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = flower_pts(S / 2, S / 2, R)
    d.polygon(pts, fill=color + (255,), outline=tuple(max(0, c - 60) for c in color) + (255,))
    d.line(pts + [pts[0]], fill=tuple(max(0, c - 60) for c in color) + (255,), width=4)
    for i in range(8):
        x = S / 2 + (i * 17 % 40) - 20; y = S / 2 + (i * 29 % 40) - 20
        d.ellipse((x, y, x + 5, y + 5), fill=tuple(min(255, c + 35) for c in color) + (255,))
    if angle: layer = layer.rotate(angle, resample=Image.BICUBIC)
    if scale != 1.0: layer = layer.resize((max(1, int(S * scale)), max(1, int(S * scale))), Image.LANCZOS)
    im.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))

def text_c(im, text, y, size=54, fill=(58, 42, 26), bar=False, color_bar=(255, 255, 255, 215)):
    d = ImageDraw.Draw(im, 'RGBA'); f = F(size)
    b = d.textbbox((0, 0), text, font=f, direction='rtl', language='ar'); w = b[2] - b[0]; h = b[3] - b[1]
    while w > W - 60 and size > 28:
        size -= 3; f = F(size); b = d.textbbox((0, 0), text, font=f, direction='rtl', language='ar'); w = b[2] - b[0]; h = b[3] - b[1]
    x = (W - w) / 2
    if bar: d.rounded_rectangle((x - 28, y - 14, x + w + 28, y + h + 28), radius=30, fill=color_bar)
    d.text((x - b[0], y - b[1]), text, font=f, fill=fill, direction='rtl', language='ar')

import re
def clean(t): return re.sub(r'[\U00010000-\U0010FFFF\u2600-\u27BF\uFE0F]','',t).strip()
def title(im, t, sub=None):
    t = clean(t); sub = clean(sub) if sub else sub
    d = ImageDraw.Draw(im, 'RGBA')
    d.rounded_rectangle((30, 40, W - 30, 150), radius=36, fill=(255, 154, 77, 255))
    text_c(im, t, 62, 56, (255, 255, 255))
    if sub: text_c(im, sub, 165, 34, (120, 90, 60))

def caption(im, t): text_c(im, t, 1090, 46, INK, True)

def pop(t, t0, dur=0.45):
    p = (t - t0) / dur
    if p <= 0: return 0
    if p >= 1: return 1.0 + 0.0
    return ease(p) * (1.15 if p < 0.7 else 1.15 - 0.15 * (p - 0.7) / 0.3)

def paste_c(im, layer, cx, cy):
    im.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2)))

def scissors(im, x, y, size=90, ang=0, t=0):
    e = emoji('✂️', size).rotate(ang, expand=True)
    paste_c(im, e, x, y)

# ---------------- scenes ----------------
def s_title(t, d):
    im = BG.copy()
    title(im, '🎨 الطباعة بالفوم', None)
    for i, (k, cx, col) in enumerate([(0, 230, RED), (1, 490, YEL)]):
        p = pop(t, 0.5 + i * 0.5)
        if p:
            foam_flower(im, cx, 520, 100, col, scale=p)
    caption(im, 'نسوي قالب ونطبع زهرة')
    return im

def s_materials(t, d):
    im = BG.copy(); title(im, '🧰 نحتاج', 'من البيت')
    items = [('فوم أزرق', 'blue'), ('فوم أخضر', 'green'), ('مقص (مع ماما)', '✂️'), ('صمغ', '🧴'), ('ألوان وفرشاة', '🎨'), ('كراستك', '📓')]
    for i, (lab, kind) in enumerate(items):
        col = i % 2; row = i // 2
        cx = 240 + (1 - col) * 240 if False else (480 if col == 0 else 240)
        cy = 380 + row * 230
        p = pop(t, 0.4 + i * 0.9)
        if not p: continue
        card = Image.new('RGBA', (210, 200), (0, 0, 0, 0)); dd = ImageDraw.Draw(card)
        dd.rounded_rectangle((0, 0, 209, 199), radius=26, fill=(255, 255, 255, 255), outline=(255, 210, 168, 255), width=4)
        if kind in ('blue', 'green'):
            rrect(dd, (55, 25, 155, 115), 10, (BLUE if kind == 'blue' else GREEN) + (255,), None)
        else:
            e = emoji(kind, 96); card.alpha_composite(e, (int(105 - e.width / 2), int(70 - e.height / 2)))
        f = F(30); b = dd.textbbox((0, 0), lab, font=f, direction='rtl', language='ar')
        dd.text((105 - (b[2] - b[0]) / 2 - b[0], 140 - b[1]), lab, font=f, fill=INK, direction='rtl', language='ar')
        if p != 1.0: card = card.resize((max(1, int(210 * p)), max(1, int(200 * p))), Image.LANCZOS)
        paste_c(im, card, cx, cy)
    caption(im, 'ورق الفوم الملوّن يكفي')
    return im

def s_draw(t, d):
    im = BG.copy(); title(im, '✏️ أولاً', 'ارسمي زهرة على ورقة')
    dd = ImageDraw.Draw(im, 'RGBA')
    dd.rounded_rectangle((110, 260, 610, 860), radius=24, fill=(255, 255, 255, 255), outline=(220, 200, 170, 255), width=5)
    pts = flower_pts(360, 560, 170)
    p = min(1, t / (d * 0.55))
    n = int(len(pts) * p)
    if n > 1: dd.line(pts[:n], fill=INK + (255,), width=7, joint='curve')
    if p >= 1: dd.line(pts + [pts[0]], fill=INK + (255,), width=7)
    if n and p < 1:
        paste_c(im, emoji('✏️', 84).rotate(-30, expand=True), pts[n - 1][0] + 30, pts[n - 1][1] - 30)
    if t > d * 0.60:
        cp = min(1, (t - d * 0.60) / (d * 0.22))
        n2 = int(len(pts) * cp)
        if n2 > 1: dd.line(pts[:n2], fill=(255, 154, 77, 255), width=9)
        if cp < 1 and n2 > 0: paste_c(im, emoji('✂️', 96), pts[n2 - 1][0], pts[n2 - 1][1])
        if cp >= 1:
            q = ease((t - d * 0.82) / 0.8)
            if q > 0:
                dd.rounded_rectangle((110, 260, 610, 860), radius=24, fill=(255, 255, 255, 255), outline=(220, 200, 170, 255), width=5)
                dd.polygon(pts, fill=(235, 230, 220, 255)); dd.line(pts + [pts[0]], fill=(200, 190, 175, 255), width=4)
                foam_flower(im, 360 + 110 * q, 560 + 250 * q, 170 * (1 - 0.25 * q), (255, 255, 255), angle=10 * q)
                dd.line(pts + [pts[0]], fill=(255, 154, 77, 255), width=5)
        text_c(im, 'واقصّيها (أو استعملي النموذج الجاهز)', 900, 38, INK, True)
    caption(im, 'زهرة كبيرة وبسيطة')
    return im

def s_cut(t, d):
    im = BG.copy(); title(im, '✂️ ثانياً', 'اقصّي الإطار من الفوم الأزرق')
    cx, cy, R = 360, 600, 150
    sq = 470
    # phases: 0-1.3 pattern on foam, 1.3-3.2 trace, 3.2-... cut, then separate
    ph_cut_start = d * 0.30; ph_cut_end = d * 0.72
    foam_square(im, cx, cy, sq, BLUE)
    pts = flower_pts(cx, cy, R)
    if t < d * 0.12:
        pass
    # trace line (ink) appears
    tp = min(1, max(0, (t - d * 0.08) / (d * 0.2)))
    if tp > 0:
        n = int(len(pts) * tp); dd = ImageDraw.Draw(im, 'RGBA')
        if n > 1: dd.line(pts[:n], fill=(255, 255, 255, 255), width=5)
    cp = min(1, max(0, (t - ph_cut_start) / (ph_cut_end - ph_cut_start)))
    if cp > 0:
        dd = ImageDraw.Draw(im, 'RGBA'); n = int(len(pts) * cp)
        if n > 1: dd.line(pts[:n], fill=(255, 235, 120, 255), width=8)
        if cp < 1 and n > 0: scissors(im, pts[n - 1][0], pts[n - 1][1], 96, -math.degrees(math.atan2(pts[min(n, len(pts) - 1)][1] - pts[n - 1][1], pts[min(n, len(pts) - 1)][0] - pts[n - 1][0])) if False else 0)
    if t > ph_cut_end:
        q = ease((t - ph_cut_end) / 1.2)
        # redraw: frame with hole + flower moving out
        im2 = BG.copy(); title(im2, '✂️ ثانياً', 'اقصّي الإطار من الفوم الأزرق')
        foam_square(im2, cx - 90 * q, cy + 20 * q, sq, BLUE, hole=True, hole_R=R)
        foam_flower(im2, cx + 235 * q, cy + 330 * q + 20, R * 0.98, BLUE, angle=15 * q)
        im = im2
        if q > 0.8:
            text_c(im, 'إطار فيه فتحة', 880, 40, INK, True) if False else None
    caption(im, 'اقصّي حول الزهرة بالمقص بحذر')
    return im

def s_glue(t, d):
    im = BG.copy(); title(im, '🧴 ثالثاً', 'اقصّي مربعين أخضرين والصقي')
    # top: shape mold ; bottom: ground mold
    cxs = 360
    for k, (cy, label) in enumerate([(380, 'قالب الشكل'), (800, 'قالب الأرضية')]):
        p = pop(t, 0.3 + k * 0.4)
        foam_square(im, cxs, cy, 320 * (p if p else 0.01), GREEN)
        t_glue = 1.8 + k * 3.6
        q = ease((t - t_glue) / 1.0)
        if k == 0:
            # flower flies in
            if t > 1.2:
                x = cxs + 280 * (1 - q); y = cy - 200 * (1 - q)
                foam_flower(im, x, y, 100, BLUE, angle=20 * (1 - q))
        else:
            if t > 1.2 + 3.6:
                x = cxs - 280 * (1 - q); y = cy + 40 * (1 - q) - 200 * (1 - q)
                foam_square(im, x, y, 320, BLUE, hole=True, hole_R=100)
        if t > t_glue + 1.0:
            text_c(im, label, cy + 185, 38, INK, True)
        if t_glue - 0.9 < t < t_glue:
            paste_c(im, emoji('🧴', 86).rotate(150, expand=True), cxs + 130, cy - 20)
    caption(im, 'الصقي: الزهرة، ثم الإطار')
    return im

def s_print(t, d):
    im = BG.copy(); title(im, '🖌️ رابعاً', 'لون خفيف واضغطي في كراستك')
    dd = ImageDraw.Draw(im, 'RGBA')
    # notebook page
    dd.rounded_rectangle((60, 700, 660, 1070), radius=20, fill=(255, 255, 255, 255), outline=(180, 180, 200, 255), width=5)
    for y in range(740, 1060, 40): dd.line((80, y, 640, y), fill=(200, 215, 240, 255), width=2)
    half = d / 2
    for k, col in enumerate([RED, YEL]):
        t0 = k * 5.2; tt = t - t0
        if tt < 0: continue
        cx = 230 if k == 0 else 490
        # print result stays after press
        press_t = 2.3
        if tt > press_t + 0.6:
            if k == 0: foam_flower(im, cx, 880, 95, col)
            else:
                dd.rounded_rectangle((cx - 120, 880 - 120, cx + 120, 880 + 120), radius=8, fill=col + (255,))
                dd.polygon(flower_pts(cx, 880, 95), fill=(255, 255, 255, 255))
        # mold
        if tt < press_t + 0.9:
            py = 380 - 0 + 0
            paint = min(1, max(0, (tt - 0.4) / 1.2))
            down = inout((tt - 1.8) / 0.8) * (1 if tt < press_t + 0.1 else 1 - inout((tt - press_t - 0.1) / 0.7))
            y = 400 + down * 480
            foam_square(im, cx, y, 220, GREEN)
            cc = tuple(int(BLUE[i] * (1 - paint) + col[i] * paint) for i in range(3))
            if k == 0: foam_flower(im, cx, y, 70, cc)
            else: foam_square(im, cx, y, 190, cc, hole=True, hole_R=70)
            if 0.3 < tt < 1.7: paste_c(im, emoji('🖌️', 90).rotate(20, expand=True), cx + 70, y - 60 + 20 * math.sin(tt * 6))
    caption(im, 'اضغطي بقوة، وارفعي بسرعة')
    return im

def s_grid(t, d):
    im = BG.copy(); title(im, '🔁 كرّري', 'بالتبادل: شكل، ثم أرضية')
    dd = ImageDraw.Draw(im, 'RGBA')
    S = 190; x0 = 360 - S * 1.5; y0 = 300
    n = 0
    for r in range(3):
        for c in range(3):
            p = pop(t, 0.5 + n * 0.45)
            x = x0 + c * S + S / 2; y = y0 + r * S + S / 2
            dd.rectangle((x - S / 2, y - S / 2, x + S / 2, y + S / 2), fill=(255, 255, 255, 255), outline=(190, 190, 190, 255), width=2)
            if p:
                if (r + c) % 2 == 0: foam_flower(im, x, y, 62, RED, scale=p)
                else:
                    s = int(S * 0.98 * p)
                    dd.rectangle((x - s / 2, y - s / 2, x + s / 2, y + s / 2), fill=YEL + (255,))
                    dd.polygon(flower_pts(x, y, 62 * p), fill=(255, 255, 255, 255))
            n += 1
    if t > 5.2:
        text_c(im, 'ركّزتِ فوصلتِ!', 930, 52, (200, 100, 20), True)
    caption(im, 'ورقتك امتلأت زهور')
    return im

SCENES = [
    ('اليوم عندنا طباعة بالقالب. راح نسوي قالب من الفوم، ونطبع به زهرة جميلة.', s_title, 5.0),
    ('نحتاج: فوم أزرق، وفوم أخضر، ومقص مع ماما، وصمغ، وألوان وفرشاة، وكراستك.', s_materials, 7.5),
    ('أولاً: ارسمي زهرة بسيطة على ورقة، واقصّيها. أو استعملي النموذج الجاهز اللي في الورقة.', s_draw, 6.5),
    ('ثانياً: ضعي الزهرة على الفوم الأزرق وارسمي حولها، ثم اقصّيها بالمقص بحذر. صار عندك إطار فيه فتحة، وزهرة زرقاء.', s_cut, 10.5),
    ('ثالثاً: اقصّي مربعين من الفوم الأخضر. الصقي الزهرة على الأول، هذا قالب الشكل. والصقي الإطار على الثاني، هذا قالب الأرضية.', s_glue, 11.0),
    ('رابعاً: حطّي لون خفيف على القالب، واضغطيه بقوة على صفحة كراستك، ثم ارفعيه بسرعة. هذي طباعة الشكل، وهذي طباعة الأرضية.', s_print, 11.0),
    ('اطبعي بالتبادل: شكل، ثم أرضية، ثم شكل. ركّزتِ فوصلتِ بتوفيق الله!', s_grid, 8.0),
]

async def tts(i, text):
    import edge_tts
    c = edge_tts.Communicate(text, 'ar-SA-ZariyahNeural', rate='-8%')
    await c.save(f'{OUT}/a{i}.mp3')

def dur_of(p):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode())

def main():
    for i, (txt, fn, base) in enumerate(SCENES):
        if not os.path.exists(f'{OUT}/a{i}.mp3'):
            asyncio.run(tts(i, txt))
    durs = []
    for i, (txt, fn, base) in enumerate(SCENES):
        a = dur_of(f'{OUT}/a{i}.mp3')
        durs.append(max(base, a + 0.8))
    print('durations', [round(x, 1) for x in durs], 'total', round(sum(durs), 1))
    # audio mix
    inputs = []; fl = []; t0 = 0.0
    for i, d in enumerate(durs):
        inputs += ['-i', f'{OUT}/a{i}.mp3']
        ms = int(t0 * 1000)
        fl.append(f'[{i}:a]adelay={ms}|{ms},volume=1.2[a{i}]')
        t0 += d
    mix = ';'.join(fl) + ';' + ''.join(f'[a{i}]' for i in range(len(durs))) + f'amix=inputs={len(durs)}:normalize=0,apad[o]'
    subprocess.check_call(['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', mix, '-map', '[o]', '-t', str(sum(durs)), '-ar', '44100', f'{OUT}/audio.wav'])
    out = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', f'{OUT}/audio.wav', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', f'{OUT}/foam_printing.mp4'], stdin=subprocess.PIPE)
    for (txt, fn, base), d in zip(SCENES, durs):
        n = int(d * FPS)
        for k in range(n):
            out.stdin.write(fn(k / FPS, d).convert('RGB').tobytes())
    out.stdin.close(); out.wait(); print('done')

main()
