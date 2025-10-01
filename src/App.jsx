import { useState, useEffect } from 'react';
import './App.css';
import portfolioData from './portfolio-data';
import { newPortfolioData, acoes, fiis, internacional, rendaFixa } from './new-portfolio-data';
import { searchB3Assets, getAssetType, analyzeAssetImpact } from './b3-api';
import { fundosPrevidencia, cdiData, previdenciaTotal } from './previdencia-data';
import PortfolioEvolutionInteractive from './components/PortfolioEvolutionInteractive';
import './components/PortfolioEvolution.css';

function App() {
  // Usar os novos dados do portfólio
  const [useNewData, setUseNewData] = useState(true);
  const [portfolioDataToUse, setPortfolioDataToUse] = useState(useNewData ? newPortfolioData : portfolioData);
  
  // Efeito para alternar entre os dados antigos e novos
  useEffect(() => {
    setPortfolioDataToUse(useNewData ? newPortfolioData : portfolioData);
  }, [useNewData]);
  
  // Estados para controle de navegação
  const [activeTab, setActiveTab] = useState('visao-geral');
  
  // Estados para busca B3
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetType, setAssetType] = useState('Ação');
  
  // Estados para modais
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showEditAssetModal, setShowEditAssetModal] = useState(false);
  const [showBuyAssetModal, setShowBuyAssetModal] = useState(false);
  const [showSellAssetModal, setShowSellAssetModal] = useState(false);
  const [showDeleteAssetModal, setShowDeleteAssetModal] = useState(false);
  const [showIAModal, setShowIAModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  
  // Estados para previdência
  const [selectedFundoPrevidencia, setSelectedFundoPrevidencia] = useState(null);
  const [periodoRentabilidade, setPeriodoRentabilidade] = useState('1a');
  
  // Estados para calculadora Bola de Neve
  const [bolaNeveInputs, setBolaNeveInputs] = useState({
    valorInicial: 10000,
    aporteMensal: 1000,
    taxaJuros: 0.8,
    periodo: 120
  });
  const [bolaNeveResult, setBolaNeveResult] = useState(null);
  
  // Estados para filtros e ordenação
  const [filterType, setFilterType] = useState('todos');
  const [sortBy, setSortBy] = useState('simbolo');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Efeito para busca B3
  useEffect(() => {
    const searchB3 = async () => {
      if (searchTerm.length >= 2) {
        const results = await searchB3Assets(searchTerm);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    };
    
    searchB3();
  }, [searchTerm]);
  
  // Efeito para calcular Bola de Neve
  useEffect(() => {
    calculateBolaNeveResult();
  }, [bolaNeveInputs]);
  
  // Função para calcular resultado da Bola de Neve
  const calculateBolaNeveResult = () => {
    const { valorInicial, aporteMensal, taxaJuros, periodo } = bolaNeveInputs;
    let montante = Number(valorInicial);
    const taxaMensal = Number(taxaJuros) / 100;
    const aportes = Number(aporteMensal);
    const meses = Number(periodo);
    
    for (let i = 0; i < meses; i++) {
      montante = montante * (1 + taxaMensal) + aportes;
    }
    
    const totalInvestido = Number(valorInicial) + (Number(aporteMensal) * Number(periodo));
    const juros = montante - totalInvestido;
    
    setBolaNeveResult({
      montanteFinal: montante,
      totalInvestido: totalInvestido,
      juros: juros
    });
  };
  
  // Função para selecionar um ativo da busca
  const selectAsset = (asset) => {
    setSelectedAsset(asset);
    setSearchTerm(asset.symbol);
    setAssetType(asset.type);
    setSearchResults([]);
  };
  
  // Função para filtrar ativos
  const filteredAssets = () => {
    let filtered = [...portfolioData.ativos];
    
    if (filterType !== 'todos') {
      filtered = filtered.filter(ativo => ativo.tipo === filterType);
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'simbolo':
          comparison = a.simbolo.localeCompare(b.simbolo);
          break;
        case 'valor':
          comparison = a.valor - b.valor;
          break;
        case 'resultado':
          comparison = a.resultado - b.resultado;
          break;
        case 'resultadoPercentual':
          comparison = a.resultadoPercentual - b.resultadoPercentual;
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };
  
  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Renderização do cabeçalho do app
  const renderHeader = () => {
    return (
      <div className="app-header">
        <div className="app-title">
          <span className="app-icon">📊</span>
          Dashboard de Investimentos
        </div>
        <div className="app-date">
          {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
    );
  };
  
  // Renderização das abas de navegação (2 linhas x 4 colunas)
  const renderTabs = () => {
    return (
      <div className="tabs-container">
        <div className="tabs-row">
          <div className={`tab ${activeTab === 'visao-geral' ? 'active' : ''}`} onClick={() => setActiveTab('visao-geral')}>
            Visão Geral <span className="tab-icon">📊</span>
          </div>
          <div className={`tab ${activeTab === 'analise' ? 'active' : ''}`} onClick={() => setActiveTab('analise')}>
            Análise <span className="tab-icon">📈</span>
          </div>
          <div className={`tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>
            Insights <span className="tab-icon">💡</span>
          </div>
          <div className={`tab ${activeTab === 'aprenda' ? 'active' : ''}`} onClick={() => setActiveTab('aprenda')}>
            Aprenda <span className="tab-icon">🎓</span>
          </div>
        </div>
        <div className="tabs-row">
          <div className={`tab ${activeTab === 'gestao' ? 'active' : ''}`} onClick={() => setActiveTab('gestao')}>
            Gestão <span className="tab-icon">⚙️</span>
          </div>
          <div className={`tab ${activeTab === 'descoberta' ? 'active' : ''}`} onClick={() => setActiveTab('descoberta')}>
            Descoberta <span className="tab-icon">🔍</span>
          </div>
          <div className={`tab ${activeTab === 'minha-ia' ? 'active' : ''}`} onClick={() => setActiveTab('minha-ia')}>
            Minha IA <span className="tab-icon">🤖</span>
          </div>
          <div className={`tab ${activeTab === 'minha-previdencia' ? 'active' : ''}`} onClick={() => setActiveTab('minha-previdencia')}>
            Minha Previdência <span className="tab-icon">💰</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Visão Geral
  const renderVisaoGeral = () => {
    return (
      <div className="tab-content">
        {/* Patrimônio Total */}
        <div className="dashboard-card patrimonio-total">
          <div className="patrimonio-label">
            <span className="card-icon">💰</span>
            Patrimônio Total
          </div>
          <div className="patrimonio-value">
            {formatCurrency(portfolioData.total.valor)}
          </div>
          <div className="patrimonio-result positive">
            +{formatCurrency(portfolioData.total.resultado)} (+{portfolioData.total.percentual}%)
          </div>
        </div>
        
        {/* Evolução da Carteira */}
        <PortfolioEvolutionInteractive />
        
        {/* Indicadores */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">📊</span>
            Indicadores
          </div>
          <div className="indicadores-grid">
            <div className="indicador-item" style={{ backgroundColor: '#f0f8ff' }}>
              <div className="indicador-label">SELIC</div>
              <div className="indicador-value">{portfolioData.indicadores.selic}%</div>
            </div>
            <div className="indicador-item" style={{ backgroundColor: '#fff8f0' }}>
              <div className="indicador-label">IPCA</div>
              <div className="indicador-value">{portfolioData.indicadores.ipca}%</div>
            </div>
            <div className="indicador-item" style={{ backgroundColor: '#f0fff8' }}>
              <div className="indicador-label">IBOV</div>
              <div className="indicador-value">{portfolioData.indicadores.ibov}%</div>
            </div>
            <div className="indicador-item" style={{ backgroundColor: '#fff0f8' }}>
              <div className="indicador-label">IAFAD</div>
              <div className="indicador-value">{portfolioData.indicadores.iafad}%</div>
            </div>
          </div>
        </div>
        
        {/* Categorias */}
        {portfolioData.categorias.map((categoria, index) => (
          <div key={index} className={`dashboard-card categoria-card ${categoria.resultado > 0 ? 'categoria-positive' : 'categoria-negative'}`}>
            <div className="categoria-header">
              <div className="categoria-title">{categoria.nome}</div>
              <div className="categoria-value">{formatCurrency(categoria.valor)}</div>
            </div>
            <div className="categoria-details">
              <div className="categoria-percent">{categoria.percentual}% • {categoria.nome === 'Ações' ? '16 ativos' : categoria.nome === 'Fundos Imobiliários' ? '8 ativos' : categoria.nome === 'Internacional' ? '7 ativos' : '1 ativo'}</div>
              <div className={`categoria-result ${categoria.resultado > 0 ? 'positive' : 'negative'}`}>
                {categoria.resultado > 0 ? '+' : ''}{formatCurrency(categoria.resultado)} ({categoria.resultadoPercentual})
              </div>
            </div>
          </div>
        ))}
        
        {/* Top 3 Ativos */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">🏆</span>
            Top 3 Ativos
          </div>
          <div className="performance-list">
            {portfolioData.melhoresAtivos.map((ativo, index) => (
              <div key={index} className="performance-item">
                <div className="performance-symbol">{index + 1}. {ativo.simbolo} • {ativo.nome}</div>
                <div className="performance-result positive">+{ativo.resultadoPercentual}%</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Piores 3 Ativos */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">⚠️</span>
            Piores 3 Ativos
          </div>
          <div className="performance-list">
            {portfolioData.pioresAtivos.map((ativo, index) => (
              <div key={index} className="performance-item">
                <div className="performance-symbol">{index + 1}. {ativo.simbolo} • {ativo.nome}</div>
                <div className="performance-result negative">{ativo.resultadoPercentual}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Análise
  const renderAnalise = () => {
    return (
      <div className="tab-content">
        {/* Evolução da Carteira */}
        <PortfolioEvolutionInteractive />
        
        {/* Análise ARCA */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">📊</span>
            Análise ARCA
          </div>
          <div className="arca-analysis">
            {Object.keys(portfolioData.rebalanceamento).map((key, index) => {
              const item = portfolioData.rebalanceamento[key];
              return (
                <div key={index} className="arca-item">
                  <div className="arca-label">{key === 'acoes' ? 'Ações' : key === 'fiis' ? 'Fundos Imobiliários' : key === 'internacional' ? 'Internacional' : 'Renda Fixa'}</div>
                  <div className="arca-bar">
                    <div className="arca-progress" style={{ width: `${item.atual}%` }}></div>
                    <div className="arca-target" style={{ left: `${item.alvo}%` }}></div>
                  </div>
                  <div className="arca-percent">{item.atual}%</div>
                  <div className="arca-target-percent">{item.alvo}%</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Rebalanceamento */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">⚖️</span>
            Rebalanceamento
          </div>
          {Object.keys(portfolioData.rebalanceamento).map((key, index) => {
            const item = portfolioData.rebalanceamento[key];
            if (item.ajuste === 0) return null;
            
            return (
              <div key={index} className={`rebalance-item ${item.ajuste > 0 ? 'rebalance-increase' : 'rebalance-decrease'}`}>
                <div className="rebalance-title">
                  <span>{item.ajuste > 0 ? '➕' : '➖'}</span>
                  {item.ajuste > 0 ? 'Aumentar' : 'Reduzir'} {key === 'acoes' ? 'Ações' : key === 'fiis' ? 'FIIs' : key === 'internacional' ? 'Internacional' : 'Renda Fixa'}
                </div>
                <div className="rebalance-value">
                  {item.ajuste > 0 ? 'Aumente' : 'Reduza'} {formatCurrency(Math.abs(item.ajuste))} ({Math.abs(item.ajustePercentual)}%)
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Melhores e Piores */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">🏆</span>
            Melhores e Piores
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Top 3 Melhores</h3>
            <div className="performance-list">
              {portfolioData.melhoresAtivos.map((ativo, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-symbol">{ativo.simbolo}</div>
                  <div className="performance-result positive">+{ativo.resultadoPercentual}%</div>
                </div>
              ))}
            </div>
            
            <h3 style={{ fontSize: '1rem', margin: '16px 0 8px' }}>Top 3 Piores</h3>
            <div className="performance-list">
              {portfolioData.pioresAtivos.map((ativo, index) => (
                <div key={index} className="performance-item">
                  <div className="performance-symbol">{ativo.simbolo}</div>
                  <div className="performance-result negative">{ativo.resultadoPercentual}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Gestão
  const renderGestao = () => {
    return (
      <div className="tab-content">
        {/* Cabeçalho de Gestão */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">⚙️</span>
            Gestão de Ativos
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button className="btn btn-primary" onClick={() => setShowAddAssetModal(true)}>
              + Adicionar
            </button>
            <button className="btn btn-secondary">
              📋 Histórico
            </button>
            <button className="btn btn-danger">
              🗑️ Remover PVBI11
            </button>
          </div>
        </div>
        
        {/* Carteira Atual */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">📊</span>
            Carteira Atual
          </div>
          
          {/* Filtros e ordenação */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label>Filtrar:</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="todos">Todos</option>
                <option value="Ação">Ações</option>
                <option value="FII">FIIs</option>
                <option value="ETF">ETFs</option>
                <option value="Internacional">Internacional</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label>Ordenar:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="simbolo">Símbolo</option>
                <option value="valor">Valor</option>
                <option value="resultado">Resultado</option>
                <option value="resultadoPercentual">Rentabilidade</option>
              </select>
              <button onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff' }}>
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          {/* Lista de ativos */}
          <div className="ativos-list">
            {filteredAssets().map((ativo, index) => (
              <div key={index} className="ativo-item">
                <div className="ativo-header">
                  <div className="ativo-symbol">{ativo.simbolo}</div>
                  <div className={`ativo-type ativo-type-${ativo.tipo === 'Ação' ? 'acao' : ativo.tipo === 'FII' ? 'fii' : ativo.tipo === 'ETF' ? 'etf' : 'internacional'}`}>
                    {ativo.tipo}
                  </div>
                </div>
                <div className="ativo-details">
                  <div>{ativo.quantidade} cotas • R$ {ativo.precoMedio.toFixed(2)}</div>
                  <div className={ativo.resultadoPercentual >= 0 ? 'positive' : 'negative'}>
                    {ativo.resultadoPercentual >= 0 ? '+' : ''}{ativo.resultadoPercentual}%
                  </div>
                </div>
                <div className="ativo-actions">
                  <button className="ativo-action" onClick={() => {
                    setEditingAsset(ativo);
                    setShowBuyAssetModal(true);
                  }}>
                    📈
                  </button>
                  <button className="ativo-action" onClick={() => {
                    setEditingAsset(ativo);
                    setShowSellAssetModal(true);
                  }}>
                    📉
                  </button>
                  <button className="ativo-action" onClick={() => {
                    setEditingAsset(ativo);
                    setShowEditAssetModal(true);
                  }}>
                    ✏️
                  </button>
                  <button className="ativo-action" onClick={() => {
                    setEditingAsset(ativo);
                    setShowDeleteAssetModal(true);
                  }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Calculadora Bola de Neve */}
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">❄️</span>
            Calculadora Bola de Neve
          </div>
          <div className="bola-neve-calculator">
            <div className="bola-neve-title">Simulador de Juros Compostos</div>
            <div className="bola-neve-description">
              Calcule o poder dos juros compostos ao longo do tempo com aportes mensais.
            </div>
            <div className="bola-neve-form">
              <div className="form-group">
                <label className="form-label">Valor Inicial (R$)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={bolaNeveInputs.valorInicial}
                  onChange={(e) => setBolaNeveInputs({...bolaNeveInputs, valorInicial: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Aporte Mensal (R$)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={bolaNeveInputs.aporteMensal}
                  onChange={(e) => setBolaNeveInputs({...bolaNeveInputs, aporteMensal: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Taxa de Juros Mensal (%)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={bolaNeveInputs.taxaJuros}
                  onChange={(e) => setBolaNeveInputs({...bolaNeveInputs, taxaJuros: e.target.value})}
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Período (meses)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={bolaNeveInputs.periodo}
                  onChange={(e) => setBolaNeveInputs({...bolaNeveInputs, periodo: e.target.value})}
                />
              </div>
            </div>
            
            {bolaNeveResult && (
              <div className="bola-neve-result">
                <div className="bola-neve-result-title">Montante Final</div>
                <div className="bola-neve-result-value">{formatCurrency(bolaNeveResult.montanteFinal)}</div>
                <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#666' }}>
                  Total investido: {formatCurrency(bolaNeveResult.totalInvestido)}
                  <br />
                  Juros: {formatCurrency(bolaNeveResult.juros)} ({((bolaNeveResult.juros / bolaNeveResult.totalInvestido) * 100).toFixed(2)}%)
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal para adicionar ativo */}
        {showAddAssetModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Adicionar Ativo</div>
                <button className="modal-close" onClick={() => setShowAddAssetModal(false)}>✕</button>
              </div>
              
              <div className="form-group">
                <label className="form-label">🔍 Buscar Ativo B3</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite 3+ caracteres (ex: PETR, BTLG)"
                />
                
                {searchResults.length > 0 && (
                  <div style={{ marginTop: '8px', border: '1px solid #ddd', borderRadius: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.map((result, index) => (
                      <div 
                        key={index} 
                        style={{ padding: '8px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                        onClick={() => selectAsset(result)}
                      >
                        <div style={{ fontWeight: '500' }}>{result.symbol}</div>
                        <div style={{ fontSize: '0.875rem' }}>{result.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{result.sector} - R$ {result.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Símbolo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={selectedAsset ? selectedAsset.symbol : ''}
                  placeholder="Ex: PETR4, BTLG11"
                  readOnly
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Número de cotas"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Preço Médio</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Preço por cota"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Tipo</label>
                <select 
                  className="form-control" 
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                >
                  <option value="Ação">Ação</option>
                  <option value="FII">FII</option>
                  <option value="Internacional">Internacional</option>
                  <option value="Renda Fixa">Renda Fixa</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowAddAssetModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary">
                  Adicionar Ativo
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal para editar ativo */}
        {showEditAssetModal && editingAsset && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Editar {editingAsset.simbolo}</div>
                <button className="modal-close" onClick={() => setShowEditAssetModal(false)}>✕</button>
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input 
                  type="number" 
                  className="form-control" 
                  defaultValue={editingAsset.quantidade}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Preço Médio (R$)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  defaultValue={editingAsset.precoMedio}
                  step="0.01"
                />
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowEditAssetModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal para comprar ativo */}
        {showBuyAssetModal && editingAsset && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Comprar {editingAsset.simbolo}</div>
                <button className="modal-close" onClick={() => setShowBuyAssetModal(false)}>✕</button>
              </div>
              
              {/* Análise de Impacto */}
              <div className="impacto-analysis">
                <div className="impacto-title">
                  <span>📊</span>
                  Análise de Impacto
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Peso atual:</div>
                  <div className="impacto-value">NaN%</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Tipo:</div>
                  <div className="impacto-value">{editingAsset.tipo}</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Risco:</div>
                  <div className="impacto-value">Baixo</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Impacto ARCA:</div>
                  <div className="impacto-value">Neutro</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Warren Buffett:</div>
                  <div className="impacto-value">NEUTRO</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Cerrado:</div>
                  <div className="impacto-value">0/14</div>
                </div>
              </div>
              
              {/* Recomendações IA */}
              <div className="ia-recommendations">
                <div className="ia-title">
                  <span>🤖</span>
                  Recomendações IA
                </div>
                <div className="ia-item">
                  <div className="ia-item-title">Análise de Timing</div>
                  <div className="ia-item-text">• {editingAsset.simbolo}: Ativo em alta - Aguarde correção</div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Número de cotas"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Preço por Cota</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Preço de execução"
                  step="0.01"
                  defaultValue={editingAsset.precoAtual}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Motivo da Operação (Opcional)</label>
                <textarea 
                  className="form-control" 
                  placeholder="Ex: Rebalanceamento ARCA, realização de lucros, etc."
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowBuyAssetModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-primary">
                  📈 Executar Compra
                </button>
                <button className="btn btn-secondary" onClick={() => setShowIAModal(true)}>
                  🤖 Mais IA
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal para vender ativo */}
        {showSellAssetModal && editingAsset && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Vender {editingAsset.simbolo}</div>
                <button className="modal-close" onClick={() => setShowSellAssetModal(false)}>✕</button>
              </div>
              
              {/* Análise de Impacto */}
              <div className="impacto-analysis">
                <div className="impacto-title">
                  <span>📊</span>
                  Análise de Impacto
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Peso atual:</div>
                  <div className="impacto-value">{((editingAsset.valor / portfolioData.total.valor) * 100).toFixed(2)}%</div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Resultado:</div>
                  <div className={`impacto-value ${editingAsset.resultadoPercentual >= 0 ? 'positive' : 'negative'}`}>
                    {editingAsset.resultadoPercentual >= 0 ? '+' : ''}{editingAsset.resultadoPercentual}%
                  </div>
                </div>
                <div className="impacto-item">
                  <div className="impacto-label">Impacto ARCA:</div>
                  <div className="impacto-value">
                    {editingAsset.tipo === 'Ação' && portfolioData.rebalanceamento.acoes.ajuste < 0 ? 'Positivo' : 
                     editingAsset.tipo === 'FII' && portfolioData.rebalanceamento.fiis.ajuste < 0 ? 'Positivo' :
                     editingAsset.tipo === 'Internacional' && portfolioData.rebalanceamento.internacional.ajuste < 0 ? 'Positivo' :
                     'Negativo'}
                  </div>
                </div>
              </div>
              
              {/* Recomendações IA */}
              <div className="ia-recommendations">
                <div className="ia-title">
                  <span>🤖</span>
                  Recomendações IA
                </div>
                <div className="ia-item">
                  <div className="ia-item-title">Análise de Timing</div>
                  <div className="ia-item-text">
                    {editingAsset.resultadoPercentual >= 30 ? '• Considere realizar lucros parciais' : 
                     editingAsset.resultadoPercentual <= -15 ? '• Considere avaliar fundamentos antes de vender em baixa' :
                     '• Momento neutro para venda'}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Número de cotas"
                  max={editingAsset.quantidade}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Preço por Cota</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Preço de execução"
                  step="0.01"
                  defaultValue={editingAsset.precoAtual}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Motivo da Operação (Opcional)</label>
                <textarea 
                  className="form-control" 
                  placeholder="Ex: Rebalanceamento ARCA, realização de lucros, etc."
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowSellAssetModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger">
                  📉 Executar Venda
                </button>
                <button className="btn btn-secondary" onClick={() => setShowIAModal(true)}>
                  🤖 Mais IA
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal para excluir ativo */}
        {showDeleteAssetModal && editingAsset && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Excluir {editingAsset.simbolo}</div>
                <button className="modal-close" onClick={() => setShowDeleteAssetModal(false)}>✕</button>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <p>Tem certeza que deseja excluir o ativo {editingAsset.simbolo} da sua carteira?</p>
                <p style={{ marginTop: '8px', color: '#666' }}>Esta ação não pode ser desfeita.</p>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setShowDeleteAssetModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger">
                  🗑️ Excluir Ativo
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal para análise IA completa */}
        {showIAModal && editingAsset && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <div className="modal-title">Análise IA Completa</div>
                <button className="modal-close" onClick={() => setShowIAModal(false)}>✕</button>
              </div>
              
              <div className="ia-complete">
                <div className="ia-strategy ia-strategy-warren">
                  <div className="ia-strategy-title">Warren Buffett</div>
                  <div className="ia-strategy-text">
                    Análise fundamentalista baseada em valor intrínseco e qualidade da empresa.
                  </div>
                </div>
                
                <div className="ia-strategy ia-strategy-diagrama">
                  <div className="ia-strategy-title">Diagrama do Cerrado</div>
                  <div className="ia-strategy-text">
                    Score técnico baseado em 14 critérios de análise quantitativa.
                  </div>
                </div>
                
                <div className="ia-strategy ia-strategy-arca">
                  <div className="ia-strategy-title">Estratégia ARCA</div>
                  <div className="ia-strategy-text">
                    Rebalanceamento para manter 25% em cada categoria de ativo.
                  </div>
                </div>
                
                <div className="ia-strategy ia-strategy-bola">
                  <div className="ia-strategy-title">Bola de Neve</div>
                  <div className="ia-strategy-text">
                    Foco em dividend yield para maximizar renda passiva mensal.
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button className="btn btn-primary" onClick={() => setShowIAModal(false)}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Renderização da aba Insights
  const renderInsights = () => {
    return (
      <div className="tab-content">
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">💡</span>
            Insights
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Análises Personalizadas</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Concentração de Risco</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Sua carteira tem 36.7% em ações, com concentração em setores financeiro e energia. 
                Considere diversificar em outros setores para reduzir o risco específico.
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Oportunidades de Rebalanceamento</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Sua exposição internacional está em apenas 2.8%, bem abaixo do alvo de 25%. 
                Considere aumentar gradualmente esta alocação para melhorar a diversificação geográfica.
              </p>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Análise de Rentabilidade</h4>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Seus ativos de renda fixa estão rendendo 5.6%, acima da inflação atual de 4.23%. 
                Mantenha esta alocação para preservação de capital com ganho real.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Minha Previdência
  const renderMinhaPrevidencia = () => {
    return (
      <div className="tab-content">
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">💰</span>
            Minha Previdência
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Minha Previdência</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn btn-sm ${periodoRentabilidade === '1m' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPeriodoRentabilidade('1m')}
              >
                1M
              </button>
              <button 
                className={`btn btn-sm ${periodoRentabilidade === '3m' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPeriodoRentabilidade('3m')}
              >
                3M
              </button>
              <button 
                className={`btn btn-sm ${periodoRentabilidade === '6m' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPeriodoRentabilidade('6m')}
              >
                6M
              </button>
              <button 
                className={`btn btn-sm ${periodoRentabilidade === '1a' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPeriodoRentabilidade('1a')}
              >
                1A
              </button>
              <button 
                className={`btn btn-sm ${periodoRentabilidade === 'total' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPeriodoRentabilidade('total')}
              >
                Total
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>Saldo Total</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formatCurrency(previdenciaTotal.saldoTotal)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>Aportes</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{formatCurrency(previdenciaTotal.aportesTotal)}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>Rentabilidade</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#34a853' }}>
                +{formatCurrency(previdenciaTotal.rentabilidadeTotal)} (+{previdenciaTotal.rentabilidadePercentual.toFixed(2)}%)
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {fundosPrevidencia.map((fundo) => (
              <div 
                key={fundo.id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedFundoPrevidencia(selectedFundoPrevidencia === fundo.id ? null : fundo.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600' }}>{fundo.nome}</div>
                  <div style={{ fontWeight: '600', color: fundo.rentabilidade[periodoRentabilidade] >= 0 ? '#34a853' : '#ea4335' }}>
                    {fundo.rentabilidade[periodoRentabilidade] >= 0 ? '+' : ''}{fundo.rentabilidade[periodoRentabilidade].toFixed(2)}%
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
                  <div>{fundo.tipo}</div>
                  <div>{formatCurrency(fundo.saldo)}</div>
                </div>
                
                {selectedFundoPrevidencia === fundo.id && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>vs CDI</div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '500',
                          color: fundo.rentabilidade[periodoRentabilidade] >= fundo.cdi[periodoRentabilidade] ? '#34a853' : '#ea4335'
                        }}>
                          {((fundo.rentabilidade[periodoRentabilidade] / fundo.cdi[periodoRentabilidade]) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Taxa Adm</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{fundo.taxaAdm}% a.a.</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>Início</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{new Date(fundo.dataInicio).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Aprenda
  const renderAprenda = () => {
    return (
      <div className="tab-content">
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">🎓</span>
            Conteúdo Educacional
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Aprenda sobre Investimentos</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Fundamentos</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Introdução ao Mercado Financeiro</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Renda Fixa vs Renda Variável</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Diversificação e Risco</li>
                  <li style={{ padding: '8px 0', cursor: 'pointer' }}>Juros Compostos</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Ações</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Análise Fundamentalista</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Análise Técnica</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Dividendos e Proventos</li>
                  <li style={{ padding: '8px 0', cursor: 'pointer' }}>Small Caps vs Blue Chips</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Fundos Imobiliários</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Tipos de FIIs</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Análise de FIIs</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Rendimentos e Tributação</li>
                  <li style={{ padding: '8px 0', cursor: 'pointer' }}>FIIs vs Imóveis Físicos</li>
                </ul>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Estratégias</h4>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Estratégia ARCA</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Bola de Neve</li>
                  <li style={{ padding: '8px 0', borderBottom: '1px solid #e0e0e0', cursor: 'pointer' }}>Diagrama do Cerrado</li>
                  <li style={{ padding: '8px 0', cursor: 'pointer' }}>Value Investing</li>
                </ul>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Artigos Recentes</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Como Rebalancear sua Carteira de Investimentos</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Aprenda a técnica de rebalanceamento para manter sua alocação de ativos alinhada com seus objetivos.</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>5 min de leitura • Publicado em 28/09/2025</div>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Investindo em Renda Fixa em Cenários de Alta da Selic</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Descubra as melhores opções de renda fixa para aproveitar o atual cenário de juros elevados.</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>7 min de leitura • Publicado em 15/09/2025</div>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', cursor: 'pointer' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Diversificação Internacional: Por que e Como Investir no Exterior</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Entenda a importância de diversificar geograficamente seus investimentos e as opções disponíveis.</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>10 min de leitura • Publicado em 05/09/2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Descoberta
  const renderDescoberta = () => {
    return (
      <div className="tab-content">
        <div className="dashboard-card">
          <div className="card-title">
            <span className="card-icon">🔍</span>
            Descoberta de Ativos
          </div>
          <div style={{ padding: '16px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Ativos em Destaque</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>BBAS3</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>R$ 54.35</div>
                <div style={{ fontSize: '0.75rem', color: '#34a853' }}>+2.8% hoje</div>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>KNRI11</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>R$ 138.50</div>
                <div style={{ fontSize: '0.75rem', color: '#ea4335' }}>-1.2% hoje</div>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>IVVB11</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>R$ 80.39</div>
                <div style={{ fontSize: '0.75rem', color: '#34a853' }}>+0.5% hoje</div>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>PETR4</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>R$ 38.42</div>
                <div style={{ fontSize: '0.75rem', color: '#34a853' }}>+1.7% hoje</div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Recomendações para Você</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600' }}>BBAS3</div>
                  <div style={{ color: '#34a853' }}>Compra</div>
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '8px' }}>Banco do Brasil ON</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                  P/L: 4.5x • Div. Yield: 8.7% • ROE: 18.2%
                </div>
                <div style={{ fontSize: '0.875rem', backgroundColor: '#e8f4fc', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #0066cc' }}>
                  Múltiplos atrativos e dividendos consistentes. Alinhado com sua estratégia de renda.
                </div>
              </div>
              
              <div style={{ backgroundColor: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600' }}>HGLG11</div>
                  <div style={{ color: '#34a853' }}>Compra</div>
                </div>
                <div style={{ fontSize: '0.875rem', marginBottom: '8px' }}>CSHG Logística</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                  P/VP: 0.92x • Div. Yield: 8.2% • Vacância: 2.1%
                </div>
                <div style={{ fontSize: '0.875rem', backgroundColor: '#e8f4fc', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #0066cc' }}>
                  Negociando abaixo do valor patrimonial com bom yield. Complementa sua carteira de FIIs.
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Notícias do Mercado</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Copom mantém Selic em 10,75% ao ano</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Comitê de Política Monetária decide manter taxa básica de juros, citando preocupações com inflação.</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>Valor Econômico • 30/09/2025</div>
              </div>
              
              <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Ibovespa fecha em alta de 0,8%, impulsionado por commodities</div>
                <div style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Principais índices acionários brasileiros sobem com valorização das commodities no mercado internacional.</div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>InfoMoney • 01/10/2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderização da aba Minha IA
  const renderMinhaIA = () => {
    return (
      <div className="tab-content">
        <div className="dashboard-card" style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          <div className="card-title">
            <span className="card-icon">🤖</span>
            Assistente Inteligente
          </div>
          
          <div style={{ padding: '0 16px 16px' }}>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              Faça perguntas sobre sua carteira, rebalanceamento, ou estratégias de investimento.
            </p>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', maxWidth: '80%', alignSelf: 'flex-start', marginBottom: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: '#e0e0e0', borderRadius: '18px', borderBottomLeftRadius: '4px' }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    Olá! Sou seu assistente de investimentos. Posso ajudar com análises da sua carteira, estratégias e recomendações. Como posso ajudar?
                  </p>
                  <span style={{ fontSize: '11px', opacity: '0.7', display: 'block', textAlign: 'right' }}>
                    10:30
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', padding: '12px', borderTop: '1px solid #e0e0e0' }}>
              <input 
                type="text" 
                placeholder="Digite sua pergunta..." 
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '24px', 
                  marginRight: '8px',
                  fontSize: '14px'
                }}
              />
              <button style={{ 
                backgroundColor: '#0066cc', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50%', 
                width: '40px', 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                ➤
              </button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 12px 12px' }}>
              <div style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Analise minha carteira
              </div>
              <div style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Recomende rebalanceamento
              </div>
              <div style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Ativos em promoção
              </div>
              <div style={{ backgroundColor: '#f0f0f0', padding: '8px 12px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Devo realizar lucro parcial?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="app">
      {renderHeader()}
      {renderTabs()}
      
      <div className="app-content">
        {activeTab === 'visao-geral' && renderVisaoGeral()}
        {activeTab === 'analise' && renderAnalise()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'aprenda' && renderAprenda()}
        {activeTab === 'gestao' && renderGestao()}
        {activeTab === 'descoberta' && renderDescoberta()}
        {activeTab === 'minha-ia' && renderMinhaIA()}
        {activeTab === 'minha-previdencia' && renderMinhaPrevidencia()}
      </div>
    </div>
  );
}

export default App;
