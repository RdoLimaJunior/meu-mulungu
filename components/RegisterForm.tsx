import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CitizenSchema, CitizenFormData } from '../types';
import { Input, Button, Select } from './ui/Forms';
import { 
  ChevronRight, 
  ArrowLeft, 
  Camera, 
  User, 
  MapPin, 
  Phone, 
  FileText, 
  AlertCircle,
  Loader2,
  HeartPulse,
  Users
} from 'lucide-react';
import { Formatters } from '../services/citizenService';
import { toast } from 'react-hot-toast';

interface RegisterFormProps {
  onSubmit: (data: CitizenFormData) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onBack, isLoading }) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isValid }, setValue, trigger, watch } = useForm<CitizenFormData>({
    resolver: zodResolver(CitizenSchema),
    mode: 'onChange',
    defaultValues: {
      address: {
        city: 'Mulungu',
        state: 'CE'
      },
      gender: undefined,
      race: undefined,
      bloodType: undefined
    }
  });

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Helper para converter File para Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 1. Cria preview local
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
      
      // 2. Converte para Base64 e salva no formulário para envio
      try {
        const base64 = await convertToBase64(file);
        setValue('photo', base64);
      } catch (error) {
        console.error("Erro ao processar imagem", error);
        toast.error("Erro ao carregar imagem");
      }
    }
  };

  const handleGoogleSignUp = async () => {
    setIsSocialLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockGoogleData = {
      name: "Carlos Eduardo da Silva",
      photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=250&auto=format&fit=crop"
    };

    setValue('fullName', mockGoogleData.name, { shouldValidate: true });
    // Salva a URL da foto do Google no formulário
    setValue('photo', mockGoogleData.photo);
    setPhotoPreview(mockGoogleData.photo);
    
    toast.success("Dados importados do Google! Complete o restante.", {
      icon: 'google',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
    
    setIsSocialLoading(false);
    trigger("fullName");
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2 pb-2 border-b border-slate-100">
      <div className="bg-mulungu-50 p-1.5 rounded-lg text-mulungu-600">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
    </div>
  );

  return (
    <div className="animate-slide-in max-w-2xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex items-center mb-4 sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-2">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 text-slate-500 hover:text-mulungu-600 transition-colors rounded-full hover:bg-slate-200/50"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-2">
          <h2 className="text-xl font-bold text-slate-900">Novo Cidadão</h2>
          <p className="text-xs text-slate-500">Crie sua carteira digital unificada</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* --- SOCIAL LOGIN BUTTON --- */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
          <button 
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isSocialLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSocialLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
                <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3275 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                <path d="M5.50253 14.3003C5.00236 12.8099 5.00236 11.1961 5.50253 9.70575V6.61481H1.51649C-0.18551 10.0056 -0.18551 14.0004 1.51649 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
                <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.0344664 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isSocialLoading ? "Importando dados..." : "Cadastrar com Google"}</span>
          </button>
          
          <div className="relative flex items-center mt-4">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-3 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              Ou preencha manualmente
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* --- 1. FOTO DO PERFIL --- */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            <div 
              onClick={handlePhotoClick}
              className="relative group cursor-pointer transition-transform active:scale-95"
            >
              <div className={`
                w-28 h-28 rounded-full flex items-center justify-center border-4 
                overflow-hidden shadow-inner bg-slate-100 transition-colors
                ${photoPreview ? 'border-mulungu-500' : 'border-white ring-2 ring-slate-200'}
              `}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}
              </div>
              
              <button 
                type="button" 
                className="absolute bottom-1 right-1 bg-mulungu-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-mulungu-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3 font-medium">
              {photoPreview ? "Toque para alterar a foto" : "Toque na câmera para adicionar foto"}
            </p>
          </div>

          {/* --- 2. DADOS PESSOAIS --- */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <SectionHeader icon={FileText} title="Identificação Civil" />
            
            <div className="space-y-4">
              <Input 
                label="CPF (Obrigatório)" 
                placeholder="000.000.000-00"
                inputMode="numeric"
                maxLength={14}
                mask={Formatters.cpf}
                error={errors.cpf?.message} 
                {...register('cpf')} 
              />

              <Input 
                label="Nome Completo" 
                placeholder="Ex: Maria da Silva"
                error={errors.fullName?.message} 
                {...register('fullName')} 
              />

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Data de Nasc." 
                  type="date" 
                  error={errors.birthDate?.message} 
                  {...register('birthDate')} 
                />
                 <Select
                  label="Gênero"
                  error={errors.gender?.message}
                  {...register('gender')}
                  options={[
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Feminino" },
                    { value: "OUTRO", label: "Outro" }
                  ]}
                />
              </div>

               <Select
                  label="Raça/Cor (IBGE)"
                  error={errors.race?.message}
                  {...register('race')}
                  options={[
                    { value: "PARDA", label: "Parda" },
                    { value: "BRANCA", label: "Branca" },
                    { value: "PRETA", label: "Preta" },
                    { value: "AMARELA", label: "Amarela" },
                    { value: "INDIGENA", label: "Indígena" }
                  ]}
                />
            </div>
          </div>

          {/* --- 3. SAÚDE E SOCIAL (NOVOS DADOS ESTRATÉGICOS) --- */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
             <SectionHeader icon={HeartPulse} title="Saúde & Social" />
             
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Cartão SUS" 
                    placeholder="898 0000..."
                    inputMode="numeric"
                    mask={Formatters.sus}
                    maxLength={18}
                    error={errors.susCard?.message} 
                    {...register('susCard')} 
                  />
                  <Select
                    label="Tipo Sanguíneo"
                    error={errors.bloodType?.message}
                    {...register('bloodType')}
                    options={[
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "NA", label: "Não sei informar" }
                    ]}
                  />
                </div>

                <div className="relative bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <Input 
                    label="NIS (PIS/PASEP)" 
                    placeholder="Para programas sociais"
                    inputMode="numeric"
                    mask={Formatters.nis}
                    maxLength={11}
                    className="bg-white"
                    error={errors.nis?.message} 
                    {...register('nis')} 
                  />
                  <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
                     <Users className="w-3 h-3" /> 
                     Importante para Bolsa Família e Crateús
                  </p>
                </div>
             </div>
          </div>

          {/* --- 4. FAMÍLIA E CONTATO --- */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <SectionHeader icon={Phone} title="Contato & Família" />
            
            <div className="space-y-4">
              <Input 
                label="Celular / WhatsApp" 
                placeholder="(85) 99999-9999"
                inputMode="tel"
                maxLength={15}
                mask={Formatters.phone}
                error={errors.phoneNumber?.message} 
                {...register('phoneNumber')} 
              />

              <Input 
                label="Nome da Mãe" 
                placeholder="Nome completo da mãe"
                error={errors.motherName?.message} 
                {...register('motherName')} 
              />
            </div>
          </div>

          {/* --- 5. ENDEREÇO --- */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <SectionHeader icon={MapPin} title="Localização" />
            
            <div className="grid grid-cols-3 gap-3 md:gap-5">
               <div className="col-span-1">
                  <Input 
                    label="CEP" 
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                    mask={Formatters.cep}
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

            <div className="grid grid-cols-4 gap-3 md:gap-5 mt-4">
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
            
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-500">
               <MapPin className="w-4 h-4 text-mulungu-500" />
               <span>Município: <strong className="text-slate-800">Mulungu - CE</strong></span>
            </div>
          </div>

          {/* --- BOTÃO FINAL --- */}
          <div className="pt-4 pb-8">
            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={!isValid}
              className={`
                w-full py-4 text-base shadow-lg transition-all duration-300
                ${isValid 
                  ? 'bg-mulungu-600 hover:bg-mulungu-700 shadow-mulungu-200 translate-y-0' 
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
                }
              `}
            >
              {isValid ? (
                <span className="flex items-center justify-center gap-2">
                  Confirmar Cadastro <ChevronRight className="w-5 h-5" />
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Preencha todos os campos <AlertCircle className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}