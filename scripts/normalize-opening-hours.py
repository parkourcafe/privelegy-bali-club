#!/usr/bin/env python3
"""Приводит свободный текст часов работы к синтаксису schema.org.

Правило: уверенно разбираем понятное, а неоднозначное НЕ трогаем и выносим
в отчёт. Придуманные часы на публичной карточке хуже отсутствующих.
"""
import re, sys, csv

DAY = {'mon':'Mo','tue':'Tu','tues':'Tu','wed':'We','thu':'Th','thur':'Th','thurs':'Th',
       'fri':'Fr','sat':'Sa','sun':'Su',
       'monday':'Mo','tuesday':'Tu','wednesday':'We','thursday':'Th',
       'friday':'Fr','saturday':'Sa','sunday':'Su',
       'mo':'Mo','tu':'Tu','we':'We','th':'Th','fr':'Fr','sa':'Sa','su':'Su'}
ORDER = ['Mo','Tu','We','Th','Fr','Sa','Su']

def norm_dash(s):
    return s.replace('–','-').replace('—','-').replace('−','-')

def to24(h, m, ap):
    h = int(h); m = int(m or 0)
    if ap:
        ap = ap.lower().replace('.','').replace(' ','')
        if ap.startswith('p') and h != 12: h += 12
        if ap.startswith('a') and h == 12: h = 0
    if not (0 <= h <= 23 and 0 <= m <= 59): return None
    return f"{h:02d}:{m:02d}"

# 7, 7:30, 7.30, 9AM, 9 a.m., 11.00am
T = r'(\d{1,2})(?:[:.](\d{2}))?\s*((?:a|p)\.?\s?m\.?)?'
RANGE = re.compile(T + r'\s*-\s*' + T, re.I)

def parse_range(s):
    """Возвращает 'HH:MM-HH:MM' или None."""
    m = RANGE.search(s)
    if not m: return None
    h1, m1, ap1, h2, m2, ap2 = m.groups()
    # «8am-8pm»: если у первого нет am/pm, а у второго есть — считаем утро
    if not ap1 and ap2 and ap2.lower().startswith('p') and int(h1) < int(h2):
        ap1 = 'am'
    a = to24(h1, m1, ap1); b = to24(h2, m2, ap2)
    if not a or not b: return None
    return f"{a}-{b}"

def expand(d1, d2):
    i, j = ORDER.index(d1), ORDER.index(d2)
    return ORDER[i:j+1] if i <= j else ORDER[i:] + ORDER[:j+1]

DAYSPEC = re.compile(
    r'\b(' + '|'.join(sorted(DAY, key=len, reverse=True)) + r')\b'
    r'(?:\s*-\s*\b(' + '|'.join(sorted(DAY, key=len, reverse=True)) + r')\b)?', re.I)

EVERYDAY = re.compile(r'\b(daily|every\s?day|everyday|open\s7\s?days|7\s?days)\b', re.I)

def collapse(days):
    """['Mo','Tu','We'] -> 'Mo-We'; несмежные -> через запятую."""
    idx = sorted(ORDER.index(d) for d in set(days))
    out, start, prev = [], idx[0], idx[0]
    for k in idx[1:]:
        if k == prev + 1: prev = k; continue
        out.append((start, prev)); start = prev = k
    out.append((start, prev))
    return ','.join(ORDER[a] if a == b else f"{ORDER[a]}-{ORDER[b]}" for a, b in out)

def normalize(raw):
    """-> (результат | None, причина_если_не_смогли)"""
    s = norm_dash(raw).strip()
    if not s: return None, 'пусто'
    if re.search(r'\bclass(es)?\b', s, re.I) and '&' in s:
        return None, 'расписание занятий, не часы работы'
    # Часы, относящиеся к части заведения, а не ко всему: «Gym 7 AM - 9 PM»,
    # «(COMO Shambhala wellness)». Такие записывать в общее поле нельзя.
    if re.search(r'\b(gym|kitchen|spa|pool|bar|restaurant|reception|wellness|shala)\b', s, re.I):
        return None, 'часы относятся к части заведения, нужна проверка человеком'

    # Сегментация: находим все диапазоны времени; если их больше одного,
    # режем строку по границам между ними, чтобы каждому диапазону достались
    # только свои дни. Без этого «Mon-Fri 6am-10pm Sat-Sun 7am-6pm» без
    # разделителя схлопывалось в одно правило и вторая половина терялась.
    # «Sun: Closed» — выходной. Убираем вместе с днём, иначе этот день
    # прилипнет к соседнему правилу и получит чужие часы.
    s = re.sub(r'\b(' + '|'.join(sorted(DAY, key=len, reverse=True)) + r')\b\s*:?\s*closed\b',
               ' ', s, flags=re.I)

    hits = list(RANGE.finditer(s))
    if len(hits) > 1:
        # Режем сразу ЗА концом каждого диапазона: дни следующего правила
        # стоят после него и должны попасть в следующий сегмент.
        parts, prev = [], 0
        for a in hits[:-1]:
            parts.append(s[prev:a.end()]); prev = a.end()
        parts.append(s[prev:])
        parts = [p.strip(' ;|,/:') for p in parts if p.strip(' ;|,/:')]
    else:
        parts = [p.strip() for p in re.split(r'[;|/]', s) if p.strip()]

    rules = {}   # 'HH:MM-HH:MM' -> set(days)
    for p in parts:
        if re.search(r'\bclosed\b', p, re.I) and not RANGE.search(p):
            continue                      # выходной — просто не перечисляем
        rng = parse_range(p)
        if not rng: continue
        days = []
        if EVERYDAY.search(p):
            days = ORDER[:]
        else:
            for m in DAYSPEC.finditer(p):
                d1 = DAY[m.group(1).lower()]
                d2 = DAY[m.group(2).lower()] if m.group(2) else None
                days += expand(d1, d2) if d2 else [d1]
        if not days:
            days = ORDER[:] if len(parts) == 1 else []
        if not days: continue
        rules.setdefault(rng, set()).update(days)

    if not rules: return None, 'не разобрано'
    seen = set()
    for v in rules.values():
        if v & seen: return None, 'дни пересекаются в разных правилах'
        seen |= v
    out = ', '.join(f"{collapse(sorted(d, key=ORDER.index))} {rng}"
                    for rng, d in sorted(rules.items(), key=lambda kv: min(ORDER.index(x) for x in kv[1])))
    OK = re.compile(r'^(Mo|Tu|We|Th|Fr|Sa|Su)(-(Mo|Tu|We|Th|Fr|Sa|Su))? \d{2}:\d{2}-\d{2}:\d{2}')
    if not OK.match(out): return None, 'результат не прошёл проверку формата'
    return out, None

if __name__ == '__main__':
    rows = list(csv.DictReader(open(sys.argv[1], encoding='utf-8-sig')))
    ok, bad = [], []
    for r in rows:
        res, why = normalize(r['opening_hours'])
        (ok if res else bad).append((r['slug'], r['opening_hours'], res or why))
    for s, src, res in ok:  print(f"OK   {s[:42]:44} {src[:48]:50} -> {res}")
    for s, src, why in bad: print(f"SKIP {s[:42]:44} {src[:48]:50} -- {why}")
    print(f"\nразобрано {len(ok)} / {len(rows)}, пропущено {len(bad)}")
