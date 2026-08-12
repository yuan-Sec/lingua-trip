import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Badge, PassportState } from './types';

// 徽章定义
export const BADGES: Badge[] = [
  { id: 'first-dialog', name: '首次对话', emoji: '🎙️', desc: '完成第一次 AI 场景对话' },
  { id: 'bronze-traveler', name: '青铜旅行者', emoji: '🥉', desc: '完成 1 个场景，护照盖上第一枚邮戳' },
  { id: 'silver-traveler', name: '白银旅行者', emoji: '🥈', desc: '完成 5 个场景' },
  { id: 'word-collector', name: '词汇收藏家', emoji: '📚', desc: '掌握 20 个词汇' },
  { id: 'spirit-hunter', name: '精灵猎人', emoji: '🦋', desc: '收集 6 个文化精灵' },
  { id: 'perfect-voice', name: '完美发音', emoji: '🎯', desc: '获得 90 分以上发音' },
  { id: 'explorer', name: '文化探索家', emoji: '🧭', desc: '体验全部 3 种语言' },
];

export const BADGE_MAP: Record<string, Badge> = Object.fromEntries(
  BADGES.map((b) => [b.id, b])
);

function computeBadges(p: PassportState): string[] {
  const badges = new Set(p.badges);
  if (p.scenesCompleted.length >= 1) badges.add('bronze-traveler');
  if (p.scenesCompleted.length >= 5) badges.add('silver-traveler');
  if (p.wordsMastered.length >= 20) badges.add('word-collector');
  if (p.spiritsCollected.length >= 6) badges.add('spirit-hunter');
  if (p.bestAccuracy >= 90) badges.add('perfect-voice');
  if (p.totalDialogs >= 1) badges.add('first-dialog');
  if (p.scenesCompleted.some((id) => id.startsWith('ja-')) &&
      p.scenesCompleted.some((id) => id.startsWith('ko-')) &&
      p.scenesCompleted.some((id) => id.startsWith('en-'))) badges.add('explorer');
  return [...badges];
}

const INITIAL: AppState = {
  onboarded: false,
  lang: 'ja',
  name: '旅行者',
  passport: {
    scenesCompleted: [],
    stamps: [],
    spiritsCollected: [],
    wordsMastered: [],
    badges: [],
    bestAccuracy: 0,
    activeDays: 1,
    totalDialogs: 0,
  },
  lastVisit: new Date().toISOString().slice(0, 10),
  reducedMotion: false,
};

interface Store {
  app: AppState;
  onboard: (lang: 'ja' | 'ko' | 'en', name: string) => void;
  completeScene: (sceneId: string, spiritIds: string[], wordIds: string[]) => void;
  collectSpirit: (spiritId: string) => void;
  recordAccuracy: (score: number) => void;
  addDialog: () => void;
  resetAll: () => void;
  setLang: (lang: 'ja' | 'ko' | 'en') => void;
  toggleMotion: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      app: INITIAL,
      onboard: (lang, name) =>
        set((s) => ({ app: { ...s.app, onboarded: true, lang, name } })),
      completeScene: (sceneId, spiritIds, wordIds) =>
        set((s) => {
          const p = s.app.passport;
          const scenesCompleted = p.scenesCompleted.includes(sceneId)
            ? p.scenesCompleted
            : [...p.scenesCompleted, sceneId];
          const stamps = p.stamps.includes(sceneId) ? p.stamps : [...p.stamps, sceneId];
          const wordsMastered = [...new Set([...p.wordsMastered, ...wordIds])];
          const spiritsCollected = [...new Set([...p.spiritsCollected, ...spiritIds])];
          const passport: PassportState = {
            ...p,
            scenesCompleted,
            stamps,
            wordsMastered,
            spiritsCollected,
            badges: computeBadges({ ...p, scenesCompleted, stamps, wordsMastered, spiritsCollected }),
          };
          return {
            app: {
              ...s.app,
              passport,
              lastVisit: new Date().toISOString().slice(0, 10),
            },
          };
        }),
      collectSpirit: (spiritId) =>
        set((s) => {
          const p = s.app.passport;
          if (p.spiritsCollected.includes(spiritId)) return { app: s.app };
          const spiritsCollected = [...p.spiritsCollected, spiritId];
          return {
            app: {
              ...s.app,
              passport: {
                ...p,
                spiritsCollected,
                badges: computeBadges({ ...p, spiritsCollected }),
              },
            },
          };
        }),
      recordAccuracy: (score) =>
        set((s) => {
          const p = s.app.passport;
          const bestAccuracy = Math.max(p.bestAccuracy, score);
          return {
            app: {
              ...s.app,
              passport: {
                ...p,
                bestAccuracy,
                badges: computeBadges({ ...p, bestAccuracy }),
              },
            },
          };
        }),
      addDialog: () =>
        set((s) => {
          const p = s.app.passport;
          const totalDialogs = p.totalDialogs + 1;
          return {
            app: {
              ...s.app,
              passport: {
                ...p,
                totalDialogs,
                badges: computeBadges({ ...p, totalDialogs }),
              },
            },
          };
        }),
      resetAll: () => set({ app: { ...INITIAL } }),
      setLang: (lang) => set((s) => ({ app: { ...s.app, lang } })),
      toggleMotion: () =>
        set((s) => ({ app: { ...s.app, reducedMotion: !s.app.reducedMotion } })),
    }),
    { name: 'lingua-trip-storage' }
  )
);