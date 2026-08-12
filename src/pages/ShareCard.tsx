import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { ShareCardData } from '../types';

interface Props {
  data: ShareCardData;
  onClose: () => void;
}

// 复古旅行明信片风格成果卡
export default function ShareCard({ data, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#F8F9FA',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `linguatrip-${data.langName}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // 失败降级：直接提示
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* 明信片卡片 */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl border-[6px] border-white bg-[#FFF8EC] shadow-pop"
          style={{ aspectRatio: '3 / 4' }}
        >
          {/* 背景纹理 */}
          <div className="absolute inset-0 opacity-60" style={{
            background:
              'radial-gradient(circle at 20% 15%, rgba(255,140,66,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(74,144,226,0.14), transparent 45%), repeating-linear-gradient(0deg, rgba(212,160,23,0.06) 0 1px, transparent 1px 4px)',
          }} />

          {/* 邮戳装饰 */}
          <div className="stamp absolute right-5 top-5 h-16 w-16 rotate-12 text-[10px] font-bold leading-tight">
            <span className="text-xl">✈️</span>
            <br />LINGUATRIP
          </div>

          {/* 主内容 */}
          <div className="relative flex h-full flex-col justify-between p-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{data.sceneEmoji}</span>
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  LinguaTrip · Day {data.day}
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-ink">
                我刚学会用{data.langName}点「{data.sceneTitle}」
              </h2>

              <div className="mt-4 space-y-2">
                <Line emoji="🎯" label="发音准确度" value={`${data.accuracy}%`} />
                <Line emoji="📖" label="掌握词汇" value={`+${data.wordsCount} 个`} />
                <Line emoji="🦋" label="文化精灵" value={`+${data.spiritsCount} 只`} />
              </div>
            </div>

            <div className="text-center">
              <p className="font-display text-sm font-semibold text-primary">{data.quote}</p>
              <p className="mt-1 text-[10px] tracking-widest text-ink/40">LINGUA TRIP · 语旅 · {data.time}</p>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-4 space-y-2.5">
          <button
            onClick={save}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-white shadow-float active:scale-95"
          >
            {saving ? '生成中…' : saved ? '✅ 已保存到相册' : '💾 保存成果卡'}
          </button>
          <button onClick={onClose} className="w-full rounded-2xl bg-white/15 py-3 text-sm font-semibold text-white backdrop-blur active:scale-95">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function Line({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#E8DCC0] bg-white/70 px-4 py-2.5">
      <span className="flex items-center gap-2 text-sm font-medium text-ink">
        <span>{emoji}</span>
        {label}
      </span>
      <span className="font-display text-base font-bold text-primary">{value}</span>
    </div>
  );
}