import { PlayerRole } from '../types';

export interface AvatarOption {
  id: string;
  emoji: string;
  label: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'fox', emoji: '🦊', label: '狐狸' },
  { id: 'rabbit', emoji: '🐰', label: '兔子' },
  { id: 'cat', emoji: '😺', label: '猫咪' },
  { id: 'wolf', emoji: '🐺', label: '狼' },
  { id: 'butterfly', emoji: '🦋', label: '蝴蝶' },
  { id: 'peach', emoji: '🍑', label: '蜜桃' },
  { id: 'cherry', emoji: '🍒', label: '樱桃' },
  { id: 'rose', emoji: '🌹', label: '玫瑰' },
  { id: 'crown', emoji: '👑', label: '皇冠' },
  { id: 'heart', emoji: '❤️', label: '爱心' },
  { id: 'flame', emoji: '🔥', label: '火焰' },
  { id: 'devil', emoji: '😈', label: '小恶魔' },
  { id: 'kiss', emoji: '💋', label: '吻痕' },
  { id: 'mask', emoji: '🎭', label: '面具' }
];

export function getAvatarEmoji(avatarId: string | undefined, role: PlayerRole): string {
  const found = AVATAR_OPTIONS.find(option => option.id === avatarId);
  if (found) return found.emoji;
  return role === 'male' ? '😈' : '💋';
}

interface IntimacyLevel {
  title: string;
  threshold: number;
  nextThreshold: number | null;
  progress: number;
}

const INTIMACY_LEVELS = [
  { title: '初识心动', threshold: 0 },
  { title: '暧昧升温', threshold: 50 },
  { title: '热恋进行时', threshold: 150 },
  { title: '干柴烈火', threshold: 300 },
  { title: '灵肉合一', threshold: 500 },
  { title: '禁忌玩家', threshold: 800 },
  { title: '终极臣服', threshold: 1200 }
];

export function getIntimacyLevel(intimacy: number): IntimacyLevel {
  let current = INTIMACY_LEVELS[0];
  let next: IntimacyLevel['nextThreshold'] = INTIMACY_LEVELS[1]?.threshold ?? null;

  for (let i = 0; i < INTIMACY_LEVELS.length; i += 1) {
    const level = INTIMACY_LEVELS[i];
    if (intimacy >= level.threshold) {
      current = level;
      next = INTIMACY_LEVELS[i + 1]?.threshold ?? null;
    }
  }

  const progress = next === null ? 100 : Math.min(100, Math.round(((intimacy - current.threshold) / (next - current.threshold)) * 100));

  return {
    title: current.title,
    threshold: current.threshold,
    nextThreshold: next,
    progress
  };
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
