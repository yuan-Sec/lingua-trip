import type { Spirit } from '../types';

// ===== 文化精灵数据（MVP 精选版） =====

export const SPIRITS: Spirit[] = [
  // ===== 日语 · 平假名 =====
  { id: 'ja-a', langId: 'ja', char: 'あ', romaji: 'a', name: '朱色精灵', color: '#E04A4A', kind: 'kana', fact: '「あ」来源于汉字「安」，日本传统色「朱色」常出现在神社鸟居上，是神的颜色。' },
  { id: 'ja-i', langId: 'ja', char: 'い', romaji: 'i', name: '瑠璃精灵', color: '#1B4F9C', kind: 'kana', fact: '「い」来源于「以」，瑠璃蓝是日本传统色，像夏日的浅间山天空。' },
  { id: 'ja-u', langId: 'ja', char: 'う', romaji: 'u', name: '黄金精灵', color: '#D4A017', kind: 'kana', fact: '「う」来自汉字「宇」，黄金色象征金阁寺的屋顶，在阳光下闪闪发光。' },
  { id: 'ja-e', langId: 'ja', char: 'え', romaji: 'e', name: '萌黄精灵', color: '#7FB069', kind: 'kana', fact: '「え」来自「衣」，萌黄色是初春新芽的颜色，日本春日的代表色。' },
  { id: 'ja-o', langId: 'ja', char: 'お', romaji: 'o', name: '山吹精灵', color: '#FFB11B', kind: 'kana', fact: '「お」来自「於」，山吹色是棣棠花的颜色，平安时代的贵族常用色。' },
  { id: 'ja-ka', langId: 'ja', char: 'か', romaji: 'ka', name: '樱花精灵', color: '#FFC0CB', kind: 'kana', fact: '「か」来自「加」，樱花色是春天赏樱（花見）时漫天飞舞的颜色。' },
  { id: 'ja-ki', langId: 'ja', char: 'き', romaji: 'ki', name: '橘色精灵', color: '#F39800', kind: 'kana', fact: '「き」来自「幾」，橘色是日本秋日枫叶的颜色，也是新干线标识色。' },
  { id: 'ja-ku', langId: 'ja', char: 'く', romaji: 'ku', name: '藤色精灵', color: '#8B7BA8', kind: 'kana', fact: '「く」来自「久」，藤色是紫藤花的颜色，奈良春日大社的藤棚闻名世界。' },
  { id: 'ja-ke', langId: 'ja', char: 'け', romaji: 'ke', name: '红绯精灵', color: '#B23A48', kind: 'kana', fact: '「け」来自「計」，红绯色是歌舞伎舞台幕布的颜色，象征华丽与热情。' },
  { id: 'ja-ko', langId: 'ja', char: 'こ', romaji: 'ko', name: '千岁绿精灵', color: '#2E8B57', kind: 'kana', fact: '「こ」来自「己」，千岁绿是常青树颜色，象征长寿，神社的松柏常青。' },
  { id: 'ja-sa', langId: 'ja', char: 'さ', romaji: 'sa', name: '珊瑚精灵', color: '#FF7F50', kind: 'kana', fact: '「さ」来自「左」，珊瑚色是冲绳珊瑚的颜色，宫古岛的碧海下珊瑚摇曳。' },
  { id: 'ja-shi', langId: 'ja', char: 'し', romaji: 'shi', name: '白练精灵', color: '#E8E4D9', kind: 'kana', fact: '「し」来自「之」，白练色是日本和服婚礼的净白，象征纯洁与新生。' },

  // ===== 韩语 · 韩文字母 =====
  { id: 'ko-ga', langId: 'ko', char: '가', romaji: 'ga', name: '高丽精灵', color: '#C0392B', kind: 'hangul', fact: '가 是韩文字母的起点，源自"伽倻"，高丽青瓷的碧色是韩国国宝级色彩。' },
  { id: 'ko-na', langId: 'ko', char: '나', romaji: 'na', name: '月白精灵', color: '#EAF2F8', kind: 'hangul', fact: '韩国的月白色是中秋满月洒在雪地的颜色，韩国人中秋要回乡祭祖。' },
  { id: 'ko-da', langId: 'ko', char: '다', romaji: 'da', name: '丹青精灵', color: '#B22222', kind: 'hangul', fact: '「丹青」是韩式古建筑（景福宫）屋檐上的彩绘配色，五彩斑斓。' },
  { id: 'ko-ra', langId: 'ko', char: '라', romaji: 'ra', name: '青瓷精灵', color: '#5F9EA0', kind: 'hangul', fact: '高丽青瓷的「翠色」是天青色，翡色，是韩国最著名的陶瓷艺术。' },
  { id: 'ko-ma', langId: 'ko', char: '마', romaji: 'ma', name: '朱红精灵', color: '#E74C3C', kind: 'hangul', fact: '韩国的朱红色是宫殿和寺庙廊柱的颜色，首尔景福宫处处可见。' },
  { id: 'ko-ha', langId: 'ko', char: '하', romaji: 'ha', name: '山绿精灵', color: '#27AE60', kind: 'hangul', fact: '韩国的「山绿」是雪岳山四季常青的松树色，韩国人登山是全民运动。' },
  { id: 'ko-a', langId: 'ko', char: '아', romaji: 'a', name: '海蓝精灵', color: '#2980B9', kind: 'hangul', fact: '济州岛的碧海颜色，韩国济州岛拥有"火山岛"世界自然遗产。' },
  { id: 'ko-ja', langId: 'ko', char: '자', romaji: 'ja', name: '墨色精灵', color: '#2C3E50', kind: 'hangul', fact: '韩国的「墨色」来自传统水墨画，韩纸（한지）上是文人雅士的墨宝。' },
  { id: 'ko-cha', langId: 'ko', char: '차', romaji: 'cha', name: '茶色精灵', color: '#A0522D', kind: 'hangul', fact: '韩国的「茶色」是传统茶道文化，韩国传统茶有青梅茶、柚子茶。' },
  { id: 'ko-ka', langId: 'ko', char: '카', romaji: 'ka', name: '赤铜精灵', color: '#B87333', kind: 'hangul', fact: '韩国的赤铜色见于传统铜器，泡菜汤用的铜锅是韩式厨房的标志。' },
  { id: 'ko-ta', langId: 'ko', char: '타', romaji: 'ta', name: '柿子精灵', color: '#D35400', kind: 'hangul', fact: '韩国的柿子（감）秋日挂满枝头，晒成柿饼是冬日美食，象征红火。' },
  { id: 'ko-pa', langId: 'ko', char: '파', romaji: 'pa', name: '荠蓝精灵', color: '#2874A6', kind: 'hangul', fact: '韩国的「荠蓝」如韩服上的靛蓝染布，韩服颜色讲究五行相生。' },

  // ===== 英语 · 字母 =====
  { id: 'en-a', langId: 'en', char: 'A', romaji: 'A', name: '苹果精灵', color: '#E74C3C', kind: 'alpha', fact: 'A 是"Apple"的开头。据说牛顿被苹果砸中发现了万有引力，如今这句是英语第一课。' },
  { id: 'en-b', langId: 'en', char: 'B', romaji: 'B', name: '蜜蜂精灵', color: '#F1C40F', kind: 'alpha', fact: 'B 是"Bee"的开头。英国王室徽章上的蜜蜂象征勤勉，伦敦的蜂蜜久负盛名。' },
  { id: 'en-c', langId: 'en', char: 'C', romaji: 'C', name: '猫精灵', color: '#8E44AD', kind: 'alpha', fact: 'C 是"Cat"的开头。英国有著名的"首相之猫"Larry，常年在唐宁街10号。' },
  { id: 'en-d', langId: 'en', char: 'D', romaji: 'D', name: '恐龙精灵', color: '#27AE60', kind: 'alpha', fact: 'D 是"Dinosaur"的开头。伦敦自然历史博物馆的梁龙骨架是镇馆之宝。' },
  { id: 'en-e', langId: 'en', char: 'E', romaji: 'E', name: '大象精灵', color: '#5D6D7E', kind: 'alpha', fact: 'E 是"Elephant"的开头。英国动物园最受欢迎的大象，伦敦动物园历史超190年。' },
  { id: 'en-f', langId: 'en', char: 'F', romaji: 'F', name: '花精灵', color: '#E91E63', kind: 'alpha', fact: 'F 是"Flower"的开头。英国的国花是玫瑰，切尔西花展是全球顶级的园艺展。' },
  { id: 'en-g', langId: 'en', char: 'G', romaji: 'G', name: '环球精灵', color: '#2980B9', kind: 'alpha', fact: 'G 是"Globe"的开头。伦敦格林尼治天文台是"本初子午线"经过的地方。' },
  { id: 'en-h', langId: 'en', char: 'H', romaji: 'H', name: '酒店精灵', color: '#C0392B', kind: 'alpha', fact: 'H 是"Hotel"的开头。英国的下午茶文化起源于19世纪，酒店茶会盛行百年。' },
  { id: 'en-i', langId: 'en', char: 'I', romaji: 'I', name: '冰激凌精灵', color: '#F5CBA7', kind: 'alpha', fact: 'I 是"Ice cream"的开头。英国海滩上的"99冰激凌"配一根巧克力棒，是夏日传统。' },
  { id: 'en-j', langId: 'en', char: 'J', romaji: 'J', name: '果汁精灵', color: '#F39C12', kind: 'alpha', fact: 'J 是"Juice"的开头。英式早餐里的橙汁配茄汁豆子，是英国人的国民搭配。' },
];