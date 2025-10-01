// SISTEMA DE GERENCIAMENTO PERSISTENTE DA CARTEIRA
// Mantém dados atualizados mesmo após deploys e recarregamentos

import { getAssetDetails, categorizeAsset, getCurrentPrice } from './b3-api';

// Chave para localStorage
const PORTFOLIO_STORAGE_KEY = 'mcduck_portfolio_data';
const OPERATIONS_STORAGE_KEY = 'mcduck_operations_history';

// Estrutura base da carteira
const DEFAULT_PORTFOLIO_STRUCTURE = {
  last_update: new Date().toISOString(),
  total_value: 0,
  categories: {
    acoes_br: { assets: [], total_value: 0, percentage: 0 },
    fiis: { assets: [], total_value: 0, percentage: 0 },
    internacional: { assets: [], total_value: 0, percentage: 0 },
    renda_fixa: { assets: [], total_value: 0, percentage: 0 },
    outros: { assets: [], total_value: 0, percentage: 0 }
  },
  operations_count: 0,
  performance: {
    total_invested: 0,
    total_profit: 0,
    profit_percentage: 0
  }
};

// Carregar carteira do localStorage
export const loadPortfolio = () => {
  try {
    const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (stored) {
      const portfolio = JSON.parse(stored);
      // Atualizar preços em tempo real
      return updatePortfolioPrices(portfolio);
    }
    return DEFAULT_PORTFOLIO_STRUCTURE;
  } catch (error) {
    console.error('Erro ao carregar carteira:', error);
    return DEFAULT_PORTFOLIO_STRUCTURE;
  }
};

// Salvar carteira no localStorage
export const savePortfolio = (portfolio) => {
  try {
    portfolio.last_update = new Date().toISOString();
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
    return true;
  } catch (error) {
    console.error('Erro ao salvar carteira:', error);
    return false;
  }
};

// Atualizar preços da carteira
export const updatePortfolioPrices = (portfolio) => {
  const updatedPortfolio = { ...portfolio };
  
  Object.keys(updatedPortfolio.categories).forEach(categoryKey => {
    const category = updatedPortfolio.categories[categoryKey];
    category.assets = category.assets.map(asset => {
      const currentPrice = getCurrentPrice(asset.symbol);
      if (currentPrice) {
        const currentValue = asset.quantity * currentPrice;
        const profit = currentValue - (asset.quantity * asset.average_price);
        const profitPercentage = ((profit / (asset.quantity * asset.average_price)) * 100);
        
        return {
          ...asset,
          current_price: currentPrice,
          current_value: currentValue,
          profit: profit,
          profit_percentage: profitPercentage
        };
      }
      return asset;
    });
    
    // Recalcular totais da categoria
    category.total_value = category.assets.reduce((sum, asset) => sum + asset.current_value, 0);
  });
  
  // Recalcular totais gerais
  updatedPortfolio.total_value = Object.values(updatedPortfolio.categories)
    .reduce((sum, category) => sum + category.total_value, 0);
  
  // Recalcular percentuais
  Object.keys(updatedPortfolio.categories).forEach(categoryKey => {
    const category = updatedPortfolio.categories[categoryKey];
    category.percentage = updatedPortfolio.total_value > 0 
      ? (category.total_value / updatedPortfolio.total_value) * 100 
      : 0;
  });
  
  // Recalcular performance geral
  updatedPortfolio.performance.total_invested = Object.values(updatedPortfolio.categories)
    .reduce((sum, category) => 
      sum + category.assets.reduce((catSum, asset) => 
        catSum + (asset.quantity * asset.average_price), 0), 0);
  
  updatedPortfolio.performance.total_profit = updatedPortfolio.total_value - updatedPortfolio.performance.total_invested;
  updatedPortfolio.performance.profit_percentage = updatedPortfolio.performance.total_invested > 0
    ? (updatedPortfolio.performance.total_profit / updatedPortfolio.performance.total_invested) * 100
    : 0;
  
  return updatedPortfolio;
};

// Adicionar novo ativo à carteira
export const addAssetToPortfolio = (assetData) => {
  const portfolio = loadPortfolio();
  const { symbol, quantity, price, operation_type = 'buy' } = assetData;
  
  // Validar dados
  if (!symbol || !quantity || !price) {
    throw new Error('Dados incompletos: símbolo, quantidade e preço são obrigatórios');
  }
  
  // Obter detalhes do ativo
  const assetDetails = getAssetDetails(symbol);
  if (!assetDetails) {
    throw new Error(`Ativo ${symbol} não encontrado na base de dados da B3`);
  }
  
  // Determinar categoria
  const category = categorizeAsset(symbol);
  if (!category) {
    throw new Error(`Não foi possível categorizar o ativo ${symbol}`);
  }
  
  // Verificar se ativo já existe na carteira
  const existingAssetIndex = portfolio.categories[category].assets.findIndex(
    asset => asset.symbol === symbol
  );
  
  if (existingAssetIndex >= 0) {
    // Ativo já existe - atualizar quantidade e preço médio
    const existingAsset = portfolio.categories[category].assets[existingAssetIndex];
    const totalQuantity = existingAsset.quantity + parseFloat(quantity);
    const totalInvested = (existingAsset.quantity * existingAsset.average_price) + (parseFloat(quantity) * parseFloat(price));
    const newAveragePrice = totalInvested / totalQuantity;
    
    portfolio.categories[category].assets[existingAssetIndex] = {
      ...existingAsset,
      quantity: totalQuantity,
      average_price: newAveragePrice,
      last_operation: {
        type: operation_type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        date: new Date().toISOString()
      }
    };
  } else {
    // Novo ativo - adicionar à carteira
    const newAsset = {
      symbol: symbol,
      name: assetDetails.name,
      sector: assetDetails.sector,
      type: assetDetails.type,
      quantity: parseFloat(quantity),
      average_price: parseFloat(price),
      current_price: assetDetails.price,
      current_value: parseFloat(quantity) * assetDetails.price,
      profit: (parseFloat(quantity) * assetDetails.price) - (parseFloat(quantity) * parseFloat(price)),
      profit_percentage: ((assetDetails.price - parseFloat(price)) / parseFloat(price)) * 100,
      first_purchase_date: new Date().toISOString(),
      last_operation: {
        type: operation_type,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        date: new Date().toISOString()
      },
      dy: assetDetails.dy || null
    };
    
    portfolio.categories[category].assets.push(newAsset);
  }
  
  // Recalcular carteira
  const updatedPortfolio = updatePortfolioPrices(portfolio);
  updatedPortfolio.operations_count += 1;
  
  // Salvar carteira
  savePortfolio(updatedPortfolio);
  
  // Registrar operação no histórico
  logOperation({
    type: 'add_asset',
    symbol: symbol,
    quantity: parseFloat(quantity),
    price: parseFloat(price),
    category: category,
    timestamp: new Date().toISOString()
  });
  
  return updatedPortfolio;
};

// Remover ativo da carteira
export const removeAssetFromPortfolio = (symbol, quantityToRemove = null) => {
  const portfolio = loadPortfolio();
  
  // Encontrar ativo em todas as categorias
  let assetFound = false;
  let categoryKey = null;
  let assetIndex = -1;
  
  Object.keys(portfolio.categories).forEach(catKey => {
    const index = portfolio.categories[catKey].assets.findIndex(asset => asset.symbol === symbol);
    if (index >= 0) {
      assetFound = true;
      categoryKey = catKey;
      assetIndex = index;
    }
  });
  
  if (!assetFound) {
    throw new Error(`Ativo ${symbol} não encontrado na carteira`);
  }
  
  const asset = portfolio.categories[categoryKey].assets[assetIndex];
  
  if (quantityToRemove === null || quantityToRemove >= asset.quantity) {
    // Remover ativo completamente
    portfolio.categories[categoryKey].assets.splice(assetIndex, 1);
    
    logOperation({
      type: 'remove_asset',
      symbol: symbol,
      quantity: asset.quantity,
      category: categoryKey,
      timestamp: new Date().toISOString()
    });
  } else {
    // Reduzir quantidade
    portfolio.categories[categoryKey].assets[assetIndex].quantity -= quantityToRemove;
    
    logOperation({
      type: 'reduce_asset',
      symbol: symbol,
      quantity: quantityToRemove,
      remaining_quantity: portfolio.categories[categoryKey].assets[assetIndex].quantity,
      category: categoryKey,
      timestamp: new Date().toISOString()
    });
  }
  
  // Recalcular e salvar
  const updatedPortfolio = updatePortfolioPrices(portfolio);
  savePortfolio(updatedPortfolio);
  
  return updatedPortfolio;
};

// Editar ativo existente
export const editAssetInPortfolio = (symbol, newData) => {
  const portfolio = loadPortfolio();
  
  // Encontrar ativo
  let assetFound = false;
  let categoryKey = null;
  let assetIndex = -1;
  
  Object.keys(portfolio.categories).forEach(catKey => {
    const index = portfolio.categories[catKey].assets.findIndex(asset => asset.symbol === symbol);
    if (index >= 0) {
      assetFound = true;
      categoryKey = catKey;
      assetIndex = index;
    }
  });
  
  if (!assetFound) {
    throw new Error(`Ativo ${symbol} não encontrado na carteira`);
  }
  
  // Atualizar dados
  const asset = portfolio.categories[categoryKey].assets[assetIndex];
  portfolio.categories[categoryKey].assets[assetIndex] = {
    ...asset,
    ...newData,
    last_operation: {
      type: 'edit',
      changes: newData,
      date: new Date().toISOString()
    }
  };
  
  // Recalcular e salvar
  const updatedPortfolio = updatePortfolioPrices(portfolio);
  savePortfolio(updatedPortfolio);
  
  logOperation({
    type: 'edit_asset',
    symbol: symbol,
    changes: newData,
    category: categoryKey,
    timestamp: new Date().toISOString()
  });
  
  return updatedPortfolio;
};

// Registrar operação no histórico
export const logOperation = (operation) => {
  try {
    const history = getOperationsHistory();
    history.unshift({
      id: Date.now(),
      ...operation
    });
    
    // Manter apenas últimas 100 operações
    const limitedHistory = history.slice(0, 100);
    localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Erro ao registrar operação:', error);
  }
};

// Obter histórico de operações
export const getOperationsHistory = () => {
  try {
    const stored = localStorage.getItem(OPERATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
};

// Limpar dados da carteira (reset)
export const clearPortfolio = () => {
  localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
  localStorage.removeItem(OPERATIONS_STORAGE_KEY);
  return DEFAULT_PORTFOLIO_STRUCTURE;
};

// Exportar dados da carteira
export const exportPortfolioData = () => {
  const portfolio = loadPortfolio();
  const history = getOperationsHistory();
  
  return {
    portfolio,
    history,
    export_date: new Date().toISOString(),
    version: '1.0'
  };
};

// Importar dados da carteira
export const importPortfolioData = (data) => {
  try {
    if (data.portfolio) {
      savePortfolio(data.portfolio);
    }
    if (data.history) {
      localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(data.history));
    }
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};
