'use client';

import { useState } from 'react';

interface LandingPageProps {
  onStart: (name: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim().length >= 2) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg w-full animate-fade-in">
        {/* Trophy Icon */}
        <div className="text-7xl mb-4">🏆</div>

        {/* Title */}
        <h1
          className="text-5xl md:text-6xl font-bold mb-2 trophy-shimmer"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          BOLÃO
        </h1>
        <h2
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}
        >
          COPA DO MUNDO
        </h2>
        <div
          className="inline-block px-4 py-1 rounded-full mb-6 text-sm font-bold"
          style={{
            fontFamily: 'var(--font-heading)',
            background: 'var(--color-green-800)',
            color: 'var(--color-gold-400)',
            border: '1px solid var(--color-green-700)',
            letterSpacing: '0.15em',
          }}
        >
          EUA • MÉXICO • CANADÁ 2026
        </div>

        {/* Flags */}
        <div className="flex justify-center gap-3 text-3xl mb-8">
          🇺🇸 🇲🇽 🇨🇦
        </div>

        {/* Description */}
        <p className="text-base mb-8" style={{ color: '#a0b8a0' }}>
          Faça seus palpites para todos os <strong style={{ color: 'var(--color-gold-400)' }}>104 jogos</strong> da Copa.
          <br />
          Dos grupos à final — você decide tudo!
        </p>

        {/* Name Input */}
        <div className="mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="Seu nome"
            maxLength={30}
            className="w-full max-w-sm px-5 py-4 rounded-xl text-lg font-medium text-center"
            style={{
              background: 'var(--color-card-bg)',
              border: '2px solid var(--color-green-700)',
              color: '#e8f0e8',
              fontFamily: 'var(--font-body)',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold-500)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-green-700)'}
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={name.trim().length < 2}
          className="btn-gold text-lg px-10 py-4"
        >
          ⚽ COMEÇAR BOLÃO
        </button>

        {/* Info */}
        <div className="mt-10 flex justify-center gap-6 text-xs" style={{ color: '#607060' }}>
          <span>🏟️ 48 Seleções</span>
          <span>📋 12 Grupos</span>
          <span>🏆 104 Jogos</span>
        </div>
      </div>
    </div>
  );
}
