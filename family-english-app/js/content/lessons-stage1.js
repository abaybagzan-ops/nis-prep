/*
 * Ступень 1 — «Бастауыш» (ориентир A1, предварительно).
 * Все тексты оригинальные и вымышленные.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's1-words',
    stage: 1,
    skill: 'words',
    title: 'Күнделікті әрекеттер',
    goal: 'Күн тәртібін сипаттайтын етістіктерді тану, еске түсіру және сөйлемде қолдану.',
    explain: [
      'Етістік — әрекетті білдіретін сөз: тұру, бару, жеу.',
      'Қазақша етістік көбіне сөйлемнің соңында тұрады: «Мен мектепке барамын». Ағылшынша етістік I сөзінен кейін бірден келеді: I go to work.',
      'I сөзінен кейін етістік өзгермейді: I go, I eat.'
    ],
    examples: [
      { en: 'I get up at seven.', kk: 'Мен жетіде тұрамын.' },
      { en: 'I eat bread.', kk: 'Мен нан жеймін.' }
    ],
    words: [
      W('get up', 'тұру (төсектен)', '⏰', 'гет ап'),
      W('go', 'бару', '🚶', 'гоу'),
      W('eat', 'жеу', '🍞', 'ит')
    ],
    warmup: C('«open» сөзінің мағынасы қандай?', ['ашық', 'жабық', 'кіру'], 0, 'open — ашық, closed — жабық.'),
    tasks: [
      M('Сөздерді мағынасымен сәйкестендіріңіз.'),
      C('Таңертең оянып, төсектен тұрасыз. Бұл қай етістік?', ['get up', 'eat', 'go'], 0,
        'get up — тұру. eat — жеу, go — бару.'),
      T('Бос орынды толтырыңыз (жеу):', ['eat'],
        'жеу — eat: I eat an apple every day.', { sentence: 'I ___ an apple every day.' })
    ],
    contexts: {
      usa: {
        themeWords: [W('bus', 'автобус', '🚌', 'бас'), W('school', 'мектеп', '🏫', 'скул')],
        text: {
          title: 'Mike\'s morning',
          lines: ['I am Mike.', 'I get up at 7:00.', 'I go to school by bus.', 'The bus is yellow.'],
          glossary: [{ en: 'by bus', kk: 'автобуспен' }, { en: 'yellow', kk: 'сары' }]
        },
        tasks: [
          C('Майк сағат нешеде тұрады?', ['7:00', '8:00', '6:00'], 0, 'I get up at 7:00 — Мен 7:00-де тұрамын.'),
          C('Майк мектепке немен барады?', ['автобуспен', 'жаяу', 'көлікпен'], 0, 'I go to school by bus — автобуспен барамын.')
        ]
      },
      mystery: {
        themeWords: [W('library', 'кітапхана', '📚', 'лайбрэри'), W('book', 'кітап', '📖', 'бук')],
        text: {
          title: 'Lina\'s Saturday',
          lines: ['I am Lina.', 'On Saturday I get up at 8:00.', 'I go to the old library.', 'There is a strange book on the table.'],
          glossary: [{ en: 'strange', kk: 'оғаш' }, { en: 'there is', kk: '... бар' }]
        },
        tasks: [
          C('Лина сенбіде қайда барады?', ['ескі кітапханаға', 'мектепке', 'дүкенге'], 0, 'I go to the old library — ескі кітапханаға барамын.'),
          C('Үстелдің үстінде не бар?', ['оғаш кітап', 'алма', 'кілт'], 0, 'There is a strange book on the table — үстелде оғаш кітап бар.')
        ]
      },
      sport: {
        themeWords: [W('run', 'жүгіру', '🏃', 'ран'), W('rest', 'демалу', '😌', 'рэст')],
        text: {
          title: 'Dias\'s day',
          lines: ['I am Dias.', 'I get up at 6:30.', 'I eat, and then I run in the park.', 'At 21:00 I rest.'],
          glossary: [{ en: 'then', kk: 'содан кейін' }, { en: 'park', kk: 'саябақ' }]
        },
        tasks: [
          C('Дияс қайда жүгіреді?', ['саябақта', 'спорт залда', 'мектепте'], 0, 'I run in the park — саябақта жүгіремін.'),
          C('Дияс сағат 21:00-де не істейді?', ['демалады', 'жүгіреді', 'тамақ ішеді'], 0, 'At 21:00 I rest — 21:00-де демаламын. Демалыс та — жаттығудың бөлігі.')
        ]
      },
      travel: {
        themeWords: [W('breakfast', 'таңғы ас', '🍳', 'брэкфаст'), W('beach', 'жағажай', '🏖️', 'бич')],
        text: {
          title: 'On holiday',
          lines: ['We are on holiday.', 'I get up at 9:00.', 'I eat breakfast at the hotel.', 'Then I go to the beach.'],
          glossary: [{ en: 'holiday', kk: 'демалыс' }, { en: 'then', kk: 'содан кейін' }]
        },
        tasks: [
          C('Ол таңғы асты қайда ішеді?', ['қонақүйде', 'жағажайда', 'кафеде'], 0, 'I eat breakfast at the hotel — таңғы асты қонақүйде ішемін.'),
          C('Таңғы астан кейін қайда барады?', ['жағажайға', 'қонақүйге', 'дүкенге'], 0, 'Then I go to the beach — содан кейін жағажайға барамын.')
        ]
      },
      everyday: {
        themeWords: [W('cook', 'тамақ пісіру', '🍲', 'кук'), W('shop', 'дүкен', '🛒', 'шоп')],
        text: {
          title: 'My evening',
          lines: ['I get up at 7:30.', 'After work I go to the shop and buy bread.', 'At home, I cook soup.', 'We eat at 19:00.'],
          glossary: [{ en: 'buy', kk: 'сатып алу' }, { en: 'soup', kk: 'сорпа' }, { en: 'after work', kk: 'жұмыстан кейін' }]
        },
        tasks: [
          C('Ол дүкеннен не сатып алады?', ['нан', 'су', 'алма'], 0, 'buy bread — нан сатып алу.'),
          C('Олар сағат нешеде тамақтанады?', ['19:00', '7:30', '12:00'], 0, 'We eat at 19:00 — 19:00-де тамақтанамыз.')
        ]
      }
    },
    review: [
      { id: 's1-words-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: бару', answers: ['go'], explain: 'бару — go.' },
      { id: 's1-words-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'I ___ up at 7:00 every morning.',
        options: ['get', 'go', 'eat'], answer: 0, explain: 'get up — тұру.' }
    ],
    editorNotes: [
      'Утверждение «қазақша етістік көбіне сөйлемнің соңында» — упрощение (порядок SOV); проверить формулировку специалистом.',
      '«таңғы ас ішу» vs «таңғы ас жеу» — проверить естественный вариант.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's1-grammar',
    stage: 1,
    skill: 'grammar',
    title: 'He / She + -s',
    goal: 'Әдеттегі әрекет туралы айтқанда he, she, it сөздерінен кейін етістікке -s қосу (Present Simple).',
    explain: [
      'Қазақша етістік әр жақта өзгереді: барамын, барасың, барады. Ағылшынша етістік әдетте өзгермейді.',
      'Бір ғана ерекшелік бар: he, she, it (ол) туралы айтқанда етістікке -s қосылады.',
      'Кейбір етістіктерге -es қосылады: go → goes.'
    ],
    examples: [
      { en: 'She works in a bank.', kk: 'Ол банкте жұмыс істейді.' },
      { en: 'They work in a café.', kk: 'Олар кафеде жұмыс істейді.' }
    ],
    words: [
      W('every day', 'күн сайын', '📅', 'эври дэй'),
      W('work', 'жұмыс істеу', '💼', 'уөрк')
    ],
    warmup: C('«eat» сөзінің мағынасы қандай?', ['жеу', 'бару', 'тұру'], 0, 'eat — жеу.'),
    tasks: [
      C('Бос орынға дұрыс нұсқаны таңдаңыз.', ['plays', 'play', 'playing'], 0,
        'My brother = he (ол). Сондықтан етістікке -s қосылады: plays.', { sentence: 'My brother ___ football every Saturday.' }),
      T('Жақшадағы етістікті дұрыс түрде жазыңыз:', ['likes'],
        'She — ол, сондықтан like → likes.', { sentence: 'She ___ (like) tea.' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['mom works in a hospital'],
        'Mom = she. Сондықтан work → works: Mom works in a hospital.', { sentence: 'Mom work in a hospital.' })
    ],
    contexts: {
      usa: {
        themeWords: [W('drive', 'көлік жүргізу', '🚗', 'драйв')],
        text: {
          title: 'Kate and Ben',
          lines: ['This is Kate.', 'She lives in a small town.', 'Every day she drives to work.', 'Her brother Ben takes the bus.'],
          glossary: [{ en: 'lives', kk: 'тұрады (мекендейді)' }, { en: 'takes the bus', kk: 'автобуспен барады' }]
        },
        tasks: [
          C('Кейт жұмысқа қалай барады?', ['көлікпен', 'автобуспен', 'жаяу'], 0, 'she drives to work — көлікпен барады. Автобуспен — інісі Бен.'),
          T('Мәтіннен тауып жазыңыз:', ['takes'], 'Ben = he, сондықтан takes (-s бар).', { sentence: 'Ben ___ the bus.' })
        ]
      },
      mystery: {
        themeWords: [W('read', 'оқу', '📖', 'рид')],
        text: {
          title: 'Mr. Grey',
          lines: ['Mr. Grey works in an old bookshop.', 'Every night he reads one strange book.', 'His cat sits next to him and watches the door.'],
          glossary: [{ en: 'bookshop', kk: 'кітап дүкені' }, { en: 'next to', kk: 'қасында' }]
        },
        tasks: [
          C('Мистер Грей қайда жұмыс істейді?', ['ескі кітап дүкенінде', 'мұражайда', 'мектепте'], 0, 'works in an old bookshop — ескі кітап дүкенінде жұмыс істейді.'),
          T('Мәтіннен тауып жазыңыз:', ['sits'], 'His cat = it, сондықтан sits (-s бар).', { sentence: 'His cat ___ next to him.' })
        ]
      },
      sport: {
        themeWords: [W('train', 'жаттығу жасау', '🥋', 'трэйн')],
        text: {
          title: 'Aliya',
          lines: ['Aliya trains at the gym three times a week.', 'She warms up for ten minutes before training.', 'Her coach checks her technique.'],
          glossary: [{ en: 'three times a week', kk: 'аптасына үш рет' }, { en: 'warms up', kk: 'денесін қыздырады' }, { en: 'technique', kk: 'техника' }]
        },
        tasks: [
          C('Әлия аптасына неше рет жаттығады?', ['үш рет', 'бір рет', 'күн сайын'], 0, 'three times a week — аптасына үш рет.'),
          T('Мәтіннен тауып жазыңыз:', ['checks'], 'Her coach = he/she, сондықтан checks (-s бар).', { sentence: 'Her coach ___ her technique.' })
        ]
      },
      travel: {
        themeWords: [W('visit', 'барып көру', '🗺️', 'визит')],
        text: {
          title: 'The Ospans',
          lines: ['Mr. and Mrs. Ospan visit a new city every summer.', 'Mrs. Ospan plans the route.', 'Mr. Ospan carries the bags.'],
          glossary: [{ en: 'plans the route', kk: 'жолды жоспарлайды' }, { en: 'carries', kk: 'көтереді' }]
        },
        tasks: [
          C('Жолды кім жоспарлайды?', ['Оспан ханым', 'Оспан мырза', 'екеуі де'], 0, 'Mrs. Ospan plans the route — Оспан ханым жоспарлайды.'),
          T('Мәтіннен тауып жазыңыз:', ['carries'], 'Mr. Ospan = he. carry → carries (y әрпі i-ге ауысып, -es қосылады).', { sentence: 'Mr. Ospan ___ the bags.' })
        ]
      },
      everyday: {
        themeWords: [W('help', 'көмектесу', '🤝', 'хэлп')],
        text: {
          title: 'Our grandmother',
          lines: ['My grandmother lives with us.', 'Every morning she makes tea.', 'My little brother helps her in the kitchen.'],
          glossary: [{ en: 'makes tea', kk: 'шай қайнатады' }, { en: 'kitchen', kk: 'ас үй' }]
        },
        tasks: [
          C('Әже таңертең не істейді?', ['шай қайнатады', 'жұмысқа барады', 'кітап оқиды'], 0, 'she makes tea — шай қайнатады.'),
          T('Мәтіннен тауып жазыңыз:', ['helps'], 'My little brother = he, сондықтан helps.', { sentence: 'My little brother ___ her.' })
        ]
      }
    },
    review: [
      { id: 's1-grammar-r1', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'Our teacher ___ English.',
        options: ['speaks', 'speak', 'speaking'], answer: 0, explain: 'Our teacher = he/she → speaks.' },
      { id: 's1-grammar-r2', type: 'type', prompt: 'Жақшадағы етістікті дұрыс жазыңыз:', sentence: 'It ___ (rain) a lot here in spring.',
        answers: ['rains'], explain: 'It → rains.' }
    ],
    editorNotes: [
      'Объяснение «ағылшынша етістік әдетте өзгермейді» — упрощение (только Present Simple); проверить формулировку методистом.',
      'carry → carries: правило y → ies объяснено одной фразой в задании, не в теории; проверить, не слишком ли рано.'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's1-reading',
    stage: 1,
    skill: 'reading',
    title: 'Қысқа хабарламаны түсіну',
    goal: 'Қысқа хабарламадан кім, қайда, қашан деген ақпаратты табу.',
    explain: [
      'Қысқа хабарламада көбіне үш маңызды ақпарат болады: кім, қайда, қашан.',
      'Сұрақтағы негізгі сөзді (мысалы, уақытты) мәтіннен іздеңіз. Мәтінде жоқ нәрсені өзіңізден қоспаңыз.'
    ],
    examples: [
      { en: 'I\'m at the bus stop.', kk: 'Мен аялдамадамын.' },
      { en: 'See you at 5!', kk: 'Сағат 5-те кездесейік!' }
    ],
    words: [
      W('today', 'бүгін', '📅', 'тудэй'),
      W('tomorrow', 'ертең', '🌅', 'тумороу'),
      W('late', 'кеш, кешігіп', '⏳', 'лэйт')
    ],
    warmup: C('Бос орынға қай сөз келеді?', ['listens', 'listen', 'listening'], 0,
      'She → listens (-s бар).', { sentence: 'She ___ to music every evening.' }),
    tasks: [
      C('«tomorrow» сөзінің мағынасы қандай?', ['ертең', 'бүгін', 'кеше'], 0, 'tomorrow — ертең, today — бүгін.'),
      T('Ағылшынша жазыңыз: бүгін', ['today'], 'бүгін — today.'),
      C('Хабарламаны жазған адам неге кешігіп жатыр?', ['Автобус баяу жүреді.', 'Ол ұйықтап қалды.', 'Ол дүкенде.'], 0,
        'The bus is slow — автобус баяу жүреді. Басқа себептер мәтінде жоқ.',
        { text: ['Sorry, I\'m late! The bus is slow.'], glossary: [{ en: 'slow', kk: 'баяу' }] })
    ],
    contexts: {
      usa: {
        themeWords: [W('game', 'ойын, матч', '🏈', 'гейм')],
        text: {
          title: 'Message from Emma',
          lines: ['Hi Jake!', 'The game is today at 6:00, not tomorrow.', 'Meet me at the stadium gate.', '— Emma'],
          glossary: [{ en: 'meet me', kk: 'менімен кездес' }, { en: 'stadium gate', kk: 'стадион қақпасы' }]
        },
        tasks: [
          C('Ойын қашан?', ['бүгін 6:00-де', 'ертең 6:00-де', 'бүгін 8:00-де'], 0, 'The game is today at 6:00, not tomorrow — ертең емес, бүгін.'),
          C('Эмма Джейкпен қай жерде кездеседі?', ['стадион қақпасында', 'мектепте', 'үйде'], 0, 'Meet me at the stadium gate — стадион қақпасында.')
        ]
      },
      mystery: {
        themeWords: [W('map', 'карта', '🗺️', 'мэп')],
        text: {
          title: 'A secret message',
          lines: ['Lina,', 'I found an old map in the attic!', 'Come to my house tomorrow after school.', 'Don\'t tell anyone. — Sam'],
          glossary: [{ en: 'attic', kk: 'шатыр асты' }, { en: 'don\'t tell anyone', kk: 'ешкімге айтпа' }]
        },
        tasks: [
          C('Сэм не тапты?', ['ескі карта', 'кілт', 'кітап'], 0, 'I found an old map — ескі карта таптым.'),
          C('Лина қашан келуі керек?', ['ертең сабақтан кейін', 'бүгін кешке', 'сенбіде'], 0, 'tomorrow after school — ертең сабақтан кейін.')
        ]
      },
      sport: {
        themeWords: [W('training', 'жаттығу', '🥋', 'трэйнинг')],
        text: {
          title: 'Message from the coach',
          lines: ['Hi team!', 'Training is at 17:00 today, not 16:00.', 'Bring water and a towel.', 'Rest well tonight. — Coach Marat'],
          glossary: [{ en: 'bring', kk: 'алып кел' }, { en: 'towel', kk: 'орамал' }]
        },
        tasks: [
          C('Жаттығу бүгін сағат нешеде?', ['17:00', '16:00', '18:00'], 0, 'Training is at 17:00 today, not 16:00.'),
          C('Жаттықтырушы не алып келуді сұрайды?', ['су мен орамал', 'доп пен аяқкиім', 'тамақ'], 0, 'Bring water and a towel — су мен орамал алып келіңдер.')
        ]
      },
      travel: {
        themeWords: [W('airport', 'әуежай', '✈️', 'эапорт')],
        text: {
          title: 'Hotel notice',
          lines: ['Dear guests,', 'Our bus to the airport leaves tomorrow at 7:30.', 'Please be in the hotel lobby at 7:15.', 'Don\'t be late!'],
          glossary: [{ en: 'leaves', kk: 'жүріп кетеді' }, { en: 'lobby', kk: 'кіреберіс зал' }]
        },
        tasks: [
          C('Автобус әуежайға қашан жүреді?', ['ертең 7:30-да', 'бүгін 7:30-да', 'ертең 7:15-те'], 0, 'leaves tomorrow at 7:30. 7:15 — жиналатын уақыт.'),
          C('Қонақтар қайда жиналуы керек?', ['қонақүйдің кіреберіс залында', 'әуежайда', 'автобуста'], 0, 'be in the hotel lobby — қонақүйдің кіреберіс залында.')
        ]
      },
      everyday: {
        themeWords: [W('dinner', 'кешкі ас', '🍽️', 'динэр')],
        text: {
          title: 'Message to Mom',
          lines: ['Hi Mom!', 'I\'m late today. I have extra classes.', 'Please don\'t wait for me for dinner.', 'I\'ll be home at 20:00. — Aru'],
          glossary: [{ en: 'extra classes', kk: 'қосымша сабақ' }, { en: 'I\'ll be home', kk: 'үйде боламын' }]
        },
        tasks: [
          C('Ару үйге сағат нешеде келеді?', ['20:00', '18:00', '19:00'], 0, 'I\'ll be home at 20:00 — 20:00-де үйде боламын.'),
          C('Ару неге кешігеді?', ['қосымша сабағы бар', 'автобус кешікті', 'дүкенге барады'], 0, 'I have extra classes — қосымша сабағым бар.')
        ]
      }
    },
    review: [
      { id: 's1-reading-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: ертең', answers: ['tomorrow'], explain: 'ертең — tomorrow.' },
      { id: 's1-reading-r2', type: 'choice', prompt: 'Олар дүкенге қашан барады?', text: ['The shop is closed today. Let\'s go tomorrow.'],
        options: ['ертең', 'бүгін', 'кешке'], answer: 0, explain: 'Let\'s go tomorrow — ертең барайық.' }
    ],
    editorNotes: [
      'Глосса «meet me — менімен кездес» — проверить естественность.'
    ]
  });
})();
