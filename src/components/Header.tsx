import { TrendingUp, Wallet, Bot, BarChart3, LineChart, Settings, LogIn, User, Trophy, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { MarketStatusBanner } from './MarketStatusBanner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

interface HeaderProps {
  balance: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export function Header({ balance, activeTab, setActiveTab, onOpenAuth }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  
  const primaryTabs = [
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'charts', label: 'Charts', icon: LineChart },
  ];

  const moreTabs = [
    { id: 'competitions', label: 'Compete', icon: Trophy },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const allTabs = [...primaryTabs, ...moreTabs];
  const activeTabData = allTabs.find(t => t.id === activeTab);
  const isInMoreMenu = moreTabs.some(t => t.id === activeTab);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <motion.div 
              className="overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={logo} 
                alt="PaperTrade" 
                className="h-9 w-9"
                style={theme === 'light' ? { filter: 'brightness(0)', background: 'transparent' } : undefined}
              />
            </motion.div>
            <span className="text-lg font-bold hidden sm:inline">PaperTrade</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {primaryTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                    isInMoreMenu
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isInMoreMenu && activeTabData ? (
                    <>
                      <activeTabData.icon className="h-4 w-4" />
                      {activeTabData.label}
                    </>
                  ) : (
                    <>
                      <MoreHorizontal className="h-4 w-4" />
                      More
                    </>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover border border-border z-50">
                {moreTabs.map(tab => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 cursor-pointer ${
                      activeTab === tab.id ? 'text-primary bg-primary/10' : ''
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <MarketStatusBanner />
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openTradeHistory'))}
              className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <Wallet className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">
                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </button>
            
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary truncate max-w-[80px]">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={onOpenAuth} className="hidden sm:flex text-xs">
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
