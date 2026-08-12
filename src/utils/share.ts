import type { ShareCardData } from '../types';

// 生成分享文案
export function shareQuote(langName: string): string {
  const quotes: Record<string, string> = {
    日语: '「不是背单词，是体验世界」',
    韩语: '从便利店到炸鸡店，用韩语遇见首尔',
    英语: '第一句英语，从机场开始',
  };
  return quotes[langName] || '「不是背单词，是体验世界」';
}

export function buildShareData(p: {
  langName: string;
  sceneTitle: string;
  sceneEmoji: string;
  accuracy: number;
  day: number;
  wordsCount: number;
  spiritsCount: number;
}): ShareCardData {
  return {
    langName: p.langName,
    sceneTitle: p.sceneTitle,
    sceneEmoji: p.sceneEmoji,
    accuracy: p.accuracy,
    day: p.day,
    wordsCount: p.wordsCount,
    spiritsCount: p.spiritsCount,
    quote: shareQuote(p.langName),
    time: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
  };
}

// 计算学习第几天（从首次使用开始）
export function daySince(firstDate: string): number {
  const first = new Date(firstDate).getTime();
  if (Number.isNaN(first)) return 1;
  const diff = Math.floor((Date.now() - first) / 86400000);
  return Math.max(1, diff + 1);
}