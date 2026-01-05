import { Citizen, CitizenFormData, LoginFormData, NewsItem, Notification } from '../types';

// Mock database in memory
const MOCK_DB_KEY = 'mulungu_citizens_db';

// --- TEST USER CONFIGURATION ---
const TEST_USER_ID = 'user-teste-1234';
const TEST_USER: Citizen = {
  id: TEST_USER_ID,
  fullName: "João Cidadão de Teste",
  // CPF Formatado
  cpf: "123.456.789-00", 
  rg: "2002002009-9",
  birthDate: "1985-06-15",
  gender: "M",
  race: "PARDA",
  bloodType: "O+",
  motherName: "Maria Cidadã Exemplo",
  phoneNumber: "(85) 99999-8888",
  susCard: "898 0011 2233 4455",
  nis: "12345678901",
  // Foto real de banco de imagem gratuito
  photo: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop", 
  address: {
    street: "Rua Capitão Antônio Joaquim",
    number: "100",
    district: "Centro",
    city: "Mulungu",
    state: "CE",
    cep: "62764-000"
  },
  qrCodeData: `MULUNGU:V1:12345678900:${TEST_USER_ID}`,
  createdAt: new Date().toISOString()
};

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
  let db: Citizen[] = data ? JSON.parse(data) : [];

  // Garante que o usuário de teste exista no banco
  const testUserExists = db.some(c => c.id === TEST_USER_ID);
  if (!testUserExists) {
    db.unshift(TEST_USER); // Adiciona no início
    saveDb(db); // Persiste
  }

  return db;
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
  },
  nis: (value: string) => {
    return value
      .replace(/\D/g, '')
      .slice(0, 11); // NIS tem 11 dígitos, sem máscara padrão visual complexa
  }
};

export const ContextService = {
  getWeather: async (lat?: number, lon?: number) => {
    const targetLat = lat || MULUNGU_COORDS.lat;
    const targetLon = lon || MULUNGU_COORDS.lon;
    
    // ... (Weather logic remains same, abstracted for brevity)
    // Verifica se as coordenadas alvo são as de Mulungu
    const isMulunguRequest = 
      Math.abs(targetLat - MULUNGU_COORDS.lat) < 0.001 && 
      Math.abs(targetLon - MULUNGU_COORDS.lon) < 0.001;

    const latKey = targetLat.toFixed(4);
    const lonKey = targetLon.toFixed(4);
    const CACHE_KEY = `weather_${latKey}_${lonKey}`;
    const now = Date.now();
    const cachedItem = cache[CACHE_KEY];

    if (cachedItem && (now - cachedItem.timestamp < CACHE_TTL)) {
      return cachedItem.data;
    }

    try {
      const API_KEY = '03578c2ef8bff211cb3ce8b9d6138bc6';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&units=metric&lang=pt_br&appid=${API_KEY}`;
      const response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('Weather API Error');
      const data = await response.json();
      
      let cityName = data.name;
      if (isMulunguRequest) cityName = "Mulungu - CE";
      else if (cityName === "Brejinho" || cityName === "Brejo" || cityName === "Guaramiranga") cityName = "Mulungu (Arredores)";

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
      cache[CACHE_KEY] = { data: weatherData, timestamp: now };
      return weatherData;
    } catch (err) {
      return { 
        temp: 29, description: 'parcialmente nublado', main: 'clouds', icon: '02d', 
        city: 'Mulungu - CE', isLocal: false, wind: 15, humidity: 65
      };
    }
  },
  
  getNews: async (): Promise<NewsItem[]> => {
    const CACHE_KEY = 'news_mulungu';
    const now = Date.now();
    if (cache[CACHE_KEY] && (now - cache[CACHE_KEY].timestamp < CACHE_TTL)) return cache[CACHE_KEY].data;

    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      const newsData = data.news || [];
      cache[CACHE_KEY] = { data: newsData, timestamp: now };
      return newsData;
    } catch (err) { return []; }
  },

  getNotifications: async (userId: string): Promise<Notification[]> => {
    const baseNotifications: Notification[] = [
      { id: '1', title: 'Campanha de Vacinação', message: 'A vacinação contra Influenza começa nesta segunda-feira no Posto Central.', date: 'Hoje', read: false, type: 'info' },
      { id: '2', title: 'IPTU 2024 Disponível', message: 'Acesse a guia de pagamento com desconto de 10%.', date: 'Ontem', read: true, type: 'warning' }
    ];

    // Se for o usuário de teste, adiciona os agendamentos solicitados
    if (userId === TEST_USER_ID) {
      return [
        { 
          id: 'appointment-1', 
          title: 'Consulta Médica Agendada', 
          message: 'Clínico Geral - Dr. Silva. Data: Amanhã às 08:30 no PSF Centro.', 
          date: 'Agora', 
          read: false, 
          type: 'appointment' 
        },
        ...baseNotifications
      ];
    }

    return baseNotifications;
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
      susCard: data.susCard ? data.susCard.replace(/\D/g, '') : undefined,
      nis: data.nis ? data.nis.replace(/\D/g, '') : undefined,
      photo: data.photo, 
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
    await delay(800);
    
    // Limpa a máscara (pontos e traços) que vem do input
    const cleanInputCpf = data.cpf.replace(/\D/g, '');

    // --- DEV BACKDOOR ---
    // Permite login rápido com 1234 / 1234 (independente se o input foi "123.4" ou "1234")
    if (cleanInputCpf === '1234' && data.password === '1234') {
      // Garante que o usuário de teste esteja carregado e salvo no localStorage
      getDb(); 
      return TEST_USER;
    }
    // --------------------

    const db = getDb();
    const citizen = db.find(c => c.cpf.replace(/\D/g, '') === cleanInputCpf);
    
    if (!citizen) throw new Error("Cidadão não encontrado. Verifique o CPF.");
    // Simulação: qualquer senha > 4 chars serve para outros usuários
    return citizen;
  },

  requestPasswordReset: async (cpf: string): Promise<{ phoneNumber: string }> => {
    await delay(1500);
    const db = getDb();
    
    const cleanInputCpf = cpf.replace(/\D/g, '');

    // Backdoor para recuperação de senha do usuário teste
    if (cleanInputCpf === '1234') {
        return { phoneNumber: TEST_USER.phoneNumber };
    }

    const citizen = db.find(c => c.cpf.replace(/\D/g, '') === cleanInputCpf);
    
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