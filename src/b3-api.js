// API SIMULADA DA B3 PARA BUSCA DE ATIVOS
// Simula integração com dados reais da bolsa

export const B3_ASSETS_DATABASE = {
  // AÇÕES BRASILEIRAS
  acoes: [
    { symbol: 'PETR4', name: 'Petrobras PN', sector: 'Petróleo e Gás', price: 38.45, type: 'acao' },
    { symbol: 'VALE3', name: 'Vale ON', sector: 'Mineração', price: 65.20, type: 'acao' },
    { symbol: 'ITUB4', name: 'Itaú Unibanco PN', sector: 'Bancos', price: 32.15, type: 'acao' },
    { symbol: 'BBDC4', name: 'Bradesco PN', sector: 'Bancos', price: 14.85, type: 'acao' },
    { symbol: 'ABEV3', name: 'Ambev ON', sector: 'Bebidas', price: 11.25, type: 'acao' },
    { symbol: 'WEGE3', name: 'WEG ON', sector: 'Máquinas e Equipamentos', price: 36.35, type: 'acao' },
    { symbol: 'RENT3', name: 'Localiza ON', sector: 'Aluguel de Carros', price: 58.90, type: 'acao' },
    { symbol: 'LREN3', name: 'Lojas Renner ON', sector: 'Varejo', price: 18.75, type: 'acao' },
    { symbol: 'MGLU3', name: 'Magazine Luiza ON', sector: 'Varejo', price: 4.85, type: 'acao' },
    { symbol: 'CPLE6', name: 'Copel PNB', sector: 'Energia Elétrica', price: 12.71, type: 'acao' },
    { symbol: 'EGIE3', name: 'Engie Brasil ON', sector: 'Energia Elétrica', price: 42.30, type: 'acao' },
    { symbol: 'TAEE11', name: 'Taesa UNT', sector: 'Energia Elétrica', price: 35.80, type: 'acao' },
    { symbol: 'VIVT3', name: 'Telefônica Brasil ON', sector: 'Telecomunicações', price: 33.15, type: 'acao' },
    { symbol: 'CXSE3', name: 'Caixa Seguridade ON', sector: 'Seguros', price: 18.50, type: 'acao' },
    { symbol: 'B3SA3', name: 'B3 ON', sector: 'Serviços Financeiros', price: 12.50, type: 'acao' },
    { symbol: 'RAIL3', name: 'Rumo ON', sector: 'Transporte', price: 19.85, type: 'acao' },
    { symbol: 'CCRO3', name: 'CCR ON', sector: 'Concessões Rodoviárias', price: 11.90, type: 'acao' },
    { symbol: 'ELET3', name: 'Eletrobras ON', sector: 'Energia Elétrica', price: 45.20, type: 'acao' },
    { symbol: 'SUZB3', name: 'Suzano ON', sector: 'Papel e Celulose', price: 52.40, type: 'acao' },
    { symbol: 'KLBN11', name: 'Klabin UNT', sector: 'Papel e Celulose', price: 22.15, type: 'acao' }
  ],

  // FIIs (FUNDOS IMOBILIÁRIOS) - CORRIGIDO SEM DUPLICAÇÕES
  fiis: [
    { symbol: 'BTLG11', name: 'BTG Pactual Logística', sector: 'Logística', price: 103.21, dy: 8.5, type: 'fii' },
    { symbol: 'HGLG11', name: 'CSHG Logística', sector: 'Logística', price: 110.50, dy: 8.2, type: 'fii' },
    { symbol: 'VILG11', name: 'Vinci Logística', sector: 'Logística', price: 108.90, dy: 9.1, type: 'fii' },
    { symbol: 'RZTR11', name: 'Riza Terrax', sector: 'Logística', price: 94.56, dy: 9.8, type: 'fii' },
    { symbol: 'CPTS11', name: 'Capitânia Securities', sector: 'Papel', price: 7.59, dy: 11.2, type: 'fii' },
    { symbol: 'PVBI11', name: 'Papéis e Valores Mobiliários', sector: 'Papel', price: 75.87, dy: 10.2, type: 'fii' },
    { symbol: 'KNCR11', name: 'Kinea Rendimentos Imobiliários', sector: 'Recebíveis', price: 105.08, dy: 12.1, type: 'fii' },
    { symbol: 'HGCR11', name: 'CSHG Recebíveis Imobiliários', sector: 'Híbrido', price: 102.58, dy: 11.5, type: 'fii' },
    { symbol: 'VISC11', name: 'Vinci Shopping Centers', sector: 'Shoppings', price: 87.01, dy: 8.8, type: 'fii' },
    { symbol: 'AREA11', name: 'Área Residencial', sector: 'Híbrido', price: 9.95, dy: 11.8, type: 'fii' },
    { symbol: 'KDIF11', name: 'Kinea Desenvolvimento Imobiliário', sector: 'Híbrido', price: 95.20, dy: 10.5, type: 'fii' },
    { symbol: 'XPLG11', name: 'XP Log', sector: 'Logística', price: 95.50, dy: 7.8, type: 'fii' },
    { symbol: 'MXRF11', name: 'Maxi Renda', sector: 'Híbrido', price: 10.15, dy: 9.5, type: 'fii' },
    { symbol: 'BCFF11', name: 'BC Ffii', sector: 'Papel', price: 8.75, dy: 12.8, type: 'fii' },
    { symbol: 'HFOF11', name: 'Hedge Top FOF', sector: 'FOF', price: 87.20, dy: 8.9, type: 'fii' }
  ],

  // BDRs (BRAZILIAN DEPOSITARY RECEIPTS)
  bdrs: [
    { symbol: 'AAPL34', name: 'Apple Inc', sector: 'Tecnologia', price: 195.40, type: 'bdr' },
    { symbol: 'MSFT34', name: 'Microsoft Corp', sector: 'Tecnologia', price: 420.85, type: 'bdr' },
    { symbol: 'GOOGL34', name: 'Alphabet Inc', sector: 'Tecnologia', price: 175.20, type: 'bdr' },
    { symbol: 'AMZO34', name: 'Amazon.com Inc', sector: 'Tecnologia', price: 58.38, type: 'bdr' },
    { symbol: 'TSLA34', name: 'Tesla Inc', sector: 'Automotivo', price: 248.90, type: 'bdr' },
    { symbol: 'NVDC34', name: 'NVIDIA Corp', sector: 'Semicondutores', price: 135.75, type: 'bdr' },
    { symbol: 'JPMC34', name: 'JPMorgan Chase & Co', sector: 'Bancos', price: 168.18, type: 'bdr' },
    { symbol: 'BOAC34', name: 'Bank of America Corp', sector: 'Bancos', price: 69.40, type: 'bdr' },
    { symbol: 'COCA34', name: 'Coca-Cola Co', sector: 'Bebidas', price: 62.85, type: 'bdr' },
    { symbol: 'DISB34', name: 'Walt Disney Co', sector: 'Entretenimento', price: 112.30, type: 'bdr' },
    { symbol: 'JNJ34', name: 'Johnson & Johnson', sector: 'Saúde', price: 158.95, type: 'bdr' },
    { symbol: 'PFE34', name: 'Pfizer Inc', sector: 'Farmacêutico', price: 28.75, type: 'bdr' },
    { symbol: 'CSCO34', name: 'Cisco Systems Inc', sector: 'Tecnologia', price: 36.05, type: 'bdr' },
    { symbol: 'INTC34', name: 'Intel Corp', sector: 'Semicondutores', price: 22.40, type: 'bdr' },
    { symbol: 'ABCB34', name: 'Banco Internacional', sector: 'Bancos', price: 22.98, type: 'bdr' },
    { symbol: 'PGCO34', name: 'Procter & Gamble Co', sector: 'Bens de Consumo', price: 45.20, type: 'bdr' }
  ],

  // ETFs
  etfs: [
    { symbol: 'IVVB11', name: 'iShares S&P 500', sector: 'Índice', price: 80.39, type: 'etf' },
    { symbol: 'NASD11', name: 'Mirae Asset Nasdaq', sector: 'Tecnologia', price: 3.28, type: 'etf' },
    { symbol: 'QBTC11', name: 'QR Bitcoin', sector: 'Criptomoedas', price: 35.40, type: 'etf' },
    { symbol: 'BOVA11', name: 'iShares Ibovespa', sector: 'Índice', price: 98.75, type: 'etf' },
    { symbol: 'SMAL11', name: 'iShares Small Cap', sector: 'Small Caps', price: 45.20, type: 'etf' },
    { symbol: 'DIVO11', name: 'Caixa Dividendos', sector: 'Dividendos', price: 85.30, type: 'etf' },
    { symbol: 'XBOV11', name: 'XP Ibovespa', sector: 'Índice', price: 99.15, type: 'etf' },
    { symbol: 'GOLD11', name: 'Trend Ouro', sector: 'Commodities', price: 42.80, type: 'etf' },
    { symbol: 'ETHE11', name: 'QR Ethereum', sector: 'Criptomoedas', price: 28.90, type: 'etf' },
    { symbol: 'WRLD11', name: 'iShares MSCI World', sector: 'Global', price: 65.45, type: 'etf' }
  ]
};

// Função para buscar ativos por termo de pesquisa
export const searchAssets = (query) => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  const allAssets = [
    ...B3_ASSETS_DATABASE.acoes,
    ...B3_ASSETS_DATABASE.fiis,
    ...B3_ASSETS_DATABASE.bdrs,
    ...B3_ASSETS_DATABASE.etfs
  ];
  
  return allAssets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm) ||
    asset.name.toLowerCase().includes(searchTerm) ||
    asset.sector.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limitar a 10 resultados
};

// Função para buscar ativos da B3 com base em um termo de busca (compatibilidade com o novo App.jsx)
export const searchB3Assets = async (searchTerm) => {
  // Usar a função searchAssets existente e adaptar o formato de retorno
  const results = searchAssets(searchTerm);
  
  // Mapear para o formato esperado pelo novo App.jsx
  return results.map(asset => ({
    symbol: asset.symbol,
    name: asset.name,
    sector: asset.sector,
    price: asset.price,
    type: getAssetType(asset.symbol)
  }));
};

// Função para obter o tipo de um ativo com base no símbolo (compatibilidade com o novo App.jsx)
export const getAssetType = (symbol) => {
  const asset = getAssetDetails(symbol);
  if (!asset) return 'Ação Brasileira';
  
  switch (asset.type) {
    case 'acao':
      return 'Ação Brasileira';
    case 'fii':
      return 'Fundo Imobiliário (FII)';
    case 'bdr':
      return 'BDR (Internacional)';
    case 'etf':
      return 'ETF';
    default:
      return 'Ação Brasileira';
  }
};

// Função para obter dados detalhados de um ativo
export const getAssetDetails = (symbol) => {
  const allAssets = [
    ...B3_ASSETS_DATABASE.acoes,
    ...B3_ASSETS_DATABASE.fiis,
    ...B3_ASSETS_DATABASE.bdrs,
    ...B3_ASSETS_DATABASE.etfs
  ];
  
  return allAssets.find(asset => asset.symbol === symbol);
};

// Função para validar se um ativo existe
export const validateAsset = (symbol) => {
  return getAssetDetails(symbol) !== undefined;
};

// Função para obter preço atual de um ativo
export const getCurrentPrice = (symbol) => {
  const asset = getAssetDetails(symbol);
  return asset ? asset.price : null;
};

// Função para categorizar ativo automaticamente
export const categorizeAsset = (symbol) => {
  const asset = getAssetDetails(symbol);
  if (!asset) return null;
  
  if (asset.type === 'acao') return 'acoes_br';
  if (asset.type === 'fii') return 'fiis';
  if (asset.type === 'bdr') return 'internacional';
  if (asset.type === 'etf') return 'internacional';
  
  return 'outros';
};
