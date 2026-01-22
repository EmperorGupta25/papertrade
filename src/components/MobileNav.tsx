import { BarChart3, TrendingUp, LineChart, Trophy, Bot, Settings, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
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

  const isInMoreMenu = moreTabs.some(t => t.id === activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {primaryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="mobileActiveTab"
                className="absolute inset-x-2 top-1 bottom-1 bg-primary/10 rounded-lg"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <tab.icon className="h-5 w-5 relative z-10" />
            <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
          </button>
        ))}

        <Drawer>
          <DrawerTrigger asChild>
            <button
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isInMoreMenu
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {isInMoreMenu && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-x-2 top-1 bottom-1 bg-primary/10 rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <MoreHorizontal className="h-5 w-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent className="pb-safe">
            <DrawerHeader>
              <DrawerTitle>More Options</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 space-y-2">
              {moreTabs.map((tab) => (
                <DrawerClose asChild key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                </DrawerClose>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </nav>
  );
}
