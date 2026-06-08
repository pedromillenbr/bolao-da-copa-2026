export interface Team {
  id: string;
  name: string;
  flag: string; // emoji flag
  group: string;
}

export interface GroupMatch {
  id: string;
  group: string;
  homeTeam: string; // team id
  awayTeam: string; // team id
  date: string;
  stadium: string;
}

export interface MatchResult {
  matchId: string;
  homeGoals: number | null;
  awayGoals: number | null;
  penaltyWinner?: string; // team id for knockout
}

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface KnockoutMatch {
  id: string;
  phase: KnockoutPhase;
  position: number;
  homeTeam: string | null;
  awayTeam: string | null;
  homeSource?: string;
  awaySource?: string;
}

export type KnockoutPhase = 'round32' | 'round16' | 'quarters' | 'semis' | 'third' | 'final';

export type AppStep = 'landing' | 'groups' | 'knockout' | 'summary';

export interface BolaoState {
  participantName: string;
  groupResults: Record<string, MatchResult>;
  knockoutResults: Record<string, MatchResult>;
  currentStep: AppStep;
  currentGroup: string;
  currentKnockoutPhase: KnockoutPhase;
}
