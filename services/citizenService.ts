import { Citizen, CitizenFormData, LoginFormData } from '../types';

// Mock database in memory
const MOCK_DB_KEY = 'mulungu_citizens_db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getDb = (): Citizen[] => {
  const data = localStorage.getItem(MOCK_DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveDb = (data: Citizen[]) => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(data));
};

export const ContextService = {
  getWeather: async () => {
    // Mocked weather for Mulungu, CE
    return {
      temp: 26,
      condition: "Ensolarado",
      city: "Mulungu"
    };
  },
  
  getNews: async () => {
    return [
      { id: 1, title: "Obras", text: "Urbanização da entrada da cidade avança esta semana." },
      { id: 2, title: "Meio Ambiente", text: "Ação ambiental reforça sustentabilidade no município." },
      { id: 3, title: "Cidadania", text: "Serviços do Caminhão do Cidadão atendem Mulungu." }
    ];
  }
};

export const CitizenService = {
  // Simulate checking if CPF exists
  checkCpfExists: async (cpf: string): Promise<boolean> => {
    await delay(500); // Network latency
    const db = getDb();
    return db.some(c => c.cpf === cpf);
  },

  // Simulate Registration Server Action
  register: async (data: CitizenFormData): Promise<Citizen> => {
    await delay(1200);
    const db = getDb();
    
    if (db.some(c => c.cpf === data.cpf)) {
      throw new Error("CPF já cadastrado no sistema.");
    }

    const newCitizen: Citizen = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      qrCodeData: `MULUNGU:V1:${data.cpf}:${crypto.randomUUID().slice(0, 8)}`
    };

    db.push(newCitizen);
    saveDb(db);
    return newCitizen;
  },

  // Simulate Login Server Action
  login: async (data: LoginFormData): Promise<Citizen> => {
    await delay(1000);
    const db = getDb();
    
    // In a real app, verify password hash. Here we just match CPF for demo simplicity 
    // since we didn't add password to the registration schema for brevity, 
    // but implied it acts as auth.
    // For this demo, let's assume any registered CPF logs in (Mock logic).
    
    const citizen = db.find(c => c.cpf === data.cpf);
    
    if (!citizen) {
      throw new Error("Cidadão não encontrado. Verifique o CPF.");
    }
    
    return citizen;
  },

  // Simulate Password Recovery
  requestPasswordReset: async (cpf: string): Promise<{ phoneNumber: string }> => {
    await delay(1500);
    const db = getDb();
    const citizen = db.find(c => c.cpf === cpf);
    
    if (!citizen) {
      throw new Error("CPF não encontrado na base de dados.");
    }

    // Return masked phone number for UI feedback
    return { phoneNumber: citizen.phoneNumber };
  },
  
  // Update Profile
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