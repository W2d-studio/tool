
export type ShapeType = 'circle' | 'square' | 'diamond' | 'line';
export type RenderMode = 'monochrome' | 'color' | 'cmyk';
export type Language = 'en' | 'zh';

export interface HalftoneSettings {
  dotSize: number;
  spacing: number;
  angle: number;
  shape: ShapeType;
  mode: RenderMode;
  contrast: number;
  brightness: number;
  invert: boolean;
  fgColor: string;
  bgColor: string;
}

export const DEFAULT_SETTINGS: HalftoneSettings = {
  dotSize: 4,
  spacing: 8,
  angle: 45,
  shape: 'circle',
  mode: 'monochrome',
  contrast: 1.2,
  brightness: 1.0,
  invert: false,
  fgColor: '#000000',
  bgColor: '#ffffff',
};
