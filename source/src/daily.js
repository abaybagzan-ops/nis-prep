/* «Күнделікті раунд»: подбор коротких раундов на день, уровень английского, серия дней и значки.
   Чистые функции от состояния S — проверяются в Node без браузера. */
(function () {
  var L = NP.L, DAY = 86400000, F = NP.F;
  var dayKey = function (ts) { var d = new Date(ts); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  var dayStart = function (ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
  NP.dayKey = dayKey;
  var LOGIC_T = ['logic', 'spatial', 'seq'];
  var POOLS = null;
  var pools = function () {
    if (POOLS) return POOLS;
    POOLS = {
      math: NP.TPL.filter(function (t) { return t.s === 'math' && LOGIC_T.indexOf(t.t) < 0; }),
      logic: NP.TPL.filter(function (t) { return t.s === 'qc' || (t.s === 'math' && LOGIC_T.indexOf(t.t) >= 0); }),
      en: NP.TPL.filter(function (t) { return t.t === 'enmini'; }),
      sci: NP.TPL.filter(function (t) { return t.s === 'sci'; }),
      kk: NP.TPL.filter(function (t) { return t.t === 'kkmini'; }),
      ru: NP.TPL.filter(function (t) { return t.t === 'rumini'; })
    };
    return POOLS;
  };
  var isStatic = function (t) { return t.g.length === 0; };
  var skillKey = function (s, k) { return s + ':' + k; };

  /* Оценка времени (сек) на задание вместе с чтением разбора */
  NP.estSec = function (t) {
    var base;
    if (t.s === 'math') base = LOGIC_T.indexOf(t.t) >= 0 ? [0, 50, 80, 100][t.d] : [0, 40, 70, 95][t.d];
    else if (t.s === 'qc') base = [0, 30, 40, 55][t.d];
    else if (t.s === 'en') base = [0, 35, 45, 55][t.lv || t.d];
    else if (t.s === 'sci') base = 55; else base = 45;
    return base + 12;
  };

  var CEFR = { 1: 'A1', 2: 'A2', 3: 'B1' };
  NP.CEFR = CEFR;
  var THEMES = {
    route: L('Миссия: Алматы бойынша маршрут', 'Миссия: маршрут по Алматы'), shop: L('Миссия: дүкендегі есептер', 'Миссия: расчёты в магазине'),
    build: L('Миссия: құрылыс алаңы', 'Миссия: стройплощадка'), sport: L('Миссия: спорт статистикасы', 'Миссия: спортивная статистика'),
    numbers: L('Миссия: сандар шеберханасы', 'Миссия: мастерская чисел')
  };
  var themeOf = function (topic) {
    if (topic === 'speed' || topic === 'units') return THEMES.route;
    if (topic === 'pct' || topic === 'word' || topic === 'ratio') return THEMES.shop;
    if (topic === 'geo' || topic === 'vol') return THEMES.build;
    if (topic === 'data' || topic === 'mean' || topic === 'prob') return THEMES.sport;
    return THEMES.numbers;
  };
  NP.SLOT = { warm: L('Жаттығу', 'Разминка'), main: L('Негізгі', 'Основное'), hard: L('Қиынырақ', 'Посложнее'), boss: L('Күннің есебі', 'Задача дня'), review: L('Қайталау', 'Повторение'), level: L('Деңгей', 'Уровень'), stretch: L('Келесі деңгей', 'Шаг вперёд'), extra: L('Қосымша', 'Дополнительно'), similar: L('Ұқсас', 'Похожее') };

  /* Анализ состояния */
  var analyze = function (S, now) {
    var last = {}, topic = {}, today0 = dayStart(now);
    S.log.forEach(function (e) {
      if (!last[e.id] || e.ts > last[e.id]) last[e.id] = e.ts;
      (topic[e.t] = topic[e.t] || []).push(e);
    });
    var tAcc = {};
    Object.keys(topic).forEach(function (k) { var arr = topic[k].slice(-12), c = arr.filter(function (e) { return e.ok; }).length; tAcc[k] = { n: arr.length, c: c }; });
    var due = {};
    S.mistakes.forEach(function (m) {
      if (m.status === 'fixed') return;
      var isDue = (m.status === 'later' && m.due && m.due <= now) || ((m.status === 'new' || m.status === 'work') && m.ts < today0);
      if (!isDue) return;
      var k = skillKey(m.s, m.k); (due[k] = due[k] || { n: 0, t: m.t, s: m.s, k: m.k, last: 0 }); due[k].n++; due[k].last = Math.max(due[k].last, m.ts);
    });
    /* ошибки в двух последних ежедневных занятиях — для понятного объяснения */
    var recentDaily = S.attempts.filter(function (a) { return a.kind === 'daily'; }).slice(0, 2), recentErrTopics = {};
    recentDaily.forEach(function (a) { a.items.forEach(function (x) { if (!x.ok) recentErrTopics[x.t] = (recentErrTopics[x.t] || 0) + 1; }); });
    var comfort = function (subjects) {
      var arr = S.log.filter(function (e) { return subjects.indexOf(e.s) >= 0 && e.d !== 1; }).slice(-12);
      return { n: arr.length, c: arr.filter(function (e) { return e.ok; }).length };
    };
    return { last: last, tAcc: tAcc, due: due, recentErrTopics: recentErrTopics, comfort: comfort, now: now, today0: today0, nDaily: recentDaily.length };
  };

  var score = function (t, A, r, opt) {
    var s = r.f();
    var ls = A.last[t.id];
    if (!ls) s += 1.2; else { var d = (A.now - ls) / DAY; s += d < 1 ? -1.6 : Math.min(d, 10) * 0.15; }
    var ta = A.tAcc[t.t]; if (ta && ta.n >= 3 && ta.c / ta.n < 0.6) s += 0.8;
    if (opt.review && A.due[skillKey(t.s, t.k)]) s += 5;
    return s;
  };
  var pick = function (pool, A, r, opt, used) {
    var cand = pool.filter(function (t) { return (!opt.d || opt.d.indexOf(t.lv || t.d) >= 0) && !used.ids[t.id] && (!opt.k || opt.k.indexOf(t.k) >= 0); });
    var fresh = cand.filter(function (t) { return !used.topics[t.t] && !used.skills[t.k]; });
    if (fresh.length) cand = fresh;
    if (opt.review) { var rv = cand.filter(function (t) { return A.due[skillKey(t.s, t.k)]; }); if (rv.length) cand = rv; else return null; }
    if (!cand.length) return null;
    var best = null, bs = -1e9;
    cand.forEach(function (t) { var s = score(t, A, r, opt); if (s > bs) { bs = s; best = t; } });
    used.ids[best.id] = 1; used.topics[best.t] = 1; used.skills[best.k] = 1;
    return best;
  };
  var item = function (t, r, ri, slot) { return { id: t.id, seed: isStatic(t) ? 1 : r.int(1, 2e9), s: t.s, r: ri, slot: slot }; };
  var nm = function (o, lg) { return o[lg]; };
  var tName = function (t) { return NP.TOPICS[t] ? NP.TOPICS[t].name : L(t, t); };

  NP.buildDaily = function (S, mode, now, seed) {
    var r = NP.rng(seed >>> 0), A = analyze(S, now), P = pools();
    var rounds = [], items = [], reasons = [], short = mode === 'short';
    var lowData = S.log.length < 15;
    if (lowData) reasons.push(L('Әзірге дерек жеткіліксіз — тағы бірнеше раунд өт, сонда тапсырмалар саған дәлірек таңдалады.', 'Пока недостаточно данных — пройди ещё несколько раундов, и задания будут подбираться точнее.'));
    var addRound = function (meta, list) { var ri = rounds.length; meta.n = list.length; rounds.push(meta); list.forEach(function (x) { items.push(item(x.t, r, ri, x.slot)); }); };
    var reviewNote = function (t) {
      var tn = tName(t.t), rec = A.recentErrTopics[t.t];
      return rec && A.nDaily >= 2 ? L('«' + tn.kk + '» тақырыбына қайталау қосылды, өйткені соңғы екі сабақта осы жерде қате болды.', 'Добавили повторение по теме «' + tn.ru + '», потому что в последних двух занятиях здесь были ошибки.')
        : L('«' + tn.kk + '» тақырыбына қайталау қосылды: бұрын осы дағдыда қате болған, енді жаңа тапсырмамен тексереміз.', 'Добавили повторение по теме «' + tn.ru + '»: раньше в этом навыке была ошибка, проверим его на новом задании.');
    };

    /* 1. Математикалық спринт */
    var cm = A.comfort(['math']), stretch = cm.n >= 6 && cm.c / cm.n >= 0.75, easier = cm.n >= 6 && cm.c / cm.n < 0.45;
    var used = { ids: {}, topics: {}, skills: {} }, mlist = [], why = [];
    mlist.push({ t: pick(P.math, A, r, { d: [1] }, used), slot: 'warm' });
    var placeDay = !(S.en && S.en.placed) && !short;
    var rv = pick(P.math, A, r, { d: [2], review: true }, used) || pick(P.math, A, r, { d: [3], review: true }, used);
    if (rv) { mlist.push({ t: rv, slot: 'review' }); why.push(reviewNote(rv)); }
    else mlist.push({ t: pick(P.math, A, r, { d: [2] }, used), slot: 'main' });
    if (!short) {
      if (!placeDay) mlist.push({ t: pick(P.math, A, r, { d: stretch ? [3] : [2] }, used), slot: 'hard' });
      mlist.push({ t: pick(P.math, A, r, { d: [3] }, used), slot: 'boss' });
    }
    if (stretch) why.push(L('Соңғы математика тапсырмаларының ' + Math.round(cm.c / cm.n * 100) + '%-ы дұрыс — бүгін бір тапсырма қиынырақ.', 'Последние задания по математике решены на ' + Math.round(cm.c / cm.n * 100) + '% — сегодня одно задание сложнее.'));
    if (easier) why.push(L('Соңғы тапсырмалар қиын болды, сондықтан бүгін «Қиынырақ» тапсырма орта деңгейде.', 'Последние задания давались трудно, поэтому сегодня «Посложнее» — среднего уровня.'));
    var stale = mlist.filter(function (x) { var ls = A.last[x.t.id]; return ls && (now - ls) / DAY >= 5; })[0];
    if (stale && !lowData) why.push(L('«' + tName(stale.t.t).kk + '» тақырыбы ' + Math.floor((now - A.last[stale.t.id]) / DAY) + ' күннен бері қайталанбады.', 'Тема «' + tName(stale.t.t).ru + '» не повторялась ' + Math.floor((now - A.last[stale.t.id]) / DAY) + ' дн.'));
    var bossT = mlist[mlist.length - 1].t.t;
    mlist = mlist.filter(function (x) { return x.t; });
    addRound({ key: 'math', kind: 'math', title: L('Математикалық спринт', 'Математический спринт'), sub: themeOf(bossT), why: why }, mlist);

    /* 2. Логика / СС */
    used = { ids: {}, topics: {}, skills: {} }; var llist = [], lwhy = [];
    var qcOnly = P.logic.filter(function (t) { return t.s === 'qc'; }), puzzles = P.logic.filter(function (t) { return t.s === 'math'; });
    llist.push({ t: pick(qcOnly, A, r, { d: [1, 2] }, used), slot: 'warm' });
    var lrv = pick(P.logic, A, r, { d: [2, 3], review: true }, used);
    if (lrv) { llist.push({ t: lrv, slot: 'review' }); lwhy.push(reviewNote(lrv)); }
    else llist.push({ t: pick(short ? qcOnly : P.logic, A, r, { d: [2] }, used), slot: 'main' });
    if (!short && !placeDay) llist.push({ t: pick(r.f() < 0.65 ? puzzles : qcOnly, A, r, { d: [3] }, used) || pick(P.logic, A, r, { d: [3] }, used), slot: 'boss' });
    addRound({ key: 'logic', kind: 'logic', title: L('Логикалық квест', 'Логический квест'), sub: L('Жұмбақ бөлмесі: салыстыру, заңдылық, шарт', 'Комната головоломок: сравнение, закономерность, условие'), why: lwhy }, llist.filter(function (x) { return x.t; }));

    /* 3. English mini-round */
    var en = S.en || { placed: false, level: 1, hist: [] }, elist = [], ewhy = [];
    used = { ids: {}, topics: {}, skills: {} };
    var placement = !en.placed && !short;
    if (placement) {
      [1, 1, 2, 2, 3, 3].forEach(function (lv) { var t = pick(P.en, A, r, { d: [lv] }, used); if (t) elist.push({ t: t, slot: 'level' }); used.skills = {}; });
      ewhy.push(L('Алдымен деңгейді анықтаймыз: 6 тапсырма, 1-ден 3-ке дейін қиындай береді. Бұл — алғашқы шамамен баға.', 'Сначала определим уровень: 6 заданий от 1 до 3 по сложности. Это первая примерная оценка.'));
      addRound({ key: 'en', kind: 'en', place: true, title: L('English: деңгейді анықтау', 'English: определение уровня'), sub: L('Тапсырмалар ағылшынша, түсіндірме — таңдалған тілде', 'Задания на английском, объяснения — на выбранном языке'), why: ewhy }, elist);
    } else {
      var lv = en.placed ? en.level : 1;
      elist.push({ t: pick(P.en, A, r, { d: [lv] }, used), slot: 'level' });
      if (!short) {
        var erv = pick(P.en, A, r, { d: [lv, Math.min(3, lv + 1)], review: true }, used);
        if (erv) { elist.push({ t: erv, slot: 'review' }); ewhy.push(reviewNote(erv)); }
        else elist.push({ t: pick(P.en, A, r, { d: [lv] }, used), slot: 'level' });
      }
      if (!short) elist.push({ t: pick(P.en, A, r, { d: [Math.min(3, lv + 1)] }, used) || pick(P.en, A, r, { d: [lv] }, used), slot: lv < 3 ? 'stretch' : 'level' });
      ewhy.unshift(en.placed ? L('English деңгейі: ' + lv + ' (шамамен ' + CEFR[lv] + '). Деңгей жауаптарға қарай біртіндеп өзгереді.', 'Уровень English: ' + lv + ' (примерно ' + CEFR[lv] + '). Он постепенно меняется по ответам.')
        : L('Деңгейді анықтау 10–15 минуттық раундта өтеді. Әзірге 1-деңгей.', 'Уровень определяется в раунде на 10–15 минут. Пока — уровень 1.'));
      addRound({ key: 'en', kind: 'en', title: L('English mini-round', 'English mini-round'), sub: L('Сөздер, грамматика, қысқа мәтін, диалог', 'Слова, грамматика, короткий текст, диалог'), why: ewhy }, elist.filter(function (x) { return x.t; }));
    }

    /* 4. Қосымша раунд: жаратылыстану / қазақ / орыс (кезекпен) */
    if (!short && !placement) {
      var cycle = ['sci', 'kk', 'sci', 'ru'], dn = Math.floor((dayStart(now) - new Date(2026, 0, 5).getTime()) / DAY);
      var subj = cycle[((dn % 4) + 4) % 4], xwhy = [];
      var weak = ['sci', 'kk', 'ru'].map(function (s) {
        var arr = S.log.filter(function (e) { return e.s === s && (s === 'sci' || e.t === s + 'mini'); }).slice(-10), c = arr.filter(function (e) { return e.ok; }).length;
        var hasDue = Object.keys(A.due).some(function (k) { return A.due[k].s === s; });
        return { s: s, n: arr.length, a: arr.length ? c / arr.length : 1, due: hasDue };
      }).filter(function (x) { return x.n >= 4 && x.a < 0.5 && x.due; }).sort(function (a, b) { return a.a - b.a; })[0];
      if (weak && weak.s !== subj) { subj = weak.s; xwhy.push(L('Бүгін «' + NP.SUBJ[subj].kk + '» кезектен тыс қосылды: соңғы жауаптардың ' + Math.round(weak.a * 100) + '%-ы ғана дұрыс.', 'Сегодня «' + NP.SUBJ[subj].ru + '» добавлен вне очереди: верно только ' + Math.round(weak.a * 100) + '% последних ответов.')); }
      else xwhy.push(L('Қосымша раунд күн сайын ауысады: жаратылыстану, қазақ тілі, жаратылыстану, орыс тілі.', 'Дополнительный раунд меняется по дням: естествознание, казахский, естествознание, русский.'));
      used = { ids: {}, topics: {}, skills: {} };
      var xp = P[subj], xl = [];
      var xr = pick(xp, A, r, { review: true }, used);
      if (xr) { xl.push({ t: xr, slot: 'review' }); xwhy.push(reviewNote(xr)); }
      var xn = (weak && weak.s === subj) || xr ? 2 : 1;
      while (xl.length < xn) { var xt = pick(xp, A, r, {}, used); if (!xt) break; xl.push({ t: xt, slot: 'extra' }); }
      var xtitle = { sci: L('Зерттеу зертханасы', 'Исследовательская лаборатория'), kk: L('Қазақ тілі: сөз шеберханасы', 'Казахский язык: мастерская слов'), ru: L('Орыс тілі: сөз шеберханасы', 'Русский язык: мастерская слов') }[subj];
      var xsub = { sci: L('Құбылыс, себеп пен салдар, тәжірибе', 'Явления, причины и следствия, опыт'), kk: L('Сөз мағынасы, грамматика, қысқа мәтін', 'Значение слов, грамматика, короткий текст'), ru: L('Сөз мағынасы, грамматика, қысқа мәтін', 'Значение слов, грамматика, короткий текст') }[subj];
      addRound({ key: 'x-' + subj, kind: subj, title: xtitle, sub: xsub, why: xwhy }, xl);
    }

    var est = items.reduce(function (s, it) { return s + NP.estSec(NP.byId[it.id]); }, 0);
    return { rounds: rounds, items: items, reasons: reasons, estMin: Math.round(est / 60), placement: placement };
  };

  /* Уровень английского */
  NP.enPlace = function (S, items) {
    var c = { 1: 0, 2: 0, 3: 0 };
    items.forEach(function (it) { var t = NP.byId[it.id]; if (it.ok) c[t.lv]++; });
    var lv = 1;
    if (c[2] === 2 || (c[2] === 1 && c[1] === 2)) lv = 2;
    if (lv === 2 && c[3] === 2) lv = 3;
    S.en = { placed: true, level: lv, hist: [], ups: 0, downs: 0, placedAt: Date.now(), placeScore: c };
    return lv;
  };
  NP.enAfter = function (S, t, ok) {
    var en = S.en; if (!en || !en.placed || t.lv !== en.level) return null;
    en.hist.push(ok ? 1 : 0); if (en.hist.length > 10) en.hist.shift();
    var n = en.hist.length, a = en.hist.reduce(function (s, x) { return s + x; }, 0) / (n || 1);
    if (n >= 8 && a >= 0.8 && en.level < 3) { en.level++; en.hist = []; en.ups = (en.ups || 0) + 1; return 'up'; }
    if (n >= 6 && a <= 0.4 && en.level > 1) { en.level--; en.hist = []; en.downs = (en.downs || 0) + 1; return 'down'; }
    return null;
  };

  /* Серия, рекорд, значки */
  NP.dailyStats = function (S, now) {
    var ds = S.attempts.filter(function (a) { return a.kind === 'daily'; });
    var days = {}; ds.forEach(function (a) { days[dayKey(a.ts)] = 1; });
    var streak = 0, d = dayStart(now);
    if (!days[dayKey(d)]) d -= DAY;
    while (days[dayKey(d)]) { streak++; d -= DAY; }
    var keys = Object.keys(days).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { var t = new Date(k + 'T12:00:00').getTime(); run = prev !== null && Math.round((t - prev) / DAY) === 1 ? run + 1 : 1; prev = t; best = Math.max(best, run); });
    var record = 0; ds.forEach(function (a) { if (a.sub === 'normal') record = Math.max(record, a.c); });
    var boss = 0; ds.forEach(function (a) { a.items.forEach(function (x) { if (x.slot === 'boss' && x.ok) boss++; }); });
    var week = S.log.filter(function (e) { return now - e.ts < 7 * DAY; }), subs = {}; week.forEach(function (e) { subs[e.s] = 1; });
    var fixed = S.mistakes.some(function (m) { return m.status === 'fixed'; });
    var st = {}; S.log.forEach(function (e) { var k = e.s + ':' + e.k; (st[k] = st[k] || { n: 0, c: 0 }); st[k].n++; if (e.ok) st[k].c++; });
    var mastered = Object.keys(st).filter(function (k) { return st[k].n >= 6 && st[k].c / st[k].n >= 0.8; }).length;
    var B = function (id, got, kk, ru, dk, dr) { return { id: id, got: !!got, name: L(kk, ru), desc: L(dk, dr) }; };
    var badges = [
      B('first', ds.length >= 1, 'Алғашқы қадам', 'Первый шаг', 'Бірінші күнделікті раундты аяқтау', 'Завершить первую тренировку дня'),
      B('s3', best >= 3, '3 күн қатарынан', '3 дня подряд', 'Үш күн қатарынан жаттығу', 'Заниматься три дня подряд'),
      B('s7', best >= 7, 'Апталық серия', 'Неделя подряд', 'Жеті күн қатарынан жаттығу', 'Заниматься семь дней подряд'),
      B('d10', Object.keys(days).length >= 10, '10 күн', '10 дней', 'Барлығы 10 күн жаттығу', 'Всего 10 дней занятий'),
      B('boss5', boss >= 5, 'Босс-жеңімпаз', 'Победитель босса', '5 «күннің есебін» дұрыс шешу', 'Решить 5 «задач дня»'),
      B('fix', fixed, 'Қатемен жұмыс', 'Работа над ошибками', 'Бір қатені толық түзету (екі түрлі күні тексеру)', 'Полностью исправить ошибку (проверка в два разных дня)'),
      B('enup', S.en && S.en.ups >= 1, 'English өсуі', 'Рост в English', 'English деңгейін көтеру', 'Повысить уровень English'),
      B('all6', Object.keys(subs).length >= 6, 'Барлық пән', 'Все предметы', 'Бір аптада барлық 6 пән бойынша жауап беру', 'За неделю ответить по всем 6 предметам')
    ];
    return { streak: streak, best: best, days: Object.keys(days).length, today: !!days[dayKey(now)], record: record, boss: boss, mastered: mastered, badges: badges };
  };
})();
