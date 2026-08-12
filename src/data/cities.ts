import type { Language, City } from '../types';

export const LANGUAGES: Language[] = [
  {
    id: 'ja',
    name: '日语',
    enName: 'Japanese',
    flag: '🇯🇵',
    color: '#E04A4A',
    sceneTotal: 3,
    spiritTotal: 46,
    desc: '假名世界 · 便利店 · 居酒屋',
  },
  {
    id: 'ko',
    name: '韩语',
    enName: 'Korean',
    flag: '🇰🇷',
    color: '#4A90E2',
    sceneTotal: 3,
    spiritTotal: 24,
    desc: '韩文世界 · 咖啡店 · 炸鸡',
  },
  {
    id: 'en',
    name: '英语',
    enName: 'English',
    flag: '🇬🇧',
    color: '#6C5CE7',
    sceneTotal: 3,
    spiritTotal: 26,
    desc: '生存英语 · 机场 · 餐厅',
  },
];

export const CITIES: City[] = [
  {
    id: 'tokyo',
    langId: 'ja',
    name: '东京',
    nameEn: 'Tokyo',
    emoji: '🗼',
    landmark: '🗼',
    desc: '便利店 · 电车 · 居酒屋',
  },
  {
    id: 'seoul',
    langId: 'ko',
    name: '首尔',
    nameEn: 'Seoul',
    emoji: '🏙️',
    landmark: '🏯',
    desc: '咖啡店 · 炸鸡店 · 地铁',
  },
  {
    id: 'london',
    langId: 'en',
    name: '伦敦',
    nameEn: 'London',
    emoji: '🎡',
    landmark: '🎡',
    desc: '机场 · 餐厅 · 酒店',
  },
];