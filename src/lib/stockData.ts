// Comprehensive stock data with 300+ stocks across all sectors
// Prices are mock starting points - will be replaced with live Finnhub data

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  high52w: number;
  low52w: number;
  sector?: string;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// All stocks organized by sector
export const allStocks: Stock[] = [
  // Technology (40 stocks)
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, changePercent: 1.33, volume: 52340000, marketCap: '2.8T', high52w: 199.62, low52w: 164.08, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.12, changePercent: 1.10, volume: 18920000, marketCap: '2.8T', high52w: 420.82, low52w: 309.45, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.80, change: -0.92, changePercent: -0.65, volume: 21890000, marketCap: '1.8T', high52w: 153.78, low52w: 115.83, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.25, change: 1.87, changePercent: 1.06, volume: 34120000, marketCap: '1.9T', high52w: 201.20, low52w: 118.35, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: 12.45, changePercent: 1.44, volume: 42150000, marketCap: '2.2T', high52w: 974.00, low52w: 373.56, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms', price: 505.95, change: 8.23, changePercent: 1.65, volume: 15430000, marketCap: '1.3T', high52w: 542.81, low52w: 274.38, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.32, changePercent: -2.10, volume: 98760000, marketCap: '789B', high52w: 299.29, low52w: 152.37, sector: 'Technology' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor', price: 142.50, change: 1.23, changePercent: 0.87, volume: 12340000, marketCap: '740B', high52w: 155.00, low52w: 84.00, sector: 'Technology' },
  { symbol: 'AVGO', name: 'Broadcom Inc.', price: 1320.45, change: 15.67, changePercent: 1.20, volume: 3450000, marketCap: '612B', high52w: 1438.00, low52w: 796.00, sector: 'Technology' },
  { symbol: 'ORCL', name: 'Oracle Corp.', price: 127.89, change: 0.45, changePercent: 0.35, volume: 8920000, marketCap: '352B', high52w: 140.38, low52w: 99.26, sector: 'Technology' },
  { symbol: 'CRM', name: 'Salesforce Inc.', price: 272.34, change: 3.21, changePercent: 1.19, volume: 5670000, marketCap: '264B', high52w: 318.72, low52w: 193.68, sector: 'Technology' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 524.67, change: -2.34, changePercent: -0.44, volume: 3120000, marketCap: '234B', high52w: 638.25, low52w: 433.97, sector: 'Technology' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.23, change: 2.78, changePercent: 1.71, volume: 45670000, marketCap: '267B', high52w: 227.30, low52w: 93.12, sector: 'Technology' },
  { symbol: 'INTC', name: 'Intel Corp.', price: 43.56, change: -0.67, changePercent: -1.51, volume: 32450000, marketCap: '184B', high52w: 51.28, low52w: 29.73, sector: 'Technology' },
  { symbol: 'QCOM', name: 'Qualcomm Inc.', price: 168.45, change: 1.23, changePercent: 0.74, volume: 6780000, marketCap: '188B', high52w: 184.42, low52w: 101.47, sector: 'Technology' },
  { symbol: 'TXN', name: 'Texas Instruments', price: 174.89, change: 0.89, changePercent: 0.51, volume: 4560000, marketCap: '159B', high52w: 185.50, low52w: 139.87, sector: 'Technology' },
  { symbol: 'CSCO', name: 'Cisco Systems', price: 48.23, change: 0.34, changePercent: 0.71, volume: 18920000, marketCap: '196B', high52w: 58.19, low52w: 44.42, sector: 'Technology' },
  { symbol: 'IBM', name: 'IBM Corp.', price: 187.56, change: 1.23, changePercent: 0.66, volume: 4230000, marketCap: '172B', high52w: 199.18, low52w: 128.37, sector: 'Technology' },
  { symbol: 'NOW', name: 'ServiceNow Inc.', price: 782.34, change: 8.90, changePercent: 1.15, volume: 1230000, marketCap: '161B', high52w: 815.32, low52w: 489.87, sector: 'Technology' },
  { symbol: 'INTU', name: 'Intuit Inc.', price: 628.45, change: 4.56, changePercent: 0.73, volume: 1450000, marketCap: '176B', high52w: 657.76, low52w: 443.99, sector: 'Technology' },
  { symbol: 'AMAT', name: 'Applied Materials', price: 198.67, change: 2.34, changePercent: 1.19, volume: 5670000, marketCap: '165B', high52w: 232.64, low52w: 128.55, sector: 'Technology' },
  { symbol: 'MU', name: 'Micron Technology', price: 108.45, change: 1.67, changePercent: 1.56, volume: 18920000, marketCap: '120B', high52w: 157.54, low52w: 60.50, sector: 'Technology' },
  { symbol: 'LRCX', name: 'Lam Research', price: 912.34, change: 12.45, changePercent: 1.38, volume: 1230000, marketCap: '118B', high52w: 1023.00, low52w: 556.27, sector: 'Technology' },
  { symbol: 'SNPS', name: 'Synopsys Inc.', price: 567.89, change: 5.67, changePercent: 1.01, volume: 890000, marketCap: '87B', high52w: 629.38, low52w: 412.44, sector: 'Technology' },
  { symbol: 'KLAC', name: 'KLA Corp.', price: 678.45, change: 7.89, changePercent: 1.18, volume: 980000, marketCap: '91B', high52w: 731.00, low52w: 445.50, sector: 'Technology' },
  { symbol: 'CDNS', name: 'Cadence Design', price: 298.67, change: 3.45, changePercent: 1.17, volume: 1120000, marketCap: '81B', high52w: 329.89, low52w: 215.68, sector: 'Technology' },
  { symbol: 'ADSK', name: 'Autodesk Inc.', price: 245.78, change: 2.12, changePercent: 0.87, volume: 1560000, marketCap: '53B', high52w: 279.16, low52w: 187.17, sector: 'Technology' },
  { symbol: 'PANW', name: 'Palo Alto Networks', price: 312.45, change: 4.56, changePercent: 1.48, volume: 2340000, marketCap: '102B', high52w: 380.84, low52w: 222.00, sector: 'Technology' },
  { symbol: 'CRWD', name: 'CrowdStrike Holdings', price: 312.67, change: 5.78, changePercent: 1.88, volume: 3450000, marketCap: '75B', high52w: 398.33, low52w: 140.52, sector: 'Technology' },
  { symbol: 'WDAY', name: 'Workday Inc.', price: 267.89, change: 2.34, changePercent: 0.88, volume: 1780000, marketCap: '71B', high52w: 294.04, low52w: 187.00, sector: 'Technology' },
  { symbol: 'TEAM', name: 'Atlassian Corp.', price: 234.56, change: 3.45, changePercent: 1.49, volume: 1230000, marketCap: '61B', high52w: 285.76, low52w: 153.10, sector: 'Technology' },
  { symbol: 'SNOW', name: 'Snowflake Inc.', price: 178.90, change: 2.67, changePercent: 1.51, volume: 4560000, marketCap: '59B', high52w: 237.72, low52w: 107.13, sector: 'Technology' },
  { symbol: 'DDOG', name: 'Datadog Inc.', price: 134.56, change: 1.89, changePercent: 1.43, volume: 3450000, marketCap: '45B', high52w: 164.88, low52w: 80.81, sector: 'Technology' },
  { symbol: 'ZS', name: 'Zscaler Inc.', price: 198.67, change: 2.34, changePercent: 1.19, volume: 1230000, marketCap: '30B', high52w: 259.61, low52w: 143.59, sector: 'Technology' },
  { symbol: 'NET', name: 'Cloudflare Inc.', price: 98.45, change: 1.56, changePercent: 1.61, volume: 5670000, marketCap: '33B', high52w: 116.00, low52w: 54.49, sector: 'Technology' },
  { symbol: 'MDB', name: 'MongoDB Inc.', price: 412.34, change: 5.67, changePercent: 1.39, volume: 890000, marketCap: '30B', high52w: 509.62, low52w: 212.74, sector: 'Technology' },
  { symbol: 'SPLK', name: 'Splunk Inc.', price: 156.78, change: 1.23, changePercent: 0.79, volume: 2340000, marketCap: '26B', high52w: 161.29, low52w: 89.93, sector: 'Technology' },
  { symbol: 'OKTA', name: 'Okta Inc.', price: 112.45, change: 1.67, changePercent: 1.51, volume: 2120000, marketCap: '19B', high52w: 126.81, low52w: 65.74, sector: 'Technology' },
  { symbol: 'TWLO', name: 'Twilio Inc.', price: 67.89, change: 0.89, changePercent: 1.33, volume: 3450000, marketCap: '12B', high52w: 89.05, low52w: 50.58, sector: 'Technology' },
  { symbol: 'U', name: 'Unity Software', price: 42.34, change: 0.56, changePercent: 1.34, volume: 4560000, marketCap: '17B', high52w: 56.02, low52w: 22.26, sector: 'Technology' },

  // Financial Services (35 stocks)
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.42, change: 0.87, changePercent: 0.44, volume: 8920000, marketCap: '571B', high52w: 205.88, low52w: 135.19, sector: 'Financial' },
  { symbol: 'V', name: 'Visa Inc.', price: 279.85, change: 1.23, changePercent: 0.44, volume: 6780000, marketCap: '574B', high52w: 290.96, low52w: 227.68, sector: 'Financial' },
  { symbol: 'MA', name: 'Mastercard Inc.', price: 456.78, change: 2.34, changePercent: 0.51, volume: 3450000, marketCap: '425B', high52w: 490.00, low52w: 359.77, sector: 'Financial' },
  { symbol: 'BAC', name: 'Bank of America', price: 37.89, change: 0.23, changePercent: 0.61, volume: 34560000, marketCap: '297B', high52w: 39.40, low52w: 24.96, sector: 'Financial' },
  { symbol: 'WFC', name: 'Wells Fargo', price: 56.78, change: 0.45, changePercent: 0.80, volume: 18920000, marketCap: '200B', high52w: 62.55, low52w: 40.18, sector: 'Financial' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 412.34, change: 3.45, changePercent: 0.84, volume: 2340000, marketCap: '134B', high52w: 479.86, low52w: 289.36, sector: 'Financial' },
  { symbol: 'MS', name: 'Morgan Stanley', price: 98.67, change: 0.78, changePercent: 0.80, volume: 8920000, marketCap: '159B', high52w: 109.73, low52w: 70.51, sector: 'Financial' },
  { symbol: 'BLK', name: 'BlackRock Inc.', price: 812.45, change: 5.67, changePercent: 0.70, volume: 890000, marketCap: '122B', high52w: 942.67, low52w: 614.61, sector: 'Financial' },
  { symbol: 'C', name: 'Citigroup Inc.', price: 58.90, change: 0.34, changePercent: 0.58, volume: 14560000, marketCap: '112B', high52w: 64.22, low52w: 38.17, sector: 'Financial' },
  { symbol: 'AXP', name: 'American Express', price: 234.56, change: 1.89, changePercent: 0.81, volume: 3120000, marketCap: '169B', high52w: 245.20, low52w: 141.54, sector: 'Financial' },
  { symbol: 'SCHW', name: 'Charles Schwab', price: 72.34, change: 0.56, changePercent: 0.78, volume: 6780000, marketCap: '132B', high52w: 79.49, low52w: 48.66, sector: 'Financial' },
  { symbol: 'SPGI', name: 'S&P Global', price: 456.78, change: 3.45, changePercent: 0.76, volume: 1230000, marketCap: '142B', high52w: 503.27, low52w: 340.40, sector: 'Financial' },
  { symbol: 'CME', name: 'CME Group', price: 212.34, change: 1.23, changePercent: 0.58, volume: 1890000, marketCap: '76B', high52w: 226.40, low52w: 175.25, sector: 'Financial' },
  { symbol: 'ICE', name: 'Intercontinental Exchange', price: 134.56, change: 0.89, changePercent: 0.67, volume: 2340000, marketCap: '77B', high52w: 148.22, low52w: 102.78, sector: 'Financial' },
  { symbol: 'PNC', name: 'PNC Financial', price: 167.89, change: 1.12, changePercent: 0.67, volume: 2890000, marketCap: '67B', high52w: 181.28, low52w: 119.32, sector: 'Financial' },
  { symbol: 'USB', name: 'US Bancorp', price: 45.67, change: 0.34, changePercent: 0.75, volume: 7890000, marketCap: '71B', high52w: 51.53, low52w: 30.15, sector: 'Financial' },
  { symbol: 'TFC', name: 'Truist Financial', price: 38.90, change: 0.23, changePercent: 0.60, volume: 8920000, marketCap: '52B', high52w: 42.95, low52w: 26.29, sector: 'Financial' },
  { symbol: 'COF', name: 'Capital One', price: 145.67, change: 1.23, changePercent: 0.85, volume: 3450000, marketCap: '55B', high52w: 165.60, low52w: 96.68, sector: 'Financial' },
  { symbol: 'BK', name: 'Bank of New York', price: 56.78, change: 0.45, changePercent: 0.80, volume: 4560000, marketCap: '43B', high52w: 62.95, low52w: 40.46, sector: 'Financial' },
  { symbol: 'AIG', name: 'American Intl Group', price: 78.90, change: 0.67, changePercent: 0.86, volume: 3120000, marketCap: '53B', high52w: 85.35, low52w: 52.91, sector: 'Financial' },
  { symbol: 'MET', name: 'MetLife Inc.', price: 72.34, change: 0.56, changePercent: 0.78, volume: 4230000, marketCap: '53B', high52w: 79.60, low52w: 55.93, sector: 'Financial' },
  { symbol: 'PRU', name: 'Prudential Financial', price: 112.45, change: 0.89, changePercent: 0.80, volume: 2340000, marketCap: '41B', high52w: 122.68, low52w: 81.41, sector: 'Financial' },
  { symbol: 'AFL', name: 'Aflac Inc.', price: 82.34, change: 0.56, changePercent: 0.69, volume: 3450000, marketCap: '49B', high52w: 88.07, low52w: 66.52, sector: 'Financial' },
  { symbol: 'ALL', name: 'Allstate Corp.', price: 167.89, change: 1.23, changePercent: 0.74, volume: 1780000, marketCap: '43B', high52w: 184.89, low52w: 107.69, sector: 'Financial' },
  { symbol: 'TRV', name: 'Travelers Companies', price: 223.45, change: 1.67, changePercent: 0.75, volume: 1230000, marketCap: '51B', high52w: 242.90, low52w: 164.17, sector: 'Financial' },
  { symbol: 'CB', name: 'Chubb Limited', price: 256.78, change: 1.89, changePercent: 0.74, volume: 1450000, marketCap: '105B', high52w: 275.27, low52w: 193.68, sector: 'Financial' },
  { symbol: 'MMC', name: 'Marsh & McLennan', price: 212.34, change: 1.45, changePercent: 0.69, volume: 1670000, marketCap: '104B', high52w: 225.00, low52w: 175.88, sector: 'Financial' },
  { symbol: 'AON', name: 'Aon plc', price: 334.56, change: 2.34, changePercent: 0.70, volume: 890000, marketCap: '71B', high52w: 361.28, low52w: 283.58, sector: 'Financial' },
  { symbol: 'PYPL', name: 'PayPal Holdings', price: 67.89, change: 0.89, changePercent: 1.33, volume: 12340000, marketCap: '73B', high52w: 84.46, low52w: 50.25, sector: 'Financial' },
  { symbol: 'SQ', name: 'Block Inc.', price: 78.45, change: 1.23, changePercent: 1.59, volume: 8920000, marketCap: '48B', high52w: 92.28, low52w: 39.38, sector: 'Financial' },
  { symbol: 'COIN', name: 'Coinbase Global', price: 234.56, change: 5.67, changePercent: 2.48, volume: 6780000, marketCap: '58B', high52w: 283.48, low52w: 50.01, sector: 'Financial' },
  { symbol: 'HOOD', name: 'Robinhood Markets', price: 18.90, change: 0.45, changePercent: 2.44, volume: 23450000, marketCap: '17B', high52w: 24.88, low52w: 7.91, sector: 'Financial' },
  { symbol: 'FIS', name: 'Fidelity National', price: 67.89, change: 0.56, changePercent: 0.83, volume: 3450000, marketCap: '40B', high52w: 76.59, low52w: 50.25, sector: 'Financial' },
  { symbol: 'FISV', name: 'Fiserv Inc.', price: 156.78, change: 1.23, changePercent: 0.79, volume: 2890000, marketCap: '93B', high52w: 171.56, low52w: 111.28, sector: 'Financial' },
  { symbol: 'GPN', name: 'Global Payments', price: 123.45, change: 0.89, changePercent: 0.73, volume: 1780000, marketCap: '32B', high52w: 142.17, low52w: 93.74, sector: 'Financial' },

  // Healthcare (40 stocks)
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 512.34, change: 3.45, changePercent: 0.68, volume: 3450000, marketCap: '472B', high52w: 554.70, low52w: 436.38, sector: 'Healthcare' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 156.78, change: 0.89, changePercent: 0.57, volume: 6780000, marketCap: '378B', high52w: 175.97, low52w: 143.13, sector: 'Healthcare' },
  { symbol: 'LLY', name: 'Eli Lilly', price: 789.45, change: 12.34, changePercent: 1.59, volume: 2340000, marketCap: '750B', high52w: 972.53, low52w: 516.57, sector: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 28.90, change: 0.23, changePercent: 0.80, volume: 34560000, marketCap: '163B', high52w: 43.48, low52w: 25.20, sector: 'Healthcare' },
  { symbol: 'ABBV', name: 'AbbVie Inc.', price: 178.90, change: 1.23, changePercent: 0.69, volume: 5670000, marketCap: '316B', high52w: 182.38, low52w: 135.85, sector: 'Healthcare' },
  { symbol: 'MRK', name: 'Merck & Co.', price: 128.45, change: 0.78, changePercent: 0.61, volume: 8920000, marketCap: '325B', high52w: 134.63, low52w: 99.14, sector: 'Healthcare' },
  { symbol: 'TMO', name: 'Thermo Fisher', price: 567.89, change: 4.56, changePercent: 0.81, volume: 1230000, marketCap: '217B', high52w: 604.92, low52w: 434.30, sector: 'Healthcare' },
  { symbol: 'ABT', name: 'Abbott Laboratories', price: 112.34, change: 0.67, changePercent: 0.60, volume: 4560000, marketCap: '195B', high52w: 121.64, low52w: 89.67, sector: 'Healthcare' },
  { symbol: 'DHR', name: 'Danaher Corp.', price: 256.78, change: 1.89, changePercent: 0.74, volume: 2340000, marketCap: '185B', high52w: 276.00, low52w: 199.63, sector: 'Healthcare' },
  { symbol: 'BMY', name: 'Bristol-Myers Squibb', price: 52.34, change: 0.34, changePercent: 0.65, volume: 12340000, marketCap: '106B', high52w: 68.06, low52w: 39.35, sector: 'Healthcare' },
  { symbol: 'AMGN', name: 'Amgen Inc.', price: 289.45, change: 2.12, changePercent: 0.74, volume: 2890000, marketCap: '155B', high52w: 333.00, low52w: 221.00, sector: 'Healthcare' },
  { symbol: 'GILD', name: 'Gilead Sciences', price: 78.90, change: 0.56, changePercent: 0.71, volume: 6780000, marketCap: '99B', high52w: 87.66, low52w: 62.07, sector: 'Healthcare' },
  { symbol: 'MDT', name: 'Medtronic plc', price: 82.34, change: 0.45, changePercent: 0.55, volume: 5670000, marketCap: '109B', high52w: 91.26, low52w: 71.19, sector: 'Healthcare' },
  { symbol: 'ISRG', name: 'Intuitive Surgical', price: 412.34, change: 4.56, changePercent: 1.12, volume: 1230000, marketCap: '147B', high52w: 443.00, low52w: 276.55, sector: 'Healthcare' },
  { symbol: 'VRTX', name: 'Vertex Pharma', price: 412.67, change: 3.45, changePercent: 0.84, volume: 1450000, marketCap: '106B', high52w: 464.96, low52w: 344.00, sector: 'Healthcare' },
  { symbol: 'REGN', name: 'Regeneron Pharma', price: 945.67, change: 7.89, changePercent: 0.84, volume: 567000, marketCap: '104B', high52w: 1037.00, low52w: 700.00, sector: 'Healthcare' },
  { symbol: 'CVS', name: 'CVS Health', price: 78.90, change: 0.56, changePercent: 0.71, volume: 7890000, marketCap: '100B', high52w: 100.23, low52w: 69.26, sector: 'Healthcare' },
  { symbol: 'ELV', name: 'Elevance Health', price: 512.34, change: 3.12, changePercent: 0.61, volume: 890000, marketCap: '119B', high52w: 554.06, low52w: 411.47, sector: 'Healthcare' },
  { symbol: 'CI', name: 'Cigna Group', price: 334.56, change: 2.34, changePercent: 0.70, volume: 1670000, marketCap: '97B', high52w: 366.93, low52w: 262.88, sector: 'Healthcare' },
  { symbol: 'HUM', name: 'Humana Inc.', price: 367.89, change: 2.12, changePercent: 0.58, volume: 890000, marketCap: '45B', high52w: 541.32, low52w: 299.22, sector: 'Healthcare' },
  { symbol: 'SYK', name: 'Stryker Corp.', price: 334.56, change: 2.67, changePercent: 0.80, volume: 1230000, marketCap: '128B', high52w: 368.90, low52w: 269.50, sector: 'Healthcare' },
  { symbol: 'BSX', name: 'Boston Scientific', price: 72.34, change: 0.56, changePercent: 0.78, volume: 5670000, marketCap: '106B', high52w: 78.00, low52w: 50.07, sector: 'Healthcare' },
  { symbol: 'EW', name: 'Edwards Lifesciences', price: 89.45, change: 0.67, changePercent: 0.75, volume: 2890000, marketCap: '54B', high52w: 99.70, low52w: 60.82, sector: 'Healthcare' },
  { symbol: 'ZTS', name: 'Zoetis Inc.', price: 178.90, change: 1.23, changePercent: 0.69, volume: 2340000, marketCap: '82B', high52w: 205.53, low52w: 152.20, sector: 'Healthcare' },
  { symbol: 'MCK', name: 'McKesson Corp.', price: 534.67, change: 3.45, changePercent: 0.65, volume: 890000, marketCap: '72B', high52w: 565.30, low52w: 398.75, sector: 'Healthcare' },
  { symbol: 'HCA', name: 'HCA Healthcare', price: 312.34, change: 2.34, changePercent: 0.75, volume: 1450000, marketCap: '84B', high52w: 338.02, low52w: 231.09, sector: 'Healthcare' },
  { symbol: 'BIIB', name: 'Biogen Inc.', price: 234.56, change: 1.89, changePercent: 0.81, volume: 1230000, marketCap: '34B', high52w: 299.00, low52w: 186.00, sector: 'Healthcare' },
  { symbol: 'MRNA', name: 'Moderna Inc.', price: 112.34, change: 2.34, changePercent: 2.13, volume: 8920000, marketCap: '43B', high52w: 170.47, low52w: 62.55, sector: 'Healthcare' },
  { symbol: 'DXCM', name: 'DexCom Inc.', price: 112.34, change: 1.23, changePercent: 1.11, volume: 2890000, marketCap: '44B', high52w: 141.19, low52w: 61.17, sector: 'Healthcare' },
  { symbol: 'IQV', name: 'IQVIA Holdings', price: 234.56, change: 1.67, changePercent: 0.72, volume: 1120000, marketCap: '43B', high52w: 262.34, low52w: 184.51, sector: 'Healthcare' },
  { symbol: 'IDXX', name: 'IDEXX Laboratories', price: 512.34, change: 4.56, changePercent: 0.90, volume: 567000, marketCap: '42B', high52w: 604.68, low52w: 392.62, sector: 'Healthcare' },
  { symbol: 'A', name: 'Agilent Technologies', price: 134.56, change: 0.89, changePercent: 0.67, volume: 1780000, marketCap: '39B', high52w: 150.00, low52w: 108.21, sector: 'Healthcare' },
  { symbol: 'RMD', name: 'ResMed Inc.', price: 212.34, change: 1.56, changePercent: 0.74, volume: 890000, marketCap: '31B', high52w: 246.29, low52w: 137.64, sector: 'Healthcare' },
  { symbol: 'MTD', name: 'Mettler-Toledo', price: 1234.56, change: 8.90, changePercent: 0.73, volume: 234000, marketCap: '27B', high52w: 1355.70, low52w: 993.05, sector: 'Healthcare' },
  { symbol: 'ALGN', name: 'Align Technology', price: 312.34, change: 3.45, changePercent: 1.12, volume: 890000, marketCap: '24B', high52w: 397.00, low52w: 167.66, sector: 'Healthcare' },
  { symbol: 'WAT', name: 'Waters Corp.', price: 334.56, change: 2.34, changePercent: 0.70, volume: 456000, marketCap: '20B', high52w: 359.00, low52w: 253.18, sector: 'Healthcare' },
  { symbol: 'HOLX', name: 'Hologic Inc.', price: 78.90, change: 0.56, changePercent: 0.71, volume: 1670000, marketCap: '18B', high52w: 86.17, low52w: 64.67, sector: 'Healthcare' },
  { symbol: 'TECH', name: 'Bio-Techne Corp.', price: 78.90, change: 0.67, changePercent: 0.86, volume: 567000, marketCap: '12B', high52w: 95.56, low52w: 61.01, sector: 'Healthcare' },
  { symbol: 'ILMN', name: 'Illumina Inc.', price: 134.56, change: 1.23, changePercent: 0.92, volume: 1450000, marketCap: '21B', high52w: 178.34, low52w: 89.00, sector: 'Healthcare' },
  { symbol: 'PODD', name: 'Insulet Corp.', price: 178.90, change: 2.12, changePercent: 1.20, volume: 890000, marketCap: '13B', high52w: 227.83, low52w: 115.27, sector: 'Healthcare' },

  // Consumer Discretionary (35 stocks)
  { symbol: 'HD', name: 'Home Depot', price: 378.90, change: 2.34, changePercent: 0.62, volume: 4560000, marketCap: '376B', high52w: 405.32, low52w: 274.26, sector: 'Consumer' },
  { symbol: 'MCD', name: "McDonald's Corp.", price: 289.45, change: 1.67, changePercent: 0.58, volume: 3450000, marketCap: '209B', high52w: 302.39, low52w: 245.73, sector: 'Consumer' },
  { symbol: 'NKE', name: 'Nike Inc.', price: 98.67, change: 0.89, changePercent: 0.91, volume: 6780000, marketCap: '149B', high52w: 123.39, low52w: 70.75, sector: 'Consumer' },
  { symbol: 'SBUX', name: 'Starbucks Corp.', price: 92.34, change: 0.56, changePercent: 0.61, volume: 5670000, marketCap: '105B', high52w: 107.66, low52w: 71.55, sector: 'Consumer' },
  { symbol: 'LOW', name: "Lowe's Companies", price: 245.67, change: 1.45, changePercent: 0.59, volume: 3120000, marketCap: '141B', high52w: 269.00, low52w: 181.85, sector: 'Consumer' },
  { symbol: 'TJX', name: 'TJX Companies', price: 98.45, change: 0.67, changePercent: 0.69, volume: 4560000, marketCap: '113B', high52w: 110.21, low52w: 81.27, sector: 'Consumer' },
  { symbol: 'BKNG', name: 'Booking Holdings', price: 3678.90, change: 23.45, changePercent: 0.64, volume: 345000, marketCap: '129B', high52w: 4196.56, low52w: 2848.16, sector: 'Consumer' },
  { symbol: 'CMG', name: 'Chipotle Mexican', price: 2789.45, change: 18.90, changePercent: 0.68, volume: 234000, marketCap: '77B', high52w: 3292.88, low52w: 1834.27, sector: 'Consumer' },
  { symbol: 'ORLY', name: "O'Reilly Automotive", price: 1123.45, change: 6.78, changePercent: 0.61, volume: 456000, marketCap: '66B', high52w: 1221.47, low52w: 880.00, sector: 'Consumer' },
  { symbol: 'AZO', name: 'AutoZone Inc.', price: 2934.56, change: 18.90, changePercent: 0.65, volume: 123000, marketCap: '51B', high52w: 3256.37, low52w: 2381.03, sector: 'Consumer' },
  { symbol: 'ROST', name: 'Ross Stores', price: 145.67, change: 0.89, changePercent: 0.61, volume: 2340000, marketCap: '48B', high52w: 163.98, low52w: 110.20, sector: 'Consumer' },
  { symbol: 'MAR', name: 'Marriott Intl', price: 234.56, change: 1.45, changePercent: 0.62, volume: 1670000, marketCap: '70B', high52w: 268.00, low52w: 179.85, sector: 'Consumer' },
  { symbol: 'HLT', name: 'Hilton Worldwide', price: 212.34, change: 1.23, changePercent: 0.58, volume: 1890000, marketCap: '54B', high52w: 238.00, low52w: 156.50, sector: 'Consumer' },
  { symbol: 'YUM', name: 'Yum! Brands', price: 134.56, change: 0.78, changePercent: 0.58, volume: 2340000, marketCap: '38B', high52w: 143.16, low52w: 120.77, sector: 'Consumer' },
  { symbol: 'DG', name: 'Dollar General', price: 134.56, change: 0.89, changePercent: 0.67, volume: 2890000, marketCap: '30B', high52w: 168.07, low52w: 101.00, sector: 'Consumer' },
  { symbol: 'DLTR', name: 'Dollar Tree', price: 112.34, change: 0.67, changePercent: 0.60, volume: 2340000, marketCap: '24B', high52w: 151.28, low52w: 85.77, sector: 'Consumer' },
  { symbol: 'ULTA', name: 'Ulta Beauty', price: 412.34, change: 2.89, changePercent: 0.71, volume: 567000, marketCap: '20B', high52w: 574.76, low52w: 331.00, sector: 'Consumer' },
  { symbol: 'BBY', name: 'Best Buy', price: 78.90, change: 0.56, changePercent: 0.71, volume: 2890000, marketCap: '17B', high52w: 103.03, low52w: 65.63, sector: 'Consumer' },
  { symbol: 'EBAY', name: 'eBay Inc.', price: 52.34, change: 0.34, changePercent: 0.65, volume: 4560000, marketCap: '27B', high52w: 57.77, low52w: 38.11, sector: 'Consumer' },
  { symbol: 'ETSY', name: 'Etsy Inc.', price: 67.89, change: 0.78, changePercent: 1.16, volume: 3450000, marketCap: '8B', high52w: 96.41, low52w: 52.30, sector: 'Consumer' },
  { symbol: 'W', name: 'Wayfair Inc.', price: 56.78, change: 0.67, changePercent: 1.19, volume: 2340000, marketCap: '7B', high52w: 82.65, low52w: 36.45, sector: 'Consumer' },
  { symbol: 'ABNB', name: 'Airbnb Inc.', price: 156.78, change: 1.89, changePercent: 1.22, volume: 5670000, marketCap: '100B', high52w: 170.10, low52w: 110.38, sector: 'Consumer' },
  { symbol: 'UBER', name: 'Uber Technologies', price: 78.90, change: 0.89, changePercent: 1.14, volume: 18920000, marketCap: '165B', high52w: 87.00, low52w: 40.09, sector: 'Consumer' },
  { symbol: 'LYFT', name: 'Lyft Inc.', price: 15.67, change: 0.23, changePercent: 1.49, volume: 12340000, marketCap: '6B', high52w: 20.82, low52w: 8.86, sector: 'Consumer' },
  { symbol: 'DASH', name: 'DoorDash Inc.', price: 134.56, change: 1.67, changePercent: 1.26, volume: 4560000, marketCap: '56B', high52w: 176.99, low52w: 60.67, sector: 'Consumer' },
  { symbol: 'RIVN', name: 'Rivian Automotive', price: 18.90, change: 0.45, changePercent: 2.44, volume: 23450000, marketCap: '19B', high52w: 28.06, low52w: 8.26, sector: 'Consumer' },
  { symbol: 'LCID', name: 'Lucid Group', price: 3.45, change: 0.08, changePercent: 2.37, volume: 34560000, marketCap: '8B', high52w: 8.37, low52w: 2.29, sector: 'Consumer' },
  { symbol: 'F', name: 'Ford Motor', price: 12.34, change: 0.12, changePercent: 0.98, volume: 45670000, marketCap: '49B', high52w: 14.85, low52w: 9.63, sector: 'Consumer' },
  { symbol: 'GM', name: 'General Motors', price: 42.34, change: 0.34, changePercent: 0.81, volume: 12340000, marketCap: '48B', high52w: 49.96, low52w: 26.30, sector: 'Consumer' },
  { symbol: 'EXPE', name: 'Expedia Group', price: 134.56, change: 1.23, changePercent: 0.92, volume: 1670000, marketCap: '19B', high52w: 166.49, low52w: 87.72, sector: 'Consumer' },
  { symbol: 'LVS', name: 'Las Vegas Sands', price: 52.34, change: 0.45, changePercent: 0.87, volume: 4560000, marketCap: '40B', high52w: 65.36, low52w: 43.27, sector: 'Consumer' },
  { symbol: 'WYNN', name: 'Wynn Resorts', price: 98.67, change: 0.89, changePercent: 0.91, volume: 2340000, marketCap: '11B', high52w: 119.79, low52w: 76.50, sector: 'Consumer' },
  { symbol: 'MGM', name: 'MGM Resorts', price: 42.34, change: 0.34, changePercent: 0.81, volume: 3450000, marketCap: '13B', high52w: 51.02, low52w: 32.63, sector: 'Consumer' },
  { symbol: 'RCL', name: 'Royal Caribbean', price: 156.78, change: 1.45, changePercent: 0.93, volume: 2890000, marketCap: '42B', high52w: 202.00, low52w: 88.55, sector: 'Consumer' },
  { symbol: 'CCL', name: 'Carnival Corp.', price: 18.90, change: 0.23, changePercent: 1.23, volume: 18920000, marketCap: '24B', high52w: 27.28, low52w: 10.83, sector: 'Consumer' },

  // Consumer Staples (25 stocks)
  { symbol: 'WMT', name: 'Walmart Inc.', price: 165.23, change: -0.45, changePercent: -0.27, volume: 7890000, marketCap: '445B', high52w: 169.94, low52w: 143.15, sector: 'Consumer Staples' },
  { symbol: 'PG', name: 'Procter & Gamble', price: 167.89, change: 0.78, changePercent: 0.47, volume: 5670000, marketCap: '395B', high52w: 173.00, low52w: 141.45, sector: 'Consumer Staples' },
  { symbol: 'KO', name: 'Coca-Cola Co.', price: 62.34, change: 0.23, changePercent: 0.37, volume: 12340000, marketCap: '269B', high52w: 64.99, low52w: 52.28, sector: 'Consumer Staples' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', price: 178.90, change: 0.67, changePercent: 0.38, volume: 4560000, marketCap: '246B', high52w: 196.88, low52w: 155.83, sector: 'Consumer Staples' },
  { symbol: 'COST', name: 'Costco Wholesale', price: 734.56, change: 4.56, changePercent: 0.62, volume: 2340000, marketCap: '326B', high52w: 787.08, low52w: 474.33, sector: 'Consumer Staples' },
  { symbol: 'MDLZ', name: 'Mondelez Intl', price: 72.34, change: 0.34, changePercent: 0.47, volume: 4560000, marketCap: '98B', high52w: 77.67, low52w: 62.50, sector: 'Consumer Staples' },
  { symbol: 'CL', name: 'Colgate-Palmolive', price: 92.34, change: 0.45, changePercent: 0.49, volume: 3450000, marketCap: '76B', high52w: 100.63, low52w: 70.78, sector: 'Consumer Staples' },
  { symbol: 'EL', name: 'Estee Lauder', price: 134.56, change: 0.89, changePercent: 0.67, volume: 2340000, marketCap: '48B', high52w: 163.92, low52w: 84.70, sector: 'Consumer Staples' },
  { symbol: 'KMB', name: 'Kimberly-Clark', price: 134.56, change: 0.56, changePercent: 0.42, volume: 1670000, marketCap: '45B', high52w: 145.53, low52w: 117.12, sector: 'Consumer Staples' },
  { symbol: 'GIS', name: 'General Mills', price: 67.89, change: 0.23, changePercent: 0.34, volume: 3450000, marketCap: '38B', high52w: 72.72, low52w: 60.31, sector: 'Consumer Staples' },
  { symbol: 'K', name: 'Kellanova', price: 56.78, change: 0.23, changePercent: 0.41, volume: 2890000, marketCap: '19B', high52w: 82.50, low52w: 51.25, sector: 'Consumer Staples' },
  { symbol: 'HSY', name: 'Hershey Co.', price: 189.45, change: 0.78, changePercent: 0.41, volume: 890000, marketCap: '38B', high52w: 215.00, low52w: 174.03, sector: 'Consumer Staples' },
  { symbol: 'MKC', name: 'McCormick & Co.', price: 78.90, change: 0.34, changePercent: 0.43, volume: 1230000, marketCap: '21B', high52w: 84.16, low52w: 62.61, sector: 'Consumer Staples' },
  { symbol: 'SJM', name: 'JM Smucker', price: 123.45, change: 0.56, changePercent: 0.46, volume: 890000, marketCap: '13B', high52w: 135.55, low52w: 109.00, sector: 'Consumer Staples' },
  { symbol: 'CAG', name: 'Conagra Brands', price: 28.90, change: 0.12, changePercent: 0.42, volume: 4560000, marketCap: '14B', high52w: 32.24, low52w: 26.00, sector: 'Consumer Staples' },
  { symbol: 'CPB', name: 'Campbell Soup', price: 45.67, change: 0.23, changePercent: 0.51, volume: 2340000, marketCap: '14B', high52w: 52.93, low52w: 38.31, sector: 'Consumer Staples' },
  { symbol: 'TAP', name: 'Molson Coors', price: 56.78, change: 0.34, changePercent: 0.60, volume: 1670000, marketCap: '12B', high52w: 67.32, low52w: 48.71, sector: 'Consumer Staples' },
  { symbol: 'STZ', name: 'Constellation Brands', price: 245.67, change: 1.23, changePercent: 0.50, volume: 1230000, marketCap: '45B', high52w: 275.87, low52w: 219.18, sector: 'Consumer Staples' },
  { symbol: 'BF.B', name: 'Brown-Forman', price: 45.67, change: 0.23, changePercent: 0.51, volume: 1450000, marketCap: '22B', high52w: 66.42, low52w: 42.91, sector: 'Consumer Staples' },
  { symbol: 'PM', name: 'Philip Morris', price: 98.67, change: 0.45, changePercent: 0.46, volume: 5670000, marketCap: '153B', high52w: 104.00, low52w: 87.38, sector: 'Consumer Staples' },
  { symbol: 'MO', name: 'Altria Group', price: 45.67, change: 0.23, changePercent: 0.51, volume: 8920000, marketCap: '78B', high52w: 49.86, low52w: 39.40, sector: 'Consumer Staples' },
  { symbol: 'TSN', name: 'Tyson Foods', price: 56.78, change: 0.34, changePercent: 0.60, volume: 3450000, marketCap: '20B', high52w: 66.50, low52w: 45.47, sector: 'Consumer Staples' },
  { symbol: 'HRL', name: 'Hormel Foods', price: 32.34, change: 0.12, changePercent: 0.37, volume: 2890000, marketCap: '18B', high52w: 40.65, low52w: 29.65, sector: 'Consumer Staples' },
  { symbol: 'SYY', name: 'Sysco Corp.', price: 78.90, change: 0.45, changePercent: 0.57, volume: 2340000, marketCap: '39B', high52w: 83.97, low52w: 64.34, sector: 'Consumer Staples' },
  { symbol: 'KR', name: 'Kroger Co.', price: 52.34, change: 0.23, changePercent: 0.44, volume: 4560000, marketCap: '38B', high52w: 58.65, low52w: 43.89, sector: 'Consumer Staples' },

  // Energy (25 stocks)
  { symbol: 'XOM', name: 'Exxon Mobil', price: 112.34, change: 0.67, changePercent: 0.60, volume: 14560000, marketCap: '458B', high52w: 123.75, low52w: 95.77, sector: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corp.', price: 156.78, change: 0.89, changePercent: 0.57, volume: 6780000, marketCap: '289B', high52w: 171.70, low52w: 139.62, sector: 'Energy' },
  { symbol: 'COP', name: 'ConocoPhillips', price: 112.34, change: 0.67, changePercent: 0.60, volume: 5670000, marketCap: '131B', high52w: 127.00, low52w: 102.46, sector: 'Energy' },
  { symbol: 'SLB', name: 'Schlumberger', price: 52.34, change: 0.34, changePercent: 0.65, volume: 8920000, marketCap: '74B', high52w: 62.80, low52w: 43.07, sector: 'Energy' },
  { symbol: 'EOG', name: 'EOG Resources', price: 123.45, change: 0.78, changePercent: 0.64, volume: 3450000, marketCap: '72B', high52w: 139.57, low52w: 108.94, sector: 'Energy' },
  { symbol: 'MPC', name: 'Marathon Petroleum', price: 178.90, change: 1.23, changePercent: 0.69, volume: 2890000, marketCap: '62B', high52w: 193.00, low52w: 134.81, sector: 'Energy' },
  { symbol: 'PSX', name: 'Phillips 66', price: 145.67, change: 0.89, changePercent: 0.61, volume: 2340000, marketCap: '59B', high52w: 167.01, low52w: 113.20, sector: 'Energy' },
  { symbol: 'VLO', name: 'Valero Energy', price: 156.78, change: 1.12, changePercent: 0.72, volume: 2890000, marketCap: '51B', high52w: 175.26, low52w: 117.94, sector: 'Energy' },
  { symbol: 'OXY', name: 'Occidental Petroleum', price: 62.34, change: 0.45, changePercent: 0.73, volume: 8920000, marketCap: '55B', high52w: 71.18, low52w: 55.12, sector: 'Energy' },
  { symbol: 'PXD', name: 'Pioneer Natural', price: 234.56, change: 1.45, changePercent: 0.62, volume: 1670000, marketCap: '55B', high52w: 267.51, low52w: 197.69, sector: 'Energy' },
  { symbol: 'DVN', name: 'Devon Energy', price: 45.67, change: 0.34, changePercent: 0.75, volume: 6780000, marketCap: '29B', high52w: 55.15, low52w: 40.27, sector: 'Energy' },
  { symbol: 'HAL', name: 'Halliburton', price: 34.56, change: 0.23, changePercent: 0.67, volume: 8920000, marketCap: '31B', high52w: 43.43, low52w: 28.14, sector: 'Energy' },
  { symbol: 'BKR', name: 'Baker Hughes', price: 34.56, change: 0.23, changePercent: 0.67, volume: 5670000, marketCap: '35B', high52w: 39.90, low52w: 28.85, sector: 'Energy' },
  { symbol: 'WMB', name: 'Williams Companies', price: 42.34, change: 0.23, changePercent: 0.55, volume: 6780000, marketCap: '51B', high52w: 48.27, low52w: 32.38, sector: 'Energy' },
  { symbol: 'KMI', name: 'Kinder Morgan', price: 18.90, change: 0.12, changePercent: 0.64, volume: 12340000, marketCap: '42B', high52w: 21.63, low52w: 16.00, sector: 'Energy' },
  { symbol: 'OKE', name: 'ONEOK Inc.', price: 78.90, change: 0.45, changePercent: 0.57, volume: 2340000, marketCap: '46B', high52w: 86.33, low52w: 61.22, sector: 'Energy' },
  { symbol: 'TRGP', name: 'Targa Resources', price: 112.34, change: 0.78, changePercent: 0.70, volume: 1450000, marketCap: '26B', high52w: 123.98, low52w: 81.97, sector: 'Energy' },
  { symbol: 'LNG', name: 'Cheniere Energy', price: 178.90, change: 1.23, changePercent: 0.69, volume: 1230000, marketCap: '43B', high52w: 186.98, low52w: 139.59, sector: 'Energy' },
  { symbol: 'FANG', name: 'Diamondback Energy', price: 178.90, change: 1.23, changePercent: 0.69, volume: 1670000, marketCap: '32B', high52w: 205.97, low52w: 145.30, sector: 'Energy' },
  { symbol: 'HES', name: 'Hess Corp.', price: 145.67, change: 0.89, changePercent: 0.61, volume: 2340000, marketCap: '45B', high52w: 161.35, low52w: 130.50, sector: 'Energy' },
  { symbol: 'APA', name: 'APA Corp.', price: 28.90, change: 0.23, changePercent: 0.80, volume: 4560000, marketCap: '10B', high52w: 45.66, low52w: 23.32, sector: 'Energy' },
  { symbol: 'MRO', name: 'Marathon Oil', price: 26.78, change: 0.18, changePercent: 0.68, volume: 8920000, marketCap: '15B', high52w: 31.50, low52w: 22.10, sector: 'Energy' },
  { symbol: 'EQT', name: 'EQT Corp.', price: 38.90, change: 0.28, changePercent: 0.73, volume: 4560000, marketCap: '15B', high52w: 48.67, low52w: 31.79, sector: 'Energy' },
  { symbol: 'AR', name: 'Antero Resources', price: 26.78, change: 0.23, changePercent: 0.87, volume: 3450000, marketCap: '8B', high52w: 33.37, low52w: 22.50, sector: 'Energy' },
  { symbol: 'RRC', name: 'Range Resources', price: 32.34, change: 0.23, changePercent: 0.72, volume: 2890000, marketCap: '8B', high52w: 38.20, low52w: 27.01, sector: 'Energy' },

  // Industrials (30 stocks)
  { symbol: 'CAT', name: 'Caterpillar Inc.', price: 334.56, change: 2.34, changePercent: 0.70, volume: 2890000, marketCap: '165B', high52w: 367.10, low52w: 219.47, sector: 'Industrials' },
  { symbol: 'HON', name: 'Honeywell Intl', price: 198.67, change: 1.23, changePercent: 0.62, volume: 3450000, marketCap: '130B', high52w: 220.99, low52w: 177.71, sector: 'Industrials' },
  { symbol: 'UNP', name: 'Union Pacific', price: 245.67, change: 1.45, changePercent: 0.59, volume: 2340000, marketCap: '149B', high52w: 260.11, low52w: 194.33, sector: 'Industrials' },
  { symbol: 'GE', name: 'GE Aerospace', price: 167.89, change: 1.23, changePercent: 0.74, volume: 5670000, marketCap: '183B', high52w: 184.04, low52w: 100.24, sector: 'Industrials' },
  { symbol: 'RTX', name: 'RTX Corp.', price: 98.67, change: 0.56, changePercent: 0.57, volume: 4560000, marketCap: '137B', high52w: 106.02, low52w: 68.56, sector: 'Industrials' },
  { symbol: 'BA', name: 'Boeing Co.', price: 198.67, change: 2.34, changePercent: 1.19, volume: 6780000, marketCap: '123B', high52w: 267.54, low52w: 137.03, sector: 'Industrials' },
  { symbol: 'LMT', name: 'Lockheed Martin', price: 456.78, change: 2.34, changePercent: 0.51, volume: 1230000, marketCap: '110B', high52w: 512.61, low52w: 409.65, sector: 'Industrials' },
  { symbol: 'DE', name: 'Deere & Co.', price: 378.90, change: 2.67, changePercent: 0.71, volume: 1670000, marketCap: '108B', high52w: 448.40, low52w: 344.05, sector: 'Industrials' },
  { symbol: 'UPS', name: 'United Parcel Service', price: 145.67, change: 0.89, changePercent: 0.61, volume: 3450000, marketCap: '124B', high52w: 175.77, low52w: 123.12, sector: 'Industrials' },
  { symbol: 'ADP', name: 'Automatic Data', price: 256.78, change: 1.45, changePercent: 0.57, volume: 1670000, marketCap: '105B', high52w: 271.00, low52w: 214.00, sector: 'Industrials' },
  { symbol: 'MMM', name: '3M Company', price: 112.34, change: 0.78, changePercent: 0.70, volume: 3450000, marketCap: '61B', high52w: 129.00, low52w: 80.53, sector: 'Industrials' },
  { symbol: 'ETN', name: 'Eaton Corp.', price: 298.67, change: 2.12, changePercent: 0.71, volume: 1450000, marketCap: '119B', high52w: 328.95, low52w: 178.01, sector: 'Industrials' },
  { symbol: 'ITW', name: 'Illinois Tool Works', price: 256.78, change: 1.45, changePercent: 0.57, volume: 890000, marketCap: '77B', high52w: 272.78, low52w: 216.38, sector: 'Industrials' },
  { symbol: 'EMR', name: 'Emerson Electric', price: 112.34, change: 0.67, changePercent: 0.60, volume: 2340000, marketCap: '63B', high52w: 120.00, low52w: 83.48, sector: 'Industrials' },
  { symbol: 'PH', name: 'Parker-Hannifin', price: 512.34, change: 3.45, changePercent: 0.68, volume: 567000, marketCap: '66B', high52w: 591.50, low52w: 367.77, sector: 'Industrials' },
  { symbol: 'ROK', name: 'Rockwell Automation', price: 278.90, change: 1.89, changePercent: 0.68, volume: 567000, marketCap: '32B', high52w: 324.43, low52w: 237.32, sector: 'Industrials' },
  { symbol: 'CTAS', name: 'Cintas Corp.', price: 678.90, change: 4.56, changePercent: 0.68, volume: 456000, marketCap: '68B', high52w: 725.00, low52w: 475.00, sector: 'Industrials' },
  { symbol: 'GD', name: 'General Dynamics', price: 289.45, change: 1.67, changePercent: 0.58, volume: 890000, marketCap: '79B', high52w: 303.50, low52w: 232.38, sector: 'Industrials' },
  { symbol: 'NOC', name: 'Northrop Grumman', price: 478.90, change: 2.67, changePercent: 0.56, volume: 567000, marketCap: '70B', high52w: 500.48, low52w: 416.89, sector: 'Industrials' },
  { symbol: 'FDX', name: 'FedEx Corp.', price: 267.89, change: 1.89, changePercent: 0.71, volume: 1670000, marketCap: '67B', high52w: 319.90, low52w: 214.46, sector: 'Industrials' },
  { symbol: 'CSX', name: 'CSX Corp.', price: 34.56, change: 0.23, changePercent: 0.67, volume: 6780000, marketCap: '69B', high52w: 40.25, low52w: 28.29, sector: 'Industrials' },
  { symbol: 'NSC', name: 'Norfolk Southern', price: 245.67, change: 1.45, changePercent: 0.59, volume: 1230000, marketCap: '56B', high52w: 271.00, low52w: 177.08, sector: 'Industrials' },
  { symbol: 'WM', name: 'Waste Management', price: 212.34, change: 1.12, changePercent: 0.53, volume: 1670000, marketCap: '85B', high52w: 225.00, low52w: 159.88, sector: 'Industrials' },
  { symbol: 'RSG', name: 'Republic Services', price: 189.45, change: 0.89, changePercent: 0.47, volume: 890000, marketCap: '60B', high52w: 204.00, low52w: 140.80, sector: 'Industrials' },
  { symbol: 'PCAR', name: 'PACCAR Inc.', price: 112.34, change: 0.67, changePercent: 0.60, volume: 2340000, marketCap: '59B', high52w: 128.14, low52w: 85.50, sector: 'Industrials' },
  { symbol: 'CARR', name: 'Carrier Global', price: 62.34, change: 0.45, changePercent: 0.73, volume: 3450000, marketCap: '55B', high52w: 66.59, low52w: 44.96, sector: 'Industrials' },
  { symbol: 'JCI', name: 'Johnson Controls', price: 67.89, change: 0.45, changePercent: 0.67, volume: 2890000, marketCap: '46B', high52w: 77.81, low52w: 48.40, sector: 'Industrials' },
  { symbol: 'TT', name: 'Trane Technologies', price: 312.34, change: 2.12, changePercent: 0.68, volume: 890000, marketCap: '71B', high52w: 340.00, low52w: 191.97, sector: 'Industrials' },
  { symbol: 'SWK', name: 'Stanley Black & Decker', price: 89.45, change: 0.67, changePercent: 0.75, volume: 1450000, marketCap: '14B', high52w: 109.44, low52w: 77.52, sector: 'Industrials' },
  { symbol: 'DAL', name: 'Delta Air Lines', price: 52.34, change: 0.45, changePercent: 0.87, volume: 8920000, marketCap: '34B', high52w: 56.21, low52w: 31.45, sector: 'Industrials' },

  // Utilities (15 stocks)
  { symbol: 'NEE', name: 'NextEra Energy', price: 78.90, change: 0.34, changePercent: 0.43, volume: 8920000, marketCap: '162B', high52w: 86.10, low52w: 53.95, sector: 'Utilities' },
  { symbol: 'DUK', name: 'Duke Energy', price: 98.67, change: 0.34, changePercent: 0.35, volume: 3450000, marketCap: '76B', high52w: 106.80, low52w: 85.74, sector: 'Utilities' },
  { symbol: 'SO', name: 'Southern Co.', price: 78.90, change: 0.28, changePercent: 0.36, volume: 4560000, marketCap: '86B', high52w: 83.41, low52w: 65.18, sector: 'Utilities' },
  { symbol: 'D', name: 'Dominion Energy', price: 52.34, change: 0.18, changePercent: 0.35, volume: 4560000, marketCap: '44B', high52w: 55.96, low52w: 40.84, sector: 'Utilities' },
  { symbol: 'AEP', name: 'American Electric', price: 89.45, change: 0.34, changePercent: 0.38, volume: 2890000, marketCap: '47B', high52w: 94.43, low52w: 74.01, sector: 'Utilities' },
  { symbol: 'EXC', name: 'Exelon Corp.', price: 38.90, change: 0.15, changePercent: 0.39, volume: 6780000, marketCap: '39B', high52w: 43.27, low52w: 33.15, sector: 'Utilities' },
  { symbol: 'SRE', name: 'Sempra', price: 78.90, change: 0.28, changePercent: 0.36, volume: 2340000, marketCap: '50B', high52w: 83.98, low52w: 65.98, sector: 'Utilities' },
  { symbol: 'XEL', name: 'Xcel Energy', price: 62.34, change: 0.23, changePercent: 0.37, volume: 2890000, marketCap: '35B', high52w: 65.40, low52w: 52.43, sector: 'Utilities' },
  { symbol: 'WEC', name: 'WEC Energy', price: 89.45, change: 0.34, changePercent: 0.38, volume: 1450000, marketCap: '28B', high52w: 95.73, low52w: 75.71, sector: 'Utilities' },
  { symbol: 'ED', name: 'Consolidated Edison', price: 98.67, change: 0.34, changePercent: 0.35, volume: 1670000, marketCap: '34B', high52w: 102.49, low52w: 84.10, sector: 'Utilities' },
  { symbol: 'ES', name: 'Eversource Energy', price: 62.34, change: 0.23, changePercent: 0.37, volume: 1890000, marketCap: '22B', high52w: 74.22, low52w: 52.22, sector: 'Utilities' },
  { symbol: 'EIX', name: 'Edison International', price: 72.34, change: 0.28, changePercent: 0.39, volume: 2340000, marketCap: '28B', high52w: 83.87, low52w: 60.73, sector: 'Utilities' },
  { symbol: 'DTE', name: 'DTE Energy', price: 112.34, change: 0.45, changePercent: 0.40, volume: 1230000, marketCap: '23B', high52w: 122.10, low52w: 100.58, sector: 'Utilities' },
  { symbol: 'PEG', name: 'Public Service', price: 78.90, change: 0.28, changePercent: 0.36, volume: 2340000, marketCap: '39B', high52w: 86.74, low52w: 62.70, sector: 'Utilities' },
  { symbol: 'AWK', name: 'American Water', price: 134.56, change: 0.56, changePercent: 0.42, volume: 890000, marketCap: '26B', high52w: 151.00, low52w: 117.76, sector: 'Utilities' },

  // Real Estate (15 stocks)
  { symbol: 'AMT', name: 'American Tower', price: 198.67, change: 0.89, changePercent: 0.45, volume: 1890000, marketCap: '92B', high52w: 236.20, low52w: 154.58, sector: 'Real Estate' },
  { symbol: 'PLD', name: 'Prologis Inc.', price: 128.45, change: 0.67, changePercent: 0.52, volume: 3450000, marketCap: '119B', high52w: 141.84, low52w: 98.24, sector: 'Real Estate' },
  { symbol: 'CCI', name: 'Crown Castle', price: 112.34, change: 0.56, changePercent: 0.50, volume: 2340000, marketCap: '46B', high52w: 133.00, low52w: 84.71, sector: 'Real Estate' },
  { symbol: 'EQIX', name: 'Equinix Inc.', price: 856.78, change: 4.56, changePercent: 0.53, volume: 456000, marketCap: '81B', high52w: 934.76, low52w: 676.66, sector: 'Real Estate' },
  { symbol: 'PSA', name: 'Public Storage', price: 289.45, change: 1.23, changePercent: 0.43, volume: 890000, marketCap: '51B', high52w: 322.68, low52w: 240.37, sector: 'Real Estate' },
  { symbol: 'WELL', name: 'Welltower Inc.', price: 112.34, change: 0.56, changePercent: 0.50, volume: 2340000, marketCap: '64B', high52w: 123.91, low52w: 82.00, sector: 'Real Estate' },
  { symbol: 'SPG', name: 'Simon Property', price: 156.78, change: 0.89, changePercent: 0.57, volume: 1670000, marketCap: '51B', high52w: 168.00, low52w: 108.00, sector: 'Real Estate' },
  { symbol: 'DLR', name: 'Digital Realty', price: 145.67, change: 0.78, changePercent: 0.54, volume: 1450000, marketCap: '44B', high52w: 160.00, low52w: 107.35, sector: 'Real Estate' },
  { symbol: 'O', name: 'Realty Income', price: 56.78, change: 0.23, changePercent: 0.41, volume: 4560000, marketCap: '50B', high52w: 65.43, low52w: 48.15, sector: 'Real Estate' },
  { symbol: 'VICI', name: 'VICI Properties', price: 32.34, change: 0.15, changePercent: 0.47, volume: 6780000, marketCap: '34B', high52w: 34.46, low52w: 27.14, sector: 'Real Estate' },
  { symbol: 'AVB', name: 'AvalonBay', price: 212.34, change: 0.89, changePercent: 0.42, volume: 567000, marketCap: '30B', high52w: 227.67, low52w: 166.58, sector: 'Real Estate' },
  { symbol: 'EQR', name: 'Equity Residential', price: 67.89, change: 0.34, changePercent: 0.50, volume: 1890000, marketCap: '26B', high52w: 73.93, low52w: 55.41, sector: 'Real Estate' },
  { symbol: 'SBAC', name: 'SBA Communications', price: 234.56, change: 1.12, changePercent: 0.48, volume: 567000, marketCap: '25B', high52w: 269.67, low52w: 179.17, sector: 'Real Estate' },
  { symbol: 'IRM', name: 'Iron Mountain', price: 89.45, change: 0.56, changePercent: 0.63, volume: 1670000, marketCap: '26B', high52w: 108.02, low52w: 58.32, sector: 'Real Estate' },
  { symbol: 'VTR', name: 'Ventas Inc.', price: 52.34, change: 0.28, changePercent: 0.54, volume: 2340000, marketCap: '22B', high52w: 57.50, low52w: 39.44, sector: 'Real Estate' },

  // Materials (15 stocks)
  { symbol: 'LIN', name: 'Linde plc', price: 456.78, change: 2.34, changePercent: 0.51, volume: 1670000, marketCap: '221B', high52w: 480.00, low52w: 368.49, sector: 'Materials' },
  { symbol: 'APD', name: 'Air Products', price: 289.45, change: 1.45, changePercent: 0.50, volume: 890000, marketCap: '64B', high52w: 321.50, low52w: 218.27, sector: 'Materials' },
  { symbol: 'SHW', name: 'Sherwin-Williams', price: 334.56, change: 1.89, changePercent: 0.57, volume: 890000, marketCap: '85B', high52w: 364.93, low52w: 249.06, sector: 'Materials' },
  { symbol: 'ECL', name: 'Ecolab Inc.', price: 234.56, change: 1.23, changePercent: 0.53, volume: 890000, marketCap: '67B', high52w: 252.77, low52w: 168.14, sector: 'Materials' },
  { symbol: 'FCX', name: 'Freeport-McMoRan', price: 45.67, change: 0.45, changePercent: 1.00, volume: 12340000, marketCap: '65B', high52w: 53.09, low52w: 32.04, sector: 'Materials' },
  { symbol: 'NEM', name: 'Newmont Corp.', price: 42.34, change: 0.34, changePercent: 0.81, volume: 6780000, marketCap: '48B', high52w: 48.88, low52w: 29.42, sector: 'Materials' },
  { symbol: 'NUE', name: 'Nucor Corp.', price: 178.90, change: 1.23, changePercent: 0.69, volume: 1670000, marketCap: '42B', high52w: 201.03, low52w: 140.81, sector: 'Materials' },
  { symbol: 'DOW', name: 'Dow Inc.', price: 56.78, change: 0.34, changePercent: 0.60, volume: 4560000, marketCap: '40B', high52w: 60.35, low52w: 47.11, sector: 'Materials' },
  { symbol: 'DD', name: 'DuPont de Nemours', price: 78.90, change: 0.45, changePercent: 0.57, volume: 2340000, marketCap: '33B', high52w: 86.45, low52w: 64.35, sector: 'Materials' },
  { symbol: 'PPG', name: 'PPG Industries', price: 134.56, change: 0.78, changePercent: 0.58, volume: 1230000, marketCap: '31B', high52w: 160.75, low52w: 115.52, sector: 'Materials' },
  { symbol: 'VMC', name: 'Vulcan Materials', price: 267.89, change: 1.56, changePercent: 0.59, volume: 567000, marketCap: '35B', high52w: 283.73, low52w: 196.50, sector: 'Materials' },
  { symbol: 'MLM', name: 'Martin Marietta', price: 578.90, change: 3.45, changePercent: 0.60, volume: 345000, marketCap: '36B', high52w: 627.00, low52w: 425.00, sector: 'Materials' },
  { symbol: 'CTVA', name: 'Corteva Inc.', price: 56.78, change: 0.34, changePercent: 0.60, volume: 3450000, marketCap: '39B', high52w: 62.34, low52w: 47.36, sector: 'Materials' },
  { symbol: 'ALB', name: 'Albemarle Corp.', price: 112.34, change: 1.23, changePercent: 1.11, volume: 1670000, marketCap: '13B', high52w: 187.94, low52w: 71.97, sector: 'Materials' },
  { symbol: 'BALL', name: 'Ball Corp.', price: 62.34, change: 0.34, changePercent: 0.55, volume: 1890000, marketCap: '19B', high52w: 72.64, low52w: 46.89, sector: 'Materials' },

  // Communication Services (15 stocks)
  { symbol: 'GOOG', name: 'Alphabet Inc. C', price: 143.45, change: -0.87, changePercent: -0.60, volume: 18920000, marketCap: '1.8T', high52w: 155.00, low52w: 117.00, sector: 'Communication' },
  { symbol: 'DIS', name: 'Walt Disney', price: 112.34, change: 0.89, changePercent: 0.80, volume: 8920000, marketCap: '205B', high52w: 123.74, low52w: 78.73, sector: 'Communication' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 612.34, change: 5.67, changePercent: 0.93, volume: 3450000, marketCap: '269B', high52w: 700.99, low52w: 344.73, sector: 'Communication' },
  { symbol: 'CMCSA', name: 'Comcast Corp.', price: 42.34, change: 0.23, changePercent: 0.55, volume: 18920000, marketCap: '168B', high52w: 47.67, low52w: 36.43, sector: 'Communication' },
  { symbol: 'VZ', name: 'Verizon', price: 42.34, change: 0.18, changePercent: 0.43, volume: 18920000, marketCap: '178B', high52w: 45.29, low52w: 30.14, sector: 'Communication' },
  { symbol: 'T', name: 'AT&T Inc.', price: 18.90, change: 0.08, changePercent: 0.43, volume: 45670000, marketCap: '135B', high52w: 22.84, low52w: 14.46, sector: 'Communication' },
  { symbol: 'TMUS', name: 'T-Mobile US', price: 178.90, change: 1.12, changePercent: 0.63, volume: 3450000, marketCap: '210B', high52w: 195.55, low52w: 136.00, sector: 'Communication' },
  { symbol: 'CHTR', name: 'Charter Comm.', price: 289.45, change: 1.89, changePercent: 0.66, volume: 890000, marketCap: '43B', high52w: 470.61, low52w: 231.00, sector: 'Communication' },
  { symbol: 'WBD', name: 'Warner Bros. Discovery', price: 8.90, change: 0.12, changePercent: 1.37, volume: 23450000, marketCap: '22B', high52w: 15.36, low52w: 6.68, sector: 'Communication' },
  { symbol: 'PARA', name: 'Paramount Global', price: 12.34, change: 0.15, changePercent: 1.23, volume: 12340000, marketCap: '8B', high52w: 17.22, low52w: 9.93, sector: 'Communication' },
  { symbol: 'FOX', name: 'Fox Corp.', price: 32.34, change: 0.23, changePercent: 0.72, volume: 2890000, marketCap: '15B', high52w: 36.89, low52w: 27.18, sector: 'Communication' },
  { symbol: 'LYV', name: 'Live Nation', price: 112.34, change: 0.89, changePercent: 0.80, volume: 1450000, marketCap: '26B', high52w: 122.74, low52w: 76.57, sector: 'Communication' },
  { symbol: 'EA', name: 'Electronic Arts', price: 134.56, change: 0.78, changePercent: 0.58, volume: 2340000, marketCap: '36B', high52w: 148.36, low52w: 115.66, sector: 'Communication' },
  { symbol: 'TTWO', name: 'Take-Two Interactive', price: 156.78, change: 1.12, changePercent: 0.72, volume: 1670000, marketCap: '27B', high52w: 171.99, low52w: 135.40, sector: 'Communication' },
  { symbol: 'RBLX', name: 'Roblox Corp.', price: 42.34, change: 0.67, changePercent: 1.61, volume: 8920000, marketCap: '26B', high52w: 50.00, low52w: 25.04, sector: 'Communication' },
];

// Popular stocks for quick access (subset)
export const popularStocks = allStocks.slice(0, 10);

// Get all unique sectors
export function getSectors(): string[] {
  return [...new Set(allStocks.map(s => s.sector).filter(Boolean))] as string[];
}

// Filter stocks by sector
export function getStocksBySector(sector: string): Stock[] {
  return allStocks.filter(s => s.sector === sector);
}

// Search stocks by symbol or name
export function searchStocks(query: string): Stock[] {
  const q = query.toLowerCase();
  return allStocks.filter(s => 
    s.symbol.toLowerCase().includes(q) || 
    s.name.toLowerCase().includes(q)
  );
}

// Generate realistic candlestick data with intraday support
export function generateCandleData(basePrice: number, days: number = 90, intraday: boolean = false): CandleData[] {
  const data: CandleData[] = [];
  let currentPrice = basePrice * 0.85;

  if (intraday) {
    // Generate minute-by-minute data for today
    const now = new Date();
    const marketOpen = new Date(now);
    marketOpen.setHours(9, 30, 0, 0);
    
    const minutesOpen = Math.min(
      Math.floor((now.getTime() - marketOpen.getTime()) / (1000 * 60)),
      390 // Max 6.5 hours of trading
    );

    for (let i = 0; i <= minutesOpen; i++) {
      const time = new Date(marketOpen);
      time.setMinutes(time.getMinutes() + i);

      const volatility = 0.001 + Math.random() * 0.002;
      const trend = Math.random() > 0.48 ? 1 : -1;
      const change = currentPrice * volatility * trend;

      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.abs(change) * Math.random() * 0.3;
      const low = Math.min(open, close) - Math.abs(change) * Math.random() * 0.3;

      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 500000) + 100000,
      });

      currentPrice = close;
    }
  } else {
    // Generate daily data
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const volatility = 0.02 + Math.random() * 0.03;
      const trend = Math.random() > 0.45 ? 1 : -1;
      const change = currentPrice * volatility * trend;

      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + Math.abs(change) * Math.random() * 0.5;
      const low = Math.min(open, close) - Math.abs(change) * Math.random() * 0.5;

      data.push({
        time: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 10000000,
      });

      currentPrice = close;
    }
  }

  return data;
}

// Simulate real-time price updates
export function getUpdatedPrice(currentPrice: number): { price: number; change: number } {
  const volatility = 0.001;
  const randomChange = (Math.random() - 0.5) * 2 * volatility * currentPrice;
  const newPrice = Number((currentPrice + randomChange).toFixed(2));
  return { price: newPrice, change: randomChange };
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'auto-closed';
  reason?: string;
  leverage?: number;
  broker?: string;
}

// Broker configurations
export interface Broker {
  id: string;
  name: string;
  maxLeverage: number;
  commissionRate: number;
  description: string;
}

export const brokers: Broker[] = [
  { id: 'standard', name: 'PaperTrade Standard', maxLeverage: 1, commissionRate: 0, description: 'No leverage, no fees - perfect for beginners' },
  { id: 'margin', name: 'PaperTrade Margin', maxLeverage: 2, commissionRate: 0.001, description: '2x leverage with 0.1% commission' },
  { id: 'pro', name: 'PaperTrade Pro', maxLeverage: 5, commissionRate: 0.002, description: '5x leverage with 0.2% commission - for experienced traders' },
  { id: 'elite', name: 'PaperTrade Elite', maxLeverage: 10, commissionRate: 0.003, description: '10x leverage with 0.3% commission - high risk' },
];
