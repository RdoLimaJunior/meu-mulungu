import { Citizen, CitizenFormData, LoginFormData, NewsItem } from '../types';

// Mock database in memory
const MOCK_DB_KEY = 'mulungu_citizens_db';

// Cache System
interface CacheItem<T> {
  data: T;
  timestamp: number;
}
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const cache: Record<string, CacheItem<any>> = {};

// Coordenadas Oficiais de Mulungu - CE (Extraídas do Google Maps do Footer)
export const MULUNGU_COORDS = {
  lat: -4.304105,
  lon: -38.997750
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDb = (): Citizen[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MOCK_DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveDb = (data: Citizen[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(data));
  }
};

// --- Helper: Formatters ---
export const Formatters = {
  cpf: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },
  phone: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  },
  cep: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  },
  sus: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/( \d{4})\d+?$/, '$1');
  }
};

export const ContextService = {
  getWeather: async (lat?: number, lon?: number) => {
    // Se não fornecer coordenadas, usa Mulungu
    const targetLat = lat || MULUNGU_COORDS.lat;
    const targetLon = lon || MULUNGU_COORDS.lon;

    // Verifica se as coordenadas alvo são as de Mulungu (com pequena margem de erro para floats)
    const isMulunguRequest = 
      Math.abs(targetLat - MULUNGU_COORDS.lat) < 0.001 && 
      Math.abs(targetLon - MULUNGU_COORDS.lon) < 0.001;

    const latKey = targetLat.toFixed(4);
    const lonKey = targetLon.toFixed(4);
    const CACHE_KEY = `weather_${latKey}_${lonKey}`;
    
    const now = Date.now();
    const cachedItem = cache[CACHE_KEY];

    // 1. Check Cache (Valid for 10 min)
    if (cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
      return cachedItem.data;
    }

    try {
      const API_KEY = '03578c2ef8bff211cb3ce8b9d6138bc6';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=metric&lang=pt_br&appid=${API_KEY}`;

      const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) }); // 5s timeout
      if (!response.ok) throw new Error('Weather API Error');
      
      const data = await response.json();
      
      // Sanitização do nome da cidade
      let cityName = data.name;
      
      // Se for a requisição oficial de Mulungu, força o nome correto
      if (isMulunguRequest) {
        cityName = "Mulungu";
      } else {
        // Correções comuns para a região se necessário
        if (cityName === "Brejinho" || cityName === "Brejo") cityName = "Mulungu (Arredores)";
      }

      const weatherData = {
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        main: data.weather[0].main.toLowerCase(),
        icon: data.weather[0].icon,
        city: cityName, 
        isLocal: !!(lat && lon),
        wind: Math.round(data.wind.speed * 3.6),
        humidity: data.main.humidity
      };

      // Update Cache
      cache[CACHE_KEY] = { data: weatherData, timestamp: now };
      return weatherData;

    } catch (err) {
      console.warn("Weather fetch failed:", err);
      
      // 2. Stale-while-revalidate fallback (usa cache antigo se existir)
      if (cachedItem) {
        return cachedItem.data;
      }

      // 3. Hard Fallback (Dados genéricos de Mulungu)
      return { 
        temp: 29, 
        description: 'parcialmente nublado', 
        main: 'clouds', 
        icon: '02d', 
        city: 'Mulungu', 
        isLocal: false,
        wind: 15,
        humidity: 65
      };
    }
  },
  
  getNews: async (): Promise<NewsItem[]> => {
    const CACHE_KEY = 'news_mulungu';
    const now = Date.now();

    if (cache[CACHE_KEY] && (now - cache[CACHE_KEY].timestamp < CACHE_TTL)) {
      return cache[CACHE_KEY].data;
    }

    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('News Error');
      const data = await response.json();
      
      const newsData = data.news || [];
      cache[CACHE_KEY] = { data: newsData, timestamp: now };
      return newsData;
    } catch (err) {
      console.warn("News API failed");
      return [];
    }
  }
};

export const CitizenService = {
  checkCpfExists: async (cpf: string): Promise<boolean> => {
    await delay(500);
    const db = getDb();
    const cleanCpf = cpf.replace(/\D/g, '');
    return db.some(c => c.cpf.replace(/\D/g, '') === cleanCpf);
  },

  register: async (data: CitizenFormData): Promise<Citizen> => {
    await delay(1200);
    const db = getDb();
    
    const cleanData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ''),
      phoneNumber: data.phoneNumber.replace(/\D/g, ''),
      address: {
        ...data.address,
        cep: data.address.cep.replace(/\D/g, '')
      }
    };

    if (db.some(c => c.cpf === cleanData.cpf)) {
      throw new Error("CPF já cadastrado no sistema.");
    }

    const newCitizen: Citizen = {
      ...cleanData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      qrCodeData: `MULUNGU:V1:${cleanData.cpf}:${crypto.randomUUID().slice(0, 8)}`
    };

    db.push(newCitizen);
    saveDb(db);
    return newCitizen;
  },

  login: async (data: LoginFormData): Promise<Citizen> => {
    await delay(1000);
    const db = getDb();
    const cleanCpf = data.cpf.replace(/\D/g, '');
    const citizen = db.find(c => c.cpf === cleanCpf);
    
    if (!citizen) throw new Error("Cidadão não encontrado. Verifique o CPF.");
    return citizen;
  },

  requestPasswordReset: async (cpf: string): Promise<{ phoneNumber: string }> => {
    await delay(1500);
    const db = getDb();
    const cleanCpf = cpf.replace(/\D/g, '');
    const citizen = db.find(c => c.cpf === cleanCpf);
    
    if (!citizen) throw new Error("CPF não encontrado na base de dados.");
    return { phoneNumber: citizen.phoneNumber };
  },
  
  updateAddress: async (id: string, newAddress: any) => {
    await delay(800);
    const db = getDb();
    const index = db.findIndex(c => c.id === id);
    if (index !== -1) {
      db[index].address = { ...db[index].address, ...newAddress };
      saveDb(db);
      return db[index];
    }
    throw new Error("Usuário não encontrado");
  }
};