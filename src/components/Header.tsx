import { TrendingUp, Wallet, Bot, BarChart3, LineChart, Settings, LogIn, User, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MarketStatusBanner } from './MarketStatusBanner';
import logo from '@/assets/logo.png';

interface HeaderProps {
  balance: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export function Header({ balance, activeTab, setActiveTab, onOpenAuth }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  
  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'charts', label: 'Charts', icon: LineChart },
    { id: 'competitions', label: 'Compete', icon: Trophy },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <motion.div 
              className="rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={logo} alt="PaperTrade" className="h-10 w-10" />
            </motion.div>
            <span className="text-xl font-bold hidden sm:inline">PaperTrade</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary/10 rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <MarketStatusBanner />
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openTradeHistory'))}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </button>
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary truncate max-w-[100px]">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onOpenAuth} className="hidden sm:flex">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
