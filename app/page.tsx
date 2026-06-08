'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppStep, MatchResult } from '@/lib/types';
import { upsertBolao, isSupabaseConfigured } from '@/lib/supabase';
import { usePersistentState, clearPersistedBolao, getOrCreateBolaoId } from '@/lib/usePersistentState';
import LandingPage from '@/components/LandingPage';
import GroupStage from '@/components/GroupStage';
import KnockoutStage from '@/components/KnockoutStage';
import Summary from '@/components/Summary';

const STORAGE_KEYS = {
  step: 'bolao2026:step',
  name: 'bolao2026:name',
  groups: 'bolao2026:groupResults',
  knockout: 'bolao2026:knockoutResults',
  id: 'bolao2026:id',
};

type CloudStatus = 'idle' | 'saving' | 'saved' | 'error' | 'off';

export default function Home() {
  // Persisted to localStorage so progress survives reloads, closing the tab,
  // and new deploys. `hydrated` tells us the saved state has been read.
  const [step, setStep, hydrated] = usePersistentState<AppStep>(STORAGE_KEYS.step, 'landing');
  const [name, setName] = usePersistentState<string>(STORAGE_KEYS.name, '');
  const [groupResults, setGroupResults] = usePersistentState<Record<string, MatchResult>>(STORAGE_KEYS.groups, {});
  const [knockoutResults, setKnockoutResults] = usePersistentState<Record<string, MatchResult>>(STORAGE_KEYS.knockout, {});

  // Cloud (Supabase) auto-save status shown in the header.
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>('idle');
  const bolaoIdRef = useRef<string>('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced auto-save to Supabase. Fires ~1.2s after the last change so we
  // don't hit the DB on every keystroke. localStorage already saved instantly;
  // this adds durable cloud backup keyed by a stable per-browser id.
  useEffect(() => {
    if (!hydrated) return;
    if (!isSupabaseConfigured()) { setCloudStatus('off'); return; }
    // Nothing meaningful to save yet (no name and no palpites).
    if (!name && Object.keys(groupResults).length === 0 && Object.keys(knockoutResults).length === 0) return;

    if (!bolaoIdRef.current) bolaoIdRef.current = getOrCreateBolaoId(STORAGE_KEYS.id);
    if (saveTimer.current) clearTimeout(saveTimer.current);

    setCloudStatus('saving');
    saveTimer.current = setTimeout(async () => {
      const res = await upsertBolao(bolaoIdRef.current, name, groupResults, knockoutResults);
      setCloudStatus(res.ok ? 'saved' : res.reason === 'not-configured' ? 'off' : 'error');
    }, 1200);

    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [name, groupResults, knockoutResults, hydrated]);

  const handleStart = (playerName: string) => {
    setName(playerName);
    setStep('groups');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    if (!window.confirm('Tem certeza? Isso vai apagar todos os seus palpites e começar do zero.')) return;
    clearPersistedBolao(Object.values(STORAGE_KEYS));
    bolaoIdRef.current = '';           // próximo save cria um registro novo
    setCloudStatus('idle');
    setName('');
    setGroupResults({});
    setKnockoutResults({});
    setStep('landing');
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
    if (!bolaoIdRef.current) bolaoIdRef.current = getOrCreateBolaoId(STORAGE_KEYS.id);
    await upsertBolao(bolaoIdRef.current, name, groupResults, knockoutResults);
  };

  const handleBackToGroups = () => {
    setStep('groups');
    window.scrollTo(0, 0);
  };

  const handleBackToKnockout = () => {
    setStep('knockout');
    window.scrollTo(0, 0);
  };

  // Cloud-save status pill content (auto-save to Supabase).
  const cloud = {
    idle: null,
    off: null, // sem credenciais: não polui a UI; localStorage cobre o usuário
    saving: { text: 'Salvando…', color: '#a0b0a0' },
    saved: { text: '☁ Salvo', color: 'var(--color-green-400)' },
    error: { text: '⚠ Erro ao salvar', color: '#e0a050' },
  }[cloudStatus];

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
            {cloud && (
              <span className="text-xs px-2 py-0.5 rounded hidden sm:inline" style={{ color: cloud.color }}>
                {cloud.text}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((s) => (
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
            <button
              onClick={handleRestart}
              title="Começar de novo (apaga tudo)"
              className="text-xs px-2 py-1 rounded"
              style={{ background: 'var(--color-card-bg)', color: '#a08070', border: '1px solid var(--color-card-border)' }}
            >
              ↺ <span className="hidden sm:inline">Recomeçar</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Avoid flashing the landing page before saved progress is restored.
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-pulse">⚽</div>
      </div>
    );
  }

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
