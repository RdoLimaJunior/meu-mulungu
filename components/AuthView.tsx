import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, LoginFormData } from '../types';
import { Input, Button } from './ui/Forms';
import { Fingerprint } from 'lucide-react';
import { Formatters } from '../services/citizenService';

interface AuthViewProps {
  onLogin: (data: LoginFormData) => Promise<void>;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  isLoading: boolean;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin, onRegisterClick, onForgotPasswordClick, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema)
  });

  return (
    <div className="flex flex-col h-full bg-white animate-fade-in">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <img 
          src="https://www.mulungu.ce.gov.br/imagens/logo.png?time=1767516382" 
          alt="Brasão de Mulungu" 
          className="w-24 h-auto mb-2 drop-shadow-md transition-transform duration-500 hover:scale-105"
        />
        
        <div>
          <h1 className="text-2xl font-bold text-mulungu-blue">Mulungu Digital</h1>
          <p className="text-mulungu-600 font-medium">Prefeitura Municipal de Mulungu</p>
        </div>

        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          Sua identidade digital unificada para acessar serviços de saúde, educação e social.
        </p>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 px-8 pb-8">
        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          <div className="relative group">
            <div className="absolute top-9 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-mulungu-600 transition-colors">
              <Fingerprint className="h-5 w-5" />
            </div>
            <Input 
              label="CPF" 
              placeholder="000.000.000-00" 
              className="pl-10"
              inputMode="numeric"
              maxLength={14}
              mask={Formatters.cpf}
              error={errors.cpf?.message} 
              {...register('cpf')} 
            />
          </div>

          <Input 
            label="Senha" 
            type="password" 
            placeholder="••••••" 
            error={errors.password?.message} 
            {...register('password')} 
          />
          
          <div className="text-right">
             <button 
               type="button"
               onClick={onForgotPasswordClick}
               className="text-xs font-semibold text-mulungu-blue hover:text-mulungu-800 hover:underline focus:outline-none p-1"
             >
               Esqueceu a senha?
             </button>
          </div>

          <Button type="submit" isLoading={isLoading} className="mt-4 shadow-lg shadow-mulungu-200">
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-white px-2 text-slate-400 font-medium">Primeiro acesso?</span>
            </div>
          </div>
          
          <Button variant="outline" onClick={onRegisterClick}>
            Criar Cadastro Único
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-50 p-3 text-center text-[10px] text-slate-400">
        &copy; 2024 GovTech Mulungu. Versão 1.0.0
      </div>
    </div>
  );
};