// Dados reais atualizados do portfólio do usuário
export const currentPortfolioData = {
  // Ações Brasileiras (5 ativos)
  acoes_br: [
    { symbol: 'B3SA3', quantity: 400, current_price: 12.50, target_allocation: 'manter' },
    { symbol: 'CXSE3', quantity: 100, current_price: 18.50, target_allocation: 'manter' },
    { symbol: 'WEGE3', quantity: 200, current_price: 36.35, target_allocation: 'manter' },
    { symbol: 'CPLE6', quantity: 1000, current_price: 12.71, target_allocation: 'manter' },
    { symbol: 'VIVT3', quantity: 160, current_price: 33.15, target_allocation: 'manter' }
  ],

  // BDRs (6 ativos)
  bdrs: [
    { symbol: 'PGCO34', quantity: 19, current_price: 45.20, target_allocation: 'manter' },
    { symbol: 'AMZO34', quantity: 150, current_price: 58.38, target_allocation: 'manter' },
    { symbol: 'CSCO34', quantity: 147, current_price: 36.05, target_allocation: 'manter' },
    { symbol: 'ABCB34', quantity: 700, current_price: 22.98, target_allocation: 'manter' },
    { symbol: 'JPMC34', quantity: 200, current_price: 168.18, target_allocation: 'manter' },
    { symbol: 'BOAC34', quantity: 100, current_price: 69.40, target_allocation: 'manter' }
  ],

  // ETFs (3 ativos)
  etfs: [
    { symbol: 'NASD11', quantity: 500, current_price: 3.28, target_allocation: 'manter' },
    { symbol: 'IVVB11', quantity: 70, current_price: 80.39, target_allocation: 'manter' },
    { symbol: 'QBTC11', quantity: 300, current_price: 35.40, target_allocation: 'realizar_lucro', profit_target: 50 }
  ],

  // FIIs (9 ativos)
  fiis: [
    { symbol: 'PVBI11', quantity: 132, current_price: 9.85, target_allocation: 'manter' },
    { symbol: 'HGCR11', quantity: 176, current_price: 8.90, target_allocation: 'manter' },
    { symbol: 'RZTR11', quantity: 69, current_price: 10.20, target_allocation: 'manter' },
    { symbol: 'VISC11', quantity: 40, current_price: 9.15, target_allocation: 'manter' },
    { symbol: 'CPTS11', quantity: 983, current_price: 9.50, target_allocation: 'reforcar' },
    { symbol: 'KNCR11', quantity: 109, current_price: 9.80, target_allocation: 'manter' },
    { symbol: 'BTLG11', quantity: 26, current_price: 10.50, target_allocation: 'reforcar' },
    { symbol: 'HGLG11', quantity: 20, current_price: 11.20, target_allocation: 'reforcar' },
    { symbol: 'VILG11', quantity: 21, current_price: 10.80, target_allocation: 'reforcar' },
    { symbol: 'KDIF11', quantity: 1, current_price: 9.20, target_allocation: 'manter' },
    { symbol: 'AREA11', quantity: 10, current_price: 8.90, target_allocation: 'manter' }
  ],

  // Outros ativos
  outros: [
    { symbol: 'BTC', quantity: 0.099912, current_price: 587179.80, value: 58717.98 },
    { symbol: 'CDB_CDI', quantity: 1, current_price: 157162.65, value: 157162.65 }
  ],

  // Regras de alocação
  allocation_rules: {
    target_assets_per_class: 10,
    max_assets_per_class: 13,
    target_allocation_per_class: 25, // 25% cada classe
    profit_realization_threshold: 30, // % de lucro para sugerir realização
    reallocation_priorities: {
      fiis_logisticos: ['BTLG11', 'HGLG11'],
      fiis_papel: ['CPTS11'],
      fiis_diversos: ['VILG11'],
      renda_fixa: ['CDB_CDI']
    }
  }
};

// Função para calcular valor total da carteira
export const calculatePortfolioValue = () => {
  let total = 0;
  
  // Somar ações BR
  currentPortfolioData.acoes_br.forEach(asset => {
    total += asset.quantity * asset.current_price;
  });
  
  // Somar BDRs
  currentPortfolioData.bdrs.forEach(asset => {
    total += asset.quantity * asset.current_price;
  });
  
  // Somar ETFs
  currentPortfolioData.etfs.forEach(asset => {
    total += asset.quantity * asset.current_price;
  });
  
  // Somar FIIs
  currentPortfolioData.fiis.forEach(asset => {
    total += asset.quantity * asset.current_price;
  });
  
  // Somar outros
  total += 58717.98; // Bitcoin
  total += 157162.65; // CDB
  
  return total;
};

// Função para identificar ativos para realização de lucro
export const identifyProfitRealizationTargets = () => {
  const targets = [];
  
  // Verificar ETFs
  currentPortfolioData.etfs.forEach(asset => {
    if (asset.target_allocation === 'realizar_lucro') {
      targets.push({
        symbol: asset.symbol,
        quantity: asset.quantity,
        current_price: asset.current_price,
        total_value: asset.quantity * asset.current_price,
        suggested_reduction: asset.profit_target || 50,
        reason: 'Alto ganho acumulado + concentração excessiva'
      });
    }
  });
  
  return targets;
};
