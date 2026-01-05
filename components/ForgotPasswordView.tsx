import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForgotPasswordSchema, ForgotPasswordFormData } from '../types';
import { Input, Button } from './ui/Forms';
import { ArrowLeft, CheckCircle, MessageSquare } from 'lucide-react';
import { Formatters } from '../services/citizenService';

interface ForgotPasswordViewProps {
  onSubmit: (cpf: string) => Promise<string | null>; // Returns phone number if success
  onBack: () => void;
  isLoading: boolean;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onSubmit, onBack, isLoading }) => {
  const [successData, setSuccessData] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema)
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    const phoneNumber = await onSubmit(data.cpf);
    if (phoneNumber) {
      setSuccessData(phoneNumber);
    }
  };

  if (successData) {
    // Mask phone number logic
    const maskPhone = (phone: string) => {
       if (phone.length < 8) return "******" + phone.slice(-4);
       // Simple heuristic for (XX) 9XXXX-XXXX or similar
       return phone.replace(/(\d{2})?.*(\d{4})/, "($1) 9****-$2").replace("() ", ""); 
    };

    return (
      <div className="flex flex-col items-center justify-center h-full pt-10 px-6 text-center animate-zoom-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50 animate-bounce">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">SMS Enviado!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Enviamos um link de redefinição de senha para o número terminado em: <br/>
          <span className="font-mono font-bold text-slate-900 text-lg mt-2 block">{maskPhone(successData)}</span>
        </p>
        <Button onClick={onBack} variant="outline" className="border-mulungu-200 text-mulungu-700 hover:bg-mulungu-50">
          Voltar para o Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-mulungu-600 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 ml-2">Recuperar Senha</h2>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-start border border-blue-100">
        <MessageSquare className="w-5 h-5 text-mulungu-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-900 leading-snug">
          Informe seu CPF abaixo. Enviaremos um código de verificação via SMS para o celular cadastrado.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-2">
        <Input 
          label="CPF" 
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          mask={Formatters.cpf}
          error={errors.cpf?.message} 
          {...register('cpf')} 
        />

        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-mulungu-200 mt-4">
          Enviar Link de Recuperação
        </Button>
      </form>
    </div>
  );
};