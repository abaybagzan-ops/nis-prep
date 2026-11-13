"""Импорт пакета NIS6_Daily_Materials_v1.json в банк сайта (src/bank_pack1.js).
Запуск: python3 -I tools/import_pack.py materials/NIS6_Daily_Materials_v1.json materials/pack1_overrides.py src/bank_pack1.js
Правки и русский перевод лежат отдельно в pack1_overrides.py, чтобы было видно, что изменено."""
import json, re, sys

src, ovr_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(src, encoding='utf-8'))
ovr = {}
exec(compile(open(ovr_path, encoding='utf-8').read(), ovr_path, 'exec'), ovr)
DROP, FIX_KK, LEVEL, RU, RU_EN, TOPIC_RU, TOPIC_FIX_KK = (ovr[k] for k in ('DROP', 'FIX_KK', 'LEVEL', 'RU', 'RU_EN', 'TOPIC_RU', 'TOPIC_FIX_KK'))

TM = {t['id']: dict(t) for t in data['topicMap']}
for k, v in TOPIC_FIX_KK.items(): TM[k].update(v)

def first_sentences(s, n=2):
    parts = re.split(r'(?<=[.!?])\s+', s.strip())
    return ' '.join(parts[:n])

CUSTOM = {  # подсказка и типичная ошибка там, где в пакете нет подходящей карты темы
    'spatial': (('Суретті елестетіп, қадамдап жүріп шық.', 'Представь картинку и проходи по шагам.'), ('Бір қадамды өткізіп алу немесе оң мен солды шатастыру.', 'Пропустить шаг или перепутать право и лево.')),
    'prob': (('Ықтималдық = қолайлы нәтижелер саны : барлық нәтижелер саны.', 'Вероятность = число благоприятных исходов : число всех исходов.'), ('Қолайлы нәтижелерді барлық нәтижеге емес, басқа топқа бөлу.', 'Делить благоприятные исходы не на все исходы, а на другую группу.')),
    'compare': (('Шартқа сай келетін барлық санды тізіп шық.', 'Выпиши все числа, подходящие под условие.'), ('Шекаралық санды қосып жіберу немесе қажетті санды ұмыту.', 'Включить граничное число или пропустить нужное.')),
    'phen': (('Құбылыстың себебі мен нәтижесін ажырат.', 'Отдели причину явления от результата.'), ('Бақылауды «жоғалып кетті» немесе «өздігінен болды» деп түсіндіру.', 'Объяснять наблюдение словами «исчезло» или «само собой».')),
    'kkgram': (('Сөзге сұрақ қойып көр: кім? не істеді? қалай?', None), ('Сұрақты дұрыс қоймай, сөз табын немесе сөйлем мүшесін шатастыру.', None)),
    'rugram': ((None, 'Задай к слову вопрос: что сделал? какая?'), (None, 'Не задать вопрос и перепутать часть речи или форму слова.')),
}

def classify(q):
    s, tp, sk = q['subject'], q['topic'], q['skill']
    pool = None
    if s == 'math':
        if tp == 'Бөлшектер': t, k, m = 'frac', {'Санның бөлшегін табу': 'frac.part', 'Бөлшектерді салыстыру': 'frac.compare'}.get(sk, 'frac.ops'), 'l-math-fractions'
        elif tp == 'Пайыздар': t, k, m = 'pct', {'Бастапқы мәнді табу': 'pct.reverse', 'Пайыздық өсім': 'pct.change', 'Екі қадамды пайыз': 'pct.change'}.get(sk, 'pct.find'), 'l-math-percent'
        elif tp == 'Қатынас және пропорция': t, k, m = 'ratio', {'Масштаб': 'ratio.scale', 'Қатынасты масштабтау': 'ratio.scale', 'Қатынасты қысқарту': 'ratio.simplify'}.get(sk, 'ratio.divide'), 'l-math-ratio'
        elif tp == 'Теңдеулер': t, k, m = 'eq', 'eq.model' if sk in ('Мәтінді теңдеу', 'Қосынды және айырма') else 'eq.solve', 'l-math-equations'
        elif tp == 'Геометрия':
            if sk in ('Көлем', 'Көлемнен қырды табу'): t, k = 'vol', 'vol.box'
            elif sk == 'Үшбұрыш бұрыштары': t, k = 'geo', 'geo.angle'
            else: t, k = 'geo', 'geo.area'
            m = 'l-math-geometry'
        elif tp == 'Жылдамдық және уақыт': t, k, m = 'speed', {'Қарама-қарсы қозғалыс': 'speed.towards', 'Бір бағыттағы қозғалыс': 'speed.catchup', 'Орташа жылдамдық': 'speed.average'}.get(sk, 'speed.basic'), 'l-math-motion'
        return 'math', t, k, m, None
    if s == 'logic':
        pool = 'logic'
        if tp == 'Сандық заңдылық': return 'math', 'seq', 'seq.rule', 'l-logic-patterns', pool
        if tp == 'Логикалық шарттар': return 'math', 'logic', 'logic.deduce', 'l-logic-constraints', pool
        if tp == 'Кесте және дерек': return 'math', 'data', 'data.read', 'l-logic-data', pool
        if tp == 'Кеңістіктік ойлау': return 'math', 'spatial', 'spatial.dir' if sk == 'Бағытты өзгерту' else 'spatial.cube', 'spatial', pool
        if tp == 'Комбинаторика': return 'math', 'prob', {'Таңдау саны': 'comb.product', 'Құпия код': 'comb.digits', 'Топ құрастыру': 'comb.pairs'}.get(sk, 'comb.perm'), 'l-logic-combinatorics', pool
        if tp == 'Ықтималдық': return 'math', 'prob', 'prob.basic', 'prob', pool
        return 'math', 'logic', 'logic.compare', 'compare', pool
    if s == 'english':
        k = 'en.grammar' if tp.startswith('Grammar') else 'en.read' if tp.startswith('Reading') else 'en.vocab'
        return 'en', 'enmini', k, 'l-english-grammar' if k == 'en.grammar' else 'l-english-reading', None
    if s == 'science':
        if tp.startswith('Зерттеу'): return 'sci', 'sexp', 'sci.method', 'l-science-investigation', None
        if tp.startswith('Тірі'): return 'sci', 'sbio', 'sci.ecology', 'l-science-ecosystems', None
        if tp.startswith('Физикалық'): return 'sci', 'sphys', 'sci.light' if q['skill'] == 'Көлеңке' else 'sci.heat', 'l-science-physical', None
        if tp.startswith('Заттар'): return 'sci', 'schem', 'sci.mixtures', 'phen', None
        return 'sci', 'sgeo', 'sci.earth', 'phen', None
    if s == 'kk':
        return 'kk', 'kkmini', 'kk.read' if tp == 'Оқылым' else 'kk.grammar', 'l-language-reading' if tp == 'Оқылым' else 'kkgram', None
    if s == 'ru':
        return 'ru', 'rumini', {'Чтение': 'ru.read', 'Грамматика': 'ru.grammar'}.get(tp, 'ru.vocab'), 'l-language-reading' if tp == 'Чтение' else 'rugram', None
    raise ValueError(s)

def hint_err(m):
    if m in CUSTOM:
        (hk, hr), (ek, er) = CUSTOM[m]
        return (hk, hr), (ek, er)
    t = TM[m]
    hr, er = TOPIC_RU[m]
    return (first_sentences(t['summaryKk']), hr), (t['commonErrorKk'], er)

FR = re.compile(r'(?<![\d/,])(\d+)/(\d+)(?![\d/])')
def frac_html(s):  # 3/4 → вертикальная дробь (только в математике и логике)
    return FR.sub(lambda mm: '<span class="fr"><span>%s</span><span>%s</span></span>' % (mm.group(1), mm.group(2)), s)
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

LV = {'easy': 1, 'medium': 2, 'hard': 3}
out_items, report = [], {'dropped': [], 'fixed': [], 'count': 0}
for q in data['questions']:
    qid = q['id']
    if qid in DROP: report['dropped'].append(qid); continue
    q = dict(q); q['options'] = list(q['options'])
    fx = FIX_KK.get(qid, {})
    if fx: report['fixed'].append(qid)
    if 'q' in fx: q['question'] = fx['q']
    if 'e' in fx: q['explanationKk'] = fx['e']
    for i, v in fx.get('o', {}).items(): q['options'][i] = v
    s, t, k, m, pool = classify(q)
    d = LEVEL.get(qid, LV[q['difficulty']])
    (hk, hr), (ek, er) = hint_err(m)
    num = s in ('math',)
    conv = (lambda x: frac_html(esc(x))) if num else esc
    ans = q['answerIndex']
    if s in ('kk', 'ru'):  # полностью на своём языке
        lang = s; H, E = (hk if s == 'kk' else hr), (ek if s == 'kk' else er)
        opts = [esc(x) for x in q['options']]
        c = {'fixed': lang, 'q': esc(q['question']), 'a': opts[ans], 'w': [[o, E] for i, o in enumerate(opts) if i != ans], 'h': H, 'e': esc(q['explanationKk'])}
    elif s == 'en':
        opts = [esc(x) for x in q['options']]
        c = {'fixed': 'en', 'q': esc(q['question']), 'a': opts[ans], 'w': [[o, {'kk': ek, 'ru': er}] for i, o in enumerate(opts) if i != ans],
             'h': {'kk': hk, 'ru': hr}, 'e': {'kk': esc(q['explanationKk']), 'ru': esc(RU_EN[qid])}}
    else:
        r = RU[qid]
        ok_ = [conv(x) for x in q['options']]
        orr = [conv(x) for x in (r['o'] if r['o'] else q['options'])]
        assert len(orr) == 4
        L = lambda a, b: {'kk': a, 'ru': b}
        c = {'q': L(conv(q['question']), conv(r['q'])), 'a': L(ok_[ans], orr[ans]),
             'w': [[L(ok_[i], orr[i]), L(ek, er)] for i in range(4) if i != ans],
             'h': L(hk, hr), 'e': L(conv(q['explanationKk']), conv(r['e']))}
    meta = {'id': qid, 's': s, 't': t, 'k': k, 'd': d, 'est': q.get('estimatedSeconds'), 'src': 'pack1'}
    if s == 'en': meta['lv'] = d
    if pool: meta['pool'] = pool
    out_items.append((meta, c))
    report['count'] += 1

js = ['/* СГЕНЕРИРОВАНО tools/import_pack.py из materials/NIS6_Daily_Materials_v1.json (+ pack1_overrides.py). Не править вручную. */',
      '(function () {', '  var add = function (m, c) { m.g = function () { return c; }; NP.T(m); };']
for meta, c in out_items:
    js.append('  add(%s, %s);' % (json.dumps(meta, ensure_ascii=False), json.dumps(c, ensure_ascii=False)))
js.append('  NP.PACKS = (NP.PACKS || []).concat([%s]);' % json.dumps({'id': 'pack1', 'title': data.get('title'), 'created': data.get('createdDate'), 'count': report['count'], 'dropped': report['dropped'], 'sources': data.get('sources')}, ensure_ascii=False))
js.append('})();')
open(out, 'w', encoding='utf-8').write('\n'.join(js) + '\n')
print(json.dumps(report, ensure_ascii=False))
