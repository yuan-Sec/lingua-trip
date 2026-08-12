import { useMemo } from 'react';

export default function WaveBars({ active = true, color = '#4A90E2' }: { active?: boolean; color?: string }) {
  const bars = useMemo(() => Array.from({ length: 7 }, (_, i) => i), []);
  return (
    <div className="flex h-6 items-center gap-[3px]">
      {bars.map((i) => (
        <span
          key={i}
          className="wave-bar w-[3px] rounded-full"
          style={{
            height: `${8 + ((i * 7) % 14)}px`,
            backgroundColor: color,
            animationDelay: `${i * 0.12}s`,
            animationPlayState: active ? 'running' : 'paused',
            opacity: active ? 1 : 0.35,
          }}
        />
      ))}
    </div>
  );
}