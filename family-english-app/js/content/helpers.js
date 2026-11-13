/*
 * Короткие конструкторы заданий для файлов с уроками.
 * Формат урока описан в README.md («Как добавить урок»).
 */
window.FEA = window.FEA || {};
FEA.lessons = FEA.lessons || [];

/* Выбор ответа. answer — индекс верного варианта. */
FEA.choice = function (prompt, options, answer, explain, extra) {
  return Object.assign({ type: 'choice', prompt: prompt, options: options, answer: answer, explain: explain }, extra || {});
};

/* Ввод ответа (вспоминание без подсказки). answers — все допустимые варианты. */
FEA.typed = function (prompt, answers, explain, extra) {
  return Object.assign({ type: 'type', prompt: prompt, answers: answers, explain: explain }, extra || {});
};

/* Порядок слов. answer — правильное предложение без конечного знака. */
FEA.order = function (prompt, words, answer, explain, extra) {
  return Object.assign({ type: 'order', prompt: prompt, words: words, answer: answer, explain: explain }, extra || {});
};

/* Сопоставление: пары строятся автоматически из новых слов урока. */
FEA.match = function (prompt, explain) {
  return { type: 'match', prompt: prompt, explain: explain || 'Барлық жұп табылды. Бұл сөздер кейінгі жаттығулар мен мәтінде тағы кездеседі.' };
};

/* Слово урока. say — примерное чтение кириллицей (только для начальных ступеней). */
FEA.word = function (en, kk, emoji, say) {
  return { en: en, kk: kk, emoji: emoji || '', say: say || '' };
};
