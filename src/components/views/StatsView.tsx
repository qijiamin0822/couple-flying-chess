import { useState, useRef } from 'react';
import { Heart, Trophy, Flame, CheckCircle2, XCircle, Trash2, RefreshCcw } from 'lucide-react';
import { CoupleStats, Player } from '../../types';
import { getAvatarEmoji, getIntimacyLevel, formatDuration } from '../../utils/coupleProfile';

interface StatsViewProps {
  stats: CoupleStats;
  players: Player[];
  onClearHistory: () => void;
  onResetIntimacy: () => void;
}

function formatMatchTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function StatsView({ stats, players, onClearHistory, onResetIntimacy }: StatsViewProps) {
  const [confirmAction, setConfirmAction] = useState<'history' | 'intimacy' | null>(null);
  const actionTimer = useRef<number | null>(null);
  const level = getIntimacyLevel(stats.intimacy);

  const handleAction = (action: 'history' | 'intimacy') => {
    if (confirmAction === action) {
      if (action === 'history') {
        onClearHistory();
      } else {
        onResetIntimacy();
      }
      setConfirmAction(null);
      return;
    }
    setConfirmAction(action);
    if (actionTimer.current !== null) {
      window.clearTimeout(actionTimer.current);
    }
    actionTimer.current = window.setTimeout(() => setConfirmAction(null), 3000);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto no-scrollbar pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">情侣战绩</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('history')}
            className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 ios-btn ${
              confirmAction === 'history'
                ? 'bg-[#FF453A] text-white'
                : 'bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            <Trash2 size={14} />
            {confirmAction === 'history' ? '确认清空记录' : '清空记录'}
          </button>
          <button
            onClick={() => handleAction('intimacy')}
            className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 ios-btn ${
              confirmAction === 'intimacy'
                ? 'bg-[#FF453A] text-white'
                : 'bg-white/10 text-gray-300 border border-white/10'
            }`}
          >
            <RefreshCcw size={14} />
            {confirmAction === 'intimacy' ? '确认重置亲密' : '重置亲密值'}
          </button>
        </div>
      </div>

      <div className="ios-card p-5 border border-white/5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="text-[#FF375F]" size={18} fill="currentColor" />
            <span className="text-white font-bold">亲密等级</span>
          </div>
          <span className="text-sm font-bold text-[#FF9F0A]">{level.title}</span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-black text-white">{stats.intimacy}</span>
          <span className="text-xs text-gray-500">
            {level.nextThreshold === null ? '已满级' : `下一级 ${level.nextThreshold}`}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF9F0A] transition-all duration-500"
            style={{ width: `${level.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="ios-card p-4 border border-white/5">
          <div className="text-2xl font-black text-white">{stats.totalMatches}</div>
          <div className="text-xs text-gray-500 mt-1">总对局</div>
        </div>
        <div className="ios-card p-4 border border-white/5">
          <div className="text-2xl font-black text-white">{stats.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">当前连胜</div>
        </div>
        <div className="ios-card p-4 border border-white/5">
          <div className="text-2xl font-black text-white">{stats.totalTasksCompleted}</div>
          <div className="text-xs text-gray-500 mt-1">完成任务</div>
        </div>
        <div className="ios-card p-4 border border-white/5">
          <div className="text-2xl font-black text-white">{stats.bestStreak}</div>
          <div className="text-xs text-gray-500 mt-1">最高连胜</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {players.map(player => (
          <div key={player.id} className="ios-card p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl border border-white/10"
                style={{ backgroundColor: player.color }}
              >
                {getAvatarEmoji(player.avatar, player.role)}
              </div>
              <span className="text-sm font-bold text-white">{player.name}</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.wins[player.id]}</div>
            <div className="text-xs text-gray-500 mt-1">胜利场次</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Trophy className="text-[#FFD60A]" size={16} />
        <span className="text-sm font-bold text-white">最近对局</span>
      </div>

      {stats.history.length === 0 ? (
        <div className="ios-card p-6 text-center text-gray-500 text-sm border border-white/5">
          还没有对局记录，赢下第一局吧
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stats.history.map(record => (
            <div key={record.id} className="ios-card p-4 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="text-[#FF9F0A]" size={14} />
                  <span className="text-sm font-bold text-white">{record.winnerName}</span>
                  <span className="text-xs text-gray-500">胜</span>
                </div>
                <span className="text-[10px] text-gray-500">{formatMatchTime(record.finishedAt)}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-sm font-bold text-white">{record.turns}</div>
                  <div className="text-[9px] text-gray-500">回合</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{record.completedTasks}</div>
                  <div className="text-[9px] text-gray-500">完成</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{record.rejectedTasks}</div>
                  <div className="text-[9px] text-gray-500">拒绝</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#FF9F0A]">+{record.intimacyEarned}</div>
                  <div className="text-[9px] text-gray-500">亲密</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-400" />
                  {formatDuration(record.durationSeconds)}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <XCircle size={11} className="text-gray-500" />
                  {record.themeNames.join(' · ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
