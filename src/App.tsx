import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { MatchReport, TaskEventData } from './types';
import { HomeView } from './components/views/HomeView';
import { GameView } from './components/views/GameView';
import { ThemesView } from './components/views/ThemesView';
import { ThemeSelectorModal } from './components/modals/ThemeSelectorModal';
import { TaskCardModal } from './components/modals/TaskCardModal';
import { WinModal } from './components/modals/WinModal';
import { BottomNav } from './components/BottomNav';
import { ThemeCreateModal } from './components/modals/ThemeCreateModal';
import { ThemeEditorModal } from './components/modals/ThemeEditorModal';
import { AiImportModal } from './components/modals/AiImportModal';
import { ExitConfirmModal } from './components/modals/ExitConfirmModal';
import { StartGameAlertModal } from './components/modals/StartGameAlertModal';
import { PlayerProfileModal } from './components/modals/PlayerProfileModal';
import { StatsView } from './components/views/StatsView';
import { SettingsView } from './components/views/SettingsView';
import { LocalPasswordGate } from './components/LocalPasswordGate';
import { useStats } from './hooks/useStats';
import { getAvatarEmoji } from './utils/coupleProfile';
import {
  hasLocalPassword,
  removeLocalPassword,
  saveLocalPassword,
  verifyLocalPassword
} from './utils/localPassword';

function App() {
  const {
    state,
    switchView,
    selectTheme,
    updatePlayerProfile,
    createTheme,
    updateThemeMeta,
    addThemeTask,
    removeThemeTask,
    importThemeTasks,
    startGame,
    movePlayer,
    endTurn,
    setIsRolling,
    checkTile,
    resolveTask,
    resetGame
  } = useGameState();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [taskData, setTaskData] = useState<TaskEventData | null>(null);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [isCreateThemeModalOpen, setIsCreateThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [aiImportThemeId, setAiImportThemeId] = useState<string | null>(null);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [isStartGameAlertOpen, setIsStartGameAlertOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number>(0);
  const [gameStartPhase, setGameStartPhase] = useState<'idle' | 'enter' | 'exit'>('idle');
  const { stats, recordMatch, clearHistory, resetIntimacy } = useStats();
  const [hasPassword, setHasPassword] = useState(hasLocalPassword);
  const [isUnlocked, setIsUnlocked] = useState(() => !hasLocalPassword());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasLocalPassword()) {
        setIsUnlocked(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleUnlock = async (password: string) => {
    const valid = await verifyLocalPassword(password);
    if (valid) {
      setIsUnlocked(true);
      switchView('home');
    }
    return valid;
  };

  const handleSavePassword = async (currentPassword: string, newPassword: string) => {
    if (hasPassword && !(await verifyLocalPassword(currentPassword))) return false;
    await saveLocalPassword(newPassword);
    setHasPassword(true);
    return true;
  };

  const handleRemovePassword = async (currentPassword: string) => {
    if (!hasPassword || !(await verifyLocalPassword(currentPassword))) return false;
    removeLocalPassword();
    setHasPassword(false);
    return true;
  };

  const handleSelectTheme = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setIsThemeModalOpen(true);
  };

  const handleThemeSelect = (themeId: string) => {
    selectTheme(selectedPlayerId, themeId);
  };

  const selectedPlayer = state.players.find(p => p.id === selectedPlayerId) || state.players[0];
  const selectableThemes = state.themes.filter(
    t => t.audience === 'common' || t.audience === selectedPlayer.role
  );

  const handleStartGame = () => {
    const success = startGame();
    if (!success) {
      setIsStartGameAlertOpen(true);
      return;
    }
    setGameStartPhase('enter');
    setTimeout(() => setGameStartPhase('exit'), 1300);
    setTimeout(() => setGameStartPhase('idle'), 1700);
  };

  const handleTaskTrigger = (data: TaskEventData) => {
    setTaskData(data);
  };

  const handleTaskAccept = () => {
    if (!taskData) return;
    setTaskData(null);
    resolveTask(taskData, 'accept');
  };

  const handleTaskReject = () => {
    if (!taskData) return;
    setTaskData(null);
    resolveTask(taskData, 'reject');
  };

  const handleWin = (id: number) => {
    setWinnerId(id);
    const loserId = id === 0 ? 1 : 0;
    const winner = state.players[id];
    const loser = state.players[loserId];
    recordMatch({
      winnerPlayerId: id,
      winnerName: winner.name,
      loserName: loser.name,
      turns: state.turnCount,
      completedTasks: state.completedTasks,
      rejectedTasks: state.rejectedTasks,
      themeNames: state.players.map(p =>
        state.themes.find(t => t.id === p.themeId)?.name || '未选择'
      ),
      intimacyEarned: state.completedTasks * 10 + 20,
      durationSeconds: state.startedAt
        ? Math.max(1, Math.round((Date.now() - state.startedAt) / 1000))
        : 0
    });
  };

  const handleNavigate = (view: 'home' | 'themes' | 'stats' | 'settings') => {
    switchView(view);
  };

  const handleLock = () => {
    switchView('home');
    setIsUnlocked(false);
  };

  const handleEditProfile = (playerId: number) => {
    setEditingPlayerId(playerId);
    setIsProfileModalOpen(true);
  };

  const handleBackFromGame = () => {
    setIsExitConfirmOpen(true);
  };

  const handleConfirmLeave = () => {
    setIsExitConfirmOpen(false);
    switchView('home');
  };

  const handleResumeGame = () => {
    switchView('game');
  };

  const hasInProgressGame = state.startedAt !== null;
  const editingPlayer = state.players.find(p => p.id === editingPlayerId) || null;
  const winnerAvatar = winnerId !== null
    ? getAvatarEmoji(state.players[winnerId].avatar, state.players[winnerId].role)
    : '';
  const matchReport: MatchReport | null = winnerId !== null
    ? {
        winnerPlayerId: winnerId,
        winnerName: state.players[winnerId].name,
        loserName: state.players[winnerId === 0 ? 1 : 0].name,
        turns: state.turnCount,
        completedTasks: state.completedTasks,
        rejectedTasks: state.rejectedTasks,
        themeNames: state.players.map(p =>
          state.themes.find(t => t.id === p.themeId)?.name || '未选择'
        ),
        intimacyEarned: state.completedTasks * 10 + 20,
        durationSeconds: state.startedAt
          ? Math.max(1, Math.round((Date.now() - state.startedAt) / 1000))
          : 0
      }
    : null;

  if (!isUnlocked) {
    return <LocalPasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-dvh w-full overflow-x-hidden overflow-y-auto flex justify-center bg-black text-white">
      <div className="fixed inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_rgba(10,132,255,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(255,55,95,0.16),_transparent_34%),linear-gradient(135deg,#111113_0%,#000000_55%,#171119_100%)]" />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      </div>

      <div className="tablet-shell relative z-10 w-full min-h-dvh max-w-[920px] flex flex-col bg-black/20">
        <header className="pt-[calc(env(safe-area-inset-top)+2rem)] pb-2 px-6 sm:px-8 lg:px-10 shrink-0 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Couple's Game
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">情侣飞行棋</h1>
          </div>
        </header>

        <main className="flex-1 min-h-0 relative overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col overflow-y-auto no-scrollbar px-6 sm:px-8 lg:px-10 pt-6 sm:pt-10 pb-28 transition-all duration-500 ease-in-out ${
              state.view === 'home'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none -translate-x-full'
            }`}
          >
            <HomeView
              players={state.players}
              themes={state.themes}
              onSelectTheme={handleSelectTheme}
              onEditProfile={handleEditProfile}
              onStartGame={handleStartGame}
              hasInProgressGame={hasInProgressGame}
              onResumeGame={handleResumeGame}
            />
          </div>

          <div
            className={`absolute inset-0 flex flex-col min-h-0 overflow-y-auto no-scrollbar px-6 sm:px-8 lg:px-10 pt-4 pb-28 transition-all duration-500 ease-in-out ${
              state.view === 'themes'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none translate-x-full'
            }`}
          >
            <ThemesView
              themes={state.themes}
              onCreateTheme={() => setIsCreateThemeModalOpen(true)}
              onEditTheme={themeId => setEditingThemeId(themeId)}
            />
          </div>

          <div
            className={`absolute inset-0 flex flex-col min-h-0 overflow-y-auto no-scrollbar px-6 sm:px-8 lg:px-10 pt-4 pb-28 transition-all duration-500 ease-in-out ${
              state.view === 'stats'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none -translate-x-full'
            }`}
          >
            <StatsView
              stats={stats}
              players={state.players}
              onClearHistory={clearHistory}
              onResetIntimacy={resetIntimacy}
            />
          </div>

          <div
            className={`absolute inset-0 flex flex-col overflow-y-auto no-scrollbar px-6 sm:px-8 lg:px-10 pt-4 pb-28 transition-all duration-500 ease-in-out ${
              state.view === 'settings'
                ? 'translate-x-0 opacity-100'
                : 'opacity-0 pointer-events-none translate-x-full'
            }`}
          >
            <SettingsView
              hasPassword={hasPassword}
              onSavePassword={handleSavePassword}
              onRemovePassword={handleRemovePassword}
              onLock={handleLock}
            />
          </div>
        </main>

        <BottomNav activeView={state.view} onNavigate={handleNavigate} />
      </div>

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        themes={selectableThemes}
        selectedThemeId={selectedPlayer?.themeId || null}
        onSelect={handleThemeSelect}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <PlayerProfileModal
        isOpen={isProfileModalOpen}
        player={editingPlayer}
        onSave={updatePlayerProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <TaskCardModal
        isOpen={!!taskData}
        taskData={taskData}
        onAccept={handleTaskAccept}
        onReject={handleTaskReject}
      />

      <WinModal
        isOpen={!!winnerId}
        winnerName={winnerId !== null ? state.players[winnerId].name : ''}
        winnerAvatar={winnerAvatar}
        report={matchReport}
        onRestart={() => {
          resetGame();
          setWinnerId(null);
        }}
      />

      <ThemeCreateModal
        isOpen={isCreateThemeModalOpen}
        onClose={() => setIsCreateThemeModalOpen(false)}
        onCreate={input => {
          const id = createTheme(input);
          setIsCreateThemeModalOpen(false);
          if (id) setEditingThemeId(id);
        }}
      />

      <ThemeEditorModal
        isOpen={!!editingThemeId}
        theme={editingThemeId ? state.themes.find(t => t.id === editingThemeId) || null : null}
        onClose={() => {
          setEditingThemeId(null);
          setAiImportThemeId(null);
        }}
        onSaveMeta={(themeId, patch) => updateThemeMeta(themeId, patch)}
        onAddTask={(themeId, taskText) => addThemeTask(themeId, taskText)}
        onRemoveTask={(themeId, index) => removeThemeTask(themeId, index)}
        onOpenAiImport={themeId => setAiImportThemeId(themeId)}
      />

      <AiImportModal
        isOpen={!!aiImportThemeId}
        themeName={aiImportThemeId ? state.themes.find(t => t.id === aiImportThemeId)?.name || '' : ''}
        onClose={() => setAiImportThemeId(null)}
        onImport={(tasks, mode) => {
          if (!aiImportThemeId) return;
          importThemeTasks(aiImportThemeId, tasks, mode);
        }}
      />

      {gameStartPhase !== 'idle' && (
        <div
          className={`fixed inset-0 z-[180] flex items-center justify-center px-6 bg-black/90 backdrop-blur-md ${
            gameStartPhase === 'enter' ? 'animate-modal-fade' : 'start-exit'
          }`}
        >
          <div className="w-full max-w-md ios-glass rounded-[32px] border border-white/10 p-8 text-center shadow-2xl">
            <div className="flex items-center justify-center gap-6 mb-7">
              <div
                className="start-avatar-left w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 border-white/20 shadow-xl"
                style={{ backgroundColor: state.players[0].color }}
              >
                {getAvatarEmoji(state.players[0].avatar, state.players[0].role)}
              </div>
              <div className="start-heart">
                <Heart className="text-[#FF375F] heart-throb" size={38} fill="currentColor" />
              </div>
              <div
                className="start-avatar-right w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2 border-white/20 shadow-xl"
                style={{ backgroundColor: state.players[1].color }}
              >
                {getAvatarEmoji(state.players[1].avatar, state.players[1].role)}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white">游戏开始</h2>
            <p className="text-sm text-gray-400 mt-2">今晚的飞行棋之旅开始了</p>

            <div className="mt-6 flex flex-col gap-2">
              {state.players.map(player => {
                const themeName = state.themes.find(t => t.id === player.themeId)?.name || '未选择';
                return (
                  <div
                    key={player.id}
                    className="start-theme-tag flex items-center justify-between bg-white/5 rounded-2xl border border-white/10 px-4 py-3"
                  >
                    <span className="text-sm font-bold text-white">{player.name}</span>
                    <span className="text-xs text-gray-400">{themeName}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="start-bar h-full rounded-full bg-gradient-to-r from-[#FF2D55] to-[#FF9F0A]" />
            </div>
          </div>
        </div>
      )}

      <StartGameAlertModal
        isOpen={isStartGameAlertOpen}
        onClose={() => setIsStartGameAlertOpen(false)}
      />

      <ExitConfirmModal

        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={handleConfirmLeave}
      />

      {state.view === 'game' && (
        <GameView
          players={state.players}
          boardMap={state.boardMap}
          pathCoords={state.pathCoords}
          currentTurn={state.turn}
          isRolling={state.isRolling}
          onMove={movePlayer}
          onCheckTile={checkTile}
          onEndTurn={endTurn}
          onSetRolling={setIsRolling}
          onWin={handleWin}
          onTaskTrigger={handleTaskTrigger}
          onBack={handleBackFromGame}
        />
      )}
    </div>
  );
}

export default App;
