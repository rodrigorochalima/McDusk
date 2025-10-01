// Dados do portfólio para o McDuck Dashboard

const portfolioData = {
  total: {
    valor: 386237.43,
    resultado: 36851.52,
    percentual: 10.5
  },
  categorias: [
    {
      nome: "Ações",
      valor: 141605.60,
      percentual: 36.7,
      resultado: 31200.41,
      resultadoPercentual: "+28.2%"
    },
    {
      nome: "Fundos Imobiliários",
      valor: 72450.30,
      percentual: 18.8,
      resultado: -2885.03,
      resultadoPercentual: "-3.8%"
    },
    {
      nome: "Renda Fixa",
      valor: 161242.31,
      percentual: 41.7,
      resultado: 8536.14,
      resultadoPercentual: "+5.6%"
    },
    {
      nome: "Internacional",
      valor: 10939.22,
      percentual: 2.8,
      resultado: -228.50,
      resultadoPercentual: "-2.1%"
    }
  ],
  melhoresAtivos: [
    {
      simbolo: "QBTC11",
      nome: "ETF de Bitcoin",
      valor: 10650.00,
      resultado: 4843.40,
      resultadoPercentual: 83.1
    },
    {
      simbolo: "RENDA FIXA",
      nome: "Diversos",
      valor: 161242.31,
      resultado: 8536.14,
      resultadoPercentual: 19.3
    },
    {
      simbolo: "KNCR11",
      nome: "FII de Recebíveis",
      valor: 11598.45,
      resultado: 499.63,
      resultadoPercentual: 4.5
    }
  ],
  pioresAtivos: [
    {
      simbolo: "TGAR11",
      nome: "TG Ativo Real",
      valor: 7400.00,
      resultado: -1727.20,
      resultadoPercentual: -18.9
    },
    {
      simbolo: "PVBI11",
      nome: "VBI Prime Properties",
      valor: 10014.84,
      resultado: -1950.16,
      resultadoPercentual: -16.3
    },
    {
      simbolo: "CPTS11",
      nome: "Capitânia Securities",
      valor: 7460.97,
      resultado: -1339.03,
      resultadoPercentual: -15.2
    }
  ],
  ativos: [
    {
      simbolo: "QBTC11",
      nome: "ETF de Bitcoin",
      tipo: "ETF",
      quantidade: 300,
      precoMedio: 19.36,
      precoAtual: 35.50,
      valor: 10650.00,
      resultado: 4843.40,
      resultadoPercentual: 83.1
    },
    {
      simbolo: "BOAC34",
      nome: "Bank of America",
      tipo: "Internacional",
      quantidade: 100,
      precoMedio: 46.42,
      precoAtual: 69.40,
      valor: 6940.00,
      resultado: 3021.84,
      resultadoPercentual: 77.1
    },
    {
      simbolo: "VIVT3",
      nome: "Telefônica Brasil",
      tipo: "Ação",
      quantidade: 160,
      precoMedio: 19.54,
      precoAtual: 33.15,
      valor: 5304.00,
      resultado: 1908.95,
      resultadoPercentual: 56.5
    },
    {
      simbolo: "CPLE6",
      nome: "Copel",
      tipo: "Ação",
      quantidade: 1000,
      precoMedio: 8.60,
      precoAtual: 12.71,
      valor: 12710.00,
      resultado: 4104.75,
      resultadoPercentual: 47.9
    },
    {
      simbolo: "JPMC34",
      nome: "JPMorgan Chase",
      tipo: "Internacional",
      quantidade: 200,
      precoMedio: 129.66,
      precoAtual: 168.18,
      valor: 33636.00,
      resultado: 7736.68,
      resultadoPercentual: 29.7
    },
    {
      simbolo: "IVVB11",
      nome: "ETF S&P 500",
      tipo: "ETF",
      quantidade: 70,
      precoMedio: 64.14,
      precoAtual: 80.39,
      valor: 5627.30,
      resultado: 1427.45,
      resultadoPercentual: 25.3
    },
    {
      simbolo: "ABCB34",
      nome: "Banco ABC",
      tipo: "Internacional",
      quantidade: 700,
      precoMedio: 18.70,
      precoAtual: 22.98,
      valor: 16086.00,
      resultado: 2998.03,
      resultadoPercentual: 22.9
    },
    {
      simbolo: "CSCO34",
      nome: "Cisco Systems",
      tipo: "Internacional",
      quantidade: 147,
      precoMedio: 29.46,
      precoAtual: 36.05,
      valor: 5299.35,
      resultado: 1950.18,
      resultadoPercentual: 22.4
    },
    {
      simbolo: "NASD11",
      nome: "ETF Nasdaq",
      tipo: "ETF",
      quantidade: 500,
      precoMedio: 2.69,
      precoAtual: 3.28,
      valor: 1640.00,
      resultado: 1639.24,
      resultadoPercentual: 21.9
    },
    {
      simbolo: "AMZO34",
      nome: "Amazon",
      tipo: "Internacional",
      quantidade: 150,
      precoMedio: 55.65,
      precoAtual: 58.38,
      valor: 8757.00,
      resultado: 408.81,
      resultadoPercentual: 4.9
    },
    {
      simbolo: "WEGE3",
      nome: "WEG",
      tipo: "Ação",
      quantidade: 200,
      precoMedio: 35.02,
      precoAtual: 36.35,
      valor: 7270.00,
      resultado: 265.19,
      resultadoPercentual: 3.8
    },
    {
      simbolo: "CXSE3",
      nome: "Caixa Seguridade",
      tipo: "Ação",
      quantidade: 100,
      precoMedio: 19.82,
      precoAtual: 20.10,
      valor: 2010.00,
      resultado: 20.10,
      resultadoPercentual: 1.4
    },
    {
      simbolo: "AREA11",
      nome: "ETF Área 11",
      tipo: "ETF",
      quantidade: 10,
      precoMedio: 10.00,
      precoAtual: 9.95,
      valor: 99.50,
      resultado: -4.75,
      resultadoPercentual: -0.5
    },
    {
      simbolo: "HGLG11",
      nome: "CSHG Logística",
      tipo: "FII",
      quantidade: 109,
      precoMedio: 105.58,
      precoAtual: 105.08,
      valor: 11453.72,
      resultado: -54.50,
      resultadoPercentual: -0.5
    },
    {
      simbolo: "VISC11",
      nome: "Vinci Shopping Centers",
      tipo: "FII",
      quantidade: 40,
      precoMedio: 87.33,
      precoAtual: 87.01,
      valor: 3480.40,
      resultado: -12.80,
      resultadoPercentual: -0.3
    },
    {
      simbolo: "RZTR11",
      nome: "Riza Terrax",
      tipo: "FII",
      quantidade: 69,
      precoMedio: 97.14,
      precoAtual: 94.56,
      valor: 6524.64,
      resultado: -178.02,
      resultadoPercentual: -2.7
    },
    {
      simbolo: "HGCR11",
      nome: "CSHG Recebíveis",
      tipo: "FII",
      quantidade: 176,
      precoMedio: 111.59,
      precoAtual: 102.58,
      valor: 18054.08,
      resultado: -1585.76,
      resultadoPercentual: -8.1
    },
    {
      simbolo: "CPTS11",
      nome: "Capitânia Securities",
      tipo: "FII",
      quantidade: 983,
      precoMedio: 8.95,
      precoAtual: 7.59,
      valor: 7460.97,
      resultado: -1339.03,
      resultadoPercentual: -15.2
    },
    {
      simbolo: "PVBI11",
      nome: "VBI Prime Properties",
      tipo: "FII",
      quantidade: 132,
      precoMedio: 90.64,
      precoAtual: 75.87,
      valor: 10014.84,
      resultado: -1950.16,
      resultadoPercentual: -16.3
    },
    {
      simbolo: "TGAR11",
      nome: "TG Ativo Real",
      tipo: "FII",
      quantidade: 74,
      precoMedio: 123.34,
      precoAtual: 100.00,
      valor: 7400.00,
      resultado: -1727.20,
      resultadoPercentual: -18.9
    },
    {
      simbolo: "BITCOIN",
      nome: "Bitcoin",
      tipo: "Internacional",
      quantidade: 0.099912,
      precoMedio: 111000.00,
      precoAtual: 108908.16,
      valor: 10880.22,
      resultado: -228.50,
      resultadoPercentual: -2.1
    },
    {
      simbolo: "KNCR11",
      nome: "Kinea Rendimentos",
      tipo: "FII",
      quantidade: 109,
      precoMedio: 101.82,
      precoAtual: 106.41,
      valor: 11598.45,
      resultado: 499.63,
      resultadoPercentual: 4.5
    },
    {
      simbolo: "RENDA FIXA",
      nome: "Diversos",
      tipo: "Renda Fixa",
      quantidade: 1,
      precoMedio: 152706.17,
      precoAtual: 161242.31,
      valor: 161242.31,
      resultado: 8536.14,
      resultadoPercentual: 19.3
    }
  ]
};

export default portfolioData;
