import React, { useEffect, useState, useMemo } from 'react';
import { Citizen } from '../types';
import { 
  Loader2, MapPin, Droplets, Wind, RefreshCcw,
  Sun, Moon, CloudRain, Cloud, CloudLightning, Snowflake, CloudFog, Sunset
} from 'lucide-react';
import { ContextService, MULUNGU_COORDS } from '../services/citizenService';

interface GreetingHeaderProps {
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

// --- ATMOSPHERE ENGINE TYPES & HELPERS ---

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimePeriod = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night' | 'midnight';
type WeatherCondition = 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist';

const getSeason = (month: number): Season => {
  // Southern Hemisphere Seasons
  if (month >= 2 && month <= 4) return 'autumn';
  if (month >= 5 && month <= 7) return 'winter';
  if (month >= 8 && month <= 10) return 'spring';
  return 'summer';
};

const getTimePeriod = (hour: number): TimePeriod => {
  if (hour >= 0 && hour < 5) return 'midnight';
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 19) return 'dusk';
  return 'night';
};

const normalizeWeather = (main: string): WeatherCondition => {
  const m = main.toLowerCase();
  if (m.includes('rain')) return 'rain';
  if (m.includes('drizzle')) return 'drizzle';
  if (m.includes('thunder')) return 'thunderstorm';
  if (m.includes('snow')) return 'snow';
  if (m.includes('cloud')) return 'clouds';
  if (m.includes('mist') || m.includes('fog') || m.includes('haze')) return 'mist';
  return 'clear';
};

// --- VISUAL CONFIGURATION GENERATOR ---

const getAtmosphereTheme = (
  weather: WeatherCondition,
  period: TimePeriod,
  season: Season
) => {
  let gradient = '';
  let particleType: 'sun' | 'moon' | 'cloud' | 'rain' | 'none' = 'none';
  const isDay = ['dawn', 'morning', 'noon', 'afternoon'].includes(period);

  // 1. BASE GRADIENT LOGIC (Time & Season)
  if (isDay) {
    switch (season) {
      case 'summer':
        // Verão: Cores quentes, vibrantes, alto brilho
        if (period === 'noon') gradient = 'bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-300';
        else if (period === 'dawn') gradient = 'bg-gradient-to-br from-orange-300 via-amber-200 to-sky-300';
        else gradient = 'bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-300';
        break;
      case 'autumn':
        // Outono: Tons terrosos, dourados, luz difusa
        if (period === 'dusk') gradient = 'bg-gradient-to-br from-rose-400 via-orange-300 to-indigo-400';
        else gradient = 'bg-gradient-to-br from-orange-200 via-amber-200 to-blue-200';
        break;
      case 'winter':
        // Inverno: Azul pálido, branco, frio
        gradient = 'bg-gradient-to-br from-slate-200 via-blue-200 to-white';
        break;
      case 'spring':
        // Primavera: Verde fresco, teal, vibrante
        gradient = 'bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-200';
        break;
    }
    particleType = 'sun';
  } else {
    // NIGHT THEMES
    switch (period) {
      case 'dusk':
        gradient = 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500';
        break;
      case 'midnight':
        gradient = 'bg-gradient-to-br from-black via-slate-900 to-indigo-950';
        break;
      default: // night
        if (season === 'winter') gradient = 'bg-gradient-to-br from-slate-800 via-blue-950 to-slate-900';
        else gradient = 'bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900';
    }
    particleType = 'moon';
  }

  // 2. WEATHER OVERRIDES (Dominam a estação)
  switch (weather) {
    case 'rain':
    case 'drizzle':
      gradient = isDay 
        ? 'bg-gradient-to-br from-slate-400 via-slate-500 to-blue-600' // Chuva dia
        : 'bg-gradient-to-br from-slate-900 via-blue-950 to-black';    // Chuva noite
      particleType = 'rain';
      break;
    case 'thunderstorm':
      gradient = 'bg-gradient-to-br from-slate-800 via-indigo-950 to-purple-950';
      particleType = 'rain';
      break;
    case 'clouds':
      if (isDay) {
        // Nuvens no Outono são mais "sujas/terrosas", no verão são brancas
        if (season === 'autumn') gradient = 'bg-gradient-to-br from-stone-400 via-stone-300 to-orange-100';
        else gradient = 'bg-gradient-to-br from-slate-300 via-blue-200 to-white';
      } else {
        gradient = 'bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900';
      }
      particleType = 'cloud';
      break;
    case 'mist':
    case 'snow': // Raro em Mulungu, mas suportado
      gradient = isDay 
        ? 'bg-gradient-to-br from-slate-200 via-gray-200 to-white' 
        : 'bg-gradient-to-br from-slate-800 to-gray-800';
      particleType = 'cloud';
      break;
  }

  return { gradient, particleType, isDay };
};

// --- COMPONENT ---

export const GreetingHeader: React.FC<GreetingHeaderProps> = ({ user }) => {
  // Weather States
  const [localWeather, setLocalWeather] = useState<WeatherData | null>(null);
  const [mulunguWeather, setMulunguWeather] = useState<WeatherData | null>(null);
  
  // View Control
  const [activeWeather, setActiveWeather] = useState<'local' | 'mulungu'>('local');
  const [canToggle, setCanToggle] = useState(false);
  
  // Time States
  const [now, setNow] = useState(new Date());

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

  useEffect(() => {
    let mounted = true;
    const timeInterval = setInterval(() => setNow(new Date()), 60000); // Atualiza hora

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
                
                if (distLat > 0.2 || distLon > 0.2) {
                  setCanToggle(true);
                  setActiveWeather('local');
                } else {
                  setCanToggle(false);
                  setActiveWeather('mulungu');
                }
              }
            },
            () => {
              if (mounted) { setCanToggle(false); setActiveWeather('mulungu'); }
            },
            { timeout: 5000 }
          );
        } else {
          if (mounted) { setCanToggle(false); setActiveWeather('mulungu'); }
        }
      } catch (e) { console.warn("Weather load error"); }
    };

    loadData();
    return () => { 
      mounted = false; 
      clearInterval(timeInterval);
    };
  }, []);

  const displayWeather = activeWeather === 'local' ? (localWeather || mulunguWeather) : mulunguWeather;

  // --- THEME CALCULATION ---
  const theme = useMemo(() => {
    // Default Fallback
    if (!displayWeather) return { gradient: 'bg-slate-200', particleType: 'none', isDay: true };
    
    const condition = normalizeWeather(displayWeather.main);
    const period = getTimePeriod(now.getHours());
    const season = getSeason(now.getMonth());

    return getAtmosphereTheme(condition, period, season);
  }, [displayWeather, now]);

  const toggleWeather = () => {
    if (!canToggle) return;
    setActiveWeather(prev => prev === 'local' ? 'mulungu' : 'local');
  };

  // --- ICON DYNAMICS ---
  const WeatherIcon = useMemo(() => {
    if (!displayWeather) return Sun;
    
    const main = displayWeather.main.toLowerCase();
    if (main.includes('rain')) return CloudRain;
    if (main.includes('thunder')) return CloudLightning;
    if (main.includes('drizzle')) return CloudRain;
    if (main.includes('snow')) return Snowflake;
    if (main.includes('mist') || main.includes('fog')) return CloudFog;
    if (main.includes('cloud')) return Cloud;
    
    // Clear Sky Logic
    const h = now.getHours();
    if (h >= 17 && h < 18) return Sunset; // Golden Hour Icon
    return theme.isDay ? Sun : Moon;
  }, [displayWeather, theme.isDay, now]);

  return (
    <div className={`relative w-full h-44 sm:h-48 rounded-b-[2.5rem] shadow-xl overflow-hidden transition-all duration-1000 ease-in-out ${theme.gradient}`}>
      
      {/* --- LAYER 1: ATMOSPHERIC PARTICLES --- */}
      
      {/* Sun / Moon Glow Effect */}
      <div className={`absolute transition-opacity duration-1000 ${
        theme.particleType === 'sun' 
          ? 'top-[-30px] right-[-30px] w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-pulse-slow opacity-100' 
          : theme.particleType === 'moon'
            ? 'top-[10px] right-[10px] w-32 h-32 bg-white/10 rounded-full blur-2xl opacity-100'
            : 'opacity-0'
      }`} />

      {/* Cloud Blobs */}
      {(theme.particleType === 'cloud' || theme.particleType === 'rain') && (
        <>
           <div className="absolute top-[-20px] right-[-40px] w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float opacity-70" />
           <div className="absolute top-[40px] left-[-30px] w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float-delayed opacity-60" />
        </>
      )}

      {/* Rain Overlay (CSS Generated) */}
      {theme.particleType === 'rain' && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)', 
               backgroundSize: '1px 30px', 
               animation: 'rain 0.4s linear infinite' 
             }}>
        </div>
      )}

      {/* --- LAYER 2: DECORATIVE CURVES --- */}
      <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none opacity-15 mix-blend-overlay">
         <svg viewBox="0 0 1440 320" className="w-full h-auto block align-bottom">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
      </div>

      {/* --- LAYER 3: CONTENT --- */}
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6 z-10 text-white">
        
        {/* Top: Location Selector */}
        <div className="flex justify-between items-start">
          <button 
            onClick={toggleWeather}
            disabled={!canToggle}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300
              ${canToggle 
                ? 'bg-black/10 border-white/20 hover:bg-black/20 cursor-pointer' 
                : 'bg-transparent border-transparent cursor-default pl-0'}
            `}
          >
            <MapPin className="w-3.5 h-3.5 text-white/90" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wide uppercase truncate max-w-[140px] drop-shadow-md">
              {displayWeather ? displayWeather.city : 'Carregando...'}
            </span>
            {canToggle && (
              <RefreshCcw className="w-3 h-3 text-white/80 ml-1" />
            )}
          </button>
        </div>

        {/* Bottom: Info & Greeting */}
        <div className="flex items-end justify-between w-full pb-1">
          
          {/* Greeting Area */}
          <div>
            <p className="text-sm font-medium opacity-90 mb-0.5 drop-shadow-md text-white/90">
              {greeting},
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight drop-shadow-lg truncate max-w-[200px] sm:max-w-xs tracking-tight">
              {firstName}
            </h2>
            
            {/* Weather Stats (Wind/Humidity) */}
            {displayWeather && (
              <div className="flex items-center gap-3 mt-3 text-[10px] font-semibold opacity-90 animate-slide-in">
                <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-sm">
                  <Wind className="w-3 h-3" /> 
                  <span>{displayWeather.wind} km/h</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-sm">
                  <Droplets className="w-3 h-3" /> 
                  <span>{displayWeather.humidity}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Temperature Area */}
          <div className="text-right flex flex-col items-end">
            {displayWeather ? (
              <div className="flex flex-col items-end">
                <WeatherIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg mb-1 animate-pulse-slow" />
                <span className="text-5xl sm:text-6xl font-bold tracking-tighter drop-shadow-2xl">
                  {displayWeather.temp}°
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-100 mt-1 px-2 py-0.5 rounded-md backdrop-blur-md bg-black/10 shadow-sm">
                  {displayWeather.description}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end opacity-50">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">Atualizando...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};