import React from 'react';
import { DynamicHero } from './DynamicHero';
import { NewsCarousel } from './NewsCarousel';
import { ServiceGrid } from './ServiceGrid';
import { LogIn, Fingerprint, ChevronRight } from 'lucide-react';
import { PwaInstaller } from './PwaInstaller';

interface HomeViewProps {
  onInteract: (serviceName: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onInteract }) => {
  return (
    <div className="flex flex-col h-full animate-fade-in bg-slate-50 pb-12">
      
      {/* TRIGGER PWA BANNER NA HOME */}
      <PwaInstaller mode="banner" />

      {/* 1. Novo Hero Dinâmico (Lógica de timer embutida no componente) */}
      <DynamicHero user={null} />
      
      {/* Container de Conteúdo */}
      <div className="px-5 md:px-8 mt-4 relative z-20 space-y-6">
        
        {/* 2. Banner de Notícias */}
        <section className="-mx-2 sm:mx-0">
          <NewsCarousel />
        </section>

        {/* 3. Mulungu Digital (Call to Action Principal) */}
        <section>
          <div 
            onClick={() => onInteract("Carteira Digital")} 
            className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm cursor-pointer group hover:shadow-lg hover:border-mulungu-200 transition-all duration-300"
            role="button"
            tabIndex={0}
          >
            {/* Barra lateral de destaque */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-mulungu-500"></div>
            
            <div className="p-5 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-mulungu-600 mb-1">
                  <Fingerprint className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Mulungu Digital</span>
                </div>
                <h2 className="text-lg font-bold text-slate-800">Acesse sua Carteira</h2>
                <p className="text-sm text-slate-500 max-w-[220px] leading-tight">
                  Documentos, QR Code e histórico de atendimentos em um só lugar.
                </p>
              </div>
              
              <div className="bg-mulungu-50 p-3 rounded-full group-hover:bg-mulungu-600 group-hover:text-white transition-all duration-300 text-mulungu-600 shadow-sm">
                <LogIn className="w-6 h-6" />
              </div>
            </div>
            
            {/* Botão Inferior Integrado */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center group-hover:bg-mulungu-50/50 transition-colors">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Acesso Gov.br</span>
              <span className="text-xs font-bold text-mulungu-700 flex items-center gap-1 group-hover:underline">
                Entrar agora <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </section>

        {/* 4. Grid de Serviços */}
        <section className="pb-4">
          <ServiceGrid onServiceClick={onInteract} />
        </section>

      </div>
    </div>
  );
};