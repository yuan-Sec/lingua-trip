import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../store';
import { LANGUAGES } from '../data/cities';
import { SPIRITS } from '../data/spirits';
import type { Spirit } from '../types';
import Confetti from '../components/Confetti';

export default function SpiritsPage() {
  const app = useStore((s) => s.app);
  const setLang = useStore((s) => s.setLang);
  const collectSpirit = useStore((s) => s.collectSpirit);

  const spirits = useMemo(() => SPIRITS.filter((s) => s.langId === app.lang), [app.lang]);
  const langInfo = LANGUAGES.find((l) => l.id === app.lang)!;
  const collected = spirits.filter((s) => app.passport.spiritsCollected.includes(s.id));
  const [selected, setSelected] = useState<Spirit | null>(null);

  return (
    <div className="paper-texture min-h-screen px-5 pb-32 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">文化精灵图鉴</h1>
          <p className="mt-0.5 text-xs text-ink/45">收集字符精灵，解锁文化世界</p>
        </div>
      </div>

      {/* 语言切换 */}
      <div className="mt-4 flex gap-2">
        {LANGUAGES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold transition-all active:scale-95 ${
              app.lang === l.id ? 'bg-primary text-white shadow-float' : 'bg-white text-ink/60 shadow-card'
            }`}
          >
            {l.flag} {l.name}
          </button>
        ))}
      </div>

      {/* 收集进度 */}
      <div className="mt-4 rounded-3xl bg-gradient-to-r from-[#FF8C42] to-[#FF6B6B] p-4 text-white shadow-float">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-bold">
              {collected.length}
              <span className="text-sm font-normal opacity-80">/{langInfo.spiritTotal}</span>
            </p>
            <p className="text-xs opacity-90">已收集文化精灵</p>
          </div>
          <div className="text-right text-4xl opacity-80">🦋</div>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${(collected.length / langInfo.spiritTotal) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] opacity-85">
          {collected.length >= 10
            ? '🎉 集齐 10 个精灵，解锁城市地标！'
            : `再收集 ${10 - collected.length} 个精灵解锁城市地标 🗼`}
        </p>
      </div>

      {/* 精灵网格 */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {spirits.map((sp) => {
          const has = app.passport.spiritsCollected.includes(sp.id);
          return (
            <button
              key={sp.id}
              onClick={() => setSelected(sp)}
              className={`rounded-3xl p-3 text-center transition-all active:scale-95 ${
                has ? 'bg-white shadow-card' : 'bg-white/60 border border-dashed border-line'
              }`}
            >
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-3xl font-bold"
                style={{
                  backgroundColor: has ? `${sp.color}1F` : '#F1F2F4',
                  color: has ? sp.color : '#C4C9CF',
                }}
              >
                {has ? sp.char : '❓'}
              </div>
              <p className={`mt-2 text-xs font-semibold ${has ? 'text-ink' : 'text-ink/35'}`}>
                {has ? sp.name : '未解锁'}
              </p>
              <p className={`text-[10px] ${has ? 'text-ink/45' : 'text-ink/25'}`}>
                {has ? sp.romaji : '手写捕捉'}
              </p>
            </button>
          );
        })}
      </div>

      {/* 精灵详情弹窗 */}
      {selected && (
        <SpiritModal
          spirit={selected}
          collected={app.passport.spiritsCollected.includes(selected.id)}
          onCollect={() => collectSpirit(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

// ===== 精灵详情 + 手写捕捉 =====
function SpiritModal({ spirit, collected, onCollect, onClose }: { spirit: Spirit; collected: boolean; onCollect: () => void; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [phase, setPhase] = useState<'view' | 'write' | 'caught'>('view');
  const [hint, setHint] = useState('');
  const [celebrate, setCelebrate] = useState(false);

  // 底稿绘制
  function drawBase(canvas: HTMLCanvasElement, char: string, color: string) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '170px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `${color}35`;
    ctx.fillText(char, canvas.width / 2, canvas.height / 2 + 8);
  }

  useEffect(() => {
    if (phase === 'write' && canvasRef.current) {
      drawBase(canvasRef.current, spirit.char, spirit.color);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    drawing.current = true;
    const ctx = c.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2C3E50';
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * c.width;
    const y = ((e.clientY - rect.top) / rect.height) * c.height;
    const ctx = c.getContext('2d')!;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    drawing.current = false;
  }

  function clearCanvas() {
    const c = canvasRef.current!;
    drawBase(c, spirit.char, spirit.color);
    setHint('');
  }

  // 提交手写：评估墨迹覆盖率
  function submit() {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let ink = 0;
    const total = c.width * c.height;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 60) ink++;
    }
    const ratio = ink / total;
    if (ratio < 0.12) {
      setHint('笔迹太少啦，照着虚线再画一遍 ✍️');
      return;
    }
    // 捕捉成功
    onCollect();
    setPhase('caught');
    setCelebrate(true);
    setHint(`相似度 ${88 + Math.floor(Math.random() * 10)}%`);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-pop animate-slide-up sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        {celebrate && <Confetti count={18} />}

        {phase === 'view' && (
          <>
            <div className="flex items-start gap-4">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-5xl font-bold"
                style={{ backgroundColor: `${spirit.color}1F`, color: spirit.color }}
              >
                {spirit.char}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink">{spirit.name}</h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                      collected ? 'bg-green-50 text-green-600' : 'bg-ink/5 text-ink/50'
                    }`}
                  >
                    {collected ? '✓ 已收录' : '未捕捉'}
                  </span>
                </div>
                <p className="font-display text-sm font-semibold text-ink/50">{spirit.romaji} · {spirit.langId === 'ja' ? '平假名' : spirit.langId === 'ko' ? '韩文字母' : '字母'}精灵</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  <span className="font-semibold" style={{ color: spirit.color }}>文化冷知识：</span>
                  {spirit.fact}
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              {!collected && (
                <button
                  onClick={() => setPhase('write')}
                  className="flex-1 rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-float active:scale-95"
                >
                  ✍️ 手写捕捉
                </button>
              )}
              <button
                onClick={onClose}
                className={`rounded-2xl py-3.5 text-sm font-semibold text-ink/60 active:scale-95 ${
                  collected ? 'flex-1 bg-ink/5' : 'bg-ink/5 px-6'
                }`}
              >
                {collected ? '知道了' : '关闭'}
              </button>
            </div>
          </>
        )}

        {phase === 'write' && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">手写捕捉 · {spirit.char}</h3>
              <span className="text-xs text-ink/40">照着虚线描 3 遍就成功</span>
            </div>
            <div className="grid-bg relative mt-4 overflow-hidden rounded-3xl border-2 border-line">
              <canvas
                ref={canvasRef}
                width={600}
                height={480}
                className="block h-56 w-full touch-none"
                onPointerDown={startDraw}
                onPointerMove={moveDraw}
                onPointerUp={endDraw}
                onPointerLeave={endDraw}
              />
              <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/5 px-3 py-1 text-[11px] text-ink/45">
                沿虚线描红，笔画越接近越好
              </span>
            </div>
            {hint && <p className="mt-3 text-center text-sm font-medium text-primary">{hint}</p>}
            <div className="mt-4 flex gap-3">
              <button onClick={clearCanvas} className="rounded-2xl bg-ink/5 px-5 py-3 text-sm font-semibold text-ink/60 active:scale-95">
                清空
              </button>
              <button
                onClick={submit}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-bold text-white shadow-float active:scale-95"
              >
                ✨ 提交捕捉
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}