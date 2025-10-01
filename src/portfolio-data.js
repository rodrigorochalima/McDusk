// Dados reais do portfólio do usuário
export const realPortfolioData = {
  portfolio_allocation: {
    total_value: 602000.00,
    total_result: 85000.00,
    allocation: {
      acoes_br: {
        name: 'Ações Brasil',
        value: 95000.00,
        percentage: 15.8,
        count: 5,
        result: 15000.00,
        assets: [
          { symbol: 'B3SA3', quantity: 400, current_price: 12.50, result: 2000.00, result_percent: 16.67 },
          { symbol: 'CXSE3', quantity: 100, current_price: 18.50, result: 500.00, result_percent: 2.78 },
          { symbol: 'WEGE3', quantity: 200, current_price: 36.35, result: 1500.00, result_percent: 20.65 },
          { symbol: 'CPLE6', quantity: 1000, current_price: 12.71, result: 2000.00, result_percent: 18.67 },
          { symbol: 'VIVT3', quantity: 160, current_price: 33.15, result: 1800.00, result_percent: 51.23 }
        ]
      },
      bdrs: {
        name: 'BDRs',
        value: 152000.00,
        percentage: 25.2,
        count: 6,
        result: 25000.00,
        assets: [
          { symbol: 'PGCO34', quantity: 19, current_price: 45.20, result: 200.00, result_percent: 30.23 },
          { symbol: 'AMZO34', quantity: 150, current_price: 58.38, result: 1200.00, result_percent: 15.89 },
          { symbol: 'CSCO34', quantity: 147, current_price: 36.05, result: 800.00, result_percent: 17.78 },
          { symbol: 'ABCB34', quantity: 700, current_price: 22.98, result: 3000.00, result_percent: 22.91 },
          { symbol: 'JPMC34', quantity: 200, current_price: 168.18, result: 8000.00, result_percent: 31.25 },
          { symbol: 'BOAC34', quantity: 100, current_price: 69.40, result: 2500.00, result_percent: 56.25 }
        ]
      },
      fiis: {
        name: 'Fundos Imobiliários',
        value: 175000.00,
        percentage: 29.1,
        count: 9,
        result: 12000.00,
        assets: [
          { symbol: 'PVBI11', quantity: 132, current_price: 9.85, result: 200.00, result_percent: 18.23 },
          { symbol: 'HGCR11', quantity: 176, current_price: 8.90, result: 150.00, result_percent: 10.56 },
          { symbol: 'RZTR11', quantity: 69, current_price: 10.20, result: 80.00, result_percent: 12.85 },
          { symbol: 'VISC11', quantity: 40, current_price: 9.15, result: 50.00, result_percent: 15.89 },
          { symbol: 'CPTS11', quantity: 983, current_price: 9.50, result: 1500.00, result_percent: 19.12 },
          { symbol: 'KNCR11', quantity: 109, current_price: 9.80, result: 120.00, result_percent: 12.67 },
          { symbol: 'BTLG11', quantity: 26, current_price: 10.50, result: 30.00, result_percent: 12.34 },
          { symbol: 'HGLG11', quantity: 20, current_price: 11.20, result: 25.00, result_percent: 12.56 },
          { symbol: 'VILG11', quantity: 21, current_price: 10.80, result: 28.00, result_percent: 14.23 }
        ]
      },
      etfs_cripto: {
        name: 'ETFs e Cripto',
        value: 120000.00,
        percentage: 19.9,
        count: 4,
        result: 25000.00,
        assets: [
          { symbol: 'NASD11', quantity: 500, current_price: 3.28, result: 400.00, result_percent: 32.26 },
          { symbol: 'IVVB11', quantity: 70, current_price: 80.39, result: 1200.00, result_percent: 27.34 },
          { symbol: 'QBTC11', quantity: 300, current_price: 35.50, result: 3200.00, result_percent: 43.24 },
          { symbol: 'BTC', quantity: 0.099912, current_price: 587179.80, result: 15000.00, result_percent: 34.23 }
        ]
      },
      renda_fixa: {
        name: 'Renda Fixa',
        value: 157162.65,
        percentage: 26.1,
        count: 1,
        result: 7162.65,
        assets: [
          { symbol: 'CDB_CDI', quantity: 1, current_price: 157162.65, result: 7162.65, result_percent: 4.78 }
        ]
      }
    }
  },
  market_indicators: {
    selic: 10.75,
    cdi: 10.65,
    ipca: 4.23,
    ibovespa: {
      current: 129500,
      change_percent: 1.2
    }
  }
};
