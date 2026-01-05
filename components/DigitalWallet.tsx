import React from 'react';
import { Citizen } from '../types';
import { QrCode, Sparkles, ShieldCheck } from 'lucide-react';
import { ServiceGrid } from './ServiceGrid';
import { NewsCarousel } from './NewsCarousel';
import { GreetingHeader } from './GreetingHeader';

interface DigitalWalletProps {
  citizen: Citizen;
  onLogout: () => void;
  onViewProfile?: () => void;
  onShowQrCode?: () => void;
}

export const DigitalWallet: React.FC<DigitalWalletProps> = ({ citizen, onLogout, onViewProfile, onShowQrCode }) => {
  
  const maskedCpf = citizen.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");

  return (
    // Removido padding global (p-5) para header sangrar
    <div className="flex flex-col h-full animate-fade-in overflow-y-auto pb-24 bg-slate-50">
      
      {/* 1. Header (Full Width) */}
      <GreetingHeader 
        user={citizen} 
      />

      {/* Conteúdo com Padding */}
      <div className="px-5 md:px-8 space-y-8 mt-6">

        {/* 2. Destaques (Notícias) */}
        <section className="-mx-2 sm:mx-0">
          <NewsCarousel />
        </section>

        {/* 3. Grid de Serviços */}
        <section>
          <ServiceGrid />
        </section>

        {/* 4. Cartão de Identidade "Premium" */}
        <section className="space-y-4 pb-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-mulungu-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Identidade Digital</h3>
            </div>
            <button onClick={onViewProfile} className="text-xs text-mulungu-600 font-bold hover:underline">
              Ver detalhes
            </button>
          </div>

          {/* Cartão com Efeito Holográfico/Glass */}
          <div 
            onClick={onShowQrCode}
            className="relative w-full aspect-[1.586/1] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
          >
            {/* Fundo Dinâmico */}
            <div className="absolute inset-0 bg-gradient-to-br from-mulungu-600 via-mulungu-700 to-mulungu-900"></div>
            
            {/* Padrão Geométrico de Fundo */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Efeitos de Luz (Glows) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>

            {/* Holographic Shine on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none"></div>

            {/* Conteúdo do Cartão */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              
              {/* Topo do Cartão */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20 shadow-sm">
                    <img 
                      src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
                      alt="Brasão" 
                      className="w-8 h-8 object-contain brightness-0 invert drop-shadow-md" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-mulungu-100 font-bold uppercase tracking-widest">Prefeitura de</span>
                    <span className="text-sm font-bold text-white tracking-wide -mt-1">Mulungu</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Ativo</span>
                </div>
              </div>

              {/* Centro do Cartão (Chip simulado + Nome) */}
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                   {/* Chip Simulado */}
                   <div className="w-10 h-7 rounded-md border border-yellow-500/50 bg-gradient-to-br from-yellow-200 to-yellow-500 mb-4 opacity-80 shadow-inner flex items-center justify-center relative overflow-hidden">
                      <div className="absolute w-full h-[1px] bg-yellow-700/50 top-2"></div>
                      <div className="absolute w-full h-[1px] bg-yellow-700/50 bottom-2"></div>
                      <div className="absolute h-full w-[1px] bg-yellow-700/50 left-3"></div>
                      <div className="absolute h-full w-[1px] bg-yellow-700/50 right-3"></div>
                   </div>

                   <p className="text-xs text-mulungu-200 font-medium uppercase tracking-wider">Nome do Cidadão</p>
                   <h2 className="text-xl md:text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-sm truncate max-w-[280px]">
                     {citizen.fullName}
                   </h2>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-mulungu-200 font-medium uppercase tracking-wider mb-0.5">CPF</p>
                  <p className="text-lg font-mono text-white tracking-widest drop-shadow-sm">{maskedCpf}</p>
                </div>
              </div>

              {/* Rodapé do Cartão */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-1 text-[10px] text-mulungu-200">
                  <Sparkles className="w-3 h-3" />
                  <span>Válido em todo território municipal</span>
                </div>
                
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <QrCode className="w-4 h-4" />
                  Abrir QR
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};