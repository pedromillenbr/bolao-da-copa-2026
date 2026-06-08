import { Team, GroupMatch } from './types';

export const teams: Record<string, Team> = {
  // Group A
  MEX: { id: 'MEX', name: 'México', flag: '🇲🇽', group: 'A' },
  RSA: { id: 'RSA', name: 'África do Sul', flag: '🇿🇦', group: 'A' },
  KOR: { id: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', group: 'A' },
  CZE: { id: 'CZE', name: 'Rep. Tcheca', flag: '🇨🇿', group: 'A' },
  // Group B
  CAN: { id: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'B' },
  BIH: { id: 'BIH', name: 'Bósnia', flag: '🇧🇦', group: 'B' },
  QAT: { id: 'QAT', name: 'Catar', flag: '🇶🇦', group: 'B' },
  SUI: { id: 'SUI', name: 'Suíça', flag: '🇨🇭', group: 'B' },
  // Group C
  BRA: { id: 'BRA', name: 'Brasil', flag: '🇧🇷', group: 'C' },
  MAR: { id: 'MAR', name: 'Marrocos', flag: '🇲🇦', group: 'C' },
  HAI: { id: 'HAI', name: 'Haiti', flag: '🇭🇹', group: 'C' },
  SCO: { id: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  // Group D
  USA: { id: 'USA', name: 'Estados Unidos', flag: '🇺🇸', group: 'D' },
  PAR: { id: 'PAR', name: 'Paraguai', flag: '🇵🇾', group: 'D' },
  AUS: { id: 'AUS', name: 'Austrália', flag: '🇦🇺', group: 'D' },
  TUR: { id: 'TUR', name: 'Turquia', flag: '🇹🇷', group: 'D' },
  // Group E
  GER: { id: 'GER', name: 'Alemanha', flag: '🇩🇪', group: 'E' },
  CUW: { id: 'CUW', name: 'Curaçao', flag: '🇨🇼', group: 'E' },
  CIV: { id: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮', group: 'E' },
  ECU: { id: 'ECU', name: 'Equador', flag: '🇪🇨', group: 'E' },
  // Group F
  NED: { id: 'NED', name: 'Holanda', flag: '🇳🇱', group: 'F' },
  JPN: { id: 'JPN', name: 'Japão', flag: '🇯🇵', group: 'F' },
  SWE: { id: 'SWE', name: 'Suécia', flag: '🇸🇪', group: 'F' },
  TUN: { id: 'TUN', name: 'Tunísia', flag: '🇹🇳', group: 'F' },
  // Group G
  BEL: { id: 'BEL', name: 'Bélgica', flag: '🇧🇪', group: 'G' },
  EGY: { id: 'EGY', name: 'Egito', flag: '🇪🇬', group: 'G' },
  IRN: { id: 'IRN', name: 'Irã', flag: '🇮🇷', group: 'G' },
  NZL: { id: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿', group: 'G' },
  // Group H
  ESP: { id: 'ESP', name: 'Espanha', flag: '🇪🇸', group: 'H' },
  CPV: { id: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', group: 'H' },
  KSA: { id: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦', group: 'H' },
  URU: { id: 'URU', name: 'Uruguai', flag: '🇺🇾', group: 'H' },
  // Group I
  FRA: { id: 'FRA', name: 'França', flag: '🇫🇷', group: 'I' },
  SEN: { id: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'I' },
  IRQ: { id: 'IRQ', name: 'Iraque', flag: '🇮🇶', group: 'I' },
  NOR: { id: 'NOR', name: 'Noruega', flag: '🇳🇴', group: 'I' },
  // Group J
  ARG: { id: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'J' },
  ALG: { id: 'ALG', name: 'Argélia', flag: '🇩🇿', group: 'J' },
  AUT: { id: 'AUT', name: 'Áustria', flag: '🇦🇹', group: 'J' },
  JOR: { id: 'JOR', name: 'Jordânia', flag: '🇯🇴', group: 'J' },
  // Group K
  POR: { id: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'K' },
  COD: { id: 'COD', name: 'RD Congo', flag: '🇨🇩', group: 'K' },
  UZB: { id: 'UZB', name: 'Uzbequistão', flag: '🇺🇿', group: 'K' },
  COL: { id: 'COL', name: 'Colômbia', flag: '🇨🇴', group: 'K' },
  // Group L
  ENG: { id: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  CRO: { id: 'CRO', name: 'Croácia', flag: '🇭🇷', group: 'L' },
  GHA: { id: 'GHA', name: 'Gana', flag: '🇬🇭', group: 'L' },
  PAN: { id: 'PAN', name: 'Panamá', flag: '🇵🇦', group: 'L' },
};

export const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const getTeamsByGroup = (group: string): Team[] => {
  return Object.values(teams).filter(t => t.group === group);
};

// All 72 group stage matches
export const groupMatches: GroupMatch[] = [
  // Group A
  { id: 'A1', group: 'A', homeTeam: 'MEX', awayTeam: 'RSA', date: '11/06', stadium: 'Estádio Azteca' },
  { id: 'A2', group: 'A', homeTeam: 'KOR', awayTeam: 'CZE', date: '11/06', stadium: 'Estádio Akron' },
  { id: 'A3', group: 'A', homeTeam: 'CZE', awayTeam: 'RSA', date: '18/06', stadium: 'Mercedes-Benz' },
  { id: 'A4', group: 'A', homeTeam: 'MEX', awayTeam: 'KOR', date: '18/06', stadium: 'Estádio Akron' },
  { id: 'A5', group: 'A', homeTeam: 'CZE', awayTeam: 'MEX', date: '24/06', stadium: 'Estádio Azteca' },
  { id: 'A6', group: 'A', homeTeam: 'RSA', awayTeam: 'KOR', date: '24/06', stadium: 'BBVA Monterrey' },
  // Group B
  { id: 'B1', group: 'B', homeTeam: 'CAN', awayTeam: 'BIH', date: '12/06', stadium: 'BMO Field' },
  { id: 'B2', group: 'B', homeTeam: 'QAT', awayTeam: 'SUI', date: '13/06', stadium: "Levi's Stadium" },
  { id: 'B3', group: 'B', homeTeam: 'SUI', awayTeam: 'BIH', date: '18/06', stadium: 'SoFi Stadium' },
  { id: 'B4', group: 'B', homeTeam: 'CAN', awayTeam: 'QAT', date: '18/06', stadium: 'BC Place' },
  { id: 'B5', group: 'B', homeTeam: 'SUI', awayTeam: 'CAN', date: '24/06', stadium: 'BC Place' },
  { id: 'B6', group: 'B', homeTeam: 'BIH', awayTeam: 'QAT', date: '24/06', stadium: 'Lumen Field' },
  // Group C
  { id: 'C1', group: 'C', homeTeam: 'BRA', awayTeam: 'MAR', date: '13/06', stadium: 'MetLife Stadium' },
  { id: 'C2', group: 'C', homeTeam: 'HAI', awayTeam: 'SCO', date: '13/06', stadium: 'Gillette Stadium' },
  { id: 'C3', group: 'C', homeTeam: 'SCO', awayTeam: 'MAR', date: '19/06', stadium: 'Gillette Stadium' },
  { id: 'C4', group: 'C', homeTeam: 'BRA', awayTeam: 'HAI', date: '19/06', stadium: 'Lincoln Financial' },
  { id: 'C5', group: 'C', homeTeam: 'SCO', awayTeam: 'BRA', date: '24/06', stadium: 'Hard Rock Stadium' },
  { id: 'C6', group: 'C', homeTeam: 'MAR', awayTeam: 'HAI', date: '24/06', stadium: 'Mercedes-Benz' },
  // Group D
  { id: 'D1', group: 'D', homeTeam: 'USA', awayTeam: 'PAR', date: '12/06', stadium: 'SoFi Stadium' },
  { id: 'D2', group: 'D', homeTeam: 'AUS', awayTeam: 'TUR', date: '13/06', stadium: 'BC Place' },
  { id: 'D3', group: 'D', homeTeam: 'USA', awayTeam: 'AUS', date: '19/06', stadium: 'Lumen Field' },
  { id: 'D4', group: 'D', homeTeam: 'TUR', awayTeam: 'PAR', date: '19/06', stadium: "Levi's Stadium" },
  { id: 'D5', group: 'D', homeTeam: 'TUR', awayTeam: 'USA', date: '25/06', stadium: 'SoFi Stadium' },
  { id: 'D6', group: 'D', homeTeam: 'PAR', awayTeam: 'AUS', date: '25/06', stadium: "Levi's Stadium" },
  // Group E
  { id: 'E1', group: 'E', homeTeam: 'GER', awayTeam: 'CUW', date: '14/06', stadium: 'NRG Stadium' },
  { id: 'E2', group: 'E', homeTeam: 'CIV', awayTeam: 'ECU', date: '14/06', stadium: 'Lincoln Financial' },
  { id: 'E3', group: 'E', homeTeam: 'GER', awayTeam: 'CIV', date: '20/06', stadium: 'BMO Field' },
  { id: 'E4', group: 'E', homeTeam: 'ECU', awayTeam: 'CUW', date: '20/06', stadium: 'Arrowhead Stadium' },
  { id: 'E5', group: 'E', homeTeam: 'ECU', awayTeam: 'GER', date: '25/06', stadium: 'MetLife Stadium' },
  { id: 'E6', group: 'E', homeTeam: 'CUW', awayTeam: 'CIV', date: '25/06', stadium: 'Lincoln Financial' },
  // Group F
  { id: 'F1', group: 'F', homeTeam: 'NED', awayTeam: 'JPN', date: '14/06', stadium: 'Hard Rock Stadium' },
  { id: 'F2', group: 'F', homeTeam: 'SWE', awayTeam: 'TUN', date: '15/06', stadium: 'NRG Stadium' },
  { id: 'F3', group: 'F', homeTeam: 'NED', awayTeam: 'SWE', date: '20/06', stadium: 'Hard Rock Stadium' },
  { id: 'F4', group: 'F', homeTeam: 'TUN', awayTeam: 'JPN', date: '21/06', stadium: 'Arrowhead Stadium' },
  { id: 'F5', group: 'F', homeTeam: 'TUN', awayTeam: 'NED', date: '25/06', stadium: 'Mercedes-Benz' },
  { id: 'F6', group: 'F', homeTeam: 'JPN', awayTeam: 'SWE', date: '25/06', stadium: 'Hard Rock Stadium' },
  // Group G
  { id: 'G1', group: 'G', homeTeam: 'BEL', awayTeam: 'EGY', date: '15/06', stadium: 'BBVA Monterrey' },
  { id: 'G2', group: 'G', homeTeam: 'IRN', awayTeam: 'NZL', date: '15/06', stadium: 'Estádio Akron' },
  { id: 'G3', group: 'G', homeTeam: 'BEL', awayTeam: 'IRN', date: '21/06', stadium: 'BBVA Monterrey' },
  { id: 'G4', group: 'G', homeTeam: 'NZL', awayTeam: 'EGY', date: '21/06', stadium: 'Estádio Azteca' },
  { id: 'G5', group: 'G', homeTeam: 'NZL', awayTeam: 'BEL', date: '26/06', stadium: 'Estádio Akron' },
  { id: 'G6', group: 'G', homeTeam: 'EGY', awayTeam: 'IRN', date: '26/06', stadium: 'Estádio Azteca' },
  // Group H
  { id: 'H1', group: 'H', homeTeam: 'ESP', awayTeam: 'CPV', date: '16/06', stadium: 'AT&T Stadium' },
  { id: 'H2', group: 'H', homeTeam: 'KSA', awayTeam: 'URU', date: '16/06', stadium: 'NRG Stadium' },
  { id: 'H3', group: 'H', homeTeam: 'ESP', awayTeam: 'KSA', date: '21/06', stadium: 'AT&T Stadium' },
  { id: 'H4', group: 'H', homeTeam: 'URU', awayTeam: 'CPV', date: '22/06', stadium: 'NRG Stadium' },
  { id: 'H5', group: 'H', homeTeam: 'URU', awayTeam: 'ESP', date: '26/06', stadium: 'AT&T Stadium' },
  { id: 'H6', group: 'H', homeTeam: 'CPV', awayTeam: 'KSA', date: '26/06', stadium: 'NRG Stadium' },
  // Group I
  { id: 'I1', group: 'I', homeTeam: 'FRA', awayTeam: 'SEN', date: '16/06', stadium: 'Arrowhead Stadium' },
  { id: 'I2', group: 'I', homeTeam: 'IRQ', awayTeam: 'NOR', date: '16/06', stadium: 'BMO Field' },
  { id: 'I3', group: 'I', homeTeam: 'FRA', awayTeam: 'IRQ', date: '22/06', stadium: 'Arrowhead Stadium' },
  { id: 'I4', group: 'I', homeTeam: 'NOR', awayTeam: 'SEN', date: '22/06', stadium: 'BMO Field' },
  { id: 'I5', group: 'I', homeTeam: 'NOR', awayTeam: 'FRA', date: '26/06', stadium: 'BMO Field' },
  { id: 'I6', group: 'I', homeTeam: 'SEN', awayTeam: 'IRQ', date: '26/06', stadium: 'Arrowhead Stadium' },
  // Group J
  { id: 'J1', group: 'J', homeTeam: 'ARG', awayTeam: 'ALG', date: '17/06', stadium: 'Hard Rock Stadium' },
  { id: 'J2', group: 'J', homeTeam: 'AUT', awayTeam: 'JOR', date: '17/06', stadium: 'Mercedes-Benz' },
  { id: 'J3', group: 'J', homeTeam: 'ARG', awayTeam: 'AUT', date: '22/06', stadium: 'MetLife Stadium' },
  { id: 'J4', group: 'J', homeTeam: 'JOR', awayTeam: 'ALG', date: '23/06', stadium: 'Mercedes-Benz' },
  { id: 'J5', group: 'J', homeTeam: 'JOR', awayTeam: 'ARG', date: '27/06', stadium: 'Hard Rock Stadium' },
  { id: 'J6', group: 'J', homeTeam: 'ALG', awayTeam: 'AUT', date: '27/06', stadium: 'Mercedes-Benz' },
  // Group K
  { id: 'K1', group: 'K', homeTeam: 'POR', awayTeam: 'COD', date: '17/06', stadium: 'Lincoln Financial' },
  { id: 'K2', group: 'K', homeTeam: 'UZB', awayTeam: 'COL', date: '17/06', stadium: 'MetLife Stadium' },
  { id: 'K3', group: 'K', homeTeam: 'POR', awayTeam: 'UZB', date: '23/06', stadium: 'Gillette Stadium' },
  { id: 'K4', group: 'K', homeTeam: 'COL', awayTeam: 'COD', date: '23/06', stadium: 'Lincoln Financial' },
  { id: 'K5', group: 'K', homeTeam: 'COL', awayTeam: 'POR', date: '27/06', stadium: 'MetLife Stadium' },
  { id: 'K6', group: 'K', homeTeam: 'COD', awayTeam: 'UZB', date: '27/06', stadium: 'Gillette Stadium' },
  // Group L
  { id: 'L1', group: 'L', homeTeam: 'ENG', awayTeam: 'CRO', date: '18/06', stadium: 'BMO Field' },
  { id: 'L2', group: 'L', homeTeam: 'GHA', awayTeam: 'PAN', date: '18/06', stadium: 'BBVA Monterrey' },
  { id: 'L3', group: 'L', homeTeam: 'ENG', awayTeam: 'GHA', date: '23/06', stadium: 'Gillette Stadium' },
  { id: 'L4', group: 'L', homeTeam: 'PAN', awayTeam: 'CRO', date: '23/06', stadium: 'MetLife Stadium' },
  { id: 'L5', group: 'L', homeTeam: 'PAN', awayTeam: 'ENG', date: '28/06', stadium: 'Lincoln Financial' },
  { id: 'L6', group: 'L', homeTeam: 'CRO', awayTeam: 'GHA', date: '28/06', stadium: 'BMO Field' },
];

export const getMatchesByGroup = (group: string): GroupMatch[] => {
  return groupMatches.filter(m => m.group === group);
};

// Knockout bracket structure for FIFA 2026
// The bracket follows the official FIFA structure
// Round of 32: 16 matches
export const round32Structure = [
  // Left bracket
  { id: 'R32_1', homeSource: '1A', awaySource: '3C_D_E', position: 1 },
  { id: 'R32_2', homeSource: '2C', awaySource: '2F', position: 2 },
  { id: 'R32_3', homeSource: '1B', awaySource: '3A_D_F', position: 3 },
  { id: 'R32_4', homeSource: '2A', awaySource: '2D', position: 4 },
  { id: 'R32_5', homeSource: '1E', awaySource: '3B_G_H', position: 5 },
  { id: 'R32_6', homeSource: '2G', awaySource: '2H', position: 6 },
  { id: 'R32_7', homeSource: '1F', awaySource: '3A_B_C', position: 7 },
  { id: 'R32_8', homeSource: '2E', awaySource: '2B', position: 8 },
  // Right bracket
  { id: 'R32_9', homeSource: '1G', awaySource: '3I_J_K', position: 9 },
  { id: 'R32_10', homeSource: '2I', awaySource: '2L', position: 10 },
  { id: 'R32_11', homeSource: '1H', awaySource: '3F_J_L', position: 11 },
  { id: 'R32_12', homeSource: '2K', awaySource: '2J', position: 12 },
  { id: 'R32_13', homeSource: '1I', awaySource: '3G_H_L', position: 13 },
  { id: 'R32_14', homeSource: '2L', awaySource: '2K', position: 14 },
  { id: 'R32_15', homeSource: '1J', awaySource: '3E_F_I', position: 15 },
  { id: 'R32_16', homeSource: '1K', awaySource: '2I', position: 16 },
];

// Simplified bracket: Round of 16 onward follows winner progression
export const round16Structure = [
  { id: 'R16_1', homeSource: 'W_R32_1', awaySource: 'W_R32_2', position: 1 },
  { id: 'R16_2', homeSource: 'W_R32_3', awaySource: 'W_R32_4', position: 2 },
  { id: 'R16_3', homeSource: 'W_R32_5', awaySource: 'W_R32_6', position: 3 },
  { id: 'R16_4', homeSource: 'W_R32_7', awaySource: 'W_R32_8', position: 4 },
  { id: 'R16_5', homeSource: 'W_R32_9', awaySource: 'W_R32_10', position: 5 },
  { id: 'R16_6', homeSource: 'W_R32_11', awaySource: 'W_R32_12', position: 6 },
  { id: 'R16_7', homeSource: 'W_R32_13', awaySource: 'W_R32_14', position: 7 },
  { id: 'R16_8', homeSource: 'W_R32_15', awaySource: 'W_R32_16', position: 8 },
];

export const quartersStructure = [
  { id: 'QF_1', homeSource: 'W_R16_1', awaySource: 'W_R16_2', position: 1 },
  { id: 'QF_2', homeSource: 'W_R16_3', awaySource: 'W_R16_4', position: 2 },
  { id: 'QF_3', homeSource: 'W_R16_5', awaySource: 'W_R16_6', position: 3 },
  { id: 'QF_4', homeSource: 'W_R16_7', awaySource: 'W_R16_8', position: 4 },
];

export const semisStructure = [
  { id: 'SF_1', homeSource: 'W_QF_1', awaySource: 'W_QF_2', position: 1 },
  { id: 'SF_2', homeSource: 'W_QF_3', awaySource: 'W_QF_4', position: 2 },
];

export const thirdPlaceStructure = [
  { id: 'TP', homeSource: 'L_SF_1', awaySource: 'L_SF_2', position: 1 },
];

export const finalStructure = [
  { id: 'FINAL', homeSource: 'W_SF_1', awaySource: 'W_SF_2', position: 1 },
];
