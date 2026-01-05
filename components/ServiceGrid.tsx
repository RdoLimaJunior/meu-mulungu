import React from 'react';
import { 
  HeartPulse, 
  GraduationCap, 
  Building2, 
  MessageSquare, 
  Trash2, 
  Bus,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface ServiceItemProps {
  icon: React.ElementType;
  label: string;
  colorClass: string;
  gradientClass: string;
  onClick?: () => void;
  delay?: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ icon: Icon, label, colorClass, gradientClass, onClick, delay = 0 }) => (
  <button 
    onClick={onClick}
    className="group flex flex-col items-center gap-2 p-1 w-full focus:outline-none perspective-1000 active:scale-95 transition-transform"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`
      relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center 
      shadow-sm transition-all duration-300 ease-out
      bg-white border border-slate-100 overflow-hidden
      group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-mulungu-200/40 group-hover:border-mulungu-100
    `}>
      {/* Background Gradient on Hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`} />
      
      {/* Icon */}
      <Icon className={`
        w-7 h-7 sm:w-8 sm:h-8 ${colorClass} 
        filter grayscale opacity-70
        transition-all duration-300 ease-spring
        group-hover:grayscale-0 group-hover:opacity-100
        group-hover:rotate-3 group-hover:scale-110
        relative z-10
      `} />
      
      {/* Shine Effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/80 to-transparent opacity-40" />
    </div>
    
    <span className="text-[11px] sm:text-xs font-bold text-slate-600 text-center leading-tight group-hover:text-mulungu-700 transition-colors duration-300 px-1 line-clamp-2 h-8 flex items-start justify-center w-full">
      {label}
    </span>
  </button>
);

interface ServiceGridProps {
  onServiceClick?: (serviceName: string) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = React.memo(({ onServiceClick }) => {
  const services = [
    { label: "Saúde", icon: HeartPulse, color: "text-rose-500", gradient: "bg-gradient-to-br from-rose-500 to-rose-600" },
    { label: "Educação", icon: GraduationCap, color: "text-blue-500", gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { label: "IPTU", icon: Building2, color: "text-emerald-500", gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600" },
    { label: "Transporte", icon: Bus, color: "text-indigo-500", gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
    { label: "Ouvidoria", icon: MessageSquare, color: "text-orange-500", gradient: "bg-gradient-to-br from-orange-500 to-orange-600" },
    { label: "Limpeza", icon: Trash2, color: "text-green-600", gradient: "bg-gradient-to-br from-green-500 to-green-700" },
    { label: "Certidões", icon: FileText, color: "text-slate-500", gradient: "bg-gradient-to-br from-slate-400 to-slate-600" },
    { label: "Defesa Civil", icon: AlertTriangle, color: "text-amber-500", gradient: "bg-gradient-to-br from-amber-400 to-amber-600" },
  ];

  return (
    <div className="space-y-4 animate-slide-in">
      <div className="flex items-center justify-between px-2 border-l-4 border-mulungu-500 pl-3 py-1 bg-gradient-to-r from-mulungu-50 to-transparent rounded-r-lg">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Serviços Rápidos</h3>
      </div>
      
      {/* 
         GRID RESPONSIVO OTIMIZADO:
         - Mobile: grid-cols-3 (Aumenta touch target para dedos)
         - Tablet/Desktop: sm:grid-cols-4 (Aproveita largura)
      */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-6 px-1 py-2">
        {services.map((service, index) => (
          <ServiceItem 
            key={index}
            icon={service.icon}
            label={service.label}
            colorClass={service.color}
            gradientClass={service.gradient}
            delay={index * 50}
            onClick={() => onServiceClick && onServiceClick(service.label)}
          />
        ))}
      </div>
    </div>
  );
});

ServiceGrid.displayName = 'ServiceGrid';