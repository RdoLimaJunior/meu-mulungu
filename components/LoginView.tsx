import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '../types';
import { Input, Button } from './ui/Forms';
import { 
  QrCode, 
  FileBadge, 
  Landmark,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { Formatters } from '../services/citizenService';

interface LoginViewProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  onLogin, 
  onRegisterClick, 
  onForgotPasswordClick,
  onBack,
  isLoading 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema)
  });

  return (
    <div className="flex flex-col min-h-full items-center justify-center py-6 md:py-12 animate-fade-in relative">
      
      {/* Back Button */}
      <div className="absolute top-0 left-4">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-500 hover:text-mulungu-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold">Voltar</span>
        </button>
      </div>

      {/* Container Principal Centralizado */}
      <div className="w-full max-w-md px-4 sm:px-0 mt-8">
        
        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          {/* Cabeçalho do Card */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
               <div className="bg-mulungu-50 p-3 rounded-full border border-mulungu-100">
                  <img 
                    src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
                    alt="Brasão Mulungu" 
                    className="h-12 w-auto object-contain"
                  />
               </div>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Identidade Digital</h1>
            <p className="text-sm text-slate-500 mt-1">Para acessar este serviço, <span className="font-semibold text-mulungu-700">faça login</span></p>
          </div>

          <div className="px-8 pb-8 space-y-6">
            
            <button type="button" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border border-slate-300 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none">
              <Landmark className="w-4 h-4 text-blue-800" />
              Entrar com <span className="font-bold text-blue-800">gov.br</span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium uppercase">ou</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
              <Input 
                label="CPF" 
                placeholder="000.000.000-00" 
                inputMode="numeric"
                maxLength={14}
                mask={Formatters.cpf}
                className="bg-slate-50 focus:bg-white placeholder:text-slate-400"
                error={errors.cpf?.message} 
                {...register('cpf')} 
              />

              <div className="space-y-1">
                <Input 
                  label="Senha" 
                  type="password" 
                  placeholder="••••••" 
                  className="bg-slate-50 focus:bg-white"
                  error={errors.password?.message} 
                  {...register('password')} 
                />
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={onForgotPasswordClick}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline tabindex-0"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                isLoading={isLoading} 
                className="w-full bg-mulungu-600 hover:bg-mulungu-700 text-white font-bold uppercase tracking-wide py-3 text-sm shadow-md transition-all hover:shadow-lg"
              >
                Acessar Conta
              </Button>
            </form>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
            <span className="text-slate-600">Não tem uma conta?</span>
            <button 
              onClick={onRegisterClick}
              className="font-bold text-mulungu-600 hover:text-mulungu-800 hover:underline"
            >
              Inscreva-se
            </button>
          </div>
        </div>

      </div>

      <footer className="mt-auto py-8 text-center px-4 w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 opacity-80">
          <ShieldCheck className="w-3 h-3" />
          <p>&copy; Prefeitura Municipal de Mulungu. Ambiente Seguro.</p>
        </div>
      </footer>

    </div>
  );
};