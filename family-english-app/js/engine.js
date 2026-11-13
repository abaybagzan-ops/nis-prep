/*
 * Учебная логика: сборка урока, проверка ответов, повторение,
 * рекомендация следующего занятия, предложения о смене ступени.
 * Интерфейса здесь нет — только данные и правила.
 */
window.FEA = window.FEA || {};

FEA.engine = (function () {
  var S = FEA.settings;
  var DAY = 24 * 60 * 60 * 1000;
  var SKILL_ORDER = ['words', 'grammar', 'reading'];

  // ---------- Индексы контента
  var lessonsById = {};
  FEA.lessons.forEach(function (l) { lessonsById[l.id] = l; });

  var reviewItems = {};   // id -> item (+ skill, stage, source)
  FEA.lessons.forEach(function (l) {
    (l.review || []).forEach(function (r) {
      reviewItems[r.id] = Object.assign({ skill: l.skill, stage: l.stage, source: l.id }, r);
    });
  });
  FEA.diagnostic.forEach(function (d) {
    var id = d.id + '-r';
    reviewItems[id] = Object.assign({ id: id, skill: d.skill, stage: null, source: 'diagnostic' }, d.review);
  });

  function getLesson(id) { return lessonsById[id] || null; }
  function lessonFor(stage, skill) { return lessonsById['s' + stage + '-' + skill] || null; }
  function lessonsForSkill(skill) {
    return FEA.lessons.filter(function (l) { return l.skill === skill; })
      .sort(function (a, b) { return a.stage - b.stage; });
  }

  // ---------- Утилиты
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/[.,!?;:"«»()—–\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Порядок вариантов перемешивается; возвращает [{text, correct}] */
  function shuffledOptions(task) {
    var opts = task.options.map(function (t, i) { return { text: t, correct: i === task.answer }; });
    return shuffle(opts);
  }

  /* Порядок слов: гарантируем, что перемешанный порядок не совпадает с ответом. */
  function shuffledWords(task) {
    var w = task.words.slice();
    for (var k = 0; k < 10; k++) {
      var s = shuffle(w);
      if (normalize(s.join(' ')) !== normalize(task.answer)) return s;
    }
    return w.slice().reverse();
  }

  function checkTyped(task, value) {
    var v = normalize(value);
    if (!v) return false;
    return task.answers.some(function (a) { return normalize(a) === v; });
  }

  function checkOrder(task, tokens) {
    return normalize(tokens.join(' ')) === normalize(task.answer);
  }

  function contextKeyFor(profile) {
    var it = FEA.interests.filter(function (i) { return i.id === profile.interest; })[0];
    return it ? it.context : 'everyday';
  }

  function lessonWords(lesson, ctxKey) {
    var ctx = lesson.contexts[ctxKey] || lesson.contexts.everyday;
    return {
      core: lesson.words.slice(),
      theme: (ctx.themeWords || []).slice()
    };
  }

  // ---------- Повторение
  function dueReviewIds(profile, now, limit, exclude) {
    exclude = exclude || [];
    var ids = Object.keys(profile.reviews || {}).filter(function (id) {
      var r = profile.reviews[id];
      return reviewItems[id] && r.due <= now && exclude.indexOf(id) === -1;
    });
    // Сначала самые просроченные, затем те, где были ошибки
    ids.sort(function (a, b) {
      var ra = profile.reviews[a], rb = profile.reviews[b];
      if (ra.due !== rb.due) return ra.due - rb.due;
      return (rb.wrong || 0) - (ra.wrong || 0);
    });
    return typeof limit === 'number' ? ids.slice(0, limit) : ids;
  }

  function countDue(profile, now) { return dueReviewIds(profile, now).length; }

  function scheduleReview(profile, id, now) {
    if (!profile.reviews[id]) {
      profile.reviews[id] = { box: 0, due: now + S.reviewIntervalsDays[0] * DAY, added: now, correct: 0, wrong: 0, lastAt: null };
    }
  }

  /* Результат повторения: верно -> следующий интервал, неверно -> снова через 1 день. */
  function applyReview(profile, id, ok, now) {
    var r = profile.reviews[id];
    if (!r) { scheduleReview(profile, id, now); r = profile.reviews[id]; }
    var intervals = S.reviewIntervalsDays;
    if (ok) {
      r.box = Math.min(r.box + 1, intervals.length - 1);
      r.correct = (r.correct || 0) + 1;
      r.due = now + intervals[r.box] * DAY;
    } else {
      r.box = 0;
      r.wrong = (r.wrong || 0) + 1;
      r.due = now + intervals[0] * DAY;
    }
    r.lastAt = now;
    var item = reviewItems[id];
    profile.reviewLog = profile.reviewLog || [];
    profile.reviewLog.push({ id: id, skill: item ? item.skill : null, source: item ? item.source : null, ok: ok, at: now });
    if (profile.reviewLog.length > 300) profile.reviewLog = profile.reviewLog.slice(-300);
  }

  function addMistake(profile, m) {
    profile.mistakes = profile.mistakes || [];
    profile.mistakes.unshift(m);
    if (profile.mistakes.length > S.mistakesKept) profile.mistakes.length = S.mistakesKept;
  }

  // ---------- Сборка урока
  /*
   * Шаги: разминка (вспоминание) -> до N повторов -> введение -> основные задания
   * (узнавание -> вспоминание -> применение) -> текст -> задания по тексту.
   */
  function buildLessonSteps(lesson, ctxKey, profile, now) {
    var ctx = lesson.contexts[ctxKey] || lesson.contexts.everyday;
    var own = (lesson.review || []).map(function (r) { return r.id; });
    var steps = [];
    steps.push({ kind: 'task', phase: 'warmup', task: lesson.warmup });
    dueReviewIds(profile, now, S.reviewsInLesson, own).forEach(function (id) {
      steps.push({ kind: 'task', phase: 'review', task: reviewItems[id], reviewId: id });
    });
    steps.push({ kind: 'intro' });
    lesson.tasks.forEach(function (t) {
      steps.push({ kind: 'task', phase: 'core', task: t });
    });
    steps.push({ kind: 'text', text: ctx.text });
    ctx.tasks.forEach(function (t) {
      steps.push({ kind: 'task', phase: 'context', task: t, text: ctx.text });
    });
    return steps;
  }

  function buildReviewSteps(profile, now) {
    return dueReviewIds(profile, now, S.reviewSessionSize).map(function (id) {
      return { kind: 'task', phase: 'review', task: reviewItems[id], reviewId: id };
    });
  }

  /* Пары для сопоставления: новые слова урока (ядро + тематические). */
  function matchPairs(lesson, ctxKey) {
    var w = lessonWords(lesson, ctxKey);
    return w.core.concat(w.theme).slice(0, 5).map(function (x) { return { en: x.en, kk: x.kk }; });
  }

  /*
   * Завершение урока. results: [{phase, ok, task, answer, reviewId}]
   * Точность считается только по основным заданиям и заданиям по тексту.
   */
  function completeLesson(profile, lesson, ctxKey, results, now) {
    var scored = results.filter(function (r) { return r.phase === 'core' || r.phase === 'context'; });
    var ok = scored.filter(function (r) { return r.ok; }).length;
    var acc = scored.length ? ok / scored.length : 0;
    var rec = profile.lessons[lesson.id] || { times: 0, bestAccuracy: 0, contextsUsed: [] };
    rec.times += 1;
    rec.completedAt = new Date(now).toISOString();
    rec.completedAtMs = now;
    rec.lastAccuracy = acc;
    rec.bestAccuracy = Math.max(rec.bestAccuracy || 0, acc);
    if (rec.contextsUsed.indexOf(ctxKey) === -1) rec.contextsUsed.push(ctxKey);
    profile.lessons[lesson.id] = rec;
    (lesson.review || []).forEach(function (r) { scheduleReview(profile, r.id, now); });
    return { correct: ok, total: scored.length, accuracy: acc };
  }

  // ---------- Рекомендация
  function completedCount(profile, skill) {
    return Object.keys(profile.lessons).filter(function (id) {
      var l = lessonsById[id]; return l && l.skill === skill;
    }).length;
  }

  function recommendNext(profile, now) {
    var candidates = SKILL_ORDER.map(function (skill) {
      return lessonFor(profile.stages[skill], skill);
    }).filter(function (l) { return l && !profile.lessons[l.id]; });

    if (candidates.length) {
      candidates.sort(function (a, b) {
        var d = completedCount(profile, a.skill) - completedCount(profile, b.skill);
        return d !== 0 ? d : SKILL_ORDER.indexOf(a.skill) - SKILL_ORDER.indexOf(b.skill);
      });
      return { kind: 'lesson', lesson: candidates[0] };
    }
    if (countDue(profile, now) > 0) return { kind: 'review' };
    return { kind: 'allDone' };
  }

  // ---------- Предложение сменить ступень (никогда не применяется автоматически)
  function stageProposal(profile, skill) {
    var stage = profile.stages[skill];
    var lesson = lessonFor(stage, skill);
    if (!lesson) return null;
    var rec = profile.lessons[lesson.id];
    if (!rec) return null;
    var after = (profile.reviewLog || []).filter(function (e) {
      return e.skill === skill && e.ok && e.source !== 'diagnostic' && e.at > (rec.completedAtMs || 0);
    }).length;
    if (rec.bestAccuracy >= S.proposeUpMinAccuracy && after >= S.proposeUpMinLaterReviews && lessonFor(stage + 1, skill)) {
      return { dir: 'up', text: 'Сабақ жақсы өтті және кейінгі қайталауларда да есіңізде қалды. Келесі сатыны байқап көруге болады.' };
    }
    if (rec.bestAccuracy >= S.proposeUpMinAccuracy && lessonFor(stage + 1, skill)) {
      return { dir: 'wait', text: 'Сабақ жақсы өтті. Келесі сатыны ұсыну үшін алдымен бірнеше күннен кейін қайталауды орындаңыз — бұл есте сақталғанын көрсетеді.' };
    }
    if (rec.lastAccuracy <= S.proposeDownMaxAccuracy && stage > 0) {
      return { dir: 'down', text: 'Бұл саты әзірге қиындау болуы мүмкін. Сабақты басқа мәтінмен қайталауға немесе жеңілірек сатыға ауысуға болады.' };
    }
    return null;
  }

  // ---------- Диагностика
  function diagStage(correctCount) {
    var map = S.diagScoreToStage;
    return map[Math.max(0, Math.min(correctCount, map.length - 1))];
  }

  return {
    SKILL_ORDER: SKILL_ORDER,
    DAY: DAY,
    getLesson: getLesson,
    lessonFor: lessonFor,
    lessonsForSkill: lessonsForSkill,
    reviewItems: reviewItems,
    normalize: normalize,
    shuffledOptions: shuffledOptions,
    shuffledWords: shuffledWords,
    shuffle: shuffle,
    checkTyped: checkTyped,
    checkOrder: checkOrder,
    contextKeyFor: contextKeyFor,
    lessonWords: lessonWords,
    dueReviewIds: dueReviewIds,
    countDue: countDue,
    scheduleReview: scheduleReview,
    applyReview: applyReview,
    addMistake: addMistake,
    buildLessonSteps: buildLessonSteps,
    buildReviewSteps: buildReviewSteps,
    matchPairs: matchPairs,
    completeLesson: completeLesson,
    recommendNext: recommendNext,
    stageProposal: stageProposal,
    diagStage: diagStage
  };
})();
