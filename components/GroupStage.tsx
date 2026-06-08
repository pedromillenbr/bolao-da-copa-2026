'use client';

import { useState } from 'react';
import { groups, getMatchesByGroup, teams } from '@/lib/data';
import { calculateGroupStandings, isGroupComplete, areAllGroupsComplete } from '@/lib/logic';
import { MatchResult } from '@/lib/types';
import MatchInput from './MatchInput';

interface GroupStageProps {
  results: Record<string, MatchResult>;
  onUpdate: (matchId: string, result: MatchResult) => void;
  onComplete: () => void;
}

export default function GroupStage({ results, onUpdate, onComplete }: GroupStageProps) {
  const [activeGroup, setActiveGroup] = useState('A');
  const allComplete = areAllGroupsComplete(results);
  const matches = getMatchesByGroup(activeGroup);
  const standings = calculateGroupStandings(activeGroup, results);

  const completedGroups = groups.filter(g => isGroupComplete(g, results));
  const filledCount = Object.values(results).filter(
    r => r.homeGoals !== null && r.awayGoals !== null
  ).length;

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6 animate-fade-in">
        <span className="phase-badge">Fase de Grupos</span>
        <h2 className="text-2xl font-bold mt-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Preencha os placares
        </h2>
        <p className="text-sm mt-1" style={{ color: '#708070' }}>
          {filledCount}/72 jogos preenchidos • {completedGroups.length}/12 grupos completos
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full overflow-hidden mx-auto max-w-xs" style={{ background: 'var(--color-card-bg)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(filledCount / 72) * 100}%`,
              background: allComplete
                ? 'var(--color-gold-400)'
                : 'linear-gradient(90deg, var(--color-green-600), var(--color-green-400))',
            }}
          />
        </div>
      </div>

      {/* Group Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {groups.map((g) => {
          const complete = isGroupComplete(g, results);
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`group-tab ${activeGroup === g ? 'active' : ''} ${complete && activeGroup !== g ? 'complete' : ''}`}
            >
              {complete && activeGroup !== g ? '✓ ' : ''}Grupo {g}
            </button>
          );
        })}
      </div>

      {/* Standings Table */}
      <div className="mb-6 overflow-x-auto rounded-xl" style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-card-border)' }}>
          <h3 className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
            CLASSIFICAÇÃO — GRUPO {activeGroup}
          </h3>
        </div>
        <table className="standings-table w-full text-sm">
          <thead>
            <tr>
              <th className="text-left pl-4" style={{ width: '40%' }}>Seleção</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GP</th>
              <th>GC</th>
              <th>SG</th>
              <th className="pr-4" style={{ color: 'var(--color-gold-400)' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const team = teams[s.teamId];
              const qualClass = i < 2 ? 'qualified' : i === 2 ? 'third-qualified' : '';
              return (
                <tr key={s.teamId} className={qualClass}>
                  <td className="text-left pl-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-xs font-bold" style={{
                        color: i < 2 ? 'var(--color-green-400)' : i === 2 ? 'var(--color-gold-400)' : '#506050',
                        width: '16px',
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {i + 1}º
                      </span>
                      <span>{team?.flag}</span>
                      <span className="font-medium">{team?.name}</span>
                    </span>
                  </td>
                  <td>{s.played}</td>
                  <td>{s.won}</td>
                  <td>{s.drawn}</td>
                  <td>{s.lost}</td>
                  <td>{s.goalsFor}</td>
                  <td>{s.goalsAgainst}</td>
                  <td style={{ color: s.goalDifference > 0 ? 'var(--color-green-400)' : s.goalDifference < 0 ? '#e05050' : '' }}>
                    {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}
                  </td>
                  <td className="pr-4 font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
                    {s.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-4 py-2 flex gap-4 text-xs" style={{ color: '#506050', borderTop: '1px solid var(--color-card-border)' }}>
          <span><span style={{ color: 'var(--color-green-400)' }}>■</span> Classificado</span>
          <span><span style={{ color: 'var(--color-gold-400)' }}>■</span> Disputa melhor 3º</span>
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-3 mb-8">
        {matches.map((match) => (
          <MatchInput
            key={match.id}
            matchId={match.id}
            homeTeamId={match.homeTeam}
            awayTeamId={match.awayTeam}
            date={match.date}
            result={results[match.id]}
            onUpdate={onUpdate}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-4 mb-8">
        <button
          onClick={() => {
            const idx = groups.indexOf(activeGroup);
            if (idx > 0) setActiveGroup(groups[idx - 1]);
          }}
          disabled={activeGroup === 'A'}
          className="btn-green text-sm px-6 py-3 disabled:opacity-30"
        >
          ← Grupo {groups[groups.indexOf(activeGroup) - 1] || ''}
        </button>

        {activeGroup !== 'L' ? (
          <button
            onClick={() => {
              const idx = groups.indexOf(activeGroup);
              if (idx < groups.length - 1) setActiveGroup(groups[idx + 1]);
            }}
            className="btn-green text-sm px-6 py-3"
          >
            Grupo {groups[groups.indexOf(activeGroup) + 1]} →
          </button>
        ) : null}
      </div>

      {/* Complete Button */}
      {allComplete && (
        <div className="text-center py-6 animate-fade-in">
          <p className="text-sm mb-4" style={{ color: 'var(--color-gold-400)' }}>
            ✅ Todos os grupos preenchidos!
          </p>
          <button onClick={onComplete} className="btn-gold text-lg px-10 py-4">
            🏆 IR PARA O MATA-MATA
          </button>
        </div>
      )}
    </div>
  );
}
