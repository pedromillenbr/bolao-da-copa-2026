'use client';

import { useState, useMemo } from 'react';
import {
  getAllGroupStandings,
  resolveRound32,
  getTeamFlag,
  getTeamName,
} from '@/lib/logic';
import { MatchResult, KnockoutPhase } from '@/lib/types';
import MatchInput from './MatchInput';

interface KnockoutStageProps {
  groupResults: Record<string, MatchResult>;
  knockoutResults: Record<string, MatchResult>;
  onUpdate: (matchId: string, result: MatchResult) => void;
  onComplete: () => void;
  onBack: () => void;
}

const phaseNames: Record<KnockoutPhase, string> = {
  round32: 'Rodada de 32',
  round16: 'Oitavas de Final',
  quarters: 'Quartas de Final',
  semis: 'Semifinais',
  third: 'Disputa de 3º Lugar',
  final: 'FINAL',
};

const phaseOrder: KnockoutPhase[] = ['round32', 'round16', 'quarters', 'semis', 'third', 'final'];

export default function KnockoutStage({
  groupResults,
  knockoutResults,
  onUpdate,
  onComplete,
  onBack,
}: KnockoutStageProps) {
  const [activePhase, setActivePhase] = useState<KnockoutPhase>('round32');

  const allStandings = useMemo(() => getAllGroupStandings(groupResults), [groupResults]);

  // Resolve teams for Round of 32 — shared single source of truth (see logic.ts).
  const resolveR32Teams = useMemo(() => resolveRound32(allStandings), [allStandings]);

  // Get winner of a knockout match
  const getWinner = (matchId: string, homeTeam: string | null, awayTeam: string | null): string | null => {
    const result = knockoutResults[matchId];
    if (!result || result.homeGoals === null || result.awayGoals === null) return null;
    if (!homeTeam || !awayTeam) return null;

    if (result.homeGoals > result.awayGoals) return homeTeam;
    if (result.awayGoals > result.homeGoals) return awayTeam;
    // Draw - need penalty winner
    if (result.penaltyWinner) return result.penaltyWinner;
    return null;
  };

  const getLoser = (matchId: string, homeTeam: string | null, awayTeam: string | null): string | null => {
    const winner = getWinner(matchId, homeTeam, awayTeam);
    if (!winner || !homeTeam || !awayTeam) return null;
    return winner === homeTeam ? awayTeam : homeTeam;
  };

  // Build all bracket data
  const bracket = useMemo(() => {
    // R32 teams already resolved
    const r32 = resolveR32Teams;

    // R16 - winners of R32
    const r16: { id: string; home: string | null; away: string | null }[] = [
      { id: 'R16_1', home: getWinner('R32_1', r32[0].home, r32[0].away), away: getWinner('R32_2', r32[1].home, r32[1].away) },
      { id: 'R16_2', home: getWinner('R32_3', r32[2].home, r32[2].away), away: getWinner('R32_4', r32[3].home, r32[3].away) },
      { id: 'R16_3', home: getWinner('R32_5', r32[4].home, r32[4].away), away: getWinner('R32_6', r32[5].home, r32[5].away) },
      { id: 'R16_4', home: getWinner('R32_7', r32[6].home, r32[6].away), away: getWinner('R32_8', r32[7].home, r32[7].away) },
      { id: 'R16_5', home: getWinner('R32_9', r32[8].home, r32[8].away), away: getWinner('R32_10', r32[9].home, r32[9].away) },
      { id: 'R16_6', home: getWinner('R32_11', r32[10].home, r32[10].away), away: getWinner('R32_12', r32[11].home, r32[11].away) },
      { id: 'R16_7', home: getWinner('R32_13', r32[12].home, r32[12].away), away: getWinner('R32_14', r32[13].home, r32[13].away) },
      { id: 'R16_8', home: getWinner('R32_15', r32[14].home, r32[14].away), away: getWinner('R32_16', r32[15].home, r32[15].away) },
    ];

    // QF
    const qf: { id: string; home: string | null; away: string | null }[] = [
      { id: 'QF_1', home: getWinner('R16_1', r16[0].home, r16[0].away), away: getWinner('R16_2', r16[1].home, r16[1].away) },
      { id: 'QF_2', home: getWinner('R16_3', r16[2].home, r16[2].away), away: getWinner('R16_4', r16[3].home, r16[3].away) },
      { id: 'QF_3', home: getWinner('R16_5', r16[4].home, r16[4].away), away: getWinner('R16_6', r16[5].home, r16[5].away) },
      { id: 'QF_4', home: getWinner('R16_7', r16[6].home, r16[6].away), away: getWinner('R16_8', r16[7].home, r16[7].away) },
    ];

    // SF
    const sf: { id: string; home: string | null; away: string | null }[] = [
      { id: 'SF_1', home: getWinner('QF_1', qf[0].home, qf[0].away), away: getWinner('QF_2', qf[1].home, qf[1].away) },
      { id: 'SF_2', home: getWinner('QF_3', qf[2].home, qf[2].away), away: getWinner('QF_4', qf[3].home, qf[3].away) },
    ];

    // 3rd place & Final
    const third: { id: string; home: string | null; away: string | null }[] = [
      { id: 'TP', home: getLoser('SF_1', sf[0].home, sf[0].away), away: getLoser('SF_2', sf[1].home, sf[1].away) },
    ];

    const final_: { id: string; home: string | null; away: string | null }[] = [
      { id: 'FINAL', home: getWinner('SF_1', sf[0].home, sf[0].away), away: getWinner('SF_2', sf[1].home, sf[1].away) },
    ];

    return { r32, r16, qf, sf, third, final: final_ };
  }, [resolveR32Teams, knockoutResults]);

  const getPhaseMatches = (phase: KnockoutPhase) => {
    switch (phase) {
      case 'round32': return bracket.r32;
      case 'round16': return bracket.r16;
      case 'quarters': return bracket.qf;
      case 'semis': return bracket.sf;
      case 'third': return bracket.third;
      case 'final': return bracket.final;
    }
  };

  const isPhaseComplete = (phase: KnockoutPhase): boolean => {
    const matches = getPhaseMatches(phase);
    return matches.every(m => {
      if (!m.home || !m.away) return false;
      const result = knockoutResults[m.id];
      if (!result || result.homeGoals === null || result.awayGoals === null) return false;
      if (result.homeGoals === result.awayGoals && !result.penaltyWinner) return false;
      return true;
    });
  };

  const isPhaseReady = (phase: KnockoutPhase): boolean => {
    const matches = getPhaseMatches(phase);
    return matches.every(m => m.home !== null && m.away !== null);
  };

  const currentMatches = getPhaseMatches(activePhase);
  const phaseComplete = isPhaseComplete(activePhase);

  // Count filled knockout matches
  const totalKnockout = 32; // 16+8+4+2+1+1
  const filledKnockout = Object.values(knockoutResults).filter(
    r => r.homeGoals !== null && r.awayGoals !== null && (r.homeGoals !== r.awayGoals || r.penaltyWinner)
  ).length;

  const allKnockoutComplete = phaseOrder.every(p => isPhaseComplete(p));

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 animate-fade-in">
        <span className="phase-badge">Mata-Mata</span>
        <h2 className="text-2xl font-bold mt-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {phaseNames[activePhase]}
        </h2>
        <p className="text-sm mt-1" style={{ color: '#708070' }}>
          {filledKnockout}/{totalKnockout} jogos preenchidos
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden mx-auto max-w-xs" style={{ background: 'var(--color-card-bg)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(filledKnockout / totalKnockout) * 100}%`,
              background: 'linear-gradient(90deg, var(--color-gold-500), var(--color-gold-300))',
            }}
          />
        </div>
      </div>

      {/* Phase Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {phaseOrder.map((phase) => {
          const complete = isPhaseComplete(phase);
          const ready = isPhaseReady(phase);
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              disabled={!ready}
              className={`group-tab ${activePhase === phase ? 'active' : ''} ${complete && activePhase !== phase ? 'complete' : ''}`}
              style={{ opacity: ready ? 1 : 0.4 }}
            >
              {complete && activePhase !== phase ? '✓ ' : ''}
              {phaseNames[phase]}
            </button>
          );
        })}
      </div>

      {/* Matches */}
      <div className="space-y-3 mb-8">
        {currentMatches.map((match, i) => {
          if (!match.home || !match.away) {
            return (
              <div key={match.id} className="match-card opacity-50 text-center">
                <p className="text-sm" style={{ color: '#506050' }}>
                  Jogo {i + 1} — Aguardando fase anterior
                </p>
              </div>
            );
          }

          return (
            <MatchInput
              key={match.id}
              matchId={match.id}
              homeTeamId={match.home}
              awayTeamId={match.away}
              date={activePhase === 'final' ? '19/07 — Final' : activePhase === 'third' ? '18/07 — 3º Lugar' : ''}
              result={knockoutResults[match.id]}
              onUpdate={onUpdate}
              isKnockout={true}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <button
          onClick={() => {
            const idx = phaseOrder.indexOf(activePhase);
            if (idx > 0) {
              setActivePhase(phaseOrder[idx - 1]);
            } else {
              onBack();
            }
          }}
          className="btn-green text-sm px-6 py-3"
        >
          ← {activePhase === 'round32' ? 'Grupos' : phaseNames[phaseOrder[phaseOrder.indexOf(activePhase) - 1]]}
        </button>

        {phaseComplete && activePhase !== 'final' && (
          <button
            onClick={() => {
              const idx = phaseOrder.indexOf(activePhase);
              if (idx < phaseOrder.length - 1) setActivePhase(phaseOrder[idx + 1]);
            }}
            className="btn-gold text-sm px-6 py-3"
          >
            {phaseNames[phaseOrder[phaseOrder.indexOf(activePhase) + 1]]} →
          </button>
        )}
      </div>

      {/* Complete */}
      {allKnockoutComplete && (
        <div className="text-center py-6 animate-fade-in">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-lg mb-1 font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
            CAMPEÃO: {getTeamFlag(getWinner('FINAL', bracket.final[0].home, bracket.final[0].away) || '')} {getTeamName(getWinner('FINAL', bracket.final[0].home, bracket.final[0].away) || '')}
          </p>
          <p className="text-sm mb-6" style={{ color: '#708070' }}>
            Todos os palpites preenchidos!
          </p>
          <button onClick={onComplete} className="btn-gold text-lg px-10 py-4">
            📸 VER RESUMO E SALVAR
          </button>
        </div>
      )}
    </div>
  );
}
