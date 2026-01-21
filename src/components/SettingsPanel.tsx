import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { 
  RefreshCw, 
  User, 
  Moon, 
  Info, 
  Shield, 
  LogOut, 
  LogIn,
  AlertTriangle,
  DollarSign,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsPanelProps {
  onReset: (newBalance: number) => void;
  currentBalance: number;
  initialBalance: number;
}

const presetAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

export function SettingsPanel({ onReset, currentBalance, initialBalance }: SettingsPanelProps) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  
  const { user, isAuthenticated, signOut } = useAuth();

  const handleReset = () => {
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : 10000);
    if (amount < 100) {
      toast.error('Minimum starting balance is $100');
      return;
    }
    if (amount > 10000000) {
      toast.error('Maximum starting balance is $10,000,000');
      return;
    }
    onReset(amount);
    toast.success(`Portfolio reset with $${amount.toLocaleString()}`);
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account
          </CardTitle>
          <CardDescription>
            Manage your account and save your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAuthenticated && (
            <Alert variant="default" className="border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertTitle className="text-warning">Progress Not Saved</AlertTitle>
              <AlertDescription className="text-warning/80">
                Your progress will be lost when you close this page. Sign in to save your portfolio and track your performance over time.
              </AlertDescription>
            </Alert>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-muted-foreground">Your progress is being saved</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowAuthModal(true)} className="w-full">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Save Progress
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Reset Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Reset Portfolio
          </CardTitle>
          <CardDescription>
            Start fresh with a new balance. Current balance: ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Starting Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map(amount => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className="relative"
                >
                  ${amount.toLocaleString()}
                  {selectedAmount === amount && (
                    <Check className="h-3 w-3 absolute top-1 right-1" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div>
            <Label htmlFor="customAmount">Custom Amount</Label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="customAmount"
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                className="pl-10"
                min={100}
                max={10000000}
              />
            </div>
          </div>

          <Button 
            onClick={handleReset} 
            className="w-full"
            variant="destructive"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Portfolio
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how PaperTrade looks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About PaperTrade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <motion.div 
              className="inline-block gradient-green p-4 rounded-2xl mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <DollarSign className="h-12 w-12 text-primary-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">PaperTrade</h3>
            <p className="text-lg italic text-muted-foreground mb-4">
              "Don't dwell on the losses, simulate your profits"
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              PaperTrade is a mock investing platform that lets you practice trading stocks 
              with virtual money. Learn the markets, test strategies, and build confidence 
              without any financial risk.
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Version</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-muted-foreground">Made with</p>
              <p className="font-medium">❤️ & React</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground">
            <strong>Data Collection:</strong> We collect only the information you provide when creating 
            an account (email address) and your trading activity within the app.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>Data Usage:</strong> Your data is used solely to provide the paper trading service 
            and to save your portfolio progress across sessions.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>Data Security:</strong> All data is encrypted and stored securely. We never share 
            your personal information with third parties.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>No Real Money:</strong> PaperTrade is a simulation platform only. No real money or 
            actual stock transactions are involved.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            <strong>Contact:</strong> For any privacy concerns, please reach out through our support channels.
          </p>
        </CardContent>
      </Card>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}
