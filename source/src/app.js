/* Интерфейс приложения. Без фреймворков: состояние → HTML, обработчики через data-атрибуты. */
(function () {
  'use strict';
  var L = NP.L, F = NP.F;
  var KEY = 'nisprep.v1', VERSION = 1, DAY = 86400000, MIN_N = 3;

  NP.OFFICIAL = {
    checked: '11.11.2026',
    links: [
      { url: 'https://www.nis.edu.kz/ru/page/konkurs-zoninde-xabarlama', t: L('NIS: конкурс туралы хабарландыру (2027–2028 оқу жылы)', 'NIS: объявление о конкурсе (2027–2028 учебный год)') },
      { url: 'https://www.nis.edu.kz/storage/files/01KEVNJY08HWTNGNR57EQFMKCF.pdf', t: L('NIS ПӨО: үміткерлерге арналған ақпараттық буклет (2026–2027 оқу жылы, PDF)', 'ЦПИ NIS: информационный буклет для претендентов (2026–2027 учебный год, PDF)') }
    ]
  };

  /* ---------------- Тексты интерфейса ---------------- */
  var TX = {
    brand: L('NIS-ке дайындық', 'Подготовка к NIS'),
    home: L('Оқу панелі', 'Главная'), learn: L('Үйрену', 'Учиться'), diag: L('Диагностика', 'Диагностика'), exam: L('Толық сынақ', 'Полный тест'),
    results: L('Нәтижелер', 'Результаты'), mistakes: L('Қателерді қайталау', 'Работа над ошибками'), plan: L('Апталық жоспар', 'Недельный план'), data: L('Деректер', 'Данные'),
    uiLang: L('Интерфейс', 'Интерфейс'), qLang: L('Тапсырма тілі', 'Язык заданий'),
    local: L('Прогресс тек осы құрылғының браузерінде сақталады. Басқа құрылғыда ол автоматты түрде көрінбейді — сақтық көшірме жасап тұрыңыз.', 'Прогресс хранится только в браузере этого устройства. На другом устройстве он автоматически не появится — периодически делайте резервную копию.'),
    disclaim: L('Тапсырмалар авторлық, олар NIS-тің ресми тапсырмалары емес. Жаттығу нәтижесі NIS-тің ресми балы емес және түсуді болжамайды.', 'Задания авторские, это не официальные задания NIS. Тренировочный результат не является официальным баллом NIS и не предсказывает поступление.'),
    noStore: L('Браузер деректерді сақтауға рұқсат бермей тұр (мысалы, жасырын режим). Бетті жаңартқанда прогресс жоғалады.', 'Браузер не разрешает сохранять данные (например, режим инкогнито). При обновлении страницы прогресс пропадёт.'),
    start: L('Бастау', 'Начать'), resume: L('Жалғастыру', 'Продолжить'), next: L('Келесі', 'Далее'), back: L('Артқа', 'Назад'), check: L('Тексеру', 'Проверить'),
    hint: L('Кеңес', 'Подсказка'), flag: L('Белгілеу', 'Отметить'), flagged: L('Белгіленді', 'Отмечено'), finish: L('Аяқтау', 'Завершить'), cancel: L('Болдырмау', 'Отмена'),
    correct: L('Дұрыс', 'Верно'), wrong: L('Қате', 'Неверно'), answer: L('Дұрыс жауап', 'Правильный ответ'), yours: L('Сіздің жауабыңыз', 'Ваш ответ'), noAns: L('жауап берілмеді', 'нет ответа'),
    expl: L('Шешуі', 'Решение'), whyWrong: L('Бұл жауап неге қате', 'Почему этот ответ неверный'), trap: L('Жиі кездесетін қате', 'Частая ошибка'), similar: L('Ұқсас тапсырма', 'Похожее задание'),
    notEnough: L('Әзірге дерек жеткіліксіз', 'Пока недостаточно данных'), author: L('Авторлық жаттығу тапсырмасы', 'Авторское тренировочное задание'),
    timeUp: L('Бұл бөлімнің уақыты бітті. Жауаптарды өзгертуге болмайды.', 'Время этого раздела истекло. Ответы изменить нельзя.'),
    fixedKk: L('Бұл тапсырма тек қазақ тілінде беріледі.', 'Это задание даётся только на казахском языке.'),
    fixedRu: L('Бұл тапсырма тек орыс тілінде беріледі.', 'Это задание даётся только на русском языке.'),
    fixedEn: L('Мәтін мен сұрақ ағылшын тілінде; кеңес пен шешуі таңдалған тілде.', 'Текст и вопрос на английском; подсказка и решение — на выбранном языке.'),
    of: L('/', '/'), q: L('Сұрақ', 'Вопрос'), min: L('мин', 'мин'), items: L('тапсырма', 'заданий'),
    date: L('Күні', 'Дата'), test: L('Тест', 'Тест'), acc: L('Дәлдік', 'Точность'), n: L('Тапсырма саны', 'Заданий'), c: L('Дұрыс', 'Верно')
  };
  var S = null;
  var t = function (o) { return o ? (o[S.ui] !== undefined ? o[S.ui] : o.kk) : ''; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var pct = function (c, n) { return n ? Math.round(c / n * 100) + '%' : '—'; };
  var fmtDate = function (ts) { var d = new Date(ts); return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear(); };
  var fmtTime = function (ms) { ms = Math.max(0, ms); var s = Math.floor(ms / 1000), m = Math.floor(s / 60); s %= 60; var h = Math.floor(m / 60); m %= 60; return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s).slice(-2); };
  var dayKey = function (ts) { var d = new Date(ts); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };

  /* ---------------- Хранилище ---------------- */
  var storageOk = true;
  var fresh = function () { return { v: VERSION, app: 'nis-prep', ui: 'kk', ql: 'kk', created: Date.now(), sessions: { full: null, test: null, practice: null }, attempts: [], log: [], mistakes: [], plan: null, seen: {} }; };
  var load = function () {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.v === VERSION) return s; } } catch (e) { storageOk = false; }
    return fresh();
  };
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); storageOk = true; } catch (e) { storageOk = false; } };
  S = load();
  if (!S.sessions) S.sessions = { full: null, test: null, practice: null };

  /* ---------------- Статистика ---------------- */
  var skillKey = function (s, k) { return s + ':' + k; };
  var stats = function () {
    var top = {}, sk = {};
    S.log.forEach(function (e) {
      (top[e.t] = top[e.t] || { n: 0, c: 0 }); top[e.t].n++; if (e.ok) top[e.t].c++;
      var kk = skillKey(e.s, e.k); (sk[kk] = sk[kk] || { n: 0, c: 0, t: e.t, s: e.s, k: e.k }); sk[kk].n++; if (e.ok) sk[kk].c++;
    });
    return { top: top, sk: sk };
  };
  var level = function (st) { if (!st || st.n < MIN_N) return 'none'; var a = st.c / st.n; if (st.n >= 6 && a >= 0.8) return 'strong'; if (a < 0.6) return 'weak'; return 'mid'; };
  var levelTx = { none: L('Дерек аз', 'Мало данных'), strong: L('Жақсы', 'Хорошо'), mid: L('Орташа', 'Средне'), weak: L('Қайталау керек', 'Нужно повторить') };

  /* ---------------- Журнал и ошибки ---------------- */
  var snap = function (inst) { return { kk: { stem: inst.L.kk.stem, opts: inst.L.kk.opts, e: inst.L.kk.e, whys: inst.L.kk.whys }, ru: { stem: inst.L.ru.stem, opts: inst.L.ru.opts, e: inst.L.ru.e, whys: inst.L.ru.whys } }; };
  var record = function (it, inst, sel, src, title) {
    var ok = sel !== null && sel !== undefined && sel === inst.ans, now = Date.now();
    S.log.push({ ts: now, id: it.id, seed: it.seed, s: inst.s, t: inst.t, k: inst.k, ok: ok, src: src });
    var key = skillKey(inst.s, inst.k);
    S.mistakes.forEach(function (m) {
      if (m.status === 'fixed' || skillKey(m.s, m.k) !== key) return;
      if (m.id === it.id && m.seed === it.seed) return;
      if (ok) {
        m.checks.push({ ts: now, id: it.id });
        var days = {}; m.checks.forEach(function (c) { if (c.ts - m.ts >= 0) days[dayKey(c.ts)] = 1; });
        var later = m.checks.some(function (c) { return dayKey(c.ts) !== dayKey(m.ts); });
        if (m.checks.length >= 2 && Object.keys(days).length >= 2 && later) { m.status = 'fixed'; m.fixedAt = now; }
        else { m.status = 'later'; m.due = now + 2 * DAY; }
      } else if (m.status === 'later') { m.status = 'work'; m.checks = []; m.due = null; }
    });
    if (!ok) {
      S.mistakes.unshift({ mid: NP.uid(), ts: now, test: title, src: src, id: it.id, seed: it.seed, s: inst.s, t: inst.t, k: inst.k, sel: sel === undefined ? null : sel, ans: inst.ans, snap: snap(inst), reason: null, next: null, status: 'new', checks: [], due: null });
    }
    return ok;
  };

  /* ---------------- Маршрутизация ---------------- */
  var route = function () { var h = (location.hash || '#home').slice(1); return h || 'home'; };
  var go = function (h) { if (location.hash === '#' + h) render(); else location.hash = h; };
  window.addEventListener('hashchange', function () { modal = null; render(); window.scrollTo(0, 0); });

  var modal = null; /* in-page подтверждения (confirm() в просмотрщике не работает) */
  var flash = null;
  var ask = function (text, yes, onYes) { modal = { text: text, yes: yes, onYes: onYes }; render(); };

  /* ---------------- Каркас ---------------- */
  var NAV = ['home', 'learn', 'diag', 'exam', 'results', 'mistakes', 'plan'];
  var shell = function (main) {
    var r = route().split('-')[0];
    var nav = NAV.map(function (k) { return '<a href="#' + k + '" class="nav-i' + (r === k || (k === 'exam' && r === 'run' && false) ? ' on' : '') + '"' + (r === k ? ' aria-current="page"' : '') + '>' + esc(t(TX[k])) + '</a>'; }).join('');
    var seg = function (name, val, act) { return '<div class="seg" role="group" aria-label="' + esc(t(name)) + '"><span class="seg-l">' + esc(t(name)) + '</span>' + ['kk', 'ru'].map(function (lg) { return '<button type="button" data-act="' + act + '" data-v="' + lg + '" class="' + (val === lg ? 'on' : '') + '" aria-pressed="' + (val === lg) + '">' + (lg === 'kk' ? 'ҚАЗ' : 'РУС') + '</button>'; }).join('') + '</div>'; };
    return '<header class="top"><div class="top-in"><a class="brand" href="#home"><span class="mark" aria-hidden="true">N</span><span>' + esc(t(TX.brand)) + '</span></a>' +
      '<div class="langs">' + seg(TX.uiLang, S.ui, 'ui') + seg(TX.qLang, S.ql, 'ql') + '</div></div>' +
      '<nav class="nav" aria-label="menu"><div class="nav-in">' + nav + '<a href="#data" class="nav-i' + (r === 'data' ? ' on' : '') + '">' + esc(t(TX.data)) + '</a></div></nav></header>' +
      (storageOk ? '' : '<div class="wrap"><div class="note bad">' + esc(t(TX.noStore)) + '</div></div>') +
      (flash ? '<div class="wrap"><div class="note ok" role="status">' + esc(flash) + '</div></div>' : '') +
      '<main class="wrap" id="main">' + main + '</main>' +
      '<footer class="wrap foot"><p>' + esc(t(TX.disclaim)) + '</p><p>' + esc(t(TX.local)) + '</p></footer>' +
      (modal ? '<div class="modal-bg"><div class="modal" role="dialog" aria-modal="true"><p>' + modal.text + '</p><div class="row"><button class="btn" data-act="modal-no">' + esc(t(TX.cancel)) + '</button><button class="btn pri" data-act="modal-yes">' + esc(modal.yes) + '</button></div></div></div>' : '');
  };

  var card = function (inner, cls) { return '<section class="card ' + (cls || '') + '">' + inner + '</section>'; };
  var h1 = function (s, sub) { return '<div class="ph"><h1>' + s + '</h1>' + (sub ? '<p class="lead">' + sub + '</p>' : '') + '</div>'; };

  /* ---------------- Главная ---------------- */
  var activeList = function () {
    var out = [];
    ['full', 'test', 'practice'].forEach(function (slot) { var s = S.sessions[slot]; if (s && !s.finished) out.push({ slot: slot, s: s }); });
    return out;
  };
  var viewHome = function () {
    var act = activeList(), h = h1(esc(t(L('Сәлем! Бүгін немен айналысамыз?', 'Привет! Чем займёмся сегодня?'))), esc(t(L('Математика мен сандық сипаттамаларға басымдық беріледі. Әр нәтиже тек сіздің шын жауаптарыңызға негізделеді.', 'Главный упор — на математику и количественные характеристики. Все выводы строятся только на ваших реальных ответах.'))));
    if (act.length) h += card('<h2>' + esc(t(L('Аяқталмаған жұмыс', 'Незавершённая работа'))) + '</h2><div class="list">' + act.map(function (a) { var ans = Object.keys(a.s.answers).length; return '<div class="li"><div><b>' + esc(t(a.s.title)) + '</b><div class="muted">' + ans + ' / ' + a.s.items.length + '</div></div><button class="btn pri" data-act="open-run" data-v="' + a.slot + '">' + esc(t(TX.resume)) + '</button></div>'; }).join('') + '</div>');
    if (!S.attempts.length && !S.log.length) {
      h += card('<h2>' + esc(t(L('Әлі нәтиже жоқ', 'Пока нет результатов'))) + '</h2><p>' + esc(t(L('Бастапқы диагностикадан бастаңыз: ол әр бағыт бойынша қай дағдылар жақсы, қайсысын қайталау керек екенін көрсетеді. Оған дейін платформа ешқандай баға немесе «күшті тақырып» көрсетпейді.', 'Начните с исходной диагностики: она покажет, какие навыки в порядке, а какие нужно повторить. До неё платформа не показывает никаких оценок и «сильных тем».'))) + '</p><div class="row wrap-row">' +
        ['math', 'qc', 'sci', 'lang'].map(function (s) { return '<button class="btn ' + (s === 'math' || s === 'qc' ? 'pri' : '') + '" data-act="diag" data-v="' + s + '">' + esc(s === 'lang' ? t(L('Тілдер', 'Языки')) : t(NP.SUBJ[s])) + '</button>'; }).join('') + '</div>', 'hero') + subjCards();
    } else {
      var last = S.attempts[0], st = stats(), open = S.mistakes.filter(function (m) { return m.status !== 'fixed'; }).length;
      var due = S.mistakes.filter(function (m) { return m.status === 'later' && m.due && m.due <= Date.now(); }).length;
      h += '<div class="grid3">' +
        card('<div class="k">' + esc(t(L('Соңғы әрекет', 'Последняя попытка'))) + '</div>' + (last ? '<div class="big">' + last.c + ' / ' + last.n + '</div><div class="muted">' + esc(t(last.title)) + ' · ' + fmtDate(last.ts) + '</div><a href="#attempt-' + last.aid + '">' + esc(t(L('Талдауды ашу', 'Открыть разбор'))) + '</a>' : '<div class="muted">' + esc(t(L('Тек жаттығу жауаптары бар', 'Есть только ответы в практике'))) + '</div>'), 'stat') +
        card('<div class="k">' + esc(t(L('Ашық қателер', 'Открытые ошибки'))) + '</div><div class="big">' + open + '</div><div class="muted">' + esc(t(L('Қайта тексеру уақыты келгені: ', 'Пора перепроверить: '))) + due + '</div><a href="#mistakes">' + esc(t(TX.mistakes)) + '</a>', 'stat') +
        card('<div class="k">' + esc(t(L('Жалпы жауаптар', 'Всего ответов'))) + '</div><div class="big">' + S.log.length + '</div><div class="muted">' + esc(t(TX.acc)) + ': ' + pct(S.log.filter(function (e) { return e.ok; }).length, S.log.length) + '</div><a href="#results">' + esc(t(TX.results)) + '</a>', 'stat') + '</div>';
      h += subjCards();
      h += todayPlanCard();
      var weak = Object.keys(st.top).filter(function (k) { return level(st.top[k]) === 'weak'; });
      h += card('<h2>' + esc(t(L('Қайталауға ұсынылатын тақырыптар', 'Темы, которые стоит повторить'))) + '</h2>' + (weak.length ? '<div class="chips">' + weak.map(function (k) { return '<a class="chip warn" href="#learn-' + k + '">' + esc(t(NP.TOPICS[k].name)) + ' · ' + pct(st.top[k].c, st.top[k].n) + '</a>'; }).join('') + '</div>' : '<p class="muted">' + esc(t(L('Нақты қорытынды жасау үшін бір тақырыпта кемінде 3 жауап керек. Әзірге мұндай әлсіз тақырып табылған жоқ немесе дерек жеткіліксіз.', 'Для вывода по теме нужно хотя бы 3 ответа. Пока слабых тем не найдено или данных недостаточно.'))) + '</p>'));
    }
    h += card('<h2>' + esc(t(L('Ресми формат', 'Официальный формат'))) + '</h2>' + officialShort() + '<p><a href="#exam">' + esc(t(L('Толығырақ және дереккөздер →', 'Подробнее и источники →'))) + '</a></p>');
    return h;
  };
  var subjCards = function () {
    var by = {}; S.log.forEach(function (e) { (by[e.s] = by[e.s] || { n: 0, c: 0 }); by[e.s].n++; if (e.ok) by[e.s].c++; });
    return '<h2 class="sh">' + esc(t(L('Пәндер бойынша', 'По предметам'))) + '</h2><div class="subjs">' + NP.SUBJ_ORDER.map(function (s) {
      var x = by[s], enough = x && x.n >= MIN_N, p = enough ? Math.round(x.c / x.n * 100) : 0;
      var first = NP.TOPIC_ORDER.filter(function (k) { return NP.TOPICS[k].s === s; })[0];
      return '<a class="subj s-' + s + '" href="#learn-' + first + '"><div class="subj-h"><span class="subj-n">' + esc(t(NP.SUBJ[s])) + '</span><span class="subj-p">' + (enough ? p + '%' : '—') + '</span></div><div class="pbar" role="img" aria-label="' + (enough ? p + '%' : esc(t(TX.notEnough))) + '"><i style="width:' + p + '%"></i></div><span class="muted">' + (x ? x.c + ' / ' + x.n + ' · ' : '') + (enough ? esc(t(TX.acc)) : esc(t(TX.notEnough))) + '</span></a>';
    }).join('') + '</div>';
  };
  var todayPlanCard = function () {
    if (!S.plan) return card('<h2>' + esc(t(TX.plan)) + '</h2><p class="muted">' + esc(t(L('Жоспар әлі құрылмаған.', 'План ещё не составлен.'))) + '</p><a class="btn" href="#plan">' + esc(t(L('Жоспар құру', 'Составить план'))) + '</a>');
    var today = dayKey(Date.now()), d = S.plan.days.filter(function (x) { return x.date === today; })[0];
    var tasks = d ? d.tasks : [];
    return card('<h2>' + esc(t(L('Бүгінгі жоспар', 'План на сегодня'))) + '</h2>' + (tasks.length ? '<div class="list">' + tasks.map(taskRow).join('') + '</div>' : '<p class="muted">' + esc(t(L('Бүгінге сабақ жоспарланбаған.', 'На сегодня занятий не запланировано.'))) + '</p>') + '<a href="#plan">' + esc(t(TX.plan)) + ' →</a>');
  };

  /* ---------------- Официальный формат ---------------- */
  var officialShort = function () {
    return '<div class="tblwrap"><table class="qt"><thead><tr><th>' + esc(t(L('Күн', 'День'))) + '</th><th>' + esc(t(L('Бөлім', 'Раздел'))) + '</th><th>' + esc(t(L('Тапсырма', 'Заданий'))) + '</th><th>' + esc(t(L('Уақыт', 'Время'))) + '</th></tr></thead><tbody>' +
      '<tr><td rowspan="3">1</td><td>' + esc(t(NP.SUBJ.math)) + '</td><td>40</td><td>60 ' + esc(t(TX.min)) + '</td></tr><tr><td>' + esc(t(NP.SUBJ.qc)) + '</td><td>60</td><td>30 ' + esc(t(TX.min)) + '</td></tr><tr><td>' + esc(t(NP.SUBJ.sci)) + '</td><td>20</td><td>30 ' + esc(t(TX.min)) + '</td></tr>' +
      '<tr><td>2</td><td>' + esc(t(L('Бірінші тіл, екінші тіл, ағылшын тілі', 'Первый язык, второй язык, английский'))) + '</td><td>20 + 20 + 20</td><td>120 ' + esc(t(TX.min)) + ' ' + esc(t(L('(жалпы)', '(общее)'))) + '</td></tr></tbody></table></div>';
  };
  var officialFull = function () {
    var links = NP.OFFICIAL.links.map(function (l) { return '<li><a href="' + l.url + '" target="_blank" rel="noopener">' + esc(t(l.t)) + '</a></li>'; }).join('');
    var kk = '<p><b>Тексерілген күні: ' + NP.OFFICIAL.checked + '.</b> Дереккөздер — NIS-тің ресми сайты:</p><ul>' + links + '</ul>' +
      '<p><b>Расталғаны.</b> 2027–2028 оқу жылына арналған хабарландыруда кешенді тестілеу 2027 жылғы 26 және 27 наурызда өтеді деп көрсетілген: 1-күні — математика, сандық сипаттамалар, жаратылыстану (120 минут), 2-күні — қазақ, орыс, ағылшын тілдері (120 минут). Бөлімдер бойынша тапсырма саны мен уақыт шектеуі NIS ПӨО-ның 2026–2027 оқу жылына арналған буклетінен алынды (жоғарыдағы кесте). Тексерген күні 2027–2028 жылға арналған жаңа буклет табылмады, сондықтан бұл сандарды NIS-тің жаңа материалдарымен салыстырып отырыңыз.</p>' +
      '<p><b>Бағалау.</b> Буклет бойынша ең жоғары балл: математика — 400, сандық сипаттамалар — 300, жаратылыстану — 200, әр тіл — 200; барлығы 1500. Шекті балл: математика — 140 (35%), сандық сипаттамалар — 120 (40%). Нәтижелерді Cito институты статистикалық және психометриялық талдау арқылы өңдейді: әр тапсырманың үлесі оның қиындығына байланысты. Сондықтан дұрыс жауаптар санын ресми балға ауыстыратын нақты формула жария емес — біз оны ойдан шығармаймыз. Платформа тек дұрыс жауаптар санын және дәлдікті көрсетеді.</p>' +
      '<p><b>Тілдік тест.</b> Буклетте «бірінші тіл» және «екінші тіл» деп көрсетілген (оқыту тіліне байланысты). Мұнда қазақ тілі бірінші болып берілген. Тілдер арасында жеке уақыт шектеуі жоқ — жалпы 120 минут.</p>';
    var ru = '<p><b>Дата проверки: ' + NP.OFFICIAL.checked + '.</b> Источники — официальный сайт NIS:</p><ul>' + links + '</ul>' +
      '<p><b>Что подтверждено.</b> В объявлении на 2027–2028 учебный год указано, что комплексное тестирование пройдёт 26 и 27 марта 2027 года: 1-й день — математика, количественные характеристики, естествознание (120 минут), 2-й день — казахский, русский, английский языки (120 минут). Число заданий и лимиты по разделам взяты из буклета ЦПИ NIS на 2026–2027 учебный год (таблица выше). На дату проверки новый буклет на 2027–2028 год не найден, поэтому сверяйте эти цифры с новыми материалами NIS.</p>' +
      '<p><b>Оценивание.</b> По буклету максимальный балл: математика — 400, количественные характеристики — 300, естествознание — 200, каждый язык — 200; всего 1500. Пороговый балл: математика — 140 (35%), количественные характеристики — 120 (40%). Результаты обрабатывает институт Cito с помощью статистического и психометрического анализа: доля каждого задания зависит от его сложности. Поэтому точной публичной формулы перевода верных ответов в официальный балл нет — мы её не придумываем. Платформа показывает только число верных ответов и точность.</p>' +
      '<p><b>Языковой тест.</b> В буклете разделы названы «первый язык» и «второй язык» (зависит от языка обучения). Здесь казахский идёт первым. Отдельных лимитов на каждый язык нет — общее время 120 минут.</p>';
    return S.ui === 'kk' ? kk : ru;
  };

  /* ---------------- Учиться ---------------- */
  var viewLearn = function () {
    var st = stats(), h = h1(esc(t(TX.learn)), esc(t(L('Әр тақырыпта: қысқа түсіндірме, қадамдап шығарылған мысал, жиі кездесетін қателер және жаттығу. Жауап бермей тұрып шешуі көрсетілмейді.', 'В каждой теме: короткое объяснение, разобранный по шагам пример, частые ошибки и практика. Решение не показывается до вашего ответа.'))));
    NP.SUBJ_ORDER.forEach(function (s) {
      var tps = NP.TOPIC_ORDER.filter(function (k) { return NP.TOPICS[k].s === s; });
      h += '<h2 class="sh s-' + s + '">' + esc(t(NP.SUBJ[s])) + (s === 'math' || s === 'qc' ? ' <span class="pill">' + esc(t(L('басымдық', 'приоритет'))) + '</span>' : '') + '</h2><div class="tiles">' +
        tps.map(function (k) {
          var x = st.top[k], lv = level(x), cnt = NP.TPL.filter(function (tt) { return tt.t === k; }).length;
          return '<a class="tile s-' + s + '" href="#learn-' + k + '"><span class="tn">' + esc(t(NP.TOPICS[k].name)) + '</span><span class="tm">' + cnt + ' ' + esc(t(L('шаблон', 'шаблонов'))) + ' · ' + (x ? x.c + '/' + x.n : '0/0') + '</span><span class="lv lv-' + lv + '">' + esc(t(levelTx[lv])) + '</span></a>';
        }).join('') + '</div>';
    });
    return h;
  };
  var viewTopic = function (k) {
    var tp = NP.TOPICS[k]; if (!tp) return viewLearn();
    S.seen[k] = Date.now(); save();
    var ls = tp.lesson[S.ql] || tp.lesson.kk, st = stats().top[k];
    var h = '<div class="s-' + tp.s + '" style="display:contents">'; h += '<p><a href="#learn">← ' + esc(t(TX.learn)) + '</a></p>' + h1(esc(t(NP.SUBJ[tp.s])) + ': ' + esc(tp.name[S.ql]), '');
    h += card('<h2>' + esc(S.ql === 'kk' ? 'Қысқаша' : 'Коротко') + '</h2><ul class="th">' + ls.th.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>');
    h += card('<h2>' + esc(S.ql === 'kk' ? 'Мысал' : 'Пример') + '</h2><p class="qtext">' + ls.ex.q + '</p><ol class="steps" id="steps">' + ls.ex.steps.map(function (x, i) { return '<li' + (i ? ' hidden' : '') + '>' + x + '</li>'; }).join('') + '<li hidden class="ansline"><b>' + (S.ql === 'kk' ? 'Жауабы: ' : 'Ответ: ') + esc(ls.ex.a) + '</b></li></ol><button class="btn" data-act="step">' + esc(S.ql === 'kk' ? 'Келесі қадам' : 'Следующий шаг') + '</button>');
    h += card('<h2>' + esc(S.ql === 'kk' ? 'Жиі кездесетін қателер' : 'Частые ошибки') + '</h2><ul class="th">' + ls.tr.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>');
    h += card('<h2>' + esc(t(L('Жаттығу', 'Практика'))) + '</h2><p>' + esc(t(L('Әр тапсырмадан кейін түсіндірме мен ықтимал қатенің талдауы шығады. Кеңесті жеке ашуға болады. Қателер журналға автоматты түрде жазылады.', 'После каждого задания — объяснение и разбор возможной ошибки. Подсказку можно открыть отдельно. Ошибки автоматически попадают в журнал.'))) + '</p>' +
      '<p class="muted">' + esc(t(L('Бұл тақырып бойынша: ', 'По этой теме: '))) + (st ? st.c + ' / ' + st.n + ' (' + pct(st.c, st.n) + ')' : esc(t(TX.notEnough))) + (st && st.n < MIN_N ? ' · ' + esc(t(TX.notEnough)) : '') + '</p>' +
      '<div class="row wrap-row"><button class="btn pri" data-act="practice-topic" data-v="' + k + '">' + esc(t(L('Жаттығуды бастау (6 тапсырма)', 'Начать практику (6 заданий)'))) + '</button><button class="btn" data-act="topic-test" data-v="' + k + '">' + esc(t(L('Тақырыптық тест', 'Тематический тест'))) + '</button></div>');
    return h + '</div>';
  };

  /* ---------------- Диагностика ---------------- */
  var viewDiag = function () {
    var h = h1(esc(t(TX.diag)), esc(t(L('Әр бағыт бойынша бастапқы және қайталама тексеріс. Тапсырмалар тақырыптар мен дағдыларға бөлінген. Тест кезінде кеңес пен шешуі жасырын, нәтиже соңында көрсетіледі.', 'Исходная и повторная проверка по каждому направлению. Задания распределены по темам и навыкам. Во время теста подсказки и решения скрыты — всё покажем в конце.'))));
    if (S.sessions.test && !S.sessions.test.finished) h += card('<p>' + esc(t(L('Аяқталмаған тест бар: ', 'Есть незавершённый тест: '))) + '<b>' + esc(t(S.sessions.test.title)) + '</b></p><button class="btn pri" data-act="open-run" data-v="test">' + esc(t(TX.resume)) + '</button>');
    h += '<div class="grid2">' + ['math', 'qc', 'sci', 'lang'].map(function (s) {
      var prev = S.attempts.filter(function (a) { return a.kind === 'diag' && a.sub === s; });
      var n = { math: 30, qc: 18, sci: 10, lang: 12 }[s], mins = { math: 45, qc: 12, sci: 15, lang: 25 }[s];
      var nm = s === 'lang' ? L('Тілдер (қазақ, орыс, ағылшын)', 'Языки (казахский, русский, английский)') : NP.SUBJ[s];
      return '<div class="s-' + (s === 'lang' ? 'kk' : s) + '" style="display:contents">' + card('<h2 class="sh">' + esc(t(nm)) + '</h2><p class="muted">' + n + ' ' + esc(t(TX.items)) + ' · ' + esc(t(L('шамамен', 'примерно'))) + ' ' + mins + ' ' + esc(t(TX.min)) + '</p>' +
        (prev.length ? '<p>' + esc(t(L('Соңғы нәтиже: ', 'Последний результат: '))) + '<b>' + prev[0].c + ' / ' + prev[0].n + '</b> · ' + fmtDate(prev[0].ts) + ' · ' + esc(t(L('әрекет саны: ', 'попыток: '))) + prev.length + '</p><div class="row wrap-row"><a class="btn" href="#attempt-' + prev[0].aid + '">' + esc(t(L('Талдау', 'Разбор'))) + '</a><button class="btn pri" data-act="diag" data-v="' + s + '">' + esc(t(L('Қайта тексеру', 'Повторная проверка'))) + '</button></div>'
          : '<p class="muted">' + esc(t(L('Әлі өтілмеген. Нәтиже жоқ.', 'Ещё не пройдена. Результатов нет.'))) + '</p><button class="btn pri" data-act="diag" data-v="' + s + '">' + esc(t(TX.start)) + '</button>')) + '</div>';
    }).join('') + '</div>';
    return h;
  };

  /* ---------------- Полный тест ---------------- */
  var viewExam = function () {
    var h = h1(esc(t(TX.exam)), esc(t(L('Ресми құрылымға сай екі күн. Оқу режимінде кеңес пен түсіндірме бірден көрсетіледі; емтихан режимінде — тек аяқталғаннан кейін.', 'Два дня по официальной структуре. В учебном режиме подсказки и объяснения сразу; в экзаменационном — только после завершения.'))));
    var a = S.sessions.full;
    if (a && !a.finished) h += card('<p>' + esc(t(L('Аяқталмаған сынақ: ', 'Незавершённый тест: '))) + '<b>' + esc(t(a.title)) + '</b> · ' + esc(a.mode === 'exam' ? t(L('емтихан режимі', 'экзаменационный режим')) : t(L('оқу режимі', 'учебный режим'))) + ' · ' + Object.keys(a.answers).length + ' / ' + a.items.length + '</p><div class="row wrap-row"><button class="btn pri" data-act="open-run" data-v="full">' + esc(t(TX.resume)) + '</button><button class="btn" data-act="drop-full">' + esc(t(L('Тастап, жаңасын бастау', 'Бросить и начать заново'))) + '</button></div>', 'hl');
    h += '<div class="grid2">' + [1, 2].map(function (d) {
      return card('<h2>' + (d === 1 ? esc(t(L('1-күн: қабілетті бағалау тесті', '1-й день: тест на оценку способностей'))) : esc(t(L('2-күн: тілдік тест', '2-й день: языковой тест')))) + '</h2><p class="muted">' + (d === 1 ? '120 ' + esc(t(TX.items)) + ' · 120 ' + esc(t(TX.min)) + ' (60 + 30 + 30)' : '60 ' + esc(t(TX.items)) + ' · 120 ' + esc(t(TX.min))) + '</p>' +
        '<div class="row wrap-row"><button class="btn pri" data-act="exam-start" data-v="' + d + '-exam">' + esc(t(L('Емтихан режимі', 'Экзаменационный режим'))) + '</button><button class="btn" data-act="exam-start" data-v="' + d + '-study">' + esc(t(L('Оқу режимі', 'Учебный режим'))) + '</button></div>');
    }).join('') + '</div>';
    h += card('<h2>' + esc(t(L('Емтихан режимінің ережелері', 'Правила экзаменационного режима'))) + '</h2><ul class="th">' + [
      L('Әр бөлімнің өз таймері бар. Таймер тек сол бөлімнің сұрағы ашық тұрғанда жүреді.', 'У каждого раздела свой таймер. Он идёт только пока открыт вопрос этого раздела.'),
      L('Келесі бөлімге ертерек өтуге болады. Уақыты қалған бөлімге қайта оралуға болады — жұмсалған уақыт сақталады.', 'Можно перейти в следующий раздел раньше. В раздел с оставшимся временем можно вернуться — потраченное время сохраняется.'),
      L('Бөлімнің уақыты біткенде ол құлыпталады: жауаптарды қарауға болады, бірақ өзгертуге болмайды.', 'Когда время раздела истекло, он блокируется: ответы видно, но изменить нельзя.'),
      L('Жауаптар мен уақыт автоматты түрде сақталады. Бет жабық тұрғанда таймер тоқтайды.', 'Ответы и время сохраняются автоматически. Пока страница закрыта, таймер стоит.'),
      L('Сұрақты кейін қайта қарау үшін белгілеуге болады.', 'Вопрос можно отметить, чтобы вернуться к нему позже.'),
      L('Бір әрекетте бірдей тапсырма немесе бір шаблон қайталанбайды. 2-күннің тілдік банкі — бір толық жиынтық (60 сұрақ), сондықтан қайталап өткенде сұрақтар қайталанады.', 'В одной попытке нет одинаковых заданий и повторов одного шаблона. Языковой банк 2-го дня — один полный набор (60 вопросов), поэтому при повторной попытке вопросы повторятся.')
    ].map(function (x) { return '<li>' + esc(t(x)) + '</li>'; }).join('') + '</ul>');
    h += card('<h2>' + esc(t(L('Ресми формат және дереккөздер', 'Официальный формат и источники'))) + '</h2>' + officialShort() + officialFull(), 'official');
    return h;
  };

  /* ---------------- Прохождение ---------------- */
  var curSlot = null, gridOpen = false;
  document.addEventListener('toggle', function (ev) { if (ev.target && ev.target.id === 'qgrid') gridOpen = ev.target.open; }, true);
  var tickTimer = null, lastTick = 0;
  var startTicker = function () {
    stopTicker(); lastTick = Date.now();
    tickTimer = setInterval(function () {
      var ses = S.sessions[curSlot]; if (!ses || ses.finished || route().indexOf('run-') !== 0) return;
      var now = Date.now(), dt = Math.min(now - lastTick, 5000); lastTick = now;
      var si = NP.secIndex(ses, ses.cur), sec = ses.sections[si];
      if (ses.timed) {
        if (!sec.locked) {
          sec.usedMs += dt;
          if (sec.usedMs >= sec.limitMs) { sec.usedMs = sec.limitMs; sec.locked = true; onSectionExpired(ses, si); save(); render(); return; }
        }
      } else { ses.elapsed = (ses.elapsed || 0) + dt; }
      if (Math.floor(now / 1000) % 5 === 0) save();
      var el = document.getElementById('timer'); if (el) el.textContent = timerText(ses);
      var g = document.querySelectorAll('[data-secleft]'); g.forEach(function (x) { var s = ses.sections[+x.getAttribute('data-secleft')]; x.textContent = s.locked ? '0:00' : fmtTime(s.limitMs - s.usedMs); });
    }, 1000);
  };
  var stopTicker = function () { if (tickTimer) clearInterval(tickTimer); tickTimer = null; };
  var timerText = function (ses) {
    if (!ses.timed) return fmtTime(ses.elapsed || 0);
    var sec = ses.sections[NP.secIndex(ses, ses.cur)];
    return sec.locked ? '0:00' : fmtTime(sec.limitMs - sec.usedMs);
  };
  /* Истечение времени раздела — единственный автоматический переход. Вызывается только таймером. */
  var onSectionExpired = function (ses, si) {
    var nxt = -1;
    for (var k = si + 1; k < ses.sections.length; k++) if (!ses.sections[k].locked) { nxt = k; break; }
    if (nxt < 0) for (k = 0; k < ses.sections.length; k++) if (!ses.sections[k].locked) { nxt = k; break; }
    if (nxt >= 0) { ses.cur = ses.sections[nxt].from; flash = t(L('Бөлімнің уақыты бітті. Келесі бөлімге өттіңіз.', 'Время раздела истекло. Вы перешли к следующему разделу.')); }
    else finishSession(curSlot, true);
  };
  /* Навигация строго по одному вопросу. Аргумент — только число; событие клика сюда не передаётся. */
  var move = function (delta) {
    var ses = S.sessions[curSlot]; if (!ses) return;
    var n = ses.cur + (delta > 0 ? 1 : -1);
    if (n < 0 || n >= ses.items.length) return;
    ses.cur = n; flash = null; save(); render();
  };
  var jump = function (i) { var ses = S.sessions[curSlot]; if (!ses || i < 0 || i >= ses.items.length) return; ses.cur = i; flash = null; save(); render(); };

  var optLetter = 'ABCD';
  var viewRun = function (slot) {
    var ses = S.sessions[slot];
    if (!ses) return card('<p>' + esc(t(L('Белсенді тест жоқ.', 'Нет активного теста.'))) + '</p><a class="btn" href="#home">' + esc(t(TX.home)) + '</a>');
    if (ses.finished) { go('attempt-' + ses.aid); return ''; }
    curSlot = slot;
    var i = ses.cur, it = ses.items[i], inst = NP.inst(it), si = NP.secIndex(ses, i), sec = ses.sections[si];
    var lg = inst.fixed === 'kk' || inst.fixed === 'ru' ? inst.fixed : S.ql, Lx = inst.L[lg] || inst.L.kk;
    var helpLg = S.ql; var Lh = inst.L[helpLg];
    var study = ses.mode === 'study', checked = ses.checked[i], sel = ses.answers[i], locked = ses.timed && sec.locked;
    var secName = ses.sections.length > 1 || sec.key === 'lang' ? t(NP.SEC_NAME[sec.key]) : '';
    var langPart = sec.key === 'lang' ? ' · ' + t(NP.SUBJ[inst.s]) : '';
    var h = '<div class="s-' + inst.s + '" style="display:contents">'; h += '<div class="runbar"><div class="rb-l"><div class="rb-t">' + esc(t(ses.title)) + '</div><div class="muted">' + esc(secName + langPart) + (secName ? ' · ' : '') + esc(t(TX.q)) + ' ' + (i + 1) + ' / ' + ses.items.length + '</div></div>' +
      '<div class="rb-r"><div class="timer" aria-live="off"><span class="muted">' + esc(ses.timed ? t(L('Бөлімде қалды', 'Осталось в разделе')) : t(L('Өткен уақыт', 'Прошло'))) + '</span><b id="timer">' + timerText(ses) + '</b></div></div></div>';
    /* сетка вопросов */
    h += '<details class="qgrid" id="qgrid"' + (gridOpen ? ' open' : '') + '><summary>' + esc(t(L('Сұрақтар картасы', 'Карта вопросов'))) + ' (' + Object.keys(ses.answers).length + ' / ' + ses.items.length + ')</summary>' +
      ses.sections.map(function (s, k) {
        var head = ses.sections.length > 1 || s.key === 'lang' ? '<div class="qg-h"><b>' + esc(t(NP.SEC_NAME[s.key])) + '</b>' + (ses.timed ? ' <span class="muted">' + (s.locked ? esc(t(L('уақыт бітті', 'время вышло'))) : '<span data-secleft="' + k + '">' + fmtTime(s.limitMs - s.usedMs) + '</span>') + '</span>' : '') + '</div>' : '';
        var btns = ''; for (var j = s.from; j <= s.to; j++) {
          var cls = 'qn' + (j === i ? ' cur' : '') + (ses.answers[j] !== undefined ? ' ans' : '') + (ses.flags[j] ? ' flg' : '') + (study && ses.checked[j] ? (ses.answers[j] === NP.inst(ses.items[j]).ans ? ' ok' : ' bad') : '') + (ses.timed && s.locked ? ' lck' : '');
          btns += '<button type="button" class="' + cls + '" data-act="jump" data-v="' + j + '" aria-label="' + (j + 1) + '">' + (j + 1) + '</button>';
        }
        return head + '<div class="qg-b">' + btns + '</div>';
      }).join('') + '</details>';
    /* вопрос */
    var note = inst.fixed === 'kk' ? TX.fixedKk : inst.fixed === 'ru' ? TX.fixedRu : inst.fixed === 'en' ? TX.fixedEn : null;
    h += '<article class="qcard"><div class="qmeta"><span class="pill">' + esc(t(NP.SUBJ[inst.s])) + '</span><span class="pill">' + esc(t(NP.TOPICS[inst.t].name)) + '</span><span class="pill soft">' + esc(t(NP.SKILL[inst.k])) + '</span><span class="pill soft">' + esc(t(L('Қиындық', 'Сложность'))) + ': ' + inst.d + '/3</span><span class="muted sm">' + esc(t(TX.author)) + '</span></div>' +
      (note ? '<p class="note sm">' + esc(t(note)) + '</p>' : '') +
      (inst.type === 'qc' && i === sec.from ? '<p class="note sm">' + esc(lg === 'kk' ? 'А бағаны мен В бағанындағы шамаларды салыстырыңыз. A — А үлкен, B — В үлкен, C — тең, D — ақпарат жеткіліксіз.' : 'Сравните величины в колонках А и В. A — больше А, B — больше В, C — равны, D — недостаточно информации.') + '</p>' : '') +
      '<div class="stem" lang="' + (inst.fixed || lg) + '">' + Lx.stem + '</div>';
    if (locked) h += '<p class="note bad">' + esc(t(TX.timeUp)) + '</p>';
    h += '<div class="opts" role="radiogroup">' + Lx.opts.map(function (o, k) {
      var cls = 'opt' + (sel === k ? ' sel' : '');
      if (study && checked) { if (k === inst.ans) cls += ' right'; else if (k === sel) cls += ' wrongpick'; }
      var dis = locked || (study && checked);
      return '<button type="button" class="' + cls + '" data-act="pick" data-v="' + k + '" role="radio" aria-checked="' + (sel === k) + '"' + (dis ? ' disabled' : '') + '><span class="lt">' + optLetter[k] + '</span><span class="ot" lang="' + (inst.fixed || lg) + '">' + o + '</span></button>';
    }).join('') + '</div>';
    if (study) {
      if (!checked) {
        h += '<div class="row wrap-row"><button class="btn pri" data-act="check"' + (sel === undefined ? ' disabled' : '') + '>' + esc(t(TX.check)) + '</button>' + (ses.hints[i] ? '' : '<button class="btn" data-act="hint">' + esc(t(TX.hint)) + '</button>') + '</div>';
        if (ses.hints[i]) h += '<div class="note hint"><b>' + esc(t(TX.hint)) + ':</b> ' + Lh.h + '</div>';
      } else h += feedback(inst, sel, helpLg, ses.kind === 'practice');
    }
    h += '</article>';
    /* панель навигации */
    h += '<div class="navbar"><button class="btn" data-act="prev"' + (i === 0 ? ' disabled' : '') + '>← ' + esc(t(TX.back)) + '</button>' +
      (ses.mode === 'exam' ? '<button class="btn ' + (ses.flags[i] ? 'gold' : '') + '" data-act="flag" aria-pressed="' + !!ses.flags[i] + '">⚑ ' + esc(t(ses.flags[i] ? TX.flagged : TX.flag)) + '</button>' : '<span></span>') +
      '<button class="btn pri" data-act="next"' + (i === ses.items.length - 1 ? ' disabled' : '') + '>' + esc(t(TX.next)) + ' →</button></div>';
    h += '<div class="row wrap-row endrow">' + (ses.timed && !sec.locked && ses.sections.length > 1 ? '<button class="btn" data-act="end-sec">' + esc(t(L('Бөлімді аяқтау', 'Завершить раздел'))) + '</button>' : '') +
      '<button class="btn danger" data-act="finish">' + esc(t(L('Тестті аяқтау', 'Завершить тест'))) + '</button><a class="btn ghost" href="#home">' + esc(t(L('Кейін жалғастыру', 'Продолжить позже'))) + '</a></div>';
    return h;
  };
  var feedback = function (inst, sel, lg, canSimilar) {
    var Lx = inst.L[lg], ok = sel === inst.ans, h = '<div class="fb ' + (ok ? 'good' : 'badc') + '"><div class="fb-h">' + esc(t(ok ? TX.correct : TX.wrong)) + '</div>';
    if (!ok) h += '<p><b>' + esc(t(TX.answer)) + ':</b> ' + optLetter[inst.ans] + ') ' + Lx.opts[inst.ans] + '</p>';
    h += '<p><b>' + esc(t(TX.expl)) + ':</b> ' + Lx.e + '</p>';
    if (!ok && sel !== undefined && Lx.whys[sel]) h += '<p><b>' + esc(t(TX.whyWrong)) + ' (' + optLetter[sel] + '):</b> ' + Lx.whys[sel] + '</p>';
    if (ok) { var k = Lx.whys.findIndex(function (w, j) { return j !== inst.ans && w; }); if (k >= 0) h += '<p><b>' + esc(t(TX.trap)) + ' (' + optLetter[k] + '):</b> ' + Lx.whys[k] + '</p>'; }
    if (canSimilar) h += '<button class="btn" data-act="similar">+ ' + esc(t(TX.similar)) + '</button>';
    return h + '</div>';
  };

  /* ---------------- Запуск и завершение ---------------- */
  var startSession = function (slot, ses) {
    var cur = S.sessions[slot];
    var doit = function () { S.sessions[slot] = ses; save(); go('run-' + slot); };
    if (cur && !cur.finished && Object.keys(cur.answers).length) ask(esc(t(L('Аяқталмаған «', 'Незавершённый «'))) + esc(t(cur.title)) + esc(t(L('» тесті жабылады, жауаптары сақталмайды. Жалғастыру керек пе?', '» будет закрыт без сохранения результата. Продолжить?'))), t(L('Иә, жаңасын бастау', 'Да, начать новый')), doit);
    else doit();
  };
  var finishSession = function (slot, auto) {
    var ses = S.sessions[slot]; if (!ses || ses.finished) return;
    var sc = NP.score(ses), aid = NP.uid();
    if (ses.kind !== 'practice') {
      ses.items.forEach(function (it, i) { if (!(ses.mode === 'study' && ses.checked[i])) record(it, NP.inst(it), ses.answers[i] === undefined ? null : ses.answers[i], ses.kind, ses.title); });
    }
    var dur = ses.timed ? ses.sections.reduce(function (a, s) { return a + s.usedMs; }, 0) : (ses.elapsed || 0);
    S.attempts.unshift({ aid: aid, kind: ses.kind, sub: ses.sub, title: ses.title, mode: ses.mode, ts: Date.now(), dur: dur, sections: sc.sections, items: sc.items, c: sc.c, n: sc.n, flags: ses.flags, auto: !!auto });
    ses.finished = Date.now(); ses.aid = aid; S.sessions[slot] = null;
    save(); stopTicker(); go('attempt-' + aid);
  };

  /* ---------------- Разбор попытки ---------------- */
  var viewAttempt = function (aid) {
    var a = S.attempts.filter(function (x) { return x.aid === aid; })[0];
    if (!a) return card('<p>' + esc(t(L('Әрекет табылмады.', 'Попытка не найдена.'))) + '</p>');
    var h = h1(esc(t(a.title)), fmtDate(a.ts) + ' · ' + esc(a.mode === 'exam' ? t(L('тест режимі', 'режим теста')) : t(L('оқу режимі', 'учебный режим'))) + (a.dur ? ' · ' + fmtTime(a.dur) : ''));
    h += '<p class="note">' + esc(t(TX.disclaim)) + '</p>';
    h += '<div class="grid3">' + a.sections.map(function (s) { return card('<div class="k">' + esc(t(NP.SEC_NAME[s.key])) + '</div><div class="big">' + s.c + ' / ' + s.n + '</div><div class="muted">' + esc(t(TX.acc)) + ': ' + pct(s.c, s.n) + '</div>', 'stat'); }).join('') + '</div>';
    if (a.kind === 'exam2') {
      h += card('<h2>' + esc(t(L('Тілдер бойынша', 'По языкам'))) + '</h2>' + NP.table([esc(t(L('Тіл', 'Язык'))), esc(t(TX.c)), esc(t(TX.n)), esc(t(TX.acc))], ['kk', 'ru', 'en'].map(function (lg) { var xs = a.items.filter(function (x) { return x.s === lg; }), c = xs.filter(function (x) { return x.ok; }).length; return [esc(t(NP.SUBJ[lg])), c, xs.length, pct(c, xs.length)]; })));
    }
    /* навыки в этой попытке */
    var by = {}; a.items.forEach(function (x) { var k = x.s + ':' + x.k; (by[k] = by[k] || { n: 0, c: 0, s: x.s, k: x.k, t: x.t }); by[k].n++; if (x.ok) by[k].c++; });
    var rows = Object.keys(by).map(function (k) { var b = by[k]; return [esc(t(NP.SUBJ[b.s])), esc(t(NP.SKILL[b.k] || L(b.k, b.k))), b.c + ' / ' + b.n, b.n < MIN_N ? '<span class="muted">' + esc(t(TX.notEnough)) + '</span>' : pct(b.c, b.n)]; });
    h += card('<h2>' + esc(t(L('Дағдылар бойынша дәлдік (осы әрекет)', 'Точность по навыкам (эта попытка)'))) + '</h2><p class="muted sm">' + esc(t(L('3-тен аз тапсырма болса, қорытынды жасалмайды.', 'Если заданий меньше 3, вывод не делается.'))) + '</p>' + NP.table([esc(t(L('Пән', 'Предмет'))), esc(t(L('Дағды', 'Навык'))), esc(t(TX.c)), esc(t(TX.acc))], rows));
    var wrongTopics = {}; a.items.forEach(function (x) { if (!x.ok) wrongTopics[x.t] = (wrongTopics[x.t] || 0) + 1; });
    var wt = Object.keys(wrongTopics).sort(function (p, q) { return wrongTopics[q] - wrongTopics[p]; });
    if (wt.length) h += card('<h2>' + esc(t(L('Қайталауға арналған тақырыптар', 'Темы для повторения'))) + '</h2><div class="chips">' + wt.map(function (k) { return '<a class="chip" href="#learn-' + k + '">' + esc(t(NP.TOPICS[k].name)) + ' · ' + wrongTopics[k] + ' ' + esc(t(L('қате', 'ош.'))) + '</a>'; }).join('') + '</div>');
    /* список вопросов */
    var only = window.__onlyWrong;
    h += card('<h2>' + esc(t(L('Сұрақтарды талдау', 'Разбор вопросов'))) + '</h2><label class="chk"><input type="checkbox" id="onlywrong" data-act="onlywrong"' + (only ? ' checked' : '') + '> ' + esc(t(L('Тек қателер', 'Только ошибки'))) + '</label><div class="rev">' +
      a.items.map(function (x, i) {
        if (only && x.ok) return '';
        var inst = NP.build(x.id, x.seed), lg = inst.fixed === 'kk' || inst.fixed === 'ru' ? inst.fixed : S.ql, Lx = inst.L[lg], Lh = inst.L[S.ql];
        return '<details class="ri ' + (x.ok ? 'okc' : 'badc') + '"><summary><span class="rn">' + (i + 1) + '</span> ' + (x.ok ? '✓' : '✗') + ' <span class="muted">' + esc(t(NP.TOPICS[x.t].name)) + '</span>' + (a.flags && a.flags[i] ? ' ⚑' : '') + '</summary><div class="stem">' + Lx.stem + '</div><p><b>' + esc(t(TX.yours)) + ':</b> ' + (x.sel === null ? esc(t(TX.noAns)) : optLetter[x.sel] + ') ' + Lx.opts[x.sel]) + '</p><p><b>' + esc(t(TX.answer)) + ':</b> ' + optLetter[x.ans] + ') ' + Lx.opts[x.ans] + '</p><p><b>' + esc(t(TX.expl)) + ':</b> ' + Lh.e + '</p>' + (x.sel !== null && !x.ok && Lh.whys[x.sel] ? '<p><b>' + esc(t(TX.whyWrong)) + ':</b> ' + Lh.whys[x.sel] + '</p>' : '') + '</details>';
      }).join('') + '</div>');
    h += '<div class="row wrap-row"><a class="btn pri" href="#mistakes">' + esc(t(TX.mistakes)) + '</a><a class="btn" href="#results">' + esc(t(TX.results)) + '</a></div>';
    return h;
  };

  /* ---------------- Результаты ---------------- */
  var kindName = function (a) { return t(a.title); };
  var viewResults = function () {
    var h = h1(esc(t(TX.results)), esc(t(L('Тек сіздің нақты жауаптарыңыз негізінде. Салыстыру тек бірдей форматтағы әрекеттер арасында жасалады.', 'Только по вашим реальным ответам. Сравниваются только попытки одного формата.'))));
    if (!S.attempts.length && !S.log.length) return h + card('<h2>' + esc(t(L('Әлі нәтиже жоқ', 'Пока нет результатов'))) + '</h2><p>' + esc(t(L('Диагностикадан бастаңыз — сонда осы жерде нәтижелер мен динамика пайда болады.', 'Начните с диагностики — тогда здесь появятся результаты и динамика.'))) + '</p><a class="btn pri" href="#diag">' + esc(t(TX.diag)) + '</a>', 'hero');
    h += '<p class="note">' + esc(t(TX.disclaim)) + '</p>';
    /* попытки */
    if (S.attempts.length) h += card('<h2>' + esc(t(L('Әрекеттер', 'Попытки'))) + '</h2>' + NP.table([esc(t(TX.date)), esc(t(TX.test)), esc(t(L('Бөлімдер', 'Разделы'))), esc(t(L('Барлығы', 'Всего'))), ''], S.attempts.map(function (a) {
      return [fmtDate(a.ts), esc(kindName(a)) + (a.mode === 'study' ? ' <span class="muted sm">(' + esc(t(L('оқу', 'учебный'))) + ')</span>' : ''), a.sections.map(function (s) { return (a.sections.length > 1 ? esc(t(NP.SEC_NAME[s.key])) + ': ' : '') + s.c + '/' + s.n; }).join('<br>'), a.c + '/' + a.n + ' (' + pct(a.c, a.n) + ')', '<a href="#attempt-' + a.aid + '">' + esc(t(L('Талдау', 'Разбор'))) + '</a>'];
    })));
    /* динамика по сопоставимым попыткам */
    var groups = {}; S.attempts.forEach(function (a) { if (a.kind === 'practice') return; var g = a.kind + '|' + a.sub + '|' + a.mode; (groups[g] = groups[g] || []).push(a); });
    var dyn = Object.keys(groups).filter(function (g) { return groups[g].length >= 2; }).map(function (g) {
      var arr = groups[g], last = arr[0], first = arr[arr.length - 1];
      var tp = function (a) { var m = {}; a.items.forEach(function (x) { (m[x.t] = m[x.t] || { n: 0, c: 0 }); m[x.t].n++; if (x.ok) m[x.t].c++; }); return m; };
      var A = tp(first), B = tp(last), better = [], worse = [];
      Object.keys(B).forEach(function (k) { if (A[k] && A[k].n >= MIN_N && B[k].n >= MIN_N) { var d = B[k].c / B[k].n - A[k].c / A[k].n; if (d >= 0.15) better.push(k); if (d <= -0.15) worse.push(k); } });
      return '<div class="dyn"><b>' + esc(t(last.title)) + (last.mode === 'study' ? ' (' + esc(t(L('оқу', 'учебный'))) + ')' : '') + '</b><div class="muted sm">' + esc(t(L('Негізгі әрекеттер саны: ', 'Число попыток: '))) + arr.length + ' · ' + fmtDate(first.ts) + ' → ' + fmtDate(last.ts) + '</div><p>' + pct(first.c, first.n) + ' → ' + pct(last.c, last.n) + '</p>' +
        (better.length ? '<p>' + esc(t(L('Жақсарған тақырыптар: ', 'Стало лучше: '))) + better.map(function (k) { return esc(t(NP.TOPICS[k].name)); }).join(', ') + '</p>' : '') + (worse.length ? '<p>' + esc(t(L('Нашарлаған тақырыптар: ', 'Стало хуже: '))) + worse.map(function (k) { return esc(t(NP.TOPICS[k].name)); }).join(', ') + '</p>' : '') +
        (!better.length && !worse.length ? '<p class="muted sm">' + esc(t(L('Тақырыптар бойынша айқын өзгеріс жоқ немесе дерек аз (әр тақырыпта кемінде 3 тапсырма керек).', 'Явных изменений по темам нет или мало данных (нужно хотя бы 3 задания по теме в каждой попытке).'))) + '</p>' : '') + '</div>';
    });
    h += card('<h2>' + esc(t(L('Динамика', 'Динамика'))) + '</h2>' + (dyn.length ? dyn.join('') : '<p class="muted">' + esc(t(L('Динамиканы көрсету үшін бір форматтағы кемінде екі әрекет керек (мысалы, математикадан екі диагностика).', 'Для динамики нужны минимум две попытки одного формата (например, две диагностики по математике).'))) + '</p>'));
    /* навыки и темы — все ответы */
    var st = stats();
    NP.SUBJ_ORDER.forEach(function (s) {
      var tps = NP.TOPIC_ORDER.filter(function (k) { return NP.TOPICS[k].s === s && st.top[k]; });
      if (!tps.length) return;
      var rows = [];
      tps.forEach(function (k) {
        var x = st.top[k]; rows.push(['<b>' + esc(t(NP.TOPICS[k].name)) + '</b>', x.c + ' / ' + x.n, x.n < MIN_N ? '<span class="muted">' + esc(t(TX.notEnough)) + '</span>' : pct(x.c, x.n), '<span class="lv lv-' + level(x) + '">' + esc(t(levelTx[level(x)])) + '</span>']);
        Object.keys(st.sk).filter(function (q) { return st.sk[q].t === k; }).forEach(function (q) { var y = st.sk[q]; rows.push(['<span class="ind">' + esc(t(NP.SKILL[y.k] || L(y.k, y.k))) + '</span>', y.c + ' / ' + y.n, y.n < MIN_N ? '<span class="muted">' + esc(t(TX.notEnough)) + '</span>' : pct(y.c, y.n), '']); });
      });
      h += card('<h2>' + esc(t(NP.SUBJ[s])) + '</h2>' + NP.table([esc(t(L('Тақырып / дағды', 'Тема / навык'))), esc(t(TX.c)), esc(t(TX.acc)), ''], rows));
    });
    /* повторяющиеся ошибки */
    var rep = {}; S.mistakes.forEach(function (m) { var k = m.s + ':' + m.k; (rep[k] = rep[k] || { n: 0, open: 0, s: m.s, k: m.k, t: m.t }); rep[k].n++; if (m.status !== 'fixed') rep[k].open++; });
    var rk = Object.keys(rep).filter(function (k) { return rep[k].n >= 2; }).sort(function (a, b) { return rep[b].n - rep[a].n; });
    h += card('<h2>' + esc(t(L('Қайталанатын қателер', 'Повторяющиеся ошибки'))) + '</h2>' + (rk.length ? NP.table([esc(t(L('Дағды', 'Навык'))), esc(t(L('Қате саны', 'Ошибок'))), esc(t(L('Ашық', 'Открыто'))), ''], rk.map(function (k) { var x = rep[k]; return [esc(t(NP.SUBJ[x.s])) + ': ' + esc(t(NP.SKILL[x.k] || L(x.k, x.k))), x.n, x.open, '<a href="#learn-' + x.t + '">' + esc(t(TX.learn)) + '</a>']; })) : '<p class="muted">' + esc(t(L('Бір дағдыда екі және одан көп қате әзірге жоқ.', 'Пока нет навыков с двумя и более ошибками.'))) + '</p>'));
    return h;
  };

  /* ---------------- Журнал ошибок ---------------- */
  var REASONS = { topic: L('Тақырыпты түсінбедім', 'Не понял тему'), read: L('Шартты мұқият оқымадым', 'Невнимательно прочитал'), calc: L('Есептеуде қателестім', 'Ошибка в вычислении'), time: L('Уақыт жетпеді', 'Не хватило времени'), guess: L('Болжап жауап бердім', 'Угадал'), other: L('Басқа', 'Другое') };
  var NEXT = { lesson: L('Сабақты қайталау', 'Повторить урок'), review: L('Талдауды ашу', 'Открыть разбор'), series: L('Ұқсас тапсырмалар сериясы', 'Серия похожих заданий') };
  var STATUS = { 'new': L('Жаңа', 'Новая'), work: L('Жұмыста', 'В работе'), later: L('Кейін қайталау', 'Повторить позже'), fixed: L('Түзетілді', 'Исправлена') };
  var mf = { st: 'open', s: 'all' };
  var viewMistakes = function () {
    var h = h1(esc(t(TX.mistakes)), esc(t(L('Әр қате автоматты түрде жазылады. Себебін таңдап, келесі қадамды орындаңыз. Қате бір дұрыс жауаптан кейін түзетілді деп белгіленбейді: осы дағды бойынша басқа тапсырмаларға кемінде екі түрлі күні дұрыс жауап беру керек.', 'Каждая ошибка записывается автоматически. Выберите причину и выполните следующий шаг. Ошибка не считается исправленной после одного верного ответа: нужно верно решить другие задания этого навыка как минимум в два разных дня.'))));
    if (!S.mistakes.length) return h + card('<p>' + esc(t(L('Әзірге қате жоқ. Олар жаттығу, диагностика немесе сынақтан кейін осында пайда болады.', 'Пока ошибок нет. Они появятся здесь после практики, диагностики или теста.'))) + '</p>');
    var subs = {}; S.mistakes.forEach(function (m) { subs[m.s] = 1; });
    h += '<div class="filters"><label>' + esc(t(L('Мәртебе', 'Статус'))) + ' <select data-act="mf-st"><option value="open"' + (mf.st === 'open' ? ' selected' : '') + '>' + esc(t(L('Ашық', 'Открытые'))) + '</option><option value="all"' + (mf.st === 'all' ? ' selected' : '') + '>' + esc(t(L('Барлығы', 'Все'))) + '</option>' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (mf.st === k ? ' selected' : '') + '>' + esc(t(STATUS[k])) + '</option>'; }).join('') + '</select></label>' +
      '<label>' + esc(t(L('Пән', 'Предмет'))) + ' <select data-act="mf-s"><option value="all">' + esc(t(L('Барлығы', 'Все'))) + '</option>' + Object.keys(subs).map(function (k) { return '<option value="' + k + '"' + (mf.s === k ? ' selected' : '') + '>' + esc(t(NP.SUBJ[k])) + '</option>'; }).join('') + '</select></label></div>';
    var list = S.mistakes.filter(function (m) { return (mf.st === 'all' || (mf.st === 'open' ? m.status !== 'fixed' : m.status === mf.st)) && (mf.s === 'all' || m.s === mf.s); });
    h += '<p class="muted">' + list.length + ' / ' + S.mistakes.length + '</p>';
    h += list.slice(0, 60).map(function (m) {
      var lg = (m.s === 'kk' || m.s === 'ru') ? m.s : S.ql, sn = m.snap[lg], sh = m.snap[S.ql];
      var dueTx = m.status === 'later' && m.due ? ' · ' + esc(t(L('Келесі тексеріс: ', 'Следующая проверка: '))) + fmtDate(m.due) : '';
      return '<details class="mcard st-' + m.status + '"><summary><span class="pill st">' + esc(t(STATUS[m.status])) + '</span> <b>' + esc(t(NP.TOPICS[m.t].name)) + '</b> <span class="muted sm">· ' + esc(t(NP.SKILL[m.k] || L(m.k, m.k))) + ' · ' + fmtDate(m.ts) + '</span></summary>' +
        '<p class="muted sm">' + esc(t(m.test)) + ' · ' + esc(t(NP.SUBJ[m.s])) + ' · ' + esc(t(L('Тексерістер: ', 'Проверок: '))) + m.checks.length + dueTx + '</p>' +
        '<div class="stem">' + sn.stem + '</div><p><b>' + esc(t(TX.yours)) + ':</b> ' + (m.sel === null ? esc(t(TX.noAns)) : optLetter[m.sel] + ') ' + sn.opts[m.sel]) + '</p><p><b>' + esc(t(TX.answer)) + ':</b> ' + optLetter[m.ans] + ') ' + sn.opts[m.ans] + '</p><p><b>' + esc(t(TX.expl)) + ':</b> ' + sh.e + '</p>' + (m.sel !== null && sh.whys[m.sel] ? '<p><b>' + esc(t(TX.whyWrong)) + ':</b> ' + sh.whys[m.sel] + '</p>' : '') +
        '<div class="mrow"><label>' + esc(t(L('Себебі', 'Причина'))) + ' <select data-act="m-reason" data-v="' + m.mid + '"><option value="">—</option>' + Object.keys(REASONS).map(function (k) { return '<option value="' + k + '"' + (m.reason === k ? ' selected' : '') + '>' + esc(t(REASONS[k])) + '</option>'; }).join('') + '</select></label>' +
        '<label>' + esc(t(L('Келесі қадам', 'Следующий шаг'))) + ' <select data-act="m-next" data-v="' + m.mid + '"><option value="">—</option>' + Object.keys(NEXT).map(function (k) { return '<option value="' + k + '"' + (m.next === k ? ' selected' : '') + '>' + esc(t(NEXT[k])) + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="row wrap-row"><a class="btn" href="#learn-' + m.t + '">' + esc(t(NEXT.lesson)) + '</a><button class="btn pri" data-act="m-series" data-v="' + m.mid + '">' + esc(t(NEXT.series)) + '</button>' + (m.status === 'new' ? '<button class="btn ghost" data-act="m-work" data-v="' + m.mid + '">' + esc(t(L('Жұмысқа алу', 'Взять в работу'))) + '</button>' : '') + '</div></details>';
    }).join('');
    if (list.length > 60) h += '<p class="muted">' + esc(t(L('Алғашқы 60 қате көрсетілді. Сүзгіні қолданыңыз.', 'Показаны первые 60 ошибок. Используйте фильтр.'))) + '</p>';
    return h;
  };

  /* ---------------- Недельный план ---------------- */
  var W = { math: 1.3, qc: 1.3, sci: 1, kk: 0.9, ru: 0.9, en: 0.9 };
  var mondayOf = function (ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); var wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return d.getTime(); };
  var buildPlan = function (sessions, minutes) {
    var st = stats(), cand = [], diagDone = {};
    S.attempts.forEach(function (a) { if (a.kind === 'diag') diagDone[a.sub] = 1; if (a.kind === 'exam1') { diagDone.math = diagDone.qc = diagDone.sci = 1; } if (a.kind === 'exam2') diagDone.lang = 1; });
    ['math', 'qc', 'sci', 'lang'].forEach(function (s, i) { if (!diagDone[s]) cand.push({ kind: 'diag', sub: s, p: 10 - i, why: L('Бұл бағыт бойынша әлі дерек жоқ — алдымен диагностика.', 'По этому направлению ещё нет данных — сначала диагностика.') }); });
    var openM = {}; S.mistakes.forEach(function (m) { if (m.status !== 'fixed') openM[m.t] = (openM[m.t] || 0) + 1; });
    NP.TOPIC_ORDER.forEach(function (k) {
      var tp = NP.TOPICS[k], x = st.top[k], w = W[tp.s], subDone = tp.s === 'kk' || tp.s === 'ru' || tp.s === 'en' ? diagDone.lang : diagDone[tp.s];
      if (x && x.n >= MIN_N) {
        var a = x.c / x.n;
        if (a < 0.7) {
          cand.push({ kind: 'lesson', topic: k, p: (1 - a) * w * 5 + (openM[k] || 0) * 0.3, why: L('Расталған олқылық: ' + x.n + ' тапсырманың ' + x.c + '-і дұрыс (' + pct(x.c, x.n) + ').', 'Подтверждённый пробел: верно ' + x.c + ' из ' + x.n + ' (' + pct(x.c, x.n) + ').') });
          cand.push({ kind: 'practice', topic: k, p: (1 - a) * w * 4.5, why: L('Сабақтан кейін дағдыны бекіту.', 'Закрепить навык после урока.') });
        } else if (a >= 0.85 && x.n >= 6) {
          if (tp.s === 'math' || tp.s === 'qc') cand.push({ kind: 'practice', topic: k, p: 0.4, maintain: true, why: L('Жақсы меңгерілген (' + pct(x.c, x.n) + '). Аптасына бір рет қолдау жеткілікті.', 'Хорошо освоено (' + pct(x.c, x.n) + '). Достаточно одного поддерживающего занятия в неделю.') });
        } else cand.push({ kind: 'practice', topic: k, p: (1 - a) * w * 2.5 + 0.5, why: L('Орташа нәтиже: ' + pct(x.c, x.n) + ' (' + x.n + ' тапсырма). Бекіту керек.', 'Средний результат: ' + pct(x.c, x.n) + ' (' + x.n + ' заданий). Нужно закрепить.') });
      } else if (subDone) {
        cand.push({ kind: 'lesson', topic: k, p: 0.9 * w, why: L('Бұл тақырып бойынша дерек аз (' + (x ? x.n : 0) + ' тапсырма). Сабақ пен жаттығу нақты бағаны береді.', 'По этой теме мало данных (' + (x ? x.n : 0) + ' заданий). Урок и практика дадут точную картину.') });
      }
      if (openM[k]) cand.push({ kind: 'mistakes', topic: k, p: 1 + openM[k] * 0.4, why: L('Ашық қателер: ' + openM[k] + '. Себебін белгілеп, ұқсас тапсырмаларды шешіңіз.', 'Открытых ошибок: ' + openM[k] + '. Отметьте причину и решите похожие задания.') });
    });
    cand.sort(function (a, b) { return b.p - a.p; });
    var per = Math.max(1, Math.round(minutes / 15)), maint = 0, used = {}, tasks = [];
    cand.forEach(function (c) {
      if (c.maintain) { if (maint >= 1) return; maint++; }
      var key = c.kind + (c.topic || c.sub); if (used[key]) return; used[key] = 1; tasks.push(c);
    });
    var start = mondayOf(Date.now()), today0 = new Date(); today0.setHours(0, 0, 0, 0);
    var days = [], d0 = Math.max(start, today0.getTime());
    for (var i = 0; i < sessions; i++) days.push({ date: dayKey(d0 + i * DAY), tasks: [] });
    var slots = sessions * per - 1, chosen = tasks.slice(0, Math.max(0, slots)), ti = 0;
    days.forEach(function (d, di) {
      var cap = di === days.length - 1 ? per - 1 : per;
      for (var j = 0; j < cap && ti < chosen.length; j++) { var c = chosen[ti++]; d.tasks.push({ tid: NP.uid(), kind: c.kind, topic: c.topic || null, sub: c.sub || null, why: c.why, done: false }); }
    });
    var weekTopics = chosen.filter(function (c) { return c.topic; }).map(function (c) { return c.topic; });
    days[days.length - 1].tasks.push({ tid: NP.uid(), kind: 'check', topics: weekTopics.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 6), why: L('Апта соңында осы аптада оқылған дағдылар бойынша қысқа тексеріс.', 'В конце недели — короткий срез по навыкам, изученным за неделю.'), done: false });
    return { created: Date.now(), sessions: sessions, minutes: minutes, days: days, prelim: S.attempts.filter(function (a) { return a.kind !== 'practice'; }).length < 2 || S.log.length < 30 };
  };
  var taskTitle = function (tk) {
    if (tk.kind === 'diag') return t(L('Диагностика: ', 'Диагностика: ')) + (tk.sub === 'lang' ? t(L('тілдер', 'языки')) : t(NP.SUBJ[tk.sub]));
    if (tk.kind === 'check') return t(L('Апталық қысқа тексеріс', 'Недельный срез'));
    var nm = t(NP.TOPICS[tk.topic].name);
    return { lesson: t(L('Сабақ: ', 'Урок: ')), practice: t(L('Жаттығу: ', 'Практика: ')), mistakes: t(L('Қателермен жұмыс: ', 'Работа над ошибками: ')) }[tk.kind] + nm;
  };
  var taskRow = function (tk) {
    return '<div class="li task' + (tk.done ? ' done' : '') + '"><label class="chk"><input type="checkbox" data-act="t-done" data-v="' + tk.tid + '"' + (tk.done ? ' checked' : '') + '> <span><b>' + esc(taskTitle(tk)) + '</b><br><span class="muted sm">' + esc(t(tk.why)) + '</span></span></label><div class="row"><button class="btn sm" data-act="t-go" data-v="' + tk.tid + '">' + esc(t(TX.start)) + '</button>' + (tk.done ? '' : '<button class="btn sm ghost" data-act="t-move" data-v="' + tk.tid + '">' + esc(t(L('Ертеңге', 'На завтра'))) + '</button>') + '</div></div>';
  };
  var viewPlan = function () {
    var h = h1(esc(t(TX.plan)), esc(t(L('Жоспар диагностика нәтижелері мен қателерге қарай құрылады. Расталған олқылықтарға көбірек уақыт беріледі, жақсы меңгерілген тақырыптар артық жүктелмейді.', 'План строится по результатам диагностики и ошибкам. Подтверждённым пробелам — больше времени; хорошо освоенные темы не перегружаются.'))));
    var p = S.plan, sess = p ? p.sessions : 5, mins = p ? p.minutes : 30;
    h += card('<h2>' + esc(t(L('Апталық жүктеме', 'Недельная нагрузка'))) + '</h2><div class="filters"><label>' + esc(t(L('Аптасына сабақ саны', 'Занятий в неделю'))) + ' <select id="pl-s">' + [3, 4, 5, 6, 7].map(function (n) { return '<option' + (n === sess ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label><label>' + esc(t(L('Бір сабақтың ұзақтығы', 'Длительность занятия'))) + ' <select id="pl-m">' + [20, 30, 45, 60].map(function (n) { return '<option value="' + n + '"' + (n === mins ? ' selected' : '') + '>' + n + ' ' + esc(t(TX.min)) + '</option>'; }).join('') + '</select></label></div><button class="btn pri" data-act="plan-make">' + esc(t(p ? L('Жоспарды жаңарту', 'Обновить план') : L('Жоспар құру', 'Составить план'))) + '</button>');
    if (!p) return h;
    if (p.prelim) h += '<p class="note warn">' + esc(t(L('Бұл — алдын ала жоспар: әрекеттер мен жауаптар әлі аз, сондықтан ол нақты жеке диагноз емес. Диагностикадан кейін жаңартыңыз.', 'Это предварительный план: попыток и ответов пока мало, поэтому это не точный персональный диагноз. Обновите его после диагностики.'))) + '</p>';
    var today = dayKey(Date.now()), all = 0, done = 0;
    h += p.days.map(function (d) {
      d.tasks.forEach(function (tk) { all++; if (tk.done) done++; });
      var past = d.date < today && d.tasks.some(function (tk) { return !tk.done; });
      return card('<h2>' + esc(d.date.split('-').reverse().join('.')) + (d.date === today ? ' · ' + esc(t(L('бүгін', 'сегодня'))) : '') + (past ? ' <span class="pill warn">' + esc(t(L('орындалмаған', 'не выполнено'))) + '</span>' : '') + '</h2>' + (d.tasks.length ? '<div class="list">' + d.tasks.map(taskRow).join('') + '</div>' : '<p class="muted">—</p>'), d.date === today ? 'hl' : '');
    }).join('');
    h += '<p class="muted">' + esc(t(L('Орындалды: ', 'Выполнено: '))) + done + ' / ' + all + '</p>';
    return h;
  };
  var findTask = function (tid) { var r = null; if (S.plan) S.plan.days.forEach(function (d, di) { d.tasks.forEach(function (tk, ti) { if (tk.tid === tid) r = { d: d, di: di, tk: tk, ti: ti }; }); }); return r; };

  /* ---------------- Данные ---------------- */
  var viewData = function () {
    var h = h1(esc(t(L('Деректер және бөлісу', 'Данные и как поделиться'))), '');
    h += card('<h2>' + esc(t(L('Сақтау туралы', 'Где хранятся данные'))) + '</h2><p>' + esc(t(TX.local)) + '</p><p>' + esc(t(L('Платформа ешқандай жеке деректі (аты-жөні, телефон, пошта) сұрамайды. Бұлтта синхрондау жоқ.', 'Платформа не запрашивает личные данные (имя, телефон, почту). Облачной синхронизации нет.'))) + '</p><p class="muted">' + esc(t(L('Жауаптар: ', 'Ответов: '))) + S.log.length + ' · ' + esc(t(L('Әрекеттер: ', 'Попыток: '))) + S.attempts.length + ' · ' + esc(t(L('Қателер: ', 'Ошибок: '))) + S.mistakes.length + '</p>');
    h += card('<h2>' + esc(t(L('Сақтық көшірме (экспорт)', 'Резервная копия (экспорт)'))) + '</h2><p>' + esc(t(L('Көшірме — JSON форматындағы мәтін. Оны файл ретінде жүктеп алыңыз немесе көшіріп, өзіңізге жіберіңіз (мысалы, мессенджерге).', 'Копия — это текст в формате JSON. Скачайте его файлом или скопируйте и отправьте себе (например, в мессенджер).'))) + '</p><div class="row wrap-row"><button class="btn pri" data-act="exp-file">' + esc(t(L('Файлды жүктеу', 'Скачать файл'))) + '</button><button class="btn" data-act="exp-copy">' + esc(t(L('Мәтінді көшіру', 'Скопировать текст'))) + '</button></div><textarea id="exp-out" class="ta" readonly hidden></textarea><p class="muted sm" id="exp-msg"></p>');
    h += card('<h2>' + esc(t(L('Көшірмені қалпына келтіру (импорт)', 'Восстановление из копии (импорт)'))) + '</h2><p>' + esc(t(L('Импорт ағымдағы деректерді толық ауыстырады.', 'Импорт полностью заменяет текущие данные.'))) + '</p><input type="file" id="imp-file" accept=".json,application/json"><p class="muted sm">' + esc(t(L('немесе мәтінді осында қойыңыз:', 'или вставьте текст сюда:'))) + '</p><textarea id="imp-text" class="ta" placeholder="{ &quot;app&quot;: &quot;nis-prep&quot;, … }"></textarea><button class="btn" data-act="imp-text">' + esc(t(L('Мәтіннен қалпына келтіру', 'Восстановить из текста'))) + '</button><p id="imp-msg" class="note bad" hidden></p>');
    h += card('<h2>' + esc(t(L('Бауырыңызбен қалай бөлісуге болады', 'Как передать ученику'))) + '</h2><ol class="th"><li>' + esc(t(L('Сілтемені ашып, браузердің мекенжай жолынан көшіріңіз (немесе «Бөлісу» батырмасы арқылы).', 'Откройте ссылку и скопируйте адрес из браузера (или через кнопку «Поделиться»).'))) + '</li><li>' + esc(t(L('Оны оқушыға мессенджер арқылы жіберіңіз. Ол телефонда, планшетте немесе компьютерде кәдімгі браузерде ашылады — тіркелу қажет емес.', 'Отправьте её ученику в мессенджере. Она открывается в обычном браузере на телефоне, планшете или компьютере — регистрация не нужна.'))) + '</li><li>' + esc(t(L('Оқушы әрқашан бір құрылғыда және бір браузерде жұмыс істегені дұрыс: прогресс сол жерде сақталады.', 'Лучше, чтобы ученик всегда занимался на одном устройстве и в одном браузере: прогресс хранится там.'))) + '</li><li>' + esc(t(L('Құрылғыны ауыстыру керек болса: ескі құрылғыда экспорт жасап, жаңасында импорттаңыз.', 'Если нужно сменить устройство: сделайте экспорт на старом и импорт на новом.'))) + '</li></ol>');
    h += card('<h2>' + esc(t(L('Барлық деректі өшіру', 'Удалить все данные'))) + '</h2><p class="muted">' + esc(t(L('Бұл әрекетті қайтару мүмкін емес. Алдымен көшірме жасаңыз.', 'Это действие необратимо. Сначала сделайте копию.'))) + '</p><button class="btn danger" data-act="reset">' + esc(t(L('Өшіру', 'Удалить'))) + '</button>');
    return h;
  };
  var exportText = function () { return JSON.stringify({ app: 'nis-prep', version: VERSION, exported: new Date().toISOString(), data: S }); };
  var importData = function (text) {
    var bad = function (m) { var el = document.getElementById('imp-msg'); if (el) { el.hidden = false; el.textContent = m; } };
    var obj;
    try { obj = JSON.parse(text); } catch (e) { return bad(t(L('Файл оқылмады: бұл JSON форматындағы көшірме емес немесе ол бүлінген.', 'Не удалось прочитать файл: это не копия в формате JSON или она повреждена.'))); }
    if (!obj || obj.app !== 'nis-prep' || !obj.data) return bad(t(L('Бұл файл осы платформаның көшірмесі емес.', 'Этот файл — не копия этой платформы.')));
    if (obj.version > VERSION) return bad(t(L('Көшірме платформаның жаңа нұсқасынан жасалған. Бұл нұсқа оны оқи алмайды.', 'Копия сделана в более новой версии платформы. Эта версия не может её прочитать.')));
    var d = obj.data;
    if (!Array.isArray(d.attempts) || !Array.isArray(d.log) || !Array.isArray(d.mistakes) || (d.ui !== 'kk' && d.ui !== 'ru')) return bad(t(L('Көшірменің құрылымы сәйкес емес (кейбір бөлімдер жоқ).', 'Структура копии не подходит (не хватает разделов).')));
    var ok = d.mistakes.every(function (m) { return m && m.snap && m.snap.kk && m.snap.ru && typeof m.status === 'string'; }) && d.log.every(function (e) { return e && typeof e.ok === 'boolean' && typeof e.t === 'string'; });
    if (!ok) return bad(t(L('Көшірмедегі жазбалардың бір бөлігі бүлінген. Импорт тоқтатылды, ағымдағы деректер өзгерген жоқ.', 'Часть записей в копии повреждена. Импорт остановлен, текущие данные не изменены.')));
    ask(esc(t(L('Ағымдағы деректер көшірмедегі деректермен ауыстырылады: ', 'Текущие данные будут заменены данными из копии: '))) + d.log.length + ' ' + esc(t(L('жауап', 'ответов'))) + ', ' + d.attempts.length + ' ' + esc(t(L('әрекет', 'попыток'))) + '.', t(L('Иә, қалпына келтіру', 'Да, восстановить')), function () {
      d.v = VERSION; if (!d.sessions) d.sessions = { full: null, test: null, practice: null }; if (!d.seen) d.seen = {};
      S = d; save(); flash = t(L('Деректер көшірмеден қалпына келтірілді.', 'Данные восстановлены из копии.')); go('home');
    });
  };

  /* ---------------- Рендер ---------------- */
  var render = function () {
    var r = route(), main;
    document.documentElement.lang = S.ui === 'kk' ? 'kk' : 'ru';
    if (r.indexOf('run-') !== 0) stopTicker();
    if (r === 'home') main = viewHome();
    else if (r === 'learn') main = viewLearn();
    else if (r.indexOf('learn-') === 0) main = viewTopic(r.slice(6));
    else if (r === 'diag') main = viewDiag();
    else if (r === 'exam') main = viewExam();
    else if (r.indexOf('run-') === 0) { main = viewRun(r.slice(4)); }
    else if (r.indexOf('attempt-') === 0) main = viewAttempt(r.slice(8));
    else if (r === 'results') main = viewResults();
    else if (r === 'mistakes') main = viewMistakes();
    else if (r === 'plan') main = viewPlan();
    else if (r === 'data') main = viewData();
    else main = viewHome();
    document.getElementById('app').innerHTML = shell(main);
    if (r.indexOf('run-') === 0 && S.sessions[r.slice(4)] && !tickTimer) startTicker();
  };

  /* ---------------- События ---------------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]'); if (!el || el.tagName === 'SELECT') return;
    var a = el.getAttribute('data-act'), v = el.getAttribute('data-v');
    if (el.type === 'checkbox') return; /* обрабатываются в change */
    var ses = curSlot ? S.sessions[curSlot] : null;
    switch (a) {
      case 'ui': S.ui = v; save(); render(); break;
      case 'ql': S.ql = v; save(); render(); break;
      case 'modal-no': modal = null; render(); break;
      case 'modal-yes': var f = modal && modal.onYes; modal = null; if (f) f(); else render(); break;
      case 'open-run': go('run-' + v); break;
      case 'diag': startSession('test', NP.makeDiag(v)); break;
      case 'topic-test': startSession('test', NP.makeTopicTest(v)); break;
      case 'practice-topic': startSession('practice', NP.makePractice({ topic: v }, 0, 6, L('Жаттығу: ' + NP.TOPICS[v].name.kk, 'Практика: ' + NP.TOPICS[v].name.ru))); break;
      case 'exam-start': var pr = v.split('-'); startSession('full', NP.makeExam(+pr[0], pr[1])); break;
      case 'drop-full': ask(esc(t(L('Аяқталмаған сынақ нәтижесіз жабылады. Жалғастыру керек пе?', 'Незавершённый тест будет закрыт без результата. Продолжить?'))), t(L('Иә, жабу', 'Да, закрыть')), function () { S.sessions.full = null; save(); render(); }); break;
      case 'prev': move(-1); break;
      case 'next': move(1); break;
      case 'jump': jump(+v); break;
      case 'pick':
        if (!ses) break; var si = NP.secIndex(ses, ses.cur);
        if (ses.timed && ses.sections[si].locked) break;
        if (ses.mode === 'study' && ses.checked[ses.cur]) break;
        ses.answers[ses.cur] = +v; save(); render(); break;
      case 'flag': if (ses) { if (ses.flags[ses.cur]) delete ses.flags[ses.cur]; else ses.flags[ses.cur] = true; save(); render(); } break;
      case 'hint': if (ses) { ses.hints[ses.cur] = true; save(); render(); } break;
      case 'check':
        if (!ses || ses.answers[ses.cur] === undefined) break;
        ses.checked[ses.cur] = true;
        var it = ses.items[ses.cur]; record(it, NP.inst(it), ses.answers[ses.cur], ses.kind === 'practice' ? 'practice' : ses.kind, ses.title);
        save(); render(); break;
      case 'similar':
        if (!ses) break; var base = NP.TPL.length && NP.byId[ses.items[ses.cur].id];
        var sameT = NP.TPL.filter(function (x) { return x.t === base.t; });
        var stat = ['sci', 'kk', 'ru', 'en'].indexOf(base.s) >= 0;
        var pick = stat ? sameT.filter(function (x) { return !ses.items.some(function (y) { return y.id === x.id; }); })[0] : base;
        if (!pick) { flash = t(L('Бұл тақырыпта жаңа ұқсас тапсырма қалмады. Басқа тақырыпты таңдаңыз.', 'В этой теме больше нет новых похожих заданий. Выберите другую тему.')); render(); break; }
        ses.items.push({ id: pick.id, seed: stat ? 1 : Math.floor(Math.random() * 2e9) + 1, sec: 'all', s: pick.s });
        ses.sections[0].to = ses.items.length - 1; ses.cur = ses.items.length - 1; flash = null; save(); render(); break;
      case 'end-sec':
        if (!ses) break; ask(esc(t(L('Бөлім аяқталады және оған қайта оралып, жауапты өзгертуге болмайды. Жалғастыру керек пе?', 'Раздел будет завершён, вернуться и изменить ответы в нём будет нельзя. Продолжить?'))), t(L('Бөлімді аяқтау', 'Завершить раздел')), function () {
          var k = NP.secIndex(ses, ses.cur); ses.sections[k].locked = true; var nx = -1;
          for (var q = k + 1; q < ses.sections.length; q++) if (!ses.sections[q].locked) { nx = q; break; }
          if (nx < 0) finishSession(curSlot); else { ses.cur = ses.sections[nx].from; save(); render(); }
        }); break;
      case 'finish':
        if (!ses) break;
        var un = ses.items.length - Object.keys(ses.answers).length, fl = Object.keys(ses.flags).length;
        ask(esc(t(L('Тестті аяқтау керек пе? Жауап берілмеген: ', 'Завершить тест? Без ответа: '))) + un + (fl ? esc(t(L('; белгіленген: ', '; отмечено: '))) + fl : '') + '.', t(L('Аяқтау', 'Завершить')), function () { finishSession(curSlot); }); break;
      case 'step': var hidden = document.querySelector('#steps li[hidden]'); if (hidden) hidden.hidden = false; if (!document.querySelector('#steps li[hidden]')) el.hidden = true; break;
      case 'm-series':
        var m = S.mistakes.filter(function (x) { return x.mid === v; })[0]; if (!m) break;
        if (m.status === 'new') m.status = 'work'; m.next = m.next || 'series';
        startSession('practice', NP.makePractice({ skill: m.s + ':' + m.k, topicFallback: m.t }, 0, 5, L('Ұқсас тапсырмалар: ' + (NP.SKILL[m.k] || L(m.k, m.k)).kk, 'Похожие задания: ' + (NP.SKILL[m.k] || L(m.k, m.k)).ru)));
        break;
      case 'm-work': var m2 = S.mistakes.filter(function (x) { return x.mid === v; })[0]; if (m2) { m2.status = 'work'; save(); render(); } break;
      case 'plan-make':
        var ns = +document.getElementById('pl-s').value, nm = +document.getElementById('pl-m').value;
        S.plan = buildPlan(ns, nm); save(); render(); break;
      case 't-move':
        var f2 = findTask(v); if (!f2) break; f2.d.tasks.splice(f2.ti, 1);
        var nd = S.plan.days[f2.di + 1];
        if (!nd) { var last = S.plan.days[S.plan.days.length - 1].date.split('-'); var dt = new Date(+last[0], +last[1] - 1, +last[2] + 1); nd = { date: dayKey(dt.getTime()), tasks: [] }; S.plan.days.push(nd); }
        f2.tk.moved = (f2.tk.moved || 0) + 1; nd.tasks.unshift(f2.tk); save(); render(); break;
      case 't-go':
        var f3 = findTask(v); if (!f3) break; var tk = f3.tk;
        if (tk.kind === 'diag') startSession('test', NP.makeDiag(tk.sub));
        else if (tk.kind === 'lesson') go('learn-' + tk.topic);
        else if (tk.kind === 'practice') startSession('practice', NP.makePractice({ topic: tk.topic }, 0, 6, L('Жаттығу: ' + NP.TOPICS[tk.topic].name.kk, 'Практика: ' + NP.TOPICS[tk.topic].name.ru)));
        else if (tk.kind === 'mistakes') { mf.st = 'open'; go('mistakes'); }
        else if (tk.kind === 'check') startSession('test', NP.makeCheck(tk.topics && tk.topics.length ? tk.topics : ['frac', 'pct', 'qcnum', 'qcvar']));
        break;
      case 'exp-file':
        var txt = exportText(), msg = document.getElementById('exp-msg');
        var fname = 'nis-prep-' + dayKey(Date.now()) + '.json';
        var plainDl = function () { try { var blob = new Blob([txt], { type: 'application/json' }), aEl = document.createElement('a'); aEl.href = URL.createObjectURL(blob); aEl.download = fname; document.body.appendChild(aEl); aEl.click(); aEl.remove(); } catch (e) { } };
        if (dlApi) dlApi.save({ filename: fname, data: txt }).then(function () { if (msg) msg.textContent = t(L('Файл сақталды.', 'Файл сохранён.')); }, function () { });
        else plainDl();
        var ta = document.getElementById('exp-out'); ta.hidden = false; ta.value = txt;
        if (msg) msg.textContent = t(L('Егер жүктеу басталмаса (кейбір қарау терезелерінде файл жүктеуге тыйым салынған), төмендегі мәтінді көшіріп, .json файл ретінде сақтаңыз.', 'Если скачивание не началось (в некоторых окнах просмотра оно запрещено), скопируйте текст ниже и сохраните как файл .json.'));
        break;
      case 'exp-copy':
        var txt2 = exportText(), ta2 = document.getElementById('exp-out'), msg2 = document.getElementById('exp-msg'); ta2.hidden = false; ta2.value = txt2;
        var done = function () { if (msg2) msg2.textContent = t(L('Көшірілді.', 'Скопировано.')); };
        var fail = function () { ta2.focus(); ta2.select(); if (msg2) msg2.textContent = t(L('Автоматты көшіру мүмкін болмады — мәтін белгіленді, оны қолмен көшіріңіз.', 'Автоматически скопировать не удалось — текст выделен, скопируйте вручную.')); };
        try { navigator.clipboard.writeText(txt2).then(done, fail); } catch (e) { fail(); }
        break;
      case 'imp-text': importData(document.getElementById('imp-text').value); break;
      case 'reset': ask(esc(t(L('Барлық прогресс, қателер мен жоспар өшіріледі. Бұл әрекетті қайтару мүмкін емес.', 'Будут удалены весь прогресс, ошибки и план. Это действие необратимо.'))), t(L('Иә, өшіру', 'Да, удалить')), function () { var ui = S.ui, ql = S.ql; S = fresh(); S.ui = ui; S.ql = ql; save(); flash = t(L('Деректер өшірілді.', 'Данные удалены.')); go('home'); }); break;
    }
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target, a = el.getAttribute && el.getAttribute('data-act'), v = el.getAttribute && el.getAttribute('data-v');
    if (el.id === 'imp-file' && el.files && el.files[0]) { var rd = new FileReader(); rd.onload = function () { importData(String(rd.result)); }; rd.onerror = function () { importData(''); }; rd.readAsText(el.files[0]); return; }
    if (!a) return;
    if (a === 'mf-st') { mf.st = el.value; render(); }
    else if (a === 'mf-s') { mf.s = el.value; render(); }
    else if (a === 'm-reason' || a === 'm-next') { var m = S.mistakes.filter(function (x) { return x.mid === v; })[0]; if (m) { if (a === 'm-reason') m.reason = el.value || null; else m.next = el.value || null; if (m.status === 'new' && el.value) m.status = 'work'; save(); render(); } }
    else if (a === 't-done') { var f = findTask(v); if (f) { f.tk.done = el.checked; save(); render(); } }
    else if (a === 'onlywrong') { window.__onlyWrong = el.checked; render(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (route().indexOf('run-') !== 0 || modal) return;
    var tag = (ev.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (ev.key === 'ArrowRight') { ev.preventDefault(); move(1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); move(-1); }
  });
  window.addEventListener('beforeunload', save);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); else lastTick = Date.now(); });

  /* В просмотрщике claude.ai файл отдаётся через возможность downloads; в обычном браузере — обычной ссылкой */
  var dlApi = null;
  try { if (window.claude && window.claude.use) window.claude.use('downloads').then(function (d) { dlApi = d; }, function () { }); } catch (e) { }
  NP.app = { state: function () { return S; }, render: render };
  render();
})();
