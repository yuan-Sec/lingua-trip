// ===== 全局类型定义 =====

export type LangId = 'ja' | 'ko' | 'en';

export interface Language {
  id: LangId;
  name: string;
  enName: string;
  flag: string;
  color: string;
  sceneTotal: number;
  spiritTotal: number;
  desc: string;
}

export interface City {
  id: string;
  langId: LangId;
  name: string;
  nameEn: string;
  emoji: string;
  landmark: string; // 地标邮戳图案
  desc: string;
}

export interface Vocab {
  id: string;
  target: string; // 目标语言词
  zh: string; // 中文
  romaji: string; // 发音标注
  emoji: string;
}

export interface Pattern {
  formula: string; // 句型模板
  zh: string; // 句型解释
  example: string; // 例句
  exampleZh: string;
  hint: string; // 记忆口诀
}

export interface DialogueNode {
  id: number;
  speaker: 'ai' | 'user' | 'narrator';
  target?: string; // 目标语言文本
  romaji?: string;
  zh: string; // 显示文本（中文）
  choices?: { label: string; emoji: string; next: number; target?: string; romaji?: string }[];
  next?: number;
  final?: boolean; // 是否对话结束节点
}

export interface Scenario {
  id: string;
  langId: LangId;
  cityId: string;
  title: string;
  emoji: string;
  minutes: number;
  desc: string;
  level: 1 | 2 | 3; // 难度
  words: Vocab[];
  pattern: Pattern;
  dialogue: DialogueNode[];
  spiritIds: string[]; // 完成后解锁的精灵
  rewardTitle: string; // 完成成就标题，如"我在东京买了第一瓶水"
}

export interface Spirit {
  id: string;
  langId: LangId;
  char: string; // 字符
  romaji: string;
  name: string; // 精灵名
  color: string; // 代表色
  fact: string; // 文化冷知识
  kind: 'kana' | 'hangul' | 'alpha' | 'word';
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  desc: string;
}

// ===== 状态类型 =====

export interface PassportState {
  scenesCompleted: string[]; // 已完成场景 id
  stamps: string[]; // 邮戳（同场景，语义区分）
  spiritsCollected: string[]; // 收集的精灵
  wordsMastered: string[]; // 掌握的词汇 id
  badges: string[]; // 徽章 id
  bestAccuracy: number; // 最佳发音
  activeDays: number;
  totalDialogs: number; // 完成对话轮数
}

export interface AppState {
  onboarded: boolean;
  lang: LangId;
  name: string;
  passport: PassportState;
  lastVisit: string; // ISO 日期
  reducedMotion: boolean;
}

export interface ShareCardData {
  langName: string;
  sceneTitle: string;
  sceneEmoji: string;
  accuracy: number;
  day: number;
  wordsCount: number;
  spiritsCount: number;
  quote: string;
  time: string;
}