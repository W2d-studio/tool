
import { Language } from './types';

export const translations = {
  en: {
    upload: "Upload",
    download: "Download",
    magicAi: "Magic Style AI",
    renderingMode: "Rendering Mode",
    shapeType: "Shape Type",
    parameters: "Parameters",
    dotSpacing: "Dot Spacing",
    dotSize: "Dot Size",
    rotation: "Rotation",
    contrast: "Contrast",
    invertPalette: "Invert Palette",
    palette: "Palette",
    foreground: "Foreground",
    background: "Background",
    noImage: "No Image Selected",
    uploadPrompt: "Upload a photo to start applying dot matrix effects.",
    selectImage: "Select Image",
    processing: "Processing Pixels...",
    aiTitle: "AI Style Suggestion",
    aiDesc: "Describe the artistic vibe you want (e.g., '1950s Newspaper Comic').",
    cancel: "Cancel",
    mangaTitle: "Retro Manga",
    mangaDesc: "Fine dots, high contrast monochrome.",
    popTitle: "Pop Art Masterpiece",
    popDesc: "Large dots, vivid CMYK separation.",
    woodcutTitle: "Line Matrix Woodcut",
    woodcutDesc: "Horizontal lines with varying thickness.",
    modes: {
      monochrome: "B&W",
      color: "Color",
      cmyk: "CMYK"
    },
    shapes: {
      circle: "Circle",
      square: "Square",
      diamond: "Diamond",
      line: "Line"
    }
  },
  zh: {
    upload: "上传图片",
    download: "保存图片",
    magicAi: "AI 风格灵感",
    renderingMode: "渲染模式",
    shapeType: "点形状",
    parameters: "参数设置",
    dotSpacing: "点间距",
    dotSize: "点大小",
    rotation: "旋转角度",
    contrast: "对比度",
    invertPalette: "反转颜色",
    palette: "调色板",
    foreground: "前景色",
    background: "背景色",
    noImage: "未选择图片",
    uploadPrompt: "上传一张图片来开始创作你的点阵艺术。",
    selectImage: "选择图片",
    processing: "正在像素处理中...",
    aiTitle: "AI 风格建议",
    aiDesc: "描述你想要的艺术风格（例如：'1950年代报纸漫画'、'波普艺术'）。",
    cancel: "取消",
    mangaTitle: "复古漫画",
    mangaDesc: "细腻的网点，高对比度黑白风格。",
    popTitle: "波普艺术杰作",
    popDesc: "大颗点阵，鲜艳的 CMYK 分色。",
    woodcutTitle: "线条木刻",
    woodcutDesc: "具有粗细变化的水平线条矩阵。",
    modes: {
      monochrome: "黑白",
      color: "彩色",
      cmyk: "印刷分色"
    },
    shapes: {
      circle: "圆形",
      square: "方形",
      diamond: "菱形",
      line: "线型"
    }
  }
};

export type TranslationKeys = typeof translations.en;
