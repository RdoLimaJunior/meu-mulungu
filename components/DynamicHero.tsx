import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Citizen } from '../types';
import { 
  MapPin, Droplets, Wind, RefreshCcw,
  Sun, Moon, CloudRain, Cloud, CloudLightning, Snowflake, CloudFog, Sunset,
  Calendar, Clock, AlertCircle, Navigation, ArrowRight, ThermometerSun
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

// --- ATMOSPHERE ENGINE ---
type Season = 'rainy_season' | 'dry_season' | 'windy_season'; 
type TimePeriod = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'golden_hour' | 'dusk' | 'night' | 'midnight';
type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'mist';

const getRegionSeason = (month: number): Season => {
  if (month >= 1 && month <= 4) return 'rainy_season';
  if (month >= 7 && month <= 9) return 'windy_season';
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

const getAtmosphereTheme = (weather: WeatherCondition, period: TimePeriod, season: Season) => {
  let gradient = '';
  let particleType: 'sun' | 'moon' | 'cloud' | 'rain' | 'stars' | 'none' = 'none';
  const isDay = ['dawn', 'morning', 'noon', 'afternoon', 'golden_hour'].includes(period);

  if (isDay) {
    if (period === 'golden_hour') {
      gradient = 'bg-gradient-to-b from-orange-400 via-rose-400 to-purple-500'; 
      particleType = 'sun';
    } else if (period === 'dawn') {
      gradient = 'bg-gradient-to-b from-indigo-300 via-purple-300 to-orange-200';
      particleType = 'sun';
    } else if (period === 'noon') {
       gradient = 'bg-gradient-to-b from-sky-400 via-blue-400 to-indigo-500'; 
       particleType = 'sun';
    } else {
       gradient = 'bg-gradient-to-b from-sky-300 via-sky-400 to-blue-500';
       particleType = 'sun';
    }
  } else {
    if (period === 'dusk') {
      gradient = 'bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900';
    } else if (period === 'midnight') {
      gradient = 'bg-gradient-to-b from-slate-950 via-gray-900 to-slate-900';
    } else {
      gradient = 'bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900';
    }
    
    if (weather === 'clear' || weather === 'clouds') particleType = 'stars';
    else particleType = 'moon';
  }

  switch (weather) {
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      gradient = isDay 
        ? 'bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700' 
        : 'bg-gradient-to-b from-slate-900 via-gray-900 to-black';
      particleType = 'rain';
      break;
    case 'clouds':
      if (isDay) {
        gradient = 'bg-gradient-to-b from-slate-300 via-slate-400 to-blue-300';
        particleType = 'cloud';
      }
      break;
    case 'mist':
      gradient = 'bg-gradient-to-b from-slate-300 via-gray-300 to-slate-400';
      particleType = 'cloud';
      break;
  }

  return { gradient, particleType, isDay };
};

export const DynamicHero: React.FC<DynamicHeroProps> = ({ user }) => {
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [mulunguWeather, setMulunguWeather] = useState<WeatherData | null>(null);
  const [activeWeather, setActiveWeather] = useState<'local' | 'mulungu'>('mulungu');
  
  // Controle de UI e Automação
  const [canToggle, setCanToggle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAutoCycling, setIsAutoCycling] = useState(true); // Começa automático
  const autoCycleTimerRef = useRef<any>(null); // Uso de any para compatibilidade com diferentes ambientes JS

  const [now, setNow] = useState(new Date());
  const [insight, setInsight] = useState<{ type: 'appointment' | 'alert' | 'weather', data: any } | null>(null);

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

  // 1. Carregamento de Dados
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
              
              if (mounted && localData) {
                setLocalWeather(localData);
                
                const distLat = Math.abs(lat - MULUNGU_COORDS.lat);
                const distLon = Math.abs(lon - MULUNGU_COORDS.lon);
                // Se a distância for relevante, habilita a troca
                const isFar = distLat > 0.1 || distLon > 0.1;

                if (isFar) {
                  setCanToggle(true);
                  setActiveWeather('local');
                } else {
                  // Se estiver em Mulungu, força Mulungu e desativa o ciclo
                  setCanToggle(false);
                  setActiveWeather('mulungu');
                  setIsAutoCycling(false); 
                }
              }
            },
            (err) => { 
              console.warn("GPS Error", err);
              if (mounted) { 
                setCanToggle(false); 
                setActiveWeather('mulungu');
                setIsAutoCycling(false);
              } 
            },
            { timeout: 8000 }
          );
        }
      } catch (e) { console.warn("Weather error"); }
    };

    const loadInsights = async () => {
      if (user) {
        const notifs = await ContextService.getNotifications(user.id);
        const appointment = notifs.find(n => n.type === 'appointment' && !n.read);
        const alert = notifs.find(n => n.type === 'warning' && !n.read);
        if (mounted) {
          if (appointment) setInsight({ type: 'appointment', data: appointment });
          else if (alert) setInsight({ type: 'alert', data: alert });
          else setInsight({ type: 'weather', data: null });
        }
      } else {
        if (mounted) setInsight({ type: 'weather', data: null });
      }
    }

    loadData();
    loadInsights();
    
    return () => { mounted = false; clearInterval(timeInterval); };
  }, [user]);

  // 2. Lógica do Ciclo Automático (Contador)
  useEffect(() => {
    if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);

    if (canToggle && isAutoCycling && localWeather && mulunguWeather) {
      autoCycleTimerRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveWeather(prev => prev === 'local' ? 'mulungu' : 'local');
          setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
      }, 8000); // 8 segundos
    }

    return () => {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    };
  }, [canToggle, isAutoCycling, localWeather, mulunguWeather]);

  // 3. Função de Alternância Manual
  const handleManualToggle = () => {
    if (!canToggle) return;
    
    // Pausa o ciclo automático ao interagir manualmente
    setIsAutoCycling(false);

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveWeather(prev => prev === 'local' ? 'mulungu' : 'local');
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const displayWeather = activeWeather === 'local' ? (localWeather || mulunguWeather) : mulunguWeather;

  const theme = useMemo(() => {
    if (!displayWeather) return { gradient: 'bg-slate-200', particleType: 'none', isDay: true };
    const condition = normalizeWeather(displayWeather.main);
    const period = getTimePeriod(now.getHours());
    const season = getRegionSeason(now.getMonth());
    return getAtmosphereTheme(condition, period, season);
  }, [displayWeather, now]);

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

  const transitionClass = `transition-all duration-700 ease-out transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`;
  const dateStr = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(now);
  const timeStr = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(now);

  return (
    <div className={`
      relative w-full rounded-b-[2rem] shadow-xl overflow-hidden 
      transition-all duration-1000 ease-in-out font-sans
      ${theme.gradient}
      flex flex-col
    `}>
      
      {/* BACKGROUND FX */}
      <div className={`absolute transition-all duration-1000 ${
        theme.particleType === 'sun' 
          ? 'top-[-100px] right-[-100px] w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl opacity-60' 
          : 'opacity-0'
      }`} />
      
      {theme.particleType === 'stars' && (
        <div className="absolute inset-0 z-0 opacity-70 animate-pulse-slow"
             style={{
               backgroundImage: 'radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 3px)',
               backgroundSize: '100px 100px',
             }}>
        </div>
      )}

      {theme.particleType === 'rain' && (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)', 
               backgroundSize: '1px 30px', 
               animation: 'rain 0.3s linear infinite' 
             }}>
        </div>
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-10 px-5 pt-6 pb-5 flex flex-col gap-4 text-white">
        
        {/* TOP ROW: HEADER & WEATHER */}
        <div className="flex justify-between items-start">
          
          {/* LEFT: Greeting */}
          <div className="space-y-0.5">
             <div className="flex items-center gap-2 opacity-80 mb-1">
                <span className="text-[10px] font-semibold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {greeting}
                </span>
             </div>
             <h1 className="text-3xl sm:text-4xl font-light tracking-tight leading-none drop-shadow-md">
                {firstName}
             </h1>
             <p className="text-xs font-medium opacity-70 capitalize mt-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {dateStr}
             </p>
          </div>

          {/* RIGHT: Weather & Toggle */}
          <div className={`flex flex-col items-end ${transitionClass}`}>
             <div className="flex items-start">
                <span className="text-5xl sm:text-6xl font-thin tracking-tighter leading-none drop-shadow-lg">
                  {displayWeather ? Math.round(displayWeather.temp) : '--'}°
                </span>
                <div className="mt-1 ml-2 animate-float">
                   <WeatherIcon className={`w-10 h-10 drop-shadow-lg opacity-90 ${theme.particleType === 'rain' ? 'animate-bounce' : ''}`} />
                   {displayWeather && displayWeather.temp > 32 && (
                    <div className="absolute -top-2 -right-2 animate-pulse">
                      <ThermometerSun className="w-4 h-4 text-orange-300" />
                    </div>
                   )}
                </div>
             </div>
             
             {/* Pill Button - Location Toggle */}
             <button 
                onClick={handleManualToggle}
                disabled={!canToggle || isTransitioning}
                className={`
                  group flex items-center justify-end gap-1.5 mt-2 px-3 py-1.5 rounded-full border transition-all duration-300 relative overflow-hidden
                  ${canToggle 
                    ? 'bg-white/20 border-white/30 hover:bg-white/30 cursor-pointer shadow-sm active:scale-95' 
                    : 'bg-white/10 border-white/10 cursor-default opacity-80'}
                `}
             >
                {/* Timer Bar Indicador (Visual Cue) */}
                {isAutoCycling && canToggle && (
                   <div className="absolute bottom-0 left-0 h-[2px] bg-white/50 w-full animate-[width_8s_linear_infinite]" style={{ width: '0%' }}></div>
                )}

                {activeWeather === 'local' 
                   ? <Navigation className="w-3 h-3 opacity-90" />
                   : <MapPin className="w-3 h-3 opacity-90" />
                }
                
                <span className="text-[10px] font-bold tracking-wide uppercase leading-none z-10">
                   {displayWeather ? displayWeather.city : 'Mulungu'}
                </span>

                {canToggle && (
                   <RefreshCcw className={`w-3 h-3 opacity-80 ml-0.5 ${isAutoCycling ? 'animate-spin-slow' : ''} ${isTransitioning ? 'animate-spin' : ''}`} />
                )}
             </button>

             <p className="text-[9px] uppercase font-bold opacity-60 tracking-widest mt-1 mr-1">
                {displayWeather?.description}
             </p>
          </div>
        </div>

        {/* BOTTOM ROW: SMART INSIGHT BAR */}
        <div className="mt-2">
           <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-lg ring-1 ring-white/5 transition-all duration-500 hover:bg-white/15">
              
              {insight?.type === 'appointment' ? (
                 <>
                    <div className="bg-white text-mulungu-600 p-2.5 rounded-full shadow-sm shrink-0 animate-pulse-slow">
                       <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Próximo Compromisso</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                       </div>
                       <h3 className="text-sm font-bold leading-tight truncate">{insight.data.title}</h3>
                       <p className="text-[10px] opacity-80 truncate">{insight.data.message}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                 </>

              ) : insight?.type === 'alert' ? (
                 <>
                    <div className="bg-amber-100 text-amber-600 p-2.5 rounded-full shadow-sm shrink-0 animate-bounce">
                       <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <span className="text-[9px] font-bold uppercase tracking-widest text-amber-200">Atenção Necessária</span>
                       <h3 className="text-sm font-bold leading-tight truncate">{insight.data.title}</h3>
                       <p className="text-[10px] opacity-80 truncate">{insight.data.message}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                 </>

              ) : (
                 <>
                    <div className="flex items-center justify-between w-full px-1">
                       
                       <div className="flex items-center gap-2.5">
                          <div className="bg-white/10 p-1.5 rounded-full">
                             <Clock className="w-4 h-4 opacity-90" />
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-bold opacity-60 tracking-wider">Hora Certa</p>
                             <p className="text-base font-mono font-medium leading-none">{timeStr}</p>
                          </div>
                       </div>

                       <div className="w-px h-6 bg-white/20 mx-2"></div>

                       <div className="flex items-center gap-2.5">
                          <div className="bg-white/10 p-1.5 rounded-full">
                             <Wind className="w-4 h-4 opacity-90" />
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-bold opacity-60 tracking-wider">Vento</p>
                             <p className="text-sm font-medium leading-none">{displayWeather?.wind || 0} <span className="text-[9px]">km/h</span></p>
                          </div>
                       </div>

                       <div className="w-px h-6 bg-white/20 mx-2 hidden sm:block"></div>

                       <div className="hidden sm:flex items-center gap-2.5">
                          <div className="bg-white/10 p-1.5 rounded-full">
                             <Droplets className="w-4 h-4 opacity-90" />
                          </div>
                          <div>
                             <p className="text-[9px] uppercase font-bold opacity-60 tracking-wider">Umidade</p>
                             <p className="text-sm font-medium leading-none">{displayWeather?.humidity || 0}%</p>
                          </div>
                       </div>

                    </div>
                 </>
              )}

           </div>
        </div>

      </div>
    </div>
  );
};