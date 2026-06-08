import { GroupStanding, MatchResult } from './types';
import { teams, groupMatches, getTeamsByGroup } from './data';

export function calculateGroupStandings(
  group: string,
  results: Record<string, MatchResult>
): GroupStanding[] {
  const groupTeams = getTeamsByGroup(group);
  const matches = groupMatches.filter(m => m.group === group);

  const standings: Record<string, GroupStanding> = {};

  groupTeams.forEach(team => {
    standings[team.id] = {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  matches.forEach(match => {
    const result = results[match.id];
    if (!result || result.homeGoals === null || result.awayGoals === null) return;

    const home = standings[match.homeTeam];
    const away = standings[match.awayTeam];
    if (!home || !away) return;

    home.played++;
    away.played++;
    home.goalsFor += result.homeGoals;
    home.goalsAgainst += result.awayGoals;
    away.goalsFor += result.awayGoals;
    away.goalsAgainst += result.homeGoals;

    if (result.homeGoals > result.awayGoals) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (result.homeGoals < result.awayGoals) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }

    home.goalDifference = home.goalsFor - home.goalsAgainst;
    away.goalDifference = away.goalsFor - away.goalsAgainst;
  });

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return 0;
  });
}

export function getAllGroupStandings(
  results: Record<string, MatchResult>
): Record<string, GroupStanding[]> {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const allStandings: Record<string, GroupStanding[]> = {};
  groups.forEach(g => {
    allStandings[g] = calculateGroupStandings(g, results);
  });
  return allStandings;
}

export function getThirdPlacedTeams(
  allStandings: Record<string, GroupStanding[]>
): { teamId: string; group: string; standing: GroupStanding }[] {
  const thirds = Object.entries(allStandings).map(([group, standings]) => ({
    teamId: standings[2]?.teamId || '',
    group,
    standing: standings[2],
  })).filter(t => t.standing);

  // Sort by FIFA criteria: points, GD, GF
  thirds.sort((a, b) => {
    if (b.standing.points !== a.standing.points) return b.standing.points - a.standing.points;
    if (b.standing.goalDifference !== a.standing.goalDifference)
      return b.standing.goalDifference - a.standing.goalDifference;
    if (b.standing.goalsFor !== a.standing.goalsFor)
      return b.standing.goalsFor - a.standing.goalsFor;
    return 0;
  });

  return thirds;
}

export function getQualifiedThirds(
  allStandings: Record<string, GroupStanding[]>
): string[] {
  const thirds = getThirdPlacedTeams(allStandings);
  return thirds.slice(0, 8).map(t => t.teamId);
}

// Get the team that finished in a specific position in a group
export function getGroupPosition(
  group: string,
  position: number, // 0 = 1st, 1 = 2nd, 2 = 3rd
  allStandings: Record<string, GroupStanding[]>
): string | null {
  const standings = allStandings[group];
  if (!standings || !standings[position]) return null;
  return standings[position].teamId;
}

// Resolve ALL eight 3rd-place bracket slots at once, guaranteeing each
// qualified third-placed team is assigned to EXACTLY ONE slot.
//
// `slotGroupSets[i]` lists the groups allowed to feed slot i (FIFA's table
// determines which combination of qualifying thirds maps to which slots).
// We assign greedily: process slots in order, and for each slot pick the
// best-ranked still-unassigned third whose group is permitted. This prevents
// the duplicate-team bug where the same third filled multiple slots.
export function resolveThirdPlaceSlots(
  slotGroupSets: string[],
  allStandings: Record<string, GroupStanding[]>
): (string | null)[] {
  const qualifiedThirds = getThirdPlacedTeams(allStandings).slice(0, 8);
  const used = new Set<string>();
  const result: (string | null)[] = [];

  for (const slotGroups of slotGroupSets) {
    const possibleGroups = slotGroups.split('_');
    const match = qualifiedThirds.find(
      t => !used.has(t.teamId) && possibleGroups.includes(t.group)
    );
    if (match) {
      used.add(match.teamId);
      result.push(match.teamId);
    } else {
      result.push(null);
    }
  }

  // Safety net: if some slot found no permitted group (e.g. that group's third
  // didn't qualify), backfill with any remaining unassigned qualified third so
  // all 8 teams are placed and none is left out of the bracket.
  for (let i = 0; i < result.length; i++) {
    if (result[i] === null) {
      const leftover = qualifiedThirds.find(t => !used.has(t.teamId));
      if (leftover) {
        used.add(leftover.teamId);
        result[i] = leftover.teamId;
      }
    }
  }

  return result;
}

// Single source of truth for the Round-of-32 pairings.
// Returns 16 matches with home/away team ids resolved from the group standings.
// Every one of the 32 qualified teams appears EXACTLY ONCE (verified by tests).
// Both KnockoutStage and Summary must use this — do NOT inline a second copy,
// or the two views will disagree and the duplicate-team bug can creep back.
export function resolveRound32(
  allStandings: Record<string, GroupStanding[]>
): { id: string; home: string | null; away: string | null }[] {
  const t = resolveThirdPlaceSlots(
    ['A_B_C_D', 'A_B_C_F', 'D_E_F', 'E_F_G_I', 'E_H_I_J', 'I_J_K_L', 'H_J_K_L', 'B_E_H_K'],
    allStandings
  );
  const pos = (g: string, p: number) => getGroupPosition(g, p, allStandings);
  return [
    // Left half
    { id: 'R32_1', home: pos('A', 0), away: t[0] },
    { id: 'R32_2', home: pos('E', 1), away: pos('H', 1) },
    { id: 'R32_3', home: pos('F', 0), away: pos('C', 1) },
    { id: 'R32_4', home: pos('C', 0), away: t[1] },
    { id: 'R32_5', home: pos('I', 0), away: pos('B', 1) },
    { id: 'R32_6', home: pos('E', 0), away: t[2] },
    { id: 'R32_7', home: pos('L', 0), away: pos('D', 1) },
    { id: 'R32_8', home: pos('G', 0), away: t[3] },
    // Right half
    { id: 'R32_9', home: pos('D', 0), away: t[4] },
    { id: 'R32_10', home: pos('J', 1), away: pos('L', 1) },
    { id: 'R32_11', home: pos('K', 0), away: pos('I', 1) },
    { id: 'R32_12', home: pos('H', 0), away: t[5] },
    { id: 'R32_13', home: pos('B', 0), away: pos('G', 1) },
    { id: 'R32_14', home: pos('J', 0), away: t[6] },
    { id: 'R32_15', home: pos('K', 1), away: pos('F', 1) },
    { id: 'R32_16', home: pos('A', 1), away: t[7] },
  ];
}

// Get winner of a knockout match
export function getMatchWinner(
  matchId: string,
  results: Record<string, MatchResult>
): string | null {
  const result = results[matchId];
  if (!result || result.homeGoals === null || result.awayGoals === null) return null;

  if (result.homeGoals > result.awayGoals) {
    // Need to know which team was home - this comes from bracket resolution
    return 'home';
  } else if (result.awayGoals > result.homeGoals) {
    return 'away';
  } else {
    // Draw - penalty winner
    return result.penaltyWinner ? 'penalty' : null;
  }
}

// Get loser of a knockout match (for 3rd place)
export function getMatchLoser(
  matchId: string,
  results: Record<string, MatchResult>,
  homeTeamId: string | null,
  awayTeamId: string | null
): string | null {
  const result = results[matchId];
  if (!result || result.homeGoals === null || result.awayGoals === null) return null;
  if (!homeTeamId || !awayTeamId) return null;

  if (result.homeGoals > result.awayGoals) {
    return awayTeamId;
  } else if (result.awayGoals > result.homeGoals) {
    return homeTeamId;
  } else {
    if (result.penaltyWinner === homeTeamId) return awayTeamId;
    if (result.penaltyWinner === awayTeamId) return homeTeamId;
    return null;
  }
}

export function isGroupComplete(group: string, results: Record<string, MatchResult>): boolean {
  const matches = groupMatches.filter(m => m.group === group);
  return matches.every(m => {
    const r = results[m.id];
    return r && r.homeGoals !== null && r.awayGoals !== null;
  });
}

export function areAllGroupsComplete(results: Record<string, MatchResult>): boolean {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  return groups.every(g => isGroupComplete(g, results));
}

export function getTeamName(teamId: string): string {
  return teams[teamId]?.name || teamId;
}

export function getTeamFlag(teamId: string): string {
  return teams[teamId]?.flag || '🏳️';
}
