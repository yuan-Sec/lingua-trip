import { useState } from 'react';
import { useStore } from '../store';

interface Props {
  onPick: (lang: 'ja' | 'ko' | 'en', sceneId: string) => void;
}

const PICKS = [
  { lang: 'ja' as const, sceneId: 'ja-conveni', emoji: '🏪', title: '在东京便利店买饮料', sub: '深夜的东京便利店，买一瓶水', flag: '🇯🇵', color: '#E04A4A' },
  { lang: 'ko' as const, sceneId: 'ko-cafe', emoji: '☕', title: '在首尔咖啡店点咖啡', sub: '街角咖啡店，点一杯拿铁', flag: '🇰🇷', color: '#4A90E2' },
  { lang: 'en' as const, sceneId: 'en-airport', emoji: '✈️', title: '随机挑战', sub: '让命运决定你的第一站', flag: '🎲', color: '#6C5CE7' },
];

export default function Onboarding({ onPick }: Props) {
  const [step, setStep] = useState(0);
  const onboard = useStore((s) => s.onboard);

  return (
    <div className="paper-texture flex min-h-screen flex-col px-6 pb-10 pt-16">
      {/* 顶部品牌 */}
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-3xl shadow-float animate-float-slow">
          🌍
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-wide text-ink">
          LinguaTrip <span className="text-primary">语旅</span>
        </h1>
        <p className="mt-1 text-sm text-ink/60">不是背单词，是体验世界</p>
      </div>

      {/* 向导 Kiro */}
      <div className="mt-8 rounded-3xl bg-white p-5 shadow-card animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-skyblue-soft text-2xl">
            🤖
          </div>
          <div>
            <p className="text-[11px] font-medium text-skyblue">学习向导 · Kiro</p>
            <p className="mt-1 text-[15px] leading-relaxed text-ink">
              {step === 0
                ? '你好！我是你的学习向导 Kiro 🎒 30 秒就能完成你的第一次外语对话，不用注册，不用考试。'
                : '太棒了！现在选一个你感兴趣的体验，我们马上出发！'}
            </p>
          </div>
        </div>
      </div>

      {step === 0 ? (
        <div className="mt-6 animate-fade-in">
          <button
            onClick={() => setStep(1)}
            className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-float active:scale-95"
          >
            开始体验 →
          </button>
          <p className="mt-3 text-center text-xs text-ink/40">全程约 3 分钟 · 无需注册 · 学习进度本地保存</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3 animate-fade-in">
          <p className="text-sm font-semibold text-ink/70">🎯 你想先体验什么？</p>
          {PICKS.map((p, i) => (
            <button
              key={p.sceneId}
onClick={() => {
                onboard(p.lang, '学习者');
                const id = p.sceneId;
                onPick(p.lang, id);
              }}
              className="group flex w-full items-center gap-4 rounded-2xl border-2 border-line bg-white p-4 text-left transition-all active:scale-[0.98] hover:border-primary"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ backgroundColor: `${p.color}1A` }}
              >
                {p.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-ink">
                  {p.flag} {p.title}
                </span>
                <span className="mt-0.5 block text-xs text-ink/50">{p.sub}</span>
              </span>
              <span className="text-lg text-line group-hover:text-primary">→</span>
            </button>
          ))}
        </div>
      )}

      {/* 信任背书 */}
      <div className="mt-auto pt-8">
        <div className="flex items-center justify-center gap-2 text-xs text-ink/40">
          <span>🏅 第 1 天就能说出 3 句高频句</span>
          <span>·</span>
          <span>🧭 30 天解锁 10 个真实场景</span>
        </div>
      </div>
    </div>
  );
}