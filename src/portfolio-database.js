// BANCO DE DADOS PERSISTENTE DA CARTEIRA
// Este arquivo mantém os dados atualizados mesmo após deploys

export const portfolioDatabase = {
  // Data da última atualização
  last_update: "2025-01-29",
  
  // Patrimônio total estimado
  total_value: 602000,
  
  // AÇÕES BRASILEIRAS
  acoes_br: [
    { 
      symbol: 'B3SA3', 
      quantity: 400, 
      current_price: 12.50, 
      purchase_price: 10.50,
      profit_percent: 19.05,
      sector: 'Financeiro',
      dy: 6.2,
      p_vp: 1.8,
      status: 'manter'
    },
    { 
      symbol: 'CXSE3', 
      quantity: 100, 
      current_price: 18.50, 
      purchase_price: 16.20,
      profit_percent: 14.20,
      sector: 'Financeiro',
      dy: 5.8,
      p_vp: 1.2,
      status: 'manter'
    },
    { 
      symbol: 'WEGE3', 
      quantity: 200, 
      current_price: 36.35, 
      purchase_price: 28.90,
      profit_percent: 25.78,
      sector: 'Industrial',
      dy: 2.1,
      p_vp: 4.2,
      roe: 25.3,
      status: 'manter'
    },
    { 
      symbol: 'CPLE6', 
      quantity: 1000, 
      current_price: 12.71, 
      purchase_price: 10.80,
      profit_percent: 17.69,
      sector: 'Utilities',
      dy: 9.8,
      p_vp: 0.9,
      roe: 12.1,
      status: 'manter'
    },
    { 
      symbol: 'VIVT3', 
      quantity: 160, 
      current_price: 33.15, 
      purchase_price: 21.90,
      profit_percent: 51.37,
      sector: 'Telecomunicações',
      dy: 8.5,
      p_vp: 1.1,
      status: 'realizar_lucro'
    }
  ],

  // BDRs
  bdrs: [
    { 
      symbol: 'PGCO34', 
      quantity: 19, 
      current_price: 45.20, 
      purchase_price: 34.70,
      profit_percent: 30.26,
      sector: 'Energia',
      status: 'manter'
    },
    { 
      symbol: 'AMZO34', 
      quantity: 150, 
      current_price: 58.38, 
      purchase_price: 49.20,
      profit_percent: 18.66,
      sector: 'Tecnologia',
      status: 'manter'
    },
    { 
      symbol: 'CSCO34', 
      quantity: 147, 
      current_price: 36.05, 
      purchase_price: 30.40,
      profit_percent: 18.59,
      sector: 'Tecnologia',
      status: 'manter'
    },
    { 
      symbol: 'ABCB34', 
      quantity: 700, 
      current_price: 22.98, 
      purchase_price: 18.70,
      profit_percent: 22.89,
      sector: 'Financeiro',
      status: 'manter'
    },
    { 
      symbol: 'JPMC34', 
      quantity: 200, 
      current_price: 168.18, 
      purchase_price: 127.50,
      profit_percent: 31.91,
      sector: 'Financeiro',
      status: 'manter'
    },
    { 
      symbol: 'BOAC34', 
      quantity: 100, 
      current_price: 69.40, 
      purchase_price: 44.30,
      profit_percent: 56.66,
      sector: 'Financeiro',
      status: 'realizar_lucro'
    }
  ],

  // ETFs
  etfs: [
    { 
      symbol: 'NASD11', 
      quantity: 500, 
      current_price: 3.28, 
      purchase_price: 2.48,
      profit_percent: 32.26,
      sector: 'Tecnologia',
      status: 'manter'
    },
    { 
      symbol: 'IVVB11', 
      quantity: 70, 
      current_price: 80.39, 
      purchase_price: 63.20,
      profit_percent: 27.20,
      sector: 'Diversificado',
      status: 'manter'
    },
    { 
      symbol: 'QBTC11', 
      quantity: 300, 
      current_price: 35.40, 
      purchase_price: 19.35,
      profit_percent: 83.11,
      sector: 'Cripto',
      status: 'realizar_lucro'
    }
  ],

  // FIIs
  fiis: [
    { 
      symbol: 'PVBI11', 
      quantity: 132, 
      current_price: 9.85, 
      purchase_price: 11.20,
      profit_percent: -12.05,
      sector: 'Papel',
      dy: 10.2,
      p_vp: 0.88,
      status: 'comprar'
    },
    { 
      symbol: 'HGCR11', 
      quantity: 176, 
      current_price: 8.90, 
      purchase_price: 10.60,
      profit_percent: -16.04,
      sector: 'Híbrido',
      dy: 11.5,
      p_vp: 0.84,
      status: 'comprar'
    },
    { 
      symbol: 'RZTR11', 
      quantity: 69, 
      current_price: 10.20, 
      purchase_price: 11.80,
      profit_percent: -13.56,
      sector: 'Logística',
      dy: 9.8,
      p_vp: 0.86,
      status: 'comprar'
    },
    { 
      symbol: 'VISC11', 
      quantity: 40, 
      current_price: 9.15, 
      purchase_price: 10.30,
      profit_percent: -11.17,
      sector: 'Shoppings',
      dy: 8.8,
      p_vp: 0.89,
      status: 'comprar'
    },
    { 
      symbol: 'CPTS11', 
      quantity: 983, 
      current_price: 9.50, 
      purchase_price: 8.10,
      profit_percent: 17.28,
      sector: 'Papel',
      dy: 11.2,
      p_vp: 0.95,
      status: 'manter'
    },
    { 
      symbol: 'KNCR11', 
      quantity: 109, 
      current_price: 9.80, 
      purchase_price: 8.70,
      profit_percent: 12.64,
      sector: 'Recebíveis',
      dy: 12.1,
      p_vp: 0.98,
      status: 'manter'
    },
    { 
      symbol: 'BTLG11', 
      quantity: 26, 
      current_price: 10.50, 
      purchase_price: 9.20,
      profit_percent: 14.13,
      sector: 'Logística',
      dy: 8.5,
      p_vp: 1.05,
      status: 'comprar'
    },
    { 
      symbol: 'HGLG11', 
      quantity: 20, 
      current_price: 11.20, 
      purchase_price: 9.80,
      profit_percent: 14.29,
      sector: 'Logística',
      dy: 8.2,
      p_vp: 1.12,
      status: 'comprar'
    },
    { 
      symbol: 'VILG11', 
      quantity: 21, 
      current_price: 10.80, 
      purchase_price: 9.50,
      profit_percent: 13.68,
      sector: 'Logística',
      dy: 9.1,
      p_vp: 1.08,
      status: 'comprar'
    },
    { 
      symbol: 'KDIF11', 
      quantity: 1, 
      current_price: 9.20, 
      purchase_price: 8.90,
      profit_percent: 3.37,
      sector: 'Híbrido',
      dy: 10.5,
      p_vp: 0.92,
      status: 'comprar'
    },
    { 
      symbol: 'AREA11', 
      quantity: 10, 
      current_price: 8.90, 
      purchase_price: 9.40,
      profit_percent: -5.32,
      sector: 'Híbrido',
      dy: 11.8,
      p_vp: 0.89,
      status: 'comprar'
    }
  ],

  // Outros ativos
  outros: [
    { 
      symbol: 'BTC', 
      quantity: 0.099912, 
      current_price: 587179.80, 
      purchase_price: 350000.00,
      profit_percent: 67.77,
      value: 58717.98,
      status: 'realizar_lucro'
    },
    { 
      symbol: 'CDB_CDI', 
      quantity: 1, 
      current_price: 157162.65, 
      purchase_price: 150000.00,
      profit_percent: 4.77,
      value: 157162.65,
      status: 'manter'
    }
  ]
};

// Função para identificar ativos para realização de lucro (>50%)
export const getAssetsForProfitRealization = () => {
  const candidates = [];
  
  // Verificar ações BR
  portfolioDatabase.acoes_br.forEach(asset => {
    if (asset.profit_percent >= 50) {
      candidates.push({
        ...asset,
        class: 'Ações BR',
        current_value: asset.quantity * asset.current_price,
        profit_value: asset.quantity * (asset.current_price - asset.purchase_price)
      });
    }
  });
  
  // Verificar BDRs
  portfolioDatabase.bdrs.forEach(asset => {
    if (asset.profit_percent >= 50) {
      candidates.push({
        ...asset,
        class: 'BDRs',
        current_value: asset.quantity * asset.current_price,
        profit_value: asset.quantity * (asset.current_price - asset.purchase_price)
      });
    }
  });
  
  // Verificar ETFs
  portfolioDatabase.etfs.forEach(asset => {
    if (asset.profit_percent >= 50) {
      candidates.push({
        ...asset,
        class: 'ETFs',
        current_value: asset.quantity * asset.current_price,
        profit_value: asset.quantity * (asset.current_price - asset.purchase_price)
      });
    }
  });
  
  // Verificar outros (Bitcoin)
  portfolioDatabase.outros.forEach(asset => {
    if (asset.profit_percent >= 50) {
      candidates.push({
        ...asset,
        class: 'Cripto',
        current_value: asset.value,
        profit_value: asset.value - (asset.value / (1 + asset.profit_percent/100))
      });
    }
  });
  
  return candidates.sort((a, b) => b.profit_percent - a.profit_percent);
};

// Função para identificar melhores oportunidades de compra (descontados)
export const getBestBuyOpportunities = () => {
  const opportunities = [];
  
  // FIIs com desconto (P/VP < 1.00 ou prejuízo)
  portfolioDatabase.fiis.forEach(asset => {
    if (asset.p_vp < 1.00 || asset.profit_percent < 0) {
      opportunities.push({
        ...asset,
        class: 'FIIs',
        current_value: asset.quantity * asset.current_price,
        discount_score: asset.p_vp ? (1 - asset.p_vp) * 100 : Math.abs(asset.profit_percent)
      });
    }
  });
  
  return opportunities.sort((a, b) => b.discount_score - a.discount_score);
};

// Função para atualizar quantidade de um ativo
export const updateAssetQuantity = (symbol, newQuantity) => {
  // Buscar em todas as classes
  const classes = ['acoes_br', 'bdrs', 'etfs', 'fiis', 'outros'];
  
  for (let className of classes) {
    const asset = portfolioDatabase[className].find(a => a.symbol === symbol);
    if (asset) {
      asset.quantity = newQuantity;
      portfolioDatabase.last_update = new Date().toISOString().split('T')[0];
      return true;
    }
  }
  return false;
};
