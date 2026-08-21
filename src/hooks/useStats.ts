import { useEffect, useState, useCallback } from 'react';
import { CoupleStats, MatchRecord } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

const STATS_KEY = 'couples-ludo-stats';

function defaultStats(): CoupleStats {
  return {
    totalMatches: 0,
    wins: [0, 0],
    currentStreak: 0,
    bestStreak: 0,
    totalTurns: 0,
    totalTasksCompleted: 0,
    totalTasksRejected: 0,
    intimacy: 0,
    history: []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function normalizeStats(input: unknown): CoupleStats {
  if (!isRecord(input)) return defaultStats();

  const wins = Array.isArray(input.wins) && input.wins.length === 2
    ? [numberOr(input.wins[0], 0), numberOr(input.wins[1], 0)] as [number, number]
    : [0, 0] as [number, number];

  const history = Array.isArray(input.history)
    ? input.history.filter(isRecord).map((item): MatchRecord => ({
        id: typeof item.id === 'string' ? item.id : `${Date.now()}_${Math.random()}`,
        finishedAt: numberOr(item.finishedAt, Date.now()),
        winnerPlayerId: numberOr(item.winnerPlayerId, 0),
        winnerName: typeof item.winnerName === 'string' ? item.winnerName : '赢家',
        loserName: typeof item.loserName === 'string' ? item.loserName : '对手',
        turns: numberOr(item.turns, 0),
        completedTasks: numberOr(item.completedTasks, 0),
        rejectedTasks: numberOr(item.rejectedTasks, 0),
        themeNames: Array.isArray(item.themeNames)
          ? item.themeNames.filter((t): t is string => typeof t === 'string')
          : [],
        intimacyEarned: numberOr(item.intimacyEarned, 0),
        durationSeconds: numberOr(item.durationSeconds, 0)
      }))
    : [];

  return {
    totalMatches: numberOr(input.totalMatches, history.length),
    wins,
    currentStreak: numberOr(input.currentStreak, 0),
    bestStreak: numberOr(input.bestStreak, 0),
    totalTurns: numberOr(input.totalTurns, 0),
    totalTasksCompleted: numberOr(input.totalTasksCompleted, 0),
    totalTasksRejected: numberOr(input.totalTasksRejected, 0),
    intimacy: numberOr(input.intimacy, 0),
    history
  };
}

function createMatchId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function useStats() {
  const [stats, setStats] = useState<CoupleStats>(() =>
    normalizeStats(loadFromStorage<unknown>(STATS_KEY, null))
  );

  useEffect(() => {
    saveToStorage(STATS_KEY, stats);
  }, [stats]);

  const recordMatch = useCallback((match: Omit<MatchRecord, 'id' | 'finishedAt'>) => {
    setStats(prev => {
      const sameWinner = prev.history[0]?.winnerPlayerId === match.winnerPlayerId;
      const currentStreak = sameWinner ? prev.currentStreak + 1 : 1;
      const record: MatchRecord = {
        ...match,
        id: createMatchId(),
        finishedAt: Date.now()
      };

      return {
        totalMatches: prev.totalMatches + 1,
        wins: prev.wins.map((count, index) =>
          index === match.winnerPlayerId ? count + 1 : count
        ) as [number, number],
        currentStreak,
        bestStreak: Math.max(prev.bestStreak, currentStreak),
        totalTurns: prev.totalTurns + match.turns,
        totalTasksCompleted: prev.totalTasksCompleted + match.completedTasks,
        totalTasksRejected: prev.totalTasksRejected + match.rejectedTasks,
        intimacy: prev.intimacy + match.intimacyEarned,
        history: [record, ...prev.history].slice(0, 50)
      };
    });
  }, []);

  const clearStats = useCallback(() => {
    setStats(defaultStats());
  }, []);

  const clearHistory = useCallback(() => {
    setStats(prev => ({
      ...prev,
      totalMatches: 0,
      wins: [0, 0],
      currentStreak: 0,
      bestStreak: 0,
      totalTurns: 0,
      totalTasksCompleted: 0,
      totalTasksRejected: 0,
      history: []
    }));
  }, []);

  const resetIntimacy = useCallback(() => {
    setStats(prev => ({ ...prev, intimacy: 0 }));
  }, []);

  return { stats, recordMatch, clearStats, clearHistory, resetIntimacy };
}
