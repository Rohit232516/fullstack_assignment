import React, { useState, useEffect } from 'react';
import './App.css';

const EMOJIS = [
  { emoji: '😀', label: 'Happy' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😴', label: 'Tired' },
];

const STORAGE_KEY = 'vibeOfTheDay';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // On mount, restore mood from localStorage if stored date matches today
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { mood, date } = JSON.parse(stored);
        if (date === getToday()) {
          setSelectedMood(mood);
          setSelectedDate(date);
        } else {
          // Stored date doesn't match today — ignore
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleSelect = (emoji) => {
    const today = getToday();
    const data = { mood: emoji, date: today };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSelectedMood(emoji);
    setSelectedDate(today);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedMood(null);
    setSelectedDate(null);
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">
          <span className="title-emoji">✨</span> Vibe Check
        </h1>
        <p className="subtitle">How are you feeling today?</p>

        <div className="emoji-grid">
          {EMOJIS.map(({ emoji, label }) => (
            <button
              key={emoji}
              className={`emoji-btn${selectedMood === emoji ? ' selected' : ''}`}
              onClick={() => handleSelect(emoji)}
              aria-label={label}
            >
              <span className="emoji">{emoji}</span>
              <span className="emoji-label">{label}</span>
            </button>
          ))}
        </div>

        <div className="message-area">
          {selectedMood ? (
            <p className="message selected-message">
              Your vibe today is {selectedMood}{' '}
              <span className="date-tag">(selected on {selectedDate})</span>
            </p>
          ) : (
            <p className="message empty-message">No vibe selected yet for today.</p>
          )}
        </div>

        <button
          className="reset-btn"
          onClick={handleReset}
          disabled={!selectedMood}
        >
          Reset Vibe
        </button>
      </div>
    </div>
  );
}

export default App;
