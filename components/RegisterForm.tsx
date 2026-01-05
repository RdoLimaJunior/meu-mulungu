import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CitizenSchema, CitizenFormData } from '../types';
import { Input, Button } from './ui/Forms';
import { ChevronRight, ArrowLeft, Camera, User } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (data: CitizenFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onBack, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CitizenFormData>({
    resolver: zodResolver(CitizenSchema),
    defaultValues: {
      address: {
        city: 'Mulungu',
        state: 'CE'
      }
    }
  });

  return (
    <div className="space-y-6 animate-slide-in max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-500 hover:text-mulungu-blue transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-mulungu-blue ml-2">Novo Cadastro</h2>
      </div>

      <p className="text-sm text-slate-600 mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100 text-blue-800">
        Preencha os dados com atenção. Este será seu cadastro único para Saúde e Educação.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative group cursor-pointer transition-transform active:scale-95">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 text-slate-400 overflow-hidden group-hover:border-mulungu-300 transition-colors">
              <User className="w-12 h-12" />
            </div>
            <button type="button" className="absolute bottom-0 right-0 bg-mulungu-600 text-white p-2 rounded-full shadow-lg border-2 border-white hover:bg-mulungu-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Toque para adicionar foto</p>
        </div>

        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-mulungu-blue uppercase tracking-wider border-b pb-1">Dados Pessoais</h3>
          
          <div className="md:grid md:grid-cols-2 md:gap-4">
            <div className="md:col-span-2">
              <Input 
                label="Nome Completo" 
                placeholder="Ex: Maria da Silva"
                error={errors.fullName?.message} 
                {...register('fullName')} 
              />
            </div>
            
            <Input 
              label="CPF (apenas números)" 
              placeholder="000.000.000-00"
              maxLength={11}
              inputMode="numeric"
              error={errors.cpf?.message} 
              {...register('cpf')} 
            />

            <Input 
              label="Data de Nascimento" 
              type="date" 
              error={errors.birthDate?.message} 
              {...register('birthDate')} 
            />

            <Input 
              label="Celular" 
              placeholder="85999999999"
              inputMode="tel"
              maxLength={11}
              error={errors.phoneNumber?.message} 
              {...register('phoneNumber')} 
            />
            
            <Input 
              label="Cartão SUS (Opcional)" 
              placeholder="000 0000 0000 0000"
              inputMode="numeric"
              error={errors.susCard?.message} 
              {...register('susCard')} 
            />

            <div className="md:col-span-2">
              <Input 
                label="Nome da Mãe" 
                placeholder="Nome completo da mãe"
                error={errors.motherName?.message} 
                {...register('motherName')} 
              />
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-semibold text-mulungu-blue uppercase tracking-wider border-b pb-1">Endereço</h3>
          
          <div className="grid grid-cols-3 gap-3 md:gap-4">
             <div className="col-span-1">
                <Input 
                  label="CEP" 
                  placeholder="00000-000"
                  inputMode="numeric"
                  error={errors.address?.cep?.message} 
                  {...register('address.cep')} 
                />
             </div>
             <div className="col-span-2">
                <Input 
                  label="Bairro" 
                  placeholder="Centro"
                  error={errors.address?.district?.message} 
                  {...register('address.district')} 
                />
             </div>
          </div>

          <div className="grid grid-cols-4 gap-3 md:gap-4">
            <div className="col-span-3">
              <Input 
                label="Rua" 
                placeholder="Nome da rua"
                error={errors.address?.street?.message} 
                {...register('address.street')} 
              />
            </div>
            <div className="col-span-1">
              <Input 
                label="Nº" 
                placeholder="123"
                error={errors.address?.number?.message} 
                {...register('address.number')} 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 pb-8">
          <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-mulungu-200 group w-full md:w-auto md:px-8">
            Finalizar Cadastro <ChevronRight className="w-4 h-4 inline ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </form>
    </div>
  );
}