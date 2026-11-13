/*
 * Ступень 0 — «Нөлден бастау» (ориентир A0 / Pre-A1, предварительно).
 * Все тексты оригинальные и вымышленные.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, O = FEA.order, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's0-words',
    stage: 0,
    skill: 'words',
    title: 'Алғашқы сөздер',
    goal: 'Сәлемдесу мен алғыс айту сөздерін және өз тақырыбыңыздағы екі затты тану, еске түсіру және жаза білу.',
    explain: [
      'Бүгін 4 жаңа сөз үйренеміз: екеуі күнде керек сөздер, екеуі өзіңіз таңдаған тақырыптан.',
      'Ағылшын сөзі жазылуынан басқаша оқылуы мүмкін. Жақша ішінде шамамен қалай оқылатыны жазылған — бұл тек көмекші белгі.'
    ],
    examples: [
      { en: 'Hello, Aru!', kk: 'Сәлем, Ару!' },
      { en: 'Thank you, Mom!', kk: 'Рақмет, анашым!' }
    ],
    words: [
      W('hello', 'сәлем', '👋', 'хэлоу'),
      W('thank you', 'рақмет', '🙏', 'сэнк ю')
    ],
    warmup: C('Бұл сөзді танисыз ба? Мағынасын таңдаңыз.', ['такси', 'үй', 'нан'], 0,
      'TAXI — такси. Кейбір ағылшын сөздерін бұрыннан білесіз.', { sign: ['TAXI 🚕'] }),
    tasks: [
      M('Сөзді мағынасымен сәйкестендіріңіз.'),
      C('Досыңыз сізге көмектесті. Не дейсіз?', ['Thank you!', 'Hello!', 'Goodbye!'], 0,
        'Thank you — рақмет. Hello — кездескенде айтылады, Goodbye — қоштасқанда.'),
      T('Ағылшынша жазыңыз: сәлем', ['hello'],
        'сәлем — hello. Жазылуында екі l бар: h-e-l-l-o.')
    ],
    contexts: {
      usa: {
        themeWords: [W('car', 'көлік', '🚗', 'кар'), W('city', 'қала', '🏙️', 'сити')],
        text: {
          title: 'My city',
          lines: ['Hello! This is my city.', 'This is my car.', 'Thank you!'],
          glossary: [{ en: 'this is', kk: 'бұл' }, { en: 'my', kk: 'менің' }]
        },
        tasks: [
          C('Мәтінде қай зат аталады?', ['🚗 car', '🧳 bag', '🗝️ key'], 0,
            'Мәтінде: This is my car — Бұл менің көлігім.'),
          C('«city» сөзі нені білдіреді?', ['қала', 'көлік', 'үй'], 0,
            'city — қала. Мәтінде: This is my city — Бұл менің қалам.')
        ]
      },
      mystery: {
        themeWords: [W('key', 'кілт', '🗝️', 'ки'), W('door', 'есік', '🚪', 'дор')],
        text: {
          title: 'The old door',
          lines: ['Hello, old door!', 'This is my key.', 'Thank you, key!'],
          glossary: [{ en: 'old', kk: 'ескі' }, { en: 'this is my', kk: 'бұл менің' }]
        },
        tasks: [
          C('Мәтіндегі адамда не бар?', ['🗝️ key', '🚗 car', '📱 phone'], 0,
            'This is my key — Бұл менің кілтім.'),
          C('Адам кіммен (немен) сәлемдеседі?', ['ескі есікпен', 'кілтпен', 'досымен'], 0,
            'Hello, old door! — Сәлем, ескі есік!')
        ]
      },
      sport: {
        themeWords: [W('gym', 'спорт зал', '🏋️', 'джим'), W('coach', 'жаттықтырушы', '🧑‍🏫', 'коуч')],
        text: {
          title: 'At the gym',
          lines: ['Hello, coach!', 'This is my gym.', 'Thank you, coach!'],
          glossary: [{ en: 'this is', kk: 'бұл' }, { en: 'my', kk: 'менің' }]
        },
        tasks: [
          C('Бала кіммен сәлемдеседі?', ['жаттықтырушымен', 'дәрігермен', 'досымен'], 0,
            'Hello, coach! — Сәлеметсіз бе, жаттықтырушы!'),
          C('«gym» сөзі нені білдіреді?', ['спорт зал', 'дүкен', 'мектеп'], 0,
            'gym — спорт зал. Мәтінде: This is my gym.')
        ]
      },
      travel: {
        themeWords: [W('bag', 'сөмке', '🧳', 'бэг'), W('ticket', 'билет', '🎫', 'тикит')],
        text: {
          title: 'Ready to go',
          lines: ['Hello!', 'This is my bag.', 'This is my ticket.', 'Thank you!'],
          glossary: [{ en: 'this is', kk: 'бұл' }, { en: 'my', kk: 'менің' }]
        },
        tasks: [
          C('Мәтінде қандай екі зат аталады?', ['🧳 сөмке және 🎫 билет', '🚗 көлік және 🏙️ қала', '💧 су және 📱 телефон'], 0,
            'This is my bag (сөмке). This is my ticket (билет).'),
          C('Мәтіннің соңында адам не дейді?', ['Рақмет!', 'Сәлем!', 'Сау болыңыз!'], 0,
            'Соңғы сөз — Thank you! — Рақмет!')
        ]
      },
      everyday: {
        themeWords: [W('water', 'су', '💧', 'уотэр'), W('phone', 'телефон', '📱', 'фоун')],
        text: {
          title: 'At home',
          lines: ['Hello, Mom!', 'This is my phone.', 'This is water.', 'Thank you!'],
          glossary: [{ en: 'this is', kk: 'бұл' }, { en: 'my', kk: 'менің' }]
        },
        tasks: [
          C('Мәтінде қай зат аталады?', ['📱 phone', '🗝️ key', '🎫 ticket'], 0,
            'This is my phone — Бұл менің телефоным.'),
          C('«water» сөзі нені білдіреді?', ['су', 'нан', 'шай'], 0,
            'water — су. Мәтінде: This is water — Бұл — су.')
        ]
      }
    },
    review: [
      { id: 's0-words-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: рақмет', answers: ['thank you', 'thanks'],
        explain: 'рақмет — thank you (қысқаша: thanks).' },
      { id: 's0-words-r2', type: 'choice', prompt: 'Біреумен кездескенде не дейміз?', options: ['Hello!', 'Thank you!', 'Yes!'], answer: 0,
        explain: 'Кездескенде — Hello! (Сәлем!)' }
    ],
    editorNotes: [
      'Примерное чтение кириллицей (хэлоу, сэнк ю, уотэр и т.д.) — приближение; проверить методистом, решить, оставлять ли его.',
      'Отношение к собеседнику: «Сәлеметсіз бе, жаттықтырушы!» как перевод «Hello, coach!» — проверить естественность.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's0-grammar',
    stage: 0,
    skill: 'grammar',
    title: 'I am ... / It is ...',
    goal: 'Өзіңіз және бір зат туралы қысқа сөйлем құрау: I am ..., It is ...',
    explain: [
      'Қазақша «Мен дайынмын» дегенде «-мын» жалғауы сөздің соңына жалғанады. Ағылшынша оның орнына бөлек сөз керек — am.',
      'Өзіңіз туралы: I am ... Зат туралы: It is ... Қазақшадағы «ол» зат туралы айтқанда ағылшынша it болады.',
      'Бұл бөлек сөзді түсіріп алмаңыз: ағылшынша онсыз сөйлем толық болмайды.'
    ],
    examples: [
      { en: 'I am at home.', kk: 'Мен үйдемін.' },
      { en: 'It is new.', kk: 'Ол жаңа.' }
    ],
    words: [
      W('ready', 'дайын', '✅', 'рэди'),
      W('happy', 'көңілді, бақытты', '🙂', 'хэпи')
    ],
    warmup: C('Еске түсіріңіз: «рақмет» ағылшынша қалай?', ['thank you', 'hello', 'yes'], 0,
      'рақмет — thank you.'),
    tasks: [
      C('Бос орынға қай сөз келеді?', ['am', 'is', 'are'], 0,
        'Өзіңіз туралы айтқанда I сөзімен am келеді: I am happy.', { sentence: 'I ___ happy.' }),
      O('Сөздерді дұрыс ретпен қойыңыз.', ['is', 'ready', 'It'], 'It is ready',
        'Алдымен It, содан кейін is, соңында сипаттама: It is ready — Ол дайын.'),
      T('Сөйлемде бір сөз жетіспейді. Толық жазыңыз:', ['i am ready', "i'm ready"],
        'am жетіспей тұр: I am ready. Қазақшадағы «-мын» ағылшынша бөлек сөз — am.', { sentence: 'I ready.' })
    ],
    contexts: {
      usa: {
        themeWords: [W('store', 'дүкен', '🏪', 'стор')],
        text: {
          title: 'In the store',
          lines: ['I am Sam.', 'I am in a store.', 'The store is big.', 'I am happy.'],
          glossary: [{ en: 'in', kk: 'ішінде' }, { en: 'big', kk: 'үлкен' }]
        },
        tasks: [
          C('Сэм қайда?', ['дүкенде', 'үйде', 'қонақүйде'], 0, 'I am in a store — Мен дүкендемін.'),
          C('«The store is big» деген сөйлемнің мағынасы қандай?', ['Дүкен үлкен.', 'Дүкен жабық.', 'Дүкен кішкентай.'], 0,
            'big — үлкен. Дүкен туралы is қолданылған: The store is big.')
        ]
      },
      mystery: {
        themeWords: [W('box', 'қорап', '📦', 'бокс')],
        text: {
          title: 'The box',
          lines: ['I am Aru.', 'This is a box.', 'It is old.', 'I am ready!'],
          glossary: [{ en: 'old', kk: 'ескі' }, { en: 'this is', kk: 'бұл' }]
        },
        tasks: [
          C('Қорап қандай?', ['ескі', 'жаңа', 'үлкен'], 0, 'It is old — Ол ескі. Мұнда it — қорап.'),
          C('Ару соңында не дейді?', ['Мен дайынмын!', 'Мен шаршадым!', 'Мен үйдемін!'], 0,
            'I am ready! — Мен дайынмын!')
        ]
      },
      sport: {
        themeWords: [W('strong', 'күшті', '💪', 'стронг')],
        text: {
          title: 'Dias',
          lines: ['I am Dias.', 'I am in the gym.', 'I am strong.', 'I am ready!'],
          glossary: [{ en: 'in', kk: 'ішінде' }, { en: 'gym', kk: 'спорт зал' }]
        },
        tasks: [
          C('Дияс қайда?', ['спорт залда', 'мектепте', 'дүкенде'], 0, 'I am in the gym — Мен спорт залдамын.'),
          C('Дияс өзін қандаймын дейді?', ['күшті', 'шаршаған', 'кішкентай'], 0, 'I am strong — Мен күштімін.')
        ]
      },
      travel: {
        themeWords: [W('hotel', 'қонақүй', '🏨', 'хоутэл')],
        text: {
          title: 'At the hotel',
          lines: ['I am at the hotel.', 'The hotel is new.', 'My room is ready.', 'I am happy.'],
          glossary: [{ en: 'new', kk: 'жаңа' }, { en: 'room', kk: 'бөлме' }]
        },
        tasks: [
          C('Қонақүй қандай?', ['жаңа', 'ескі', 'кішкентай'], 0, 'The hotel is new — Қонақүй жаңа.'),
          C('Не дайын?', ['бөлме', 'таңғы ас', 'такси'], 0, 'My room is ready — Менің бөлмем дайын.')
        ]
      },
      everyday: {
        themeWords: [W('home', 'үй', '🏠', 'хоум')],
        text: {
          title: 'My home',
          lines: ['My home is small.', 'It is warm.', 'I am happy here.'],
          glossary: [{ en: 'small', kk: 'кішкентай' }, { en: 'warm', kk: 'жылы' }, { en: 'here', kk: 'осында' }]
        },
        tasks: [
          C('Үй қандай?', ['кішкентай', 'үлкен', 'ескі'], 0, 'My home is small — Менің үйім кішкентай.'),
          C('Адамның көңіл күйі қандай?', ['көңілді', 'шаршаған', 'дайын емес'], 0, 'I am happy here — Мен осында бақыттымын.')
        ]
      }
    },
    review: [
      { id: 's0-grammar-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: Мен көңілдімін.', answers: ['i am happy', "i'm happy"],
        explain: 'Мен көңілдімін — I am happy. am сөзін ұмытпаңыз.' },
      { id: 's0-grammar-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'It ___ new.', options: ['is', 'am', 'are'], answer: 0,
        explain: 'Зат туралы — it is.' }
    ],
    editorNotes: [
      'Объяснение «-мын жалғауы ↔ am» — упрощённое сопоставление; проверить специалистом по казахскому (термин «жалғау», формулировка).',
      'Перевод «It is new — Ол жаңа» без контекста; проверить естественность.'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's0-reading',
    stage: 0,
    skill: 'reading',
    title: 'Белгіден ақпарат табу',
    goal: 'Қысқа жазудан (белгі, карточка, табло) уақытты, күнді және орынды табу.',
    explain: [
      'Белгілерде толық сөйлем аз болады. Әр жолда бір ақпарат тұрады: атауы, уақыты, күні.',
      'Алдымен сұрақты оқыңыз, содан кейін мәтіннен керек жолды іздеңіз. Әр сөзді түсіну міндетті емес.'
    ],
    examples: [
      { en: 'Open: 9:00–18:00', kk: 'Ашық: 9:00-ден 18:00-ге дейін' },
      { en: 'Closed: Sunday', kk: 'Жабық: жексенбі' }
    ],
    words: [
      W('open', 'ашық', '🟢', 'оупэн'),
      W('closed', 'жабық', '🔴', 'клоузд')
    ],
    warmup: C('Қай сөйлем дұрыс?', ['I am ready.', 'I ready.', 'Ready I am.'], 0,
      'I am ready — Мен дайынмын. am сөзі міндетті.'),
    tasks: [
      C('Бұл белгі нені білдіреді?', ['Ашық', 'Жабық', 'Шығу'], 0, 'OPEN — ашық.', { sign: ['OPEN 🟢'] }),
      T('Ағылшынша жазыңыз: жабық', ['closed'], 'жабық — closed. Соңында -ed бар: c-l-o-s-e-d.'),
      C('Дәріхана бүгін ашық па?', ['Жоқ, жабық.', 'Иә, ашық.'], 0,
        'Closed today — бүгін жабық.', { sign: ['PHARMACY 💊', 'Closed today'], glossary: [{ en: 'pharmacy', kk: 'дәріхана' }, { en: 'today', kk: 'бүгін' }] })
    ],
    contexts: {
      usa: {
        themeWords: [W('store', 'дүкен', '🏪', 'стор')],
        text: {
          title: 'Store sign',
          sign: true,
          lines: ['MAPLE STREET STORE', 'Open: 8:00–20:00', 'Closed: Sunday'],
          glossary: [{ en: 'street', kk: 'көше' }, { en: 'Sunday', kk: 'жексенбі' }]
        },
        tasks: [
          C('Дүкен сағат нешеде ашылады?', ['8:00', '20:00', '12:00'], 0, 'Open: 8:00–20:00 — бірінші сан ашылатын уақыт.'),
          C('Дүкен қай күні жабық?', ['жексенбі', 'дүйсенбі', 'сенбі'], 0, 'Closed: Sunday — жексенбіде жабық.')
        ]
      },
      mystery: {
        themeWords: [W('museum', 'мұражай', '🏛️', 'мьюзиэм')],
        text: {
          title: 'Museum sign',
          sign: true,
          lines: ['OLD CLOCK MUSEUM', 'Open: 10:00–17:00', 'Closed: Monday', 'Room 3: NO ENTRY'],
          glossary: [{ en: 'clock', kk: 'сағат' }, { en: 'Monday', kk: 'дүйсенбі' }, { en: 'no entry', kk: 'кіруге болмайды' }]
        },
        tasks: [
          C('Мұражай сағат нешеде жабылады?', ['17:00', '10:00', '3:00'], 0, 'Open: 10:00–17:00 — екінші сан жабылатын уақыт.'),
          C('Қай бөлмеге кіруге болмайды?', ['3-бөлме', '1-бөлме', '10-бөлме'], 0, 'Room 3: NO ENTRY — 3-бөлмеге кіруге болмайды.')
        ]
      },
      sport: {
        themeWords: [W('class', 'сабақ, жаттығу тобы', '🥋', 'класс')],
        text: {
          title: 'Gym sign',
          sign: true,
          lines: ['CITY GYM', 'Kids class: 16:00', 'Adults class: 19:00', 'Closed: Sunday'],
          glossary: [{ en: 'kids', kk: 'балалар' }, { en: 'adults', kk: 'ересектер' }, { en: 'Sunday', kk: 'жексенбі' }]
        },
        tasks: [
          C('Балалар сабағы сағат нешеде?', ['16:00', '19:00', '10:00'], 0, 'Kids class: 16:00 — балалар сабағы 16:00-де.'),
          C('Зал қай күні жабық?', ['жексенбі', 'сенбі', 'жұма'], 0, 'Closed: Sunday — жексенбіде жабық.')
        ]
      },
      travel: {
        themeWords: [W('gate', 'гейт (ұшаққа отыратын есік)', '🛫', 'гейт')],
        text: {
          title: 'Airport board',
          sign: true,
          lines: ['FLIGHT 207 to Istanbul', 'Gate: B12', 'Boarding: 14:30'],
          glossary: [{ en: 'flight', kk: 'рейс' }, { en: 'boarding', kk: 'ұшаққа отырғызу' }]
        },
        tasks: [
          C('Қай гейт?', ['B12', '207', '14:30'], 0, 'Gate: B12. 207 — рейс нөмірі, 14:30 — уақыт.'),
          C('Ұшаққа отырғызу сағат нешеде басталады?', ['14:30', '12:00', '20:07'], 0,
            'Boarding: 14:30. Бұл — ұшаққа отыру басталатын уақыт, ұшақ одан кейін ұшады.')
        ]
      },
      everyday: {
        themeWords: [W('café', 'кафе', '☕', 'кафэй')],
        text: {
          title: 'Café sign',
          sign: true,
          lines: ['GREEN CAFÉ', 'Open: 8:00–22:00', 'Closed: Monday'],
          glossary: [{ en: 'Monday', kk: 'дүйсенбі' }]
        },
        tasks: [
          C('Кафе сағат нешеде жабылады?', ['22:00', '8:00', '12:00'], 0, 'Open: 8:00–22:00 — екінші сан жабылатын уақыт.'),
          C('Кафе қай күні жабық?', ['дүйсенбі', 'жексенбі', 'сейсенбі'], 0, 'Closed: Monday — дүйсенбіде жабық.')
        ]
      }
    },
    review: [
      { id: 's0-reading-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: ашық', answers: ['open'], explain: 'ашық — open.' },
      { id: 's0-reading-r2', type: 'choice', prompt: 'Дүкен сағат нешеде жабылады?', sign: ['SHOP 🛒', 'Open: 9:00–19:00'],
        options: ['19:00', '9:00', '12:00'], answer: 0, explain: 'Екінші сан — жабылатын уақыт: 19:00.' }
    ],
    editorNotes: [
      'Перевод «gate — гейт (ұшаққа отыратын есік)» — проверить, как принято в казахских аэропортах.',
      '«class — сабақ, жаттығу тобы» — проверить формулировку.'
    ]
  });
})();
