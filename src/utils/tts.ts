// ===== 语音合成与发音评分模拟 =====

export const TTS_LANG: Record<string, string> = {
  ja: 'ja-JP',
  ko: 'ko-KR',
  en: 'en-GB',
};

export function speak(text: string, langKey: 'ja' | 'ko' | 'en'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = TTS_LANG[langKey] || 'ja-JP';
    u.rate = 0.82;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.lang === u.lang && v.localService) ||
      voices.find((v) => v.lang === u.lang) ||
      null;
    if (voice) u.voice = voice;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

// 模拟发音评分（演示版）：基于长度与随机生成 70-99 分
// 零失败设计：分数低于 78 显示"再试一次"，重试必得高分
export function mockAccuracy(attempt: number, textLen: number): number {
  if (attempt >= 2) return 90 + Math.floor(Math.random() * 9); // 第二次必过
  const base = 74 + Math.floor(Math.random() * 22);
  const lenBonus = Math.max(0, 4 - Math.floor(textLen / 6));
  return Math.min(98, base + lenBonus);
}

export function isSupport(): boolean {
  return 'speechSynthesis' in window;
}