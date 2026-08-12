import { useMemo, useState } from 'react';
import { useStore, BADGES } from '../store';
import { LANGUAGES, CITIES } from '../data/cities';
import { SCENARIOS } from '../data/scenarios';

interface Props {
  onShare: () => void;
}

export default function PassportPage({ onShare }: Props) {
  const app = useStore((s) => s.app);
  const [open, setOpen] = useState(true); // 护照翻开状态

  const langInfo = LANGUAGES.find((l) => l.id === app.lang)!;
  const cityInfo = CITIES.find((c) => c.langId === app.lang)!;
  const langScenes = useMemo(() => SCENARIOS.filter((s) => s.langId === app.lang), [app.lang]);
  const doneCount = langScenes.filter((s) => app.passport.scenesCompleted.includes(s.id)).length;

  const allDone = app.passport.scenesCompleted.length;
  const allWords = app.passport.wordsMastered.length;
  const allSpirits = app.passport.spiritsCollected.length;

  const ownedBadges = app.passport.badges;
  const unlocked = BADGES.filter((b) => ownedBadges.includes(b.id));
  const locked = BADGES.filter((b) => !ownedBadges.includes(b.id));

  return (
    <div className="paper-texture min-h-screen px-5 pb-32 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">我的能力护照</h1>
          <p className="mt-0.5 text-xs text-ink/45">每一枚邮戳，都是一次真实的对话</p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full bg-white px-3.5 py-2 text-xs font-semibold text-ink/60 shadow-card active:scale-95"
        >
          {open ? '合上护照' : '翻开护照'}
        </button>
      </div>

      {/* 护照本体 */}
      <div className="perspective-scene mt-5">
        <div className="passport-3d relative rounded-3xl bg-gradient-to-br from-[#2C3E50] to-[#1a2733] p-6 text-white shadow-pop" style={{ transform: open ? 'rotateY(4deg)' : 'none' }}>
          {/* 封面 */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-white/60">Passport</p>
              <p className="mt-0.5 font-display text-xl font-bold tracking-widest">LINGUA</p>
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-white/80">TRIP 语旅</p>
            </div>
            <span className="text-4xl opacity-70">🛂</span>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-80">持有者</span>
              <span className="font-semibold">{app.name}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="opacity-80">目的地</span>
              <span className="font-semibold">{cityInfo.emoji} {cityInfo.name} · {langInfo.name}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="opacity-80">开启日期</span>
              <span className="font-semibold">{app.lastVisit}</span>
            </div>
          </div>

          {/* 能力签证 */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Visa label="词汇" value={allWords} target={500} />
            <Visa label="场景" value={allDone} target={30} />
            <Visa label="精灵" value={allSpirits} target={46} />
          </div>

          {/* 邮戳区 */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-widest text-white/50">Scenes Completed</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {langScenes.map((s) => {
                const has = app.passport.scenesCompleted.includes(s.id);
                return has ? (
                  <span key={s.id} className="stamp flex h-14 w-14 flex-col items-center justify-center text-[9px] font-bold">
                    <span className="text-xl">{s.emoji}</span>
                    <span className="mt-0.5">完成</span>
                  </span>
                ) : (
                  <span key={s.id} className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-white/25 text-lg opacity-30">
                    {s.emoji}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-xs backdrop-blur-sm">
            <span className="opacity-80">{cityInfo.name} 进度</span>
            <span className="font-display text-base font-bold">
              {doneCount}<span className="opacity-60">/{langScenes.length}</span>
            </span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-[#FF8C42]" style={{ width: `${(doneCount / langScenes.length) * 100}%` }} />
            </div>
          </div>

<p className="mt-3 text-center text-[11px] text-white/50">
            下一站：{langInfo.name === '日语' ? '大阪' : langInfo.name === '韩语' ? '釜山' : '巴黎'} · 完成 2 个场景解锁
          </p>
        </div>
      </div>

      {/* 学习成就 */}
      <div className="mt-6">
        <h3 className="text-base font-bold text-ink">学习成就</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {unlocked.map((b) => (
            <div key={b.id} className="rounded-3xl bg-white p-3 text-center shadow-card">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-2xl">{b.emoji}</span>
              <p className="mt-2 text-xs font-bold text-ink">{b.name}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-ink/45">{b.desc}</p>
            </div>
          ))}
          {locked.slice(0, Math.max(0, 3 - unlocked.length)).map((b) => (
            <div key={b.id} className="rounded-3xl border border-dashed border-line p-3 text-center opacity-45">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-2xl grayscale">🔒</span>
              <p className="mt-2 text-xs font-semibold text-ink/50">{b.name}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-ink/35">{b.desc}</p>
            </div>
          ))}
        </div>

        {/* 更多徽章列表 */}
        <div className="mt-3 rounded-3xl bg-white p-4 shadow-card">
          <p className="text-xs font-semibold text-ink/50">全部徽章（{ownedBadges.length}/{BADGES.length}）</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BADGES.map((b) => {
              const has = ownedBadges.includes(b.id);
              return (
                <span
                  key={b.id}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    has ? 'bg-primary-soft text-primary' : 'bg-paper text-ink/35'
                  }`}
                >
                  {b.emoji} {b.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* 分享按钮 */}
      <div className="mt-5 space-y-3">
        <button
          onClick={onShare}
          className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-float active:scale-95"
        >
          📤 生成学习回顾 · 分享我的护照
        </button>
        <p className="text-center text-[11px] text-ink/40">
          🎬 第 30 天将自动生成你的学习回顾视频
        </p>
      </div>
    </div>
  );
}

function Visa({ label, value, target }: { label: string; value: number; target: number }) {
  return (
    <div className="rounded-2xl bg-white/10 px-2 py-2.5 text-center backdrop-blur-sm">
      <p className="font-display text-lg font-bold leading-none">
        {value}
        <span className="text-[10px] font-normal opacity-70">/{target}</span>
      </p>
      <p className="mt-1 text-[10px] opacity-85">{label}</p>
    </div>
  );
}