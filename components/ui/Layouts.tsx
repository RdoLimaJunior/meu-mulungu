import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const MobileContainer: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      w-full min-h-screen bg-slate-50 flex flex-col relative
      md:max-w-6xl md:mx-auto md:shadow-2xl md:my-8 md:rounded-[2rem] md:border md:border-slate-200 md:bg-white
      ${className}
    `}>
      {children}
    </div>
  );
};

interface HeaderProps {
  title?: string;
  rightContent?: ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title = "Meu Mulungu", rightContent }) => {
  return (
    <header className="bg-white border-b border-slate-100 px-5 py-4 sticky top-0 z-30 flex items-center justify-between md:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Logo / Brand */}
        <div className="bg-mulungu-50 p-1.5 rounded-lg border border-mulungu-100">
             <img 
            src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
            alt="Brasão Mulungu" 
            className="h-8 w-auto object-contain"
          />
        </div>
        <div>
           <h1 className="font-bold text-lg text-mulungu-700 tracking-tight leading-none">Meu Mulungu</h1>
           <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:block">Prefeitura Municipal</p>
        </div>
      </div>
      
      {/* Right Content (Avatar / Logout) */}
      <div className="flex items-center gap-2">
        {rightContent}
      </div>
    </header>
  );
};

export const PagePadding: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 flex-1 md:p-8 ${className}`}>
      {children}
    </div>
  );
};