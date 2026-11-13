/*
 * Ступень 2 — «Негізгі» (ориентир A2, предварительно).
 * Все тексты оригинальные и вымышленные. Реальные названия мест используются
 * только как фон; фактических утверждений о них нет.
 */
(function () {
  var C = FEA.choice, T = FEA.typed, M = FEA.match, W = FEA.word;

  // ---------------------------------------------------------------- СӨЗДЕР
  FEA.lessons.push({
    id: 's2-words',
    stage: 2,
    skill: 'words',
    title: 'Сезімдер',
    goal: 'Адамның күйін сипаттайтын сын есімдерді жағдайға қарай дұрыс таңдау.',
    explain: [
      'Ағылшынша қазіргі күйді көбіне am / is / are + сын есім арқылы айтамыз.',
      'Қазақша «Мен шаршадым» деп өткен шақ түрінде айтуымыз мүмкін, ал ағылшынша қазіргі күй үшін am қолданылады: I\'m tired.',
      'Сөзді жағдаймен бірге есте сақтаған жеңіл.'
    ],
    examples: [
      { en: 'I\'m tired after work.', kk: 'Жұмыстан кейін шаршаймын.' },
      { en: 'She is worried about the test.', kk: 'Ол сынаққа алаңдап отыр.' }
    ],
    words: [
      W('tired', 'шаршаған', '😴'),
      W('worried', 'алаңдаған, уайымдаған', '😟'),
      W('surprised', 'таң қалған', '😮')
    ],
    warmup: C('Хабарламадағы «I\'m late» нені білдіреді?', ['Мен кешігіп жатырмын.', 'Мен ерте келдім.', 'Мен үйдемін.'], 0,
      'late — кеш, кешігіп. I\'m late — кешігіп жатырмын.'),
    tasks: [
      M('Сөздерді мағынасымен сәйкестендіріңіз.'),
      C('Сіз түні бойы ұйықтамадыңыз. Таңертең қандайсыз?', ['tired', 'surprised', 'worried'], 0,
        'Ұйқысыз түннен кейін адам шаршайды — tired.'),
      T('Бос орынды толтырыңыз (таң қалған):', ['surprised'],
        'таң қалған — surprised. Мамырда қар жауса, таң қаламыз.', { sentence: 'We were ___ to see snow in May.' }),
      C('Сіңліңіздің ертең маңызды жарысы бар, бірақ ол әлі дайын емеспін деп ойлайды. Ол қандай?', ['worried', 'tired', 'surprised'], 0,
        'Алдағы оқиғаға уайымдау — worried.')
    ],
    contexts: {
      usa: {
        themeWords: [W('road trip', 'көлікпен ұзақ сапар', '🛣️'), W('gas station', 'жанармай бекеті', '⛽')],
        text: {
          title: 'The road trip',
          lines: [
            'Our road trip across Texas was long.',
            'After eight hours in the car, everyone was tired.',
            'Then the car stopped near a small gas station.',
            'Dad was worried, but the mechanic fixed it in ten minutes.',
            'We were surprised — and very happy.'
          ],
          glossary: [{ en: 'across', kk: 'бойымен, арқылы' }, { en: 'mechanic', kk: 'көлік жөндеуші' }]
        },
        tasks: [
          C('Көлік қай жерде тоқтады?', ['жанармай бекетінің қасында', 'қонақүйдің қасында', 'қаланың ортасында'], 0,
            'the car stopped near a small gas station — шағын жанармай бекетінің қасында.'),
          C('Әке неге алаңдады?', ['көлік тоқтап қалды', 'жол ұзақ болды', 'жанармай таусылды'], 0,
            'Әке көлік тоқтағаннан кейін алаңдады. Жанармай туралы мәтінде айтылмаған.')
        ]
      },
      mystery: {
        themeWords: [W('shadow', 'көлеңке', '🌑'), W('whisper', 'сыбыр, сыбырлау', '🤫')],
        text: {
          title: 'The whisper',
          lines: [
            'Mira was alone in the old house.',
            'Suddenly, she heard a whisper behind the wall.',
            'She was worried, but she took a lamp and looked.',
            'There was only a shadow — the shadow of a small cat.',
            'Mira laughed. She was surprised and a little tired.'
          ],
          glossary: [{ en: 'alone', kk: 'жалғыз' }, { en: 'lamp', kk: 'шам' }, { en: 'suddenly', kk: 'кенет' }]
        },
        tasks: [
          C('Мира не естіді?', ['қабырға артынан сыбыр', 'есіктің дауысын', 'мысықтың мияулағанын'], 0,
            'she heard a whisper behind the wall — қабырға артынан сыбыр естіді.'),
          C('Көлеңке кімдікі болып шықты?', ['кішкентай мысықтың', 'адамның', 'иттің'], 0,
            'the shadow of a small cat — кішкентай мысықтың көлеңкесі.')
        ]
      },
      sport: {
        themeWords: [W('match', 'жарыс, кездесу', '🥇'), W('warm-up', 'жаттығу алдындағы қыздыру', '🔥')],
        text: {
          title: 'Timur\'s match',
          lines: [
            'Before the match, Timur did a long warm-up.',
            'He was worried because the other boy was taller.',
            'His coach said: "Stay calm. Use good technique."',
            'Timur won. After the match, he was tired but happy.'
          ],
          glossary: [{ en: 'stay calm', kk: 'сабыр сақта' }, { en: 'technique', kk: 'техника' }]
        },
        tasks: [
          C('Тимур неге алаңдады?', ['басқа бала одан ұзын болды', 'ол қыздыру жаттығуын ұмытты', 'жаттықтырушы келмеді'], 0,
            'He was worried because the other boy was taller — басқа бала ұзын болғандықтан.'),
          C('Жаттықтырушы не деді?', ['Сабыр сақта, техниканы дұрыс қолдан.', 'Тезірек жүгір.', 'Бүгін демал.'], 0,
            '"Stay calm. Use good technique." — Сабыр сақта. Жақсы техниканы қолдан.')
        ]
      },
      travel: {
        themeWords: [W('luggage', 'жол жүгі', '🧳'), W('delay', 'кідіріс, кешігу', '⏱️')],
        text: {
          title: 'A long day',
          lines: [
            'Our flight had a two-hour delay.',
            'We were tired and a little worried about our hotel.',
            'When we arrived, our luggage was not there!',
            'The next morning, the airline brought our bags to the hotel.',
            'We were surprised — the service was very fast.'
          ],
          glossary: [{ en: 'arrived', kk: 'келдік' }, { en: 'airline', kk: 'әуе компаниясы' }]
        },
        tasks: [
          C('Рейс қанша уақытқа кешікті?', ['екі сағат', 'бір сағат', 'үш сағат'], 0, 'a two-hour delay — екі сағаттық кідіріс.'),
          C('Жүкті қашан әкелді?', ['келесі күні таңертең', 'сол күні кешке', 'бір аптадан кейін'], 0,
            'The next morning — келесі күні таңертең.')
        ]
      },
      everyday: {
        themeWords: [W('neighbor', 'көрші', '🏘️'), W('noise', 'шу', '🔊')],
        text: {
          title: 'Our new neighbor',
          lines: [
            'Our new neighbor plays the drums every evening.',
            'At first, we were surprised.',
            'Then the noise started to bother us.',
            'Mom was worried about my little sister\'s sleep.',
            'So we talked to him. Now he plays only before 19:00.'
          ],
          glossary: [{ en: 'drums', kk: 'барабан' }, { en: 'bother', kk: 'мазалау' }]
        },
        tasks: [
          C('Көрші кешке не істейді?', ['барабан соғады', 'ән айтады', 'гитара тартады'], 0, 'plays the drums — барабан соғады.'),
          C('Енді ол сағат нешеге дейін ойнайды?', ['19:00-ге дейін', '21:00-ге дейін', 'түн бойы'], 0, 'Now he plays only before 19:00.')
        ]
      }
    },
    review: [
      { id: 's2-words-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: шаршаған', answers: ['tired'], explain: 'шаршаған — tired.' },
      { id: 's2-words-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'Your friend gives you a gift for no reason. You feel ___.',
        options: ['surprised', 'tired', 'worried'], answer: 0, explain: 'Күтпеген сыйлық — surprised.' }
    ],
    editorNotes: [
      'Сопоставление «Мен шаршадым (өткен шақ түрі) ↔ I\'m tired» — требует проверки специалистом по казахскому.',
      '«worried — алаңдаған, уайымдаған» и «surprised — таң қалған» — проверить переводы.'
    ]
  });

  // ---------------------------------------------------------------- ГРАММАТИКА
  FEA.lessons.push({
    id: 's2-grammar',
    stage: 2,
    skill: 'grammar',
    title: 'was doing ... when ...',
    goal: 'Өткен шақта созылып жатқан әрекетті (фонды) және кенет болған оқиғаны ажырату.',
    prereq: 'Бұл сабаққа дейін Past Simple таныс болғаны жақсы: went, saw, found.',
    explain: [
      'was / were + -ing — өткенде белгілі бір сәтте созылып жатқан әрекет: She was cooking — Ол тамақ пісіріп жатқан.',
      'Сол сәтте кенет болған қысқа оқиға Past Simple арқылы беріледі: the door opened — есік ашылды.',
      'Қазақшадағы «...ып жатқан еді» тіркесі көбіне was / were + -ing түріне сәйкес келеді. when — «...кезде, сол сәтте».'
    ],
    examples: [
      { en: 'I was reading when my phone rang.', kk: 'Мен кітап оқып отырғанда, телефоным шырылдады.' },
      { en: 'They were walking home when it started to rain.', kk: 'Олар үйге келе жатқанда, жаңбыр жауа бастады.' }
    ],
    words: [
      W('suddenly', 'кенет', '⚡'),
      W('notice', 'байқау', '👀')
    ],
    warmup: T('Ағылшынша жазыңыз: алаңдаған (уайымдаған)', ['worried'], 'алаңдаған — worried.'),
    tasks: [
      C('Дұрыс нұсқаны таңдаңыз.', ['were having', 'was having', 'had having'], 0,
        'We сөзімен were қолданылады. Созылып жатқан әрекет — were having.', { sentence: 'We ___ dinner when Grandpa called.' }),
      T('Бос орынды толтырыңыз (екі сөз):', ['was sleeping'],
        'Ару ұйықтап жатқан (фон), оятқыш шырылдады (оқиға): was sleeping.', { sentence: 'Aru ___ (sleep) when the alarm rang.' }),
      T('Қатені түзетіп, сөйлемді толық жазыңыз:', ['i was walking to school when i saw a fox'],
        'was сөзінен кейін етістік -ing түрінде болады: was walking.', { sentence: 'I was walk to school when I saw a fox.' }),
      C('Қай сөйлемде кенет оқиға дұрыс берілген?', [
        'She was writing an email when the computer stopped.',
        'She was writing an email when the computer was stopping.',
        'She wrote an email when the computer was stop.'
      ], 0, 'Фон — was writing, кенет оқиға — stopped (Past Simple).')
    ],
    contexts: {
      usa: {
        themeWords: [W('highway', 'тас жол', '🛣️')],
        text: {
          title: 'A light in the sky',
          lines: [
            'Last summer, my uncle and I were driving on a quiet highway in Arizona.',
            'We were listening to music when we suddenly noticed a strange light in the sky.',
            'My uncle stopped the car.',
            'It was only a weather balloon, but we took a lot of photos.'
          ],
          glossary: [{ en: 'weather balloon', kk: 'ауа райын бақылайтын шар' }, { en: 'took photos', kk: 'суретке түсірдік' }]
        },
        tasks: [
          C('Олар не байқады?', ['аспандағы оғаш жарықты', 'жолдағы жануарды', 'бұзылған көлікті'], 0,
            'we suddenly noticed a strange light in the sky — аспанда оғаш жарықты байқадық.'),
          T('Мәтіннен тауып жазыңыз (екі сөз):', ['were listening'], 'Фон: were listening — тыңдап келе жатқанбыз.',
            { sentence: 'We ___ to music when we noticed a light.' })
        ]
      },
      mystery: {
        themeWords: [W('lock', 'құлып', '🔒')],
        text: {
          title: 'The silent clock',
          lines: [
            'Aru was cleaning the shelves in the town library when the big clock suddenly stopped.',
            'She noticed a small door with a lock under the clock.',
            'The lock was open.',
            'Behind the door, there was a tiny key and a note: "Find the book with no name."'
          ],
          glossary: [{ en: 'shelves', kk: 'сөрелер' }, { en: 'behind', kk: 'артында' }]
        },
        tasks: [
          C('Сағат тоқтаған кезде Ару не істеп жатты?', ['сөрелерді тазалап жатты', 'кітап оқып отырды', 'үйге қайтып бара жатты'], 0,
            'Aru was cleaning the shelves — сөрелерді тазалап жатқан.'),
          C('Есіктің артында не болды?', ['кішкентай кілт пен жазба', 'ескі кітап', 'тағы бір сағат'], 0,
            'a tiny key and a note — кішкентай кілт пен жазба.')
        ]
      },
      sport: {
        themeWords: [W('mat', 'жаттығу кілемі (татами)', '🟦')],
        text: {
          title: 'Dina',
          lines: [
            'On Tuesday, Dina was stretching on the mat when her coach called her.',
            '"Your technique is getting better," he said.',
            'Dina was so happy that she suddenly forgot her next exercise.',
            'Everyone laughed — Dina too.'
          ],
          glossary: [{ en: 'stretching', kk: 'созылу жаттығуы' }, { en: 'exercise', kk: 'жаттығу' }]
        },
        tasks: [
          C('Жаттықтырушы шақырғанда Дина не істеп жатты?', ['кілемде созылу жаттығуын жасап жатты', 'жүгіріп жүрді', 'демалып отырды'], 0,
            'Dina was stretching on the mat — кілемде созылып жатқан.'),
          C('Жаттықтырушы не деді?', ['Техникаң жақсарып келеді.', 'Сен шаршадың.', 'Ертең келме.'], 0,
            '"Your technique is getting better" — техникаң жақсарып келеді.')
        ]
      },
      travel: {
        themeWords: [W('passport', 'төлқұжат', '🛂')],
        text: {
          title: 'At passport control',
          lines: [
            'We were waiting in line at passport control when Dad suddenly noticed that his passport was not in his bag.',
            'Mom was looking in her bag when a man came up to us.',
            'He was holding Dad\'s passport! "You dropped this," he said with a smile.'
          ],
          glossary: [{ en: 'in line', kk: 'кезекте' }, { en: 'dropped', kk: 'түсіріп алдыңыз' }]
        },
        tasks: [
          C('Әке нені байқады?', ['төлқұжаты сөмкесінде жоқ екенін', 'рейс кешігетінін', 'билеті жоқ екенін'], 0,
            'his passport was not in his bag — төлқұжаты сөмкесінде болмады.'),
          C('Бейтаныс адам не әкелді?', ['әкенің төлқұжатын', 'ананың сөмкесін', 'билеттерді'], 0,
            'He was holding Dad\'s passport — әкенің төлқұжатын ұстап тұрды.')
        ]
      },
      everyday: {
        themeWords: [W('kitchen', 'ас үй', '🍳')],
        text: {
          title: 'Dark evening',
          lines: [
            'Yesterday I was cooking pasta in the kitchen when the lights suddenly went out.',
            'My brother was doing his homework, and he shouted, "Who turned off the lights?"',
            'Nobody did — the whole street was dark.',
            'We finished dinner by candlelight.'
          ],
          glossary: [{ en: 'went out', kk: 'сөніп қалды' }, { en: 'by candlelight', kk: 'майшам жарығымен' }]
        },
        tasks: [
          C('Жарық сөнгенде автор не істеп жатты?', ['ас үйде макарон пісіріп жатты', 'үй тапсырмасын орындап жатты', 'кешкі ас ішіп отырды'], 0,
            'I was cooking pasta in the kitchen — ас үйде макарон пісіріп жатқан. Үй тапсырмасын інісі орындап жатқан.'),
          C('Жарық неге сөнді?', ['бүкіл көшеде жарық болмады', 'інісі өшірді', 'шам бұзылды'], 0,
            'Nobody did — the whole street was dark. Ешкім өшірмеген, бүкіл көше қараңғы болды.')
        ]
      }
    },
    review: [
      { id: 's2-grammar-r1', type: 'type', prompt: 'Бос орынды толтырыңыз (екі сөз):', sentence: 'They ___ (play) chess when the guests arrived.',
        answers: ['were playing'], explain: 'They → were playing (фон).' },
      { id: 's2-grammar-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'I was taking a shower when someone ___ at the door.',
        options: ['knocked', 'was knock', 'knocking'], answer: 0, explain: 'Кенет оқиға — knocked (Past Simple).' }
    ],
    editorNotes: [
      'Соответствие «...ып жатқан еді ↔ was/were + -ing» — упрощение; ОБЯЗАТЕЛЬНО проверить специалистом по казахскому.',
      'Предпосылка урока: знаком Past Simple. Если ученик пришёл по диагностике без него — рекомендовать сначала повторение.'
    ]
  });

  // ---------------------------------------------------------------- ОҚУ
  FEA.lessons.push({
    id: 's2-reading',
    stage: 2,
    skill: 'reading',
    title: 'Негізгі ой және мәтінде жоқ ақпарат',
    goal: 'Мәтіннің негізгі ойын табу және мәтінде айтылмаған нәрсені ажырату.',
    explain: [
      'Негізгі ой — бүкіл мәтін не туралы екені. Ол көбіне бірінші немесе соңғы сөйлемде айтылады.',
      'Кейде сұрақтың жауабы мәтінде болмайды. Ондай кезде өзіңізден ойлап таппай, «мәтінде айтылмаған» деген нұсқаны таңдаңыз.'
    ],
    examples: [
      { en: 'The text does not say.', kk: 'Мәтінде айтылмаған.' },
      { en: 'The main idea is that ...', kk: 'Негізгі ой мынада: ...' }
    ],
    words: [
      W('because', 'себебі, өйткені', '➡️'),
      W('decide', 'шешу, шешім қабылдау', '✅'),
      W('finally', 'ақырында', '🏁')
    ],
    warmup: C('Бос орынға қай нұсқа келеді?', ['was watching', 'watched', 'were watching'], 0,
      'She → was watching (созылып жатқан әрекет).', { sentence: 'She ___ TV when I came home.' }),
    tasks: [
      C('«finally» сөзінің мағынасы қандай?', ['ақырында', 'кенет', 'себебі'], 0, 'finally — ақырында.'),
      T('Бос орынды толтырыңыз (шештік):', ['decided'],
        'decide сөзінің өткен шағы — decided (соңына -d қосылады).', { sentence: 'After a long talk, we ___ to stay home.' }),
      C('Мәтінде қай ақпарат айтылмаған?', ['Таксидің бағасы', 'Томның кеш оянғаны', 'Томның таксимен барғаны'], 0,
        'Мәтінде Томның кеш оянғаны және таксимен барғаны бар, ал бағасы туралы ештеңе жоқ.',
        { text: ['Tom missed the bus because he woke up late. He took a taxi to school.'], glossary: [{ en: 'missed', kk: 'үлгермей қалды' }] })
    ],
    contexts: {
      usa: {
        themeWords: [W('neighborhood', 'аудан, маңай', '🏘️')],
        text: {
          title: 'Friendship Park',
          lines: [
            'Every Saturday, the people in Lena\'s neighborhood meet in a small park.',
            'Some bring food, some bring games, and children draw with chalk on the sidewalk.',
            'At first, only five families came.',
            'Now almost the whole street comes, because everyone wants to know their neighbors.',
            'Finally, they decided to give the park a new name: Friendship Park.'
          ],
          glossary: [{ en: 'chalk', kk: 'бор' }, { en: 'sidewalk', kk: 'жаяу жүргінші жолы' }]
        },
        tasks: [
          C('Мәтіннің негізгі ойы қандай?', [
            'Көршілер сенбі сайын жиналып, бір-бірімен танысып жүр.',
            'Балалар бормен сурет салғанды жақсы көреді.',
            'Саябақ өте кішкентай.'
          ], 0, 'Мәтіннің бәрі көршілердің бас қосуы туралы. Бор мен сурет — тек бір бөлшек.'),
          C('Саябақтың жаңа атын кім ұсынды?', ['Мәтінде айтылмаған.', 'Лена', 'Балалар'], 0,
            '«they decided» — олар шешті деп жазылған, бірақ кім ұсынғаны айтылмаған.')
        ]
      },
      mystery: {
        themeWords: [W('secret', 'құпия', '🤫')],
        text: {
          title: 'The singing well',
          lines: [
            'In the village, everyone knew the secret of the old well: on the first night of winter, it sang.',
            'Nobody knew why. Ali decided to find out.',
            'He sat near the well all night with a warm blanket.',
            'At midnight, the wind blew through a crack in the stones, and the well started to sing.',
            'Finally, the secret was not magic — but Ali still thought it was beautiful.'
          ],
          glossary: [{ en: 'well', kk: 'құдық' }, { en: 'crack', kk: 'саңылау' }]
        },
        tasks: [
          C('Мәтіннің негізгі ойы қандай?', [
            'Әли құдықтың «ән салу» құпиясын анықтады.',
            'Ауылда қыс өте суық болады.',
            'Әли түнде ұйықтай алмады.'
          ], 0, 'Мәтін құпиядан басталып, оның шешімімен аяқталады.'),
          C('Әли құдықтың қасында нақты неше сағат отырды?', ['Мәтінде нақты айтылмаған.', 'екі сағат', 'бес сағат'], 0,
            '«all night» — түні бойы деп жазылған, бірақ нақты сағат саны жоқ.')
        ]
      },
      sport: {
        themeWords: [W('rule', 'ереже', '📏')],
        text: {
          title: 'One important rule',
          lines: [
            'In Coach Marat\'s club, there is one important rule: no training without a warm-up.',
            'Some new students think it is boring.',
            'But Marat explains that a good warm-up helps the body get ready for training.',
            'He also tells them to drink water and rest after hard training.',
            'Finally, most students agree that the rule makes training better.'
          ],
          glossary: [{ en: 'boring', kk: 'іш пыстырарлық' }, { en: 'agree', kk: 'келісу' }]
        },
        tasks: [
          C('Мәтіннің негізгі ойы қандай?', [
            'Клубта қыздыру жаттығуынсыз жаттықпайды, себебі ол денені дайындайды.',
            'Жаңа оқушылар жаттығуды жек көреді.',
            'Марат көп су ішеді.'
          ], 0, 'Мәтін бір ереже және оның себебі туралы.'),
          C('Клубта неше оқушы бар?', ['Мәтінде айтылмаған.', '20', '5'], 0, 'Оқушылар саны туралы мәтінде ештеңе жоқ.')
        ]
      },
      travel: {
        themeWords: [W('guide', 'гид, жол көрсетуші', '🧭')],
        text: {
          title: 'Our guide',
          lines: [
            'On our trip to Turkistan, we decided to hire a local guide.',
            'At first, Dad said it was too expensive.',
            'But the guide showed us quiet places and told us old stories about the city.',
            'Because of her, we understood the history much better.',
            'Finally, even Dad said it was the best part of the trip.'
          ],
          glossary: [{ en: 'hire', kk: 'жалдау' }, { en: 'local', kk: 'жергілікті' }]
        },
        tasks: [
          C('Мәтіннің негізгі ойы қандай?', [
            'Жергілікті гид сапарды әлдеқайда қызықты етті.',
            'Түркістанға бару қымбат.',
            'Әке гидті ұнатпады.'
          ], 0, 'Басында әке қарсы болса да, соңында гид сапардың ең жақсы бөлігі болды.'),
          C('Гидтің қызметі қанша тұрды?', ['Мәтінде айтылмаған.', '5000 теңге', 'өте арзан'], 0,
            '«too expensive» деп әке ойлаған, бірақ нақты баға жазылмаған.')
        ]
      },
      everyday: {
        themeWords: [W('market', 'базар', '🧺')],
        text: {
          title: 'Grandmother\'s market',
          lines: [
            'Every Sunday, my grandmother goes to the market early in the morning.',
            'She says the vegetables are fresh because the farmers bring them from their villages.',
            'She always talks with the sellers and knows their names.',
            'Last week I decided to go with her.',
            'Finally I understood why she loves it: the market is not only a shop, it is a place to meet people.'
          ],
          glossary: [{ en: 'fresh', kk: 'балғын' }, { en: 'sellers', kk: 'сатушылар' }]
        },
        tasks: [
          C('Мәтіннің негізгі ойы қандай?', [
            'Әже үшін базар — сауда ғана емес, адамдармен кездесетін орын.',
            'Базарда көкөніс арзан.',
            'Әже ерте тұрады.'
          ], 0, 'Соңғы сөйлем негізгі ойды береді.'),
          C('Базар сағат нешеде ашылады?', ['Мәтінде айтылмаған.', '6:00-де', '8:00-де'], 0, '«early in the morning» — ерте таңертең, бірақ нақты уақыт жоқ.')
        ]
      }
    },
    review: [
      { id: 's2-reading-r1', type: 'type', prompt: 'Ағылшынша жазыңыз: ақырында', answers: ['finally'], explain: 'ақырында — finally.' },
      { id: 's2-reading-r2', type: 'choice', prompt: 'Бос орынға қай сөз келеді?', sentence: 'We stayed at home ___ it was raining.',
        options: ['because', 'finally', 'decided'], answer: 0, explain: 'Себебін айту — because.' }
    ],
    editorNotes: [
      'Утверждение «негізгі ой көбіне бірінші немесе соңғы сөйлемде» — эвристика, не правило; проверить методистом.',
      'Turkistan — только фон; фактических утверждений о городе нет.'
    ]
  });
})();
