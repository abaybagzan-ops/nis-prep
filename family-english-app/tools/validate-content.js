#!/usr/bin/env node
/*
 * Проверка учебных данных без браузера.
 *   node tools/validate-content.js          — проверка
 *   node tools/validate-content.js --notes  — плюс список пометок для редактора
 *
 * Проверяет: наличие всех интересов, лимит тематических слов (≤ половины новых),
 * 4–6 основных заданий, верные индексы ответов, отсутствие дословных повторов
 * заданий внутри урока, уникальность id повторов, лимит глоссария.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var base = path.join(__dirname, '..', 'js', 'content');
var files = ['stages.js', 'helpers.js', 'diagnostic.js', 'lessons-stage0.js', 'lessons-stage1.js', 'lessons-stage2.js', 'lessons-stage3.js'];
var sandbox = { window: {} };
sandbox.window = sandbox;
vm.createContext(sandbox);
files.forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(base, f), 'utf8'), sandbox, { filename: f });
});
var FEA = sandbox.FEA;
var S = FEA.settings;
var errors = [];
var warnings = [];
function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }

var CONTEXTS = ['usa', 'mystery', 'sport', 'travel', 'everyday'];
var SKILLS = ['words', 'grammar', 'reading'];
var reviewIds = {};

function checkTask(t, where) {
  if (!t || !t.type) return err(where + ': нет типа задания');
  if (!t.prompt) err(where + ': нет формулировки');
  if (t.type !== 'match' && !t.explain) err(where + ': нет объяснения');
  if (t.type === 'choice') {
    if (!Array.isArray(t.options) || t.options.length < 2) err(where + ': мало вариантов');
    else if (typeof t.answer !== 'number' || !t.options[t.answer]) err(where + ': неверный индекс ответа');
    else if (new Set(t.options).size !== t.options.length) err(where + ': одинаковые варианты');
  }
  if (t.type === 'type' && (!Array.isArray(t.answers) || !t.answers.length)) err(where + ': нет допустимых ответов');
  if (t.type === 'order') {
    var a = t.words.slice().sort().join(' ').toLowerCase();
    var b = t.answer.split(/\s+/).sort().join(' ').toLowerCase();
    if (a !== b) err(where + ': слова не совпадают с ответом');
  }
}

function key(t) { return (t.prompt + '|' + (t.sentence || '') + '|' + (t.text ? t.text.join(' ') : '') + '|' + (t.sign ? t.sign.join(' ') : '')).toLowerCase(); }

// Ступени x навыки: по уроку на каждую клетку
FEA.stages.forEach(function (st) {
  SKILLS.forEach(function (sk) {
    if (!FEA.lessons.some(function (l) { return l.stage === st.id && l.skill === sk; })) err('Нет урока: ступень ' + st.id + ', навык ' + sk);
  });
});

FEA.lessons.forEach(function (l) {
  var w = 'Урок ' + l.id;
  ['title', 'goal'].forEach(function (f) { if (!l[f]) err(w + ': нет поля ' + f); });
  if (!l.explain || !l.explain.length) err(w + ': нет объяснения');
  if (!l.examples || !l.examples.length) err(w + ': нет примеров');
  if (!l.review || !l.review.length) err(w + ': нет вопросов для повторения');
  checkTask(l.warmup, w + ' разминка');
  l.tasks.forEach(function (t, i) { checkTask(t, w + ' задание ' + (i + 1)); });

  CONTEXTS.forEach(function (c) {
    var ctx = l.contexts[c];
    if (!ctx) return err(w + ': нет контекста ' + c);
    var core = l.words.length, theme = (ctx.themeWords || []).length;
    if (theme / (core + theme) > S.maxThemeWordShare + 1e-9) err(w + '/' + c + ': тематических слов больше половины (' + theme + ' из ' + (core + theme) + ')');
    var total = l.tasks.length + ctx.tasks.length;
    if (total < S.tasksPerLessonMin || total > S.tasksPerLessonMax) err(w + '/' + c + ': основных заданий ' + total + ' (нужно ' + S.tasksPerLessonMin + '–' + S.tasksPerLessonMax + ')');
    var gl = (ctx.text.glossary || []).length;
    if (gl > S.maxGlossaryByStage[l.stage]) warn(w + '/' + c + ': глоссарий ' + gl + ' слов');
    if (!ctx.text.title || !ctx.text.lines.length) err(w + '/' + c + ': пустой текст');
    // Тематическое слово должно встречаться в тексте (хотя бы корень)
    (ctx.themeWords || []).forEach(function (tw) {
      var stem = tw.en.toLowerCase().split(' ')[0].replace(/(e|y)$/, '').slice(0, 5);
      if (ctx.text.lines.join(' ').toLowerCase().indexOf(stem) === -1) warn(w + '/' + c + ': тематическое слово «' + tw.en + '» не встречается в тексте');
    });
    ctx.tasks.forEach(function (t, i) { checkTask(t, w + '/' + c + ' задание по тексту ' + (i + 1)); });
    // Дословные повторы внутри урока
    var all = [l.warmup].concat(l.tasks, ctx.tasks).filter(function (t) { return t.type !== 'match'; });
    var seen = {};
    all.forEach(function (t) {
      var k = key(t);
      if (seen[k]) err(w + '/' + c + ': повтор задания «' + t.prompt + '»');
      seen[k] = 1;
    });
  });

  l.review.forEach(function (r) {
    if (reviewIds[r.id]) err('Повтор id вопроса повторения: ' + r.id);
    reviewIds[r.id] = 1;
    checkTask(r, w + ' повторение ' + r.id);
  });
});

// Диагностика
var perSkill = {};
FEA.diagnostic.forEach(function (d) {
  perSkill[d.skill] = (perSkill[d.skill] || 0) + 1;
  checkTask(Object.assign({ type: 'choice' }, d), 'Диагностика ' + d.id);
  if (!d.review) err('Диагностика ' + d.id + ': нет вопроса для повторения');
  else {
    checkTask(d.review, 'Диагностика ' + d.id + ' повторение');
    if (key(d.review) === key(d)) err('Диагностика ' + d.id + ': повторение дословно совпадает с вопросом');
  }
});
SKILLS.forEach(function (s) { if (perSkill[s] !== 5) err('Диагностика: в части ' + s + ' должно быть 5 вопросов, есть ' + (perSkill[s] || 0)); });

console.log('Уроков: ' + FEA.lessons.length + ', вопросов диагностики: ' + FEA.diagnostic.length + ', вопросов повторения: ' + Object.keys(reviewIds).length);
warnings.forEach(function (m) { console.log('ВНИМАНИЕ: ' + m); });
errors.forEach(function (m) { console.log('ОШИБКА: ' + m); });

if (process.argv.indexOf('--notes') !== -1) {
  console.log('\n=== Пометки для редактора (ученику не показываются) ===');
  FEA.lessons.forEach(function (l) {
    (l.editorNotes || []).forEach(function (n) { console.log('[' + l.id + '] ' + n); });
  });
  (FEA.diagnosticEditorNotes || []).forEach(function (n) { console.log('[diagnostic] ' + n); });
}

if (errors.length) { console.log('\nПроверка НЕ пройдена: ' + errors.length + ' ошиб.'); process.exit(1); }
console.log('\nПроверка пройдена.');
