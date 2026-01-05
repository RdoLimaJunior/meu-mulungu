import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, ShieldCheck } from 'lucide-react';

interface PwaInstallerProps {
  mode: 'banner' | 'modal'; // banner para Home, modal para Login
}

export const PwaInstaller: React.FC<PwaInstallerProps> = ({ mode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Se for modal (login), mostra automaticamente. Se for banner, também mostra.
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  if (mode === 'banner') {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-40 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-slide-in flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-mulungu-100 p-2 rounded-lg text-mulungu-600">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Instalar Aplicativo</p>
            <p className="text-xs text-slate-500">Acesso rápido e offline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            onClick={handleInstallClick}
            className="bg-mulungu-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-mulungu-700 transition-colors"
          >
            Instalar
          </button>
        </div>
      </div>
    );
  }

  // MODAL MODE (Para Login/Dashboard)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-zoom-in relative">
        <button 
           onClick={() => setIsVisible(false)}
           className="absolute top-3 right-3 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-mulungu-600 p-6 text-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382')] bg-center bg-contain bg-no-repeat"></div>
           <Smartphone className="w-12 h-12 text-white mx-auto mb-3 animate-bounce" />
           <h2 className="text-xl font-bold text-white">Instale o App Oficial</h2>
           <p className="text-mulungu-100 text-sm mt-1">Tenha sua carteira digital sempre à mão, mesmo sem internet.</p>
        </div>

        <div className="p-6 space-y-4">
           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-700">Seguro e Leve</p>
                <p className="text-[10px] text-slate-500">Ocupa menos de 2MB no seu dispositivo.</p>
              </div>
           </div>

           <button 
             onClick={handleInstallClick}
             className="w-full py-3 bg-mulungu-600 hover:bg-mulungu-700 text-white rounded-xl font-bold shadow-lg shadow-mulungu-200 transition-all flex items-center justify-center gap-2"
           >
             <Download className="w-5 h-5" />
             Adicionar à Tela Inicial
           </button>
           
           <button 
             onClick={() => setIsVisible(false)}
             className="w-full py-2 text-slate-400 text-xs font-medium hover:text-slate-600"
           >
             Agora não, continuar no navegador
           </button>
        </div>
      </div>
    </div>
  );
};