export type TabId = 'home' | 'spirits' | 'passport';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: '首页', icon: '🏠' },
  { id: 'spirits', label: '精灵', icon: '🎨' },
  { id: 'passport', label: '护照', icon: '📖' },
];

export default function BottomNav({ current, onChange }: { current: TabId; onChange: (v: TabId) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((t) => {
          const active = current === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex min-w-[72px] flex-col items-center gap-0.5 py-2.5 transition-all active:scale-95 ${
                active ? 'text-primary' : 'text-ink/40'
              }`}
            >
              <span className={`text-xl transition-transform ${active ? 'scale-110' : ''}`}>{t.icon}</span>
              <span className={`text-[11px] font-medium ${active ? 'font-bold' : ''}`}>{t.label}</span>
              {active && <span className="mt-0.5 h-1 w-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}