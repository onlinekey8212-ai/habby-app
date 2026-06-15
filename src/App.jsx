import { useState } from 'react'
import './App.css'

const questions = [
  {
    id: 'q1',
    block: 'Энергия',
    text: 'Как часто за последние 2 недели ты чувствовал нехватку сил?',
    options: [
      { label: 'Никогда', value: 4 },
      { label: 'Редко', value: 3 },
      { label: 'Иногда', value: 2 },
      { label: 'Часто', value: 1 },
      { label: 'Почти постоянно', value: 0 },
    ],
  },
  {
    id: 'q2',
    block: 'Энергия',
    text: 'После сна ты обычно просыпаешься:',
    options: [
      { label: 'Полностью восстановленным', value: 4 },
      { label: 'Скорее восстановленным', value: 3 },
      { label: 'По-разному', value: 2 },
      { label: 'Уставшим', value: 1 },
      { label: 'Очень уставшим', value: 0 },
    ],
  },
  {
    id: 'q3',
    block: 'Перегрузка',
    text: 'Сколько времени в день остаётся лично на себя?',
    options: [
      { label: 'Больше 2 часов', value: 4 },
      { label: '1-2 часа', value: 3 },
      { label: 'Около часа', value: 2 },
      { label: 'Меньше часа', value: 1 },
      { label: 'Практически нет', value: 0 },
    ],
  },
  {
    id: 'q4',
    block: 'Перегрузка',
    text: 'Насколько ты чувствуешь себя перегруженным прямо сейчас?',
    isScale: true,
    minLabel: 'Совсем нет',
    maxLabel: 'Очень сильно',
  },
  {
    id: 'q5',
    block: 'История изменений',
    text: 'Сколько раз за последний год ты пытался изменить привычки?',
    options: [
      { label: 'Не пытался', value: 0 },
      { label: '1-2 раза', value: 1 },
      { label: '3-5 раз', value: 2 },
      { label: 'Более 5 раз', value: 3 },
      { label: 'Привычки есть, но отваливаются', value: 4 },
      { label: 'С привычками всё хорошо', value: 5 },
    ],
  },
  {
    id: 'q6',
    block: 'История изменений',
    text: 'Обычно твои попытки сформировать новую привычку длятся:',
    options: [
      { label: 'Несколько дней', value: 0 },
      { label: 'Несколько недель', value: 1 },
      { label: '1-3 месяца', value: 2 },
      { label: 'Больше 3 месяцев', value: 3 },
    ],
  },
  {
    id: 'q7',
    block: 'Что беспокоит больше всего?',
    text: 'Что тебя беспокоит больше всего прямо сейчас?',
    options: [
      { label: 'Усталость и нехватка сил', value: 'fatigue' },
      { label: 'Апатия и отсутствие мотивации', value: 'apathy' },
      { label: 'Нет дисциплины и режима', value: 'discipline' },
      { label: 'Прокрастинация', value: 'procrastination' },
      { label: 'Нехватка времени', value: 'time' },
      { label: 'Ощущение потери смысла', value: 'meaning' },
    ],
  },
  {
    id: 'q8',
    block: 'Готовность к изменениям',
    text: 'Насколько ты готов меняться прямо сейчас?',
    isScale: true,
    minLabel: 'Совсем не готов',
    maxLabel: 'Полностью готов',
  },
  {
    id: 'q9',
    block: 'Самоэффективность',
    text: 'Если бы у тебя был понятный план, ты смог бы придерживаться его месяц?',
    isScale: true,
    minLabel: 'Вряд ли',
    maxLabel: 'Точно да',
  },
  {
    id: 'q10',
    block: 'Барьеры',
    text: 'Что чаще всего мешает тебе менять привычки?',
    options: [
      { label: 'Забываю про намерение', value: 'forget' },
      { label: 'Нет сил начать', value: 'no_energy' },
      { label: 'Нет времени', value: 'no_time' },
      { label: 'Теряю мотивацию через пару дней', value: 'motivation' },
      { label: 'Беру слишком много сразу', value: 'overload' },
      { label: 'Привычки держатся хорошо, другие сложности', value: 'other' },
    ],
  },
  {
    id: 'q11',
    block: 'Стиль поддержки',
    text: 'Какая поддержка тебе ближе всего?',
    options: [
      { label: 'Строгая и требовательная', value: 'directive' },
      { label: 'Структурированная и чёткая', value: 'structured' },
      { label: 'Аналитическая с объяснениями', value: 'analytical' },
      { label: 'Тёплая и заботливая', value: 'supportive' },
    ],
  },
]

function computeProfile(answers) {
  const energy = Math.round((((answers.q1 || 0) + (answers.q2 || 0) + (answers.q3 || 0)) / 12) * 100)
  const readiness = Math.round((((answers.q8 || 5) - 1) / 9) * 100)
  const selfEfficacy = Math.round((((answers.q9 || 5) - 1) / 9) * 100)
  const shortCycles = (answers.q6 || 0) <= 1
  const burnoutRisk = energy < 35 ? 'high' : energy < 55 ? 'medium' : 'low'

  let archetypeKey = 'reliable_executor'
  if (energy < 45 && readiness > 55) archetypeKey = 'exhausted_fighter'
  else if (readiness > 55 && shortCycles) archetypeKey = 'eternal_beginner'
  else if (selfEfficacy > 65 && energy > 55) archetypeKey = 'perfectionist'
  else if (answers.q7 === 'meaning') archetypeKey = 'analyst'
  else if (readiness > 65 && selfEfficacy < 40) archetypeKey = 'fast_results'
  else if (answers.q11 === 'supportive' && selfEfficacy > 55) archetypeKey = 'hidden_leader'
  else if (energy < 40 && readiness < 40) archetypeKey = 'careful_observer'
  else if (selfEfficacy > 60 && answers.q7 === 'discipline') archetypeKey = 'self_critic'
  else if (answers.q10 === 'motivation' && energy > 55) archetypeKey = 'explorer'
  const archetypes = {
    exhausted_fighter: {
      name: 'Истощённый борец',
      emoji: '🔋',
      desc: 'Ты продолжаешь двигаться вперёд даже когда сил почти не остаётся. Это говорит о высокой внутренней мотивации — она у тебя есть. Изменения в таком состоянии требуют непропорционально много усилий. Первый шаг — восстановить силы и наладить режим. Изменения закрепляются тогда, когда есть из чего брать энергию.',
    },
    eternal_beginner: {
      name: 'Вечный начинающий',
      emoji: '🚀',
      desc: 'Ты умеешь создавать импульс. Старты даются легко — есть энергия, есть намерение. После старта нет структуры, которая удерживала бы движение. Именно здесь цикл прерывается. Задача — выстроить то, что работает и без мотивации.',
    },
    perfectionist: {
      name: 'Перфекционист',
      emoji: '🎯',
      desc: 'Ты привык делать хорошо. Это сильная черта, которая помогает в работе и в жизни. В изменениях она же создаёт дополнительное давление: один пропуск воспринимается как нарушение всего плана. Ключевой момент — научиться продолжать после сбоя, не возвращаясь к началу. Это навык, который можно выработать.',
    },
    analyst: {
      name: 'Аналитик',
      emoji: '🔬',
      desc: 'Ты хорошо понимаешь, как устроены процессы. Перед действием стараешься разобраться в механике — это помогает принимать взвешенные решения. Старт откладывается — хочется сначала разобраться до конца. Потребность в полной ясности перед действием иногда останавливает движение раньше, чем оно начинается. Первый шаг не обязан быть идеальным. Он просто должен быть.',
    },
    reliable_executor: {
      name: 'Надёжный исполнитель',
      emoji: '⚙️',
      desc: 'Когда есть понятная структура — ты работаешь стабильно. Умеешь держать ритм и выполнять то, что запланировано. Трудности появляются там, где рутина становится слишком однообразной: интерес снижается, вовлечённость падает. Система привычек для тебя должна сочетать предсказуемость с периодическими новыми элементами.',
    },
    fast_results: {
      name: 'Искатель быстрых результатов',
      emoji: '⚡',
      desc: 'Ты легко включаешься в процесс, когда видишь смысл и перспективу. Готовность действовать высокая. Сложность возникает на отрезках, где результат пока не виден — именно здесь мотивация начинает снижаться. Важно выстроить систему промежуточных ориентиров: небольших, но ощутимых результатов каждые несколько дней.',
    },
    hidden_leader: {
      name: 'Скрытый лидер',
      emoji: '🤝',
      desc: 'В правильной среде ты очень надёжен. Когда рядом есть человек, которому важен твой результат — включаешься полностью. Долго справляешься самостоятельно, не обозначая трудностей. Внешняя точка ответственности значительно ускоряет движение — и тебе она подходит особенно хорошо.',
    },
    careful_observer: {
      name: 'Осторожный наблюдатель',
      emoji: '🔍',
      desc: 'Перед новым шагом тебе важно понимать, что именно произойдёт. Неопределённость создаёт внутреннее сопротивление — и старт откладывается, даже когда желание есть. Когда маршрут понятен и расписан по шагам — движение начинается значительно легче. Первые успехи быстро меняют внутреннее ощущение.',
    },
    self_critic: {
      name: 'Самокритик',
      emoji: '💭',
      desc: 'Ты относишься к себе с высокими требованиями. Стараешься делать хорошо и замечаешь, когда что-то идёт не так. После срыва или пропуска внутренняя реакция бывает жёсткой — и именно она чаще всего прерывает движение. Умение продолжать без самонаказания — это отдельный навык. Он вырабатывается.',
    },
    explorer: {
      name: 'Исследователь',
      emoji: '🌱',
      desc: 'Ты легко адаптируешься и открыт к новому. Быстро осваиваешь незнакомые форматы и находишь в них интерес. Когда процесс становится привычным — вовлечённость снижается и внимание переключается. Задача — выстроить систему с постоянной основой и регулярным обновлением форматов.',
    },
  }
  const motivationType = answers.q7 === 'fatigue' || answers.q7 === 'apathy' ? 'Восстановительная' : answers.q7 === 'discipline' || answers.q7 === 'procrastination' ? 'Дисциплинарная' : 'Смысловая'
  const behaviorStyle = answers.q11 === 'directive' ? 'Директивный' : answers.q11 === 'structured' ? 'Структурный' : answers.q11 === 'analytical' ? 'Аналитический' : 'Поддерживающий'
  const dropoutRisk = readiness < 35 ? 'Высокий' : readiness < 60 ? 'Средний' : 'Низкий'
  const mainBarrier = answers.q10 === 'forget' ? 'Забываю про намерение' : answers.q10 === 'no_energy' ? 'Нет сил начать' : answers.q10 === 'no_time' ? 'Нехватка времени' : answers.q10 === 'motivation' ? 'Теряю мотивацию' : answers.q10 === 'overload' ? 'Беру слишком много' : 'Другие сложности'
  const habitSize = energy < 40 ? '2 мин' : energy < 65 ? '5 мин' : '10 мин'
  const maxHabits = energy < 40 ? '1' : energy < 65 ? '2' : '3'
  const changeSpeed = readiness < 35 ? 'Медленный' : readiness < 65 ? 'Умеренный' : 'Интенсивный'

  return {
    archetype: archetypes[archetypeKey],
    indices: { energy, readiness, selfEfficacy, burnoutRisk },
    coachingStyle: answers.q11,
    goalText: answers.q12,
    extra: { motivationType, behaviorStyle, dropoutRisk, mainBarrier, habitSize, maxHabits, changeSpeed },
  }
}

const requestQuestions = [
  {
    id: 'rq1',
    type: 'multiselect',
    title: 'Что происходит прямо сейчас?',
    subtitle: 'Выбери всё, что откликается',
    options: [
      'Нет сил с утра',
      'Начинаю и бросаю',
      'Прокрастинирую',
      'Не могу выстроить режим',
      'Тревога и стресс',
      'Хочу, но не делаю',
    ],
    field: 'problems',
  },
  {
    id: 'rq2',
    type: 'textarea',
    title: 'Что хотелось бы достичь в рамках 30 дней?',
    subtitle: 'Напиши подробно — что именно хочешь получить',
    placeholder: 'Например: просыпаться с энергией, перестать откладывать важное...',
    field: 'mainGoal',
    required: true,
  },
  {
    id: 'rq3',
    type: 'textarea',
    title: 'Как начинается твоё утро?',
    subtitle: 'Опиши типичное утро — это поможет найти точку входа',
    placeholder: 'Например: просыпаюсь тяжело, сразу беру телефон...',
    field: 'dayMorning',
    required: true,
  },
  {
    id: 'rq4',
    type: 'textarea',
    title: 'Что мешает тебе в течение дня?',
    subtitle: 'Что забирает энергию или сбивает с курса?',
    placeholder: 'Например: отвлекаюсь на уведомления, теряю фокус после обеда...',
    field: 'dayMiddle',
    required: true,
  },
  {
    id: 'rq5',
    type: 'textarea',
    title: 'Как заканчивается твой вечер?',
    subtitle: 'Что происходит в конце дня?',
    placeholder: 'Например: сижу в телефоне до ночи, чувствую что день прошёл впустую...',
    field: 'dayEvening',
    required: true,
  },
]

function App() {
  const [screen, setScreen] = useState('welcome')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [scaleValue, setScaleValue] = useState(5)
  const [openText, setOpenText] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState(null)
  const [userRequest, setUserRequest] = useState({
    problems: [],
    mainGoal: '',
    dayMorning: '',
    dayMiddle: '',
    dayEvening: '',
  })
  const [requestStep, setRequestStep] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState(null)
  const [expandedPricing, setExpandedPricing] = useState(null)
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: `Привет, ${name || 'друг'}! Я Habby AI — твой персональный коуч. Я знаю твой архетип, индексы и цели. Чем могу помочь?` }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)
    try {
      const systemPrompt = `Ты Habby AI — персональный AI-коуч платформы Habby. Ты работаешь на пересечении поведенческой психологии, нейробиологии и науки о привычках.

ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ:
- Имя: ${name}
- Архетип: ${profile?.archetype?.name}
- Тип мотивации: ${profile?.extra?.motivationType}
- Поведенческий стиль: ${profile?.extra?.behaviorStyle}
- Риск отката: ${profile?.extra?.dropoutRisk}
- Главный барьер: ${profile?.extra?.mainBarrier}
- Темп изменений: ${profile?.extra?.changeSpeed}
- Цель: ${userRequest?.mainGoal}

ЖЕЛЕЗНЫЕ ПРАВИЛА:
1. Любой вывод опирается ТОЛЬКО на данные профиля. Никогда не придумывай факты.
2. Формула: ДАННЫЕ → ПАТТЕРН → ОБЪЯСНЕНИЕ → ВЛИЯНИЕ → ПРАКТИЧЕСКИЙ ВЫВОД
3. Запрещено: диагнозы, шаблонные фразы, общие слова, выводы без данных.
4. Каждый ответ содержит связь с конкретными данными пользователя.

СТИЛЬ:
- Живой язык, экспертный тон, не бот
- Пиши цельным текстом, не списками и не заголовками
- Каждый ответ — минимум 2 уровня глубины
- Обращение: "ты". Язык: русский.

БАЛАНС ДЛИНЫ ОТВЕТА:
При анализе профиля, архетипа, результатов диагностики — ответ может быть развёрнутым. Пользователь должен чувствовать: "Меня действительно поняли".
При обычном диалоге — сокращай объём на 20-30%. Убирай повторения одной мысли, длинные вступления, очевидные пояснения, избыточную поддержку и фразы ради мягкости.

СТРУКТУРА ОТВЕТА: Короткий вывод → объяснение → конкретный следующий шаг.

ПРОВЕРКА ПЕРЕД ОТПРАВКОЙ: "Если убрать 30% текста — сохранится ли весь смысл?" Если да — сокращать.

ТОН:
Не: "Я очень рад что ты поделился. Давай подробно разберём..."
Да: "Здесь видно два момента:..."
Не: "Это может быть связано с тем что возможно..."
Да: "Вероятнее всего причина в..."

РЕКОМЕНДАЦИИ: максимум 1-3 ключевых действия. Не давать 10 пунктов.
ИТОГОВЫЙ СТИЛЬ: глубина психолога + краткость сильного коуча. Звучать спокойно, уверенно, профессионально. Как эксперт который понимает — не как ассистент который старается понравиться.

ЗАПРЕЩЕНО:
- "хаос", "половинчатость", "рассыпается", "нейробиологический"
- Звёздочки в тексте, короткие обрывки, заголовки внутри ответа
- Эмодзи в ответах

СТРОГО ЗАПРЕЩЕНА конструкция "это не X, это Y" в любых вариациях:
- "это не слабость, это..."
- "ты сейчас не в X, ты в Y"
- "это не проблема X, это Y"
- "не X, а Y" как противопоставление
- "это не абстракция, это..."
- "ты не строишь X, ты Y"
- "не из желания X, а из потребности Y"
- любое объяснение через отрицание предыдущего
Объяснять только через прямое утверждение.
Плохо: "Апатия — это не слабость, это стоп-сигнал"
Хорошо: "Апатия здесь работает как защитный механизм мозга при перегрузке"

ЗАПРЕЩЕНЫ академические конструкции: "физиологические и когнитивные состояния", "нейробиологический" и подобные.
ПРАВИЛО ПРОСТОТЫ: каждое предложение понятно человеку без специального образования. Если можно сказать проще — говорить проще.

ЭКСПЕРТИЗА — АВТОРСКАЯ МЕТОДОЛОГИЯ HABBY:

ПРИВЫЧКА: автоматический сценарий поведения без усилий и обдумывания. Мозгу неважно хорошая или плохая — важно сэкономить энергию. 3 этапа формирования: Триггер → Реакция → Награда. Мозг запоминает эту цепочку и стремится повторить.

МОТИВАЦИЯ: вспышка, не стратегия. Временный ресурс — появляется и исчезает независимо от желания. Нельзя ждать мотивацию — нужно начинать в любом состоянии. На старте задача не результат — а создание устойчивой системы повторений.

ТРИГГЕР: должен быть ежедневным, привязанным к уже существующему действию, в одном месте, чётко сформулированным. Метод стыковки: "После [существующее действие] → делаю [новое действие]". Без чёткого триггера привычка не формируется.

НАГРАДА: должна быть немедленной — отложенные не формируют привычку. Мозг активен в момент предвкушения, не получения. Внутренняя награда (удовольствие от процесса) устойчивее внешней.

ОТКАТ: не провал, а вызов. В момент усталости старые паттерны берут верх — это нормально. Вопрос не "почему сорвался" а "что минимально можно сделать сегодня чтобы остаться в игре".

НАКОПИТЕЛЬНЫЙ ЭФФЕКТ: маленькие действия + постоянство + время = большой результат. 3 фазы: инвестиции (результата не видно) → появление изменений → видимый рост. Большинство сдаются в фазе 1 думая что дальше будет так же тяжело. График идёт по экспоненте — сначала плато, потом резкий рост.

СРЕДА: важнее силы воли. Поведение определяется окружением. Ищи не "почему ты не сделал" а "что в окружении усложняет действие". Убирать барьеры эффективнее чем усиливать мотивацию.

ИДЕНТИЧНОСТЬ: устойчивое поведение формируется через самовосприятие. Каждое маленькое выполненное действие — голос за новую версию себя. Показать что даже маленький шаг работает на систему.

ЦЕЛЬ: после каждого ответа пользователь думает: "Меня поняли. Я знаю что делать дальше."`
  const response = await fetch('https://rsvngqyaxvgxgkxkhjef.supabase.co/functions/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_KEY}`,
    },
    body: JSON.stringify({
      messages: [...chatMessages, { role: 'user', content: userMsg }].map(m => ({ role: m.role, content: m.content })),
      systemPrompt: systemPrompt
    })
  })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Что-то пошло не так. Попробуй ещё раз.'
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setChatMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${err.message}` }])
    }
setChatLoading(false)
  }

  const q = questions[step]
  const rq = requestQuestions[requestStep]

  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const next = (value) => {
    const updated = { ...answers, [q.id]: value }
    setAnswers(updated)
    setSelectedAnswer(value)
    setTimeout(() => {
      setSelectedAnswer(null)
      if (step < questions.length - 1) {
        setStep(step + 1)
        setScaleValue(5)
        setOpenText('')
      } else {
        setProfile(computeProfile(updated))
        setScreen('mid')
      }
    }, 400)
  }

  const nextRequest = () => {
    if (requestStep < requestQuestions.length - 1) {
      setRequestStep(requestStep + 1)
    } else {
      setScreen('profile')
    }
  }

  return (
    <div className="app">

{screen === 'welcome' && (
  <div className="screen-welcome">
    <div className="welcome-content">
    <div className="logo">{'🌱'}</div>
    <h1 className="welcome-headline">{'Привет, я Habby.'}</h1>
      <p className="welcome-body">{'За несколько минут мы создадим твой поведенческий профиль.'}</p>
      <p className="welcome-body">{'Посмотрим, как ты принимаешь решения, формируешь привычки и справляешься с изменениями.'}</p>
      <p className="welcome-accent">{'Это не оценка, а возможность лучше понять себя.'}</p>
      <p className="welcome-body">{'На основе результатов я настрою всё персонально под тебя.'}</p>
      <button className="btn-start" onClick={() => setScreen('name')}>
        {'Готов начать'}
      </button>
    </div>
  </div>
)}

      {screen === 'name' && (
        <div className="screen-diagnostic">
          <div className="q-block">
            <p className="q-block-label">{'Начнём'}</p>
            <h2 className="q-text">{'Как тебя зовут?'}</h2>
            <input
              className="name-input"
              placeholder="Твоё имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button
              className="btn-start"
              onClick={() => setScreen('diagnostic')}
              disabled={!name.trim()}
            >
              {'Продолжить'}
            </button>
          </div>
        </div>
      )}

      {screen === 'diagnostic' && (
        <div className="screen-diagnostic">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="q-counter">{step + 1} {'из'} {questions.length}</div>
          <p className="q-block-label">{q.block}</p>
          <div className="q-block">
            <h2 className="q-text">{q.text}</h2>
            {!q.isScale && !q.isOpen && (
              <div className="options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn${selectedAnswer === opt.value ? ' selected' : ''}`}
                    onClick={() => next(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
        {q.isScale && (
  <div className="scale-block">
    <div className="scale-value-display">{scaleValue}</div>
    <input
      type="range" min="1" max="10"
      value={scaleValue}
      onChange={(e) => setScaleValue(Number(e.target.value))}
      className="scale-input"
      style={{ '--val': scaleValue }}
    />
    <div className="scale-labels">
      <span>{q.minLabel}</span>
      <span>{q.maxLabel}</span>
    </div>
    <button className="btn-start" onClick={() => next(scaleValue)}>
      {'Далее'}
    </button>
    </div>
        )}
            {q.isOpen && (
              <div className="open-block">
                <textarea
                  className="open-textarea"
                  placeholder={q.placeholder}
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  rows={5}
                />
                <button
                  className="btn-start"
                  onClick={() => next(openText)}
                  disabled={openText.trim().length < 3}
                >
                  {'Завершить диагностику'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

{screen === 'mid' && (
        <div className="screen-welcome">
          <div className="welcome-content">
            <div className="logo">{'🌱'}</div>
            <h1 className="welcome-headline">{'Уже анализирую твои данные.'}</h1>
            <p className="welcome-body">{'Я начинаю собирать твой профиль на основе ответов.'}</p>
            <p className="welcome-accent">{'Осталось несколько вопросов — и картина станет полной.'}</p>
            <button className="btn-start" onClick={() => setScreen('request')}>
              {'Продолжить'}
            </button>
          </div>
        </div>
      )}

{screen === 'profile' && profile && (
  <div className="screen-profile-new">
   <div className="profile-card">
   <p className="profile-card-title">{name}{', твой архетип — '}{profile.archetype.name}</p>
</div>
<div className="profile-card">
  <p className="profile-card-body">{profile.archetype.desc}</p>
</div>
    <div className="indices-new">
      {[
        {
          id: 'energy',
          label: 'Индекс энергии',
          value: `${profile.indices.energy}/100`,
          percent: profile.indices.energy,
          level: profile.indices.energy < 35 ? 'low' : profile.indices.energy < 65 ? 'mid' : 'high',
          short: profile.indices.energy < 35 ? 'Сейчас восстановление не успевает за нагрузкой' : profile.indices.energy < 65 ? 'Уровень энергии меняется от дня к дню' : 'Хороший запас энергии для изменений',
          detail: profile.indices.energy < 35
            ? 'Даже простые задачи могут требовать больше усилий, чем обычно. Сейчас важнее регулярность, чем объём. Начинай с самых простых действий, которые легко выполнить даже в непростой день.'
            : profile.indices.energy < 65
            ? 'В одни периоды ты легко включаешься в задачи, в другие — требуется больше времени на старт. Лучше опираться на понятный ритм и заранее выбранное время для привычек.'
            : 'Обычно ты способен поддерживать активность без выраженного чувства истощения. Можно двигаться уверенно и постепенно увеличивать нагрузку.',
        },
        {
          id: 'readiness',
          label: 'Готовность к изменениям',
          value: `${profile.indices.readiness}/100`,
          percent: profile.indices.readiness,
          level: profile.indices.readiness < 35 ? 'low' : profile.indices.readiness < 65 ? 'mid' : 'high',
          short: profile.indices.readiness < 35 ? 'Сейчас изменения не в центре внимания' : profile.indices.readiness < 65 ? 'Интерес к изменениям есть, но пока нет устойчивого импульса' : 'Подходящий период для изменений',
          detail: profile.indices.readiness < 35
            ? 'Больше сил уходит на решение текущих задач. Полезнее сначала разобраться, что именно забирает внимание и желание двигаться дальше.'
            : profile.indices.readiness < 65
            ? 'Решение может откладываться, даже когда понимаешь его важность. Лучше сосредоточиться на одном конкретном действии и заранее определить, когда именно оно будет происходить.'
            : 'Есть внутренний настрой действовать. Самый устойчивый прогресс начинается с простых действий, которые легко повторять каждый день.',
        },
        {
          id: 'selfEfficacy',
          label: 'Самоэффективность',
          value: `${profile.indices.selfEfficacy}/100`,
          percent: profile.indices.selfEfficacy,
          level: profile.indices.selfEfficacy < 35 ? 'low' : profile.indices.selfEfficacy < 65 ? 'mid' : 'high',
          short: profile.indices.selfEfficacy < 35 ? 'Сложно рассчитывать на стабильность в долгосрочной перспективе' : profile.indices.selfEfficacy < 65 ? 'Уверенность во многом зависит от обстоятельств' : 'Обычно рассчитываешь на себя и веришь в результат',
          detail: profile.indices.selfEfficacy < 35
            ? 'Обычно это связано с предыдущим опытом, когда планы приходилось менять. Начинать с очень простых действий, которые легко выполнить даже в загруженный день.'
            : profile.indices.selfEfficacy < 65
            ? 'Когда есть понятный план — двигаться значительно легче. Чем понятнее структура действий, тем меньше приходится полагаться на случайный прилив мотивации.'
            : 'Такая уверенность помогает быстрее включаться в изменения. Важно сохранять реалистичный темп и оставлять пространство для восстановления.',
        },
        {
          id: 'burnout',
          label: 'Риск выгорания',
          value: profile.indices.burnoutRisk === 'high' ? 'Высокий' : profile.indices.burnoutRisk === 'medium' ? 'Средний' : 'Низкий',
          percent: profile.indices.burnoutRisk === 'high' ? 20 : profile.indices.burnoutRisk === 'medium' ? 55 : 88,
          level: profile.indices.burnoutRisk === 'high' ? 'low' : profile.indices.burnoutRisk === 'medium' ? 'mid' : 'high',
          short: profile.indices.burnoutRisk === 'high' ? 'Нагрузка занимает значительную часть ресурсов' : profile.indices.burnoutRisk === 'medium' ? 'Текущий баланс требует внимания' : 'Достаточно ресурса для постепенных изменений',
          detail: profile.indices.burnoutRisk === 'high'
            ? 'Даже полезные изменения могут восприниматься как дополнительное давление. Сосредоточиться на восстановлении устойчивого ритма. На старте лучше выбирать одну небольшую привычку.'
            : profile.indices.burnoutRisk === 'medium'
            ? 'При накоплении задач или стресса запас ресурса может быстро снижаться. Поддерживать предсказуемый темп изменений и не перегружать систему несколькими задачами одновременно.'
            : 'Организм справляется с текущей нагрузкой. Можно двигаться в комфортном темпе и постепенно наращивать изменения.',
        },
      ].map((item) => (
        <div key={item.id} className="index-row-new index-expandable" onClick={() => setExpandedIndex(expandedIndex === item.id ? null : item.id)}>
          <div className="index-col">
            <span className="index-label-new">{item.label}</span>
            <span className="index-explain">{item.short}</span>
            <div className="index-progress-bar">
              <div className="index-progress-fill" style={{ width: `${item.percent}%` }} data-level={item.level} />
            </div>
            {expandedIndex === item.id && (
              <span className="index-detail">{item.detail}</span>
            )}
          </div>
          <div className="index-right">
            <span className={`index-value-new index-value-${item.level}`}>{item.value}</span>
            <span className="index-arrow">{expandedIndex === item.id ? 'свернуть ▲' : 'подробнее ↓'}</span>
          </div>
        </div>
      ))}
    </div>
    <p className="indices-section-label">{'Поведенческий профиль 🔒 — Basic и Pro'}</p>
    <div className="indices-new indices-locked indices-locked-basic">
    <div className="index-row-new locked-row">
<span className="index-label-new">{'Тип мотивации'}</span>
<span className="index-value-locked">{profile.extra.motivationType} 🔒</span>
</div>
<div className="index-row-new locked-row">
        <span className="index-label-new">{'Поведенческий стиль'}</span>
<span className="index-value-locked">{profile.extra.behaviorStyle} 🔒</span>
</div>
      <div className="index-row-new locked-row">
      <span className="index-label-new">{'Риск отката'}</span>
      <span className="index-value-locked">{profile.extra.dropoutRisk} 🔒</span>
      </div>
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Главный барьер'}</span>
        <span className="index-value-locked">{profile.extra.mainBarrier} 🔒</span>
      </div>
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Темп изменений'}</span>
        <span className="index-value-locked">{profile.extra.changeSpeed} 🔒</span>
      </div>
      </div>
    <p className="indices-section-label">{'Глубинный профиль 🔒 — только Pro'}</p>
    <div className="indices-new indices-locked indices-locked-pro">
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Триггеры срыва'}</span>
        <span className="index-value-locked">{'🔒'}</span>
      </div>
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Скрытый риск'}</span>
        <span className="index-value-locked">{'🔒'}</span>
      </div>
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Сильная сторона'}</span>
        <span className="index-value-locked">{'🔒'}</span>
      </div>
      <div className="index-row-new locked-row">
        <span className="index-label-new">{'Зона роста'}</span>
        <span className="index-value-locked">{'🔒'}</span>
      </div>
      </div>
      <button className="btn-start" onClick={() => { setScreen('route'); window.scrollTo(0, 0); }}>
      {'Мой маршрут →'}
    </button>
  </div>
)}

      {screen === 'request' && (
        <div className="screen-diagnostic">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((requestStep + 1) / requestQuestions.length) * 100}%` }} />
          </div>
          <div className="q-counter">{requestStep + 1} {'из'} {requestQuestions.length}</div>
          <div className="q-block">
            <h2 className="q-text">{rq.title}</h2>
            <p className="q-subtitle">{rq.subtitle}</p>
            {rq.type === 'multiselect' && (
              <div className="multiselect-block">
                {rq.options.map((opt) => (
                  <button
                    key={opt}
                    className={`option-btn${userRequest.problems.includes(opt) ? ' selected' : ''}`}
                    onClick={() => setUserRequest(r => ({
                      ...r,
                      problems: r.problems.includes(opt)
                        ? r.problems.filter(x => x !== opt)
                        : [...r.problems, opt]
                    }))}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  className="btn-start"
                  disabled={userRequest.problems.length === 0}
                  onClick={nextRequest}
                  style={{ marginTop: '24px' }}
                >
                  {'Далее'}
                </button>
              </div>
            )}
            {rq.type === 'textarea' && (
              <div className="open-block">
                <textarea
                  className="open-textarea"
                  placeholder={rq.placeholder}
                  value={userRequest[rq.field] || ''}
                  onChange={(e) => setUserRequest(r => ({ ...r, [rq.field]: e.target.value }))}
                  rows={6}
                />
                <button
                  className="btn-start"
                  disabled={rq.required && (userRequest[rq.field] || '').trim().length < 3}
                  onClick={nextRequest}
                >
             {requestStep === requestQuestions.length - 1 ? 'Получить профиль' : 'Далее'}
                </button>
              </div>
            )}
</div>
    </div>
  )}

{screen === 'chat' && profile && (
  <div className="screen-chat">
 <div className="chat-header">
  <button className="chat-back" onClick={() => setScreen('route')}>{'←'}</button>
  <div className="chat-header-info">
    <div className="chat-header-title">{'🌱 Habby AI'}</div>
    <div className="chat-header-sub">{name} · {profile?.archetype?.name}</div>
  </div>
</div>
    <div className="chat-messages" id="chat-messages">
      {chatMessages.map((msg, i) => (
        <div key={i} className={`chat-message ${msg.role}`}>
          <div className="chat-bubble">{msg.content}</div>
        </div>
      ))}
      {chatLoading && (
        <div className="chat-message assistant">
          <div className="chat-bubble">
            <div className="chat-typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="chat-input-block">
      <input
        className="chat-input"
        placeholder="Напиши вопрос..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
      />
      <button className="chat-send" onClick={sendChatMessage}>{'→'}</button>
    </div>
  </div>
)}

{screen === 'route' && profile && (
<div className="screen-welcome screen-route">
    <div className="welcome-content">
      <div className="logo">{'🌱'}</div>
      <h1 className="welcome-headline">{'Твой профиль собран.'}</h1>
      <p className="welcome-body">{'Я проанализировал твои ответы, поведенческие паттерны и особенности твоего подхода к изменениям.'}</p>
      <p className="welcome-body">{'На основе этого я собрал для тебя персональный маршрут — он учитывает твой архетип, внутренние барьеры и цель, которую ты обозначил.'}</p>
      <div className="route-goal-block">
        <p className="route-goal-label">{'Твоя цель:'}</p>
        <p className="route-goal-text">{userRequest.mainGoal}</p>
      </div>
      <p className="welcome-accent">{'Этот маршрут собран под твой способ мышления и изменения привычек.'}</p>
      <p className="welcome-body">{'Выбери уровень, с которым хочешь начать:'}</p>
      <div className="pricing-blocks">
  <div className="pricing-card pricing-free">
    <p className="pricing-title">{'Free'}</p>
    <p className="pricing-price">{'$0'}</p>
    <ul className="pricing-features">
      <li>{'Результаты полной диагностики (11 вопросов)'}</li>
      <li>{'Архетип + описание'}</li>
      <li>{'4 индекса с расшифровкой'}</li>
      <li>{'Главный барьер'}</li>
      <li>{'Базовый маршрут формирования привычек'}</li>
      <li>{'Базовый дашборд привычек и показателей'}</li>
      <li>{'Habby AI — 3 запроса/день'}</li>
      <li>{'Habby AI — рекомендации недоступны'}</li>
    </ul>
    <button className="btn-pricing-free">{'Начать бесплатно'}</button>
  </div>
  <div className="pricing-card pricing-basic">
    <p className="pricing-title">{'Basic'}</p>
    <p className="pricing-price">{'$24/мес'}</p>
    <ul className="pricing-features">
      <li>{'Всё из Free'}</li>
      <li>{'Поведенческий профиль'}</li>
      <li>{'Персонализированный маршрут формирования привычек'}</li>
      <li>{'Персональные рекомендации привычек от Habby AI под твой архетип'}</li>
      <li>{'Расширенный дашборд привычек и показателей'}</li>
      <li>{'Habby AI — 20 запросов/день'}</li>
      <li>{'Habby AI — ограниченные рекомендации'}</li>
      <li>{'2 звонка с коучем/месяц (30 мин, раз в 2 недели)'}</li>
      <li>{'Без анализа видеозвонков с коучем от AI'}</li>
    </ul>
    <button className="btn-pricing-basic">{'Выбрать Basic'}</button>
  </div>
  <div className="pricing-card pricing-pro">
  <p className="pricing-title">{'Pro'}</p>
  <p className="pricing-price">{'$90/мес'}</p>
  <ul className="pricing-features">
    <li>{'Всё из Basic'}</li>
    <li>{'Глубинный профиль (триггеры срыва, скрытый риск, сильная сторона, зона роста)'}</li>
    <li>{'Максимальная персонализация маршрута под архетип с учётом анализа коуч-сессий и рекомендаций от Habby AI'}</li>
    <li
      className="pricing-expandable"
      onClick={() => setExpandedPricing(expandedPricing === 'personalization' ? null : 'personalization')}
    >
      {'Персонализация профиля каждые 7, 14 и 30 дней '}
      <span className="pricing-expand-btn">{expandedPricing === 'personalization' ? 'свернуть ▲' : 'подробнее ↓'}</span>
      {expandedPricing === 'personalization' && (
        <span className="pricing-expand-text">{'Система сравнивает твои реальные действия, отчёты и состояние с первоначальным профилем. На основе этого уточняет твой архетип, поведенческие паттерны и рекомендации — так профиль становится точнее с каждой неделей.'}</span>
      )}
    </li>
    <li>{'Habby AI — безлимит + полное сопровождение, рекомендации, аналитика'}</li>
    <li
      className="pricing-expandable"
      onClick={() => setExpandedPricing(expandedPricing === 'video' ? null : 'video')}
    >
      {'Анализ видеосессий с коучем от Habby AI '}
      <span className="pricing-expand-btn">{expandedPricing === 'video' ? 'свернуть ▲' : 'подробнее ↓'}</span>
      {expandedPricing === 'video' && (
        <span className="pricing-expand-text">{'После каждого звонка с коучем Habby AI анализирует сессию — что обсуждалось, где были точки прорыва. Ты получаешь персональный отчёт: с чем поработать дальше, какие блоки проработаны, что изменить в маршруте.'}</span>
      )}
    </li>
    <li>{'4 звонка с коучем/месяц (30 мин, раз в неделю)'}</li>
    <li>{'Персональный чат с коучем'}</li>
  </ul>
  <button className="btn-pricing-pro">{'Выбрать Pro'}</button>
      </div>
      </div>
      <div className="habby-ai-card" onClick={() => setScreen('chat')}>
        <div className="habby-ai-card-icon">{'🌱'}</div>
        <div>
          <div className="habby-ai-card-title">{'Habby AI — твой коуч'}</div>
          <div className="habby-ai-card-sub">{'Задай любой вопрос о своём профиле'}</div>
        </div>
      </div>
    </div>
  </div>
)}
</div>
  )
}

export default App
