import React, { useState, useEffect } from 'react';
import { MobileContainer } from './components/ui/Layouts';
import { OfficialHeader } from './components/OfficialHeader'; 
import { OfficialFooter } from './components/OfficialFooter'; 
import { HomeView } from './components/HomeView';
import { LoginView } from './components/LoginView';
import { RegisterForm } from './components/RegisterForm';
import { DigitalWallet } from './components/DigitalWallet';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { ProfileView } from './components/ProfileView';
import { QrFullscreenView } from './components/QrFullscreenView';
import { WebView } from './components/WebView';
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

  // Estado para controlar qual URL abrir no WebView
  const [webViewConfig, setWebViewConfig] = useState<{url: string, title: string} | null>(null);

  // UX Improvement: Reset scroll on view change
  const changeView = (newView: ViewState) => {
    setView(newView);
    // Pequeno delay para garantir que o render cycle termine antes de rolar
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 10);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('mulungu_user_session');
      if (savedUser) {
        setAuthState(prev => ({ ...prev, user: JSON.parse(savedUser) }));
        // Não usamos changeView aqui para evitar scroll desnecessário no load inicial
        setView(ViewState.DASHBOARD);
      }
    }
  }, []);

  const handleLogin = async (data: LoginFormData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await CitizenService.login(data);
      setAuthState({ user, isLoading: false, error: null });
      localStorage.setItem('mulungu_user_session', JSON.stringify(user));
      toast.success("Bem-vindo de volta!");
      changeView(ViewState.DASHBOARD); 
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
      changeView(ViewState.DASHBOARD);
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
    changeView(ViewState.PUBLIC_HOME);
    toast.dismiss();
    toast.success("Você saiu com segurança.");
  };

  const handleServiceInteraction = (serviceName?: string) => {
    // 1. Serviços Públicos (Abrem WebView sem login)
    if (serviceName === "Sala Empreendedor") {
      setWebViewConfig({
        url: 'https://empreendedor.mulungu.ce.gov.br/',
        title: 'Sala do Empreendedor'
      });
      // Importante: Não mudamos a ViewState principal para não perder o contexto (Dashboard ou Home),
      // apenas setamos a config do WebView que será renderizado por cima.
      return; 
    }

    if (serviceName === "Carta de Serviços") {
      setWebViewConfig({
        url: 'https://www.mulungu.ce.gov.br/cartaservicos.php',
        title: 'Carta de Serviços'
      });
      return;
    }

    // 2. Serviços Privados (Requerem Login)
    if (authState.user) {
      changeView(ViewState.DASHBOARD);
    } else {
      toast("Faça login para acessar este serviço", { icon: '🔒' });
      changeView(ViewState.LOGIN);
    }
  };

  const handleCloseWebView = () => {
    setWebViewConfig(null);
    // Não precisamos mudar o viewState pois ele é um overlay agora
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 relative">
      <Toaster position="top-center" containerStyle={{ top: 80 }} />
      
      {/* HEADER OFICIAL */}
      <OfficialHeader 
        user={authState.user}
        onLogin={() => changeView(ViewState.LOGIN)}
        onLogout={handleLogout}
        onProfile={() => changeView(ViewState.PROFILE_DETAILS)}
      />

      {/* CONTAINER PRINCIPAL */}
      <MobileContainer>
        
        {view === ViewState.PUBLIC_HOME && (
          <HomeView onInteract={handleServiceInteraction} />
        )}

        {view === ViewState.LOGIN && (
          <LoginView 
            onLogin={handleLogin}
            onRegisterClick={() => changeView(ViewState.REGISTER)}
            onForgotPasswordClick={() => changeView(ViewState.FORGOT_PASSWORD)}
            onBack={() => changeView(ViewState.PUBLIC_HOME)}
            isLoading={authState.isLoading}
          />
        )}

        {view === ViewState.DASHBOARD && authState.user && (
          <DigitalWallet 
            citizen={authState.user} 
            onLogout={handleLogout} 
            onViewProfile={() => changeView(ViewState.PROFILE_DETAILS)}
            onShowQrCode={() => changeView(ViewState.QR_FULLSCREEN)}
          />
        )}

        {view === ViewState.PROFILE_DETAILS && authState.user && (
          <ProfileView 
            citizen={authState.user}
            onBack={() => changeView(ViewState.DASHBOARD)}
          />
        )}

        {view === ViewState.QR_FULLSCREEN && authState.user && (
          <QrFullscreenView 
            citizen={authState.user}
            onClose={() => changeView(ViewState.DASHBOARD)}
          />
        )}
        
        {view === ViewState.REGISTER && (
          <div className="p-5 flex-1 overflow-y-auto">
            <RegisterForm 
              onSubmit={handleRegister} 
              onBack={() => changeView(ViewState.LOGIN)}
              isLoading={authState.isLoading}
            />
          </div>
        )}

        {view === ViewState.FORGOT_PASSWORD && (
          <div className="p-5 flex-1 overflow-y-auto">
            <ForgotPasswordView 
              onSubmit={handleForgotPassword}
              onBack={() => changeView(ViewState.LOGIN)}
              isLoading={authState.isLoading}
            />
          </div>
        )}
      </MobileContainer>

      {/* FOOTER OFICIAL */}
      <OfficialFooter />

      {/* WEBVIEW OVERLAY - Renderizado fora do fluxo principal para garantir tela cheia */}
      {webViewConfig && (
        <WebView 
          url={webViewConfig.url}
          title={webViewConfig.title}
          onClose={handleCloseWebView}
        />
      )}
    </div>
  );
}