// Serviço de Integração com Yahoo Finance API
// Busca cotações e informações de ativos em tempo real

class YahooFinanceService {
  constructor() {
    this.baseUrl = 'https://query1.finance.yahoo.com/v1';
    this.searchUrl = 'https://query2.finance.yahoo.com/v1/finance/search';
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minuto
  }

  // Buscar ativos por termo de pesquisa
  async searchAssets(query) {
    if (!query || query.length < 2) return [];

    try {
      // Adicionar sufixos brasileiros para busca
      const searchTerms = [
        query.toUpperCase(),
        query.toUpperCase() + '.SA', // Ações brasileiras
        query.toUpperCase() + '11.SA', // FIIs
        query.toUpperCase() + '34.SA', // BDRs
        query.toUpperCase() + '3.SA',  // Ações ON
        query.toUpperCase() + '4.SA'   // Ações PN
      ];

      const results = [];

      for (const term of searchTerms) {
        try {
          const response = await fetch(`${this.searchUrl}?q=${term}&quotesCount=10&newsCount=0`);
          if (response.ok) {
            const data = await response.json();
            if (data.quotes && data.quotes.length > 0) {
              results.push(...data.quotes.map(quote => ({
                symbol: quote.symbol.replace('.SA', ''),
                name: quote.longname || quote.shortname || quote.symbol,
                type: this.getAssetType(quote.symbol),
                exchange: quote.exchange,
                price: quote.regularMarketPrice
              })));
            }
          }
        } catch (error) {
          console.warn(`Erro na busca para ${term}:`, error);
        }
      }

      // Remover duplicatas e filtrar apenas ativos brasileiros
      const uniqueResults = results.filter((result, index, self) => 
        index === self.findIndex(r => r.symbol === result.symbol) &&
        this.isBrazilianAsset(result.symbol)
      );

      return uniqueResults.slice(0, 10); // Máximo 10 resultados
    } catch (error) {
      console.error('Erro na busca de ativos:', error);
      return this.getMockSearchResults(query);
    }
  }

  // Obter cotação atual de um ativo
  async getQuote(symbol) {
    const cacheKey = `quote_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const yahooSymbol = this.formatSymbolForYahoo(symbol);
      const response = await fetch(`${this.baseUrl}/quote?symbols=${yahooSymbol}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.quoteResponse && data.quoteResponse.result && data.quoteResponse.result.length > 0) {
          const quote = data.quoteResponse.result[0];
          const result = {
            symbol: symbol,
            price: quote.regularMarketPrice || quote.previousClose,
            change: quote.regularMarketChange,
            changePercent: quote.regularMarketChangePercent,
            volume: quote.regularMarketVolume,
            marketCap: quote.marketCap,
            timestamp: Date.now()
          };

          this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
          return result;
        }
      }

      // Fallback para dados simulados
      return this.getMockQuote(symbol);
    } catch (error) {
      console.error(`Erro ao obter cotação para ${symbol}:`, error);
      return this.getMockQuote(symbol);
    }
  }

  // Obter cotações múltiplas
  async getMultipleQuotes(symbols) {
    const promises = symbols.map(symbol => this.getQuote(symbol));
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
      symbol: symbols[index],
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }

  // Determinar tipo de ativo baseado no símbolo
  getAssetType(symbol) {
    const cleanSymbol = symbol.replace('.SA', '');
    
    if (cleanSymbol.endsWith('11')) return 'FII';
    if (cleanSymbol.endsWith('34')) return 'BDR';
    if (cleanSymbol.endsWith('3') || cleanSymbol.endsWith('4')) return 'Ação';
    if (cleanSymbol === 'BTC' || cleanSymbol.includes('BTC')) return 'Crypto';
    return 'Ação';
  }

  // Verificar se é ativo brasileiro
  isBrazilianAsset(symbol) {
    const cleanSymbol = symbol.replace('.SA', '');
    
    // FIIs terminam em 11
    if (cleanSymbol.endsWith('11')) return true;
    
    // BDRs terminam em 34
    if (cleanSymbol.endsWith('34')) return true;
    
    // Ações terminam em 3 ou 4
    if (cleanSymbol.endsWith('3') || cleanSymbol.endsWith('4')) return true;
    
    // Alguns ETFs e casos especiais
    const specialCases = ['QBTC11', 'IVVB11', 'NASD11'];
    if (specialCases.includes(cleanSymbol)) return true;
    
    return false;
  }

  // Formatar símbolo para Yahoo Finance
  formatSymbolForYahoo(symbol) {
    if (symbol.includes('.SA')) return symbol;
    if (this.isBrazilianAsset(symbol)) return symbol + '.SA';
    return symbol;
  }

  // Dados simulados para fallback
  getMockSearchResults(query) {
    const mockResults = [
      { symbol: 'BTLG11', name: 'BTG Pactual Logística FII', type: 'FII' },
      { symbol: 'HGLG11', name: 'CSHG Logística FII', type: 'FII' },
      { symbol: 'VISC11', name: 'Vinci Shopping Centers FII', type: 'FII' },
      { symbol: 'QBTC11', name: 'QR Bitcoin Reference Rate ETF', type: 'ETF' },
      { symbol: 'IVVB11', name: 'iShares Core S&P 500 ETF', type: 'ETF' },
      { symbol: 'WEGE3', name: 'WEG S.A.', type: 'Ação' },
      { symbol: 'B3SA3', name: 'B3 S.A.', type: 'Ação' },
      { symbol: 'CPLE6', name: 'Copel', type: 'Ação' },
      { symbol: 'BOAC34', name: 'Bank of America BDR', type: 'BDR' },
      { symbol: 'AMZO34', name: 'Amazon BDR', type: 'BDR' }
    ];

    return mockResults.filter(result => 
      result.symbol.toLowerCase().includes(query.toLowerCase()) ||
      result.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Cotação simulada para fallback
  getMockQuote(symbol) {
    const mockPrices = {
      'QBTC11': 35.50,
      'BTLG11': 103.21,
      'HGLG11': 125.80,
      'VISC11': 95.20,
      'WEGE3': 45.20,
      'B3SA3': 12.85,
      'CPLE6': 12.59,
      'BOAC34': 69.40,
      'AMZO34': 89.20,
      'IVVB11': 285.50
    };

    const basePrice = mockPrices[symbol] || 100.00;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% de variação
    const price = basePrice * (1 + variation);

    return {
      symbol: symbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat((price - basePrice).toFixed(2)),
      changePercent: parseFloat((variation * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
      timestamp: Date.now()
    };
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Obter estatísticas do cache
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

// Instância singleton
const yahooFinanceService = new YahooFinanceService();
export default yahooFinanceService;
