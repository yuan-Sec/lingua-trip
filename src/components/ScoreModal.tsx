interface Props {
  score: number;
  attempt: number;
  onRetry: () => void;
  onContinue: () => void;
  isSpeaking: boolean;
}

export default function ScoreModal({ score, attempt, onRetry, onContinue, isSpeaking }: Props) {
  const pass = score >= 78;
  const ringColor = score >= 90 ? '#27AE60' : score >= 80 ? '#4A90E2' : '#FF8C42';

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/50 p-6 backdrop-blur-sm">
      <div className="animate-pop w-full max-w-[340px] rounded-3xl bg-white p-6 text-center shadow-pop">
        {!pass ? (
          <>
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-coral/10 text-4xl">
              {attempt >= 2 ? '🎉' : '💪'}
            </div>
            <h3 className="text-lg font-bold text-ink">{attempt >= 2 ? '完美！这次很棒！' : '没关系，再试一次！'}</h3>
            <p className="mt-1 text-sm text-ink/60">
              {attempt >= 2 ? '发音很棒，继续对话吧！' : 'AI 会再示范一遍，跟着读就好'}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={onContinue}
                className="flex-1 rounded-2xl bg-ink/10 py-3 text-sm font-semibold text-ink active:scale-95"
              >
                跳过
              </button>
              <button
                onClick={onRetry}
                className="flex-1 rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-float active:scale-95"
              >
                {isSpeaking ? '听示范…' : '再跟读一次'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative mx-auto mb-3 h-20 w-20">
              <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#F1F2F4" strokeWidth="7" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke={ringColor} strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 213.6} 213.6`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-xl font-bold text-ink">{score}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-ink">
              {score >= 90 ? '发音超棒！' : '发音不错！'}
            </h3>
            <p className="mt-1 text-sm text-ink/60">
              {score >= 90 ? '连 AI 都给你竖大拇指 👍' : '很标准，继续加油！'}
            </p>
            <button
              onClick={onContinue}
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-white shadow-float active:scale-95"
            >
              继续对话 →
            </button>
          </>
        )}
        {isSpeaking && <p className="mt-2 text-xs text-ink/40">正在播放示范发音…</p>}
      </div>
    </div>
  );
}