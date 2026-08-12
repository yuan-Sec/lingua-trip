import { useMemo, useState } from 'react';
import { useStore } from './store';
import { SCENARIOS } from './data/scenarios';
import { LANGUAGES } from './data/cities';
import type { Scenario, ShareCardData } from './types';
import type { TabId } from './components/BottomNav';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import SpiritsPage from './pages/Spirits';
import PassportPage from './pages/Passport';
import DialoguePage from './pages/Dialogue';
import ReviewModal from './pages/Review';
import ShareCard from './pages/ShareCard';
import { buildShareData, daySince } from './utils/share';

export default function App() {
  const app = useStore((s) => s.app);
  const [view, setView] = useState<TabId>('home');
  const [activeScene, setActiveScene] = useState<Scenario | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareCardData | null>(null);

  const langInfo = useMemo(() => LANGUAGES.find((l) => l.id === app.lang)!, [app.lang]);

  // 未注册 → 欢迎页
  if (!app.onboarded) {
    return (
      <Onboarding
        onPick={(_lang, sceneId) => {
          const sc = SCENARIOS.find((s) => s.id === sceneId);
          if (sc) setActiveScene(sc);
        }}
      />
    );
  }

  function openShareFromPassport() {
    setShareData(
      buildShareData({
        langName: langInfo.name,
        sceneTitle: '我的能力护照',
        sceneEmoji: '🛂',
        accuracy: app.passport.bestAccuracy || 0,
        day: daySince(app.lastVisit),
        wordsCount: app.passport.wordsMastered.length,
        spiritsCount: app.passport.spiritsCollected.length,
      })
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md">
      {view === 'home' && <Home onOpenScene={setActiveScene} onOpenReview={() => setReviewOpen(true)} />}
      {view === 'spirits' && <SpiritsPage />}
      {view === 'passport' && <PassportPage onShare={openShareFromPassport} />}

      <BottomNav current={view} onChange={setView} />

      {/* 场景对话全屏 */}
      {activeScene && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-paper">
          <DialoguePage
            scene={activeScene}
            onExit={() => setActiveScene(null)}
            onDone={(accuracy) => {
              setShareData(
                buildShareData({
                  langName: langInfo.name,
                  sceneTitle: activeScene.title,
                  sceneEmoji: activeScene.emoji,
                  accuracy,
                  day: daySince(app.lastVisit),
                  wordsCount: activeScene.words.length,
                  spiritsCount: activeScene.spiritIds.length,
                })
              );
            }}
          />
        </div>
      )}

      {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} />}
      {shareData && <ShareCard data={shareData} onClose={() => setShareData(null)} />}
    </div>
  );
}