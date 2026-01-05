import React from 'react';
import { Mail, Facebook, Instagram } from 'lucide-react';

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

const SEALS = [
  { src: "https://www.mulungu.ce.gov.br/imagens/imagensselos/verde-p.png", alt: "Selo Município Verde" },
  { src: "https://www.mulungu.ce.gov.br/imagens/imagensselos/unicef-2021-2024-p.png", alt: "Selo UNICEF" },
  { src: "https://www.mulungu.ce.gov.br/imagens/imagensselos/sebrae-ouro-p.png", alt: "Selo SEBRAE Ouro" },
  { src: "https://www.mulungu.ce.gov.br/imagens/imagensselos/tce-ce-sust-p.png", alt: "Selo TCE Ceará Sustentável" },
  { src: "https://www.mulungu.ce.gov.br/imagens/imagensselos/alfa-ouro-p.png", alt: "Selo Alfabetização Ouro" },
];

export const OfficialFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Alterado de bg-[#333333] para bg-mulungu-900 (Verde Oficial Escuro)
    <footer className="w-full bg-mulungu-900 text-white flex flex-col">
      
      {/* 1. Google Maps Iframe */}
      <div className="w-full h-[200px] bg-slate-200">
        <iframe 
          title="Mapa de Mulungu"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.5660700753597!2d-38.99775092632564!3d-4.304105246368976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7bf17da7aa9fa6b%3A0x6a69f21671cc6578!2sPrefeitura%20Municipal%20de%20Mulungu!5e0!3m2!1spt-BR!2sbr!4v1766123684091!5m2!1spt-BR!2sbr"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* 2. Faixa Colorida */}
      <ColorStrip />

      {/* 3. Conteúdo Principal do Footer */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
        
        {/* Logo Vazada */}
        <img 
          src="https://www.mulungu.ce.gov.br/imagens/logovazada.png?time=1767550527" 
          alt="Logo Vazada" 
          className="h-16 w-auto opacity-90 drop-shadow-md"
        />

        {/* Selos (Versão Mobile/Desktop) */}
        <div className="flex flex-wrap justify-center gap-2 bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
          {SEALS.map((selo, index) => (
            <img 
              key={index}
              src={selo.src} 
              alt={selo.alt}
              className="w-[50px] md:w-[60px] h-auto object-contain hover:scale-110 transition-transform duration-200"
            />
          ))}
        </div>

        {/* Título/Texto */}
        <div className="space-y-1">
          <h1 className="text-white text-lg md:text-xl font-bold opacity-95">
            Prefeitura Municipal de Mulungu
          </h1>
          <p className="text-mulungu-200 text-xs md:text-sm font-medium">
            Trabalho e Transparência
          </p>
        </div>

      </div>

      {/* 4. Barra de Redes Sociais e Copyright */}
      <div className="bg-mulungu-950/50 py-4 border-t border-white/10 backdrop-blur-sm">
        <div className="container mx-auto flex justify-center gap-6">
           <a href="https://mail.hostinger.com" target="_blank" rel="noreferrer" className="text-white hover:text-mulungu-200 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 transform duration-200">
             <Mail className="w-5 h-5" />
           </a>
           <a href="https://www.facebook.com/profile.php?id=100089061654030" target="_blank" rel="noreferrer" className="text-white hover:text-blue-300 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 transform duration-200">
             <Facebook className="w-5 h-5" />
           </a>
           <a href="https://www.instagram.com/prefeiturademulunguce/" target="_blank" rel="noreferrer" className="text-white hover:text-pink-300 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 hover:scale-110 transform duration-200">
             <Instagram className="w-5 h-5" />
           </a>
        </div>
        <p className="text-center text-[10px] text-mulungu-200/60 mt-3">
          &copy; {currentYear} Governo Municipal de Mulungu - CE
        </p>
      </div>
    </footer>
  );
};