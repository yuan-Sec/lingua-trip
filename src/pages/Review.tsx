import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import { SCENARIOS } from '../data/scenarios';
import type { Vocab } from '../types';

interface Props {
  onClose: () => void;
}

export default function ReviewModal({ onClose }: Props) {
  const app = useStore((s) => s.app);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const pool = useMemo<Vocab[]>(() => {
    // 从已完成场景或当前语言场景取词
    const doneScenes = SCENARIOS.filter(
      (s) => app.passport.scenesCompleted.includes(s.id) && s.langId === app.lang
    );
    const source = doneScenes.length > 0 ? doneScenes : SCENARIOS.filter((s) => s.langId === app.lang);
    const all = source.flatMap((s) => s.words);
    // 简单随机洗牌取 3 个
    return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [app.lang, app.passport.scenesCompleted]);

  const current = pool[idx];
  const options = useMemo(() => {
    if (!current) return [];
    const others = pool.filter((w) => w.id !== current.id);
    return [...others, current].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [current, pool]);

  useEffect(() => {
    if (!current) {
      // 无词可复习
      const t = setTimeout(onClose, 1500);
      return () => clearTimeout(t);
    }
  }, [current, onClose]);

  function choose(id: string) {
    if (picked) return;
    setPicked(id);
    if (id === current.id) setCorrect((c) => c + 1);
    setTimeout(() => {
      setPicked(null);
      if (idx + 1 >= 3) {
        setDone(true);
      } else {
        setIdx((i) => i + 1);
      }
    }, 700);
  }

  if (done) {
    const pass = correct >= 2;
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-6 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-pop animate-pop">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-4xl">
            {pass ? '🎉' : '💪'}
          </div>
          <h3 className="mt-3 text-lg font-bold text-ink">
            {pass ? '复习完成！记忆已加固' : '没关系，随时再回来'}
          </h3>
          <p className="mt-1 text-sm text-ink/55">
            答对 {correct}/3 题 · {pass ? '奖励 1 枚精灵加速券 🎟️' : '回忆是最好的复习'}
          </p>
          <div className="mt-4 flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-2xl bg-ink/5 py-3 text-sm font-semibold text-ink/60 active:scale-95">
              关闭
            </button>
            <button onClick={onClose} className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-float active:scale-95">
              {pass ? '继续学习' : '再试一次'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-6 backdrop-blur-sm">
        <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-pop">
          <p className="text-sm text-ink/60">正在准备复习题…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-pop animate-slide-up sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-ink">⚡ 快速复习</h3>
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink/50">{idx + 1}/3</span>
        </div>

        {/* 进度条 */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper">
          <div className="h-full rounded-full bg-skyblue transition-all duration-500" style={{ width: `${((idx + 1) / 3) * 100}%` }} />
        </div>

        <div className="mt-6 text-center">
          <span className="text-4xl">{current.emoji}</span>
          <p className="mt-2 text-lg font-bold text-ink">{current.zh} 用 {app.lang === 'ja' ? '日语' : app.lang === 'ko' ? '韩语' : '英语'}怎么说？</p>
        </div>

        <div className="mt-5 space-y-2.5">
          {options.map((o) => {
            const isPicked = picked === o.id;
            const isRight = o.id === current.id;
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.98] ${
                  picked === null
                    ? 'border-line bg-white'
                    : isRight
                      ? 'border-green-500 bg-green-50'
                      : isPicked
                        ? 'border-coral bg-coral-soft'
                        : 'border-line bg-white opacity-50'
                }`}
              >
                <span className="text-[15px] font-semibold text-ink">{o.target}</span>
                <span className="text-xs text-ink/45">{o.romaji}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[11px] text-ink/40">答对 2 题即可继续，错了也没关系</p>
      </div>
    </div>
  );
}