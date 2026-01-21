// US Stock Market Hours (NYSE/NASDAQ)
// Regular trading: 9:30 AM - 4:00 PM ET, Monday-Friday
// Pre-market: 4:00 AM - 9:30 AM ET
// After-hours: 4:00 PM - 8:00 PM ET

export interface MarketStatus {
  isOpen: boolean;
  status: 'open' | 'pre-market' | 'after-hours' | 'closed';
  nextOpen?: Date;
  nextClose?: Date;
  message: string;
}

// US Federal holidays when market is closed (2024-2025)
const holidays = [
  '2024-01-01', // New Year's Day
  '2024-01-15', // MLK Day
  '2024-02-19', // Presidents Day
  '2024-03-29', // Good Friday
  '2024-05-27', // Memorial Day
  '2024-06-19', // Juneteenth
  '2024-07-04', // Independence Day
  '2024-09-02', // Labor Day
  '2024-11-28', // Thanksgiving
  '2024-12-25', // Christmas
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK Day
  '2025-02-17', // Presidents Day
  '2025-04-18', // Good Friday
  '2025-05-26', // Memorial Day
  '2025-06-19', // Juneteenth
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas
  '2026-01-01', // New Year's Day
  '2026-01-19', // MLK Day
  '2026-02-16', // Presidents Day
  '2026-04-03', // Good Friday
  '2026-05-25', // Memorial Day
  '2026-06-19', // Juneteenth
  '2026-07-03', // Independence Day (observed)
  '2026-09-07', // Labor Day
  '2026-11-26', // Thanksgiving
  '2026-12-25', // Christmas
];

function isHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.includes(dateStr);
}

function getETTime(): Date {
  // Get current time in ET
  const now = new Date();
  const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  return new Date(etString);
}

export function getMarketStatus(): MarketStatus {
  const etNow = getETTime();
  const day = etNow.getDay();
  const hours = etNow.getHours();
  const minutes = etNow.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  // Market hours in minutes from midnight
  const preMarketOpen = 4 * 60; // 4:00 AM
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  const afterHoursClose = 20 * 60; // 8:00 PM

  // Weekend
  if (day === 0 || day === 6) {
    const nextMonday = new Date(etNow);
    nextMonday.setDate(etNow.getDate() + (day === 0 ? 1 : 2));
    nextMonday.setHours(9, 30, 0, 0);
    
    return {
      isOpen: false,
      status: 'closed',
      nextOpen: nextMonday,
      message: 'Market closed for the weekend',
    };
  }

  // Holiday
  if (isHoliday(etNow)) {
    const nextDay = new Date(etNow);
    nextDay.setDate(etNow.getDate() + 1);
    nextDay.setHours(9, 30, 0, 0);
    
    return {
      isOpen: false,
      status: 'closed',
      nextOpen: nextDay,
      message: 'Market closed for holiday',
    };
  }

  // Pre-market
  if (timeInMinutes >= preMarketOpen && timeInMinutes < marketOpen) {
    const openTime = new Date(etNow);
    openTime.setHours(9, 30, 0, 0);
    
    return {
      isOpen: false,
      status: 'pre-market',
      nextOpen: openTime,
      message: 'Pre-market trading session',
    };
  }

  // Regular market hours
  if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    const closeTime = new Date(etNow);
    closeTime.setHours(16, 0, 0, 0);
    
    return {
      isOpen: true,
      status: 'open',
      nextClose: closeTime,
      message: 'Market is open',
    };
  }

  // After-hours
  if (timeInMinutes >= marketClose && timeInMinutes < afterHoursClose) {
    const nextOpen = new Date(etNow);
    nextOpen.setDate(etNow.getDate() + 1);
    nextOpen.setHours(9, 30, 0, 0);
    
    return {
      isOpen: false,
      status: 'after-hours',
      nextOpen,
      message: 'After-hours trading session',
    };
  }

  // Closed (before pre-market or after after-hours)
  const nextPreMarket = new Date(etNow);
  if (timeInMinutes >= afterHoursClose) {
    nextPreMarket.setDate(etNow.getDate() + 1);
  }
  nextPreMarket.setHours(4, 0, 0, 0);

  return {
    isOpen: false,
    status: 'closed',
    nextOpen: nextPreMarket,
    message: 'Market closed',
  };
}

export function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  
  if (diff <= 0) return 'now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
}
