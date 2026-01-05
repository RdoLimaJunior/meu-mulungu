import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Meu Mulungu | Acesso Cidadão',
  description: 'Aplicativo oficial de serviços digitais do Município de Mulungu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased selection:bg-mulungu-100 selection:text-mulungu-900">
        {children}
      </body>
    </html>
  );
}