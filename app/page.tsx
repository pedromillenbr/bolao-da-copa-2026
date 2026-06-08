'use client';

import { useState, useCallback } from 'react';
import { AppStep, MatchResult } from '@/lib/types';
import { saveBolao } from '@/lib/supabase';
import LandingPage from '@/components/LandingPage';
import GroupStage from '@/components/GroupStage';
import KnockoutStage from '@/components/KnockoutStage';
import Summary from '@/components/Summary';

export default function Home() {
  const [step, setStep] = useState<AppStep>('landing');
  const [name, setName] = useState('');
  const [groupResults, setGroupResults] = useState<Record<string, MatchResult>>({});
  const [knockoutResults, setKnockoutResults] = useState<Record<string, MatchResult>>({});

  const handleStart = (playerName: string) => {
    setName(playerName);
    setStep('groups');
    window.scrollTo(0, 0);
  };

  const handleGroupUpdate = useCallback((matchId: string, result: MatchResult) => {
    setGroupResults(prev => ({ ...prev, [matchId]: result }));
  }, []);

  const handleKnockoutUpdate = useCallback((matchId: string, result: MatchResult) => {
    setKnockoutResults(prev => ({ ...prev, [matchId]: result }));
  }, []);

  const handleGroupsComplete = () => {
    setStep('knockout');
    window.scrollTo(0, 0);
  };

  const handleKnockoutComplete = () => {
    setStep('summary');
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    await saveBolao(name, groupResults, knockoutResults);
  };

  const handleBackToGroups = () => {
    setStep('groups');
    window.scrollTo(0, 0);
  };

  const handleBackToKnockout = () => {
    setStep('knockout');
    window.scrollTo(0, 0);
  };

  // Step header
  const renderHeader = () => {
    if (step === 'landing') return null;

    const steps = [
      { key: 'groups', label: 'Grupos', icon: '📋' },
      { key: 'knockout', label: 'Mata-Mata', icon: '⚔️' },
      { key: 'summary', label: 'Resumo', icon: '🏆' },
    ];

    return (
      <div className="sticky top-0 z-50 py-3 px-4" style={{ background: 'rgba(10,31,13,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--color-card-border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚽</span>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
              BOLÃO 2026
            </span>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--color-card-bg)', color: '#a0b0a0' }}>
              {name}
            </span>
          </div>
          <div className="flex gap-1">
            {steps.map((s, i) => (
              <div
                key={s.key}
                className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                style={{
                  background: step === s.key ? 'var(--color-green-800)' : 'transparent',
                  color: step === s.key ? 'var(--color-gold-400)' : '#506050',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: step === s.key ? 700 : 400,
                }}
              >
                {s.icon} <span className="hidden sm:inline">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderHeader()}
      {step === 'landing' && <LandingPage onStart={handleStart} />}
      {step === 'groups' && (
        <GroupStage
          results={groupResults}
          onUpdate={handleGroupUpdate}
          onComplete={handleGroupsComplete}
        />
      )}
      {step === 'knockout' && (
        <KnockoutStage
          groupResults={groupResults}
          knockoutResults={knockoutResults}
          onUpdate={handleKnockoutUpdate}
          onComplete={handleKnockoutComplete}
          onBack={handleBackToGroups}
        />
      )}
      {step === 'summary' && (
        <Summary
          name={name}
          groupResults={groupResults}
          knockoutResults={knockoutResults}
          onSave={handleSave}
          onBack={handleBackToKnockout}
        />
      )}
    </>
  );
}
