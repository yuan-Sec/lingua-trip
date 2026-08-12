---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '13dc19c4-9295-486a-8aa5-3e6eb7db1c39'
  PropagateID: '13dc19c4-9295-486a-8aa5-3e6eb7db1c39'
  ReservedCode1: '144f918b-66a8-458b-baec-8b7c539a88c2'
  ReservedCode2: '144f918b-66a8-458b-baec-8b7c539a88c2'
---

# LinguaTrip · 语旅 🌍

> 不是背单词，是体验世界 —— 零基础多语言场景学习 App

一款以「旅行护照」为主题的零基础多语言学习 App。不需要背单词表、不需要考试，30 秒完成你的第一段真实外语对话。

支持 **日语 / 韩语 / 英语** 3 种语言，东京、首尔、伦敦 3 座城市，9 个真实旅行场景。

## ✨ 核心功能（P0 全部完成）

| 功能 | 说明 |
| --- | --- |
| 🏪 场景卡片式学习 | 便利店买水、电车问路、居酒屋点餐、炸鸡店下单、机场入境… 9 个真实场景对话树 |
| 🎙️ AI 场景语伴 | 与 AI 店员/向导对话，选意图 → 跟读 → 发音评分（模拟评分 + TTS 示范） |
| 🎨 文化精灵图鉴 | 34 个字符精灵（假名/谚文/字母），带文化冷知识，场景完成解锁 |
| 📖 30 天能力护照 | 每完成一个场景盖一枚邮戳，徽章系统（7 枚），旅行进度可视化 |
| 📤 成果分享卡 | 复古明信片风格，一键保存 PNG 分享 |

## 🖥️ 技术栈

- **前端**：React 19 + TypeScript + Vite 8 + Tailwind CSS 3 + Zustand（localStorage 持久化）
- **语音**：Web Speech API（speechSynthesis）示范发音 + 模拟评分
- **打包**：Capacitor 7 → Android APK（minSdk 23 / targetSdk 35）

## 📦 快速开始

```bash
npm install
npm run dev        # 开发预览（浏览器）
npm run build      # 生产构建 → dist/
```

### Android APK

```bash
npm run build
npx cap sync android
cd android
# 需要 JDK 17+ 与 Android SDK（platform 35）
./gradlew assembleRelease
# 产物：android/app/build/outputs/apk/release/app-release.apk
```

## 🗂️ 项目结构

```
src/
├── data/          # 语言/城市/精灵/9 个场景对话树（纯数据）
├── pages/          # Onboarding / Home / Dialogue / Spirits / Passport / Review / ShareCard
├── components/     # Confetti / WaveBars / ScoreModal / ProgressRing / BottomNav
├── store.ts        # Zustand 状态 + 徽章规则
└── utils/          # TTS 与分享卡工具
```

## 📜 设计原则

- **零失败**：跟读低于 60 分显示「再试一次」，永不打击
- **首课 ≤8 词汇**：第一课只学 5 个词，保证即时正反馈
- **旅行护照主题**：暖橙 `#FF8C42` + 天蓝 `#4A90E2`，全中文界面
- **进度本地保存**：数据只存在本地，无需注册登录

## 📄 License

MIT

> AI生成