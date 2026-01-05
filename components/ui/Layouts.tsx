import React, { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

// O MobileContainer agora atua como o wrapper de conteúdo central
export const MobileContainer: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <main className={`
      w-full flex-1 flex flex-col relative
      md:max-w-6xl md:mx-auto md:w-full
      bg-slate-50
      ${className}
    `}>
      {/* 
         Removido o estilo "card flutuante" (shadow/rounded) em desktop 
         para integrar melhor com o Header/Footer oficial flat do governo.
      */}
      <div className="flex-1 flex flex-col md:bg-white md:border-x md:border-slate-200/50 min-h-[600px]">
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