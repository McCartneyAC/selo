"""American spelling for English text: colour → color, organise → organize, centre → center, travelling → traveling.
Spelling only. Vocabulary (lorry, trousers, biscuit…) needs a person: see VOCAB_REVIEW below, used by the review list.
usage: python3 american.py FILE...   rewrites the English column (2nd) of gloss TSVs in place
       python3 -c 'from american import am; print(am(text))'"""
import re, sys

OUR = 'colour honour labour vigour savour saviour rumour parlour neighbour humour flavour behaviour harbour favour endeavour odour armour splendour valour rigour clamour tumour vapour ardour candour fervour succour'.split()
# -ise words that are -ise in American English too
ISE_KEEP = set('''rise arise raise praise appraise surprise exercise promise noise wise likewise otherwise clockwise paradise precise concise enterprise compromise
despise advertise advise revise televise supervise devise disguise franchise merchandise chastise improvise circumcise excise incise demise premise treatise
tortoise mayonnaise expertise anise porpoise poise turquoise bruise cruise guise apprise comprise surmise reprise sunrise moonrise uprise
otherwise disenfranchise enfranchise'''.split())
TRE = {'centre': 'center', 'theatre': 'theater', 'metre': 'meter', 'litre': 'liter', 'fibre': 'fiber', 'calibre': 'caliber', 'sombre': 'somber',
       'spectre': 'specter', 'lustre': 'luster', 'meagre': 'meager', 'manoeuvre': 'maneuver', 'sabre': 'saber', 'mitre': 'miter', 'reconnoitre': 'reconnoiter'}
WORDS = {'catalogue': 'catalog', 'defence': 'defense', 'offence': 'offense', 'licence': 'license', 'pretence': 'pretense', 'grey': 'gray',
         'programme': 'program', 'cheque': 'check', 'tyre': 'tire', 'kerb': 'curb', 'plough': 'plow', 'mould': 'mold', 'moustache': 'mustache',
         'pyjamas': 'pajamas', 'aluminium': 'aluminum', 'cosy': 'cozy', 'sceptic': 'skeptic', 'sceptical': 'skeptical', 'scepticism': 'skepticism', 'draught': 'draft',
         'aeroplane': 'airplane', 'aeroplanes': 'airplanes', 'foetus': 'fetus', 'paediatric': 'pediatric', 'paediatrician': 'pediatrician', 'encyclopaedia': 'encyclopedia',
         'anaemia': 'anemia', 'oesophagus': 'esophagus', 'ageing': 'aging', 'judgement': 'judgment', 'whilst': 'while', 'learnt': 'learned',
         'spelt': 'spelled', 'jewellery': 'jewelry', 'woollen': 'woolen', 'marvellous': 'marvelous', 'storey': 'story', 'storeys': 'stories',
         'mum': 'mom', 'mummy': 'mommy', 'mums': 'moms', 'maths': 'math', 'practise': 'practice', 'practised': 'practiced', 'practising': 'practicing',
         'axe': 'ax', 'doughnut': 'donut', 'kilogramme': 'kilogram', 'gramme': 'gram', 'cancelled': 'canceled', 'cancelling': 'canceling',
         'travelled': 'traveled', 'travelling': 'traveling', 'traveller': 'traveler', 'travellers': 'travelers', 'labelled': 'labeled', 'labelling': 'labeling',
         'modelling': 'modeling', 'modelled': 'modeled', 'quarrelled': 'quarreled', 'quarrelling': 'quarreling', 'fuelled': 'fueled', 'signalling': 'signaling',
         'counsellor': 'counselor', 'carolling': 'caroling', 'levelled': 'leveled', 'jeweller': 'jeweler', 'tranquillity': 'tranquility', 'enrol': 'enroll',
         'fulfil': 'fulfill', 'instalment': 'installment', 'skilful': 'skillful', 'wilful': 'willful', 'dialled': 'dialed', 'dialling': 'dialing',
         'rivalry': 'rivalry', 'snowplough': 'snowplow', 'haemorrhage': 'hemorrhage', 'diarrhoea': 'diarrhea', 'oestrogen': 'estrogen', 'leukaemia': 'leukemia',
         'orthopaedic': 'orthopedic', 'gynaecologist': 'gynecologist', 'archaeology': 'archeology', 'mediaeval': 'medieval', 'fulfilment': 'fulfillment',
         'enrolment': 'enrollment', 'analyse': 'analyze', 'analysed': 'analyzed', 'paralyse': 'paralyze', 'paralysed': 'paralyzed', 'catalyse': 'catalyze',
         'towards': 'toward', 'organiser': 'organizer', 'organisers': 'organizers', 'mustn\'t': 'mustn\'t', 'gaol': 'jail', 'pedlar': 'peddler'}

def fix(w):
    lo = w.lower()
    def keep_case(n): return n[0].upper() + n[1:] if w[0].isupper() else n
    if lo in WORDS: return keep_case(WORDS[lo])
    for o in OUR:
        if lo.startswith(o): return keep_case(o[:-2] + 'r' + lo[len(o):])
    for b, a in TRE.items():
        if lo == b or lo == b + 's': return keep_case(a + lo[len(b):])
        if lo.endswith(b) and lo[:-len(b)] in ('kilo', 'centi', 'milli', 'deci'): return keep_case(lo[:-len(b)] + a)
    m = re.fullmatch(r'([a-z]+?)is(e|es|ed|ing|ation|ations|ational)', lo)
    if m and m.group(1) + 'ise' not in ISE_KEEP and len(m.group(1)) >= 3 and not lo.endswith('wise'):
        return keep_case(m.group(1) + 'iz' + m.group(2))
    return w

def am(text): return re.sub(r"[A-Za-z]+", lambda m: fix(m.group(0)), text)

if __name__ == '__main__':
    changed = 0
    paths = [a for a in sys.argv[1:] if not a.startswith('--')]
    for p in paths:
        rows = open(p, encoding='utf-8').read().split('\n')
        out = []
        for r in rows:
            c = r.split('\t')
            if len(c) > 1:
                n = am(c[1])
                if n != c[1]: changed += 1; print(c[0], '|', c[1], '→', n)
                c[1] = n
            out.append('\t'.join(c))
        open(p, 'w', encoding='utf-8').write('\n'.join(out))
    print('changed', changed, file=sys.stderr)

# British vocabulary, chosen entry by entry (headword → the whole American gloss). Applied with --vocab.
VOCAB = {
 'баклажан': 'eggplant', 'блискавка': 'lightning; zipper', 'буряк': 'beet', 'вагон': '(railroad) car', 'відпочинок': 'rest, vacation',
 'гумка': 'eraser; hair tie', 'джемпер': 'sweater', 'розклад': 'schedule, timetable', 'санки': 'sled', 'сани': 'sleigh, sled',
 'стоянка': 'parking lot; stand (taxi stand)', 'труси': 'underpants, briefs', 'футбольний': 'soccer (adj)', 'футбол': 'soccer',
 'цукерка': 'candy', 'печиво': 'cookies', 'плита': 'stove', 'продавець, продавчиня': 'salesclerk, seller',
 'кабінет': 'office, study; (doctor\'s) office', 'канікули': '(school) vacation, break', 'картопля-фрі': 'French fries',
 'клас': 'class; grade (school)', 'колготи': 'tights, pantyhose', 'колготки': 'tights, pantyhose', 'кіно': 'the movies; movie',
 'ліфт': 'elevator', 'мобілка': 'cell phone', 'мобільний': 'mobile; cell phone', 'чипси': 'chips', 'шафа': 'closet, wardrobe; cupboard',
 'індекс': 'zip code; index', 'бал': 'point, grade; ball (dance)', 'листоноша': 'mail carrier, mailman', 'поштар, поштарка': 'mail carrier',
 'ліхтарик': 'flashlight', 'майка': 'tank top, undershirt', 'залізничний': 'railroad (adj)', 'залізниця': 'railroad', 'вокзал': 'train station',
 'зебра': 'zebra; crosswalk', 'кабачок': 'zucchini', 'кран': 'faucet; crane', 'візок': 'cart; stroller', 'візочок': 'stroller; small cart',
 'гардероб': 'coat check; wardrobe', 'депутат, депутатка': 'deputy, member of parliament', 'автозаправка': 'gas station',
 'автостоянка': 'parking lot', 'багажник': 'trunk (of a car)', 'вантажний': 'cargo, freight (adj): вантажний автомобіль = truck',
 'вантажівка': 'truck', 'пилососити': 'to vacuum', 'плитка': 'tile; bar (of chocolate); hot plate', 'повторення': 'repetition, review',
 'помешкання': 'apartment, dwelling', 'тротуар': 'sidewalk', 'хідник': 'sidewalk (western)', 'халат': 'bathrobe; (doctor\'s) coat',
 'під\'їзд': 'entrance (of an apartment building)', 'садок': 'garden; kindergarten, preschool', 'садочок': 'kindergarten, preschool; little garden',
 'солодощі': 'candy, sweets', 'вівсянка': 'oatmeal', 'сумочка': 'purse, handbag', 'казна-що': 'goodness knows what; nonsense',
 'квартирний': 'apartment (adj), housing', 'кінопалац': 'movie palace (big theater)', 'кінотеатр': 'movie theater', 'п\'ятірка': '(number) five; top grade',
 'четвірка': '(number) four; good grade', 'партер': 'orchestra (seats in a theater)', 'путівка': 'voucher (for a vacation)',
 'підвезти': 'to give a ride', 'підвозити': 'to give a ride', 'бензиновий': 'gas (adj), gasoline', 'бензин': 'gas, gasoline',
 'точка': 'point, dot; period', 'крапка': 'period; dot', 'траса': 'route; highway; track', 'фарш': 'ground meat', 'ясла': 'daycare, nursery; manger',
 'сміттєзвалище': 'garbage dump', 'осінь': 'fall, autumn', 'осінній': 'fall (adj), autumn', 'восени': 'in the fall',
 'непотріб': 'junk', 'смітник': 'trash can', 'черга': 'line (of people); turn', 'штани': 'pants', 'шаровари': 'sharovary (baggy Cossack pants)',
 'сміття': 'garbage, trash', 'мужик': 'peasant; guy', 'борщ': 'borshch, beet soup', 'відпустка': 'vacation, leave (from work)',
 'квартира': 'apartment', 'метро': 'subway, metro', 'магазин': 'store, shop', 'крамниця': 'store, shop', 'крамничка': 'little store',
 'магазинчик': 'little store', 'інтернет-магазин': 'online store', 'зоомагазин': 'pet store', 'вітрина': 'store window',
 'перукарня': 'hair salon', 'цукерня': 'candy store, pastry shop', 'купейний': 'compartment (railroad car)', 'коса': 'braid; scythe; spit (of land)',
 'мережа': 'network; chain (of stores)', 'замовлення': 'order (in a store, café)', 'учень, учениця': 'student, schoolchild',
 'однокурсник, однокурсниця': 'fellow student, classmate (same year)', 'оцінка': 'grade; assessment',
}

def dedupe(g):
    """drop a sense repeated within one gloss: 'program; program' → 'program'"""
    out, seen = [], set()
    for grp in g.split('; '):
        parts = [p for p in grp.split(', ')]
        keep = [p for p in parts if p.strip().lower() not in seen and not seen.add(p.strip().lower())]
        if keep: out.append(', '.join(keep))
    return '; '.join(out)

def apply_vocab(paths):
    hit = set()
    for p in paths:
        rows = open(p, encoding='utf-8').read().split('\n')
        for k, r in enumerate(rows):
            c = r.split('\t')
            if len(c) > 1:
                if c[0] in VOCAB: c[1] = VOCAB[c[0]]; hit.add(c[0])
                c[1] = dedupe(c[1]); rows[k] = '\t'.join(c)
        open(p, 'w', encoding='utf-8').write('\n'.join(rows))
    return set(VOCAB) - hit

if __name__ == '__main__' and '--vocab' in sys.argv:
    missing = apply_vocab([a for a in sys.argv[1:] if not a.startswith('--')])
    print('vocab headwords not found:', sorted(missing), file=sys.stderr)
