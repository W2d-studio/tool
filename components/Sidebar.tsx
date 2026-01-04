
import React from 'react';
import { HalftoneSettings, ShapeType, RenderMode, Language } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  settings: HalftoneSettings;
  setSettings: React.Dispatch<React.SetStateAction<HalftoneSettings>>;
  onShowAI: () => void;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ settings, setSettings, onShowAI, language }) => {
  const t = translations[language];

  const handleChange = (key: keyof HalftoneSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const shapes: { id: ShapeType; label: string; icon: string }[] = [
    { id: 'circle', label: t.shapes.circle, icon: '●' },
    { id: 'square', label: t.shapes.square, icon: '■' },
    { id: 'diamond', label: t.shapes.diamond, icon: '◆' },
    { id: 'line', label: t.shapes.line, icon: '≡' },
  ];

  const modes: { id: RenderMode; label: string }[] = [
    { id: 'monochrome', label: t.modes.monochrome },
    { id: 'color', label: t.modes.color },
    { id: 'cmyk', label: t.modes.cmyk },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto p-6 space-y-8 shrink-0">
      <div className="space-y-4">
        <button 
          onClick={onShowAI}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t.magicAi}
        </button>
      </div>

      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.renderingMode}</h3>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => handleChange('mode', mode.id)}
              className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                settings.mode === mode.id 
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.shapeType}</h3>
        <div className="grid grid-cols-4 gap-2">
          {shapes.map(shape => (
            <button
              key={shape.id}
              title={shape.label}
              onClick={() => handleChange('shape', shape.id)}
              className={`aspect-square flex items-center justify-center text-xl rounded-lg border transition-all ${
                settings.shape === shape.id 
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              {shape.icon}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.parameters}</h3>
        
        <ControlItem label={t.dotSpacing} value={settings.spacing} min={2} max={40} step={1} onChange={(v) => handleChange('spacing', v)} />
        <ControlItem label={t.dotSize} value={settings.dotSize} min={0.5} max={15} step={0.5} onChange={(v) => handleChange('dotSize', v)} />
        <ControlItem label={t.rotation} value={settings.angle} min={0} max={90} step={1} unit="°" onChange={(v) => handleChange('angle', v)} />
        <ControlItem label={t.contrast} value={settings.contrast} min={0.5} max={3.0} step={0.1} onChange={(v) => handleChange('contrast', v)} />
        
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-slate-300">{t.invertPalette}</span>
          <button 
            onClick={() => handleChange('invert', !settings.invert)}
            className={`w-12 h-6 rounded-full relative transition-colors ${settings.invert ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.invert ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </section>

      <section className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t.palette}</h3>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t.foreground}</span>
            <input 
              type="color" 
              value={settings.fgColor} 
              onChange={(e) => handleChange('fgColor', e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer overflow-hidden p-0"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t.background}</span>
            <input 
              type="color" 
              value={settings.bgColor} 
              onChange={(e) => handleChange('bgColor', e.target.value)}
              className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer overflow-hidden p-0"
            />
          </div>
        </div>
      </section>
    </aside>
  );
};

const ControlItem: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (val: number) => void;
}> = ({ label, value, min, max, step, unit = '', onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
    />
  </div>
);

export default Sidebar;
