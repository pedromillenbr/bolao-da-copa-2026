'use client';

import { teams } from '@/lib/data';
import { MatchResult } from '@/lib/types';

interface MatchInputProps {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  result: MatchResult | undefined;
  onUpdate: (matchId: string, result: MatchResult) => void;
  isKnockout?: boolean;
  penaltyWinner?: string;
}

export default function MatchInput({
  matchId,
  homeTeamId,
  awayTeamId,
  date,
  result,
  onUpdate,
  isKnockout = false,
}: MatchInputProps) {
  const homeTeam = teams[homeTeamId];
  const awayTeam = teams[awayTeamId];

  if (!homeTeam || !awayTeam) return null;

  const homeGoals = result?.homeGoals ?? null;
  const awayGoals = result?.awayGoals ?? null;
  const isDraw = homeGoals !== null && awayGoals !== null && homeGoals === awayGoals;
  const isFilled = homeGoals !== null && awayGoals !== null;

  const handleGoalChange = (side: 'home' | 'away', value: string) => {
    const goals = value === '' ? null : Math.max(0, Math.min(20, parseInt(value) || 0));
    const newResult: MatchResult = {
      matchId,
      homeGoals: side === 'home' ? goals : (result?.homeGoals ?? null),
      awayGoals: side === 'away' ? goals : (result?.awayGoals ?? null),
      penaltyWinner: result?.penaltyWinner,
    };
    // Clear penalty winner if no longer a draw
    if (newResult.homeGoals !== null && newResult.awayGoals !== null && newResult.homeGoals !== newResult.awayGoals) {
      newResult.penaltyWinner = undefined;
    }
    onUpdate(matchId, newResult);
  };

  const handlePenaltyWinner = (teamId: string) => {
    onUpdate(matchId, {
      matchId,
      homeGoals: result?.homeGoals ?? null,
      awayGoals: result?.awayGoals ?? null,
      penaltyWinner: teamId,
    });
  };

  return (
    <div className={`match-card ${isFilled ? 'filled' : ''}`}>
      {/* Date badge */}
      <div className="text-center mb-3">
        <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: '#708070', background: 'var(--color-pitch)' }}>
          {date}
        </span>
      </div>

      {/* Match row */}
      <div className="flex items-center justify-center gap-3">
        {/* Home Team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm font-semibold truncate text-right" style={{ fontFamily: 'var(--font-heading)', minWidth: '60px' }}>
            {homeTeam.name}
          </span>
          <span className="text-xl">{homeTeam.flag}</span>
        </div>

        {/* Score Inputs */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            max="20"
            value={homeGoals ?? ''}
            onChange={(e) => handleGoalChange('home', e.target.value)}
            className="score-input"
            placeholder="-"
          />
          <span className="text-lg font-bold" style={{ color: '#506050', fontFamily: 'var(--font-heading)' }}>×</span>
          <input
            type="number"
            min="0"
            max="20"
            value={awayGoals ?? ''}
            onChange={(e) => handleGoalChange('away', e.target.value)}
            className="score-input"
            placeholder="-"
          />
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xl">{awayTeam.flag}</span>
          <span className="text-sm font-semibold truncate" style={{ fontFamily: 'var(--font-heading)', minWidth: '60px' }}>
            {awayTeam.name}
          </span>
        </div>
      </div>

      {/* Penalty Winner (knockout draws) */}
      {isKnockout && isDraw && (
        <div className="mt-3 text-center">
          <p className="text-xs mb-2" style={{ color: '#708070' }}>Quem avança nos pênaltis?</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handlePenaltyWinner(homeTeamId)}
              className={`penalty-btn ${result?.penaltyWinner === homeTeamId ? 'selected' : ''}`}
            >
              {homeTeam.flag} {homeTeam.name}
            </button>
            <button
              onClick={() => handlePenaltyWinner(awayTeamId)}
              className={`penalty-btn ${result?.penaltyWinner === awayTeamId ? 'selected' : ''}`}
            >
              {awayTeam.flag} {awayTeam.name}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
