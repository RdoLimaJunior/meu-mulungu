import React, { useEffect, useState, useMemo } from 'react';
import { Citizen } from '../types';
import { 
  Loader2, MapPin, Droplets, Wind, RefreshCcw,
  Sun, Moon, CloudRain, Cloud, CloudLightning, Snowflake, CloudFog, Sunset, ThermometerSun
} from 'lucide-react';
import { ContextService, MULUNGU_COORDS } from '../services/citizenService';

interface DynamicHeroProps {
  user: Citizen | null;
}

interface WeatherData {
  temp: number;
  description: string;
  main: string;
  icon: string;
  city: string;
  isLocal: boolean;
  wind: number;
  humidity: number;
}

// --- TIPOS DA ENGINE DE ATMOSFERA ---

type Season = 'rainy_season' | 'dry_season' | 'windy_season'; // Adaptado para o Ceará
type TimePeriod = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'golden_hour' | 'dusk' | 'night' | 'midnight';
type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'mist';

// Lógica de Estações para o Nordeste/Ceará
const getRegionSeason = (month: number): Season => {
  // Quadra Chuvosa (Fev - Mai)
  if (month >= 1 && month <= 4) return 'rainy_season';
  // Época dos Ventos (Ago - Out)
  if (month >= 7 && month <= 9) return 'windy_season';
  // Seca / Verão (Resto)
  return 'dry_season';
};

const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 0 && hour < 5) return 'midnight';
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'noon';
  if (hour >= 15 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 18) return 'golden_hour';
  if (hour >= 18 && hour < 19) return 'dusk';
  return 'night';
};

const normalizeWeather = (main: string): WeatherCondition => {
  const m = main.toLowerCase();
  if (m.includes('rain')) return 'rain';
  if (m.includes('drizzle')) return 'drizzle';
  if (m.includes('thunder')) return 'thunderstorm';
  if (m.includes('cloud')) return 'clouds';
  if (m.includes('mist') || m.includes('fog') || m.includes('haze')) return 'mist';
  return 'clear';
};

// --- CONFIGURAÇÃO VISUAL ---

const getAtmosphereTheme = (
  weather: WeatherCondition,
  period: TimePeriod,
  season: Season
) => {
  let gradient = '';
  let particleType: 'sun' | 'moon' | 'cloud' | 'rain' | 'stars' | 'none' = 'none';
  const isDay = ['dawn', 'morning', 'noon', 'afternoon', 'golden_hour'].includes(period);

  // 1. GRADIENTES BASE (Tempo e Estação)
  if (isDay) {
    if (period === 'golden_hour') {
      gradient = 'bg-gradient-to-br from-orange-500 via-amber-500 to-purple-600'; // Pôr do sol Mulungu
      particleType = 'sun';
    } else if (period === 'dawn') {
      gradient = 'bg-gradient-to-br from-indigo-400 via-purple-400 to-orange-300';
      particleType = 'sun';
    } else if (period === 'noon') {
       // Sol a pino
       gradient = 'bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600'; 
       particleType = 'sun';
    } else {
       // Dia comum
       gradient = 'bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500';
       particleType = 'sun';
    }
  } else {
    // NOITE
    if (period === 'dusk') {
      gradient = 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900';
    } else if (period === 'midnight') {
      gradient = 'bg-gradient-to-br from-slate-950 via-black to-indigo-950';
    } else {
      gradient = 'bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900';
    }
    
    // Noites limpas no sertão têm estrelas
    if (weather === 'clear' || weather === 'clouds') {
      particleType = 'stars';
    } else {
      particleType = 'moon';
    }
  }

  // 2. OVERRIDES DE CLIMA (Dominam a luz do sol)
  switch (weather) {
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      gradient = isDay 
        ? 'bg-gradient-to-br from-slate-600 via-slate-500 to-blue-800' // Dia chuvoso (cinza azulado)
        : 'bg-gradient-to-br from-slate-900 via-gray-900 to-black';    // Noite chuvosa
      particleType = 'rain';
      break;
    case 'clouds':
      if (isDay) {
        gradient = 'bg-gradient-to-br from-slate-300 via-blue-200 to-white'; // Nublado claro
        particleType = 'cloud';
      }
      break;
    case 'mist':
      gradient = isDay
        ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-gray-200' // Neblina serra
        : 'bg-gradient-to-br from-slate-800 to-gray-900';
      particleType = 'cloud';
      break;
  }

  return { gradient, particleType, isDay };
};

export const DynamicHero: React.FC<DynamicHeroProps> = ({ user }) => {
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [mulunguWeather, setMulunguWeather] = useState<WeatherData | null>(null);
  const [activeWeather, setActiveWeather] = useState<'local' | 'mulungu'>('local');
  
  // Controle de UI
  const [canToggle, setCanToggle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [now, setNow] = useState(new Date());

  // Mensagem de boas-vindas baseada na hora
  const { greeting, firstName } = useMemo(() => {
    const hour = now.getHours();
    let g = 'Bom dia';
    if (hour >= 12 && hour < 18) g = 'Boa tarde';
    else if (hour >= 18) g = 'Boa noite';

    return {
      greeting: g,
      firstName: user ? user.fullName.split(' ')[0] : 'Cidadão'
    };
  }, [user, now]);

  // Busca de Dados
  useEffect(() => {
    let mounted = true;
    const timeInterval = setInterval(() => setNow(new Date()), 60000);

    const loadData = async () => {
      try {
        const mulunguData = await ContextService.getWeather(MULUNGU_COORDS.lat, MULUNGU_COORDS.lon);
        if (mounted) setMulunguWeather(mulunguData);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const lat = pos.coords.latitude;
              const lon = pos.coords.longitude;
              const localData = await ContextService.getWeather(lat, lon);
              
              if (mounted) {
                setLocalWeather(localData);
                const distLat = Math.abs(lat - MULUNGU_COORDS.lat);
                const distLon = Math.abs(lon - MULUNGU_COORDS.lon);
                
                // Se estiver longe (> ~20km), permite alternar
                if (distLat > 0.2 || distLon > 0.2) {
                  setCanToggle(true);
                  setActiveWeather('local');
                } else {
                  setCanToggle(false);
                  setActiveWeather('mulungu');
                }
              }
            },
            () => { if (mounted) { setCanToggle(false); setActiveWeather('mulungu'); } },
            { timeout: 5000 }
          );
        } else {
          if (mounted) { setCanToggle(false); setActiveWeather('mulungu'); }
        }
      } catch (e) { console.warn("Weather error"); }
    };

    loadData();
    return () => { mounted = false; clearInterval(timeInterval); };
  }, []);

  const displayWeather = activeWeather === 'local' ? (localWeather || mulunguWeather) : mulunguWeather;

  // Cálculo do Tema Visual
  const theme = useMemo(() => {
    if (!displayWeather) return { gradient: 'bg-slate-200', particleType: 'none', isDay: true };
    const condition = normalizeWeather(displayWeather.main);
    const period = getTimePeriod(now.getHours());
    const season = getRegionSeason(now.getMonth());
    return getAtmosphereTheme(condition, period, season);
  }, [displayWeather, now]);

  const toggleWeather = () => {
    if (!canToggle) return;
    
    // Inicia a transição (Fade Out)
    setIsTransitioning(true);
    
    // Aguarda animação de saída para trocar os dados
    setTimeout(() => {
      setActiveWeather(prev => prev === 'local' ? 'mulungu' : 'local');
      
      // Inicia a transição de entrada (Fade In)
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Ícone Dinâmico
  const WeatherIcon = useMemo(() => {
    if (!displayWeather) return Sun;
    const main = displayWeather.main.toLowerCase();
    
    if (main.includes('rain')) return CloudRain;
    if (main.includes('thunder')) return CloudLightning;
    if (main.includes('drizzle')) return CloudRain;
    if (main.includes('snow')) return Snowflake;
    if (main.includes('mist') || main.includes('fog')) return CloudFog;
    if (main.includes('cloud')) return Cloud;
    
    const h = now.getHours();
    if (h >= 17 && h < 18) return Sunset;
    return theme.isDay ? Sun : Moon;
  }, [displayWeather, theme.isDay, now]);

  // Classe utilitária para animação de troca de texto
  const transitionClass = `transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`;

  return (
    <div className={`
      relative w-full h-48 sm:h-52 rounded-b-[2.5rem] shadow-xl overflow-hidden 
      transition-all duration-1000 ease-in-out 
      ${theme.gradient}
    `}>
      
      {/* --- CAMADA 1: ANIMAÇÕES DE FUNDO --- */}
      
      {/* Sol / Lua (Glow) */}
      <div className={`absolute transition-all duration-1000 ${
        theme.particleType === 'sun' 
          ? 'top-[-40px] right-[-40px] w-72 h-72 bg-gradient-to-br from-yellow-300/40 to-transparent rounded-full blur-3xl opacity-100' 
          : theme.particleType === 'moon' || theme.particleType === 'stars'
            ? 'top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl opacity-100'
            : 'opacity-0'
      }`} />

      {/* Estrelas (CSS Animation) */}
      {theme.particleType === 'stars' && (
        <div className="absolute inset-0 z-0 opacity-80"
             style={{
               backgroundImage: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px)',
               backgroundSize: '550px 550px',
               backgroundPosition: '0 0',
               animation: 'twinkle 10s linear infinite'
             }}>
        </div>
      )}

      {/* Chuva (CSS Animation) */}
      {theme.particleType === 'rain' && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.5), transparent)', 
               backgroundSize: '1px 40px', 
               animation: 'rain 0.3s linear infinite' 
             }}>
        </div>
      )}

      {/* Nuvens Flutuantes */}
      {(theme.particleType === 'cloud' || theme.particleType === 'rain') && (
        <>
           <div className="absolute top-[-20px] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float opacity-60" />
           <div className="absolute bottom-[-40px] right-[20%] w-48 h-48 bg-white/10 rounded-full blur-3xl animate-float-delayed opacity-50" />
        </>
      )}

      {/* --- CAMADA 2: CONTEÚDO --- */}
      <div className="relative h-full flex flex-col justify-between p-6 z-10 text-white">
        
        {/* Topo: Localização */}
        <div className="flex justify-between items-start">
          <button 
            onClick={toggleWeather}
            disabled={!canToggle || isTransitioning}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 group
              ${canToggle 
                ? 'bg-black/10 border-white/20 hover:bg-black/20 cursor-pointer active:scale-95' 
                : 'bg-white/10 border-white/10 cursor-default pl-3'}
            `}
          >
            <MapPin className={`w-4 h-4 text-white drop-shadow-sm ${isTransitioning ? 'animate-bounce' : ''}`} />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase font-medium opacity-80 tracking-wide">
                {activeWeather === 'local' ? 'Sua Localização' : 'Previsão em'}
              </span>
              <span className={`text-xs sm:text-sm font-bold tracking-wider uppercase truncate max-w-[150px] drop-shadow-md ${transitionClass}`}>
                {displayWeather ? displayWeather.city : 'MULUNGU - CE'}
              </span>
            </div>
            {canToggle && (
              <RefreshCcw className={`w-3.5 h-3.5 text-white/80 ml-1 transition-transform duration-500 ${isTransitioning ? 'rotate-180' : 'group-hover:rotate-45'}`} />
            )}
          </button>
        </div>

        {/* Base: Informações Principais */}
        <div className="flex items-end justify-between w-full pb-2">
          
          {/* Saudação e Dados */}
          <div className="flex-1">
            <p className="text-sm font-medium opacity-90 mb-0.5 drop-shadow-md text-white/90">
              {greeting},
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-lg truncate max-w-[220px] tracking-tight">
              {firstName}
            </h2>
            
            {/* Chips de Clima */}
            {displayWeather && (
              <div className={`flex items-center gap-2 mt-3 ${transitionClass}`}>
                <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1.5 rounded-lg backdrop-blur-md border border-white/10 shadow-sm" title="Vento">
                  <Wind className="w-3.5 h-3.5" /> 
                  <span className="text-[10px] font-bold">{displayWeather.wind} km/h</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1.5 rounded-lg backdrop-blur-md border border-white/10 shadow-sm" title="Umidade">
                  <Droplets className="w-3.5 h-3.5" /> 
                  <span className="text-[10px] font-bold">{displayWeather.humidity}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Temperatura e Ícone */}
          <div className="flex flex-col items-end">
            {displayWeather ? (
              <div className={`flex flex-col items-end ${transitionClass}`}>
                <div className="relative">
                  <WeatherIcon className={`
                    w-12 h-12 text-white drop-shadow-xl mb-1
                    ${theme.isDay ? 'animate-pulse-slow' : ''}
                    ${theme.particleType === 'rain' ? 'animate-bounce' : ''}
                  `} />
                  {/* Indicador de "Sensação" se estiver muito quente */}
                  {displayWeather.temp > 32 && (
                    <div className="absolute -top-1 -right-1">
                       <ThermometerSun className="w-4 h-4 text-orange-300 drop-shadow-sm animate-pulse" />
                    </div>
                  )}
                </div>
                
                <span className="text-6xl font-bold tracking-tighter drop-shadow-2xl leading-none -mr-1">
                  {displayWeather.temp}°
                </span>
                
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 px-3 py-1 rounded-full backdrop-blur-md bg-white/10 border border-white/10 shadow-sm">
                  {displayWeather.description}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end opacity-50">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-xs">Sincronizando...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}