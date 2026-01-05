import React from 'react';
import { Citizen } from '../types';
import { QrCode, Sparkles, ShieldCheck, FileText, Calendar, Activity, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col h-full animate-fade-in bg-slate-50 pb-12">
      
      {/* 1. Header Atmosférico Personalizado */}
      <GreetingHeader user={citizen} />

      {/* Conteúdo Principal */}
      <div className="px-5 md:px-8 space-y-8 mt-6">

        {/* 2. Carrossel de Notícias (Contextualizado) */}
        <section className="-mx-2 sm:mx-0">
          <NewsCarousel />
        </section>

        {/* 3. Cartão de Identidade "Premium" */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-mulungu-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Minha Identidade</h3>
            </div>
            <button onClick={onViewProfile} className="text-xs text-mulungu-600 font-bold hover:underline flex items-center gap-0.5">
              Ver dados <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Cartão Visualmente Rico */}
          <div 
            onClick={onShowQrCode}
            className="relative w-full aspect-[1.586/1] overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
          >
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-mulungu-600 via-mulungu-700 to-mulungu-900"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow"></div>

            {/* Conteúdo do Cartão */}
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-10">
              
              {/* Topo do Cartão */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/20">
                    <img src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" alt="Brasão" className="w-6 h-6 object-contain brightness-0 invert" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-mulungu-100 font-bold uppercase tracking-widest leading-none mb-0.5">Prefeitura de</span>
                    <span className="text-sm font-bold text-white tracking-wide leading-none">Mulungu</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/90">Ativo</span>
                </div>
              </div>

              {/* Centro do Cartão */}
              <div className="flex items-end justify-between mt-2">
                <div className="space-y-0.5">
                   <p className="text-[10px] text-mulungu-200 font-medium uppercase tracking-wider">Nome do Cidadão</p>
                   <h2 className="text-lg sm:text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-sm truncate max-w-[200px] sm:max-w-xs">
                     {citizen.fullName}
                   </h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-mulungu-200 font-medium uppercase tracking-wider">CPF</p>
                  <p className="text-sm sm:text-lg font-mono text-white tracking-widest drop-shadow-sm">{maskedCpf}</p>
                </div>
              </div>

              {/* Rodapé do Cartão */}
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-1 text-[9px] text-mulungu-200">
                  <Sparkles className="w-3 h-3" />
                  <span>Válido em todo território</span>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-wider bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm">
                  <QrCode className="w-3 h-3" />
                  Abrir QR
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 4. Acesso Rápido (Novo Feature) */}
        <section className="grid grid-cols-2 gap-4">
          <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md hover:border-blue-100 transition-all text-left group">
            <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Agendamentos</p>
              <p className="text-[10px] text-slate-400 font-medium">Consultas e Exames</p>
            </div>
          </button>
          
          <button className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 hover:shadow-md hover:border-rose-100 transition-all text-left group">
            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Medicamentos</p>
              <p className="text-[10px] text-slate-400 font-medium">Farmácia Básica</p>
            </div>
          </button>
        </section>

        {/* 5. Grid Geral de Serviços */}
        <section>
          <ServiceGrid />
        </section>

      </div>
    </div>
  );
};