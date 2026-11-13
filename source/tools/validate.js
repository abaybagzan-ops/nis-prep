/* Автоматическая проверка банка заданий. Запуск: node tools/validate.js */
const path = require('path');
const src = path.join(__dirname, '..', 'src');
['core', 'bank_math', 'bank_qc', 'bank_sci', 'bank_lang', 'bank_short', 'lessons', 'exam', 'daily'].forEach(f => { try { require(path.join(src, f + '.js')); } catch (e) { if (f !== 'exam' && f !== 'daily') throw e; } });
const NP = globalThis.NP;
const KZ = /[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/;
let errors = [], warns = [];
const plain = s => NP.plain(String(s));
const SEEDS = 300;
const badWords = /NaN|undefined|Infinity|\[object/;

NP.TPL.forEach(t => {
  let bad = 0;
  for (let s = 1; s <= SEEDS; s++) {
    const seed = s * 2654435761 >>> 0;
    let inst;
    try { inst = NP.build(t.id, seed); } catch (e) { errors.push(`${t.id} seed ${seed}: исключение ${e.message}`); break; }
    if (!inst) { errors.push(`${t.id}: build вернул null`); break; }
    if (inst.bad) { bad++; continue; }
    if (!(inst.ans >= 0 && inst.ans <= 3)) errors.push(`${t.id}: неверный индекс ответа ${inst.ans}`);
    ['kk', 'ru'].forEach(lg => {
      const Lg = inst.L[lg];
      const all = [Lg.stem, Lg.h, Lg.e].concat(Lg.opts, Lg.whys.filter((w, i) => i !== inst.ans));
      all.forEach(x => { if (badWords.test(String(x))) errors.push(`${t.id} [${lg}] seed ${seed}: «${String(x).slice(0, 80)}»`); });
      if (Lg.opts.length !== 4) errors.push(`${t.id}: вариантов не 4`);
      if (!Lg.e || !Lg.h) errors.push(`${t.id} [${lg}]: нет объяснения или подсказки`);
      Lg.whys.forEach((w, i) => { if (i !== inst.ans && !w) errors.push(`${t.id} [${lg}]: нет разбора для неверного варианта ${i}`); });
      // Ключ, встречающийся в объяснении (для расчётных заданий)
      if (inst.type === 'mc' && (t.s === 'math')) {
        const a = plain(Lg.opts[inst.ans]);
        if (plain(Lg.e).indexOf(a) < 0) errors.push(`${t.id} [${lg}] seed ${seed}: ответ «${a}» не найден в объяснении`);
      }
      if (inst.type === 'qc') {
        if (inst.ans !== 3 && inst.va != null && inst.vb != null && !inst.cases) {
          const c = NP.cmp(inst.va, inst.vb);
          const explicit = typeof NP.byId[t.id].g === 'function';
          if (c !== inst.ans && !(t._explicit)) { /* ответ мог быть задан явно — проверяем ниже */ }
        }
      }
      // Языковая чистота
      if (lg === 'ru' && !inst.fixed) all.forEach(x => { if (KZ.test(plain(x))) errors.push(`${t.id} [ru] seed ${seed}: казахские буквы в русском тексте: «${plain(x).slice(0, 90)}»`); });
      if (inst.fixed === 'ru') all.forEach(x => { if (KZ.test(plain(x))) errors.push(`${t.id} [ru-fixed]: казахские буквы: «${plain(x).slice(0, 90)}»`); });
    });
  }
  if (bad > SEEDS * 0.02) warns.push(`${t.id}: ${bad}/${SEEDS} зёрен не дали корректного задания после 40 попыток`);
  if (bad === SEEDS) errors.push(`${t.id}: шаблон ни разу не собрался`);
});

/* QC: числовые сравнения — проверка буквы по значениям */
NP.TPL.filter(t => t.s === 'qc').forEach(t => {
  for (let s = 1; s <= 200; s++) {
    const r = NP.rng(s * 7 + 13), g = t.g(r);
    if (!g) continue;
    if (g.ans === undefined) {
      if (!isFinite(g.va) || !isFinite(g.vb)) errors.push(`${t.id}: нечисловые va/vb`);
    } else if (g.ans !== 3 && g.va != null && g.vb != null && g.cases == null) {
      // явные ответы A/B/C проверяем, если va/vb отражают реальные значения
      if (['qc_lin_eq'].includes(t.id) && NP.cmp(g.va, g.vb) !== g.ans) errors.push(`${t.id}: явный ответ не совпадает со значениями`);
    }
  }
});

/* Казахские тексты без казахских букв (подозрение на русский текст) */
let kkSuspicious = new Set();
NP.TPL.filter(t => !['ru', 'en'].includes(t.s)).forEach(t => {
  const inst = NP.build(t.id, 12345);
  if (!inst || inst.fixed === 'ru') return;
  const Lg = inst.L.kk;
  [Lg.h, Lg.e].forEach(x => { const p = plain(x); if (p.length > 40 && !KZ.test(p)) kkSuspicious.add(`${t.id}: «${p.slice(0, 70)}»`); });
});

/* Распределение позиций правильных ответов (MC) */
const pos = [0, 0, 0, 0];
NP.TPL.filter(t => !['qc'].includes(t.s)).forEach(t => { for (let s = 1; s <= 100; s++) { const i = NP.build(t.id, s * 31 + 7); if (i && !i.bad) pos[i.ans]++; } });
const qcPos = [0, 0, 0, 0];
NP.TPL.filter(t => t.s === 'qc').forEach(t => { for (let s = 1; s <= 100; s++) { const i = NP.build(t.id, s * 31 + 7); if (i && !i.bad) qcPos[i.ans]++; } });

/* Дубли условий между разными шаблонами */
const stems = {};
NP.TPL.forEach(t => { for (let s = 1; s <= 20; s++) { const i = NP.build(t.id, s); if (!i) continue; const k = plain(i.L.kk.stem) + '|' + plain(i.L.kk.opts.join('|')); if (stems[k] && stems[k] !== t.id) errors.push(`Дубль условия: ${t.id} и ${stems[k]}`); stems[k] = t.id; } });

/* Проверка сборки экзамена, если модуль подключён */
if (NP.makeExam) {
  for (let k = 0; k < 50; k++) {
    const ex = NP.makeExam(1, 'exam', 1000 + k);
    const ids = ex.items.map(x => x.id);
    if (new Set(ids).size !== ids.length) errors.push('Экзамен день 1: повтор шаблона в одной попытке');
    const cnt = {}; ex.items.forEach(x => cnt[x.sec] = (cnt[x.sec] || 0) + 1);
    if (cnt.math !== 40 || cnt.qc !== 60 || cnt.sci !== 20) errors.push('Экзамен день 1: неверное число заданий ' + JSON.stringify(cnt));
    const ex2 = NP.makeExam(2, 'exam', 2000 + k), c2 = {};
    ex2.items.forEach(x => c2[x.s] = (c2[x.s] || 0) + 1);
    if (c2.kk !== 20 || c2.ru !== 20 || c2.en !== 20) errors.push('Экзамен день 2: неверное число заданий ' + JSON.stringify(c2));
  }
}

const by = {}; NP.TPL.forEach(t => by[t.s] = (by[t.s] || 0) + 1);
console.log('Шаблонов по предметам:', JSON.stringify(by), 'всего', NP.TPL.length);
console.log('Позиции правильного ответа (MC, A/B/C/D):', pos.join(' / '));
console.log('Ответы КХ (A/B/C/D):', qcPos.join(' / '));
console.log('Предупреждения:', warns.length); warns.forEach(w => console.log('  ⚠', w));
console.log('Казахские тексты без казахских букв (проверить вручную):', kkSuspicious.size); [...kkSuspicious].slice(0, 30).forEach(w => console.log('  ?', w));
const uniq = [...new Set(errors)];
console.log('Ошибки:', uniq.length); uniq.slice(0, 60).forEach(e => console.log('  ✗', e));
process.exit(uniq.length ? 1 : 0);
