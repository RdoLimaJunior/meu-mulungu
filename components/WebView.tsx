import React, { useState } from 'react';
import { X, ExternalLink, Loader2, Globe, RefreshCw } from 'lucide-react';

interface WebViewProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const WebView: React.FC<WebViewProps> = ({ url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0); // Para forçar reload do iframe

  const handleOpenExternal = () => {
    window.open(url, '_blank');
  };

  const handleReload = () => {
    setLoading(true);
    setKey(prev => prev + 1);
  };

  return (
    // Alterado para fixed inset-0 e z-[9999] para cobrir toda a aplicação
    <div className="fixed inset-0 z-[9999] flex flex-col bg-white animate-slide-in w-screen h-screen overflow-hidden">
      
      {/* Header do Navegador Interno - Estilo Native App */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-md relative z-20">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <button 
            onClick={onClose}
            className="p-2 -ml-2 text-slate-500 hover:text-mulungu-600 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col flex-1 min-w-0">
            <h2 className="text-sm font-bold text-slate-800 truncate leading-tight">{title}</h2>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
               <Globe className="w-3 h-3 flex-shrink-0" />
               <span className="truncate">{new URL(url).hostname}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handleReload}
            className="p-2 text-slate-500 hover:text-mulungu-600 rounded-full hover:bg-slate-100 transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={handleOpenExternal}
            className="p-2 text-mulungu-600 bg-mulungu-50 rounded-full hover:bg-mulungu-100 transition-colors ml-1"
            title="Abrir no Navegador Externo"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Área do Iframe - Full Height */}
      <div className="flex-1 relative bg-slate-100 w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 z-10 bg-slate-50">
            <div className="bg-white p-4 rounded-full shadow-lg mb-3">
               <Loader2 className="w-8 h-8 animate-spin text-mulungu-600" />
            </div>
            <p className="text-sm font-bold text-slate-600">Carregando portal...</p>
            <p className="text-xs text-slate-400 mt-1">{title}</p>
          </div>
        )}
        
        <iframe
          key={key}
          src={url}
          className="w-full h-full border-0 block"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          title={title}
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        />
      </div>
    </div>
  );
};