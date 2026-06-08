'use client';

import { useRef, useState, useMemo } from 'react';
import { groups, getMatchesByGroup } from '@/lib/data';
import { getAllGroupStandings, resolveRound32, getTeamFlag, getTeamName } from '@/lib/logic';
import { MatchResult } from '@/lib/types';

interface SummaryProps {
  name: string;
  groupResults: Record<string, MatchResult>;
  knockoutResults: Record<string, MatchResult>;
  onSave: () => void;
  onBack: () => void;
}

export default function Summary({ name, groupResults, knockoutResults, onSave, onBack }: SummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const allStandings = useMemo(() => getAllGroupStandings(groupResults), [groupResults]);

  // Resolve bracket
  const resolveBracket = useMemo(() => {
    const getWinner = (matchId: string, home: string | null, away: string | null): string | null => {
      const result = knockoutResults[matchId];
      if (!result || result.homeGoals === null || result.awayGoals === null || !home || !away) return null;
      if (result.homeGoals > result.awayGoals) return home;
      if (result.awayGoals > result.homeGoals) return away;
      return result.penaltyWinner || null;
    };

    const getLoser = (matchId: string, home: string | null, away: string | null): string | null => {
      const winner = getWinner(matchId, home, away);
      if (!winner || !home || !away) return null;
      return winner === home ? away : home;
    };

    const r32 = resolveRound32(allStandings);

    const r16 = [
      { id: 'R16_1', home: getWinner('R32_1', r32[0].home, r32[0].away), away: getWinner('R32_2', r32[1].home, r32[1].away) },
      { id: 'R16_2', home: getWinner('R32_3', r32[2].home, r32[2].away), away: getWinner('R32_4', r32[3].home, r32[3].away) },
      { id: 'R16_3', home: getWinner('R32_5', r32[4].home, r32[4].away), away: getWinner('R32_6', r32[5].home, r32[5].away) },
      { id: 'R16_4', home: getWinner('R32_7', r32[6].home, r32[6].away), away: getWinner('R32_8', r32[7].home, r32[7].away) },
      { id: 'R16_5', home: getWinner('R32_9', r32[8].home, r32[8].away), away: getWinner('R32_10', r32[9].home, r32[9].away) },
      { id: 'R16_6', home: getWinner('R32_11', r32[10].home, r32[10].away), away: getWinner('R32_12', r32[11].home, r32[11].away) },
      { id: 'R16_7', home: getWinner('R32_13', r32[12].home, r32[12].away), away: getWinner('R32_14', r32[13].home, r32[13].away) },
      { id: 'R16_8', home: getWinner('R32_15', r32[14].home, r32[14].away), away: getWinner('R32_16', r32[15].home, r32[15].away) },
    ];

    const qf = [
      { id: 'QF_1', home: getWinner('R16_1', r16[0].home, r16[0].away), away: getWinner('R16_2', r16[1].home, r16[1].away) },
      { id: 'QF_2', home: getWinner('R16_3', r16[2].home, r16[2].away), away: getWinner('R16_4', r16[3].home, r16[3].away) },
      { id: 'QF_3', home: getWinner('R16_5', r16[4].home, r16[4].away), away: getWinner('R16_6', r16[5].home, r16[5].away) },
      { id: 'QF_4', home: getWinner('R16_7', r16[6].home, r16[6].away), away: getWinner('R16_8', r16[7].home, r16[7].away) },
    ];

    const sf = [
      { id: 'SF_1', home: getWinner('QF_1', qf[0].home, qf[0].away), away: getWinner('QF_2', qf[1].home, qf[1].away) },
      { id: 'SF_2', home: getWinner('QF_3', qf[2].home, qf[2].away), away: getWinner('QF_4', qf[3].home, qf[3].away) },
    ];

    const champion = getWinner('FINAL',
      getWinner('SF_1', sf[0].home, sf[0].away),
      getWinner('SF_2', sf[1].home, sf[1].away)
    );
    const runnerUp = getLoser('FINAL',
      getWinner('SF_1', sf[0].home, sf[0].away),
      getWinner('SF_2', sf[1].home, sf[1].away)
    );
    const thirdPlace = getWinner('TP',
      getLoser('SF_1', sf[0].home, sf[0].away),
      getLoser('SF_2', sf[1].home, sf[1].away)
    );

    return { r32, r16, qf, sf, champion, runnerUp, thirdPlace };
  }, [allStandings, knockoutResults]);

  const handleDownloadImage = async () => {
    if (!summaryRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(summaryRef.current, {
        backgroundColor: '#0a1f0d',
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `bolao-${name.toLowerCase().replace(/\s+/g, '-')}-copa2026.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const renderMiniMatch = (matchId: string, home: string | null, away: string | null, results: Record<string, MatchResult>) => {
    if (!home || !away) return null;
    const r = results[matchId];
    if (!r || r.homeGoals === null || r.awayGoals === null) return null;
    const isPenalty = r.homeGoals === r.awayGoals && r.penaltyWinner;

    return (
      <div key={matchId} className="flex items-center gap-1 text-xs py-1">
        <span className="w-5 text-center">{getTeamFlag(home)}</span>
        <span className="font-medium truncate" style={{ width: '70px', fontFamily: 'var(--font-heading)', fontSize: '0.7rem' }}>
          {getTeamName(home)}
        </span>
        <span className="font-bold px-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)', minWidth: '32px', textAlign: 'center' }}>
          {r.homeGoals} × {r.awayGoals}
        </span>
        <span className="font-medium truncate" style={{ width: '70px', fontFamily: 'var(--font-heading)', fontSize: '0.7rem' }}>
          {getTeamName(away)}
        </span>
        <span className="w-5 text-center">{getTeamFlag(away)}</span>
        {isPenalty && <span className="text-[0.6rem] ml-1" style={{ color: 'var(--color-gold-500)' }}>(pen)</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="text-center mb-6 animate-fade-in">
        <span className="phase-badge">Resumo do Bolão</span>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button onClick={handleDownloadImage} className="btn-gold text-sm px-6 py-3">
            📸 Baixar como Imagem
          </button>
          <button onClick={handleSave} disabled={saving || saved} className="btn-green text-sm px-6 py-3">
            {saved ? '✅ Salvo!' : saving ? '⏳ Salvando...' : '💾 Salvar no Banco'}
          </button>
          <button onClick={onBack} className="btn-green text-sm px-6 py-3">
            ← Voltar
          </button>
        </div>
      </div>

      {/* Exportable Summary */}
      <div ref={summaryRef} id="bolao-summary" className="rounded-xl overflow-hidden" style={{ background: 'var(--color-pitch)', border: '2px solid var(--color-gold-500)' }}>
        {/* Header */}
        <div className="text-center py-6 px-4" style={{ background: 'linear-gradient(135deg, var(--color-green-900), var(--color-pitch))' }}>
          <div className="text-4xl mb-2">🏆</div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
            BOLÃO COPA DO MUNDO 2026
          </h1>
          <p className="text-lg font-bold mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            {name}
          </p>
        </div>

        {/* Champion Section */}
        <div className="text-center py-4 px-4" style={{ background: 'rgba(212,160,23,0.1)', borderBottom: '1px solid var(--color-card-border)' }}>
          <div className="flex justify-center gap-8">
            {resolveBracket.champion && (
              <div>
                <p className="text-xs mb-1" style={{ color: '#708070' }}>🥇 CAMPEÃO</p>
                <p className="text-xl">{getTeamFlag(resolveBracket.champion)}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
                  {getTeamName(resolveBracket.champion)}
                </p>
              </div>
            )}
            {resolveBracket.runnerUp && (
              <div>
                <p className="text-xs mb-1" style={{ color: '#708070' }}>🥈 VICE</p>
                <p className="text-xl">{getTeamFlag(resolveBracket.runnerUp)}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {getTeamName(resolveBracket.runnerUp)}
                </p>
              </div>
            )}
            {resolveBracket.thirdPlace && (
              <div>
                <p className="text-xs mb-1" style={{ color: '#708070' }}>🥉 3º LUGAR</p>
                <p className="text-xl">{getTeamFlag(resolveBracket.thirdPlace)}</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {getTeamName(resolveBracket.thirdPlace)}
                </p>
              </div>
            )}
          </div>
          {/* Final score */}
          {resolveBracket.champion && knockoutResults['FINAL'] && (
            <div className="mt-2 text-xs" style={{ color: '#708070' }}>
              Final: {knockoutResults['FINAL'].homeGoals} × {knockoutResults['FINAL'].awayGoals}
              {knockoutResults['FINAL'].penaltyWinner ? ' (pen)' : ''}
            </div>
          )}
        </div>

        {/* Groups Grid */}
        <div className="p-4">
          <h3 className="text-center text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
            FASE DE GRUPOS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {groups.map(g => {
              const standings = allStandings[g];
              const matches = getMatchesByGroup(g);
              return (
                <div key={g} className="rounded-lg p-2" style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-card-border)' }}>
                  <h4 className="text-xs font-bold text-center mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}>
                    GRUPO {g}
                  </h4>
                  {/* Mini standings */}
                  <div className="space-y-1 mb-2">
                    {standings.map((s, i) => (
                      <div key={s.teamId} className="flex items-center gap-1 text-xs">
                        <span style={{ color: i < 2 ? 'var(--color-green-400)' : i === 2 ? 'var(--color-gold-400)' : '#506050', fontFamily: 'var(--font-heading)', fontSize: '0.65rem', width: '14px' }}>
                          {i + 1}
                        </span>
                        <span>{getTeamFlag(s.teamId)}</span>
                        <span className="flex-1 truncate" style={{ fontSize: '0.7rem' }}>{getTeamName(s.teamId)}</span>
                        <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)', fontSize: '0.7rem' }}>
                          {s.points}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Mini results */}
                  <div className="pt-1" style={{ borderTop: '1px solid var(--color-card-border)' }}>
                    {matches.map(m => {
                      const r = groupResults[m.id];
                      if (!r || r.homeGoals === null || r.awayGoals === null) return null;
                      return (
                        <div key={m.id} className="flex items-center text-xs py-0.5 gap-0.5">
                          <span style={{ fontSize: '0.6rem' }}>{getTeamFlag(m.homeTeam)}</span>
                          <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)', fontSize: '0.65rem', minWidth: '24px', textAlign: 'center' }}>
                            {r.homeGoals}×{r.awayGoals}
                          </span>
                          <span style={{ fontSize: '0.6rem' }}>{getTeamFlag(m.awayTeam)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Knockout Results */}
        <div className="p-4" style={{ borderTop: '1px solid var(--color-card-border)' }}>
          <h3 className="text-center text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>
            MATA-MATA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* R32 */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}>Rodada de 32</p>
              <div className="space-y-0">
                {resolveBracket.r32.map(m => renderMiniMatch(m.id, m.home, m.away, knockoutResults))}
              </div>
            </div>
            {/* R16 */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}>Oitavas de Final</p>
              <div className="space-y-0">
                {resolveBracket.r16.map(m => renderMiniMatch(m.id, m.home, m.away, knockoutResults))}
              </div>
            </div>
            {/* QF */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}>Quartas de Final</p>
              <div className="space-y-0">
                {resolveBracket.qf.map(m => renderMiniMatch(m.id, m.home, m.away, knockoutResults))}
              </div>
            </div>
            {/* SF + Final */}
            <div>
              <p className="text-xs font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-400)' }}>Semifinais</p>
              <div className="space-y-0">
                {resolveBracket.sf.map(m => renderMiniMatch(m.id, m.home, m.away, knockoutResults))}
              </div>
              <p className="text-xs font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold-400)' }}>Final</p>
              {renderMiniMatch('FINAL',
                resolveBracket.sf[0] ? (() => { const r = knockoutResults['SF_1']; if (!r || r.homeGoals === null) return null; return r.homeGoals > (r.awayGoals||0) ? resolveBracket.sf[0].home : r.awayGoals! > r.homeGoals ? resolveBracket.sf[0].away : r.penaltyWinner || null; })() : null,
                resolveBracket.sf[1] ? (() => { const r = knockoutResults['SF_2']; if (!r || r.homeGoals === null) return null; return r.homeGoals > (r.awayGoals||0) ? resolveBracket.sf[1].home : r.awayGoals! > r.homeGoals ? resolveBracket.sf[1].away : r.penaltyWinner || null; })() : null,
                knockoutResults
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-3 text-xs" style={{ color: '#405040', borderTop: '1px solid var(--color-card-border)' }}>
          Bolão Copa do Mundo 2026 • {name} • {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  );
}
