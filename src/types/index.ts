export type TileType = 'blank' | 'lucky' | 'trap';

export type PlayerRole = 'male' | 'female';

export interface Player {
  id: number;
  name: string;
  avatar: string;
  color: string;
  role: PlayerRole;
  step: number;
  themeId: string | null;
}

export type ThemeAudience = 'common' | 'male' | 'female';

export interface Theme {
  id: string;
  name: string;
  desc: string;
  audience: ThemeAudience;
  tasks: string[];
}

export interface PathCoord {
  r: number;
  c: number;
}

export interface GameState {
  view: 'home' | 'game' | 'themes' | 'stats' | 'settings';
  turn: number;
  players: Player[];
  themes: Theme[];
  boardMap: TileType[];
  pathCoords: PathCoord[];
  isRolling: boolean;
  turnCount: number;
  completedTasks: number;
  rejectedTasks: number;
  startedAt: number | null;
}

export interface MatchRecord {
  id: string;
  finishedAt: number;
  winnerPlayerId: number;
  winnerName: string;
  loserName: string;
  turns: number;
  completedTasks: number;
  rejectedTasks: number;
  themeNames: string[];
  intimacyEarned: number;
  durationSeconds: number;
}

export type MatchReport = Omit<MatchRecord, 'id' | 'finishedAt'>;

export interface CoupleStats {
  totalMatches: number;
  wins: [number, number];
  currentStreak: number;
  bestStreak: number;
  totalTurns: number;
  totalTasksCompleted: number;
  totalTasksRejected: number;
  intimacy: number;
  history: MatchRecord[];
}

export interface TaskEventData {
  type: 'collision' | 'lucky' | 'trap';
  initiatorPlayerId: number;
  executorPlayerId: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  task: string;
  taskSourceId: string;
}
