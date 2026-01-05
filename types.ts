import { z } from 'zod';

// --- Domain Enums ---

export enum ViewState {
  PUBLIC_HOME = 'PUBLIC_HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  QR_FULLSCREEN = 'QR_FULLSCREEN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  PROFILE_DETAILS = 'PROFILE_DETAILS',
  WEB_VIEW = 'WEB_VIEW' // Novo estado para Iframe
}

// --- Zod Schemas ---

// Regex ajustados para aceitar o formato mascarado que vem do input
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const susRegex = /^\d{3} \d{4} \d{4} \d{4}$/; // Ajustado para o formato do cartão SUS mascarado
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const cepRegex = /^\d{5}-\d{3}$/;

export const AddressSchema = z.object({
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(2, "Bairro é obrigatório"),
  cep: z.string().regex(cepRegex, "CEP incompleto"),
  city: z.string().default("Mulungu"),
  state: z.string().default("CE"),
});

export const CitizenSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  photo: z.string().optional(), // Campo adicionado para armazenar Base64 ou URL
  
  // Identificação
  cpf: z.string().regex(cpfRegex, "CPF incompleto ou inválido"),
  rg: z.string().min(2, "RG é obrigatório").optional().or(z.literal('')), 
  
  // Saúde e Social (Dados Estratégicos)
  susCard: z.string().regex(susRegex, "Cartão SUS incompleto").optional().or(z.literal('')),
  nis: z.string().min(11, "NIS deve ter 11 dígitos").optional().or(z.literal('')),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "NA"], {
    errorMap: () => ({ message: "Selecione o tipo sanguíneo" })
  }).optional(),
  
  // Demografia (IBGE/Gov)
  gender: z.enum(["M", "F", "OUTRO"], {
    errorMap: () => ({ message: "Selecione o gênero" })
  }),
  race: z.enum(["BRANCA", "PRETA", "PARDA", "AMARELA", "INDIGENA"], {
    errorMap: () => ({ message: "Selecione a raça/cor" })
  }),

  birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "Data de nascimento inválida",
  }),
  
  // Contato
  phoneNumber: z.string().regex(phoneRegex, "Telefone inválido"),
  motherName: z.string().min(3, "Nome da mãe é obrigatório"),
  
  address: AddressSchema,
});

export const LoginSchema = z.object({
  // Reduzido para min(4) para permitir o login de teste "1234"
  cpf: z.string().min(4, "CPF inválido"), 
  password: z.string().min(4, "Senha inválida"),
});

export const ForgotPasswordSchema = z.object({
  cpf: z.string().min(11, "CPF inválido"),
});

// --- Types inferred from Zod ---

export type Address = z.infer<typeof AddressSchema>;
export type CitizenFormData = z.infer<typeof CitizenSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

// --- Extended User Type for App State ---

export type Citizen = CitizenFormData & {
  id: string;
  qrCodeData: string;
  createdAt: string;
};

export interface AuthState {
  user: Citizen | null;
  isLoading: boolean;
  error: string | null;
}

// --- News Type ---
export interface NewsItem {
  title: string;
  date: string;
  category: string;
  link: string;
  imageUrl?: string;
}

// --- Notification Type ---
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'appointment'; // Adicionado tipo appointment
}