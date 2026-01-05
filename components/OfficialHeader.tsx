import React, { useState, useEffect } from 'react';
import { LogIn, LogOut, User, Bell, ChevronDown, UserCircle } from 'lucide-react';
import { Citizen } from '../types';

interface OfficialHeaderProps {
  user: Citizen | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onProfile?: () => void;
}

const ColorStrip = ({ isHidden }: { isHidden: boolean }) => (
  <div 
    className={`w-full flex transition-all duration-500 ease-in-out overflow-hidden ${isHidden ? 'max-h-0 opacity-0' : 'max-h-[9px] opacity-100'}`}
  >
    <div className="flex-1 bg-gradient-to-r from-[#04588C] to-[#057AC0]" />
    <div className="flex-1 bg-gradient-to-r from-[#057AC0] to-[#02731E]" />
    <div className="flex-1 bg-gradient-to-r from-[#02731E] to-[#F29F05]" />
    <div className="flex-1 bg-gradient-to-r from-[#F29F05] to-[#BF0606]" />
    <div className="flex-1 bg-gradient-to-r from-[#BF0606] to-[#DA0707]" />
    <div className="flex-1 bg-[#DA0707]" />
  </div>
);

export const OfficialHeader: React.FC<OfficialHeaderProps> = ({ user, onLogin, onLogout, onProfile }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detecta scroll para animar o header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Logo Principal (Esquerda) */}
          <div className="flex-shrink-0">
            <button onClick={() => window.location.reload()} className="block transition-transform hover:scale-105 focus:outline-none">
              <img 
                src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
                alt="Prefeitura de Mulungu" 
                className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-9 md:h-11' : 'h-10 md:h-14'}`}
              />
            </button>
          </div>

          {/* 2. Área de Acesso (Direita) */}
          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              // Estado: LOGADO
              <div className="flex items-center gap-3 animate-fade-in">
                
                {/* Notificações (Sino) */}
                <button className="relative p-2 text-slate-400 hover:text-mulungu-600 hover:bg-mulungu-50 rounded-full transition-colors group">
                  <Bell className="w-5 h-5" />
                  {/* Badge simulado de notificação */}
                  <span className="absolute top-2 right-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                {/* Perfil com Menu Hover */}
                <div className="relative group perspective-1000">
                  
                  {/* Trigger do Menu */}
                  <button 
                    onClick={onProfile}
                    className="flex items-center gap-2 group-hover:opacity-100 transition-opacity focus:outline-none"
                  >
                     <div className="w-9 h-9 rounded-full bg-mulungu-100 border-2 border-mulungu-200 flex items-center justify-center text-mulungu-700 font-bold shadow-sm group-hover:border-mulungu-400 group-hover:shadow-md transition-all overflow-hidden">
                        {user.photo ? (
                          <img src={user.photo} alt="Perfil" className="w-full h-full object-cover" />
                        ) : (
                          <span>{user.fullName.charAt(0)}</span>
                        )}
                      </div>
                      {/* Indicador de Dropdown (Apenas Desktop) */}
                      <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block group-hover:text-mulungu-600 transition-colors" />
                  </button>

                  {/* Menu Dropdown / Hover Card */}
                  <div className="absolute right-0 top-full pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-2 origin-top-right z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                      
                      {/* Cabeçalho do Card */}
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-mulungu-600 overflow-hidden">
                           {user.photo ? (
                              <img src={user.photo} alt="Perfil" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-6 h-6" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{user.fullName}</p>
                          <p className="text-[10px] font-mono text-slate-500 truncate">
                             CPF: {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**")}
                          </p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="p-2">
                         <button 
                           onClick={onProfile}
                           className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-mulungu-700 rounded-lg transition-colors"
                         >
                           <User className="w-4 h-4" />
                           Meu Perfil Completo
                         </button>
                         
                         <div className="my-1 border-t border-slate-100"></div>
                         
                         <button 
                           onClick={onLogout}
                           className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                         >
                           <LogOut className="w-4 h-4" />
                           Sair do Sistema
                         </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              // Estado: DESLOGADO
              <button 
                onClick={onLogin}
                className="group flex items-center gap-2 bg-mulungu-600 hover:bg-mulungu-700 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg hover:shadow-mulungu-200 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wide">Mulungu Digital</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. Faixa Colorida Inferior (Animada no Scroll) */}
      <ColorStrip isHidden={isScrolled} />
    </header>
  );
};