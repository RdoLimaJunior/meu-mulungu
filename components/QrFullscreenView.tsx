import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Citizen } from '../types';
import { X } from 'lucide-react';

interface QrFullscreenViewProps {
  citizen: Citizen;
  onClose: () => void;
}

export const QrFullscreenView: React.FC<QrFullscreenViewProps> = ({ citizen, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-white relative animate-zoom-in z-50">
      {/* Close Button */}
      <button 
        onClick={onClose}
        aria-label="Fechar QR Code"
        className="absolute top-4 right-4 p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 z-50 transition-colors focus:outline-none focus:ring-2 focus:ring-mulungu-500 active:scale-95"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div>
          <img 
            src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
            alt="Brasão Mulungu" 
            className="w-20 h-auto mx-auto mb-4 drop-shadow-sm"
          />
          <h2 className="text-2xl font-bold text-slate-900">Mulungu Digital</h2>
          <p className="text-slate-500">Apresente este código no atendimento</p>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-mulungu-500 transform transition-transform hover:scale-105 duration-300">
          <QRCodeSVG 
            value={citizen.qrCodeData} 
            size={250} 
            level="H" 
            fgColor="#000000" 
            bgColor="#FFFFFF" 
            imageSettings={{
              src: "https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382", 
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div>
          <p className="text-lg font-bold text-slate-800">{citizen.fullName}</p>
          <p className="font-mono text-slate-500 mt-1">
            {citizen.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
          </p>
        </div>
      </div>

      <div className="p-6 bg-slate-50 text-center">
        <p className="text-xs text-slate-400">
          O brilho da tela foi ajustado automaticamente para facilitar a leitura.
        </p>
      </div>
    </div>
  );
};