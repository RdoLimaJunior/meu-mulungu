import React from 'react';
import { 
  HeartPulse, 
  GraduationCap, 
  Building2, 
  MessageSquare, 
  Trash2, 
  Bus,
  ChevronRight 
} from 'lucide-react';

interface ServiceItemProps {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  bgClass: string;
  onClick?: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, label, colorClass, bgClass, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100 gap-3 transition-all duration-200 hover:shadow-md hover:border-mulungu-200 hover:-translate-y-1 active:scale-95 group"
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-xs font-semibold text-slate-600 text-center leading-tight group-hover:text-mulungu-700">
      {label}
    </span>
  </button>
);

export const ServiceGrid: React.FC = () => {
  const services = [
    { 
      label: "Saúde / SUS", 
      icon: HeartPulse, 
      color: "text-red-600", 
      bg: "bg-red-50" 
    },
    { 
      label: "Educação", 
      icon: GraduationCap, 
      color: "text-blue-600", 
      bg: "bg-blue-50" 
    },
    { 
      label: "IPTU / Tributos", 
      icon: Building2, 
      color: "text-mulungu-600", 
      bg: "bg-mulungu-50" 
    },
    { 
      label: "Ouvidoria", 
      icon: MessageSquare, 
      color: "text-orange-600", 
      bg: "bg-orange-50" 
    },
    { 
      label: "Coleta de Lixo", 
      icon: Trash2, 
      color: "text-green-700", 
      bg: "bg-green-50" 
    },
    { 
      label: "Transporte", 
      icon: Bus, 
      color: "text-purple-600", 
      bg: "bg-purple-50" 
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Serviços Municipais</h3>
        <button className="text-xs text-mulungu-600 font-medium flex items-center hover:underline">
          Ver todos <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((service, index) => (
          <ServiceItem 
            key={index}
            icon={service.icon}
            label={service.label}
            colorClass={service.color}
            bgClass={service.bg}
          />
        ))}
      </div>
    </div>
  );
};