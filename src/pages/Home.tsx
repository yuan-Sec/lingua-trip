import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { LANGUAGES, CITIES } from '../data/cities';
import { SCENARIOS } from '../data/scenarios';
import type { Scenario } from '../types';
import ProgressRing from '../components/ProgressRing';

interface Props {
  onOpenScene: (scene: Scenario) => void;
  onOpenReview: () => void;
}

export default function Home({ onOpenScene, onOpenReview }: Props) {
  const app = useStore((s) => s.app);
  const setLang = useStore((s) => s.setLang);
  const [showAll, setShowAll] = useState(false);

  const scenes = useMemo(() => SCENARIOS.filter((s) => s.langId === app.lang), [app.lang]);
  const done = useMemo(
    () => scenes.filter((s) => app.passport.scenesCompleted.includes(s.id)),
    [scenes, app.passport.scenesCompleted]
  );
  const langInfo = LANGUAGES.find((l) => l.id === app.lang)!;
  const cityInfo = CITIES.find((c) => c.langId === app.lang)!;
  const wordPct = Math.min(100, Math.round((app.passport.wordsMastered.length / 150) * 100));
  const spiritPct = Math.min(100, Math.round((app.passport.spiritsCollected.length / langInfo.spiritTotal) * 100));

  return (
    <div className="paper-texture min-h-screen px-5 pb-32 pt-8">
      {/* 顶部 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-ink/45">你好，{app.name}</p>
          <h1 className="mt-0.5 text-2xl font-bold text-ink">我的学习护照</h1>
        </div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/60 shadow-card">
          🔥 活跃 {app.passport.activeDays} 天
        </span>
      </div>

      {/* 护照封面 */}
      <div className="mt-5 rounded-3xl bg-gradient-to-br from-[#FF8C42] via-[#FFA45C] to-[#FF6B6B] p-5 text-white shadow-float">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">Learning Passport</p>
            <h2 className="mt-1 text-xl font-bold tracking-wide">正在学习 {langInfo.name}</h2>
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              <span className="rounded-lg bg-white/20 px-2 py-0.5">{cityInfo.emoji} {cityInfo.name}</span>
              <span className="opacity-85">第 {app.passport.activeDays} 天</span>
            </div>
          </div>
          <div className="text-5xl opacity-50">{cityInfo.landmark}</div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Metric label="掌握词汇" value={app.passport.wordsMastered.length} target="150" />
          <Metric label="应对场景" value={app.passport.scenesCompleted.length} target="30" />
          <Metric label="文化精灵" value={app.passport.spiritsCollected.length} target={langInfo.spiritTotal} />
        </div>

        {/* 语言切换 */}
        <div className="mt-4 flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                app.lang === l.id ? 'bg-white text-primary shadow' : 'bg-white/20 text-white/90'
              }`}
            >
              {l.flag} {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* 场景卡片 */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">
            {showAll ? '全部场景' : '今日推荐场景'}
            <span className="ml-1.5 text-xs font-normal text-ink/40">{done.length}/{scenes.length} 已完成</span>
          </h3>
          <button onClick={() => setShowAll((v) => !v)} className="text-xs font-semibold text-skyblue">
            {showAll ? '收起' : '全部场景 →'}
          </button>
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {scenes.map((s) => {
            const isDone = app.passport.scenesCompleted.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onOpenScene(s)}
                className="min-w-[180px] shrink-0 rounded-3xl bg-white p-4 text-left shadow-card transition-all active:scale-[0.97]"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-2xl">{s.emoji}</span>
                  {isDone ? (
                    <span className="text-sm">✅</span>
                  ) : (
                    <span className="rounded-full bg-skyblue-soft px-2 py-0.5 text-[10px] font-semibold text-skyblue">{s.minutes}分钟</span>
                  )}
                </div>
                <p className="mt-2.5 text-[15px] font-semibold text-ink">{s.title}</p>
                <p className="mt-0.5 truncate text-xs text-ink/50">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 快速复习入口 */}
      <button
        onClick={onOpenReview}
        className="mt-4 flex w-full items-center justify-between rounded-3xl border-2 border-dashed border-skyblue/40 bg-white/70 px-5 py-4 transition-all active:scale-[0.98]"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-skyblue-soft text-xl">⚡</span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-ink">5 分钟快速复习</span>
            <span className="block text-xs text-ink/50">欢迎回来！为你准备了低压回忆测验</span>
          </span>
        </span>
        <span className="text-lg text-skyblue">→</span>
      </button>

      {/* 进度双环 */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card">
          <ProgressRing value={wordPct} color="#4B7BFF" size={64} stroke={6} label={`${app.passport.wordsMastered.length}`} />
          <div>
            <p className="text-xs text-ink/50">词汇掌握</p>
            <p className="text-sm font-bold text-ink">/150 生存词汇</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-card">
          <ProgressRing value={spiritPct} color="#FF8C42" size={64} stroke={6} label={`${app.passport.spiritsCollected.length}`} />
          <div>
            <p className="text-xs text-ink/50">精灵收集</p>
            <p className="text-sm font-bold text-ink">/{langInfo.spiritTotal} 只</p>
          </div>
        </div>
      </div>

      {/* 已解锁技能 */}
      <div className="mt-5 rounded-3xl bg-white p-4 shadow-card">
        <p className="text-sm font-semibold text-ink/50">已解锁技能</p>
        {done.length === 0 ? (
          <p className="mt-2 text-sm text-ink/45">完成第一个场景，解锁你的专属技能 🚀</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {done.map((s) => (
              <span key={s.id} className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
                {s.emoji} {s.title} ✅
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, target }: { label: string; value: number; target: number | string }) {
  return (
    <div className="rounded-2xl bg-white/15 px-2 py-2.5 text-center backdrop-blur-sm">
      <p className="font-display text-lg font-bold leading-none">
        {value}
        <span className="text-[10px] font-normal opacity-75">/{target}</span>
      </p>
      <p className="mt-1 text-[10px] opacity-85">{label}</p>
    </div>
  );
}