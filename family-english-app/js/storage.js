/*
 * Локальное хранение. Всё лежит в одном ключе localStorage этого браузера.
 * Нет сервера, нет аккаунтов, нет синхронизации.
 */
window.FEA = window.FEA || {};

FEA.storage = (function () {
  var KEY = 'familyEnglishApp.v1';
  var memoryFallback = null;   // если localStorage недоступен
  var available = true;

  function emptyState() {
    return { version: 1, activeProfileId: null, profiles: {} };
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return emptyState();
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || !data.profiles) return emptyState();
      return data;
    } catch (e) {
      available = false;
      return memoryFallback || emptyState();
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      available = true;
    } catch (e) {
      available = false;
      memoryFallback = state;
    }
  }

  /* Удаляет ТОЛЬКО данные этого приложения на этом устройстве. */
  function clearAll() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    memoryFallback = null;
  }

  function newId() {
    return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function newProfile(name) {
    return {
      id: newId(),
      name: name,
      interest: null,
      otherTopic: '',
      createdAt: new Date().toISOString(),
      diagnostic: null,          // { date, correct: {words, grammar, reading}, suggested: {...} }
      stages: null,              // текущие ступени по навыкам, меняет только ученик
      lessons: {},               // id -> { completedAt, times, lastAccuracy, bestAccuracy, contextsUsed: [] }
      reviews: {},               // id -> { box, due, added, correct, wrong, lastAt }
      mistakes: [],              // последние ошибки
      reviewLog: []              // { id, skill, ok, at } — для предложения о смене ступени
    };
  }

  return {
    KEY: KEY,
    load: load,
    save: save,
    clearAll: clearAll,
    newProfile: newProfile,
    isAvailable: function () { return available; }
  };
})();
