import { useState } from 'react'
import './App.css'

const questions = [
  { id: 1, text: 'Как часто ты просыпаешься с ощущением усталости?', options: ['Редко', 'Иногда', 'Часто', 'Почти всегда'] },
  { id: 2, text: 'Насколько легко тебе начать дело, когда нет настроения?', options: ['Легко', 'Средне', 'Тяжело', 'Очень тяжело'] },
  { id: 3, text: 'Как часто ты откладываешь важные дела на потом?', options: ['Редко', 'Иногда', 'Часто', 'Постоянно'] },
  { id: 4, text: 'Ты чаще бросаешь начатое или доводишь до конца?', options: ['Всегда довожу', 'Чаще довожу', 'Чаще бросаю', 'Всегда бросаю'] },
  { id: 5, text: 'Твой уровень энергии к вечеру обычно:', options: ['Нормальный', 'Средний', 'Низкий', 'Нулевой'] },
  { id: 6, text: 'Как ты справляешься со стрессом?', options: ['Хорошо', 'Средне', 'Плохо', 'Очень плохо'] },
  { id: 7, text: 'Насколько ты доволен своей дисциплиной?', options: ['Полностью', 'В целом да', 'Не очень', 'Совсем нет'] },
  { id: 8, text: 'Как тебя зовут?', isName: true }
]

function getProfile(answers) {
  const score = answers.slice(0, 7).reduce((sum, a) => sum + a, 0)
  if (score <= 7) return { type: 'Энерджайзер', desc: 'У тебя хорошая база. Нужна система для роста.', emoji: '⚡' }
  if (score <= 14) return { type: 'Перезарядник', desc: 'Энергия есть, но быстро тратится. Нужен ритм.', emoji: '🔋' }
  if (score <= 18) return { type: 'Восстановитель', desc: 'Накопилась усталость. Начнём с малого.', emoji: '🌱' }
  return { type: 'Перезагрузка', desc: 'Ресурс на минимуме. Мягкий старт — твой путь.', emoji: '🤍' }
}

function App() {
  const [screen, setScreen] = useState('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [name, setName] = useState('')
  const [selectedProblem, setSelectedProblem] = useState('')

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setScreen('profile')
    }
  }

  const profile = getProfile(answers)

  return (
    <div className="app">

      {screen === 'welcome' && (
        <div className="screen-welcome">
          <div className="welcome-content">
            <div className="logo">🌱</div>
            <h1 className="welcome-title">Habby</h1>
            <p className="welcome-subtitle">
              Персональная AI‑платформа для восстановления энерго‑эмоционального состояния
            </p>
            <button className="btn-start" onClick={() => setScreen('diagnostic')}>
              Начать
            </button>
          </div>
        </div>
      )}

      {screen === 'diagnostic' && (
        <div className="screen-diagnostic">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="q-counter">{currentQ + 1} из {questions.length}</div>
          {questions[currentQ].isName ? (
            <div className="q-block">
              <h2 className="q-text">{questions[currentQ].text}</h2>
              <input className="name-input" placeholder="Твоё имя" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
              <button className="btn-start" onClick={() => name.trim() && handleAnswer(0)} disabled={!name.trim()}>
                Продолжить
              </button>
            </div>
          ) : (
            <div className="q-block">
              <h2 className="q-text">{questions[currentQ].text}</h2>
              <div className="options">
                {questions[currentQ].options.map((opt, i) => (
                  <button key={i} className="option-btn" onClick={() => handleAnswer(i)}>{opt}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {screen === 'profile' && (
        <div className="screen-profile">
          <div className="profile-content">
            <div className="profile-emoji">{profile.emoji}</div>
            <p className="profile-greeting">{name ? `${name}, ты —` : 'Ты —'}</p>
            <h2 className="profile-type">{profile.type}</h2>
            <p className="profile-desc">{profile.desc}</p>
            <div className="profile-traits">
              <div className="trait">🎯 Персональный план под тебя</div>
              <div className="trait">⚡ Микро-действия по 5 минут</div>
              <div className="trait">🤖 AI-коуч каждый день</div>
            </div>
            <button className="btn-start" onClick={() => setScreen('problem')}>
              Выбрать свою задачу
            </button>
          </div>
        </div>
      )}

      {screen === 'problem' && (
        <div className="screen-problem">
          <h2 className="problem-title">Что хочешь изменить?</h2>
          <p className="problem-sub">Выбери одно. Только одно.</p>
          <div className="problems">
            {[
              { emoji: '⚡', label: 'Вернуть энергию' },
              { emoji: '⏰', label: 'Перестать откладывать' },
              { emoji: '🍬', label: 'Меньше сладкого' },
              { emoji: '📱', label: 'Меньше в телефоне' },
              { emoji: '😴', label: 'Улучшить сон' },
            ].map((p, i) => (
              <button key={i} className="problem-btn" onClick={() => { setSelectedProblem(p.label); setScreen('plan') }}>
                <span className="problem-emoji">{p.emoji}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'plan' && (
        <div className="screen-plan">
          <div className="plan-content">
            <div className="plan-icon">🗓</div>
            <h2>Твой план готов</h2>
            <p>7 дней. Маленькие шаги. Каждый день.</p>
            <p className="plan-problem">Задача: {selectedProblem}</p>
            <button className="btn-start" onClick={() => setScreen('home')}>
              Начинаем →
            </button>
          </div>
        </div>
      )}

      {screen === 'home' && (
        <div className="screen-home">
          <div className="home-header">
            <p className="home-greeting">Привет, {name || 'друг'} 👋</p>
            <p className="home-day">День 1 из 7</p>
          </div>
          <div className="action-card">
            <div className="action-cue">☀️ Утро · 2 мин</div>
            <p className="action-text">Выпей стакан воды до того как открыть телефон</p>
            <p className="action-why">Гидратация с утра запускает метаболизм и даёт мозгу сигнал к активности</p>
            <button className="btn-done" onClick={() => alert('Отлично! 🌱 День засчитан')}>
              ✓ Сделал
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App