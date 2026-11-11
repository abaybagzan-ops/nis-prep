/* Сборка попыток (экзамен, диагностика, тематический тест, практика, недельный срез) и подсчёт результатов. */
(function () {
  var L = NP.L, MIN = 60000;

  /* Официальный формат (проверено 11.11.2026 по материалам nis.edu.kz, см. NP.OFFICIAL в app) */
  NP.FORMAT = {
    1: [{ key: 'math', s: 'math', n: 40, min: 60 }, { key: 'qc', s: 'qc', n: 60, min: 30 }, { key: 'sci', s: 'sci', n: 20, min: 30 }],
    2: [{ key: 'lang', n: 60, min: 120 }]
  };
  NP.SEC_NAME = { math: NP.SUBJ.math, qc: NP.SUBJ.qc, sci: NP.SUBJ.sci, lang: L('Тілдік тест', 'Языковой тест'), all: L('Тапсырмалар', 'Задания') };

  var pool = function (s) { return NP.TPL.filter(function (t) { return t.s === s; }); };
  var uid = function (r) { return (Date.now().toString(36) + Math.floor((r ? r.f() : Math.random()) * 1e9).toString(36)).slice(-12); };
  NP.uid = uid;

  var mkSections = function (defs) {
    var from = 0;
    return defs.map(function (d) { var s = { key: d.key, from: from, to: from + d.n - 1, limitMs: d.min ? d.min * MIN : 0, usedMs: 0, locked: false }; from += d.n; return s; });
  };
  var base = function (kind, sub, title, mode, items, sections, extra) {
    var o = { sid: uid(), kind: kind, sub: sub, title: title, mode: mode, items: items, sections: sections, answers: {}, flags: {}, checked: {}, hints: {}, cur: 0, created: Date.now(), finished: null, timed: false };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  };

  NP.makeExam = function (day, mode, seed) {
    var r = NP.rng(seed || (Date.now() >>> 0)), items = [];
    if (day === 1) {
      var m = r.shuffle(pool('math')).slice(0, 40).sort(function (a, b) { return a.d - b.d; });
      var q = r.shuffle(pool('qc')).slice(0, 60).sort(function (a, b) { return a.d - b.d; });
      var s = r.shuffle(pool('sci')).slice(0, 20);
      [[m, 'math'], [q, 'qc'], [s, 'sci']].forEach(function (p) { p[0].forEach(function (t) { items.push({ id: t.id, seed: r.int(1, 2e9), sec: p[1], s: t.s }); }); });
    } else {
      ['kk', 'ru', 'en'].forEach(function (lg) { pool(lg).forEach(function (t) { items.push({ id: t.id, seed: 1, sec: 'lang', s: t.s }); }); });
    }
    var title = day === 1 ? L('Толық сынақ: 1-күн', 'Полный тест: 1-й день') : L('Толық сынақ: 2-күн', 'Полный тест: 2-й день');
    return base('exam' + day, 'day' + day, title, mode, items, mkSections(NP.FORMAT[day]), { day: day, timed: mode === 'exam' });
  };

  /* Диагностика: по направлению; задания распределены по темам, чтобы видеть навыки */
  NP.makeDiag = function (sub, seed) {
    var r = NP.rng(seed || (Date.now() >>> 0)), items = [];
    var per = { math: 2, qc: 3, sci: 2 }[sub];
    if (sub === 'lang') {
      ['kk', 'ru', 'en'].forEach(function (lg) {
        var ps = {}; pool(lg).forEach(function (t) { (ps[t.pass] = ps[t.pass] || []).push(t); });
        var keys = Object.keys(ps), pk = keys[r.int(0, keys.length - 1)];
        ps[pk].forEach(function (t) { items.push({ id: t.id, seed: 1, sec: 'all', s: t.s }); });
      });
    } else {
      NP.TOPIC_ORDER.filter(function (tp) { return NP.TOPICS[tp].s === sub; }).forEach(function (tp) {
        r.shuffle(pool(sub).filter(function (t) { return t.t === tp; })).slice(0, per).forEach(function (t) { items.push({ id: t.id, seed: r.int(1, 2e9), sec: 'all', s: t.s }); });
      });
    }
    var nm = sub === 'lang' ? L('Тілдер', 'Языки') : NP.SUBJ[sub];
    return base('diag', sub, L('Диагностика: ' + nm.kk, 'Диагностика: ' + nm.ru), 'exam', items, mkSections([{ key: 'all', n: items.length }]));
  };

  NP.makeTopicTest = function (topic, seed) {
    var r = NP.rng(seed || (Date.now() >>> 0));
    var ts = r.shuffle(NP.TPL.filter(function (t) { return t.t === topic; })).slice(0, 10);
    var items = ts.map(function (t) { return { id: t.id, seed: r.int(1, 2e9), sec: 'all', s: t.s }; });
    var nm = NP.TOPICS[topic].name;
    return base('topic', topic, L('Тақырыптық тест: ' + nm.kk, 'Тематический тест: ' + nm.ru), 'exam', items, mkSections([{ key: 'all', n: items.length }]));
  };

  /* Практика «похожие задания»: шаблоны темы/навыка с новыми числами; соседние задания — разные шаблоны, если возможно */
  NP.makePractice = function (filter, seed, n, title) {
    var r = NP.rng(seed || (Date.now() >>> 0));
    var ts = NP.TPL.filter(function (t) { return (filter.topic ? t.t === filter.topic : true) && (filter.skill ? (t.s + ':' + t.k) === filter.skill : true) && (filter.id ? t.id === filter.id : true); });
    if (!ts.length && filter.skill) ts = NP.TPL.filter(function (t) { return t.t === filter.topicFallback; });
    var items = [], order = [];
    while (order.length < n) order = order.concat(r.shuffle(ts));
    order.slice(0, n).forEach(function (t) {
      var stat = t.g.length === 0 || t.s === 'sci' || t.s === 'kk' || t.s === 'ru' || t.s === 'en';
      items.push({ id: t.id, seed: stat ? 1 : r.int(1, 2e9), sec: 'all', s: t.s });
    });
    // убрать полностью одинаковые задания (статичные шаблоны)
    var seen = {}; items = items.filter(function (it) { var k = it.id + ':' + it.seed; if (seen[k]) return false; seen[k] = 1; return true; });
    return base('practice', filter.topic || filter.skill || filter.id, title, 'study', items, mkSections([{ key: 'all', n: items.length }]));
  };

  NP.makeCheck = function (topics, seed) {
    var r = NP.rng(seed || (Date.now() >>> 0)), items = [];
    topics.slice(0, 6).forEach(function (tp) { r.shuffle(NP.TPL.filter(function (t) { return t.t === tp; })).slice(0, 2).forEach(function (t) { items.push({ id: t.id, seed: r.int(1, 2e9), sec: 'all', s: t.s }); }); });
    return base('check', 'week', L('Апталық қысқа тексеріс', 'Недельный срез'), 'exam', items, mkSections([{ key: 'all', n: items.length }]));
  };

  NP.secIndex = function (ses, i) { for (var k = 0; k < ses.sections.length; k++) if (i >= ses.sections[k].from && i <= ses.sections[k].to) return k; return 0; };

  /* Кэш собранных заданий */
  var cache = {};
  NP.inst = function (it) { var k = it.id + ':' + it.seed; if (!cache[k]) cache[k] = NP.build(it.id, it.seed); return cache[k]; };

  NP.score = function (ses) {
    var res = { sections: ses.sections.map(function (s) { return { key: s.key, c: 0, n: s.to - s.from + 1 }; }), items: [], c: 0, n: ses.items.length };
    ses.items.forEach(function (it, i) {
      var inst = NP.inst(it), sel = ses.answers[i], ok = sel !== undefined && sel === inst.ans;
      var si = NP.secIndex(ses, i);
      if (ok) { res.sections[si].c++; res.c++; }
      res.items.push({ id: it.id, seed: it.seed, s: inst.s, t: inst.t, k: inst.k, sel: sel === undefined ? null : sel, ans: inst.ans, ok: ok, sec: ses.sections[si].key });
    });
    return res;
  };
})();
