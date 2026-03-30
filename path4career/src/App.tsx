import { useState } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Sidebar } from './components/Sidebar';
import type { ModuleId } from './components/Sidebar';
import { Home } from './components/Home';
import { CareerSimulation } from './components/CareerSimulation';
import { MentorMarketplace } from './pages/MentorMarketplace';
import { RiskAnalyzer } from './components/RiskAnalyzer';
import { DecisionEngine } from './components/DecisionEngine';
import { ReputationScore } from './components/ReputationScore';
import { StartupPath } from './components/StartupPath';
import { DigitalTwin } from './components/DigitalTwin';
import { Messages } from './components/Messages';
import { NotificationToast } from './components/NotificationToast';
import { dummyAuth, AuthUser } from './auth/dummyAuth';
import { MentorDashboard } from './pages/MentorDashboard';
import { useEffect } from 'react';

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>('home');
  const [user, setUser] = useState<AuthUser | null>(dummyAuth.getCurrentUser());
  const [isSyncing, setIsSyncing] = useState(true);
  const [bookedMentorIds, setBookedMentorIds] = useState<string[]>([]);
  const [isDMOpen, setIsDMOpen] = useState(false);

  const isAuthenticated = !!user && user.isAuthenticated;

  useEffect(() => {
    // Sync auth state on mount with global platform token
    const syncState = async () => {
      const globalUser = await dummyAuth.syncWithGlobalToken();
      if (globalUser) {
        setUser(globalUser);
      } else {
        setUser(null);
      }
      setIsSyncing(false);
    };
    syncState();
  }, []);

  const navigate = (id: ModuleId) => {
    setActiveModule(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requireAuth = (callback: () => void) => {
    if (isSyncing) {
      // Wait for sync to finish before making a decision
      const checkAgain = setInterval(() => {
        if (!isSyncing) {
          clearInterval(checkAgain);
          if (isAuthenticated) callback();
          else {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `../../pages/auth/login.html?redirect=${currentUrl}`;
          }
        }
      }, 100);
      return;
    }

    if (isAuthenticated) {
      callback();
    } else {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `../../pages/auth/login.html?redirect=${currentUrl}`;
    }
  };



  const handleBookMentor = (mentorId: string) => {
    if (!bookedMentorIds.includes(mentorId)) {
      setBookedMentorIds([...bookedMentorIds, mentorId]);
    }
  };



  const toggleDM = () => {
    setIsDMOpen(!isDMOpen);
  };

  const renderModule = () => {
    // Route protection
    if (activeModule === 'mentorDashboard' && user?.role !== 'mentor') {
      setTimeout(() => navigate('home'), 0);
      return <Home onNavigate={navigate} />;
    }

    if (isSyncing) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center pt-[115px]">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-medium animate-pulse">Synchronizing with global account...</p>
        </div>
      );
    }

    switch (activeModule) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'simulation': return <CareerSimulation requireAuth={requireAuth} />;
      case 'mentor': return <MentorMarketplace requireAuth={requireAuth} bookedMentorIds={bookedMentorIds} onBookMentor={handleBookMentor} onNavigate={navigate} />;
      case 'risk': return <RiskAnalyzer requireAuth={requireAuth} />;
      case 'decision': return <DecisionEngine requireAuth={requireAuth} />;
      case 'reputation': return <ReputationScore requireAuth={requireAuth} />;
      case 'startup': return <StartupPath requireAuth={requireAuth} isAuthenticated={isAuthenticated} />;
      case 'twin': return <DigitalTwin requireAuth={requireAuth} />;
      case 'messages': return <Messages requireAuth={requireAuth} bookedMentorIds={bookedMentorIds} />;
      case 'mentorDashboard': return <MentorDashboard />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="animated-bg" />
      <div className="global-grid" />
      
      <div className="relative flex min-h-screen pt-[115px] text-foreground transition-colors duration-300">
        <Sidebar 
          activeModule={activeModule} 
          onNavigate={navigate} 
          isAuthenticated={isAuthenticated} 
          userRole={user?.role} 
          isDMOpen={isDMOpen}
          onToggleDM={toggleDM}
        />
        <main className="flex-1 w-full lg:ml-64 pt-16 lg:pt-[15px] transition-all duration-300">
          {renderModule()}
        </main>
        
        {/* DM Modal Overlay */}
        {isDMOpen && isAuthenticated && (
          <div 
            className="fixed inset-0 z-50 overflow-auto bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsDMOpen(false)}
          >
            <div 
              className="min-h-screen"
              onClick={(e) => e.stopPropagation()}
            >
              <Messages requireAuth={requireAuth} bookedMentorIds={bookedMentorIds} onClose={() => setIsDMOpen(false)} />
            </div>
          </div>
        )}
      </div>
      
      {/* Floating Chat Button - visible when authenticated and not on Messages page */}
      {isAuthenticated && activeModule !== 'messages' && (
        <Messages requireAuth={requireAuth} isFloatingMode={true} />
      )}
      
      {/* Global notification toasts */}
      <NotificationToast />
    </ThemeProvider>
  );
}
