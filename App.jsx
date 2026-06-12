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
    text: 'Обычно твои попытки длятся:',
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
  {
    id: 'q12',
    block: 'Цель',
    text: 'Что должно измениться через 30 дней, чтобы ты сказал: «это было классно»?',
    isOpen: true,
    placeholder: 'Напишите своими словами...',
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

  const archetypes = {
    exhausted_fighter: {
      name: 'Истощённый борец',
      emoji: '🔋',
      desc: 'Мотивация есть — ресурса не хватает. Проблема не в желании, а в том, что система работает на износ.',
    },
    eternal_beginner: {
      name: 'Вечный начинающий',
      emoji: '🚀',
      desc: 'Высокий старт и быстрое угасание. Проблема не в мотивации — в управлении ожиданиями.',
    },
    perfectionist: {
      name: 'Перфекционист',
      emoji: '🎯',
      desc: 'Высокие стандарты — сила и слабость одновременно. Один пропуск не должен становиться полным отказом.',
    },
    analyst: {
      name: 'Аналитик',
      emoji: '🔬',
      desc: 'Думаешь больше, чем делаешь. Нужна не мотивация — нужна проверка гипотезы.',
    },
    reliable_executor: {
      name: 'Надёжный исполнитель',
      emoji: '⚙️',
      desc: 'Стабильный и предсказуемый. Выполняешь обязательства — нужна правильная структура.',
    },
  }

  return {
    archetype: archetypes[archetypeKey],
    indices: { energy, readiness, selfEfficacy, burnoutRisk },
    coachingStyle: answers.q11,
    goalText: answers.q12,
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
    subtitle: 'Напиши своими словами — одно главное изменение',
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

  const q = questions[step]
  const rq = requestQuestions[requestStep]

  const next = (value) => {
    const updated = { ...answers, [q.id]: value }
    setAnswers(updated)
    if (step < questions.length - 1) {
      setStep(step + 1)
      setScaleValue(5)
      setOpenText('')
    } else {
      setProfile(computeProfile(updated))
      setScreen('profile')
    }
  }

  const nextRequest = () => {
    if (requestStep < requestQuestions.length - 1) {
      setRequestStep(requestStep + 1)
    } else {
      setScreen('route')
    }
  }

  return (
    <div className="app">

      {screen === 'welcome' && (
        <div className="screen-welcome">
          <div className="welcome-content">
            <div className="logo">{'🌱'}</div>
            <h1 className="welcome-title">Habby</h1>
            <p className="welcome-subtitle">
              {'Прежде чем двигаться вперёд — нам важно понять, кто перед нами.'}
            </p>
            <p className="welcome-sub2">
              {'Это первый шаг к построению твоего личного профиля изменений — на основе поведенческой науки. Займёт 3-5 минут.'}
            </p>
            <button className="btn-start" onClick={() => setScreen('name')}>
              {'Готов'}
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
                  <button key={i} className="option-btn" onClick={() => next(opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
            {q.isScale && (
              <div className="scale-block">
                <div className="scale-value">{scaleValue}</div>
                <input
                  type="range" min="1" max="10"
                  value={scaleValue}
                  onChange={(e) => setScaleValue(Number(e.target.value))}
                  className="scale-input"
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

      {screen === 'profile' && profile && (
        <div className="screen-profile">
          <div className="profile-content">
            <p className="profile-label">{'Твой профиль готов'}</p>
            <div className="profile-emoji">{profile.archetype.emoji}</div>
            <p className="profile-greeting">{name}{', ты —'}</p>
            <h2 className="profile-type">{profile.archetype.name}</h2>
            <p className="profile-desc">{profile.archetype.desc}</p>
            <div className="indices">
              <div className="index-row">
                <span className="index-label">{'Индекс энергии'}</span>
                <span className="index-value">{profile.indices.energy}{'/100'}</span>
              </div>
              <div className="index-row">
                <span className="index-label">{'Готовность к изменениям'}</span>
                <span className="index-value">{profile.indices.readiness}{'/100'}</span>
              </div>
              <div className="index-row">
                <span className="index-label">{'Самоэффективность'}</span>
                <span className="index-value">{profile.indices.selfEfficacy}{'/100'}</span>
              </div>
              <div className="index-row">
                <span className="index-label">{'Риск выгорания'}</span>
                <span className="index-value">
                  {profile.indices.burnoutRisk === 'high' ? 'Высокий' : profile.indices.burnoutRisk === 'medium' ? 'Средний' : 'Низкий'}
                </span>
              </div>
            </div>
            <button className="btn-start" onClick={() => setScreen('request')}>
              {'Начать программу'}
            </button>
          </div>
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
                  {requestStep === requestQuestions.length - 1 ? 'Получить маршрут' : 'Далее'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {screen === 'route' && profile && (
        <div className="screen-profile">
          <div className="profile-content">
            <p className="profile-label">{'Отлично, всё готово!'}</p>
            <div className="profile-emoji">{'✅'}</div>
            <p className="profile-greeting">{name}{', твой запрос принят'}</p>
            <div className="route-goal">
              <p className="q-block-label">{'Твоя цель на 30 дней'}</p>
              <p className="profile-desc">{userRequest.mainGoal}</p>
            </div>
            <p className="profile-desc">{'Персональная программа формируется на основе твоего профиля и запроса.'}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
