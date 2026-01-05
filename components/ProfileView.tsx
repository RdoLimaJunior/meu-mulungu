import React from 'react';
import { Citizen } from '../types';
import { ArrowLeft, User, MapPin, Phone, Calendar, Hash, FileText, Heart } from 'lucide-react';
import { Button } from './ui/Forms';

interface ProfileViewProps {
  citizen: Citizen;
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ citizen, onBack }) => {
  // Helper to format date
  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Helper to format CPF
  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-md px-2 -mx-2">
      <div className="bg-slate-50 p-2 rounded-lg text-mulungu-600 shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-slate-800 font-medium break-all">{value || "Não informado"}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-slide-in">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-mulungu-600 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Seu Perfil</h1>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-28 h-28 bg-mulungu-100 rounded-full flex items-center justify-center text-mulungu-600 mb-3 shadow-inner transform transition-transform hover:scale-105 duration-300 border-4 border-white overflow-hidden ring-2 ring-slate-100">
             {citizen.photo ? (
                <img src={citizen.photo} alt="Foto de Perfil" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12" />
              )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 text-center">{citizen.fullName}</h2>
          <p className="text-sm text-slate-500">Cidadão de Mulungu</p>
        </div>

        {/* Section: Personal Data */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase">Dados Pessoais</h3>
          </div>
          <div className="p-4">
            <InfoItem icon={Hash} label="CPF" value={formatCPF(citizen.cpf)} />
            <InfoItem icon={Calendar} label="Data de Nascimento" value={formatDate(citizen.birthDate)} />
            <InfoItem icon={Heart} label="Nome da Mãe" value={citizen.motherName} />
            <InfoItem icon={FileText} label="Cartão SUS" value={citizen.susCard || ''} />
          </div>
        </div>

        {/* Section: Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase">Contato & Endereço</h3>
          </div>
          <div className="p-4">
            <InfoItem icon={Phone} label="Celular" value={citizen.phoneNumber} />
            <InfoItem 
              icon={MapPin} 
              label="Endereço Completo" 
              value={`${citizen.address.street}, ${citizen.address.number}, ${citizen.address.district}, ${citizen.address.city} - ${citizen.address.state}`} 
            />
            <InfoItem icon={MapPin} label="CEP" value={citizen.address.cep} />
          </div>
        </div>

        <div className="pt-4">
           <Button variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors">
             Solicitar Alteração de Dados
           </Button>
           <p className="text-[10px] text-center text-slate-400 mt-2">
             Para segurança, alterações sensíveis devem ser feitas presencialmente na prefeitura.
           </p>
        </div>
      </div>
    </div>
  );
};