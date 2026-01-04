
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import { HalftoneSettings, DEFAULT_SETTINGS, Language } from './types';
import { translations } from './translations';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<HalftoneSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = translations[language];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setIsProcessing(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'halftone-art.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const applyAISuggestion = async (prompt: string) => {
    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the creative style "${prompt}", suggest optimal numeric parameters for a halftone filter. 
        Return ONLY valid JSON in this format: 
        {"dotSize": number (1-20), "spacing": number (2-30), "angle": number (0-90), "shape": "circle"|"square"|"diamond"|"line", "mode": "monochrome"|"color"|"cmyk", "contrast": number (0.5-2.0), "invert": boolean, "fgColor": "hex", "bgColor": "hex"}.
        Ensure fgColor and bgColor are high contrast.`,
      });
      
      const suggested = JSON.parse(response.text || '{}');
      setSettings(prev => ({ ...prev, ...suggested }));
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsProcessing(false);
      setShowAIPanel(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <Header 
        onDownload={handleDownload} 
        onUpload={handleImageUpload} 
        hasImage={!!image} 
        language={language}
        setLanguage={setLanguage}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          settings={settings} 
          setSettings={setSettings} 
          onShowAI={() => setShowAIPanel(true)}
          language={language}
        />
        
        <div className="flex-1 flex items-center justify-center bg-slate-900 p-8 overflow-auto">
          {image ? (
            <div className="relative shadow-2xl rounded-lg overflow-hidden max-w-full max-h-full">
              <CanvasPreview 
                image={image} 
                settings={settings} 
                canvasRef={canvasRef}
                onProcessingChange={setIsProcessing}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-white font-medium">{t.processing}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-slate-700 rounded-2xl max-w-md">
              <div className="mb-4 flex justify-center">
                <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-200">{t.noImage}</h3>
              <p className="mt-2 text-slate-400">{t.uploadPrompt}</p>
              <label className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full cursor-pointer transition-all shadow-lg shadow-indigo-500/20">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                {t.selectImage}
              </label>
            </div>
          )}
        </div>

        {showAIPanel && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">{t.aiTitle}</h2>
              <p className="text-slate-400 mb-6">{t.aiDesc}</p>
              <div className="space-y-4">
                <button 
                  onClick={() => applyAISuggestion("Retro Newspaper Manga Style")}
                  className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span className="block font-semibold">{t.mangaTitle}</span>
                  <span className="text-sm text-slate-500">{t.mangaDesc}</span>
                </button>
                <button 
                  onClick={() => applyAISuggestion("Andy Warhol Pop Art Vivid CMYK")}
                  className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span className="block font-semibold">{t.popTitle}</span>
                  <span className="text-sm text-slate-500">{t.popDesc}</span>
                </button>
                <button 
                  onClick={() => applyAISuggestion("Fine Woodcut Line Illustration")}
                  className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  <span className="block font-semibold">{t.woodcutTitle}</span>
                  <span className="text-sm text-slate-500">{t.woodcutDesc}</span>
                </button>
              </div>
              <button 
                onClick={() => setShowAIPanel(false)}
                className="mt-8 text-slate-500 hover:text-white transition-colors underline w-full"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
