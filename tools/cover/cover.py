# Turns the Easter dance photo (St Sophia's, Kyiv) into the 240×176 title cover, in the game's own palette.
# usage: python3 tools/cover/cover.py SOURCE.png OUT.png     (the photo itself stays in ../local/cover/)
# The photo is black and white, so the colour comes from hand-placed parts (shirts, skirts, faces, ribbons) on the
# figures, and from luminance ramps for the trees, the building and the grass.
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
W, H = 240, 176
CROP = (240, 0, 1662, 1043)        # the photo inside the screenshot, 240:176, centred on the dancers

def hx(s): return tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))
def ramp(*cols): return [hx(c) for c in cols]
# ramps, dark to light (colours from src/art.js)
FOLIAGE = ramp('#21452a', '#346b36', '#4b8a40', '#72b452', '#a6dc74', '#d9efb0', '#f4f1dc')
TRUNK   = ramp('#2b2230', '#4b2f1c', '#704829')
BUILD   = ramp('#8a7f6c', '#c3b9a3', '#e2dac6', '#f6f1e3', '#fbf6ea')
GRASS   = ramp('#21452a', '#2f5a31', '#467d3a', '#64a448', '#86c35a', '#b4e07a')
SHIRT   = ramp('#c3b9a3', '#e2dac6', '#f6f1e3', '#fbf6ea')
BLACK   = ramp('#17121c', '#2b2230', '#45384f', '#5e4f6a')
WINE    = ramp('#2b1420', '#5a1a26', '#8f2430', '#b0353a')
NAVY    = ramp('#141a2e', '#22305a', '#2b4f8f', '#4174c8')
FOREST  = ramp('#132a1c', '#21452a', '#2f6b45', '#4c9c66')
SKIN    = ramp('#a86a4a', '#dba57d', '#f6d0a8')
HAIR    = ramp('#2b1a12', '#4b2f1c', '#704829', '#9e6a3c')
FAIR    = ramp('#9e6a3c', '#c99258', '#e6c07a', '#f1d07c')
DRESS   = ramp('#c4b0a0', '#e2cfc0', '#f3e4d8', '#fbf6ea')
RED, RED2, GOLD, BLUE, LEAF = hx('#cc3b3d'), hx('#8f2430'), hx('#f6c93c'), hx('#4f9bd8'), hx('#4b8a40')
RIBBONS = [RED, GOLD, BLUE, LEAF, hx('#ec88ac'), RED2]

def pick(r, t):                       # t in 0..1 -> a colour from the ramp
    return r[min(len(r) - 1, max(0, int(t * len(r))))]

# ── the figures, in 240×176 pixels, back to front: (kind, shape, args) ──
# shapes: ('e', cx, cy, rx, ry) ellipse, ('p', [(x, y), ...]) polygon
FIG = [
  # people far behind, on the left
  ('shirt', ('p', [(66, 76), (78, 74), (82, 92), (70, 96)]), {}),
  ('shirt', ('p', [(104, 74), (116, 72), (118, 96), (106, 100)]), {}),
  # far-left boy
  ('shirt', ('p', [(0, 70), (12, 68), (16, 96), (12, 118), (0, 120)]), {}),
  ('dark', ('p', [(0, 112), (14, 112), (12, 168), (0, 170)]), {'r': BLACK}),
  ('head', ('e', 7, 62, 7, 8), {}),
  # woman with the flower in her hair
  ('dark', ('p', [(2, 98), (32, 96), (36, 150), (20, 160), (0, 158)]), {'r': BLACK}),
  ('shirt', ('p', [(13, 70), (38, 68), (40, 100), (30, 108), (13, 106)]), {}),
  ('dark', ('p', [(19, 68), (33, 68), (33, 98), (19, 98)]), {'r': WINE}),
  ('head', ('e', 28, 63, 7, 9), {}),
  ('flower', ('e', 25, 55, 3, 2), {}),
  # woman behind in the dark vest, with a wreath
  ('shirt', ('p', [(56, 84), (82, 82), (84, 104), (56, 106)]), {}),
  ('dark', ('p', [(57, 86), (78, 86), (80, 128), (58, 128)]), {'r': BLACK}),
  ('head', ('e', 65, 79, 5, 7), {}),
  ('wreath', ('e', 65, 73, 5, 1), {}),
  # girl with the wreath and long ribbons
  ('dark', ('p', [(22, 104), (58, 102), (60, 160), (44, 170), (22, 166)]), {'r': NAVY}),
  ('shirt', ('p', [(34, 80), (58, 80), (66, 112), (68, 122), (60, 124), (52, 108), (36, 110)]), {}),
  ('head', ('e', 50, 72, 7, 9), {}),
  ('wreath', ('e', 49, 64, 7, 2), {}),
  ('ribbon', ('p', [(32, 70), (40, 70), (40, 150), (32, 146)]), {}),
  # girl behind with the big wreath
  ('dark', ('p', [(90, 86), (106, 86), (108, 132), (92, 132)]), {'r': BLACK}),
  ('shirt', ('p', [(104, 88), (114, 90), (114, 110), (106, 110)]), {}),
  ('head', ('e', 97, 80, 6, 7), {}),
  ('wreath', ('e', 97, 73, 8, 2), {}),
  # little girl in the middle
  ('dress', ('p', [(82, 124), (104, 124), (110, 156), (80, 158)]), {}),
  ('shirt', ('p', [(66, 112), (112, 110), (112, 126), (66, 126)]), {}),
  ('ribbon', ('p', [(84, 108), (94, 108), (94, 150), (84, 150)]), {}),
  ('legs', ('p', [(82, 156), (100, 156), (100, 172), (82, 172)]), {}),
  ('head', ('e', 92, 104, 7, 6), {}),
  # the woman in the middle, seen from behind
  ('dark', ('p', [(116, 90), (164, 90), (170, 156), (112, 156)]), {'r': BLACK}),
  ('shirt', ('p', [(124, 60), (162, 60), (170, 80), (178, 106), (172, 110), (164, 94), (128, 94), (118, 110), (112, 108), (120, 80)]), {}),
  ('sash', ('p', [(124, 89), (166, 89), (166, 94), (124, 94)]), {}),
  ('hair', ('e', 149, 52, 8, 9), {}),
  # the boy behind on the right
  ('dark', ('p', [(168, 98), (188, 98), (188, 140), (168, 140)]), {'r': BLACK}),
  ('shirt', ('p', [(170, 82), (196, 84), (198, 100), (170, 100)]), {}),
  ('head', ('e', 177, 77, 5, 6), {}),
  # far right: the woman with glasses, the little blonde girl, the woman at the edge
  ('head', ('e', 225, 72, 5, 7), {}),
  ('shirt', ('p', [(228, 80), (240, 78), (240, 124), (230, 124)]), {}),
  # the girl in the dark vest on the right
  ('dark', ('p', [(190, 136), (236, 136), (240, 176), (184, 176)]), {'r': WINE}),
  ('dark', ('p', [(196, 90), (230, 90), (234, 138), (194, 138)]), {'r': BLACK}),
  ('shirt', ('p', [(180, 98), (200, 96), (204, 116), (182, 118)]), {}),
  ('shirt', ('p', [(224, 94), (236, 94), (238, 120), (226, 120)]), {}),
  ('hair', ('e', 217, 83, 7, 8), {}),
  # the embroidery: the middle woman's sleeves are covered in rosettes, the others have bands
  ('stitch', ('p', [(121, 66), (133, 64), (132, 92), (116, 104), (114, 100)]), {}),
  ('stitch', ('p', [(156, 64), (166, 66), (176, 102), (170, 106), (158, 92)]), {'o': 2}),
  ('band', ('p', [(14, 82), (22, 82), (22, 84), (14, 84)]), {}),
  ('band', ('p', [(14, 92), (22, 92), (22, 94), (14, 94)]), {}),
  ('band', ('p', [(40, 88), (60, 88), (60, 90), (40, 90)]), {}),
  ('band', ('p', [(44, 98), (62, 100), (62, 102), (44, 100)]), {}),
  ('stitch', ('p', [(68, 114), (80, 114), (80, 124), (68, 124)]), {}),
  ('stitch', ('p', [(98, 112), (110, 112), (110, 124), (98, 124)]), {'o': 1}),
  ('stitch', ('p', [(182, 100), (198, 98), (200, 114), (184, 116)]), {}),
  ('stitch', ('p', [(226, 96), (236, 96), (236, 118), (228, 118)]), {'o': 3}),
  ('band', ('p', [(196, 110), (230, 110), (230, 112), (196, 112)]), {}),
]

FIG_LOW = None
def mask(shape):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    if shape[0] == 'e':
        _, cx, cy, rx, ry = shape; d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    else: d.polygon(shape[1], fill=255)
    return np.array(m) > 0

def main(src, out):
    global FIG_LOW
    FIG_LOW = [f for f in FIG if f[0] in ('dark', 'shirt', 'dress')]
    g = Image.open(src).convert('L').crop(CROP).resize((W, H), Image.LANCZOS)
    a = np.asarray(g, dtype=float)
    lo, hi = np.percentile(a, 2), np.percentile(a, 98)
    L = np.clip((a - lo) / (hi - lo), 0, 1)                         # 0 dark … 1 light
    Lm = np.asarray(g.filter(ImageFilter.MedianFilter(3)), dtype=float); Lm = np.clip((Lm - lo) / (hi - lo), 0, 1)
    blur = np.asarray(g.filter(ImageFilter.BoxBlur(2)), dtype=float); blur = np.clip((blur - lo) / (hi - lo), 0, 1)
    img = np.zeros((H, W, 3), np.uint8)
    yy, xx = np.mgrid[0:H, 0:W]
    building = mask(('p', [(0, 18), (34, 22), (62, 40), (62, 66), (0, 72)]))
    for y in range(H):
        for x in range(W):
            t = Lm[y, x]
            grass = y > 112 + 6 * np.sin(x / 9)
            if grass: c = pick(GRASS, t * .95)
            elif building[y, x] and t > .45: c = pick(BUILD, (t - .45) / .55)
            elif t < .18: c = pick(TRUNK, t / .18)
            else: c = pick(FOLIAGE, (t - .18) / .82)
            img[y, x] = c
    # a person's pixels start from a neutral ramp, so nothing inside them is green; the parts then colour only the
    # pixels whose light fits them (a skirt takes the dark ones, a shirt the light ones), so the photo draws the shapes
    PERSON = ramp('#17121c', '#2b2230', '#45384f', '#8f86a0', '#c3b9a3', '#e2dac6', '#f6f1e3')
    person = np.zeros((H, W), bool)
    for kind, shape, kw in FIG:
        if kind not in ('stitch', 'band'): person |= mask(shape)
    grass_row = lambda x: 112 + 6 * np.sin(x / 9)
    for kind, shape, kw in FIG:
        m = mask(shape)
        for y, x in zip(*np.nonzero(m)):
            t = L[y, x]
            c = None
            if kind == 'shirt':
                d = blur[y, x] - t                                       # clearly darker than round about: embroidery
                if t > .55: c = pick(SHIRT, (t - .55) / .45)
                elif t > .42: c = SHIRT[0]                            # a fold in the linen
            elif kind == 'dark':
                if t < .7: c = pick(kw['r'], t / .7)
            elif kind == 'head':
                c = pick(SKIN, (t - .45) / .45) if t > .45 else pick(FAIR if kw.get('fair') else HAIR, t / .45)
            elif kind == 'hair':
                if t < .8: c = pick(HAIR, t / .8)
            elif kind == 'legs':
                if t > .6: c = pick(SKIN, (t - .6) / .4)
                elif t < .2: c = pick(BLACK, t / .2)
            elif kind == 'dress':
                if t > .35: c = pick(DRESS, (t - .35) / .65)
            elif kind == 'sash':
                c = RED if t > .3 else RED2
            elif kind == 'ribbon':
                if t > .3: c = RIBBONS[(x // 2) % len(RIBBONS)]
            elif kind == 'wreath':
                c = [RED, LEAF, GOLD, RED, LEAF, BLUE, RED, LEAF][(x + 3 * y) % 8]
            elif kind == 'stitch':                                # cross-stitch rosettes, on the linen only
                if t > .45:
                    v = y % 6; u = (x + kw.get('o', 0) + (3 if (y // 6) % 2 else 0)) % 6
                    if (u, v) in ((1, 0), (0, 1), (2, 1), (1, 2)): c = RED
                    elif (u, v) == (1, 1): c = hx('#2b2230')
            elif kind == 'band':                                  # a row of stitching along a sleeve or hem
                if t > .4: c = RED if (x + y) % 2 else RED2
            elif kind == 'flower':
                c = hx('#fbf6ea') if t > .5 else hx('#ec88ac')
            if c is not None: img[y, x] = c
    # a dark outline where a person meets a lighter background, as the game's sprites have
    out_c = hx('#2b2230'); lum = img.astype(float) @ [.3, .59, .11]
    edge = np.zeros((H, W), bool)
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        nb = np.roll(np.roll(person, dy, 0), dx, 1); nl = np.roll(np.roll(lum, dy, 0), dx, 1)
        edge |= person & ~nb & (nl > lum + 40)
    edge[:, 0] = edge[:, -1] = edge[0] = edge[-1] = False
    img[edge] = out_c
    Image.fromarray(img).save(out)

if __name__ == '__main__': main(sys.argv[1], sys.argv[2])
