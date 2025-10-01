// Dados de previdência para o McDuck Dashboard

// Dados dos fundos de previdência
export const fundosPrevidencia = [
  {
    id: 1,
    nome: 'Brasilprev FIX 100',
    tipo: 'Renda Fixa',
    saldo: 87450.32,
    rentabilidade: {
      '1m': 0.82,
      '3m': 2.47,
      '6m': 5.12,
      '1a': 10.45,
      'total': 23.78
    },
    cdi: {
      '1m': 0.92,
      '3m': 2.76,
      '6m': 5.52,
      '1a': 11.04,
      'total': 24.56
    },
    dataInicio: '2020-03-15',
    aporteInicial: 50000,
    aportesMensais: 1000,
    taxaAdm: 1.5
  },
  {
    id: 2,
    nome: 'Icatu Vanguarda Multimercado',
    tipo: 'Multimercado',
    saldo: 42380.75,
    rentabilidade: {
      '1m': 0.95,
      '3m': 2.85,
      '6m': 6.23,
      '1a': 12.87,
      'total': 28.45
    },
    cdi: {
      '1m': 0.92,
      '3m': 2.76,
      '6m': 5.52,
      '1a': 11.04,
      'total': 24.56
    },
    dataInicio: '2021-01-10',
    aporteInicial: 30000,
    aportesMensais: 500,
    taxaAdm: 1.8
  },
  {
    id: 3,
    nome: 'XP Seguros Arrojado',
    tipo: 'Multimercado',
    saldo: 31411.43,
    rentabilidade: {
      '1m': 1.12,
      '3m': 3.45,
      '6m': 7.82,
      '1a': 14.35,
      'total': 18.67
    },
    cdi: {
      '1m': 0.92,
      '3m': 2.76,
      '6m': 5.52,
      '1a': 11.04,
      'total': 24.56
    },
    dataInicio: '2022-05-22',
    aporteInicial: 25000,
    aportesMensais: 500,
    taxaAdm: 2.0
  }
];

// Dados de CDI para comparação
export const cdiData = {
  '1m': 0.92,
  '3m': 2.76,
  '6m': 5.52,
  '1a': 11.04,
  '2a': 24.56,
  '3a': 38.12
};

// Histórico de aportes em previdência
export const aportesPrevidencia = [
  { data: '2020-03-15', valor: 50000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-04-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-05-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-06-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-07-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-08-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-09-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-10-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-11-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2020-12-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2021-01-10', valor: 30000, fundo: 'Icatu Vanguarda Multimercado' },
  { data: '2021-01-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2021-02-10', valor: 500, fundo: 'Icatu Vanguarda Multimercado' },
  { data: '2021-02-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2021-03-10', valor: 500, fundo: 'Icatu Vanguarda Multimercado' },
  { data: '2021-03-15', valor: 1000, fundo: 'Brasilprev FIX 100' },
  { data: '2022-05-22', valor: 25000, fundo: 'XP Seguros Arrojado' },
  { data: '2022-06-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-07-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-08-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-09-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-10-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-11-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2022-12-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2023-01-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2023-02-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2023-03-22', valor: 500, fundo: 'XP Seguros Arrojado' },
  { data: '2023-04-22', valor: 500, fundo: 'XP Seguros Arrojado' }
];

// Total de previdência
export const previdenciaTotal = {
  saldoTotal: 161242.50,
  aportesTotal: 128000.00,
  rentabilidadeTotal: 33242.50,
  rentabilidadePercentual: 25.97
};
