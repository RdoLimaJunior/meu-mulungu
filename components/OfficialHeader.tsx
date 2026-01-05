import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Citizen } from '../types';

interface OfficialHeaderProps {
  user: Citizen | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
}

const ColorStrip = () => (
  <div className="w-full flex h-[9px]">
    <div className="flex-1 bg-gradient-to-r from-[#04588C] to-[#057AC0]" />
    <div className="flex-1 bg-gradient-to-r from-[#057AC0] to-[#02731E]" />
    <div className="flex-1 bg-gradient-to-r from-[#02731E] to-[#F29F05]" />
    <div className="flex-1 bg-gradient-to-r from-[#F29F05] to-[#BF0606]" />
    <div className="flex-1 bg-gradient-to-r from-[#BF0606] to-[#DA0707]" />
    <div className="flex-1 bg-[#DA0707]" />
  </div>
);

export const OfficialHeader: React.FC<OfficialHeaderProps> = ({ user, onLogin, onLogout, onProfile }) => {
  return (
    <header className="w-full bg-white shadow-sm z-50 relative">
      
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo Principal (Esquerda) */}
          <div className="flex-shrink-0">
            <button onClick={() => window.location.reload()} className="block transition-transform hover:scale-105">
              <img 
                src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
                alt="Prefeitura de Mulungu" 
                className="h-10 md:h-14 w-auto object-contain"
              />
            </button>
          </div>

          {/* 2. Área de Acesso (Direita) */}
          <div className="flex items-center">
            {user ? (
              // Estado: LOGADO
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="flex flex-col items-end mr-1 hidden sm:flex">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Olá,</span>
                  <span className="text-xs font-bold text-mulungu-700 max-w-[100px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </div>

                <button 
                  onClick={onProfile} 
                  className="relative group transition-transform active:scale-95"
                  title="Meu Perfil"
                >
                  <div className="w-9 h-9 rounded-full bg-mulungu-100 border-2 border-mulungu-200 flex items-center justify-center text-mulungu-700 font-bold shadow-sm group-hover:bg-mulungu-200 group-hover:border-mulungu-300 transition-colors">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                </button>

                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Sair do sistema"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // Estado: DESLOGADO
              <button 
                onClick={onLogin}
                className="group flex items-center gap-2 bg-mulungu-600 hover:bg-mulungu-700 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Acesso Cidadão</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. Faixa Colorida Inferior */}
      <ColorStrip />
    </header>
  );
};