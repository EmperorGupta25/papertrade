import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Position, allStocks } from '@/lib/stockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AICoachProps {
  positions: Position[];
  balance: number;
  totalPnL: number;
}

// Simulated AI responses based on context
const getAIResponse = (question: string, context: { positions: Position[]; balance: number; totalPnL: number }): string => {
  const q = question.toLowerCase();
  
  if (q.includes('portfolio') || q.includes('holdings')) {
    if (context.positions.length === 0) {
      return "You haven't made any investments yet! I'd recommend starting with well-established companies like AAPL or MSFT. They offer stability for beginners. Consider investing 10-20% of your available cash to start.";
    }
    const positionSummary = context.positions.map(p => {
      const pnl = ((p.currentPrice - p.avgPrice) / p.avgPrice) * 100;
      return `${p.symbol} (${pnl >= 0 ? '+' : ''}${pnl.toFixed(1)}%)`;
    }).join(', ');
    return `Your current positions: ${positionSummary}. ${context.totalPnL >= 0 ? 'Great job! Your portfolio is in profit.' : 'Your portfolio is currently down, but stay focused on your long-term strategy.'} Consider diversifying across different sectors to reduce risk.`;
  }
  
  if (q.includes('buy') || q.includes('invest') || q.includes('recommend')) {
    const topGainer = allStocks.reduce((a, b) => a.changePercent > b.changePercent ? a : b);
    return `Based on today's market, ${topGainer.symbol} (${topGainer.name}) is showing strong momentum with +${topGainer.changePercent.toFixed(2)}% gain. However, always consider your risk tolerance. For beginners, I'd suggest:\n\n1. **AAPL** - Stable tech giant\n2. **MSFT** - Consistent growth\n3. **NVDA** - AI/Tech leader\n\nRemember to use stop-loss orders to protect your capital!`;
  }
  
  if (q.includes('sell') || q.includes('exit')) {
    if (context.positions.length === 0) {
      return "You don't have any positions to sell right now. When you do have investments, I'd recommend selling when a stock hits your profit target or if the fundamentals change significantly.";
    }
    const bestPerformer = context.positions.reduce((a, b) => {
      const aPnl = (a.currentPrice - a.avgPrice) / a.avgPrice;
      const bPnl = (b.currentPrice - b.avgPrice) / b.avgPrice;
      return aPnl > bPnl ? a : b;
    });
    const pnl = ((bestPerformer.currentPrice - bestPerformer.avgPrice) / bestPerformer.avgPrice) * 100;
    return `Your best performer is ${bestPerformer.symbol} at ${pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}%. ${pnl > 10 ? 'You might consider taking some profits here!' : 'It might be worth holding for more upside.'} Always stick to your trading plan.`;
  }
  
  if (q.includes('risk') || q.includes('stop loss') || q.includes('protect')) {
    return "Great question about risk management! Here are my top tips:\n\n1. **Never risk more than 2%** of your portfolio on a single trade\n2. **Always use stop-losses** - I recommend 5-10% for volatile stocks\n3. **Take profits** at predetermined levels (10-20% for short-term)\n4. **Diversify** across at least 5-10 different stocks\n5. **Keep some cash** (20-30%) for opportunities";
  }
  
  if (q.includes('beginner') || q.includes('start') || q.includes('new')) {
    return "Welcome to investing! Here's my beginner's guide:\n\n1. **Start small** - Use only money you can afford to lose\n2. **Learn the basics** - Understand P/E ratios, market cap, and trends\n3. **Blue chips first** - Start with established companies (AAPL, MSFT, GOOGL)\n4. **Practice patience** - Don't chase quick gains\n5. **Use paper trading** - That's exactly what you're doing here! Perfect!\n\nWould you like specific stock recommendations?";
  }
  
  if (q.includes('strategy') || q.includes('approach')) {
    return "Here are three popular strategies to consider:\n\n**1. Buy & Hold** - Great for beginners. Pick quality stocks and hold long-term.\n\n**2. Swing Trading** - Hold for days/weeks, capitalize on price swings.\n\n**3. Momentum Trading** - Follow trends, buy stocks showing upward momentum.\n\nFor this simulator, I'd recommend practicing swing trading with stop-losses!";
  }
  
  // Default response
  return "I'm your AI investment coach! I can help you with:\n\n• **Portfolio analysis** - Ask about your holdings\n• **Buy recommendations** - Get stock ideas\n• **Risk management** - Learn about stop-losses\n• **Trading strategies** - Find your style\n• **Market insights** - Understand trends\n\nWhat would you like to know?";
};

export function AICoach({ positions, balance, totalPnL }: AICoachProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋 I'm your AI investment coach. I'm here to help you make smarter trading decisions. Ask me about stock recommendations, risk management, or portfolio strategies. What would you like to learn today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    'Analyze my portfolio',
    'What should I buy?',
    'Risk management tips',
    'Beginner strategies',
  ];

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = getAIResponse(text, { positions, balance, totalPnL });
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse,
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="gradient-green p-2 rounded-lg">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          AI Investment Coach
          <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            Powered by AI
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'assistant' ? 'gradient-green' : 'bg-secondary'
                }`}>
                  {message.role === 'assistant' ? (
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-secondary'
                    : 'gradient-green text-primary-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-secondary p-3 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map(prompt => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => handleSend(prompt)}
                className="text-xs"
              >
                {prompt}
              </Button>
            ))}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about investing..."
              className="flex-1"
            />
            <Button type="submit" size="icon" className="gradient-green shrink-0">
              <Send className="h-4 w-4 text-primary-foreground" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
