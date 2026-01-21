import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  Bot, 
  Settings, 
  Trophy,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    title: 'Welcome to PaperTrade!',
    description: 'Learn to invest with virtual money. No risk, real learning. Let\'s take a quick tour of the platform!',
    icon: <Sparkles className="h-8 w-8" />,
  },
  {
    title: 'Portfolio Overview',
    description: 'Track your total value, cash balance, and invested amount. See how your positions are performing at a glance.',
    icon: <BarChart3 className="h-8 w-8" />,
    target: 'portfolio',
  },
  {
    title: 'Trade Stocks',
    description: 'Buy and sell stocks with your virtual balance. Set stop-loss and take-profit orders to manage risk automatically.',
    icon: <TrendingUp className="h-8 w-8" />,
    target: 'trade',
  },
  {
    title: 'Analyze Charts',
    description: 'View detailed price charts with multiple timeframes. Hover over any point to see exact prices at that moment.',
    icon: <LineChart className="h-8 w-8" />,
    target: 'charts',
  },
  {
    title: 'AI Investment Coach',
    description: 'Get personalized advice and learn investment strategies from our AI coach. Perfect for beginners!',
    icon: <Bot className="h-8 w-8" />,
    target: 'coach',
  },
  {
    title: 'Competitions',
    description: 'Challenge your friends to trading competitions! See who can grow their portfolio the most.',
    icon: <Trophy className="h-8 w-8" />,
    target: 'competitions',
  },
  {
    title: 'You\'re All Set!',
    description: 'Start with $10,000 in virtual cash. Remember to sign in to save your progress. Happy trading!',
    icon: <Sparkles className="h-8 w-8" />,
  },
];

interface WelcomeTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (tab: string) => void;
}

export function WelcomeTour({ open, onOpenChange, onNavigate }: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === tourSteps.length - 1;
  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onOpenChange(false);
      localStorage.setItem('hasSeenTour', 'true');
    } else {
      if (step.target && onNavigate) {
        onNavigate(step.target);
      }
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  // Reset step when opening
  useEffect(() => {
    if (open) {
      setCurrentStep(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              {step.icon}
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-xl mt-2">{step.title}</DialogTitle>
          <DialogDescription className="text-base">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 py-4">
          {tourSteps.map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep 
                  ? 'w-6 bg-primary' 
                  : i < currentStep 
                    ? 'w-2 bg-primary/50' 
                    : 'w-2 bg-secondary'
              }`}
              animate={{ scale: i === currentStep ? 1.1 : 1 }}
            />
          ))}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 gap-2">
            {isLastStep ? 'Start Trading' : 'Next'}
            {!isLastStep && <ArrowRight className="h-4 w-4" />}
          </Button>
        </DialogFooter>

        <p className="text-center text-xs text-muted-foreground">
          Step {currentStep + 1} of {tourSteps.length}
        </p>
      </DialogContent>
    </Dialog>
  );
}
