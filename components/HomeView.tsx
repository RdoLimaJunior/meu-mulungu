import React from 'react';
import { GreetingHeader } from './GreetingHeader';
import { NewsCarousel } from './NewsCarousel';
import { ServiceGrid } from './ServiceGrid';
import { LogIn, Fingerprint } from 'lucide-react';
import { Button } from './ui/Forms';

interface HomeViewProps {
  onInteract: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onInteract }) => {
  return (
    // Removido padding global (p-5) para permitir que o Header toque as bordas
    <div className="flex flex-col h-full animate-fade-in overflow-y-auto pb-24 bg-slate-50">
      
      {/* 1. Header Full Width (Sem botões de login) */}
      <GreetingHeader user={null} />
      
      {/* Container para o conteúdo com espaçamento lateral */}
      <div className="px-5 md:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* Logo Institucional (Floating Badge) */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-lg border border-slate-100">
             <img 
               src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
               alt="Brasão Oficial de Mulungu" 
               className="h-14 w-auto object-contain"
             />
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-2">
            Governo Municipal
          </p>
        </div>

        {/* 2. Banner Rotativo de Notícias */}
        <section className="-mx-2 sm:mx-0">
          <NewsCarousel />
        </section>

        {/* 3. Grid de Serviços */}
        <section>
          <ServiceGrid onServiceClick={onInteract} />
        </section>

        {/* 4. Call to Action: Login */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Minha Carteira</h3>
          </div>

          <div 
            onClick={onInteract}
            className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm cursor-pointer group hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-mulungu-600 mb-1">
                  <Fingerprint className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Acesso Restrito</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800">Acesse sua Identidade</h2>
                <p className="text-sm text-slate-500 max-w-[200px]">
                  Faça login para visualizar seu QR Code, documentos e histórico.
                </p>
              </div>
              
              <div className="bg-mulungu-50 p-3 rounded-full group-hover:bg-mulungu-100 transition-colors">
                <LogIn className="w-6 h-6 text-mulungu-600" />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <Button 
                variant="primary" 
                className="w-full text-xs h-auto py-2.5 shadow-none"
                onClick={(e) => {
                  e.stopPropagation();
                  onInteract();
                }}
              >
                Entrar agora
              </Button>
            </div>
          </div>
        </section>

        {/* Footer Infos */}
        <div className="text-center opacity-50 pb-4">
          <p className="text-[10px] text-slate-400">Prefeitura Municipal de Mulungu &copy; 2024</p>
        </div>
      </div>
    </div>
  );
};