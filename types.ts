import { z } from 'zod';

// --- Domain Enums ---

export enum ViewState {
  PUBLIC_HOME = 'PUBLIC_HOME', // Nova tela inicial pública
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  QR_FULLSCREEN = 'QR_FULLSCREEN',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  PROFILE_DETAILS = 'PROFILE_DETAILS'
}

// --- Zod Schemas ---

// Basic CPF validation regex (simplified for demo)
const cpfRegex = /^\d{11}$/;
const susRegex = /^\d{15}$/;
const phoneRegex = /^\d{10,11}$/;

export const AddressSchema = z.object({
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  district: z.string().min(2, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP inválido"),
  city: z.string().default("Mulungu"),
  state: z.string().default("CE"), // Assuming Mulungu, Ceará
});

export const CitizenSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().regex(cpfRegex, "CPF deve conter 11 dígitos numéricos"),
  susCard: z.string().regex(susRegex, "Cartão SUS deve conter 15 dígitos").optional().or(z.literal('')),
  birthDate: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
    message: "Data de nascimento inválida",
  }),
  phoneNumber: z.string().regex(phoneRegex, "Telefone deve conter DDD + Número (apenas números)"),
  motherName: z.string().min(3, "Nome da mãe é obrigatório"),
  address: AddressSchema,
});

export const LoginSchema = z.object({
  cpf: z.string().regex(cpfRegex, "CPF inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"), // In a real app, strict rules
});

export const ForgotPasswordSchema = z.object({
  cpf: z.string().regex(cpfRegex, "CPF inválido. Digite apenas números."),
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