/*
 * Стартовая диагностика: 15 вопросов, по 5 на навык, сложность растёт.
 * Результат — только предложенная стартовая ступень по каждому навыку.
 * Все тексты оригинальные и вымышленные.
 *
 * review — отдельный вопрос для отложенного повторения (не тот же текст),
 * добавляется в очередь, если ответ в диагностике был неверным.
 */
window.FEA = window.FEA || {};

FEA.diagnostic = [
  // ---------- СӨЗДЕР ----------
  {
    id: 'd-w1', skill: 'words',
    visual: '🍎',
    prompt: 'Суретте не бейнеленген?',
    options: ['apple', 'car', 'house'],
    answer: 0,
    explain: 'apple — алма. car — көлік, house — үй.',
    review: { type: 'type', prompt: '🍎 Ағылшынша жазыңыз: алма', answers: ['apple'], explain: 'алма — apple.' }
  },
  {
    id: 'd-w2', skill: 'words',
    visual: '🍳',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'We eat ___ in the morning.',
    options: ['breakfast', 'bedroom', 'weekend'],
    answer: 0,
    explain: 'breakfast — таңғы ас. Таңертең таңғы ас ішеміз. bedroom — жатын бөлме, weekend — демалыс күндері.',
    review: { type: 'type', prompt: 'Ағылшынша жазыңыз: таңғы ас', answers: ['breakfast'], explain: 'таңғы ас — breakfast.' }
  },
  {
    id: 'd-w3', skill: 'words',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'The shop is ___ on Sundays. It opens again on Monday.',
    options: ['closed', 'empty', 'quiet'],
    answer: 0,
    explain: 'closed — жабық. «Дүйсенбіде қайта ашылады» деген сөйлем дүкеннің жексенбіде жабық екенін көрсетеді.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'The museum is ___ today, so we can\'t go in.',
      options: ['closed', 'open', 'quiet'], answer: 0,
      explain: 'Кіре алмаймыз — демек, мұражай жабық: closed.'
    }
  },
  {
    id: 'd-w4', skill: 'words',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'She made a big ___ to finish the project on time.',
    options: ['effort', 'work', 'job'],
    answer: 0,
    explain: 'make an effort — күш салу, тырысу. Бұл — тұрақты тіркес: make сөзімен effort бірге келеді.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'If you make an ___ every day, you will improve.',
      options: ['effort', 'work', 'job'], answer: 0,
      explain: 'make an effort — күш салу.'
    }
  },
  {
    id: 'd-w5', skill: 'words',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'The new rule was ___ by most residents; few people complained.',
    options: ['welcomed', 'greeted', 'hosted'],
    answer: 0,
    explain: 'welcome a rule — ережені жақсы қабылдау. greet — адамды қарсы алып амандасу, host — қонақ күту.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'The idea was warmly ___ by the parents.',
      options: ['welcomed', 'hosted', 'greeted'], answer: 0,
      explain: 'Идеяны жақсы қабылдау — welcome an idea.'
    }
  },

  // ---------- ГРАММАТИКА ----------
  {
    id: 'd-g1', skill: 'grammar',
    visual: '🙂',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'I ___ happy.',
    options: ['am', 'is', 'are'],
    answer: 0,
    explain: 'I сөзімен әрқашан am қолданылады: I am happy — Мен көңілдімін.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'She ___ my sister.',
      options: ['is', 'am', 'are'], answer: 0,
      explain: 'She (ол) сөзімен is қолданылады.'
    }
  },
  {
    id: 'd-g2', skill: 'grammar',
    visual: '⚽',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'He ___ football every Saturday.',
    options: ['plays', 'play', 'playing'],
    answer: 0,
    explain: 'He, she, it сөздерінен кейін әдеттегі әрекетте етістікке -s қосылады: he plays.',
    review: {
      type: 'type', prompt: 'Жақшадағы етістікті дұрыс жазыңыз:',
      sentence: 'My dad ___ (cook) on Sundays.',
      answers: ['cooks'], explain: 'My dad = he, сондықтан cooks.'
    }
  },
  {
    id: 'd-g3', skill: 'grammar',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'Yesterday we ___ to the park.',
    options: ['went', 'go', 'goes'],
    answer: 0,
    explain: 'Yesterday — кеше, демек өткен шақ керек. go етістігінің өткен шағы — went.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'Last week I ___ my grandmother.',
      options: ['visited', 'visit', 'visits'], answer: 0,
      explain: 'Last week — өткен апта, сондықтан visited.'
    }
  },
  {
    id: 'd-g4', skill: 'grammar',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'I ___ in Almaty since 2020.',
    options: ['have lived', 'live', 'am living'],
    answer: 0,
    explain: 'since 2020 — өткенде басталып, әлі жалғасып келе жатқан жағдай. Бұл жерде have lived (Present Perfect) қолданылады.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'We ___ each other for ten years.',
      options: ['have known', 'know', 'are knowing'], answer: 0,
      explain: 'for ten years — он жылдан бері, әлі жалғасып келеді: have known.'
    }
  },
  {
    id: 'd-g5', skill: 'grammar',
    prompt: 'Бос орынға қай сөз келеді?',
    sentence: 'If I had known about the traffic, I ___ earlier.',
    options: ['would have left', 'would leave', 'will leave'],
    answer: 0,
    explain: 'Өткендегі болмаған жағдай туралы (білмедім, сондықтан ерте шықпадым): If I had known..., I would have left.',
    review: {
      type: 'choice', prompt: 'Бос орынға қай сөз келеді?',
      sentence: 'If she had asked me, I ___ her.',
      options: ['would have helped', 'would help', 'will help'], answer: 0,
      explain: 'Өткендегі болмаған жағдай: would have helped.'
    }
  },

  // ---------- ОҚУ ----------
  {
    id: 'd-r1', skill: 'reading',
    sign: ['CAFÉ ☕', 'Open: 9:00–18:00'],
    prompt: 'Кафе сағат нешеде жабылады?',
    options: ['18:00', '9:00', '12:00'],
    answer: 0,
    explain: 'Open: 9:00–18:00 — 9:00-де ашылып, 18:00-де жабылады.',
    review: {
      type: 'choice', prompt: 'Наубайхана сағат нешеде ашылады?',
      sign: ['BAKERY 🥐', 'Open: 7:00–15:00'],
      options: ['7:00', '15:00', '12:00'], answer: 0,
      explain: 'Бірінші сан — ашылатын уақыт: 7:00.'
    }
  },
  {
    id: 'd-r2', skill: 'reading',
    text: ['Hi Sam, I\'m at the bus stop. The bus is late.', 'Wait for me at the cinema. — Nurlan'],
    prompt: 'Нұрлан қазір қайда?',
    options: ['аялдамада', 'кинотеатрда', 'үйде'],
    answer: 0,
    explain: 'I\'m at the bus stop — Мен аялдамадамын. Кинотеатрда ол кейін кездеспек.',
    review: {
      type: 'choice', prompt: 'Әлия қазір қайда?',
      text: ['Hi! I\'m in the library. Meet me at the café at 4. — Aliya'],
      options: ['кітапханада', 'кафеде', 'үйде'], answer: 0,
      explain: 'I\'m in the library — Мен кітапханадамын.'
    }
  },
  {
    id: 'd-r3', skill: 'reading',
    text: [
      'Every spring, Erlan and his neighbours plant trees near their building.',
      'Last year they planted twelve. Now the yard is greener, and children play there after school.'
    ],
    prompt: 'Мәтіннің негізгі ойы қандай?',
    options: [
      'Көршілер ауласын көгалдандырды.',
      'Балалардың ойындары.',
      'Ағаш сатып алу.'
    ],
    answer: 0,
    explain: 'Мәтіннің бәрі көршілердің ағаш отырғызып, аланы жасылдандыруы туралы. Балалар — тек бір бөлшек.',
    review: {
      type: 'choice', prompt: 'Мәтіннің негізгі ойы қандай?',
      text: [
        'Our school started a reading club. Every Friday, students meet and talk about a book.',
        'Now more students borrow books from the library.'
      ],
      options: [
        'Оқу клубы оқушыларды көбірек оқуға ынталандырды.',
        'Жұма күні сабақ болмайды.',
        'Кітапхана жаңа кітаптар сатып алды.'
      ], answer: 0,
      explain: 'Клуб ашылған соң оқушылар кітапты көбірек ала бастады — бұл негізгі ой.'
    }
  },
  {
    id: 'd-r4', skill: 'reading',
    text: ['The hotel was so noisy that we barely slept.'],
    prompt: 'Мәтіндегі «barely» сөзі нені білдіреді?',
    options: ['әрең, дерлік ... жоқ', 'өте жақсы', 'ешқашан'],
    answer: 0,
    explain: 'Қонақүй шулы болды — демек, олар әрең ұйықтады. barely — «әрең, жоққа жуық».',
    review: {
      type: 'choice', prompt: 'Мәтіндегі «barely» сөзі нені білдіреді?',
      text: ['The road was so icy that we could barely walk.'],
      options: ['әрең', 'өте жылдам', 'мүлдем'], answer: 0,
      explain: 'Жол тайғақ болды — әрең жүрдік.'
    }
  },
  {
    id: 'd-r5', skill: 'reading',
    text: [
      'Our town plans to close the library on Mondays to save money.',
      'That may help a little, but the savings will be small, and students will lose a quiet place to study.'
    ],
    prompt: 'Мәтінді жазған адамның көзқарасы қандай?',
    options: ['күмәнмен қарайды', 'толық қолдайды', 'бейтарап'],
    answer: 0,
    explain: '«That may help a little, but...» — автор пайдасын аз деп санап, кемшілігін атайды. Бұл — күмәнді көзқарас.',
    review: {
      type: 'choice', prompt: 'Автордың көзқарасы қандай?',
      text: ['Some say the new park is too small. Maybe, but for our street it is a gift.'],
      options: ['паркті жақсы көреді', 'паркке қарсы', 'бейтарап'], answer: 0,
      explain: '«for our street it is a gift» — автор паркті сыйлық деп санайды.'
    }
  }
];

FEA.diagnosticEditorNotes = [
  'Каждой части соответствует одно задание на ступень — результат грубый. Только предложение стартовой ступени.',
  'd-w5 и d-g5 — узкие пункты; могут занизить или завысить результат.',
  'Перевод «barely» как «әрең, дерлік ... жоқ» — проверить специалистом по казахскому.'
];
