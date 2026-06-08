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

// Resolve which third-placed team fills a bracket slot
// This is simplified - in reality FIFA has a complex table
export function resolveThirdPlaceSlot(
  slotGroups: string, // e.g. "C_D_E"
  allStandings: Record<string, GroupStanding[]>
): string | null {
  const possibleGroups = slotGroups.split('_');
  const qualifiedThirds = getThirdPlacedTeams(allStandings).slice(0, 8);
  
  // Find the best qualified third from the possible groups
  for (const third of qualifiedThirds) {
    if (possibleGroups.includes(third.group)) {
      return third.teamId;
    }
  }
  return null;
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
