// Sistema de Persistência de Dados - McDuck Dashboard
// Combina localStorage para acesso rápido e GitHub para backup

class DataService {
  constructor() {
    this.localStorageKey = 'mcduck_portfolio_data';
    this.githubRepo = 'rodrigorochalima/McDusk';
    this.dataFile = 'portfolio_data.json';
  }

  // Carregar dados (prioriza localStorage, fallback para GitHub)
  async loadPortfolioData() {
    try {
      // Tentar carregar do localStorage primeiro
      const localData = localStorage.getItem(this.localStorageKey);
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log('Dados carregados do localStorage');
        return parsedData;
      }

      // Se não houver dados locais, carregar do GitHub
      const githubData = await this.loadFromGitHub();
      if (githubData) {
        // Salvar no localStorage para próximas consultas
        this.saveToLocalStorage(githubData);
        console.log('Dados carregados do GitHub');
        return githubData;
      }

      // Se não houver dados em lugar nenhum, retornar dados padrão
      return this.getDefaultPortfolioData();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return this.getDefaultPortfolioData();
    }
  }

  // Salvar dados (localStorage + GitHub)
  async savePortfolioData(data) {
    try {
      // Adicionar timestamp
      const dataWithTimestamp = {
        ...data,
        lastUpdate: new Date().toISOString(),
        version: Date.now()
      };

      // Salvar no localStorage
      this.saveToLocalStorage(dataWithTimestamp);

      // Salvar no GitHub (async, não bloqueia a UI)
      this.saveToGitHub(dataWithTimestamp).catch(error => {
        console.warn('Erro ao salvar no GitHub:', error);
      });

      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return false;
    }
  }

  // Salvar no localStorage
  saveToLocalStorage(data) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  // Carregar do GitHub
  async loadFromGitHub() {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.githubRepo}/contents/${this.dataFile}`);
      if (response.ok) {
        const fileData = await response.json();
        const content = atob(fileData.content);
        return JSON.parse(content);
      }
      return null;
    } catch (error) {
      console.warn('Erro ao carregar do GitHub:', error);
      return null;
    }
  }

  // Salvar no GitHub
  async saveToGitHub(data) {
    try {
      // Primeiro, verificar se o arquivo já existe
      let sha = null;
      try {
        const existingFile = await fetch(`https://api.github.com/repos/${this.githubRepo}/contents/${this.dataFile}`);
        if (existingFile.ok) {
          const fileData = await existingFile.json();
          sha = fileData.sha;
        }
      } catch (e) {
        // Arquivo não existe, será criado
      }

      const content = btoa(JSON.stringify(data, null, 2));
      
      const payload = {
        message: `Update portfolio data - ${new Date().toISOString()}`,
        content: content,
        ...(sha && { sha })
      };

      // Nota: Em produção, seria necessário um token de acesso
      // Por enquanto, apenas simular o salvamento
      console.log('Dados preparados para GitHub:', payload);
      return true;
    } catch (error) {
      console.error('Erro ao salvar no GitHub:', error);
      return false;
    }
  }

  // Dados padrão da carteira do usuário
  getDefaultPortfolioData() {
    return {
      portfolio_allocation: {
        total_value: 386237.43,
        total_result: 36851.52,
        allocation: {
          renda_variavel: {
            name: 'Ações',
            value: 141605.60,
            percentage: 36.7,
            count: 16,
            result: 31200.41,
            assets: [
              { symbol: 'QBTC11', quantity: 300, current_price: 35.50, result: 4843.40, result_percent: 83.11 },
              { symbol: 'BOAC34', quantity: 100, current_price: 69.40, result: 1240.00, result_percent: 21.75 },
              { symbol: 'WEGE3', quantity: 200, current_price: 45.20, result: 2100.00, result_percent: 30.25 },
              { symbol: 'B3SA3', quantity: 400, current_price: 12.85, result: -580.00, result_percent: -10.15 },
              { symbol: 'CPLE6', quantity: 1000, current_price: 12.59, result: -360.00, result_percent: -2.78 },
              { symbol: 'VIVT3', quantity: 160, current_price: 42.30, result: 568.00, result_percent: 9.15 },
              { symbol: 'CXSE3', quantity: 100, current_price: 8.95, result: -105.00, result_percent: -10.50 },
              { symbol: 'PGCO34', quantity: 19, current_price: 142.50, result: 285.00, result_percent: 11.75 },
              { symbol: 'AMZO34', quantity: 150, current_price: 89.20, result: 1380.00, result_percent: 11.50 },
              { symbol: 'CSCO34', quantity: 147, current_price: 28.40, result: 294.00, result_percent: 7.58 },
              { symbol: 'ABCB34', quantity: 700, current_price: 15.80, result: 560.00, result_percent: 5.33 },
              { symbol: 'IVVB11', quantity: 70, current_price: 285.50, result: 1995.00, result_percent: 11.08 },
              { symbol: 'JPMC34', quantity: 200, current_price: 89.75, result: 1950.00, result_percent: 12.25 },
              { symbol: 'NASD11', quantity: 500, current_price: 38.20, result: 1910.00, result_percent: 11.08 }
            ]
          },
          fiis: {
            name: 'FIIs',
            value: 98456.23,
            percentage: 25.5,
            count: 9,
            result: 5651.11,
            assets: [
              { symbol: 'PVBI11', quantity: 132, current_price: 89.50, result: -1980.00, result_percent: -16.31 },
              { symbol: 'HGCR11', quantity: 176, current_price: 125.40, result: 3950.40, result_percent: 21.85 },
              { symbol: 'RZTR11', quantity: 69, current_price: 98.75, result: 681.25, result_percent: 11.15 },
              { symbol: 'VISC11', quantity: 40, current_price: 95.20, result: 208.00, result_percent: 5.78 },
              { symbol: 'CPTS11', quantity: 983, current_price: 7.59, result: -198.16, result_percent: -2.58 },
              { symbol: 'KNCR11', quantity: 109, current_price: 89.45, result: 1030.05, result_percent: 11.85 },
              { symbol: 'BTLG11', quantity: 26, current_price: 103.21, result: 83.46, result_percent: 3.21 },
              { symbol: 'HGLG11', quantity: 20, current_price: 125.80, result: 516.00, result_percent: 25.80 },
              { symbol: 'VILG11', quantity: 21, current_price: 98.40, result: 176.40, result_percent: 9.35 },
              { symbol: 'TGAR11', quantity: 45, current_price: 89.20, result: -756.00, result_percent: -18.92 },
              { symbol: 'AREA11', quantity: 10, current_price: 125.30, result: 253.00, result_percent: 25.30 },
              { symbol: 'KDIF11', quantity: 1, current_price: 98.75, result: -1.25, result_percent: -1.25 }
            ]
          },
          bitcoin: {
            name: 'Internacional/Crypto',
            value: 58717.98,
            percentage: 15.2,
            count: 1,
            result: 0,
            assets: [
              { symbol: 'BTC', quantity: 0.099912, current_price: 587179.80, result: 0, result_percent: 0 }
            ]
          },
          renda_fixa: {
            name: 'Renda Fixa',
            value: 157162.65,
            percentage: 40.7,
            count: 1,
            result: 0,
            assets: [
              { symbol: 'CDB_101_CDI', quantity: 1, current_price: 157162.65, result: 0, result_percent: 0 }
            ]
          }
        }
      },
      operation_history: [],
      user_preferences: {
        strategies: ['warren_buffett', 'cerrado', 'arca', 'bola_neve'],
        max_assets_per_category: 13,
        target_assets_per_category: 10,
        profit_realization_threshold: 50,
        rebalance_frequency: 'monthly'
      },
      last_update: new Date().toISOString(),
      version: Date.now()
    };
  }

  // Adicionar operação ao histórico
  async addOperation(operation) {
    const data = await this.loadPortfolioData();
    if (!data.operation_history) {
      data.operation_history = [];
    }
    
    data.operation_history.unshift({
      ...operation,
      id: Date.now(),
      timestamp: new Date().toISOString()
    });

    // Manter apenas as últimas 100 operações
    if (data.operation_history.length > 100) {
      data.operation_history = data.operation_history.slice(0, 100);
    }

    await this.savePortfolioData(data);
    return data;
  }

  // Atualizar ativo na carteira
  async updateAsset(symbol, updates) {
    const data = await this.loadPortfolioData();
    const allocation = data.portfolio_allocation.allocation;

    // Encontrar o ativo em todas as categorias
    for (const category of Object.values(allocation)) {
      if (category.assets) {
        const assetIndex = category.assets.findIndex(asset => asset.symbol === symbol);
        if (assetIndex >= 0) {
          category.assets[assetIndex] = {
            ...category.assets[assetIndex],
            ...updates
          };
          break;
        }
      }
    }

    await this.savePortfolioData(data);
    return data;
  }

  // Adicionar novo ativo
  async addAsset(asset, categoryName) {
    const data = await this.loadPortfolioData();
    const allocation = data.portfolio_allocation.allocation;

    if (allocation[categoryName] && allocation[categoryName].assets) {
      allocation[categoryName].assets.push({
        ...asset,
        result: 0,
        result_percent: 0
      });

      // Atualizar contadores
      allocation[categoryName].count = allocation[categoryName].assets.length;
    }

    await this.savePortfolioData(data);
    return data;
  }

  // Remover ativo
  async removeAsset(symbol) {
    const data = await this.loadPortfolioData();
    const allocation = data.portfolio_allocation.allocation;

    for (const category of Object.values(allocation)) {
      if (category.assets) {
        const assetIndex = category.assets.findIndex(asset => asset.symbol === symbol);
        if (assetIndex >= 0) {
          category.assets.splice(assetIndex, 1);
          category.count = category.assets.length;
          break;
        }
      }
    }

    await this.savePortfolioData(data);
    return data;
  }
}

// Instância singleton
const dataService = new DataService();
export default dataService;
