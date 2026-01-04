
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  onDownload: () => void;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasImage: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ onDownload, onUpload, hasImage, language, setLanguage }) => {
  const t = translations[language];

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/40">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
          DotMatrix <span className="text-indigo-400">Studio</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-slate-800 rounded-lg p-1 mr-2 border border-slate-700">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('zh')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === 'zh' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            中
          </button>
        </div>

        <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer transition-colors border border-slate-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-medium">{t.upload}</span>
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
        </label>
        
        {hasImage && (
          <button 
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm font-medium">{t.download}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
