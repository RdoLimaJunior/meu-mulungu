import React from 'react';
import { Citizen } from '../types';
import { QrCode, Activity, MapPin } from 'lucide-react';
import { Button } from './ui/Forms';
import { ServiceGrid } from './ServiceGrid';
import { NewsCarousel } from './NewsCarousel';

interface DigitalWalletProps {
  citizen: Citizen;
  onLogout: () => void; // Prop kept for interface compatibility, but logic moved to Header in App.tsx
  onViewProfile?: () => void;
  onShowQrCode?: () => void;
}

export const DigitalWallet: React.FC<DigitalWalletProps> = ({ citizen, onViewProfile, onShowQrCode }) => {
  
  // Format CPF xxx.xxx.xxx-xx to xxx.***.***-xx for privacy
  const maskedCpf = citizen.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4");

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 p-5 md:p-8">
      
      {/* 1. Destaque: Notícias Importantes (Carrossel) */}
      {/* Moved to top as "Featured" content looks better here on modern dashboards */}
      <section>
        <NewsCarousel />
      </section>

      {/* 2. Grid de Acesso Rápido */}
      <section>
        <ServiceGrid />
      </section>

      {/* 3. Cartão de Identidade Digital (Agora abaixo dos serviços, mais discreto mas acessível) */}
      <section>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mulungu-600 to-mulungu-800 text-white shadow-xl md:max-w-md md:mx-auto lg:mx-0 lg:max-w-lg transition-transform hover:scale-[1.01] duration-300">
          
          {/* Background Decoration */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-mulungu-100 mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Identidade Digital
                </h2>
                <h1 className="text-lg font-bold leading-tight">{citizen.fullName}</h1>
              </div>
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <img 
                  src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
                  alt="Brasão" 
                  className="w-6 h-6 object-contain brightness-0 invert" 
                />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase text-mulungu-200 font-medium mb-0.5">CPF</p>
                <p className="text-xl font-mono font-medium tracking-wider">{maskedCpf}</p>
              </div>
              
              <Button 
                onClick={onShowQrCode}
                className="bg-white text-mulungu-700 hover:bg-mulungu-50 border-0 shadow-lg px-3 py-1.5 h-auto text-xs font-bold uppercase tracking-wide flex items-center gap-2"
              >
                <QrCode className="w-3 h-3" />
                QR Code
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Informações Complementares */}
      <section className="bg-blue-50 rounded-xl p-4 border border-blue-100 md:max-w-2xl">
        <div className="flex items-start gap-3">
           <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
             <MapPin className="w-4 h-4" />
           </div>
           <div className="flex-1">
             <h4 className="text-sm font-bold text-blue-900 mb-1">Endereço Cadastrado</h4>
             <p className="text-xs text-blue-700 leading-relaxed">
               {citizen.address.street}, {citizen.address.number} - {citizen.address.district}
               <br />
               {citizen.address.city}/{citizen.address.state}
             </p>
             <button 
               onClick={onViewProfile}
               className="text-xs font-semibold text-blue-600 mt-2 hover:underline"
             >
               Atualizar dados cadastrais &rarr;
             </button>
           </div>
        </div>
      </section>
    </div>
  );
};