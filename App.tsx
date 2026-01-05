import React, { useState, useEffect } from 'react';
import { MobileContainer, Header } from './components/ui/Layouts';
import { HomeView } from './components/HomeView';
import { RegisterForm } from './components/RegisterForm';
import { DigitalWallet } from './components/DigitalWallet';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { ProfileView } from './components/ProfileView';
import { QrFullscreenView } from './components/QrFullscreenView';
import { CitizenService } from './services/citizenService';
import { ViewState, AuthState, LoginFormData, CitizenFormData } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { LogOut, User } from 'lucide-react';

export default function App() {
  // ViewState.LOGIN is now conceptually "HOME" (Guest or Logged In)
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  // Check for existing session (mock)
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
      setView(ViewState.DASHBOARD); // Redirect to Dashboard on Login
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
      setView(ViewState.DASHBOARD); // Redirect to Dashboard on Register
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
    setView(ViewState.LOGIN); // Go back to Home (Guest)
    toast.dismiss();
  };

  // Header Logic for Logged In Users
  const renderHeaderRight = () => {
    if (authState.user && (view === ViewState.DASHBOARD || view === ViewState.PROFILE_DETAILS)) {
      return (
        <>
          <button 
            onClick={() => setView(ViewState.PROFILE_DETAILS)}
            className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="w-8 h-8 bg-mulungu-100 rounded-full flex items-center justify-center text-mulungu-700 border border-mulungu-200">
               <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-700 leading-none">{authState.user.fullName.split(' ')[0]}</p>
              <p className="text-[9px] text-slate-400 font-medium">Cidadão</p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </>
      );
    }
    return null;
  };

  const getHeaderTitle = () => {
     switch (view) {
        case ViewState.REGISTER: return "Cadastro";
        case ViewState.FORGOT_PASSWORD: return "Recuperação";
        case ViewState.PROFILE_DETAILS: return "Perfil do Cidadão";
        default: return "Meu Mulungu";
     }
  };

  return (
    // Background color for the "desktop body"
    <div className="min-h-screen bg-slate-100 md:py-8 font-sans">
      <MobileContainer>
        <Toaster position="top-center" containerStyle={{ top: 40 }} />
        
        {/* Header Logic: Show simple header on internal pages, Login View has its own structure */}
        {view !== ViewState.LOGIN && view !== ViewState.QR_FULLSCREEN && (
           <Header title={getHeaderTitle()} rightContent={renderHeaderRight()} />
        )}

        {/* Home / Login Landing View */}
        {view === ViewState.LOGIN && (
          <HomeView 
            user={authState.user}
            onLogin={handleLogin}
            onRegisterClick={() => setView(ViewState.REGISTER)}
            onForgotPasswordClick={() => setView(ViewState.FORGOT_PASSWORD)}
            onOpenWallet={() => setView(ViewState.DASHBOARD)}
            isLoading={authState.isLoading}
          />
        )}

        {/* Dashboard View (Carteira) */}
        {view === ViewState.DASHBOARD && authState.user && (
          <DigitalWallet 
            citizen={authState.user} 
            onLogout={handleLogout} 
            onViewProfile={() => setView(ViewState.PROFILE_DETAILS)}
            onShowQrCode={() => setView(ViewState.QR_FULLSCREEN)}
          />
        )}

        {/* Profile Details View */}
        {view === ViewState.PROFILE_DETAILS && authState.user && (
          <ProfileView 
            citizen={authState.user}
            onBack={() => setView(ViewState.DASHBOARD)}
          />
        )}

        {/* QR Fullscreen View */}
        {view === ViewState.QR_FULLSCREEN && authState.user && (
          <QrFullscreenView 
            citizen={authState.user}
            onClose={() => setView(ViewState.DASHBOARD)}
          />
        )}
        
        {/* Registration */}
        {view === ViewState.REGISTER && (
          <div className="p-5 flex-1 overflow-y-auto">
            <RegisterForm 
              onSubmit={handleRegister} 
              onBack={() => setView(ViewState.LOGIN)}
              isLoading={authState.isLoading}
            />
          </div>
        )}

        {/* Forgot Password */}
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
    </div>
  );
}