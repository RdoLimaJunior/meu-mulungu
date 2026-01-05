import React, { useState, useEffect } from 'react';
import { MobileContainer } from './components/ui/Layouts';
import { OfficialHeader } from './components/OfficialHeader'; // Novo Header
import { OfficialFooter } from './components/OfficialFooter'; // Novo Footer
import { HomeView } from './components/HomeView';
import { LoginView } from './components/LoginView';
import { RegisterForm } from './components/RegisterForm';
import { DigitalWallet } from './components/DigitalWallet';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { ProfileView } from './components/ProfileView';
import { QrFullscreenView } from './components/QrFullscreenView';
import { CitizenService } from './services/citizenService';
import { ViewState, AuthState, LoginFormData, CitizenFormData } from './types';
import { Toaster, toast } from 'react-hot-toast';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.PUBLIC_HOME);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('mulungu_user_session');
    if (savedUser) {
      setAuthState(prev => ({ ...prev, user: JSON.parse(savedUser) }));
      setView(ViewState.DASHBOARD);
    }
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await CitizenService.login(data);
      setAuthState({ user, isLoading: false, error: null });
      localStorage.setItem('mulungu_user_session', JSON.stringify(user));
      toast.success("Bem-vindo de volta!");
      setView(ViewState.DASHBOARD); 
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: err.message }));
      toast.error(err.message || "Erro ao entrar");
    }
  };

  const handleRegister = async (data: CitizenFormData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const newUser = await CitizenService.register(data);
      setAuthState({ user: newUser, isLoading: false, error: null });
      localStorage.setItem('mulungu_user_session', JSON.stringify(newUser));
      toast.success("Cadastro realizado com sucesso!");
      setView(ViewState.DASHBOARD);
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: err.message }));
      toast.error(err.message || "Erro ao cadastrar");
    }
  };

  const handleForgotPassword = async (cpf: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await CitizenService.requestPasswordReset(cpf);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return result.phoneNumber;
    } catch (err: any) {
      setAuthState(prev => ({ ...prev, isLoading: false, error: err.message }));
      toast.error(err.message || "Erro ao solicitar recuperação");
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mulungu_user_session');
    setAuthState({ user: null, isLoading: false, error: null });
    setView(ViewState.PUBLIC_HOME);
    toast.dismiss();
    toast.success("Você saiu com segurança.");
  };

  const handleServiceInteraction = () => {
    if (authState.user) {
      setView(ViewState.DASHBOARD);
    } else {
      toast("Faça login para acessar este serviço", { icon: '🔒' });
      setView(ViewState.LOGIN);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Toaster position="top-center" containerStyle={{ top: 80 }} />
      
      {/* HEADER OFICIAL DO MUNICÍPIO (AGORA COM LOGIN) */}
      <OfficialHeader 
        user={authState.user}
        onLogin={() => setView(ViewState.LOGIN)}
        onLogout={handleLogout}
        onProfile={() => setView(ViewState.PROFILE_DETAILS)}
      />

      {/* CONTAINER DE CONTEÚDO PRINCIPAL */}
      <MobileContainer>
        
        {view === ViewState.PUBLIC_HOME && (
          <HomeView onInteract={handleServiceInteraction} />
        )}

        {view === ViewState.LOGIN && (
          <LoginView 
            onLogin={handleLogin}
            onRegisterClick={() => setView(ViewState.REGISTER)}
            onForgotPasswordClick={() => setView(ViewState.FORGOT_PASSWORD)}
            onBack={() => setView(ViewState.PUBLIC_HOME)}
            isLoading={authState.isLoading}
          />
        )}

        {view === ViewState.DASHBOARD && authState.user && (
          <DigitalWallet 
            citizen={authState.user} 
            onLogout={handleLogout} 
            onViewProfile={() => setView(ViewState.PROFILE_DETAILS)}
            onShowQrCode={() => setView(ViewState.QR_FULLSCREEN)}
          />
        )}

        {view === ViewState.PROFILE_DETAILS && authState.user && (
          <ProfileView 
            citizen={authState.user}
            onBack={() => setView(ViewState.DASHBOARD)}
          />
        )}

        {view === ViewState.QR_FULLSCREEN && authState.user && (
          <QrFullscreenView 
            citizen={authState.user}
            onClose={() => setView(ViewState.DASHBOARD)}
          />
        )}
        
        {view === ViewState.REGISTER && (
          <div className="p-5 flex-1 overflow-y-auto">
            <RegisterForm 
              onSubmit={handleRegister} 
              onBack={() => setView(ViewState.LOGIN)}
              isLoading={authState.isLoading}
            />
          </div>
        )}

        {view === ViewState.FORGOT_PASSWORD && (
          <div className="p-5 flex-1 overflow-y-auto">
            <ForgotPasswordView 
              onSubmit={handleForgotPassword}
              onBack={() => setView(ViewState.LOGIN)}
              isLoading={authState.isLoading}
            />
          </div>
        )}
      </MobileContainer>

      {/* FOOTER OFICIAL DO MUNICÍPIO */}
      <OfficialFooter />
    </div>
  );
}