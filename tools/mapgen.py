# Builds every map as rows of tile characters; build.py injects them into index.html.
# Legend lives at the top of game.html. Prints JSON: {map id: [rows]}.
import json, math, random

SIZES = {'G': (4, 4), 'K': (4, 3), 'L': (4, 3), 'M': (4, 3), 'Q': (5, 4), 'Z': (2, 1), 'H': (2, 1),
         'A': (3, 2), 'V': (2, 2), 'T': (2, 1), 'v': (2, 1), 'z': (3, 2), 'h': (2, 1),
         '&': (4, 3), '@': (4, 3), '%': (5, 4), '!': (2, 2), ']': (2, 2), '[': (2, 1), '<': (3, 1), '{': (3, 1), 'W': (8, 2),
         'ж': (9, 5), 'п': (5, 4), 'р': (6, 5), 'о': (7, 4), 'к': (8, 3), 'м': (2, 2), 'х': (2, 1), 'в': (2, 1)}
UNDER = {'z': '~', '<': '~', '{': ':', 'к': '~', 'м': ':'}   # what lies under a big thing's other tiles


class Grid:
    def __init__(self, w, h, fill='.'):
        self.W, self.H = w, h
        self.g = [[fill] * w for _ in range(h)]

    def get(self, x, y):
        return self.g[y][x] if 0 <= x < self.W and 0 <= y < self.H else 'F'

    def put(self, x, y, c):
        if 0 <= x < self.W and 0 <= y < self.H: self.g[y][x] = c

    def fill(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1): self.put(x, y, c)

    def ellipse(self, cx, cy, rx, ry, c, only=None, jitter=0.0, rnd=None):
        for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
            for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
                d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
                if rnd and jitter: d += (rnd.random() - .5) * jitter
                if d <= 1 and (only is None or self.get(x, y) in only): self.put(x, y, c)

    def border(self, rnd, depth=2, ragged=.35):
        for y in range(self.H):
            for x in range(self.W):
                d = min(x, y, self.W - 1 - x, self.H - 1 - y)
                if d < depth or (d == depth and rnd.random() < ragged): self.g[y][x] = 'F'

    def yard(self, x0, y0, x1, y1, gaps, fence='x'):
        for x in range(x0, x1 + 1): self.put(x, y0, fence); self.put(x, y1, fence)
        for y in range(y0, y1 + 1): self.put(x0, y, fence); self.put(x1, y, fence)
        for (x, y) in gaps: self.put(x, y, '=')

    def finish(self):
        for y in range(self.H):
            for x in range(self.W):
                c = self.g[y][x]
                if c in SIZES:
                    w, h = SIZES[c]
                    for yy in range(y, y + h):
                        for xx in range(x, x + w):
                            if (xx, yy) != (x, y): self.g[yy][xx] = UNDER.get(c, getattr(self, 'base', '.'))
        rows = [''.join(r) for r in self.g]
        assert all(len(r) == self.W for r in rows)
        return rows


def vyshneve():
    random.seed(7)
    m = Grid(44, 32); put, fill, g = m.put, m.fill, m.g
    W, H = m.W, m.H
    m.border(random)
    for y in range(3, 8):
        for x in range(3, 12):
            if g[y][x] == '.': g[y][x] = random.choice(',,."')
    fill(3, 4, 6, 6, '"')
    river = {}
    for y in range(H):
        cx = 33 + round(1.4 * math.sin(y / 4.0))
        river[y] = cx
        fill(cx - 1, y, cx + 1, y, '~')
    for x in range(3, W - 2):
        g[16][x] = '#' if g[16][x] == '~' else '='
    for y in range(7, 23): put(17, y, '=')
    fill(16, 7, 18, 7, '=')
    fill(13, 0, 21, 2, '.')
    fill(13, 0, 21, 0, 'F')
    put(15, 3, 'Q')
    for (x, y) in [(13, 3), (13, 5), (21, 3), (21, 5), (14, 9), (20, 9), (14, 11), (20, 11)]: put(x, y, 'P')
    m.yard(3, 8, 12, 14, [(7, 14)])
    fill(4, 9, 11, 13, '.')
    put(5, 10, 'K')
    put(7, 13, '='); put(7, 15, '=')
    for (x, y) in [(10, 9), (11, 11), (4, 9)]: put(x, y, 'C')
    put(6, 13, 'm'); put(9, 13, 'm')
    put(11, 13, 'B'); put(10, 13, 'B')
    for x in (3, 6, 10, 12): put(x, 8, 'j')
    m.yard(21, 8, 29, 14, [(23, 14)])
    fill(22, 9, 28, 13, '.')
    put(22, 10, 'L')
    put(24, 13, '='); put(23, 13, '=')
    put(23, 15, '=')
    fill(27, 9, 28, 12, 'g')
    put(27, 13, 'S'); put(28, 13, 'S')             # (26, 13) stays open: it's the way to Halyna
    put(22, 13, 'm')
    put(25, 8, 'j'); put(29, 8, 'j')
    put(14, 14, 'Z')
    put(18, 15, 'i')
    put(15, 17, 'i')
    put(5, 19, 'M')
    for y in range(17, 23): put(10, y, '=')
    for x in range(7, 11): put(x, 22, '=')
    for (x, y) in [(3, 19), (3, 21), (12, 19)]: put(x, y, 'C')
    put(4, 22, 'o'); put(5, 22, 'o'); put(12, 21, 'o')
    put(6, 22, 'm')
    put(20, 18, 'K')
    put(22, 21, '='); put(21, 21, '=')
    for y in range(17, 22): put(19, y, '=')
    put(18, 21, '='); put(20, 21, '=')
    for (x, y) in [(25, 18), (25, 20), (26, 19)]: put(x, y, 'C')
    put(23, 21, 'm')
    put(24, 21, 'B')
    for y in (25, 27):
        for x in range(4, 15):
            if g[y][x] == '.': put(x, y, 'S')
    for y in (24, 26, 28):
        for x in range(4, 15):
            if g[y][x] == '.' and random.random() < 0.3: put(x, y, ',')
    fill(19, 23, 28, 28, 'w')
    for y in range(23, 29): put(17, y, '=')
    put(16, 28, '='); put(18, 28, '=')
    for y in (4, 9, 13, 21, 26):
        put(river[y] - 2, y, 'Y')
    for y in (6, 11, 19, 24):
        put(river[y] + 2, y, 'Y')
    put(river[8], 8, 'd'); put(river[20], 20, 'd'); put(river[25] - 1, 25, 'd')
    for y in range(3, 29):
        for x in range(river[y] + 2, W - 2):
            if g[y][x] == '.' and random.random() < 0.45: g[y][x] = random.choice('"",')
    put(38, 9, 'H'); put(37, 22, 'H'); put(39, 12, 'H')
    put(40, 19, 'N')
    fill(37, 14, 41, 18, '.')
    for x in range(river[16] + 2, W - 2): put(x, 16, '=')
    for (x, y) in [(7, 13), (24, 13), (17, 7), (7, 22), (22, 21)]:
        if g[y][x] != '=': put(x, y, '=')
    # exits: north to the forest, south to the steppe, east to Kalynivka
    for y in range(0, 4): put(8, y, '=')
    for y in range(28, 32): put(17, y, '=')
    for x in range(W - 3, W): put(x, 16, '=')
    put(7, 3, '"'); put(9, 3, '"')
    for x in range(0, 3): put(x, 16, '=')          # west to the khutir
    return m.finish()


def forest():
    rnd = random.Random(11)
    m = Grid(40, 34, 'F')
    # clearings: the entrance, the lake, the old oak, Baba Yaga's yard
    m.ellipse(20, 27, 8, 4.5, '.', jitter=.5, rnd=rnd)
    m.ellipse(10, 14, 8, 6.5, '.', jitter=.5, rnd=rnd)
    m.ellipse(23, 15, 5, 4, '.', jitter=.5, rnd=rnd)
    m.ellipse(30, 7, 7.5, 4.5, '.', jitter=.4, rnd=rnd)
    m.ellipse(8, 27, 4, 3, '.', jitter=.5, rnd=rnd)
    m.ellipse(33, 24, 4.5, 4, '.', jitter=.5, rnd=rnd)
    # winding paths between them
    def walk(a, b):
        (x, y), (tx, ty) = a, b
        while (x, y) != (tx, ty):
            m.put(x, y, '=')
            if rnd.random() < .5 and x != tx: x += 1 if tx > x else -1
            elif y != ty: y += 1 if ty > y else -1
            else: x += 1 if tx > x else -1
        m.put(x, y, '=')
    walk((20, 33), (20, 27)); walk((20, 27), (12, 18)); walk((20, 27), (23, 16))
    walk((23, 16), (29, 9)); walk((12, 18), (8, 26)); walk((20, 27), (32, 24))
    # the lake
    m.ellipse(8, 12, 4, 3, '~')
    # undergrowth, trees, mushrooms
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] != '.': continue
            r = rnd.random()
            if r < .40: m.g[y][x] = 'f'
            elif r < .47: m.g[y][x] = 'u'
            elif r < .55: m.g[y][x] = rnd.choice('ORRO')
    # Baba Yaga's yard: a stake fence and the hut on hen's legs
    m.fill(25, 4, 35, 10, '.')
    m.yard(25, 3, 35, 10, [(29, 10), (30, 10)])
    m.put(29, 5, 'A')
    for x in (25, 28, 32, 35): m.put(x, 3, 'j')
    m.put(33, 7, 'u'); m.put(27, 8, 'u'); m.put(33, 5, 'H')
    for y in range(11, 13): m.put(29, y, '='); m.put(30, y, '=')
    # Mavka's shore
    m.put(11, 12, '.'); m.put(11, 13, '.')            # Mavka's bit of shore, just off the road
    for (x, y) in [(5, 9), (13, 9), (4, 15)]: m.put(x, y, 'Y')
    m.put(20, 33, '='); m.put(20, 32, '='); m.put(20, 31, '=')
    for x in range(0, 4): m.put(x, 14, '=')        # west to the marsh
    for x in range(34, 40): m.put(x, 24, '=')      # east to the lake
    # north, to the pines of Polissia: a wide road from the western path, so it reads as a way out
    for y in range(0, 19): m.put(12, y, '=')
    for y in range(0, 10): m.put(11, y, '=')
    m.put(13, 11, 'i')
    return m.finish()


def steppe():
    rnd = random.Random(23)
    m = Grid(44, 32); put, fill = m.put, m.fill
    m.border(rnd, 2, .3)
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == '.' and rnd.random() < .12: m.g[y][x] = rnd.choice('",')
    # the road from Vyshneve, then the cart track east
    for y in range(0, 20): put(17, y, '=')
    for x in range(17, 38): put(x, 19, '=')
    for y in range(19, 25): put(37, y, '=')
    # wheat, two big fields
    fill(3, 4, 14, 12, 'w'); fill(20, 3, 31, 10, 'w'); fill(4, 22, 16, 28, 'w')
    for x in range(3, 15): put(x, 8, '=')
    # sunflowers
    for y in (14, 16):
        for x in range(4, 15): put(x, y, 'S')
    # a poppy meadow
    for y in range(22, 29):
        for x in range(20, 31):
            if rnd.random() < .55: put(x, y, 'p')
            elif rnd.random() < .5: put(x, y, '"')
    # the windmill on its rise, the miller's khata
    fill(34, 3, 41, 12, '.')
    put(37, 6, 'V')
    put(34, 10, 'M'); put(36, 13, '='); put(37, 13, '='); put(37, 12, '.')
    for y in range(13, 19): put(37, y, '=')
    for y in range(8, 13): put(39, y, '=')
    put(38, 8, '='); put(37, 8, '=')
    put(33, 4, 'H'); put(40, 13, 'H')
    # the kurhan and its stone baba
    m.ellipse(24, 15, 3.5, 2.2, '"')
    put(24, 14, 'b')
    for (x, y) in [(16, 2), (18, 5), (16, 9), (18, 13), (16, 17)]: put(x, y, 'P')
    put(10, 18, 'H'); put(30, 13, 'H')
    put(19, 18, 'i')
    for x in range(0, 17): put(x, 19, '=')         # west to the fair
    for x in range(37, 44): put(x, 24, '=')        # east to the Dnipro crossing
    for y in range(19, 32): put(18, y, '=')        # south: the chumak road, to the salt
    put(19, 29, 'i')
    return m.finish()


def kalynivka():
    rnd = random.Random(31)
    m = Grid(40, 30); put, fill = m.put, m.fill
    m.border(rnd)
    # the pond, rimmed with reeds
    m.ellipse(24, 19, 7.5, 4.5, '~')
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == '.' and any(m.get(x + dx, y + dy) == '~' for dx in (-1, 0, 1) for dy in (-1, 0, 1)):
                if rnd.random() < .6: m.g[y][x] = 'r'
    put(20, 18, 'd'); put(27, 20, 'd')
    # main street from the west exit
    for x in range(0, 36): put(x, 12, '=')
    for y in range(4, 12): put(19, y, '=')
    for y in range(13, 16): put(12, y, '=')
    # khatas
    put(4, 7, 'K'); put(6, 10, '='); put(6, 11, '=')
    put(10, 7, 'L'); put(12, 10, '='); put(12, 11, '=')
    put(26, 7, 'M'); put(28, 10, '='); put(28, 11, '=')
    put(31, 14, 'K'); put(33, 13, '='); put(33, 17, '.')
    # the school (a long khata) and the market square
    put(21, 3, 'L'); put(23, 6, '='); fill(20, 7, 24, 7, '=')
    for (x, y) in [(5, 15), (8, 15)]: put(x, y, 'T')
    fill(4, 13, 11, 14, '=')
    fill(4, 17, 11, 17, '=')
    for x in range(4, 12): put(x, 16, '.')
    put(10, 15, '.')
    # kalyna bushes, willows, cherries, fences
    for (x, y) in [(3, 6), (9, 6), (15, 7), (25, 6), (30, 6), (17, 14), (35, 9), (14, 20)]: put(x, y, 'k')
    for (x, y) in [(15, 17), (32, 18), (17, 23), (30, 23)]: put(x, y, 'Y')
    for (x, y) in [(35, 6), (3, 20), (6, 22), (9, 21)]: put(x, y, 'C')
    for y in range(19, 27):
        for x in range(3, 13):
            if m.g[y][x] == '.' and rnd.random() < .45: m.g[y][x] = rnd.choice('"",')
    # wild meadows east and south of the pond, so there's room to catch words
    for y in range(3, 27):
        for x in range(34, 38):
            if m.g[y][x] == '.' and rnd.random() < .7: m.g[y][x] = rnd.choice('""r')
    for y in range(24, 27):
        for x in range(14, 34):
            if m.g[y][x] == '.' and rnd.random() < .75: m.g[y][x] = rnd.choice('"rr')
    for y in range(13, 25):
        for x in range(13, 17):
            if m.g[y][x] == '.' and rnd.random() < .5: m.g[y][x] = 'r'
    put(16, 11, 'i'); put(2, 11, 'i')
    put(1, 12, '='); put(0, 12, '=')
    for y in range(0, 4): put(19, y, '=')          # north to the lake
    for y in range(13, 30): put(36, y, '=')        # south to the Dnipro crossing
    return m.finish()


def road(m, pts):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        for x in range(min(x0, x1), max(x0, x1) + 1): m.put(x, y0, '=')
        for y in range(min(y0, y1), max(y0, y1) + 1): m.put(x1, y, '=')


def meadow(m, rnd, x0, y0, x1, y1, p=.6, kinds='"",'):
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if m.get(x, y) == '.' and rnd.random() < p: m.g[y][x] = rnd.choice(kinds)


def khutir():
    # a lone farmstead to the west: orchard, apiary, hay
    rnd = random.Random(41)
    m = Grid(40, 30); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 37, 27, .3)
    road(m, [(39, 15), (20, 15)]); road(m, [(20, 0), (20, 29)])
    m.fill(4, 5, 15, 13, '.')
    m.yard(4, 5, 15, 13, [(10, 13)])
    put(6, 7, 'K'); put(8, 10, '='); put(9, 10, '='); put(10, 10, '='); put(10, 11, '='); put(10, 12, '=')
    for x in range(11, 21): put(x, 14, '=') if m.get(x, 14) != 'x' else None
    put(10, 14, '='); put(13, 7, 'C'); put(13, 10, 'o'); put(5, 12, 'm'); put(12, 12, 'B')
    for x in (4, 8, 12, 15): put(x, 5, 'j')
    # the apiary: rows of hives in a flower meadow
    fill(24, 3, 34, 11, '.')
    meadow(m, rnd, 24, 3, 34, 11, .5, ',,"')
    for y in (4, 7, 10):
        for x in (25, 28, 31, 34): put(x, y, 'B')
    # the orchard
    for y in (18, 21, 24):
        for x in range(4, 17, 3): put(x + (y % 2), y, 'C')
    meadow(m, rnd, 3, 17, 18, 26, .45, '",,')
    put(28, 19, 'H'); put(33, 22, 'H'); put(26, 24, 'H')
    meadow(m, rnd, 23, 17, 37, 27, .55, '""w')
    m.ellipse(31, 26, 3, 1.5, '~')
    put(19, 14, 'i')
    return m.finish()


def fair():
    # Sorochyntsi: the great fair, a forge, carts and stalls
    rnd = random.Random(53)
    m = Grid(40, 30); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 37, 27, .35)
    road(m, [(20, 0), (20, 15), (39, 15)])
    fill(10, 11, 30, 21, '=')                 # the fair square
    for (x, y) in [(11, 12), (14, 12), (17, 12), (23, 12), (26, 12), (11, 19), (14, 19), (23, 19), (26, 19)]: put(x, y, 'T')
    for (x, y) in [(28, 17), (12, 16), (29, 20)]: put(x, y, 'v')
    put(4, 4, 'M'); road(m, [(6, 7), (6, 9), (20, 9)])     # Vakula's forge
    put(30, 4, 'K'); road(m, [(32, 7), (32, 9), (20, 9)])
    put(4, 22, 'L'); road(m, [(6, 25), (9, 25), (9, 21), (10, 21)])
    for (x, y) in [(3, 10), (9, 4), (35, 9), (35, 24), (17, 25)]: put(x, y, 'C')
    put(31, 23, 'H'); put(16, 4, 'P'); put(24, 4, 'P')
    meadow(m, rnd, 22, 22, 37, 27, .7); meadow(m, rnd, 2, 12, 8, 20, .7)
    road(m, [(0, 16), (10, 16)])                 # west to Podillia
    put(21, 14, 'i'); put(3, 15, 'i')
    return m.finish()


def lake():
    # a wide lake to the north-east, with a pier, boats and an island
    rnd = random.Random(61)
    m = Grid(40, 30); put = m.put
    m.border(rnd)
    m.ellipse(24, 11, 12.5, 7.5, '~', jitter=.15, rnd=rnd)
    m.ellipse(27, 9, 2.2, 1.6, '.')
    put(27, 9, 'Y')
    for y in range(18, 26):
        for x in range(4, 38):
            if m.get(x, y) == '.' and any(m.get(x + dx, y + dy) == '~' for dx in (-1, 0, 1) for dy in (-1, 0, 1)) and rnd.random() < .7: m.g[y][x] = 'r'
    for y in range(2, 20):
        for x in range(2, 40):
            if m.get(x, y) == '.' and any(m.get(x + dx, y + dy) == '~' for dx in (-1, 0, 1) for dy in (-1, 0, 1)) and rnd.random() < .55: m.g[y][x] = 'r'
    road(m, [(0, 15), (8, 15), (8, 22), (20, 22), (20, 29)])
    for y in range(13, 20): put(20, y, '#')   # the pier
    put(20, 12, '#')
    for (x, y) in [(17, 10), (30, 14), (25, 6)]: put(x, y, 'n')
    put(4, 18, 'L'); road(m, [(6, 21), (6, 22), (8, 22)])
    put(30, 22, 'K'); road(m, [(32, 25), (32, 26), (20, 26)])
    meadow(m, rnd, 2, 22, 37, 27, .55); meadow(m, rnd, 2, 2, 10, 13, .6)
    for (x, y) in [(3, 3), (36, 3), (37, 18), (11, 25)]: put(x, y, 'Y')
    put(9, 16, 'i')
    return m.finish()


def ferry():
    # the Dnipro crossing to the south-east: a wide river, a ferry, an oak on the high bank
    rnd = random.Random(71)
    m = Grid(40, 30); put = m.put
    m.border(rnd)
    for y in range(30):
        cx = 31 + round(1.2 * math.sin(y / 5.0))
        m.fill(cx - 5, y, min(39, cx + 9), y, '~')
    meadow(m, rnd, 2, 2, 24, 27, .45, '""w,')
    road(m, [(0, 15), (21, 15)]); road(m, [(20, 0), (20, 15)])
    for x in range(22, 26):
        if m.get(x, 15) == '~': put(x, 15, '#')
        else: put(x, 15, '=')
    put(26, 15, 'z')                           # the ferry, moored at the pier
    m.ellipse(9, 6, 4, 3, '.')                 # Mamai's hill
    put(9, 5, 'O'); put(11, 6, 'h')            # the oak and his horse
    m.ellipse(8, 23, 3, 2, '"'); put(8, 22, '$')   # a kozak mohyla
    put(14, 9, 'L'); road(m, [(16, 12), (16, 15)])
    for (x, y) in [(23, 4), (24, 24), (22, 9)]: put(x, y, 'Y')
    put(18, 14, 'i')
    return m.finish()


def marsh():
    # the marsh to the north-west: pools, reed beds, boardwalks, a herbalist's hut
    rnd = random.Random(83)
    m = Grid(40, 30); put = m.put
    m.border(rnd)
    for k in range(16):
        cx, cy = 4 + rnd.random() * 32, 3 + rnd.random() * 23
        m.ellipse(cx, cy, 1.5 + rnd.random() * 3, 1 + rnd.random() * 2, '~', jitter=.3, rnd=rnd)
    for y in range(30):
        for x in range(40):
            if m.get(x, y) == '.' and rnd.random() < .55: m.g[y][x] = rnd.choice('rr"')
    # paths, with boardwalks where they cross open water
    wet = {(x, y) for y in range(30) for x in range(40) if m.g[y][x] == '~'}
    road(m, [(39, 14), (20, 14)]); road(m, [(20, 29), (20, 14)]); road(m, [(20, 14), (20, 8), (8, 8)])
    for (x, y) in wet:
        if m.g[y][x] == '=': m.g[y][x] = '#'
    m.fill(3, 3, 11, 9, '.')
    put(4, 4, 'M')                             # Yaryna's hut
    put(6, 7, '='); put(7, 7, '='); put(8, 7, '=')
    for (x, y) in [(13, 4), (30, 6), (34, 20), (10, 22), (26, 25)]: put(x, y, 'R')
    for (x, y) in [(15, 18), (28, 11), (6, 15)]: put(x, y, 'e')
    put(21, 13, 'i')
    return m.finish()


# ─── interiors ────────────────────────────────────────────────────────────
# X void · W wall · _ clay floor · + plank floor · E way out
# furniture: 1 pich (3x2) · 2 table (2x1) · 3 bench · 4 chest · 5 bed (1x2) · 6 desk · 7 loom (2x1) · 8 spinning wheel
#            9 candle stand · 0 lectern · q flour sacks
# on the wall: U window · I icon corner · G rushnyk · J plate shelf · D blackboard · c cobweb · h iconostasis · v royal doors
INSIDE = {'1': (3, 2), '2': (2, 1), '5': (1, 2), '7': (2, 1)}


def room(w, h, floor='_', wall_rows=2):
    m = Grid(w, h, floor)
    for y in range(h):
        for x in range(w):
            if x in (0, w - 1) or y == h - 1: m.g[y][x] = 'X'
            elif y < wall_rows: m.g[y][x] = 'W'
    m.put(w // 2, h - 1, 'E')
    return m


def khata(kind):
    m = room(11, 8)
    put = m.put
    put(1, 2, '1')                              # the pich by the door corner
    put(9, 1, 'I')                              # icon corner, diagonally across
    put(7, 2, '3'); put(8, 2, '3'); put(9, 2, '3'); put(9, 3, '3')
    put(7, 3, '2')
    put(5, 1, 'U'); put(7, 1, 'U'); put(3, 1, 'G')
    if kind == 'home':
        put(1, 5, '5'); put(9, 6, '4'); put(4, 1, 'J')
    elif kind == 'mykola':
        put(1, 5, '5'); put(6, 5, '7'); put(9, 6, '4'); put(2, 1, 'J')
    elif kind == 'halyna':
        put(9, 6, '4'); put(2, 6, '8'); put(1, 5, '5'); put(4, 1, 'J')
    elif kind == 'hrytsenko':
        put(9, 6, '4'); put(2, 1, 'c'); put(8, 1, 'c'); put(7, 3, '_'); put(7, 2, '_'); put(9, 3, '_'); put(8, 3, '_')
    elif kind == 'miller':
        put(1, 5, '5'); put(8, 6, 'q'); put(9, 6, 'q'); put(9, 5, 'q'); put(4, 1, 'J')
    elif kind == 'beekeeper':                   # Hryhoriy's: wax, honey, a loom for the winter
        put(1, 5, '5'); put(6, 5, '7'); put(9, 6, '4'); put(4, 1, 'J'); put(8, 6, 'q')
    elif kind == 'forge':                       # Vakula's: the forge fire is the pich, iron in sacks
        put(7, 2, '_'); put(8, 2, '_'); put(9, 2, '_'); put(9, 3, '_'); put(7, 3, '_')
        put(8, 5, 'q'); put(9, 5, 'q'); put(9, 6, 'q'); put(3, 1, 'J'); put(5, 1, 'U')
    elif kind == 'inn':                         # the korchma: tables and benches all round
        put(1, 5, '3'); put(1, 6, '3'); put(3, 5, '2'); put(6, 5, '2'); put(4, 1, 'J'); put(2, 1, 'J'); put(9, 6, 'q')
    elif kind == 'ferryman':
        put(1, 5, '5'); put(9, 6, '4'); put(4, 1, 'J'); put(8, 6, '3')
    elif kind == 'panas':
        put(1, 5, '5'); put(9, 6, '4'); put(2, 1, 'c'); put(4, 1, 'J')
    elif kind == 'yaryna':                      # the herbalist: herbs in sacks, a wheel, no icon
        put(9, 1, 'G'); put(8, 6, 'q'); put(9, 6, 'q'); put(9, 5, 'q'); put(2, 6, '8'); put(1, 5, '5')
    elif kind == 'bondarenko':
        put(1, 5, '5'); put(9, 6, '4'); put(6, 5, '7'); put(4, 1, 'J')
    elif kind == 'kolyba':                      # the shepherds' hut: a fire pit, sacks of cheese, bunks
        put(7, 2, '_'); put(8, 2, '_'); put(9, 2, '_'); put(9, 3, '_'); put(7, 3, '_')
        put(1, 5, '5'); put(3, 5, '5'); put(8, 6, 'q'); put(9, 6, 'q'); put(9, 5, 'q'); put(2, 1, 'J')
    elif kind == 'molfar':                      # the molfar's: herbs, candles, cobwebs, no icon
        put(9, 1, 'c'); put(2, 1, 'c'); put(7, 2, '9'); put(8, 6, 'q'); put(9, 6, 'q'); put(9, 5, 'q'); put(1, 5, '5')
        put(7, 3, '_'); put(8, 2, '_'); put(9, 2, '_'); put(9, 3, '_'); put(8, 3, '_')
    elif kind == 'post':                        # the post office, which is also somebody's kitchen
        put(1, 5, '5'); put(4, 5, '2'); put(8, 6, '4'); put(9, 6, '4'); put(4, 1, 'J')
    return m.finish_inside()


def church():
    m = room(13, 10, '+', 3)
    for x in range(2, 11): 
        for y in range(3): m.put(x, y, 'h')
    for y in range(3): m.put(6, y, 'v')
    m.put(1, 1, 'U'); m.put(11, 1, 'U')
    m.put(3, 4, '9'); m.put(9, 4, '9'); m.put(6, 5, '0'); m.put(2, 7, '9'); m.put(10, 7, '9')
    return m.finish_inside()


def school():
    m = room(13, 9, '+')
    for x in (5, 6, 7): m.put(x, 1, 'D')
    m.put(2, 1, 'U'); m.put(10, 1, 'U'); m.put(11, 1, 'G')
    m.put(5, 2, '2')
    for y in (4, 6):
        for x in (3, 5, 7, 9): m.put(x, y, '6')
    m.put(1, 2, '4')
    return m.finish_inside()


# ─── Zaporizhzhia ─────────────────────────────────────────────────────────
def near(m, x, y, chars):
    return any(m.get(x + dx, y + dy) in chars for dx in (-1, 0, 1) for dy in (-1, 0, 1))


def crossing(m, pts):
    # a road that turns into planks wherever it crosses water
    road(m, pts)
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == '=' and getattr(m, 'wet', None) and (x, y) in m.wet: m.g[y][x] = '#'


def khortytsia():
    # the island of the Sich: a palisade round the kurins, the church and the maidan
    rnd = random.Random(91)
    m = Grid(44, 34, '~'); put, fill = m.put, m.fill
    m.ellipse(22, 17, 19.5, 14.5, '.', jitter=.12, rnd=rnd)
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == '.' and near(m, x, y, '~') and (y < 11 or x > 35) and rnd.random() < .45: m.g[y][x] = 'y'
    meadow(m, rnd, 2, 2, 41, 31, .5, '"",')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    # the Sich
    fill(13, 5, 35, 22, '.')
    for x in range(13, 36): put(x, 5, '|'); put(x, 22, '|')
    for y in range(5, 23): put(13, y, '|'); put(35, y, '|')
    put(22, 6, 'Q')                                   # the Pokrova church of the Sich
    for (x, y) in [(15, 7), (15, 12), (30, 7), (30, 12)]: put(x, y, '&')
    road(m, [(17, 10), (32, 10)]); road(m, [(24, 10), (24, 22)])
    fill(18, 15, 30, 19, '=')                         # the maidan
    road(m, [(17, 15), (32, 15)])
    put(25, 17, 'T')                                  # the table where the letter gets written
    put(19, 20, '('); put(29, 20, '(')
    for (x, y) in [(14, 18), (32, 17), (14, 21), (32, 21)]: put(x, y, 'H')
    put(23, 22, '='); put(24, 22, '=')                # the gate
    # roads: west to the pier and the ferry home, north across the shallows to the rapids
    crossing(m, [(0, 26), (24, 26)]); road(m, [(24, 22), (24, 26)])
    crossing(m, [(11, 0), (11, 26)])
    for x in range(1, 4): put(x, 27, '~'); put(x, 28, '~')
    put(1, 27, 'z')                                   # the ferry, back to the crossing
    put(36, 25, 'O'); put(31, 28, '$'); put(6, 14, 'h'); put(7, 18, 'H')
    put(25, 23, 'i')
    return m.finish()


def rapids():
    # the Dnipro rapids: white water across the river, the lotsmen's village on the west bank
    rnd = random.Random(97)
    m = Grid(44, 32); put, fill = m.put, m.fill
    m.border(rnd)
    river = {}
    for y in range(m.H):
        cx = 28 + round(2 * math.sin(y / 5.0)); river[y] = cx
        fill(cx - 6, y, cx + 6, y, '~')
    for band in (6, 15, 21, 27):
        for y in (band, band + 1):
            for x in range(river[y] - 6, river[y] + 7):
                r = rnd.random()
                if r < .45: put(x, y, '*')
                elif r < .6: put(x, y, '^')
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == '.' and near(m, x, y, '~*^'): m.g[y][x] = ';' if rnd.random() < .7 else 'y'
    meadow(m, rnd, 2, 2, 19, 29, .45, '"",'); meadow(m, rnd, 36, 2, 41, 29, .7, '""w')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] in '~*^'}
    # the lotsmen's village
    road(m, [(10, 31), (10, 3)])
    put(3, 4, 'K'); road(m, [(5, 7), (10, 7)])
    put(3, 14, 'M'); road(m, [(5, 17), (10, 17)])     # the lotsman's hut
    put(13, 22, 'L'); road(m, [(15, 25), (10, 25)])
    for (x, y) in [(2, 10), (14, 8), (2, 21), (16, 28), (7, 27)]: put(x, y, 'P')
    # the pier, and the chaika waiting at the end of it
    r = river[11]
    crossing(m, [(10, 11), (r - 6, 11)])
    put(r - 5, 11, '<')
    # a bridge of planks over the calm water up north, to the steppe on the east bank
    crossing(m, [(10, 3), (40, 3)])
    for (x, y) in [(39, 10), (40, 10), (39, 11), (38, 18)]: put(x, y, 'y')
    put(11, 10, 'i')
    return m.finish()


# ─── Kyiv ─────────────────────────────────────────────────────────────────
def podil():
    # Podil: the old merchant quarter under the hills, cobbles, trams, the Dnipro
    rnd = random.Random(101)
    m = Grid(44, 34, ':'); m.base = ':'; put, fill = m.put, m.fill
    fill(0, 0, 43, 1, 'F'); fill(0, 0, 1, 33, 'F'); fill(0, 32, 43, 33, 'F')
    fill(39, 0, 43, 33, '~'); fill(37, 2, 38, 31, ':')
    # the hills: Andriyivskyi uzviz winds up them, stalls all the way
    fill(2, 2, 9, 10, '.'); meadow(m, rnd, 2, 2, 9, 10, .6, '""a,')
    road(m, [(9, 12), (6, 12), (6, 8), (4, 8), (4, 2)])
    for y in range(2, 13):
        for x in range(2, 10):
            if m.g[y][x] == '=': m.g[y][x] = ':'
    for (x, y) in [(7, 9), (2, 5), (7, 5)]: put(x, y, 'T')
    # houses along the north street and round the square
    for (x, y) in [(11, 3), (16, 3), (27, 3), (32, 3), (11, 21), (16, 21), (27, 21), (32, 21)]: put(x, y, '@')
    put(21, 2, 'Q')                                   # a little church with green domes
    # Kontraktova square, with Samson's fountain
    put(21, 14, ']')
    for (x, y) in [(16, 12), (27, 12), (16, 18), (27, 18), (37, 6), (37, 14), (37, 22), (37, 29)]: put(x, y, ')')
    # the tram line along the street, and a tram at its stop
    put(29, 10, '{'); put(33, 9, 'i')
    # parks: chestnuts and grass, where the city's words hide
    fill(3, 25, 14, 30, '.'); meadow(m, rnd, 3, 25, 14, 30, .7, '"",')
    for (x, y) in [(4, 26), (9, 25), (13, 28), (6, 30)]: put(x, y, 'a')
    fill(20, 25, 34, 30, '.'); meadow(m, rnd, 20, 25, 34, 30, .65, '"",')
    for (x, y) in [(22, 25), (28, 27), (33, 25), (25, 30)]: put(x, y, 'a')
    for (x, y) in [(10, 14), (33, 14), (10, 18)]: put(x, y, 'a')
    put(40, 12, 'n'); put(41, 24, 'n')
    put(13, 15, 'i')                                  # the маршрутка stop
    put(37, 33, ':'); put(37, 32, ':')                # south along the river to the Lavra
    put(4, 1, ':'); put(4, 0, ':')                    # and up Andriyivskyi uzviz
    return m.finish()


def uzviz():
    # Andriyivskyi uzviz: cobbles winding up from Podil to St Andrew's church, painters all the way
    rnd = random.Random(113)
    m = Grid(30, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 27, 31, .55, '"",')
    for (x0, y0, x1, y1) in [(7, 26, 9, 33), (7, 25, 23, 27), (21, 17, 23, 27), (9, 16, 23, 18), (9, 9, 11, 18), (9, 8, 21, 10), (19, 6, 21, 10)]:
        fill(x0, y0, x1, y1, ':')
    put(18, 2, 'Q')                                   # St Andrew's church, high on its hill
    for (x, y) in [(12, 22), (16, 22), (13, 13), (17, 13), (24, 13), (3, 21)]: put(x, y, '@')
    for (x, y) in [(5, 28), (11, 28), (15, 28), (25, 22), (25, 19), (12, 19), (5, 12), (5, 15), (14, 11)]: put(x, y, 'T')
    for (x, y) in [(10, 24), (20, 24), (24, 26), (12, 15), (8, 11), (22, 7), (18, 9)]: put(x, y, ')')
    for (x, y) in [(3, 25), (14, 31), (26, 30), (27, 9), (3, 6), (14, 6), (25, 3), (6, 18), (26, 19)]: put(x, y, 'a')
    put(10, 31, 'i'); put(23, 6, 'i')
    put(8, 33, ':')
    return m.finish()


def lavra():
    # the Lavra on its hill: white walls, gold domes, the bell tower, and the caves below
    rnd = random.Random(107)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    fill(40, 20, 43, 33, '~')
    meadow(m, rnd, 2, 2, 41, 31, .45, '"",')
    fill(9, 5, 35, 19, '.')
    for x in range(8, 37): put(x, 4, 'l'); put(x, 20, 'l')
    for y in range(4, 21): put(8, y, 'l'); put(36, y, 'l')
    road(m, [(22, 0), (22, 20)]); put(22, 4, ':'); put(22, 20, ':')    # the Holy Gate, and the south gate
    for y in range(5, 20):
        for x in range(9, 36):
            if m.g[y][x] == '=': m.g[y][x] = ':'
    put(20, 7, '%')                                   # the Dormition cathedral
    put(28, 6, '!')                                   # the Great Bell Tower
    road(m, [(10, 12), (34, 12)])
    for y in range(5, 20):
        for x in range(9, 36):
            if m.g[y][x] == '=': m.g[y][x] = ':'
    put(11, 14, 'L'); road(m, [(13, 17), (13, 12)])  # the monks' cells
    for y in range(12, 18):
        if m.g[y][13] == '=': m.g[y][13] = ':'
    meadow(m, rnd, 25, 14, 35, 19, .7, ',,"'); meadow(m, rnd, 9, 5, 18, 10, .6, ',,"')
    for (x, y) in [(10, 6), (17, 6), (33, 9), (31, 17), (27, 15), (10, 18)]: put(x, y, 'C' if x % 2 else 'a')
    # down the slope to the caves
    road(m, [(22, 20), (22, 27)])
    put(21, 26, '[')
    put(22, 26, '.'); put(21, 26, '[')
    for (x, y) in [(15, 24), (30, 23), (28, 29), (12, 29), (35, 27)]: put(x, y, 'a')
    put(24, 22, 'i')
    return m.finish()


# ─── Polissia ─────────────────────────────────────────────────────────────
# t pine · I bort (a pine with a hive hollowed into it) · - flax · W the train (8x2)
def bir():
    # the pine forest: sand and heather between tall pines, a stream, a little lake, the bortnyk's hut
    rnd = random.Random(131)
    m = Grid(40, 34); put, fill = m.put, m.fill
    m.border(rnd)
    for y in range(2, 32):
        for x in range(2, 38):
            r = rnd.random()
            m.g[y][x] = 't' if r < .2 else ',' if r < .3 else '"' if r < .5 else 'f' if r < .55 else 'u' if r < .57 else ';' if r < .65 else '.'
    # the stream, west to east across the middle, with a plank bridge
    for x in range(2, 38):
        y = 15 + round(math.sin(x / 4.0))
        put(x, y, '~'); put(x, y + 1, '~')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    m.ellipse(31, 23, 4, 3, '~')                      # the forest lake
    # clearings
    for (cx, cy, rx, ry) in [(20, 28, 6, 3), (8, 7, 6, 4), (29, 7, 6, 4), (18, 22, 4, 3), (31, 23, 6.5, 5)]:
        m.ellipse(cx, cy, rx, ry, '.', only='t"f,u;.', jitter=.3, rnd=rnd)
    m.ellipse(31, 23, 4, 3, '~')
    meadow(m, rnd, 2, 2, 37, 31, .25, ',,"')
    crossing(m, [(20, 33), (20, 25), (16, 25), (16, 11), (20, 11), (20, 0)])
    road(m, [(16, 9), (8, 9)]); road(m, [(20, 9), (28, 9)])
    put(5, 5, 'L')                                    # Okhrim's hut
    # the borts: hives hollowed into living pines
    put(28, 6, 'R'); put(29, 6, 'I'); put(30, 6, 'R')          # between two birches
    put(33, 21, 'I'); put(33, 22, 'y'); put(34, 22, 'y')       # behind the big stone, by the lake
    put(18, 22, 'I')                                            # in the middle of the clearing
    put(10, 20, 'O'); put(10, 21, 'I')                         # across the stream, under the old oak
    put(10, 7, 'I'); put(24, 29, 'I'); put(4, 26, 'I')         # and borts the swarm didn't choose
    for (x, y) in [(10, 22), (9, 22), (11, 22), (18, 23), (29, 7), (10, 8), (24, 30), (4, 27)]: put(x, y, '.')   # nothing stands in front of a bort and hides it
    for (x, y) in [(9, 9), (27, 9), (17, 21), (19, 21)]: put(x, y, '.')
    put(21, 30, 'i'); put(14, 20, 'O')
    return m.finish()


def polissia():
    # a Polissia village: log houses, a wooden church, flax, a reedy lake, and the railway halt
    rnd = random.Random(137)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",')
    # the lake and its reeds, west
    m.ellipse(7, 22, 5, 6, '~', jitter=.2, rnd=rnd)
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] in '.",' and near(m, x, y, '~') and rnd.random() < .5: m.g[y][x] = 'r'
    # the flax field, south-east
    fill(26, 19, 39, 28, '-')
    # the railway: the train waits at the halt on the north edge
    fill(28, 2, 41, 3, '.'); fill(27, 4, 41, 5, ':')
    put(30, 2, 'W'); put(27, 5, 'i')
    # roads
    road(m, [(22, 33), (22, 12)]); road(m, [(4, 12), (40, 12)]); road(m, [(32, 12), (32, 6)])
    road(m, [(22, 12), (22, 8)])
    for (x, y, c) in [(4, 8, 'K'), (11, 8, 'L'), (25, 13, 'M'), (14, 15, 'K'), (34, 13, 'L')]: put(x, y, c)
    for (x, y) in [(6, 11), (13, 11), (27, 16), (16, 18), (36, 16)]: put(x, y, '.')
    put(18, 3, 'Q')                                   # the wooden church
    put(20, 7, '.')
    put(17, 10, 'Z')                                  # the well
    put(9, 9, 'N')                                    # a stork on the roof-tree
    for (x, y) in [(2, 3), (3, 6), (8, 4), (13, 3), (24, 3), (40, 8), (41, 18), (24, 30), (12, 30), (40, 31), (3, 30)]: put(x, y, 't')
    for (x, y) in [(10, 15), (19, 16), (30, 16), (40, 14)]: put(x, y, 'R')
    for (x, y) in [(15, 26), (17, 28)]: put(x, y, 'H')
    put(23, 31, 'i')
    return m.finish()


# ─── The Carpathians ──────────────────────────────────────────────────────
# s spruce (смерека) · G the old observatory on Pip Ivan (4x4)
def spruces(m, rnd, p, x0=2, y0=2, x1=None, y1=None):
    x1 = m.W - 3 if x1 is None else x1; y1 = m.H - 3 if y1 is None else y1
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if m.g[y][x] in '.",' and rnd.random() < p: m.g[y][x] = 's'


def synevyr():
    # Lake Synevyr, the sea-eye of the mountains, with its little island, deep in the spruces
    rnd = random.Random(151)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .4, '"",')
    m.ellipse(22, 12, 11, 7, '~', jitter=.15, rnd=rnd)
    m.ellipse(22, 11, 2.6, 1.6, '.')                 # the island, where Syn lies
    spruces(m, rnd, .35)
    for (cx, cy, rx, ry) in [(22, 12, 13.5, 9), (8, 26, 6, 4), (31, 26, 5, 3.5), (22, 28, 5, 5)]:
        m.ellipse(cx, cy, rx, ry, '.', only='s', jitter=.3, rnd=rnd)
    m.ellipse(22, 12, 11, 7, '~', jitter=.15, rnd=rnd)
    m.ellipse(22, 11, 2.6, 1.6, '.')
    road(m, [(22, 30), (22, 20)]); road(m, [(22, 21), (36, 21)]); road(m, [(36, 21), (36, 14)]); road(m, [(36, 14), (43, 14)])   # (the south road ends at Ferents's bus stop)
    road(m, [(22, 27), (8, 27)])
    put(21, 18, 'z')                                  # Syn's raft at the shore
    put(21, 13, 'z')                                  # and a second one moored at the island, to come back on
    for (x, y) in [(20, 10), (24, 10), (20, 12), (24, 12)]: put(x, y, '~')   # round the island off
    put(23, 10, 's'); put(21, 10, 'y')                # a spruce, and the stone
    for (x, y) in [(21, 20), (23, 20), (20, 20), (24, 20), (9, 12), (10, 12), (9, 13), (9, 11)]: put(x, y, '.')
    put(4, 24, 'K'); put(6, 27, '='); put(30, 24, 'L'); put(32, 27, '=')
    put(25, 20, 'i'); put(24, 31, 'i')
    for (x, y) in [(40, 13), (41, 15), (39, 15)]: put(x, y, '.')
    return m.finish()


def verkhovyna():
    # Verkhovyna: a Hutsul village along the Black Cheremosh, a wooden church, a wedding yard
    rnd = random.Random(157)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .45, '"",')
    for y in range(m.H):
        cx = 35 + round(1.5 * math.sin(y / 4.0))
        fill(cx - 1, y, cx + 1, y, '~')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    spruces(m, rnd, .5, 38, 2, 41, 31); spruces(m, rnd, .25, 2, 2, 5, 31)
    road(m, [(0, 16), (30, 16)]); road(m, [(22, 16), (22, 0)])
    crossing(m, [(30, 16), (39, 16)])                  # the bridge over the Cheremosh, to a road the flood took
    for (x, y, c) in [(6, 8, 'K'), (12, 19, 'L'), (26, 8, 'M'), (21, 24, 'K')]: put(x, y, c)
    road(m, [(8, 11), (8, 16)]); road(m, [(14, 22), (14, 16)]); road(m, [(28, 11), (28, 16)])
    put(10, 2, 'Q'); road(m, [(12, 6), (12, 16)])       # the wooden church
    m.yard(15, 23, 25, 31, [(19, 23), (20, 23)])       # the wedding ґражда
    fill(16, 27, 24, 30, '.'); road(m, [(19, 22), (19, 23)]); road(m, [(19, 16), (19, 22)])
    put(23, 29, 'H')
    for (x, y) in [(3, 22), (8, 26), (10, 30), (27, 22), (29, 28), (4, 4), (17, 4), (31, 6)]: put(x, y, 's')
    road(m, [(8, 16), (8, 33)])                       # south, down the river to the Dniester
    put(24, 17, 'i'); put(2, 17, 'i'); put(9, 30, 'i'); put(40, 16, 'i')
    return m.finish()


def polonyna():
    # the polonyna: high summer pasture, sheep, the kolyba and its fire
    rnd = random.Random(163)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",,')
    spruces(m, rnd, .55, 2, 2, 41, 4); spruces(m, rnd, .5, 2, 28, 41, 31); spruces(m, rnd, .4, 2, 2, 4, 31)
    for _ in range(14): put(rnd.randrange(6, 40), rnd.randrange(6, 27), 'y')
    road(m, [(22, 33), (22, 14), (34, 14), (34, 9), (43, 9)])
    put(18, 8, 'K'); road(m, [(20, 11), (20, 14)])
    for (x, y) in [(19, 13), (21, 13), (20, 12), (21, 12), (19, 12)]: put(x, y, '.')
    m.yard(26, 18, 36, 25, [(30, 18), (31, 18)])      # the кошара, the sheepfold
    fill(27, 19, 35, 24, '"')
    put(9, 24, 'i'); put(23, 31, 'i')
    return m.finish()


def chornohora():
    # Chornohora: the high ridge, mist and stone, the molfar's hut, and the old observatory on Pip Ivan
    rnd = random.Random(167)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",')
    for y in range(2, 32):
        for x in range(2, 42):
            if m.g[y][x] in '.",' and rnd.random() < (.06 + .12 * (32 - y) / 30): m.g[y][x] = 'y'
    spruces(m, rnd, .45, 2, 20, 16, 31)
    road(m, [(0, 26), (14, 26), (14, 18), (24, 18), (24, 11), (30, 11), (30, 6)])
    put(28, 2, 'G')
    for (x, y) in [(29, 6), (31, 6), (30, 7), (29, 7), (31, 7)]: put(x, y, '.')
    put(8, 21, 'K'); road(m, [(10, 24), (10, 26)])
    put(4, 25, 'i'); put(26, 10, 'i')
    return m.finish()


# ─── interiors further afield ─────────────────────────────────────────────
# Y bookshelf (wall) · o niche with an icon (cave wall)
def kurin():
    m = room(15, 8)
    put = m.put
    put(1, 2, '1'); put(13, 1, 'I'); put(3, 1, 'G'); put(6, 1, 'U'); put(9, 1, 'U'); put(11, 1, 'J')
    for x in (4, 8): put(x, 4, '2')
    for x in (4, 5, 8, 9): put(x, 3, '3'); put(x, 5, '3')
    put(13, 6, '4'); put(12, 6, 'q')
    return m.finish_inside()


def lotsman():
    m = room(11, 8)
    put = m.put
    put(1, 2, '1'); put(9, 1, 'I'); put(5, 1, 'U'); put(3, 1, 'J')
    put(7, 3, '2'); put(7, 2, '3'); put(8, 2, '3'); put(9, 2, '3')
    put(1, 5, '5'); put(8, 6, 'q'); put(9, 6, 'q')
    return m.finish_inside()


def cafe():
    m = room(11, 8, '+')
    put = m.put
    put(2, 1, 'U'); put(8, 1, 'U'); put(5, 1, 'J')
    put(7, 2, '4'); put(8, 2, '4'); put(9, 2, '4')    # the counter
    for (x, y) in [(2, 4), (6, 4)]: put(x, y, '2')
    for (x, y) in [(2, 5), (3, 5), (6, 5), (7, 5), (1, 3)]: put(x, y, '3')
    return m.finish_inside()


def bookshop():
    m = room(11, 8, '+')
    for x in range(1, 10): m.put(x, 1, 'Y')
    m.put(5, 1, 'U')
    m.put(4, 4, '2'); m.put(9, 5, '4'); m.put(1, 5, '4'); m.put(9, 3, '3')
    return m.finish_inside()


def flat():
    m = room(11, 8, '+')
    put = m.put
    put(3, 1, 'U'); put(7, 1, 'U'); put(9, 1, 'I'); put(5, 1, 'J')
    put(1, 4, '5'); put(6, 3, '2'); put(6, 2, '3'); put(9, 6, '4')
    return m.finish_inside()


def cell():
    m = room(9, 7)
    put = m.put
    for x in (1, 2, 6, 7): put(x, 1, 'Y')
    put(4, 1, 'I'); put(4, 3, '0'); put(2, 2, '9'); put(6, 2, '9'); put(1, 4, '5')
    return m.finish_inside()


def caves():
    # the Near Caves under the Lavra: narrow clay passages, an underground church, the saints in their niches
    m = Grid(34, 24, 'X')
    put = m.put
    def carve(x0, y0, x1, y1):
        for y in range(min(y0, y1), max(y0, y1) + 1):
            for x in range(min(x0, x1), max(x0, x1) + 1): put(x, y, '_')
    carve(17, 18, 17, 22); carve(4, 18, 30, 18); carve(16, 19, 18, 20)    # in from the door, and the long gallery
    carve(17, 9, 17, 18); carve(12, 4, 22, 8)                              # up to the underground church
    carve(4, 8, 4, 18); carve(4, 8, 10, 8); carve(10, 6, 10, 8); carve(8, 4, 11, 5)   # west: St Antony's cell
    carve(30, 6, 30, 18); carve(25, 6, 30, 6); carve(24, 3, 27, 5)        # east: Nestor's cell
    carve(10, 18, 10, 21); carve(10, 21, 24, 21); carve(24, 18, 24, 21)   # the lower loop
    for (x, y) in [(6, 19), (12, 22), (20, 19), (26, 19), (5, 12), (28, 7)]: carve(x, y, x + 1, y)   # niches for the saints
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == 'X' and m.get(x, y + 1) == '_': m.g[y][x] = 'o' if (x * 7 + y) % 3 == 0 else 'W'
    for x in range(13, 22): put(x, 3, 'h')                                # the iconostasis of the cave church
    put(17, 3, 'v')
    put(13, 5, '9'); put(21, 5, '9'); put(17, 6, '0'); put(9, 4, '9'); put(26, 3, 'o')
    for (x, y) in [(6, 19), (12, 22), (20, 19), (26, 19), (5, 12), (28, 7)]: put(x, y, 'r')
    put(17, 23, 'E')
    return m.finish_inside()


def svitlytsia():
    # the house on the uzviz where they keep St Andrew's Eve: a big table, and the kalyta hanging over it
    m = room(13, 8, '+')
    put = m.put
    put(1, 2, '1'); put(11, 1, 'I'); put(3, 1, 'G'); put(6, 1, 'U'); put(9, 1, 'U'); put(5, 1, 'J')
    put(5, 4, '2'); put(7, 4, '2')
    for x in (4, 5, 6, 7, 8): put(x, 3, '3')
    put(11, 6, '4'); put(1, 6, '8')
    return m.finish_inside()


def weaver():
    # Hafiia's house: two looms, a spinning wheel, linen everywhere
    m = room(11, 8)
    put = m.put
    put(1, 2, '1'); put(9, 1, 'I'); put(5, 1, 'U'); put(3, 1, 'G'); put(7, 1, 'G')
    put(6, 3, '7'); put(6, 5, '7'); put(9, 4, '8'); put(9, 6, '4'); put(1, 5, '5')
    return m.finish_inside()


def bortnyk():
    # Okhrim's hut: wax, smoke, honey in pots, and nets for catching swarms
    m = room(11, 8)
    put = m.put
    put(1, 2, '1'); put(9, 1, 'I'); put(5, 1, 'U'); put(3, 1, 'J')
    put(7, 3, '2'); put(7, 2, '3'); put(8, 2, '3')
    put(8, 6, 'q'); put(9, 6, 'q'); put(9, 5, 'q'); put(1, 5, '5')
    return m.finish_inside()


def observatory():
    # inside the White Elephant: bare stone, windows open to the sky, and the magpies' nest where the telescope stood
    m = room(13, 9)
    for x in (2, 5, 7, 10): m.put(x, 1, 'U')
    m.put(1, 6, 'q'); m.put(11, 6, 'q'); m.put(10, 3, '3'); m.put(2, 3, '3')
    return m.finish_inside()


# ─── Podillia, the Black Sea and Lviv ─────────────────────────────────────
# ц cliff, limestone (ground, solid) · с steps (ground) · ї salt crust (ground)
# ж the castle at Kamianets (9x5) · п the cathedral with its minaret (5x4) · р a ratusha, a town hall with a tower (6x5)
# о the Odesa opera (7x4) · к a ship (8x3) · м a lighthouse (2x2) · х a heap of salt (2x1) · в a pair of oxen (2x1)
# а acacia · я apple tree · л a stone lion · ч a café table under an umbrella
def bridge(m, pts):
    # a road that turns to stone wherever it crosses cliff or water
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        cells = [(x, y0) for x in range(min(x0, x1), max(x0, x1) + 1)] + [(x1, y) for y in range(min(y0, y1), max(y0, y1) + 1)]
        for (x, y) in cells:
            if 0 <= x < m.W and 0 <= y < m.H: m.g[y][x] = ':' if m.g[y][x] in 'ц~:' else '='


def kamianets():
    # Kamianets: the old town on its island of rock in a loop of the Smotrych canyon, the castle across the bridge to the west
    rnd = random.Random(173)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",')
    cx, cy = 27, 15
    for y in range(m.H):
        for x in range(m.W):
            d = ((x - cx) / 11.0) ** 2 + ((y - cy) / 9.0) ** 2 + (rnd.random() - .5) * .08
            if d < 1: m.g[y][x] = '.' if rnd.random() < .7 else rnd.choice('",')
            elif d < 1.3: m.g[y][x] = 'ц'
            elif d < 1.72: m.g[y][x] = '~'
            elif d < 1.95: m.g[y][x] = 'ц'
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    # the old town: the market square, the ratusha, the cathedral with its minaret, houses
    fill(19, 11, 35, 20, ':')
    put(23, 12, 'р')
    put(28, 7, 'п'); put(30, 11, ':')
    for (x, y) in [(22, 7), (19, 13), (32, 16), (22, 21), (29, 21)]: put(x, y, '@')
    for (x, y) in [(19, 10), (35, 10), (19, 20), (35, 21), (20, 9), (34, 9)]: put(x, y, 'a')
    for (x, y) in [(20, 11), (34, 11), (20, 19), (34, 19)]: put(x, y, ')')
    # the bridges: the Castle Bridge west, the new bridge east, the old road south
    bridge(m, [(43, 15), (33, 15)])
    bridge(m, [(19, 16), (6, 16)])
    bridge(m, [(27, 20), (27, 33)])
    # the castle on its own rock, across the bridge
    put(2, 10, 'ж')
    for (x, y) in [(6, 15)]: put(x, y, ':')
    fill(2, 16, 10, 16, '=')
    fill(2, 2, 10, 9, '.'); meadow(m, rnd, 2, 2, 10, 9, .5, '"",')
    for (x, y) in [(3, 3), (9, 4), (4, 7), (2, 20), (9, 22), (4, 26), (8, 29)]: put(x, y, 'O')
    # the balloon field, south of the canyon
    fill(4, 28, 24, 31, '"'); meadow(m, rnd, 4, 28, 24, 31, .4, '.,')
    fill(30, 28, 40, 31, '"'); meadow(m, rnd, 30, 28, 40, 31, .4, '.,')
    road(m, [(27, 30), (14, 30)]); road(m, [(27, 30), (35, 30)])
    put(36, 14, 'i'); put(25, 29, 'i'); put(12, 17, 'i'); put(21, 18, 'i')
    return m.finish()


def dniester():
    # the Dniester canyon at Bakota: orchards on top, white cliffs, a village on the shore, the cave monastery downstream
    rnd = random.Random(179)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",')
    for y in range(3, 9):
        for x in range(3, 41):
            if x % 3 == 1 and y % 2 == 0 and rnd.random() < .85: put(x, y, 'я')
    for y in range(10, 15):
        for x in range(0, 44):
            if y > 10 or rnd.random() < .7: put(x, y, 'ц')
    fill(0, 22, 43, 27, '~')
    fill(0, 28, 43, 29, 'ц')
    for y in range(30, 32):
        for x in range(2, 42):
            if rnd.random() < .5: put(x, y, 'O' if rnd.random() < .3 else 'k')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    # down the cliff from Kamianets, in zigzags
    road(m, [(22, 0), (22, 10), (27, 10), (27, 12), (19, 12), (19, 15), (19, 18)])
    # along the shore, west to the mountains
    road(m, [(0, 18), (30, 18)])
    # the spur of rock that cuts Bakota off: you go round by water
    fill(31, 15, 33, 21, 'ц'); fill(31, 10, 33, 14, 'ц')
    # the village
    for (x, y, c) in [(3, 15, 'K'), (9, 15, 'L'), (23, 15, 'M')]: put(x, y, c)
    for (x, y) in [(5, 18), (11, 18), (25, 18)]: put(x, y, '=')
    put(14, 15, 'M')
    for (x, y) in [(13, 19), (15, 19), (17, 19)]: put(x, y, 'ч')
    put(14, 22, 'z')                                  # Did Yakiv's raft
    for (x, y) in [(13, 21), (14, 21), (15, 21), (16, 21), (17, 21)]: put(x, y, ';')
    # Bakota: the caves in the cliff, and a strip of shore under them
    fill(34, 15, 41, 21, ';'); meadow(m, rnd, 34, 15, 41, 21, .4, '",')
    put(37, 14, '[')
    put(36, 22, 'z')
    for (x, y) in [(36, 21), (37, 21), (38, 21)]: put(x, y, ';')
    for (x, y) in [(2, 19), (28, 20), (8, 20)]: put(x, y, 'Y')
    put(21, 17, 'i'); put(40, 16, 'i')
    return m.finish()


def liman():
    # the salt liman: a pink lake, white salt at its edges, the chumaks' camp, and the road on to Odesa
    rnd = random.Random(181)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .5, '""",')
    m.ellipse(29, 21, 11, 7.5, 'ї', jitter=.2, rnd=rnd)
    m.ellipse(29, 21, 9.5, 6, '~', jitter=.2, rnd=rnd)
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    road(m, [(22, 0), (22, 9), (43, 9)])
    road(m, [(22, 9), (12, 9), (12, 24)])
    # the chumaks' camp: carts in a ring, oxen grazing, a fire
    for (x, y) in [(4, 4), (8, 3), (12, 4), (4, 7)]: put(x, y, 'v')
    for (x, y) in [(15, 3), (16, 6), (5, 11)]: put(x, y, 'в')
    fill(7, 6, 10, 7, '.')
    # salt in heaps along the shore
    for (x, y) in [(15, 14), (15, 17), (15, 20), (15, 23), (18, 27), (22, 29)]: put(x, y, 'х')
    put(4, 22, 'K'); road(m, [(6, 25), (12, 25), (12, 24)])
    for (x, y) in [(2, 14), (3, 17), (40, 4), (36, 3), (8, 29), (40, 30)]: put(x, y, 'P')
    put(23, 8, 'i'); put(40, 10, 'i')
    return m.finish()


def odesa():
    # Odesa: the city on top, the Potemkin Stairs down to the port, the sea, the beach and the lighthouse
    rnd = random.Random(191)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .25, '"",')
    fill(0, 27, 43, 33, '~')
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    # the city
    fill(0, 8, 41, 8, ':'); fill(2, 12, 41, 13, ':')
    put(4, 2, 'о'); fill(4, 6, 10, 7, ':')
    for (x, y) in [(14, 3), (19, 3), (26, 3), (31, 3), (36, 3)]: put(x, y, '@')
    for x in range(13, 41, 3): put(x, 9, 'а')
    for x in range(3, 41, 4): put(x, 11, 'а') if not 18 <= x <= 25 else None
    for x in (5, 13, 29, 37): put(x, 14, ')')
    fill(17, 9, 26, 11, ':')
    # Pryvoz, the market, at the west end
    for (x, y) in [(3, 15), (6, 15), (9, 15), (3, 18), (6, 18), (9, 18)]: put(x, y, 'T')
    fill(2, 14, 12, 14, ':'); fill(2, 17, 12, 17, ':'); fill(2, 20, 12, 20, ':')
    # the slope between city and port: trees, and the stairs
    for y in range(15, 24):
        for x in range(13, 42):
            if m.g[y][x] in '.",' and rnd.random() < .55: m.g[y][x] = rnd.choice('aOk')
    fill(20, 14, 23, 23, 'с')
    road(m, [(37, 13), (37, 21)])
    # the port
    fill(2, 21, 12, 26, ':'); fill(13, 24, 29, 26, ':')
    put(16, 27, 'к')
    # the beach
    fill(30, 22, 41, 26, ';'); fill(36, 20, 38, 21, ';')
    for x in range(30, 42): put(x, 27, '~')
    fill(38, 23, 38, 28, ':'); fill(39, 28, 40, 28, ':'); put(39, 29, 'м'); fill(39, 29, 40, 30, '~'); put(39, 29, 'м')
    for (x, y) in [(31, 24), (34, 23)]: put(x, y, 'ч')
    put(24, 13, 'i'); put(14, 25, 'i'); put(2, 9, 'i')
    return m.finish()


def vylkove():
    # Vylkove, the Ukrainian Venice: canals for streets, boardwalks, reed roofs, and the Danube at the end of everything
    rnd = random.Random(193)
    m = Grid(44, 34); put, fill = m.put, m.fill
    m.border(rnd)
    meadow(m, rnd, 2, 2, 41, 31, .35, '"",')
    fill(0, 26, 43, 33, '~')
    for y in (10, 11, 19, 20): fill(0, y, 43, y, '~')
    for x in (13, 14, 29, 30): fill(x, 0, x, 26, '~')
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] in '.",' and near(m, x, y, '~') and rnd.random() < .35: m.g[y][x] = 'r'
    m.wet = {(x, y) for y in range(m.H) for x in range(m.W) if m.g[y][x] == '~'}
    # boardwalks along the canals and plank bridges over them
    for y in (12, 21): fill(2, y, 41, y, '=')
    for y in (9, 18): fill(2, y, 41, y, '=')
    for (x0, y0, x1, y1) in [(7, 9, 7, 12), (22, 9, 22, 12), (36, 9, 36, 12), (8, 18, 8, 21), (21, 18, 21, 21), (35, 18, 35, 21),
                             (12, 3, 15, 3), (12, 15, 15, 15), (12, 24, 15, 24), (28, 5, 31, 5), (28, 15, 31, 15), (28, 23, 31, 23)]:
        crossing(m, [(x0, y0), (x1, y1)])
    road(m, [(12, 3), (12, 9)]); road(m, [(15, 3), (15, 9)]); road(m, [(12, 12), (12, 18)]); road(m, [(15, 12), (15, 18)])
    road(m, [(12, 21), (12, 25)]); road(m, [(15, 21), (15, 25)]); road(m, [(28, 12), (28, 18)]); road(m, [(31, 12), (31, 18)])
    road(m, [(28, 21), (28, 25)]); road(m, [(31, 21), (31, 25)]); road(m, [(28, 5), (28, 9)]); road(m, [(31, 5), (31, 9)])
    fill(2, 25, 41, 25, '=')
    # houses, reed-roofed, with blue trim
    for (x, y, c) in [(3, 5, 'K'), (8, 5, 'L'), (17, 5, 'M'), (23, 5, 'K'), (34, 5, 'L'), (3, 14, 'M'), (17, 14, 'L'), (34, 14, 'K'), (4, 22, 'L'), (19, 22, 'K'), (35, 22, 'M')]:
        put(x, y, c); road(m, [(x + 2, y + 3), (x + 2, min(b for b in (9, 18, 25) if b >= y + 3))])
    put(21, 13, 'Q'); road(m, [(23, 17), (23, 18)])      # the Old Believers' church of St Nicholas
    # the pier and the boat to Odesa
    fill(20, 26, 21, 27, '#'); put(21, 28, 'к')
    for (x, y) in [(13, 7), (30, 16), (14, 22), (29, 3), (6, 10), (25, 19), (40, 27), (10, 29)]: put(x, y, 'n')
    for (x, y) in [(10, 3), (27, 15), (39, 14), (2, 23)]: put(x, y, 'Y')
    put(17, 24, 'i'); put(39, 24, 'i')                 # the pier sign stands beside the quay, not on it
    return m.finish()


def lviv():
    # Lviv: Rynok square, the ratusha in the middle, lions at its door, four fountains, houses in every colour, a tram
    rnd = random.Random(197)
    m = Grid(40, 32, ':'); put, fill = m.put, m.fill
    m.base = ':'
    m.border(rnd, 1, .2)
    for x in (2, 6, 10, 14, 22, 26, 30, 34): put(x, 4, '@')
    for x in (2, 6, 10, 14, 22, 26, 30, 34): put(x, 22, '@')
    for y in (10, 15): put(2, y, '@'); put(34, y, '@')
    put(17, 10, 'р')
    put(18, 15, 'л'); put(21, 15, 'л')
    for (x, y) in [(9, 9), (27, 9), (9, 18), (27, 18)]: put(x, y, ']')
    for (x, y) in [(4, 8), (6, 8), (12, 8), (24, 8), (30, 8), (32, 8), (5, 20), (7, 20), (29, 20), (31, 20), (13, 13), (25, 14), (12, 16)]: put(x, y, 'ч')
    for (x, y) in [(18, 4), (19, 4), (18, 22), (19, 22)]: put(x, y, 'a')
    for (x, y) in [(14, 8), (22, 8), (14, 19), (22, 19)]: put(x, y, ')')
    fill(1, 27, 38, 28, ':'); put(23, 27, '{')
    put(19, 26, 'i'); put(16, 17, 'i')
    return m.finish()


# ─── interiors further south and west ─────────────────────────────────────
def castle():
    # the castle yard at Kamianets: stone, a well, cannon, the keeper's table
    m = room(15, 10)
    for x in (2, 6, 8, 12): m.put(x, 1, 'U')
    m.put(3, 4, '2'); m.put(3, 3, '3'); m.put(4, 3, '3'); m.put(11, 6, 'q'); m.put(12, 6, 'q'); m.put(1, 7, '4'); m.put(13, 4, '0')
    return m.finish_inside()


def bakota():
    # the rock monastery at Bakota: cells cut into the cliff, icons in niches, candles
    m = Grid(22, 12, 'X')
    put = m.put
    def carve(x0, y0, x1, y1):
        for y in range(min(y0, y1), max(y0, y1) + 1):
            for x in range(min(x0, x1), max(x0, x1) + 1): put(x, y, '_')
    carve(10, 7, 11, 10); carve(3, 7, 18, 8); carve(4, 3, 9, 6); carve(14, 3, 18, 6)
    for y in range(m.H):
        for x in range(m.W):
            if m.g[y][x] == 'X' and m.get(x, y + 1) == '_': m.g[y][x] = 'o' if (x * 5 + y) % 3 == 0 else 'W'
    put(5, 4, '9'); put(17, 4, '9'); put(16, 5, '0'); put(4, 6, '3'); put(7, 3, 'o')
    put(10, 11, 'E')
    return m.finish_inside()


def kavarnia():
    # Pani Ilona's coffee house on Rynok square
    m = room(13, 8, '+')
    put = m.put
    put(2, 1, 'U'); put(10, 1, 'U'); put(6, 1, 'J'); put(4, 1, 'Y'); put(8, 1, 'Y')
    put(9, 2, 'k'); put(10, 2, 'k'); put(11, 2, 'k')
    for (x, y) in [(2, 4), (6, 4)]: put(x, y, '2')
    for (x, y) in [(2, 5), (3, 5), (6, 5), (7, 5), (1, 3)]: put(x, y, '3')
    return m.finish_inside()


def poshtamt():
    # the main post office in Lviv: a long counter, and telephones in a row along the wall
    m = room(15, 8, '+')
    put = m.put
    for x in (2, 5, 9, 12): put(x, 1, 'U')
    for x in range(3, 12): put(x, 3, 'k')
    put(5, 3, '+'); put(9, 3, '+')
    put(1, 6, '3'); put(13, 6, '3')
    return m.finish_inside()


def finish_inside(self):
    rows = [''.join(r) for r in self.g]
    assert all(len(r) == self.W for r in rows)
    return rows


Grid.finish_inside = finish_inside

print(json.dumps({'vyshneve': vyshneve(), 'forest': forest(), 'steppe': steppe(), 'kalynivka': kalynivka(),
                  'khutir': khutir(), 'fair': fair(), 'lake': lake(), 'ferry': ferry(), 'marsh': marsh(),
                  'home': khata('home'), 'mykola': khata('mykola'), 'halyna': khata('halyna'), 'hrytsenko': khata('hrytsenko'),
                  'miller': khata('miller'), 'church': church(), 'school': school(),
                  'beekeeper': khata('beekeeper'), 'forge': khata('forge'), 'inn': khata('inn'), 'ferryman': khata('ferryman'),
                  'panas': khata('panas'), 'yaryna': khata('yaryna'), 'bondarenko': khata('bondarenko'), 'post': khata('post'),
                  'khortytsia': khortytsia(), 'rapids': rapids(), 'podil': podil(), 'lavra': lavra(),
                  'kurin': kurin(), 'sichchurch': church(), 'lotsman': lotsman(), 'cafe': cafe(), 'bookshop': bookshop(),
                  'flat': flat(), 'cell': cell(), 'caves': caves(), 'lavrachurch': church(),
                  'uzviz': uzviz(), 'svitlytsia': svitlytsia(), 'andrewchurch': church(),
                  'bir': bir(), 'polissia': polissia(), 'weaver': weaver(), 'bortnyk': bortnyk(), 'lukash': khata('panas'), 'polchurch': church(),
                  'synevyr': synevyr(), 'verkhovyna': verkhovyna(), 'polonyna': polonyna(), 'chornohora': chornohora(),
                  'babahouse': khata('ferryman'), 'korchma2': khata('inn'), 'vasylyna': khata('bondarenko'), 'hutchurch': church(),
                  'kolyba': khata('kolyba'), 'molfarhut': khata('molfar'), 'observatory': observatory(),
                  'kamianets': kamianets(), 'dniester': dniester(), 'liman': liman(), 'odesa': odesa(), 'vylkove': vylkove(), 'lviv': lviv(),
                  'castle': castle(), 'bakota': bakota(), 'solevar': khata('ferryman'), 'chovnyar': khata('panas'), 'lipchurch': church(), 'kavarnia': kavarnia(), 'poshtamt': poshtamt()}))
