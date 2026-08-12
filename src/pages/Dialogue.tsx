import { useEffect, useMemo, useRef, useState } from 'react';
import type { Scenario } from '../types';
import { useStore } from '../store';
import { speak, mockAccuracy } from '../utils/tts';
import WaveBars from '../components/WaveBars';
import ScoreModal from '../components/ScoreModal';
import Confetti from '../components/Confetti';

interface Props {
  scene: Scenario;
  onExit: () => void;
  onDone: (accuracy: number) => void;
}

type Phase = 'intro' | 'chat' | 'done';

interface Msg {
  speaker: 'ai' | 'user' | 'narrator';
  target?: string;
  romaji?: string;
  zh: string;
}

export default function DialoguePage({ scene, onExit, onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [nodeId, setNodeId] = useState(0);
  const [history, setHistory] = useState<Msg[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [score, setScore] = useState<{ value: number; attempt: number } | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [accSum, setAccSum] = useState(0);
  const [accCount, setAccCount] = useState(0);
  const attemptRef = useRef(0);
  const firstSpoken = useRef(false);

  const collectSpirit = useStore((s) => s.collectSpirit);
  const addDialog = useStore((s) => s.addDialog);
  const recordAccuracy = useStore((s) => s.recordAccuracy);
  const completeScene = useStore((s) => s.completeScene);
  const reducedMotion = useStore((s) => s.app.reducedMotion);

  const node = useMemo(() => scene.dialogue.find((n) => n.id === nodeId)!, [nodeId, scene]);
  const isFinal = !!node?.final;
  const totalSteps = scene.dialogue.length;

  function speakText(text: string) {
    setSpeaking(true);
    speak(text, scene.langId).finally(() => setSpeaking(false));
  }

  // 自动播报 AI 节点
  useEffect(() => {
    if (phase !== 'chat') return;
    if (node?.speaker === 'ai' && node.target && !firstSpoken.current) {
      firstSpoken.current = true;
      speakText(node.target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, nodeId]);

  function enterNode(id: number) {
    setNodeId(id);
    const n = scene.dialogue.find((x) => x.id === id);
    if (n?.speaker === 'ai' && n.target) speakText(n.target);
  }

  // 用户选择意图 → 进入跟读节点
  function handleChoice(next: number, label: string) {
    setHistory((h) => [...h, { speaker: 'user', zh: label }]);
    enterNode(next);
  }

  // 开始跟读：示范 → 模拟识别 → 评分
  function handlePractice() {
    setListening(true);
    const run = async () => {
      if (node.target) {
        setSpeaking(true);
        await speak(node.target, scene.langId);
        setSpeaking(false);
      }
      await new Promise((r) => setTimeout(r, reducedMotion ? 300 : 1400));
      setListening(false);
      const attempt = attemptRef.current + 1;
      const s = mockAccuracy(attempt, node.target?.length || 5);
      attemptRef.current = s < 80 ? attempt : 0;
      setScore({ value: s, attempt });
      if (s >= 80) {
        setAccSum((v) => v + s);
        setAccCount((c) => c + 1);
        recordAccuracy(s);
        addDialog();
      }
    };
    run();
  }

  // 评分关闭：通过/跳过 → 进入下一节点或完成
  function handleScoreClose() {
    setScore(null);
    const next = node?.next;
    if (next != null) {
      enterNode(next);
    } else {
      finishScene();
    }
  }

  function finishScene() {
    completeScene(scene.id, scene.spiritIds, scene.words.map((w) => w.id));
    scene.spiritIds.forEach((id) => collectSpirit(id));
    if (!reducedMotion) setCelebrate(true);
    const avg = accCount > 0 ? Math.round(accSum / accCount) : 92;
    onDone(avg);
    setPhase('done');
  }

  // ===== 完成页 =====
  if (phase === 'done') {
    return <DoneView scene={scene} onExit={onExit} />;
  }

  // ===== 场景导入 =====
  if (phase === 'intro') {
    return (
      <div className="paper-texture flex min-h-screen flex-col px-6 pb-8 pt-10 animate-fade-in">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg text-ink/60 shadow-card">✕</button>
          <span className="text-xs font-medium text-ink/40">{scene.emoji} {scene.title}</span>
          <span className="w-10" />
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-soft text-4xl">{scene.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-ink">{scene.title}</h2>
              <p className="mt-0.5 text-sm text-ink/50">{scene.desc}</p>
              <p className="mt-1 text-xs font-medium text-skyblue">预计 {scene.minutes} 分钟</p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold text-ink/50">这一课你会学到</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {scene.words.map((w) => (
                <span key={w.id} className="inline-flex items-center gap-1.5 rounded-xl bg-paper px-3 py-1.5 text-sm">
                  <span>{w.emoji}</span>
                  <span className="font-medium text-ink">{w.target}</span>
                  <span className="text-xs text-ink/45">{w.romaji}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-skyblue-soft p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-skyblue">句型公式</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{scene.pattern.formula}</p>
            <p className="mt-1 text-sm text-ink/70">{scene.pattern.example}</p>
            <p className="mt-1 text-xs text-ink/50">{scene.pattern.exampleZh} · {scene.pattern.hint}</p>
          </div>

          <button
            onClick={() => {
              setPhase('chat');
              const first = scene.dialogue[0];
              setHistory([{ speaker: first.speaker, target: first.target, romaji: first.romaji, zh: first.zh }]);
              setNodeId(first.id);
            }}
            className="mt-6 w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-float active:scale-95"
          >
            🎙️ 开始对话
          </button>
        </div>
      </div>
    );
  }

  // ===== 对话 =====
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-skyblue-soft/60 to-paper px-5 pb-44 pt-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm text-ink/60 shadow-card">✕</button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-ink/60">{scene.emoji} {scene.title}</span>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-skyblue">
            {Math.min(nodeId + 1, totalSteps)}/{totalSteps}
          </span>
        </div>
        <button
          onClick={() => node?.target && speakText(node.target)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-sm shadow-card"
          title="重听示范"
        >
          🔁
        </button>
      </div>

      <div className="mt-5 flex-1 space-y-4">
        {history.map((h, i) => (
          <div key={i} className={`flex ${h.speaker === 'ai' ? 'justify-start' : 'justify-end'} animate-slide-up`}>
            <div
              className={`max-w-[82%] rounded-3xl px-4 py-3 ${
                h.speaker === 'ai' ? 'rounded-tl-md bg-white shadow-card' : 'rounded-tr-md bg-primary text-white shadow-float'
              }`}
            >
              {h.speaker === 'user' && <p className="text-[11px] opacity-70">{h.zh}</p>}
              <p className="text-[15px] font-semibold leading-relaxed">{h.target || h.zh}</p>
              {h.romaji && <p className={`mt-0.5 text-xs ${h.speaker === 'ai' ? 'text-ink/45' : 'text-white/75'}`}>{h.romaji}</p>}
            </div>
          </div>
        ))}

        {/* AI 当前句 */}
        {node?.speaker === 'ai' && (
          <div className="flex items-end gap-2 animate-fade-in">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-card">
              {scene.langId === 'ja' ? '👨‍🍳' : scene.langId === 'ko' ? '👩‍🍳' : '🧑‍💼'}
            </div>
            <div className="max-w-[78%] rounded-3xl rounded-tl-md bg-white px-4 py-3 shadow-card">
              <p className="text-[15px] font-semibold leading-relaxed text-ink">{node.target}</p>
              {node.romaji && <p className="mt-0.5 text-xs text-ink/45">{node.romaji}</p>}
              <p className="mt-1 text-sm text-ink/60">{node.zh}</p>
              {speaking && <div className="mt-2"><WaveBars active color="#4A90E2" /></div>}
            </div>
          </div>
        )}

        {/* 用户跟读句 */}
        {node?.speaker === 'user' && (
          <div className="flex justify-end animate-fade-in">
            <div className="max-w-[82%] rounded-3xl rounded-tr-md bg-primary px-4 py-3 text-white shadow-float">
              <p className="text-[15px] font-semibold leading-relaxed">{node.target}</p>
              {node.romaji && <p className="mt-0.5 text-xs text-white/75">{node.romaji}</p>}
              <p className="mt-1 text-sm text-white/80">{node.zh}</p>
              {listening ? (
                <div className="mt-2 flex items-center gap-2 text-xs text-white/90">
                  <WaveBars active color="#ffffff" />
                  <span>正在听你朗读…</span>
                </div>
              ) : (
                <button
                  onClick={handlePractice}
                  className="mt-3 w-full rounded-2xl bg-white/20 py-2.5 text-sm font-semibold backdrop-blur active:scale-95"
                >
                  🎤 开始跟读
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-paper via-paper to-transparent px-6 pb-28 pt-4">
        {node?.choices && node.choices.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-center text-xs font-medium text-ink/45">你想说什么？</p>
            {node.choices.map((c) => (
              <button
                key={c.label}
                onClick={() => handleChoice(c.next, c.label)}
                className="flex w-full items-center justify-between rounded-2xl border-2 border-line bg-white px-4 py-3.5 text-left shadow-card transition-all active:scale-[0.98] active:border-primary"
              >
                <span className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
                  <span className="text-lg">{c.emoji}</span>
                  {c.label}
                </span>
                <span className="text-skyblue">→</span>
              </button>
            ))}
          </div>
        )}
        {isFinal && (
          <button onClick={finishScene} className="w-full rounded-2xl bg-coral py-4 text-base font-bold text-white shadow-float active:scale-95">
            🎉 完成对话
          </button>
        )}
      </div>

      {score && (
        <ScoreModal
          score={score.value}
          attempt={score.attempt}
          onRetry={handlePractice}
          onContinue={handleScoreClose}
          isSpeaking={speaking}
        />
      )}
      {celebrate && <Confetti />}
    </div>
  );
}

// ===== 完成页 =====
function DoneView({ scene, onExit }: { scene: Scenario; onExit: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="paper-texture flex min-h-screen flex-col px-6 pb-10 pt-16">
      <Confetti />
      <div className={`text-center transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-4xl shadow-float animate-pop">🎉</div>
        <h1 className="mt-4 text-2xl font-bold text-ink">恭喜完成第一次对话！</h1>
        <p className="mt-1 text-sm text-ink/55">{scene.rewardTitle}</p>
      </div>

      <div className={`mt-6 rounded-3xl bg-white p-5 shadow-card transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className="text-xs font-semibold text-ink/50">本次收获</p>
        <div className="mt-3 space-y-2.5">
          <Row emoji="📖" title={`学会 ${scene.words.length} 个词汇`} sub={scene.words.map((w) => w.target).join(' · ')} />
          <Row emoji="🧩" title="掌握 1 个句型公式" sub={scene.pattern.formula} />
          <Row emoji="🦋" title={`解锁 ${scene.spiritIds.length} 个文化精灵`} sub={scene.spiritIds.map((id) => id.toUpperCase()).join(' · ')} />
          <Row emoji="📮" title="护照盖上第 1 枚邮戳" sub="东京 · 便利店" />
        </div>
      </div>

      <div className={`mt-4 rounded-3xl bg-white p-5 shadow-card transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className="text-xs font-semibold text-ink/50">词汇卡</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {scene.words.map((w) => (
            <div key={w.id} className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-2.5">
              <span className="text-lg">{w.emoji}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{w.target}</p>
                <p className="truncate text-[11px] text-ink/45">{w.romaji} · {w.zh}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 space-y-3 transition-all duration-500 ${show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button onClick={onExit} className="w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-float active:scale-95">
          继续学习 →
        </button>
        <button onClick={onExit} className="w-full rounded-2xl border-2 border-primary/30 py-3.5 text-sm font-semibold text-primary active:scale-95">
          📤 生成分享成果卡
        </button>
      </div>
    </div>
  );
}

function Row({ emoji, title, sub }: { emoji: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg shadow-sm">{emoji}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="truncate text-xs text-ink/50">{sub}</p>
      </div>
    </div>
  );
}