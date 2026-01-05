import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const MobileContainer: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <main className={`
      w-full flex-1 flex flex-col relative
      md:max-w-5xl md:mx-auto
      bg-slate-50
      shadow-none md:shadow-xl md:my-6 md:rounded-2xl md:overflow-hidden md:border md:border-slate-100
      ${className}
    `}>
      {/* 
         Ajuste de Performance de Layout:
         - min-h dinâmico garante que o conteúdo empurre o footer para baixo
         - Evita "layout shift" ao carregar conteúdo
      */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-250px)] bg-slate-50">
        {children}
      </div>
    </main>
  );
};

export const PagePadding: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-5 flex-1 md:p-8 ${className}`}>
      {children}
    </div>
  );
};