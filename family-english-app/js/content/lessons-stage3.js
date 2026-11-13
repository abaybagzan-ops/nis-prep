/*
 * Ступень 3 — «Орта және одан жоғары» (ориентир B1–B2, предварительно).
 * Все тексты оригинальные и вымышленные. Ellison Creek и Glimmerford —
 * придуманные места; фактических утверждений о реальных местах нет.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's3-words',
    stage: 3,
    skill: 'words',
    title: 'Тұрақты тіркестер мен фразалық етістіктер',
    goal: 'Мағынасы бөлек сөздерден шықпайтын тіркестерді контекстен түсіну және дұрыс қолдану.',
    explain: [
      'Фразалық етістіктің мағынасы оның бөліктерінің мағынасынан басқа болуы мүмкін. Сондықтан оны сөзбе-сөз аудармай, сөйлемдегі мағынасына қараңыз.',
      'Тұрақты тіркестерде сөздер белгілі бір жұппен келеді: make a decision деп айтамыз, do a decision демейміз.'
    ],
    examples: [
      { en: 'Don\'t put off your homework until Sunday.', kk: 'Үй тапсырмасын жексенбіге дейін кейінге қалдырма.' },
      { en: 'We can\'t afford a long holiday this year.', kk: 'Биыл ұзақ демалысқа қалтамыз көтермейді.' }
    ],
    words: [
      W('put off', 'кейінге қалдыру', '⏸️'),
      W('make an effort', 'күш салу, тырысу', '💪'),
      W('afford', 'қалтасы көтеру', '💳')
    ],
    warmup: C('«decide» сөзінің мағынасы қандай?', ['шешу', 'күту', 'кешігу'], 0, 'decide — шешу, шешім қабылдау.'),
    tasks: [
      M('Тіркестерді мағынасымен сәйкестендіріңіз.'),
      C('Бос орынға қайсысы келеді?', ['afford', 'put off', 'make an effort'], 0,
        'Тым қымбат — қалтамыз көтермейді: can\'t afford.', { sentence: 'We can\'t ___ a new car right now — it\'s too expensive.' }),
      T('Бос орынды толтырыңыз (кейінге қалдырылды, екі сөз):', ['put off'],
        'put етістігі өткен шақта да put: was put off.', { sentence: 'The match was ___ because of the storm.' }),
      C('Қай сөйлем табиғи естіледі?', [
        'She made a real effort to learn the rules.',
        'She did a real effort to learn the rules.',
        'She took a real effort to learn the rules.'
      ], 0, 'Тұрақты тіркес — make an effort.')
    ],
    contexts: {
      usa: {
        themeWords: [W('commute', 'жұмысқа барып-келу жолы', '🚆'), W('rent', 'жалдау ақысы', '🏠')],
        text: {
          title: 'Jordan\'s first year',
          lines: [
            'When Jordan moved to a big city in California, the rent was the first shock.',
            'He could only afford a small room far from the center, so his commute took almost two hours a day.',
            'At first, he wanted to go home.',
            'But he made an effort to use the time well: he read books on the train and studied for an online course.',
            'A year later, he found a better job and moved closer to work.'
          ],
          glossary: [{ en: 'shock', kk: 'тосын соққы' }, { en: 'online course', kk: 'онлайн курс' }]
        },
        tasks: [
          C('Мәтіндегі «commute» нені білдіреді?', ['жұмысқа барып-келу жолы', 'жалдау ақысы', 'жаңа жұмыс'], 0,
            '«his commute took almost two hours a day» — күнделікті жол екі сағатқа жуық уақыт алды.'),
          C('Джордан жолдағы уақытын қалай пайдаланды?', ['пойызда кітап оқып, курсқа дайындалды', 'ұйықтады', 'жұмыс іздеді'], 0,
            'he read books on the train and studied for an online course.')
        ]
      },
      mystery: {
        themeWords: [W('figure out', 'анықтау, түсініп алу', '🧩'), W('clue', 'жұмбақтың шешіміне апаратын белгі', '🔍')],
        text: {
          title: 'Paper birds',
          lines: [
            'For weeks, nobody in the small town could figure out who was leaving paper birds on the library steps.',
            'Each bird had a clue written on its wing: a number, a letter, or a tiny drawing.',
            'Nadia made an effort to collect them all.',
            'When she put the clues in order, they formed a sentence: "Meet me at the bridge at sunset."',
            'Nadia almost put off the meeting, but curiosity won.'
          ],
          glossary: [{ en: 'wing', kk: 'қанат' }, { en: 'curiosity', kk: 'білуге құмарлық' }]
        },
        tasks: [
          C('Мәтіндегі «figure out» нені білдіреді?', ['анықтау', 'жасыру', 'жинау'], 0,
            '«nobody could figure out who...» — ешкім кім екенін анықтай алмады.'),
          C('Белгілер ретімен қойылғанда не болып шықты?', ['көпірде кездесуге шақыратын сөйлем', 'қаланың картасы', 'кітаптың атауы'], 0,
            '"Meet me at the bridge at sunset." — Күн батқанда көпірде кездесейік.')
        ]
      },
      sport: {
        themeWords: [W('give up', 'тастап кету, бас тарту', '🏳️'), W('recover', 'қалпына келу', '🛌')],
        text: {
          title: 'Back on the mat',
          lines: [
            'Last spring, Arman hurt his ankle during training.',
            'The doctor told him to rest and not to put off the exercises his physiotherapist gave him.',
            'It was hard to watch his friends train, and he almost gave up.',
            'But he made an effort every day, and slowly his ankle started to recover.',
            'Three months later, he was back on the mat — stronger and more careful.'
          ],
          glossary: [{ en: 'ankle', kk: 'тобық' }, { en: 'physiotherapist', kk: 'физиотерапевт' }]
        },
        tasks: [
          C('Мәтіндегі «recover» нені білдіреді?', ['қалпына келу', 'жарақат алу', 'жаттығуды тастау'], 0,
            '«his ankle started to recover» — тобығы қалпына келе бастады.'),
          C('Дәрігер Арманға не айтты?', ['демалып, берілген жаттығуларды кейінге қалдырмауды', 'бірден жарысқа қатысуды', 'спортты мүлде тастауды'], 0,
            'to rest and not to put off the exercises — демалу және жаттығуларды кейінге қалдырмау.')
        ]
      },
      travel: {
        themeWords: [W('set off', 'жолға шығу', '🚗'), W('check in', 'тіркелу', '🛎️')],
        text: {
          title: 'A late arrival',
          lines: [
            'We planned to set off at 6 a.m., but Dad couldn\'t find the car keys.',
            'We finally left at 7:30 and arrived at the hotel too late to check in at the main desk.',
            'Luckily, the night receptionist made an effort to help us and found us a room.',
            'We couldn\'t afford a fancy hotel, but this one felt like home.'
          ],
          glossary: [{ en: 'receptionist', kk: 'ресепшн қызметкері' }, { en: 'fancy', kk: 'сәнді, қымбат' }]
        },
        tasks: [
          C('Мәтіндегі «set off» нені білдіреді?', ['жолға шығу', 'қонақүйге тіркелу', 'кілт іздеу'], 0,
            '«We planned to set off at 6 a.m.» — таңғы 6-да жолға шығуды жоспарладық.'),
          C('Олар неге кешікті?', ['Әке көліктің кілтін таба алмады.', 'Көлік бұзылды.', 'Жолда кептеліс болды.'], 0,
            'Dad couldn\'t find the car keys. Көлік бұзылғаны не кептеліс туралы мәтінде жоқ.')
        ]
      },
      everyday: {
        themeWords: [W('look after', 'қарау, қамқорлық жасау', '👶'), W('get along', 'тіл табысу', '🤝')],
        text: {
          title: 'Aunt Saule\'s rule',
          lines: [
            'My aunt Saule looks after her two grandchildren every afternoon.',
            'The children don\'t always get along, so she has a simple rule: no screens until the homework is done.',
            'At first, they tried to put off their homework.',
            'Now they make an effort to finish it quickly, because after that they can play a game with their grandmother.'
          ],
          glossary: [{ en: 'screens', kk: 'экрандар (телефон, планшет)' }, { en: 'grandchildren', kk: 'немерелер' }]
        },
        tasks: [
          C('Мәтіндегі «get along» нені білдіреді?', ['тіл табысу', 'үй тапсырмасын орындау', 'ойын ойнау'], 0,
            '«don\'t always get along» — әрдайым тіл табыса бермейді.'),
          C('Сәуле апайдың ережесі қандай?', ['Үй тапсырмасы біткенше экран жоқ.', 'Кешке ойнауға болмайды.', 'Балалар ерте ұйықтайды.'], 0,
            'no screens until the homework is done.')
        ]
      }
    },
    review: [
      { id: 's3-words-r1', type: 'type', prompt: 'Ағылшынша жазыңыз (екі сөз): кейінге қалдыру', answers: ['put off'], explain: 'кейінге қалдыру — put off.' },
      { id: 's3-words-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'They ___ a big effort to keep the park clean.',
        options: ['made', 'did', 'took'], answer: 0, explain: 'make an effort — тұрақты тіркес.' }
    ],
    editorNotes: [
      'Переводы фразовых глаголов (figure out, get along, set off) — проверить специалистом по казахскому.',
      '«қалтасы көтеру» для afford — разговорный вариант; проверить, подходит ли для всех возрастов.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's3-grammar',
    stage: 3,
    skill: 'grammar',
    title: 'Although / Despite',
    goal: 'although мен despite-ті ажырату: олардан кейін қандай құрылым келетінін білу.',
    explain: [
      'Although мен despite екеуі де «...қарамастан» деген мағына береді, бірақ олардан кейін әртүрлі құрылым келеді.',
      'Although + толық сөйлем (бастауыш + етістік): Although it was raining, we walked to the store. — Жаңбыр жауып тұрғанына қарамастан, дүкенге жаяу бардық.',
      'Despite + зат есім: despite the rain — жаңбырға қарамастан. Despite + -ing: despite being tired — шаршағанына қарамастан.',
      'Қазақшада екі жағдайда да бір сөз — «қарамастан» қолданылады, ал ағылшынша екі түрлі сөз керек. Сондықтан despite сөзінен кейін толық сөйлем қоюға болмайды.'
    ],
    examples: [
      { en: 'Although the hotel was old, it was very clean.', kk: 'Қонақүй ескі болғанына қарамастан, өте таза еді.' },
      { en: 'Despite the traffic, we arrived on time.', kk: 'Көлік кептелісіне қарамастан, уақытында жеттік.' }
    ],
    words: [
      W('convenient', 'ыңғайлы', '👍'),
      W('crowded', 'адам көп, лық толы', '👥')
    ],
    warmup: C('«afford» сөзінің мағынасы қандай?', ['қалтасы көтеру', 'кейінге қалдыру', 'тіркелу'], 0, 'afford — қалтасы көтеру.'),
    tasks: [
      C('Бос орынға қайсысы келеді?', ['Despite', 'Although', 'However'], 0,
        'Бос орыннан кейін зат есім тіркесі тұр (the long drive), етістік жоқ — despite. However жаңа сөйлемді бастайды.',
        { sentence: '___ the long drive, my cousin enjoyed her trip.' }),
      T('Бос орынға although немесе despite жазыңыз:', ['although'],
        'Одан кейін толық сөйлем тұр (she was tired) — although.', { sentence: '___ she was tired, she finished the book.' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', [
        'although the bus comes once an hour many people use it',
        'despite the fact that the bus comes once an hour many people use it'
      ], 'despite сөзінен кейін «the bus comes» сияқты толық сөйлем тұра алмайды. although қолданыңыз немесе despite the fact that деп жазыңыз.',
        { sentence: 'Despite the bus comes once an hour, many people use it.' }),
      C('Қай сөйлем дұрыс?', [
        'Despite feeling nervous, he answered every question.',
        'Despite he felt nervous, he answered every question.',
        'Although of his nerves, he answered every question.'
      ], 0, 'despite + -ing: despite feeling nervous. Екінші сөйлемде despite-тен кейін толық сөйлем тұр, үшіншісінде although-дан кейін сөйлем жоқ.')
    ],
    contexts: {
      usa: {
        themeWords: [W('suburb', 'қала маңындағы тұрғын аудан', '🏡')],
        text: {
          title: 'A Town Built for Cars',
          lines: [
            'When my cousin from Almaty visited me in Ellison Creek, she asked a simple question: "Where do people walk?"',
            'Our supermarket, schools and hospital are all several miles apart, and the sidewalk on Main Street stops near the gas station.',
            'Most families live in quiet suburbs and drive everywhere.',
            'Last year the town council added a bus line. Despite these efforts, the bus comes only once an hour.',
            'Although a car-based town offers space and privacy, I believe it leaves out people who cannot drive.'
          ],
          glossary: [{ en: 'town council', kk: 'қалалық кеңес' }, { en: 'leaves out', kk: 'шет қалдырады' }]
        },
        tasks: [
          C('Автордың көзқарасы қандай?', [
            'Мұндай қаланың артықшылығы бар, бірақ ол көлік жүргізе алмайтындарды шет қалдырады.',
            'Көлікке негізделген қала — ең жақсы үлгі.',
            'Барлығы үлкен қалаға көшуі керек.'
          ], 0, 'Although бар бөлік — мойындау (кеңістік, оңашалық). Негізгі пікір: «I believe it leaves out...».'),
          T('Мәтіннен тауып жазыңыз:', ['despite'], 'Одан кейін зат есім тіркесі (these efforts) — despite.',
            { sentence: '___ these efforts, the bus comes only once an hour.' })
        ]
      },
      mystery: {
        themeWords: [W('legend', 'аңыз', '📜')],
        text: {
          title: 'The silver fox',
          lines: [
            'Although the legend of the silver fox was very old, nobody in the village had ever seen it.',
            'Despite this, children left small gifts near the forest every winter.',
            'Zarina thought the legend was only a story.',
            'However, one snowy morning, she noticed small footprints that glowed softly in the snow.',
            'Although she was scared, she followed them.'
          ],
          glossary: [{ en: 'footprints', kk: 'іздер' }, { en: 'glowed', kk: 'жылтырады' }]
        },
        tasks: [
          C('Мәтін бойынша қай тұжырым дұрыс?', [
            'Зарина қорықса да, іздердің артынан жүрді.',
            'Зарина күміс түлкіні бұрын көрген.',
            'Балалар жазда сыйлық қалдырады.'
          ], 0, '«Although she was scared, she followed them.» Түлкіні ешкім көрмеген, сыйлықтар қыста қалдырылады.'),
          T('Мәтіннен тауып жазыңыз:', ['despite'], 'Одан кейін this деген бір сөз тұр, толық сөйлем емес — despite.',
            { sentence: '___ this, children left small gifts near the forest.' })
        ]
      },
      sport: {
        themeWords: [W('injury', 'жарақат', '🩹')],
        text: {
          title: 'Not this time',
          lines: [
            'Despite a small knee injury, Sanzhar wanted to compete in the regional tournament.',
            'Although he felt ready, his coach said no.',
            '"An injury that is not fully healed can become a bigger problem," she explained.',
            'Sanzhar was disappointed, but he followed the advice, rested and did his recovery exercises.',
            'Two months later, he competed without pain.'
          ],
          glossary: [{ en: 'tournament', kk: 'турнир' }, { en: 'healed', kk: 'жазылған' }]
        },
        tasks: [
          C('Жаттықтырушы неге рұқсат бермеді?', ['Жарақат толық жазылмаған еді.', 'Санжар дайын емес еді.', 'Турнир қымбат болды.'], 0,
            '"An injury that is not fully healed..." — жарақат толық жазылмаған.'),
          T('Мәтіннен тауып жазыңыз:', ['although'], 'Одан кейін толық сөйлем тұр (he felt ready) — although.',
            { sentence: '___ he felt ready, his coach said no.' })
        ]
      },
      travel: {
        themeWords: [W('budget', 'бюджет, қаражат', '💰')],
        text: {
          title: 'A trip on a small budget',
          lines: [
            'Although our budget was small, we wanted to see the mountains near our city.',
            'Despite the crowded bus on Saturday morning, the trip was easy and cheap.',
            'We took sandwiches from home instead of eating in expensive cafés.',
            'The lake was cold and beautiful, and the path was convenient even for my parents.'
          ],
          glossary: [{ en: 'instead of', kk: '... орнына' }, { en: 'path', kk: 'соқпақ жол' }]
        },
        tasks: [
          C('Олар ақшаны қалай үнемдеді?', ['Тамақты үйден алып шықты.', 'Таксимен барды.', 'Қымбат кафеде тамақтанды.'], 0,
            'We took sandwiches from home instead of eating in expensive cafés.'),
          T('Мәтіннен тауып жазыңыз:', ['despite'], 'Одан кейін зат есім тіркесі (the crowded bus) — despite.',
            { sentence: '___ the crowded bus, the trip was easy.' })
        ]
      },
      everyday: {
        themeWords: [W('schedule', 'кесте', '🗓️')],
        text: {
          title: 'Cooking at home',
          lines: [
            'Although my schedule is busy, I try to cook dinner at home three times a week.',
            'Despite the extra time it takes, home cooking helps me save money and eat better.',
            'The supermarket near my house is always crowded after work, so I shop on Sunday mornings.',
            'It is not always convenient, but it works for me.'
          ],
          glossary: [{ en: 'save money', kk: 'ақша үнемдеу' }, { en: 'extra', kk: 'қосымша' }]
        },
        tasks: [
          C('Автор неге жексенбі таңертең дүкенге барады?', ['Жұмыстан кейін дүкенде адам көп болады.', 'Жексенбіде баға арзан.', 'Ол жексенбіде жұмыс істемейді.'], 0,
            'The supermarket is always crowded after work, so I shop on Sunday mornings. Басқа себептер мәтінде айтылмаған.'),
          T('Мәтіннен тауып жазыңыз:', ['despite'], 'Одан кейін зат есім тіркесі (the extra time) — despite.',
            { sentence: '___ the extra time it takes, home cooking helps me.' })
        ]
      }
    },
    review: [
      { id: 's3-grammar-r1', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: '___ the cold weather, the children played outside.',
        options: ['Despite', 'Although', 'Because'], answer: 0, explain: 'Одан кейін зат есім тіркесі — despite.' },
      { id: 's3-grammar-r2', type: 'type', prompt: 'Бос орынға although немесе despite жазыңыз:', sentence: 'We enjoyed the concert ___ it was too long.',
        answers: ['although'], explain: 'Одан кейін толық сөйлем (it was too long) — although.' }
    ],
    editorNotes: [
      'ВСЁ казахское объяснение although/despite требует проверки специалистом по казахскому (в т.ч. «...ғанына қарамастан», «-ға қарамастан»).',
      'Типичная ошибка «despite + clause»: связь с казахским «қарамастан» и русским «несмотря на то, что» — гипотеза, не установленный факт.'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's3-reading',
    stage: 3,
    skill: 'reading',
    title: 'Автордың көзқарасы',
    goal: 'Пікір мәтінінен автордың негізгі позициясын табу және фактіні пікірден ажырату.',
    explain: [
      'Пікір мәтінінде автор алдымен басқа көзқарасты мойындауы мүмкін («Some people say...», «It is true that...»). Бұл — әлі оның негізгі пікірі емес.',
      'Автордың өз позициясын көбіне «I believe», «In my view» сияқты сөздер немесе мәтіннің соңғы бөлігі көрсетеді.',
      'Факт — тексеруге болатын ақпарат (уақыт, сан, оқиға). Пікір — біреудің бағасы немесе көзқарасы.'
    ],
    examples: [
      { en: 'It is true that phones are useful. However, ...', kk: 'Телефонның пайдалы екені рас. Алайда ...' },
      { en: 'In my view, ...', kk: 'Менің ойымша, ...' }
    ],
    words: [
      W('claim', 'мәлімдеу, мәлімдеме', '📢'),
      W('evidence', 'дәлел', '🔎'),
      W('in my view', 'менің ойымша', '💭')
    ],
    warmup: T('Бос орынға although немесе despite жазыңыз:', ['despite'], 'Одан кейін зат есім (the noise) — despite.',
      { sentence: '___ the noise, I slept well.' }),
    tasks: [
      C('Қайсысы факт?', ['The museum opens at 10:00.', 'The museum is the most interesting place in town.', 'I think the museum is boring.'], 0,
        'Ашылу уақытын тексеруге болады — бұл факт. Қалған екеуі — баға, яғни пікір.'),
      T('Ағылшынша жазыңыз: дәлел', ['evidence'], 'дәлел — evidence.'),
      C('Автордың позициясы қандай?', [
        'Қысқа күнделікті тапсырма пайдалы.',
        'Үй тапсырмасы пайдасыз.',
        'Үй тапсырмасы стресс тудырады, сондықтан оны жою керек.'
      ], 0, '«It is true that...» — мойындау. «In my view, however...» — автордың өз пікірі.',
        { text: ['Some people claim that homework is useless. It is true that too much homework can be stressful.',
          'In my view, however, short daily tasks help students remember what they learned.'] })
    ],
    contexts: {
      usa: {
        themeWords: [W('tip', 'шайлық (қызмет үшін қосымша ақы)', '💵')],
        text: {
          title: 'A fair tip',
          lines: [
            'When Daniyar first ate at a small diner in Ellison Creek, he was confused about the tip.',
            'The waiter, Rosa, explained that in this diner tips are a big part of her income.',
            'Some of Daniyar\'s friends claim that tipping is old-fashioned and that restaurants should simply pay higher wages.',
            'It is true that tipping can be confusing for visitors.',
            'In my view, however, until wages change, leaving a fair tip is the respectful thing to do.'
          ],
          glossary: [{ en: 'diner', kk: 'шағын мейрамхана' }, { en: 'wages', kk: 'жалақы' }]
        },
        tasks: [
          C('Автордың позициясы қандай?', [
            'Жалақы өзгергенше әділ шайлық қалдыру — құрмет белгісі.',
            'Шайлық беру ескірген әдет, оны тоқтату керек.',
            'Шайлық беру қонақтар үшін түсінікті.'
          ], 0, '«In my view, however, ...» — автордың өз пікірі. Екінші нұсқа — достарының пікірі.'),
          C('Қайсысы пікір?', ['Tipping is old-fashioned.', 'Rosa works as a waiter.', 'Daniyar ate at a diner.'], 0,
            '«Ескірген» — баға, пікір. Қалған екеуі — мәтіндегі оқиғалар.')
        ]
      },
      mystery: {
        themeWords: [W('rumor', 'қауесет', '🗣️')],
        text: {
          title: 'The blue light',
          lines: [
            'In Glimmerford, there is a rumor that the old lighthouse is haunted.',
            'People claim they have seen a blue light in the window at night.',
            'Some say it is a ghost; others say it is just a reflection of the moon.',
            'Nobody has any real evidence.',
            'In my view, the rumor says more about the town than about the lighthouse: people love a good story, especially on long winter nights.'
          ],
          glossary: [{ en: 'lighthouse', kk: 'маяк' }, { en: 'haunted', kk: 'елес бар деп саналатын' }]
        },
        tasks: [
          C('Автордың негізгі ойы қандай?', [
            'Қауесет маяк туралы емес, адамдардың әңгімеге құмарлығы туралы көбірек айтады.',
            'Маякта шынымен елес бар.',
            'Көк жарық — айдың шағылысы екені дәлелденген.'
          ], 0, '«In my view, the rumor says more about the town...» Үшінші нұсқа — тек кейбір адамдардың болжамы.'),
          C('Мәтін бойынша елестің бар екеніне дәлел бар ма?', ['Жоқ, нақты дәлел жоқ.', 'Иә, адамдар көк жарықты көрген.', 'Иә, маяк ескі.'], 0,
            '«Nobody has any real evidence.» Адамдардың айтқаны — мәлімдеме (claim), дәлел емес.')
        ]
      },
      sport: {
        themeWords: [W('rest day', 'демалыс күні', '🛌')],
        text: {
          title: 'Rest is training too',
          lines: [
            'Many young athletes believe that more training always means better results.',
            'Coach Aigerim disagrees.',
            'She gives her students at least one rest day a week and asks them to sleep well.',
            'Some parents claim this makes the team lazy.',
            'In my view, Coach Aigerim is right: rest is not the opposite of training — it is part of it.'
          ],
          glossary: [{ en: 'athletes', kk: 'спортшылар' }, { en: 'opposite', kk: 'қарама-қарсысы' }]
        },
        tasks: [
          C('Автордың позициясы қандай?', [
            'Демалыс күні — жаттығудың маңызды бөлігі.',
            'Көп жаттығу әрқашан жақсы нәтиже береді.',
            'Демалыс команданы жалқау етеді.'
          ], 0, '«In my view, Coach Aigerim is right...» Екінші нұсқа — жас спортшылардың, үшіншісі — кейбір ата-аналардың пікірі.'),
          C('Ата-аналардың кейбірі не дейді?', ['Демалыс команданы жалқау етеді.', 'Демалыс — жаттығудың бөлігі.', 'Аптасына бір демалыс күні аз.'], 0,
            '«Some parents claim this makes the team lazy.»')
        ]
      },
      travel: {
        themeWords: [W('souvenir', 'кәдесый', '🎁')],
        text: {
          title: 'Fridge magnets',
          lines: [
            'On every trip, my aunt buys a fridge magnet.',
            'Some travelers claim that souvenirs are a waste of money.',
            'It is true that many souvenirs are cheap and end up in a drawer.',
            'However, in my view, a small souvenir can hold a memory better than a hundred photos on a phone.',
            'When my aunt looks at her magnets, she tells a story about each one.'
          ],
          glossary: [{ en: 'fridge magnet', kk: 'тоңазытқыш магниті' }, { en: 'drawer', kk: 'суырма' }]
        },
        tasks: [
          C('Автордың позициясы қандай?', [
            'Кішкентай кәдесый естелікті жақсы сақтайды.',
            'Кәдесый — ақшаны босқа шашу.',
            'Телефондағы суреттер кәдесыйдан жақсы.'
          ], 0, '«However, in my view...» — автордың өз пікірі.'),
          C('Автор қай ойды ішінара мойындайды?', [
            'Көп кәдесый арзан болып, суырмада қалып қояды.',
            'Апай әр сапарда магнит сатып алады.',
            'Әр магниттің өз әңгімесі бар.'
          ], 0, '«It is true that...» — автор басқа көзқарастың бір бөлігімен келіседі.')
        ]
      },
      everyday: {
        themeWords: [W('screen time', 'экран алдындағы уақыт', '📱')],
        text: {
          title: 'No phones at dinner',
          lines: [
            'Our family has a new rule: no phones at dinner.',
            'My brother claims the rule is unfair, because adults use their phones for work.',
            'It is true that some messages are important.',
            'But in my view, one hour without screen time is not too much to ask.',
            'Since we started, we talk more, and dinner feels like a real family meal again.'
          ],
          glossary: [{ en: 'unfair', kk: 'әділетсіз' }, { en: 'meal', kk: 'ас' }]
        },
        tasks: [
          C('Автордың позициясы қандай?', [
            'Кешкі ас кезінде бір сағат телефонсыз болу — орынды талап.',
            'Ереже әділетсіз.',
            'Ересектерге ереже қатысты емес.'
          ], 0, '«But in my view, one hour without screen time is not too much to ask.»'),
          C('Інісінің дәлелі қандай?', ['Ересектер телефонды жұмыс үшін қолданады.', 'Тамақ дәмсіз.', 'Хабарламалар маңызды емес.'], 0,
            '«because adults use their phones for work».')
        ]
      }
    },
    review: [
      { id: 's3-reading-r1', type: 'choice', prompt: 'Қайсысы пікір?', options: ['This city is too noisy to live in.', 'The train leaves at 8:15.', 'The shop opens at 9:00.'],
        answer: 0, explain: '«Тым шулы» — баға, пікір. Уақыттарды тексеруге болады.' },
      { id: 's3-reading-r2', type: 'type', prompt: 'Ағылшынша жазыңыз (үш сөз): менің ойымша', answers: ['in my view', 'in my opinion'],
        explain: 'менің ойымша — in my view (немесе in my opinion).' }
    ],
    editorNotes: [
      'Текст о чаевых — вымышленный эпизод; НЕ утверждение о нормах чаевых в США. При желании заменить на текст с источниками.',
      '«haunted — елес бар деп саналатын» и «tip — шайлық» — проверить переводы.',
      'Glimmerford — придуманное место; проверить, что не совпадает с узнаваемыми вымышленными мирами.'
    ]
  });
})();
