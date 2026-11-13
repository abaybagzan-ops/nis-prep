/*
 * Экраны приложения. Вся логика обучения — в engine.js, данные — в js/content/.
 */
(function () {
  var h = FEA.ui.h;
  var E = FEA.engine;
  var store = FEA.storage;
  var root = document.getElementById('app');

  var state = store.load();
  var route = { name: 'boot', params: {} };

  // ------------------------------------------------------------ состояние
  function profile() { return state.activeProfileId ? state.profiles[state.activeProfileId] : null; }
  function persist() { store.save(state); }
  function now() { return Date.now(); }
  function skillMeta(id) { return FEA.skills.filter(function (s) { return s.id === id; })[0]; }
  function stageMeta(id) { return FEA.stages[id]; }
  function interestMeta(id) { return FEA.interests.filter(function (i) { return i.id === id; })[0]; }

  function go(name, params) {
    route = { name: name, params: params || {} };
    render();
    window.scrollTo(0, 0);
  }

  function startRoute() {
    var p = profile();
    if (!p) return Object.keys(state.profiles).length ? 'profiles' : 'welcome';
    if (!p.interest) return 'interest';
    if (!p.stages) return 'diagIntro';
    return 'home';
  }

  // ------------------------------------------------------------ общие элементы
  var LOGO_SVG =
    '<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false">' +
    '<circle cx="92" cy="22" r="14" fill="var(--sun)"/>' +
    '<path d="M10 64 Q40 30 70 64 Z" fill="var(--hill1)"/>' +
    '<path d="M44 66 Q78 36 112 66 Z" fill="var(--hill2)"/>' +
    '<rect x="30" y="48" width="44" height="26" rx="4" fill="var(--card)" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<path d="M52 50 V72" stroke="var(--accent)" stroke-width="2.5"/>' +
    '<path d="M36 56 H48 M36 62 H48 M56 56 H68 M56 62 H68" stroke="var(--muted)" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  function topbar() {
    var p = profile();
    return h('header', { class: 'topbar' },
      h('div', { class: 'brand' }, h('span', { class: 'brand-mark', html: LOGO_SVG }), h('span', null, 'Отбасылық ағылшын')),
      p ? h('button', { class: 'chip chip-profile', onclick: function () { go('progress'); }, 'aria-label': 'Профиль және баптаулар' }, '👤 ' + p.name) : null
    );
  }

  function bottomNav(active) {
    function item(name, icon, label) {
      return h('button', { class: 'nav-item' + (active === name ? ' active' : ''), onclick: function () { go(name); }, 'aria-current': active === name ? 'page' : null },
        h('span', { class: 'nav-icon', 'aria-hidden': 'true' }, icon), h('span', null, label));
    }
    return h('nav', { class: 'bottom-nav', 'aria-label': 'Негізгі мәзір' },
      item('home', '🏠', 'Басты бет'),
      item('skills', '🧭', 'Дағдылар'),
      item('progress', '📈', 'Прогресс'));
  }

  function storageBanner() {
    if (store.isAvailable()) return null;
    return h('div', { class: 'banner banner-warn', role: 'status' },
      'Бұл браузерде деректерді сақтау мүмкін емес. Беттің жабылуымен прогресс жоғалады.');
  }

  function page(children, navActive) {
    return [topbar(), storageBanner(), h('main', { class: 'page' }, children), navActive ? bottomNav(navActive) : null];
  }

  function stageLabel(stageId) {
    var s = stageMeta(stageId);
    return s ? s.title : '';
  }

  // ------------------------------------------------------------ задания
  /*
   * Универсальный показ задания (диагностика, урок, повторение).
   * opts: { onResult(ok, answerText), onNext, nextLabel, text, dontKnow, wrongNote, lesson, ctxKey }
   */
  function taskView(task, opts) {
    var answered = false;
    var feedback = h('div', { class: 'feedback-slot', 'aria-live': 'polite' });
    var nextBtn = h('button', { class: 'btn btn-primary btn-block hidden', onclick: function () { opts.onNext(); } }, opts.nextLabel || 'Келесі →');

    function finish(ok, answerText, correctText) {
      if (answered) return;
      answered = true;
      opts.onResult(ok, answerText);
      feedback.appendChild(h('div', { class: 'feedback ' + (ok ? 'feedback-ok' : 'feedback-bad') },
        h('div', { class: 'feedback-head' }, ok ? '✓ Дұрыс!' : '○ Ештеңе етпейді — бірге қарайық.'),
        !ok && correctText ? h('div', { class: 'feedback-answer' }, 'Дұрыс жауап: ', h('strong', { lang: 'en' }, correctText)) : null,
        task.explain ? h('p', { class: 'feedback-explain' }, task.explain) : null,
        !ok ? h('p', { class: 'feedback-note' }, opts.wrongNote || 'Бұл тақырып кейін қайталауға қосылады.') : null
      ));
      nextBtn.classList.remove('hidden');
      nextBtn.focus();
    }

    var body;
    if (task.type === 'choice') body = choiceBody(task, finish, opts);
    else if (task.type === 'type') body = typeBody(task, finish, opts);
    else if (task.type === 'order') body = orderBody(task, finish);
    else if (task.type === 'match') body = matchBody(task, finish, opts);
    else body = h('p', null, 'Белгісіз тапсырма түрі.');

    return h('section', { class: 'task' },
      opts.text ? textCard(opts.text, true) : null,
      h('h2', { class: 'task-prompt' }, task.prompt),
      taskMaterial(task),
      body,
      feedback,
      nextBtn
    );
  }

  function taskMaterial(task) {
    return [
      task.visual ? h('div', { class: 'visual', 'aria-hidden': 'true' }, task.visual) : null,
      task.sign ? h('div', { class: 'sign', lang: 'en' }, task.sign.map(function (l) { return h('div', null, l); })) : null,
      task.text ? h('blockquote', { class: 'mini-text', lang: 'en' }, task.text.map(function (l) { return h('p', null, l); })) : null,
      task.sentence ? h('p', { class: 'sentence', lang: 'en' }, task.sentence) : null,
      task.glossary ? glossary(task.glossary) : null
    ];
  }

  function glossary(items) {
    if (!items || !items.length) return null;
    return h('div', { class: 'glossary' },
      h('span', { class: 'glossary-label' }, 'Сөздік:'),
      items.map(function (g) { return h('span', { class: 'gloss' }, h('span', { lang: 'en' }, g.en), ' — ', g.kk); }));
  }

  function choiceBody(task, finish, opts) {
    var opts2 = E.shuffledOptions(task);
    var buttons = [];
    var correctText = task.options[task.answer];
    var wrap = h('div', { class: 'options' });
    opts2.forEach(function (o) {
      var b = h('button', { class: 'option', lang: /[a-z]/i.test(o.text) && !/[а-яәіңғүұқөһ]/i.test(o.text) ? 'en' : null }, o.text);
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.disabled = true; });
        if (o.correct) b.classList.add('is-correct');
        else {
          b.classList.add('is-wrong');
          buttons.forEach(function (x, i) { if (opts2[i].correct) x.classList.add('is-correct'); });
        }
        if (dk) dk.disabled = true;
        finish(o.correct, o.text, correctText);
      });
      buttons.push(b);
      wrap.appendChild(b);
    });
    var dk = opts.dontKnow ? h('button', { class: 'btn btn-ghost btn-small', onclick: function () {
      buttons.forEach(function (x, i) { x.disabled = true; if (opts2[i].correct) x.classList.add('is-correct'); });
      dk.disabled = true;
      finish(false, '(білмеймін)', correctText);
    } }, 'Білмеймін') : null;
    return [wrap, dk ? h('div', { class: 'dk-row' }, dk) : null];
  }

  function typeBody(task, finish) {
    var input = h('input', { class: 'text-input', type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'en', 'aria-label': 'Жауабыңыз', placeholder: 'Жауапты жазыңыз…' });
    var check = h('button', { class: 'btn btn-primary', disabled: true }, 'Тексеру');
    var dk = h('button', { class: 'btn btn-ghost' }, 'Білмеймін');
    function submit() {
      if (!input.value.trim()) return;
      var ok = E.checkTyped(task, input.value);
      input.disabled = true; check.disabled = true; dk.disabled = true;
      input.classList.add(ok ? 'is-correct' : 'is-wrong');
      finish(ok, input.value, task.answers[0]);
    }
    input.addEventListener('input', function () { check.disabled = !input.value.trim(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    check.addEventListener('click', submit);
    dk.addEventListener('click', function () {
      input.disabled = true; check.disabled = true; dk.disabled = true;
      finish(false, '(білмеймін)', task.answers[0]);
    });
    setTimeout(function () { input.focus(); }, 30);
    return h('div', { class: 'type-row' }, input, h('div', { class: 'row-gap' }, check, dk));
  }

  function orderBody(task, finish) {
    var bank = E.shuffledWords(task);
    var chosen = [];
    var line = h('div', { class: 'order-line', 'aria-label': 'Сіздің сөйлеміңіз' });
    var pool = h('div', { class: 'order-pool' });
    var check = h('button', { class: 'btn btn-primary', disabled: true }, 'Тексеру');
    var reset = h('button', { class: 'btn btn-ghost' }, 'Қайта бастау');
    var done = false;

    function draw() {
      line.innerHTML = ''; pool.innerHTML = '';
      if (!chosen.length) line.appendChild(h('span', { class: 'placeholder' }, 'Сөздерді ретімен басыңыз'));
      chosen.forEach(function (w, i) {
        line.appendChild(h('button', { class: 'token token-chosen', lang: 'en', disabled: done, onclick: function () {
          bank.push(chosen.splice(i, 1)[0]); draw();
        } }, w));
      });
      bank.forEach(function (w, i) {
        pool.appendChild(h('button', { class: 'token', lang: 'en', disabled: done, onclick: function () {
          chosen.push(bank.splice(i, 1)[0]); draw();
        } }, w));
      });
      check.disabled = done || bank.length > 0;
    }
    check.addEventListener('click', function () {
      done = true;
      var ok = E.checkOrder(task, chosen);
      line.classList.add(ok ? 'is-correct' : 'is-wrong');
      reset.disabled = true;
      draw();
      finish(ok, chosen.join(' '), task.answer);
    });
    reset.addEventListener('click', function () { bank = bank.concat(chosen); chosen = []; draw(); });
    draw();
    return h('div', { class: 'order' }, line, pool, h('div', { class: 'row-gap' }, check, reset));
  }

  function matchBody(task, finish, opts) {
    var pairs = E.matchPairs(opts.lesson, opts.ctxKey);
    var left = E.shuffle(pairs), right = E.shuffle(pairs);
    var selected = null, matched = 0, mistakes = 0;
    var leftBtns = [], rightBtns = [];
    var status = h('p', { class: 'muted small' }, 'Алдымен ағылшын сөзін, содан кейін оның мағынасын басыңыз.');

    function clearSel() { leftBtns.forEach(function (b) { b.classList.remove('selected'); }); selected = null; }

    var lcol = h('div', { class: 'match-col' });
    var rcol = h('div', { class: 'match-col' });
    left.forEach(function (p) {
      var b = h('button', { class: 'token match-item', lang: 'en' }, p.en);
      b.addEventListener('click', function () { clearSel(); selected = { pair: p, btn: b }; b.classList.add('selected'); });
      leftBtns.push(b); lcol.appendChild(b);
    });
    right.forEach(function (p) {
      var b = h('button', { class: 'token match-item' }, p.kk);
      b.addEventListener('click', function () {
        if (!selected) { status.textContent = 'Алдымен сол жақтағы ағылшын сөзін таңдаңыз.'; return; }
        if (selected.pair.en === p.en) {
          selected.btn.disabled = true; selected.btn.classList.add('is-correct');
          b.disabled = true; b.classList.add('is-correct');
          matched++; clearSel();
          status.textContent = 'Жарайсыз! Қалғанын да сәйкестендіріңіз.';
          if (matched === pairs.length) finish(mistakes === 0, '', '');
        } else {
          mistakes++;
          b.classList.add('shake');
          setTimeout(function () { b.classList.remove('shake'); }, 400);
          status.textContent = 'Бұл жұп емес. Тағы байқап көріңіз.';
        }
      });
      rightBtns.push(b); rcol.appendChild(b);
    });
    return [h('div', { class: 'match' }, lcol, rcol), status];
  }

  function textCard(text, compact) {
    var inner = [
      h('div', { class: 'text-label' }, 'Сабаққа арнайы жазылған ойдан шығарылған мәтін'),
      h('h3', { class: 'text-title', lang: 'en' }, text.title),
      h('div', { class: text.sign ? 'sign' : 'reading', lang: 'en' }, text.lines.map(function (l) { return h(text.sign ? 'div' : 'p', null, l); })),
      glossary(text.glossary)
    ];
    if (compact) {
      return h('details', { class: 'text-card compact', open: true }, h('summary', null, '📖 Мәтін'), inner);
    }
    return h('div', { class: 'text-card' }, inner);
  }

  // ------------------------------------------------------------ ПРИВЕТСТВИЕ И ПРОФИЛЬ
  function screenWelcome() {
    var hasProfiles = Object.keys(state.profiles).length > 0;
    return page([
      h('section', { class: 'hero' },
        h('div', { class: 'hero-art', html: LOGO_SVG }),
        h('h1', null, 'Сәлеметсіз бе! 👋'),
        h('p', { class: 'lead' }, 'Бұл — отбасыңызға арналған ағылшын тілі қосымшасы. Күніне 5–10 минут: сөздер, грамматика және қысқа мәтіндер.'),
        h('ul', { class: 'hero-list' },
          h('li', null, 'Әркім өз қарқынымен, өз құрылғысында оқиды.'),
          h('li', null, 'Тіркелу, телефон немесе пошта керек емес.'),
          h('li', null, 'Прогресс тек осы құрылғыда, осы браузерде сақталады.')),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { go('name'); } }, 'Бастау'),
        hasProfiles ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, 'Бар профильді таңдау') : null
      )
    ]);
  }

  function screenName() {
    var p = profile();
    var editing = route.params.edit && p;
    var input = h('input', { class: 'text-input', type: 'text', maxlength: '30', placeholder: 'Мысалы: Айгерім', 'aria-label': 'Атыңыз немесе жүгіну', value: editing ? p.name : '' });
    var next = h('button', { class: 'btn btn-primary btn-block', disabled: !editing }, editing ? 'Сақтау' : 'Жалғастыру');
    input.addEventListener('input', function () { next.disabled = !input.value.trim(); });
    function submit() {
      var name = input.value.trim().slice(0, 30);
      if (!name) return;
      if (editing) { p.name = name; persist(); go('progress'); return; }
      var np = store.newProfile(name);
      state.profiles[np.id] = np;
      state.activeProfileId = np.id;
      persist();
      go('interest');
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
    next.addEventListener('click', submit);
    setTimeout(function () { input.focus(); }, 30);
    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, editing ? 'Профиль' : '1-қадам / 3'),
        h('h1', null, 'Сізге қалай жүгінейік?'),
        h('p', { class: 'muted' }, 'Атыңызды жазыңыз немесе төменнен қарапайым жүгінуді таңдаңыз. Тегі мен басқа жеке деректер керек емес.'),
        input,
        h('div', { class: 'chips' }, FEA.nameChips.map(function (c) {
          return h('button', { class: 'chip', onclick: function () { input.value = c; next.disabled = false; input.focus(); } }, c);
        })),
        next,
        editing ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Артқа') : null
      )
    ]);
  }

  function screenInterest() {
    var p = profile();
    var editing = route.params.edit;
    var selected = p.interest || null;
    var topic = p.otherTopic || '';
    var cards = {};
    var otherBox = h('div', { class: 'other-box' + (selected === 'other' ? '' : ' hidden') });
    var topicInput = h('input', { class: 'text-input', type: 'text', maxlength: '40', placeholder: 'Өз тақырыбыңызды жазыңыз', value: topic, 'aria-label': 'Өз тақырыбыңыз' });
    var next = h('button', { class: 'btn btn-primary btn-block', disabled: !selected }, editing ? 'Сақтау' : 'Жалғастыру');

    otherBox.appendChild(h('div', { class: 'chips' }, FEA.otherTopics.map(function (t) {
      return h('button', { class: 'chip', onclick: function () { topicInput.value = t; } }, t);
    })));
    otherBox.appendChild(topicInput);
    otherBox.appendChild(h('p', { class: 'muted small' }, 'Бұл нұсқада бөлек тақырыптарға арналған мәтіндер әлі аз. Әзірге сабақтарда күнделікті өмір туралы мәтіндер беріледі.'));

    function pick(id) {
      selected = id;
      Object.keys(cards).forEach(function (k) { cards[k].classList.toggle('selected', k === id); cards[k].setAttribute('aria-pressed', k === id ? 'true' : 'false'); });
      otherBox.classList.toggle('hidden', id !== 'other');
      next.disabled = false;
    }

    next.addEventListener('click', function () {
      p.interest = selected;
      p.otherTopic = selected === 'other' ? topicInput.value.trim().slice(0, 40) : '';
      persist();
      go(editing ? 'progress' : (p.stages ? 'home' : 'diagIntro'));
    });

    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, editing ? 'Қызығушылық' : '2-қадам / 3'),
        h('h1', null, 'Сізге не қызық?'),
        h('p', { class: 'muted' }, 'Қызығушылық мәтіндердің тақырыбын, мысалдарды және тақырыптық сөздердің бір бөлігін өзгертеді. Сабақтардың реті мен күрделілігі өзгермейді.'),
        h('div', { class: 'interest-grid' }, FEA.interests.map(function (it) {
          var c = h('button', { class: 'interest-card' + (selected === it.id ? ' selected' : ''), 'aria-pressed': selected === it.id ? 'true' : 'false', onclick: function () { pick(it.id); } },
            h('span', { class: 'interest-icon', 'aria-hidden': 'true' }, it.icon), h('span', null, it.title));
          cards[it.id] = c;
          return c;
        })),
        otherBox,
        next,
        editing ? h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Артқа') : null
      )
    ]);
  }

  function screenProfiles() {
    var ids = Object.keys(state.profiles);
    return page([
      h('section', { class: 'card card-pad' },
        h('h1', null, 'Профильді таңдаңыз'),
        h('p', { class: 'muted' }, 'Бір құрылғыда бірнеше профиль болуы мүмкін. Әр профильдің прогресі бөлек сақталады.'),
        ids.length ? h('div', { class: 'list' }, ids.map(function (id) {
          var p = state.profiles[id];
          return h('button', { class: 'list-item', onclick: function () { state.activeProfileId = id; persist(); go(startRoute()); } },
            h('span', null, '👤 ' + p.name), h('span', { class: 'muted small' }, p.interest ? interestMeta(p.interest).title : 'баптау аяқталмаған'));
        })) : h('p', { class: 'empty' }, 'Әзірге профиль жоқ.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { state.activeProfileId = null; persist(); go('name'); } }, '＋ Жаңа профиль')
      )
    ]);
  }

  // ------------------------------------------------------------ ДИАГНОСТИКА
  var diag = null;

  function screenDiagIntro() {
    return page([
      h('section', { class: 'card card-pad' },
        h('p', { class: 'step-label' }, '3-қадам / 3'),
        h('h1', null, 'Қысқа диагностика'),
        h('p', null, '15 қысқа сұрақ: 5 — сөздер, 5 — грамматика, 5 — оқу. Әр бөлімде сұрақтар біртіндеп қиындай береді.'),
        h('ul', { class: 'hero-list' },
          h('li', null, 'Білмесеңіз, «Білмеймін» батырмасын басыңыз — бұл қалыпты жағдай.'),
          h('li', null, 'Қате үшін ешқандай айып жоқ. Әр жауаптан кейін қысқа түсіндірме шығады.'),
          h('li', null, 'Нәтиже — тек болжамды бастапқы деңгей. Ол сабақтар барысында нақтыланады.')),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { startDiag(); } }, 'Диагностиканы бастау'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { skipDiag(); } }, 'Диагностикасыз, ең бастапқы сатыдан бастау')
      )
    ]);
  }

  function startDiag() {
    diag = { i: 0, correct: { words: 0, grammar: 0, reading: 0 }, wrongInRow: { words: 0, grammar: 0, reading: 0 }, wrongIds: [], stoppedParts: [] };
    go('diag');
  }

  function skipDiag() {
    var p = profile();
    p.diagnostic = { date: new Date().toISOString(), skipped: true, correct: null, suggested: { words: 0, grammar: 0, reading: 0 } };
    p.stages = { words: 0, grammar: 0, reading: 0 };
    persist();
    go('diagResult');
  }

  function nextDiagIndex() {
    var items = FEA.diagnostic;
    var i = diag.i + 1;
    while (i < items.length && diag.stoppedParts.indexOf(items[i].skill) !== -1) i++;
    return i;
  }

  function screenDiag() {
    var items = FEA.diagnostic;
    var item = items[diag.i];
    var partIndex = FEA.engine.SKILL_ORDER.indexOf(item.skill);
    var partItems = items.filter(function (x) { return x.skill === item.skill; });
    var posInPart = partItems.indexOf(item) + 1;
    var progress = Math.round((diag.i / items.length) * 100);
    var stoppedNote = null;

    var view = taskView({ type: 'choice', prompt: item.prompt, options: item.options, answer: item.answer, explain: item.explain,
      visual: item.visual, sentence: item.sentence, sign: item.sign, text: item.text }, {
      dontKnow: true,
      wrongNote: 'Бұл сұраққа ұқсас тапсырма кейін қайталауға қосылады.',
      onResult: function (ok) {
        if (ok) { diag.correct[item.skill]++; diag.wrongInRow[item.skill] = 0; }
        else {
          diag.wrongInRow[item.skill]++;
          diag.wrongIds.push(item.id);
          if (diag.wrongInRow[item.skill] >= FEA.settings.diagStopAfterWrongInRow && posInPart < 5) {
            diag.stoppedParts.push(item.skill);
            stoppedNote.classList.remove('hidden');
          }
        }
      },
      onNext: function () {
        var n = nextDiagIndex();
        if (n >= items.length) finishDiag();
        else { diag.i = n; go('diag'); }
      }
    });
    stoppedNote = h('p', { class: 'banner banner-info hidden' }, 'Бұл бөлімді осы жерде аяқтаймыз. Қалғанын сабақтарда біртіндеп үйренесіз.');

    return page([
      h('div', { class: 'progress-wrap' },
        h('div', { class: 'progress-meta' },
          h('span', null, (partIndex + 1) + '-бөлім: ' + skillMeta(item.skill).title + ' · ' + posInPart + '/5'),
          h('button', { class: 'link-btn', onclick: function () {
            FEA.ui.confirmDialog({ title: 'Диагностиканы тоқтатасыз ба?', text: 'Жауаптар сақталмайды. Кейін қайта бастауға болады.', ok: 'Тоқтату' })
              .then(function (yes) { if (yes) { diag = null; go('diagIntro'); } });
          } }, 'Тоқтату')),
        h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': String(progress), 'aria-valuemin': '0', 'aria-valuemax': '100' },
          h('div', { class: 'progress-bar', style: 'width:' + progress + '%' }))),
      h('div', { class: 'card card-pad' }, view, stoppedNote)
    ]);
  }

  function finishDiag() {
    var p = profile();
    var t = now();
    var suggested = {};
    E.SKILL_ORDER.forEach(function (s) { suggested[s] = E.diagStage(diag.correct[s]); });
    p.diagnostic = { date: new Date(t).toISOString(), skipped: false, correct: diag.correct, suggested: suggested };
    p.stages = Object.assign({}, suggested);
    diag.wrongIds.forEach(function (id) {
      var d = FEA.diagnostic.filter(function (x) { return x.id === id; })[0];
      E.scheduleReview(p, id + '-r', t);
      E.addMistake(p, { at: t, where: 'Диагностика', prompt: d.prompt + (d.sentence ? ' ' + d.sentence : ''), answer: d.options[d.answer], explain: d.explain });
    });
    diag = null;
    persist();
    go('diagResult');
  }

  function stageStepper(skill, onChange) {
    var p = profile();
    var val = p.stages[skill];
    var label = h('div', { class: 'stage-name' }, stageLabel(val));
    var hint = h('div', { class: 'muted small' }, stageMeta(val).cefrHint);
    var minus = h('button', { class: 'btn btn-ghost btn-small', 'aria-label': 'Жеңілірек' }, '− Жеңілірек');
    var plus = h('button', { class: 'btn btn-ghost btn-small', 'aria-label': 'Қиынырақ' }, 'Қиынырақ +');
    function upd() {
      label.textContent = stageLabel(p.stages[skill]);
      hint.textContent = stageMeta(p.stages[skill]).cefrHint;
      minus.disabled = p.stages[skill] <= 0;
      plus.disabled = p.stages[skill] >= FEA.stages.length - 1;
    }
    minus.addEventListener('click', function () { p.stages[skill]--; persist(); upd(); if (onChange) onChange(); });
    plus.addEventListener('click', function () { p.stages[skill]++; persist(); upd(); if (onChange) onChange(); });
    upd();
    return h('div', { class: 'stepper' }, h('div', null, label, hint), h('div', { class: 'row-gap' }, minus, plus));
  }

  function screenDiagResult() {
    var p = profile();
    var d = p.diagnostic;
    return page([
      h('section', { class: 'card card-pad' },
        h('h1', null, d && d.skipped ? 'Бастапқы саты таңдалды' : 'Болжамды бастапқы деңгей'),
        h('p', { class: 'muted' }, d && d.skipped
          ? 'Диагностика өткізілмеді, сондықтан ең бастапқы сатыдан бастаймыз. Төменде өзгертуге болады.'
          : 'Бұл — қысқа тексерудің алдын ала нәтижесі. Әр дағды бөлек көрсетілген. Деңгей алғашқы сабақтарда нақтыланады.'),
        h('div', { class: 'skill-results' }, E.SKILL_ORDER.map(function (s) {
          var sm = skillMeta(s);
          return h('div', { class: 'skill-result skill-' + s },
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon', 'aria-hidden': 'true' }, sm.icon), h('strong', null, sm.title),
              d && d.correct ? h('span', { class: 'muted small' }, d.correct[s] + ' / 5 дұрыс') : null),
            stageStepper(s));
        })),
        h('p', { class: 'muted small' }, FEA.cefrDisclaimer),
        h('p', { class: 'muted small' }, 'Тым жеңіл немесе тым қиын көрінсе, «Жеңілірек» не «Қиынырақ» батырмасымен өзіңіз таңдаңыз.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () {
          var rec = E.recommendNext(p, now());
          if (rec.kind === 'lesson') startLesson(rec.lesson.id); else go('home');
        } }, 'Бірінші сабақты бастау'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('home'); } }, 'Басты бетке')
      )
    ]);
  }

  // ------------------------------------------------------------ ГЛАВНАЯ
  function lessonCard(lesson, opts) {
    opts = opts || {};
    var sm = skillMeta(lesson.skill);
    var p = profile();
    var done = !!p.lessons[lesson.id];
    return h('div', { class: 'lesson-card skill-' + lesson.skill + (opts.big ? ' big' : '') },
      h('div', { class: 'lesson-card-head' },
        h('span', { class: 'skill-badge' }, sm.icon + ' ' + sm.title),
        h('span', { class: 'muted small' }, stageLabel(lesson.stage)),
        done ? h('span', { class: 'done-badge' }, '✓ Өтілді') : null),
      h('h3', { class: 'lesson-title' }, lesson.title),
      h('p', { class: 'muted' }, lesson.goal),
      h('div', { class: 'lesson-card-foot' },
        h('span', { class: 'muted small' }, '⏱ 5–10 минут'),
        h('button', { class: 'btn ' + (opts.big ? 'btn-primary' : 'btn-secondary'), onclick: function () { startLesson(lesson.id, opts.ctxKey); } },
          opts.label || (done ? 'Қайталау' : 'Бастау'))));
  }

  function screenHome() {
    var p = profile();
    var t = now();
    var rec = E.recommendNext(p, t);
    var due = E.countDue(p, t);
    var doneCount = Object.keys(p.lessons).length;
    var main;

    if (rec.kind === 'lesson') {
      main = h('section', null, h('h2', { class: 'section-title' }, 'Келесі ұсынылатын сабақ'), lessonCard(rec.lesson, { big: true, label: doneCount ? 'Жалғастыру' : 'Бастау' }));
    } else if (rec.kind === 'review') {
      main = h('section', { class: 'card card-pad' },
        h('h2', null, 'Бүгін — қайталау күні'),
        h('p', { class: 'muted' }, 'Сатыңыздағы сабақтар өтілді. Енді бұрын үйренгенді еске түсіру маңызды.'),
        h('button', { class: 'btn btn-primary btn-block', onclick: function () { startReview(); } }, 'Қайталауды бастау'));
    } else {
      var other = E.SKILL_ORDER.map(function (s) { return E.lessonFor(p.stages[s], s); }).filter(Boolean)[0];
      var ctxUsed = other && p.lessons[other.id] ? p.lessons[other.id].contextsUsed : [];
      var altCtx = Object.keys(FEA.contextNames).filter(function (k) { return ctxUsed.indexOf(k) === -1; })[0];
      main = h('section', { class: 'card card-pad' },
        h('h2', null, 'Жарайсыз! Ағымдағы сабақтар өтілді'),
        h('p', { class: 'muted' }, 'Бүгін қайталайтын сұрақ жоқ. Сабақты жаңа мәтінмен қайталауға немесе «Прогресс» бетінде келесі сатыны таңдауға болады.'),
        other && altCtx ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startLesson(other.id, altCtx); } },
          '«' + other.title + '» — жаңа мәтінмен (' + FEA.contextNames[altCtx] + ')') : null,
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('progress'); } }, 'Прогресс және сатылар'));
    }

    return page([
      h('section', { class: 'greet' },
        h('h1', null, 'Сәлем, ' + p.name + '!'),
        h('p', { class: 'muted' }, 'Бүгінгі мақсат — бір қысқа сабақ. Тұрақты аз-аздан оқу — ең тиімді жол.')),
      main,
      due > 0 && rec.kind !== 'review' ? h('section', { class: 'card card-pad review-card' },
        h('div', null, h('strong', null, '🔁 Қайталау: ' + due + ' сұрақ'),
          h('p', { class: 'muted small' }, 'Бұрын үйренгенді ұмытпау үшін. Сабақтың басында да 1–2 сұрақ қосылады.')),
        h('button', { class: 'btn btn-secondary', onclick: function () { startReview(); } }, 'Қайталау')) : null,
      h('section', { class: 'card card-pad' },
        h('div', { class: 'stats-row' },
          h('div', null, h('div', { class: 'stat-num' }, String(doneCount)), h('div', { class: 'muted small' }, 'өтілген сабақ')),
          h('div', null, h('div', { class: 'stat-num' }, String(Object.keys(p.reviews).length)), h('div', { class: 'muted small' }, 'қайталаудағы сұрақ'))),
        h('p', { class: 'muted small' }, '💾 Прогресс осы құрылғыда, осы браузерде сақталады.')),
      h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('skills'); } }, 'Дағдыны өзім таңдаймын →')
    ], 'home');
  }

  // ------------------------------------------------------------ ДАҒДЫЛАР
  function screenSkills() {
    var p = profile();
    var focus = route.params.skill || null;
    return page([
      h('h1', null, 'Дағдыны таңдаңыз'),
      h('p', { class: 'muted' }, 'Әр дағдының өз сатысы бар. Сіздің сатыңыздағы сабақ белгіленген.'),
      E.SKILL_ORDER.map(function (s) {
        var sm = skillMeta(s);
        return h('section', { class: 'skill-section skill-' + s, id: 'skill-' + s },
          h('div', { class: 'skill-section-head' },
            h('span', { class: 'skill-icon big', 'aria-hidden': 'true' }, sm.icon),
            h('div', null, h('h2', null, sm.title), h('p', { class: 'muted small' }, sm.desc),
              h('p', { class: 'small' }, 'Сіздің сатыңыз: ', h('strong', null, stageLabel(p.stages[s])), ' (болжамды)'))),
          h('div', { class: 'lesson-list' }, E.lessonsForSkill(s).map(function (l) {
            var isCurrent = l.stage === p.stages[s];
            return h('div', { class: 'lesson-wrap' + (isCurrent ? ' current' : '') },
              isCurrent ? h('div', { class: 'current-label' }, '★ Сіздің сатыңыз') : null,
              lessonCard(l));
          })));
      })
    ], 'skills');
  }

  // ------------------------------------------------------------ САБАҚ
  var run = null;

  function startLesson(lessonId, ctxKey) {
    var p = profile();
    var lesson = E.getLesson(lessonId);
    var ctx = ctxKey || E.contextKeyFor(p);
    run = { mode: 'lesson', lesson: lesson, ctxKey: ctx, steps: E.buildLessonSteps(lesson, ctx, p, now()), i: 0, results: [], mistakes: [] };
    go('lesson');
  }

  function startReview() {
    var p = profile();
    var steps = E.buildReviewSteps(p, now());
    if (!steps.length) { go('home'); return; }
    run = { mode: 'review', lesson: null, steps: steps, i: 0, results: [], mistakes: [] };
    go('lesson');
  }

  function recordResult(step, ok, answerText) {
    var p = profile();
    var t = now();
    run.results.push({ phase: step.phase, ok: ok, reviewId: step.reviewId || null });
    if (step.reviewId) E.applyReview(p, step.reviewId, ok, t);
    if (!ok && step.task.type !== 'match') {
      var correct = step.task.type === 'choice' ? step.task.options[step.task.answer]
        : step.task.type === 'type' ? step.task.answers[0] : step.task.answer;
      var m = {
        at: t,
        where: run.lesson ? run.lesson.title : 'Қайталау',
        prompt: step.task.prompt + (step.task.sentence ? ' ' + step.task.sentence : ''),
        given: answerText,
        answer: correct,
        explain: step.task.explain
      };
      E.addMistake(p, m);
      run.mistakes.push(m);
    } else if (!ok) {
      run.mistakes.push({ at: t, where: run.lesson ? run.lesson.title : '', prompt: step.task.prompt, answer: 'Барлық жұп сәйкестендірілді, бірақ бірнеше әрекетпен.', explain: step.task.explain });
    }
    persist();
  }

  function nextStep() {
    run.i++;
    if (run.i >= run.steps.length) finishRun(); else go('lesson');
  }

  function finishRun() {
    var p = profile();
    var t = now();
    var summary;
    if (run.mode === 'lesson') {
      summary = E.completeLesson(p, run.lesson, run.ctxKey, run.results, t);
    } else {
      var ok = run.results.filter(function (r) { return r.ok; }).length;
      summary = { correct: ok, total: run.results.length };
    }
    persist();
    var finished = run;
    run = null;
    go('result', { run: finished, summary: summary });
  }

  function exitLesson() {
    FEA.ui.confirmDialog({ title: 'Сабақтан шығасыз ба?', text: 'Сабақ аяқталмаған болып қалады. Кейін қайта бастауға болады.', ok: 'Шығу', cancel: 'Жалғастыру' })
      .then(function (yes) { if (yes) { run = null; go('home'); } });
  }

  function screenLesson() {
    var step = run.steps[run.i];
    var progress = Math.round((run.i / run.steps.length) * 100);
    var title = run.mode === 'lesson' ? run.lesson.title : 'Қайталау';
    var content;

    if (step.kind === 'intro') content = introView(run.lesson, run.ctxKey);
    else if (step.kind === 'text') content = h('section', null,
      h('h2', { class: 'task-prompt' }, 'Мәтінді оқыңыз'),
      h('p', { class: 'muted small' }, 'Алдымен негізгі ойды түсінуге тырысыңыз. Әр сөзді аудару міндетті емес.'),
      textCard(step.text, false),
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Сұрақтарға көшу →'));
    else {
      var phaseLabel = { warmup: '🔁 Еске түсіру', review: '🔁 Қайталау', core: '✏️ Жаттығу', context: '📖 Мәтін бойынша' }[step.phase];
      content = h('div', null,
        h('div', { class: 'phase-label' }, phaseLabel),
        taskView(step.task, {
          text: step.text,
          dontKnow: step.task.type === 'choice' && (step.phase === 'warmup' || step.phase === 'review'),
          lesson: run.lesson, ctxKey: run.ctxKey,
          wrongNote: step.reviewId ? 'Бұл сұрақ ертең қайта шығады.' : 'Бұл тақырып сабақтан кейін қайталауға қосылады.',
          onResult: function (ok, ans) { recordResult(step, ok, ans); },
          onNext: nextStep,
          nextLabel: run.i === run.steps.length - 1 ? 'Аяқтау ✓' : 'Келесі →'
        }));
    }

    return [
      h('header', { class: 'lesson-top' },
        h('button', { class: 'icon-btn', 'aria-label': 'Сабақтан шығу', onclick: exitLesson }, '✕'),
        h('div', { class: 'lesson-top-mid' },
          h('div', { class: 'lesson-top-title' }, title),
          h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Сабақ барысы', 'aria-valuenow': String(progress), 'aria-valuemin': '0', 'aria-valuemax': '100' },
            h('div', { class: 'progress-bar', style: 'width:' + progress + '%' }))),
        h('div', { class: 'lesson-top-count muted small' }, (run.i + 1) + '/' + run.steps.length)),
      storageBanner(),
      h('main', { class: 'page lesson-page' }, h('div', { class: 'card card-pad' }, content))
    ];
  }

  function introView(lesson, ctxKey) {
    var w = E.lessonWords(lesson, ctxKey);
    function wordTile(x, theme) {
      return h('div', { class: 'word-tile' + (theme ? ' theme' : '') },
        h('div', { class: 'word-emoji', 'aria-hidden': 'true' }, x.emoji || '•'),
        h('div', { class: 'word-en', lang: 'en' }, x.en),
        h('div', { class: 'word-kk' }, x.kk),
        x.say ? h('div', { class: 'word-say' }, 'шамамен: «' + x.say + '»') : null);
    }
    return h('section', null,
      h('div', { class: 'goal' }, h('span', { class: 'goal-label' }, '🎯 Сабақтың мақсаты'), h('p', null, lesson.goal)),
      lesson.prereq ? h('p', { class: 'banner banner-info' }, lesson.prereq) : null,
      h('h2', { class: 'task-prompt' }, lesson.title),
      lesson.explain.map(function (para) { return h('p', null, para); }),
      h('h3', { class: 'sub' }, 'Мысалдар'),
      h('div', { class: 'examples' }, lesson.examples.map(function (ex) {
        return h('div', { class: 'example' }, h('div', { lang: 'en', class: 'ex-en' }, ex.en), h('div', { class: 'ex-kk' }, ex.kk));
      })),
      h('h3', { class: 'sub' }, 'Жаңа сөздер'),
      h('div', { class: 'word-grid' }, w.core.map(function (x) { return wordTile(x, false); }), w.theme.map(function (x) { return wordTile(x, true); })),
      w.theme.length ? h('p', { class: 'muted small' }, '🎨 Түспен белгіленген сөздер — сіз таңдаған тақырыптан.') : null,
      h('button', { class: 'btn btn-primary btn-block', onclick: nextStep }, 'Жаттығуларға көшу →'));
  }

  // ------------------------------------------------------------ НӘТИЖЕ
  function screenResult() {
    var r = route.params.run, s = route.params.summary;
    var p = profile();
    var lessonMistakes = r.mistakes || [];
    var rec = E.recommendNext(p, now());
    var isLesson = r.mode === 'lesson';

    return page([
      h('section', { class: 'card card-pad result' },
        h('div', { class: 'result-icon', 'aria-hidden': 'true' }, '✓'),
        h('h1', null, isLesson ? 'Сабақ аяқталды!' : 'Қайталау аяқталды!'),
        isLesson ? h('p', { class: 'muted' }, '«' + r.lesson.title + '» — ', h('strong', null, 'өтілді деп белгіленді.')) : null,
        h('p', { class: 'result-score' }, 'Бірінші әрекеттен дұрыс: ', h('strong', null, s.correct + ' / ' + s.total)),
        h('p', { class: 'muted small' }, s.total && s.correct / s.total < 0.6
          ? 'Бұл тақырып әлі жаңа — бұл қалыпты. Қайталау оны бекітуге көмектеседі.'
          : 'Жақсы нәтиже. Бірнеше күннен кейінгі қайталау оны есте берік сақтауға көмектеседі.'),
        isLesson ? h('p', { class: 'small' }, '🔁 Бұл сабақтың сұрақтары ертеңнен бастап қайталауға қосылды.') : null),
      h('section', { class: 'card card-pad' },
        h('h2', null, 'Қателер және түсіндірме'),
        lessonMistakes.length ? h('div', { class: 'mistake-list' }, lessonMistakes.map(mistakeItem))
          : h('p', { class: 'empty' }, 'Бұл жолы қате болмады. 🎉')),
      h('div', { class: 'stack' },
        rec.kind === 'lesson' ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startLesson(rec.lesson.id); } }, 'Келесі сабақ: ' + rec.lesson.title) : null,
        rec.kind === 'review' ? h('button', { class: 'btn btn-primary btn-block', onclick: function () { startReview(); } }, 'Қайталауды бастау') : null,
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('home'); } }, 'Басты бетке'))
    ]);
  }

  function mistakeItem(m) {
    return h('div', { class: 'mistake' },
      h('div', { class: 'muted small' }, m.where),
      h('div', { class: 'mistake-prompt' }, m.prompt),
      m.given ? h('div', { class: 'small' }, 'Сіздің жауабыңыз: ', h('span', { lang: 'en' }, m.given)) : null,
      h('div', { class: 'small' }, 'Дұрыс жауап: ', h('strong', { lang: 'en' }, m.answer)),
      m.explain ? h('p', { class: 'small muted' }, m.explain) : null);
  }

  // ------------------------------------------------------------ ПРОГРЕСС ЖӘНЕ БАПТАУЛАР
  function screenProgress() {
    var p = profile();
    var t = now();
    var due = E.countDue(p, t);
    var completed = Object.keys(p.lessons).map(function (id) { return { lesson: E.getLesson(id), rec: p.lessons[id] }; })
      .filter(function (x) { return x.lesson; })
      .sort(function (a, b) { return (b.rec.completedAtMs || 0) - (a.rec.completedAtMs || 0); });
    var it = interestMeta(p.interest);

    return page([
      h('h1', null, 'Менің прогресім'),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Дағдылар бойынша саты'),
        h('p', { class: 'muted small' }, 'Саты автоматты түрде өзгермейді. Жүйе тек ұсыныс береді, шешімді өзіңіз қабылдайсыз.'),
        E.SKILL_ORDER.map(function (s) {
          var sm = skillMeta(s);
          var prop = E.stageProposal(p, s);
          var stageBox = h('div');
          function redraw() {
            stageBox.innerHTML = '';
            stageBox.appendChild(stageStepperConfirm(s, redraw));
          }
          redraw();
          return h('div', { class: 'skill-progress skill-' + s },
            h('div', { class: 'skill-result-head' }, h('span', { class: 'skill-icon', 'aria-hidden': 'true' }, sm.icon), h('strong', null, sm.title)),
            stageBox,
            prop ? h('p', { class: 'banner ' + (prop.dir === 'up' ? 'banner-ok' : 'banner-info') }, prop.text) : null);
        }),
        h('p', { class: 'muted small' }, FEA.cefrDisclaimer)),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Өтілген сабақтар'),
        completed.length ? h('div', { class: 'list' }, completed.map(function (x) {
          return h('div', { class: 'list-row' },
            h('span', null, skillMeta(x.lesson.skill).icon + ' ' + x.lesson.title),
            h('span', { class: 'muted small' }, stageLabel(x.lesson.stage) + ' · ' + Math.round(x.rec.lastAccuracy * 100) + '% · ' + x.rec.times + ' рет'));
        })) : h('p', { class: 'empty' }, 'Әзірге аяқталған сабақ жоқ. Бірінші сабақтан бастаңыз!')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Қайталау'),
        h('p', null, 'Қайталаудағы сұрақтар: ', h('strong', null, String(Object.keys(p.reviews).length)), ' · бүгін: ', h('strong', null, String(due))),
        due ? h('button', { class: 'btn btn-secondary', onclick: function () { startReview(); } }, 'Қазір қайталау') : h('p', { class: 'muted small' }, 'Бүгін қайталайтын сұрақ жоқ.')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Соңғы қателер'),
        (p.mistakes || []).length ? h('div', { class: 'mistake-list' }, p.mistakes.slice(0, 8).map(mistakeItem))
          : h('p', { class: 'empty' }, 'Қате әзірге жоқ.')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Профиль'),
        h('div', { class: 'list-row' }, h('span', null, 'Аты: ', h('strong', null, p.name)),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('name', { edit: true }); } }, 'Өзгерту')),
        h('div', { class: 'list-row' }, h('span', null, 'Қызығушылық: ', h('strong', null, it ? it.title : '—'), p.otherTopic ? ' (' + p.otherTopic + ')' : ''),
          h('button', { class: 'btn btn-ghost btn-small', onclick: function () { go('interest', { edit: true }); } }, 'Өзгерту')),
        h('p', { class: 'muted small' }, 'Қызығушылықты өзгерту сатыңызды өзгертпейді — тек мәтіндер мен мысалдар ауысады.'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () { go('profiles'); } }, '👥 Профильді ауыстыру немесе жаңасын қосу')),

      h('section', { class: 'card card-pad' },
        h('h2', null, 'Деректер'),
        h('p', { class: 'small' }, '💾 Прогресс тек осы құрылғыда, осы браузерде сақталады. Басқа құрылғыға автоматты түрде көшпейді.'),
        h('button', { class: 'btn btn-ghost btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Осы профильдің прогресін тазалау керек пе?', text: '«' + p.name + '» профилінің диагностикасы, сабақтары, қайталаулары мен қателері өшіріледі. Аты мен қызығушылығы қалады.', ok: 'Тазалау', danger: true })
            .then(function (yes) {
              if (!yes) return;
              var fresh = store.newProfile(p.name);
              fresh.id = p.id; fresh.interest = p.interest; fresh.otherTopic = p.otherTopic;
              state.profiles[p.id] = fresh; persist(); go('diagIntro');
            });
        } }, 'Осы профильдің прогресін тазалау'),
        h('button', { class: 'btn btn-danger btn-block', onclick: function () {
          FEA.ui.confirmDialog({ title: 'Барлық деректерді өшіру керек пе?', text: 'Осы құрылғыдағы осы қосымшаның барлық профильдері мен прогресі өшіріледі. Басқа сайттар мен файлдарға әсер етпейді. Бұл әрекетті қайтару мүмкін емес.', ok: 'Барлығын өшіру', danger: true })
            .then(function (yes) { if (!yes) return; store.clearAll(); state = store.load(); go('welcome'); });
        } }, 'Осы құрылғыдағы барлық деректерді өшіру'))
    ], 'progress');
  }

  function stageStepperConfirm(skill, redraw) {
    var p = profile();
    var val = p.stages[skill];
    function change(delta) {
      var target = val + delta;
      FEA.ui.confirmDialog({
        title: delta > 0 ? 'Қиынырақ сатыға ауысу керек пе?' : 'Жеңілірек сатыға ауысу керек пе?',
        text: '«' + skillMeta(skill).title + '»: ' + stageLabel(val) + ' → ' + stageLabel(target) + '. Өтілген сабақтар мен қайталаулар сақталады.',
        ok: 'Ауысу'
      }).then(function (yes) { if (yes) { p.stages[skill] = target; persist(); render(); } });
    }
    return h('div', { class: 'stepper' },
      h('div', null, h('div', { class: 'stage-name' }, stageLabel(val)), h('div', { class: 'muted small' }, stageMeta(val).cefrHint)),
      h('div', { class: 'row-gap' },
        h('button', { class: 'btn btn-ghost btn-small', disabled: val <= 0, onclick: function () { change(-1); } }, '− Жеңілірек'),
        h('button', { class: 'btn btn-ghost btn-small', disabled: val >= FEA.stages.length - 1, onclick: function () { change(1); } }, 'Қиынырақ +')));
  }

  // ------------------------------------------------------------ рендер
  var screens = {
    welcome: screenWelcome, name: screenName, interest: screenInterest, profiles: screenProfiles,
    diagIntro: screenDiagIntro, diag: screenDiag, diagResult: screenDiagResult,
    home: screenHome, skills: screenSkills, lesson: screenLesson, result: screenResult, progress: screenProgress
  };

  function render() {
    var needsProfile = ['home', 'skills', 'progress', 'diagIntro', 'diag', 'diagResult', 'interest', 'lesson', 'result'];
    if (needsProfile.indexOf(route.name) !== -1 && !profile()) route = { name: startRoute(), params: {} };
    if (['home', 'skills', 'progress'].indexOf(route.name) !== -1) {
      var p = profile();
      if (!p.interest) route = { name: 'interest', params: {} };
      else if (!p.stages) route = { name: 'diagIntro', params: {} };
    }
    if (route.name === 'lesson' && !run) route = { name: 'home', params: {} };
    if (route.name === 'result' && !route.params.run) route = { name: 'home', params: {} };
    if (route.name === 'diag' && !diag) {
      diag = { i: 0, correct: { words: 0, grammar: 0, reading: 0 }, wrongInRow: { words: 0, grammar: 0, reading: 0 }, wrongIds: [], stoppedParts: [] };
    }
    var fn = screens[route.name] || screenWelcome;
    var out = fn();
    root.innerHTML = '';
    var list = Array.isArray(out) ? out : [out];
    list.forEach(function (n) { if (n) root.appendChild(n); });
    root.setAttribute('data-screen', route.name);
  }

  // Старт: загрузочный экран уже показан в index.html
  try {
    go(startRoute());
  } catch (e) {
    root.innerHTML = '';
    root.appendChild(h('div', { class: 'page' }, h('div', { class: 'card card-pad' },
      h('h1', null, 'Қате орын алды'),
      h('p', null, 'Қосымшаны жүктеу мүмкін болмады. Бетті жаңартып көріңіз.'),
      h('pre', { class: 'small muted' }, String(e && e.message || e)))));
    throw e;
  }
})();
