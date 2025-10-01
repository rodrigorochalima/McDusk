/**
 * McDuck Dashboard - Dados do Portfólio
 * 
 * Estrutura modular para facilitar a manutenção e expansão dos dados.
 * Cada classe de ativo é mantida em seu próprio objeto para permitir
 * atualizações independentes e maior flexibilidade.
 */

// Dados de ações
const acoes = {
  nome: "Ações",
  valor: 141605.60,
  percentual: 36.7,
  quantidade: 16,
  resultado: 31200.41,
  resultadoPercentual: 28.2,
  ativos: [
    { 
      simbolo: "BOAC34", 
      nome: "Bank of America",
      tipo: "BDR",
      quantidade: 100, 
      precoMedio: 39.18,
      precoAtual: 69.40, 
      resultado: 3021.84, 
      resultadoPercentual: 77.12
    },
    { 
      simbolo: "VIVT3", 
      nome: "Telefônica Brasil",
      tipo: "Ação",
      quantidade: 160, 
      precoMedio: 21.18,
      precoAtual: 33.15, 
      resultado: 1908.95, 
      resultadoPercentual: 56.49
    },
    { 
      simbolo: "CPLE6", 
      nome: "Copel",
      tipo: "Ação",
      quantidade: 1000, 
      precoMedio: 8.60,
      precoAtual: 12.71, 
      resultado: 4104.75, 
      resultadoPercentual: 47.92
    },
    { 
      simbolo: "JPMC34", 
      nome: "JPMorgan Chase",
      tipo: "BDR",
      quantidade: 200, 
      precoMedio: 129.67,
      precoAtual: 168.18, 
      resultado: 7736.68, 
      resultadoPercentual: 29.70
    },
    { 
      simbolo: "IVVB11", 
      nome: "iShares S&P 500",
      tipo: "ETF",
      quantidade: 70, 
      precoMedio: 64.14,
      precoAtual: 80.39, 
      resultado: 5627.45, 
      resultadoPercentual: 25.33
    },
    { 
      simbolo: "ABCB34", 
      nome: "Abcam PLC",
      tipo: "BDR",
      quantidade: 700, 
      precoMedio: 18.70,
      precoAtual: 22.98, 
      resultado: 2998.03, 
      resultadoPercentual: 22.91
    },
    { 
      simbolo: "CSCO34", 
      nome: "Cisco Systems",
      tipo: "BDR",
      quantidade: 147, 
      precoMedio: 29.46,
      precoAtual: 36.05, 
      resultado: 1950.18, 
      resultadoPercentual: 22.35
    },
    { 
      simbolo: "NASD11", 
      nome: "Investo NASDAQ",
      tipo: "ETF",
      quantidade: 500, 
      precoMedio: 2.69,
      precoAtual: 3.28, 
      resultado: 1639.24, 
      resultadoPercentual: 21.91
    },
    { 
      simbolo: "AMZO34", 
      nome: "Amazon",
      tipo: "BDR",
      quantidade: 150, 
      precoMedio: 55.65,
      precoAtual: 58.38, 
      resultado: 408.81, 
      resultadoPercentual: 4.90
    },
    { 
      simbolo: "WEGE3", 
      nome: "WEG",
      tipo: "Ação",
      quantidade: 200, 
      precoMedio: 35.02,
      precoAtual: 36.35, 
      resultado: 265.19, 
      resultadoPercentual: 3.79
    },
    { 
      simbolo: "CXSE3", 
      nome: "Caixa Seguridade",
      tipo: "Ação",
      quantidade: 100, 
      precoMedio: 19.82,
      precoAtual: 20.10, 
      resultado: 20.10, 
      resultadoPercentual: 1.42
    },
    { 
      simbolo: "AREA11", 
      nome: "Área Investimentos",
      tipo: "ETF",
      quantidade: 10, 
      precoMedio: 10.00,
      precoAtual: 9.95, 
      resultado: -4.75, 
      resultadoPercentual: -0.47
    },
    { 
      simbolo: "QBTC11", 
      nome: "QR Bitcoin",
      tipo: "ETF",
      quantidade: 0, 
      precoMedio: 19.39,
      precoAtual: 35.50, 
      resultado: 4843.40, 
      resultadoPercentual: 83.11
    }
  ]
};

// Dados de fundos imobiliários
const fiis = {
  nome: "Fundos Imobiliários",
  valor: 72508.36,
  percentual: 18.8,
  quantidade: 7,
  resultado: -2885.03,
  resultadoPercentual: -3.8,
  ativos: [
    { 
      simbolo: "BTLG11", 
      nome: "BTG Pactual Logística",
      tipo: "FII",
      quantidade: 26, 
      precoMedio: 103.42,
      precoAtual: 103.42, 
      resultado: 0, 
      resultadoPercentual: 0
    },
    { 
      simbolo: "HGLG11", 
      nome: "CSHG Logística",
      tipo: "FII",
      quantidade: 20, 
      precoMedio: 160.82,
      precoAtual: 160.82, 
      resultado: 0, 
      resultadoPercentual: 0
    },
    { 
      simbolo: "VILG11", 
      nome: "Vinci Logística",
      tipo: "FII",
      quantidade: 27, 
      precoMedio: 87.97,
      precoAtual: 87.97, 
      resultado: 0, 
      resultadoPercentual: 0
    },
    { 
      simbolo: "KNCR11", 
      nome: "Kinea Rendimentos",
      tipo: "FII",
      quantidade: 109, 
      precoMedio: 101.82,
      precoAtual: 101.82, 
      resultado: 0, 
      resultadoPercentual: 0
    },
    { 
      simbolo: "VISC11", 
      nome: "Vinci Shopping Centers",
      tipo: "FII",
      quantidade: 40, 
      precoMedio: 87.36,
      precoAtual: 87.01, 
      resultado: -13.97, 
      resultadoPercentual: -0.32
    },
    { 
      simbolo: "RZTR11", 
      nome: "Riza Terrax",
      tipo: "FII",
      quantidade: 69, 
      precoMedio: 97.10,
      precoAtual: 94.56, 
      resultado: -175.15, 
      resultadoPercentual: -2.68
    },
    { 
      simbolo: "HGCR11", 
      nome: "CSHG Recebíveis",
      tipo: "FII",
      quantidade: 176, 
      precoMedio: 110.86,
      precoAtual: 102.58, 
      resultado: -1457.21, 
      resultadoPercentual: -8.07
    },
    { 
      simbolo: "CPTS11", 
      nome: "Capitânia Securities",
      tipo: "FII",
      quantidade: 983, 
      precoMedio: 7.79,
      precoAtual: 7.59, 
      resultado: -198.16, 
      resultadoPercentual: -15.13
    },
    { 
      simbolo: "PVBI11", 
      nome: "VBI Prime Properties",
      tipo: "FII",
      quantidade: 132, 
      precoMedio: 90.67,
      precoAtual: 75.87, 
      resultado: -1954.64, 
      resultadoPercentual: -16.31
    },
    { 
      simbolo: "TGAR11", 
      nome: "TG Ativo Real",
      tipo: "FII",
      quantidade: 0, 
      precoMedio: 107.33,
      precoAtual: 87.00, 
      resultado: -954.40, 
      resultadoPercentual: -18.92
    }
  ]
};

// Dados de ativos internacionais
const internacional = {
  nome: "Ativos Internacionais",
  valor: 10881.16,
  percentual: 2.8,
  quantidade: 1,
  resultado: -228.50,
  resultadoPercentual: -2.1,
  ativos: [
    { 
      simbolo: "Bitcoin", 
      nome: "Bitcoin",
      tipo: "Cripto",
      quantidade: 0.099912, 
      precoMedio: 111188.45,
      precoAtual: 108908.16, 
      resultado: -228.50, 
      resultadoPercentual: -2.1
    }
  ]
};

// Dados de renda fixa
const rendaFixa = {
  nome: "Renda Fixa",
  valor: 161242.31,
  percentual: 41.7,
  quantidade: 3,
  resultado: 8536.14,
  resultadoPercentual: 5.6,
  ativos: [
    { 
      simbolo: "CDB", 
      nome: "CDBs Diversos",
      tipo: "Renda Fixa",
      quantidade: 1, 
      precoMedio: 85000.00,
      precoAtual: 89250.00, 
      resultado: 4250.00, 
      resultadoPercentual: 5.0
    },
    { 
      simbolo: "TD", 
      nome: "Tesouro Direto",
      tipo: "Renda Fixa",
      quantidade: 1, 
      precoMedio: 45000.00,
      precoAtual: 47700.00, 
      resultado: 2700.00, 
      resultadoPercentual: 6.0
    },
    { 
      simbolo: "LCI", 
      nome: "LCI/LCA",
      tipo: "Renda Fixa",
      quantidade: 1, 
      precoMedio: 22706.17,
      precoAtual: 24292.31, 
      resultado: 1586.14, 
      resultadoPercentual: 7.0
    }
  ]
};

// Dados de operações recentes
const operacoesRecentes = [
  {
    data: '2025-09-29',
    ticker: 'BTLG11',
    tipo: 'Compra',
    quantidade: 20,
    preco: 103.29,
    valor: 2065.79
  },
  {
    data: '2025-09-29',
    ticker: 'HGLG11',
    tipo: 'Compra',
    quantidade: 7,
    preco: 161.45,
    valor: 1130.18
  },
  {
    data: '2025-09-29',
    ticker: 'QBTC11',
    tipo: 'Venda',
    quantidade: 150,
    preco: 36.76,
    valor: 5514.00
  },
  {
    data: '2025-09-29',
    ticker: 'VILG11',
    tipo: 'Compra',
    quantidade: 6,
    preco: 87.94,
    valor: 527.64
  },
  {
    data: '2025-09-26',
    ticker: 'BTLG11',
    tipo: 'Compra',
    quantidade: 26,
    preco: 103.46,
    valor: 2690.06
  }
];

// Indicadores de mercado
const indicadores = {
  selic: 10.75,
  ipca: 4.23,
  ibov: 4.4,
  iafad: 8.2,
  cdi: 10.65
};

// Dados de rebalanceamento
const rebalanceamento = {
  acoes: {
    atual: 36.7,
    alvo: 25.0,
    valor: 141605.60,
    ajuste: -45146.24,
    ajustePercentual: -31.9
  },
  fiis: {
    atual: 18.8,
    alvo: 25.0,
    valor: 72508.36,
    ajuste: 24051.21,
    ajustePercentual: 33.2
  },
  internacional: {
    atual: 2.8,
    alvo: 25.0,
    valor: 10881.16,
    ajuste: 85678.42,
    ajustePercentual: 787.4
  },
  rendaFixa: {
    atual: 41.7,
    alvo: 25.0,
    valor: 161242.31,
    ajuste: -64583.39,
    ajustePercentual: -40.1
  }
};

// Exportação dos dados consolidados
export const newPortfolioData = {
  total_value: 386237.43,
  total_result: 36851.52,
  allocation: {
    renda_variavel: acoes,
    fiis: fiis,
    bitcoin: internacional,
    renda_fixa: rendaFixa
  },
  operacoes: operacoesRecentes,
  indicadores: indicadores,
  rebalanceamento: rebalanceamento
};

// Exportação dos módulos individuais para uso específico
export {
  acoes,
  fiis,
  internacional,
  rendaFixa,
  operacoesRecentes,
  indicadores,
  rebalanceamento
};

// Exportação padrão para compatibilidade com código existente
export default newPortfolioData;
