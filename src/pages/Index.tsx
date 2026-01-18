import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { PortfolioCard } from '@/components/PortfolioCard';
import { PositionsList } from '@/components/PositionsList';
import { StockList } from '@/components/StockList';
import { StockChart } from '@/components/StockChart';
import { TradePanel } from '@/components/TradePanel';
import { AICoach } from '@/components/AICoach';
import { TradeHistory } from '@/components/TradeHistory';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Stock, popularStocks } from '@/lib/stockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, TrendingUp, Bot } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(popularStocks[0]);
  
  const {
    balance,
    positions,
    trades,
    portfolioValue,
    totalValue,
    totalPnL,
    totalPnLPercent,
    buyStock,
    sellStock,
    resetPortfolio,
    initialBalance,
  } = usePortfolio();

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    if (activeTab === 'dashboard') {
      setActiveTab('trade');
    }
  };

  const handleViewChart = (symbol: string) => {
    const stock = popularStocks.find(s => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
      setActiveTab('trade');
    }
  };

  const getOwnedShares = (symbol: string) => {
    const position = positions.find(p => p.symbol === symbol);
    return position?.shares || 0;
  };

  // Mobile navigation
  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'coach', label: 'AI Coach', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header balance={balance} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button variant="outline" size="sm" onClick={resetPortfolio}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Portfolio
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <PortfolioCard
                    totalValue={totalValue}
                    portfolioValue={portfolioValue}
                    balance={balance}
                    totalPnL={totalPnL}
                    totalPnLPercent={totalPnLPercent}
                    initialBalance={initialBalance}
                  />

                  {selectedStock && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{selectedStock.symbol} - {selectedStock.name}</span>
                          <span className={selectedStock.change >= 0 ? 'text-profit' : 'text-loss'}>
                            ${selectedStock.price.toFixed(2)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StockChart symbol={selectedStock.symbol} basePrice={selectedStock.price} />
                      </CardContent>
                    </Card>
                  )}

                  <PositionsList
                    positions={positions}
                    onSell={sellStock}
                    onViewChart={handleViewChart}
                  />
                </div>

                <div className="space-y-6">
                  <StockList onSelectStock={handleSelectStock} selectedSymbol={selectedStock?.symbol} />
                  <TradeHistory trades={trades} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trade' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Trade</h1>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {selectedStock ? (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold">{selectedStock.symbol}</span>
                            <span className="text-muted-foreground ml-2">{selectedStock.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${selectedStock.price.toFixed(2)}</p>
                            <p className={`text-sm ${selectedStock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StockChart symbol={selectedStock.symbol} basePrice={selectedStock.price} />
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">Market Cap</p>
                            <p className="font-semibold">{selectedStock.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Volume</p>
                            <p className="font-semibold">{(selectedStock.volume / 1000000).toFixed(1)}M</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">52W High</p>
                            <p className="font-semibold">${selectedStock.high52w.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">52W Low</p>
                            <p className="font-semibold">${selectedStock.low52w.toFixed(2)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Select a stock to view its chart</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="space-y-6">
                  <TradePanel
                    stock={selectedStock}
                    balance={balance}
                    onBuy={buyStock}
                    onSell={sellStock}
                    ownedShares={selectedStock ? getOwnedShares(selectedStock.symbol) : 0}
                  />
                  <StockList onSelectStock={handleSelectStock} selectedSymbol={selectedStock?.symbol} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'coach' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">AI Investment Coach</h1>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AICoach positions={positions} balance={balance} totalPnL={totalPnL} />
                </div>

                <div className="space-y-6">
                  <PortfolioCard
                    totalValue={totalValue}
                    portfolioValue={portfolioValue}
                    balance={balance}
                    totalPnL={totalPnL}
                    totalPnLPercent={totalPnLPercent}
                    initialBalance={initialBalance}
                  />
                  <PositionsList
                    positions={positions}
                    onSell={sellStock}
                    onViewChart={handleViewChart}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-50">
        <div className="flex justify-around py-2">
          {mobileNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default Index;