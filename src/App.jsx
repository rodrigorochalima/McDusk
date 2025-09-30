import { useState, useEffect } from 'react'
import './App.css'
import dataService from './services/dataService'
import yahooFinanceService from './services/yahooFinanceService'
import imageProcessingService from './services/imageProcessingService'
import AssetManagement from './components/AssetManagement'
import ImageProcessor from './components/ImageProcessor'

function App() {
  const [activeTab, setActiveTab] = useState('visao')
  const [currentView, setCurrentView] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')
  const [showFundamentalInfo, setShowFundamentalInfo] = useState(null)
  
  // Estados do chat inteligente
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: 'Olá! Sou seu assistente de investimentos. Posso ajudar com análises da sua carteira, estratégias e recomendações. Como posso ajudar?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Estados para gerenciamento da carteira local
  const [localPortfolio, setLocalPortfolio] = useState(null)
  const [pendingOperations, setPendingOperations] = useState([])
  const [operationHistory, setOperationHistory] = useState([])
  
  // Estados para processamento de operações (NOVO - MÓDULO IA)
  const [uploadedImages, setUploadedImages] = useState([])
  const [processingOperation, setProcessingOperation] = useState(false)
  const [detectedOperations, setDetectedOperations] = useState([])
  const [operationQueue, setOperationQueue] = useState([])
  
  // Estados para simulador ARCA e calculadora bola de neve
  const [rebalanceAmount, setRebalanceAmount] = useState('')
  const [rebalanceCalculation, setRebalanceCalculation] = useState({
    fiis: 0,
    internacional: 0,
    rendaFixa: 0
  })
  const [snowballTarget, setSnowballTarget] = useState(500)
  const [customSnowballTarget, setCustomSnowballTarget] = useState('')

  // Estados para gerenciamento de ativos (NOVO)
  const [showAssetManager, setShowAssetManager] = useState(false)
  const [assetSearch, setAssetSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    quantity: '',
    averagePrice: '',
    category: 'renda_variavel'
  })
  
  // Estados para barra superior (NOVO)
  const [previdenciaValue, setPrevidenciaValue] = useState('45000')
  const [topChatInput, setTopChatInput] = useState('')
  
  // Estados para processamento de imagens (NOVO)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [processingImage, setProcessingImage] = useState(false)
  const [imageAnalysisResult, setImageAnalysisResult] = useState(null)
  
  // Estados para persistência de dados (NOVO)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle') // idle, syncing, success, error

  // Carregar dados
  useEffect(() => {
    loadPortfolioData()
    
    // Atualizar cotações a cada minuto
    const interval = setInterval(() => {
      updateQuotes()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Carregar dados da carteira
  const loadPortfolioData = async () => {
    try {
      setLoading(true)
      setSyncStatus('syncing')
      
      const data = await dataService.loadPortfolioData()
      setPortfolioData(data)
      setLocalPortfolio(data)
      setDataLoaded(true)
      setSyncStatus('success')
      
      const now = new Date()
      setLastUpdate(now.toLocaleString('pt-BR'))
      
      console.log('Dados da carteira carregados:', data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setSyncStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Atualizar cotações via Yahoo Finance
  const updateQuotes = async () => {
    if (!portfolioData) return
    
    try {
      const allAssets = getAllAssets(portfolioData.portfolio_allocation.allocation)
      const symbols = allAssets.map(asset => asset.symbol)
      
      const quotes = await yahooFinanceService.getMultipleQuotes(symbols)
      
      // Atualizar preços na carteira
      let hasUpdates = false
      quotes.forEach(quote => {
        if (quote.data && quote.data.price) {
          // Atualizar preço do ativo
          dataService.updateAsset(quote.symbol, {
            current_price: quote.data.price,
            last_quote_update: new Date().toISOString()
          })
          hasUpdates = true
        }
      })
      
      if (hasUpdates) {
        // Recarregar dados atualizados
        const updatedData = await dataService.loadPortfolioData()
        setPortfolioData(updatedData)
        setLocalPortfolio(updatedData)
      }
      
    } catch (error) {
      console.warn('Erro ao atualizar cotações:', error)
    }
  }

  const fetchData = async () => {
    // Manter compatibilidade com código existente
    await loadPortfolioData()
  }
  
  const oldFetchData = async () => {
    try {
      // Dados reais com APENAS os 24 ativos que o usuário informou
      const data = {
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
                { 
                  symbol: 'QBTC11', 
                  quantity: 300, 
                  current_price: 35.50, 
                  result: 4843.40, 
                  result_percent: 83.11,
                  cerrado_score: 9,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 0,
                    pl: null,
                    pvp: 1.05,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'ETF de Bitcoin com alta liquidez e baixo custo' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren não investe em criptomoedas, mas é um hedge contra inflação' }
                  },
                  description: 'ETF que busca replicar a variação do preço do Bitcoin em reais.'
                },
                { 
                  symbol: 'BOAC34', 
                  quantity: 100, 
                  current_price: 69.40, 
                  result: 3021.84, 
                  result_percent: 77.12,
                  cerrado_score: 11,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 2.8,
                    pl: 10.2,
                    pvp: 1.2,
                    roe: 12.5,
                    roic: 10.8,
                    margem_liquida: 27.3,
                    div_liquida_ebitda: 1.8
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Banco sólido com bons fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Warren é acionista do Bank of America, banco com vantagem competitiva' }
                  },
                  description: 'BDR do Bank of America, um dos maiores bancos dos Estados Unidos.'
                },
                { 
                  symbol: 'VIVT3', 
                  quantity: 160, 
                  current_price: 33.15, 
                  result: 1908.95, 
                  result_percent: 56.49,
                  cerrado_score: 10,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 8.5,
                    pl: 12.3,
                    pvp: 1.1,
                    roe: 9.2,
                    roic: 8.7,
                    margem_liquida: 15.4,
                    div_liquida_ebitda: 0.9
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa de setor perene com bom dividend yield' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ações (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com vantagem competitiva e geração de caixa consistente' }
                  },
                  description: 'Telefônica Brasil (Vivo), empresa de telecomunicações líder no Brasil.'
                },
                { 
                  symbol: 'CPLE6', 
                  quantity: 1000, 
                  current_price: 12.71, 
                  result: 4104.75, 
                  result_percent: 47.92,
                  cerrado_score: 12,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 9.8,
                    pl: 7.5,
                    pvp: 0.9,
                    roe: 12.1,
                    roic: 10.5,
                    margem_liquida: 18.7,
                    div_liquida_ebitda: 1.2
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa de setor perene (energia) com ótimos fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ações (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Monopólio natural com previsibilidade de receitas' }
                  },
                  description: 'Copel, companhia de energia elétrica do Paraná.'
                },
                { 
                  symbol: 'JPMC34', 
                  quantity: 200, 
                  current_price: 168.18, 
                  result: 7736.68, 
                  result_percent: 29.70,
                  cerrado_score: 10,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 2.5,
                    pl: 11.8,
                    pvp: 1.7,
                    roe: 14.5,
                    roic: 12.3,
                    margem_liquida: 32.1,
                    div_liquida_ebitda: 2.1
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Banco com fundamentos sólidos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Warren já investiu em JPMorgan, banco com vantagem competitiva' }
                  },
                  description: 'BDR do JPMorgan Chase, maior banco dos Estados Unidos por ativos.'
                },
                { 
                  symbol: 'IVVB11', 
                  quantity: 70, 
                  current_price: 80.39, 
                  result: 5627.45, 
                  result_percent: 25.33,
                  cerrado_score: 8,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 1.2,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'ETF diversificado, não se aplica análise fundamentalista completa' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Warren recomenda ETFs de índice para investidores comuns' }
                  },
                  description: 'ETF que busca replicar o índice S&P 500 dos EUA.'
                },
                { 
                  symbol: 'ABCB34', 
                  quantity: 700, 
                  current_price: 22.98, 
                  result: 2998.03, 
                  result_percent: 22.91,
                  cerrado_score: 9,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 3.2,
                    pl: 9.5,
                    pvp: 1.1,
                    roe: 11.8,
                    roic: 10.2,
                    margem_liquida: 25.7,
                    div_liquida_ebitda: 1.9
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Banco com bons fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Banco com fundamentos sólidos, mas sem vantagem competitiva clara' }
                  },
                  description: 'BDR de banco internacional.'
                },
                { 
                  symbol: 'CSCO34', 
                  quantity: 147, 
                  current_price: 36.05, 
                  result: 1950.18, 
                  result_percent: 22.35,
                  cerrado_score: 9,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 3.1,
                    pl: 14.2,
                    pvp: 4.5,
                    roe: 31.7,
                    roic: 22.3,
                    margem_liquida: 21.8,
                    div_liquida_ebitda: 0.5
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa de tecnologia com bons fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Empresa de tecnologia com vantagens competitivas, mas setor de rápida mudança' }
                  },
                  description: 'BDR da Cisco Systems, líder global em equipamentos de rede.'
                },
                { 
                  symbol: 'NASD11', 
                  quantity: 500, 
                  current_price: 3.28, 
                  result: 1639.24, 
                  result_percent: 21.91,
                  cerrado_score: 7,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 0.5,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'ETF diversificado, não se aplica análise fundamentalista completa' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren prefere S&P 500 a Nasdaq por ser menos volátil' }
                  },
                  description: 'ETF que busca replicar o índice Nasdaq-100 dos EUA.'
                },
                { 
                  symbol: 'AMZO34', 
                  quantity: 150, 
                  current_price: 58.38, 
                  result: 408.81, 
                  result_percent: 4.90,
                  cerrado_score: 8,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 0,
                    pl: 59.3,
                    pvp: 8.7,
                    roe: 14.7,
                    roic: 11.2,
                    margem_liquida: 3.2,
                    div_liquida_ebitda: 1.1
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'Múltiplos elevados, mas empresa de qualidade' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Empresa com vantagem competitiva, mas múltiplos elevados' }
                  },
                  description: 'BDR da Amazon, líder global em e-commerce e computação em nuvem.'
                },
                { 
                  symbol: 'WEGE3', 
                  quantity: 200, 
                  current_price: 36.35, 
                  result: 265.19, 
                  result_percent: 3.79,
                  cerrado_score: 13,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 1.8,
                    pl: 28.5,
                    pvp: 7.2,
                    roe: 25.3,
                    roic: 22.7,
                    margem_liquida: 17.5,
                    div_liquida_ebitda: 0.2
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa excepcional com ótimos fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ações (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com vantagem competitiva duradoura e gestão excelente' }
                  },
                  description: 'WEG, fabricante brasileira de motores elétricos e equipamentos de automação.'
                },
                { 
                  symbol: 'CXSE3', 
                  quantity: 100, 
                  current_price: 20.10, 
                  result: 20.10, 
                  result_percent: 1.42,
                  cerrado_score: 13,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 5.7,
                    pl: 8.3,
                    pvp: 1.2,
                    roe: 14.5,
                    roic: 12.8,
                    margem_liquida: 12.3,
                    div_liquida_ebitda: 0.7
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa de setor perene com ótimos fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ações (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com vantagem competitiva em setor estável' }
                  },
                  description: 'Caixa Seguridade, empresa do setor de seguros e previdência.'
                },
                { 
                  symbol: 'AREA11', 
                  quantity: 10, 
                  current_price: 9.95, 
                  result: -4.75, 
                  result_percent: -0.47,
                  cerrado_score: 6,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 0.8,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'ETF diversificado, não se aplica análise fundamentalista completa' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren não costuma investir em ETFs temáticos' }
                  },
                  description: 'ETF que busca replicar o desempenho de empresas do agronegócio.'
                },
                { 
                  symbol: 'B3SA3', 
                  quantity: 400, 
                  current_price: 13.22, 
                  result: -111.19, 
                  result_percent: -2.10,
                  cerrado_score: 12,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 5.2,
                    pl: 15.7,
                    pvp: 2.8,
                    roe: 17.8,
                    roic: 15.3,
                    margem_liquida: 43.5,
                    div_liquida_ebitda: 1.1
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa com monopólio e ótimos fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ações (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com forte vantagem competitiva (monopólio)' }
                  },
                  description: 'B3, bolsa de valores brasileira e infraestrutura de mercado financeiro.'
                },
                { 
                  symbol: 'KDIF11', 
                  quantity: 1, 
                  current_price: 123.92, 
                  result: -12.08, 
                  result_percent: -8.92,
                  cerrado_score: 5,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 0.7,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'ETF diversificado, não se aplica análise fundamentalista completa' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren não costuma investir em ETFs temáticos' }
                  },
                  description: 'ETF que busca replicar o desempenho de empresas do setor financeiro.'
                },
                { 
                  symbol: 'PGCO34', 
                  quantity: 19, 
                  current_price: 58.47, 
                  result: -198.16, 
                  result_percent: -15.13,
                  cerrado_score: 10,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 2.5,
                    pl: 24.8,
                    pvp: 6.5,
                    roe: 26.2,
                    roic: 18.7,
                    margem_liquida: 14.3,
                    div_liquida_ebitda: 1.5
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'Empresa de qualidade com bons fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com marcas fortes e vantagem competitiva' }
                  },
                  description: 'BDR da Procter & Gamble, líder global em produtos de consumo.'
                }
              ]
            },
            fiis: { 
              name: 'Fundos Imobiliários', 
              value: 72508.36, 
              percentage: 18.8, 
              count: 8, 
              result: -2885.03,
              assets: [
                { 
                  symbol: 'BTLG11', 
                  quantity: 118, 
                  current_price: 103.21, 
                  result: 1368.87, 
                  result_percent: 12.67,
                  cerrado_score: 9,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 8.2,
                    pl: null,
                    pvp: 0.95,
                    cap_rate: 9.1,
                    vacancia: 0,
                    liquidez_diaria: 3500000,
                    dividend_yield: 0.68
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'FII de logística com contratos atípicos e baixa vacância' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Real Estate (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Ativos de qualidade com contratos de longo prazo' }
                  },
                  description: 'FII de galpões logísticos com contratos atípicos de longo prazo.'
                },
                { 
                  symbol: 'KNCR11', 
                  quantity: 109, 
                  current_price: 105.08, 
                  result: 499.63, 
                  result_percent: 4.47,
                  cerrado_score: 8,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 13.5,
                    pl: null,
                    pvp: 1.02,
                    cap_rate: null,
                    vacancia: null,
                    liquidez_diaria: 2800000,
                    dividend_yield: 1.13
                  },
                  recommendation: {
                    cerrado: { status: 'COMPRAR', reason: 'FII de recebíveis com boa gestão e dividendos consistentes' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Real Estate (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren prefere ativos reais a recebíveis' }
                  },
                  description: 'FII de recebíveis imobiliários com foco em CRIs de alta qualidade.'
                },
                { 
                  symbol: 'VISC11', 
                  quantity: 40, 
                  current_price: 87.01, 
                  result: -13.97, 
                  result_percent: -0.32,
                  cerrado_score: 7,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 8.1,
                    pl: null,
                    pvp: 0.78,
                    cap_rate: 7.9,
                    vacancia: 4.2,
                    liquidez_diaria: 1900000,
                    dividend_yield: 0.68
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'FII de shopping centers com vacância moderada' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Real Estate (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Setor cíclico, mas com bons ativos' }
                  },
                  description: 'FII de shopping centers com portfólio diversificado pelo Brasil.'
                },
                { 
                  symbol: 'RZTR11', 
                  quantity: 69, 
                  current_price: 94.56, 
                  result: -175.15, 
                  result_percent: -2.68,
                  cerrado_score: 6,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 7.8,
                    pl: null,
                    pvp: 0.85,
                    cap_rate: 8.2,
                    vacancia: 5.7,
                    liquidez_diaria: 850000,
                    dividend_yield: 0.65
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'FII com vacância moderada e liquidez média' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Real Estate (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Ativos de qualidade média' }
                  },
                  description: 'FII com portfólio diversificado de imóveis corporativos.'
                },
                { 
                  symbol: 'HGCR11', 
                  quantity: 176, 
                  current_price: 102.58, 
                  result: -1457.21, 
                  result_percent: -8.07,
                  cerrado_score: 7,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 14.2,
                    pl: null,
                    pvp: 0.98,
                    cap_rate: null,
                    vacancia: null,
                    liquidez_diaria: 1200000,
                    dividend_yield: 1.18
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'FII de recebíveis com boa gestão, mas performance recente fraca' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Real Estate (25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren prefere ativos reais a recebíveis' }
                  },
                  description: 'FII de recebíveis imobiliários gerido pela CSHG.'
                },
                { 
                  symbol: 'CPTS11', 
                  quantity: 983, 
                  current_price: 7.59, 
                  result: -198.16, 
                  result_percent: -15.13,
                  cerrado_score: 5,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 12.5,
                    pl: null,
                    pvp: 0.72,
                    cap_rate: null,
                    vacancia: null,
                    liquidez_diaria: 3200000,
                    dividend_yield: 1.04
                  },
                  recommendation: {
                    cerrado: { status: 'VENDER', reason: 'FII de recebíveis com performance fraca e fundamentos deteriorados' },
                    arca: { status: 'NEUTRO', reason: 'Faz parte da cesta de Real Estate (25%), mas considerar substituição' },
                    buffett: { status: 'VENDER', reason: 'Qualidade dos ativos questionável' }
                  },
                  description: 'FII de recebíveis imobiliários com foco em CRIs diversificados.'
                },
                { 
                  symbol: 'PVBI11', 
                  quantity: 132, 
                  current_price: 75.87, 
                  result: -1954.64, 
                  result_percent: -16.31,
                  cerrado_score: 4,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 9.2,
                    pl: null,
                    pvp: 0.68,
                    cap_rate: 8.5,
                    vacancia: 12.3,
                    liquidez_diaria: 650000,
                    dividend_yield: 0.77
                  },
                  recommendation: {
                    cerrado: { status: 'VENDER', reason: 'FII com alta vacância e fundamentos fracos' },
                    arca: { status: 'NEUTRO', reason: 'Faz parte da cesta de Real Estate (25%), mas considerar substituição' },
                    buffett: { status: 'VENDER', reason: 'Ativos de baixa qualidade com problemas estruturais' }
                  },
                  description: 'FII de lajes corporativas com imóveis em diversas regiões.'
                },
                { 
                  symbol: 'TGAR11', 
                  quantity: 47, 
                  current_price: 87.00, 
                  result: -954.40, 
                  result_percent: -18.92,
                  cerrado_score: 3,
                  cerrado_max: 14,
                  fundamentals: {
                    dy: 7.5,
                    pl: null,
                    pvp: 0.65,
                    cap_rate: 7.8,
                    vacancia: 15.7,
                    liquidez_diaria: 420000,
                    dividend_yield: 0.63
                  },
                  recommendation: {
                    cerrado: { status: 'VENDER', reason: 'FII com alta vacância e fundamentos muito fracos' },
                    arca: { status: 'VENDER', reason: 'Substituir por outro FII com melhores fundamentos' },
                    buffett: { status: 'VENDER', reason: 'Ativos de baixa qualidade com problemas estruturais graves' }
                  },
                  description: 'FII com portfólio de imóveis corporativos e comerciais.'
                }
              ]
            },
            bitcoin: { 
              name: 'Ativos Internacionais', 
              value: 10881.16, 
              percentage: 2.8, 
              count: 1, 
              result: 0,
              assets: [
                { 
                  symbol: 'Bitcoin', 
                  quantity: 0.099912, 
                  current_price: 108908.16, 
                  result: 0, 
                  result_percent: -2.1,
                  cerrado_score: null,
                  cerrado_max: null,
                  fundamentals: {
                    dy: 0,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'Criptomoeda não se aplica à análise fundamentalista tradicional' },
                    arca: { status: 'COMPRAR', reason: 'Aumentar exposição à cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'VENDER', reason: 'Warren não acredita em criptomoedas como investimento' }
                  },
                  description: 'Criptomoeda descentralizada, a primeira e mais valiosa do mercado.'
                }
              ]
            },
            renda_fixa: { 
              name: 'Renda Fixa', 
              value: 161242.31, 
              percentage: 41.7, 
              count: 3, 
              result: 8536.14,
              assets: [
                { 
                  symbol: 'Renda Fixa Total', 
                  quantity: 1, 
                  current_price: 161242.31, 
                  result: 8536.14, 
                  result_percent: 19.32,
                  cerrado_score: null,
                  cerrado_max: null,
                  fundamentals: {
                    dy: null,
                    pl: null,
                    pvp: null,
                    roe: null,
                    roic: null,
                    margem_liquida: null,
                    div_liquida_ebitda: null
                  },
                  recommendation: {
                    cerrado: { status: 'NEUTRO', reason: 'Renda fixa não se aplica à análise fundamentalista de ações' },
                    arca: { status: 'REDUZIR', reason: 'Reduzir exposição à cesta de Caixa/Renda Fixa (acima dos 25%)' },
                    buffett: { status: 'NEUTRO', reason: 'Warren mantém caixa para oportunidades, mas prefere empresas' }
                  },
                  description: 'Conjunto de investimentos de renda fixa como CDBs, Tesouro Direto e outros.'
                }
              ]
            }
          }
        },
        market_indicators: {
          selic: 10.75,
          ipca: 4.23,
          ibovespa: {
            current: 145306,
            change_percent: 4.4
          },
          cdi: 10.65
        },
        last_update: new Date().toLocaleString('pt-BR')
      }
      
      setPortfolioData(data)
      setLastUpdate(new Date().toLocaleString('pt-BR'))
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      setLoading(false)
    }
  }

  // Navegação
  const goToCategory = (categoryKey) => {
    setSelectedCategory(categoryKey)
    setCurrentView('category')
  }

  const goToAsset = (asset) => {
    setSelectedAsset(asset)
    setCurrentView('asset')
  }

  const goBack = () => {
    if (currentView === 'asset') {
      setCurrentView('category')
      setSelectedAsset(null)
    } else if (currentView === 'category') {
      setCurrentView('overview')
      setSelectedCategory(null)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`
  }

  const getBorderColor = (resultPercent) => {
    if (resultPercent > 20) return 'border-l-4 border-l-green-500'
    if (resultPercent > 0) return 'border-l-4 border-l-green-300'
    if (resultPercent > -10) return 'border-l-4 border-l-yellow-500'
    return 'border-l-4 border-l-red-500'
  }

  const getRecommendation = (resultPercent) => {
    if (resultPercent > 20) return { status: 'MANTER', color: 'text-green-800', bgColor: 'bg-green-50', borderColor: 'border-green-200', icon: '🟢', description: `Excelente performance (+${resultPercent.toFixed(1)}%). Continue investindo.` }
    if (resultPercent > 0) return { status: 'MANTER', color: 'text-blue-800', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', icon: '🟡', description: `Performance positiva (+${resultPercent.toFixed(1)}%). Monitore evolução.` }
    if (resultPercent > -10) return { status: 'ATENÇÃO', color: 'text-yellow-800', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', icon: '⚠️', description: `Performance negativa (${resultPercent.toFixed(1)}%). Analise os fundamentos.` }
    return { status: 'CONSIDERAR VENDA', color: 'text-red-800', bgColor: 'bg-red-50', borderColor: 'border-red-200', icon: '🔴', description: `Performance muito negativa (${resultPercent.toFixed(1)}%). Considere substituir.` }
  }

  const getCerradoColor = (score, max) => {
    if (!score || !max) return 'bg-gray-200'
    const percent = (score / max) * 100
    if (percent >= 80) return 'bg-green-500'
    if (percent >= 60) return 'bg-green-300'
    if (percent >= 40) return 'bg-yellow-400'
    return 'bg-red-500'
  }

  const getFundamentalInfo = (key) => {
    switch(key) {
      case 'dy':
        return {
          name: 'Dividend Yield',
          description: 'Percentual de dividendos pagos em relação ao preço da ação.',
          calculation: 'Dividendos por ação ÷ Preço da ação × 100',
          importance: 'Indica quanto a empresa distribui de lucro aos acionistas. Valores acima de 6% são considerados altos.'
        }
      case 'pl':
        return {
          name: 'Preço/Lucro',
          description: 'Relação entre o preço da ação e o lucro por ação.',
          calculation: 'Preço da ação ÷ Lucro por ação',
          importance: 'Indica quantos anos seriam necessários para recuperar o investimento. Valores abaixo de 15 são geralmente considerados atrativos.'
        }
      case 'pvp':
        return {
          name: 'Preço/Valor Patrimonial',
          description: 'Relação entre o preço da ação e seu valor patrimonial.',
          calculation: 'Preço da ação ÷ Valor patrimonial por ação',
          importance: 'Indica se a ação está cara ou barata em relação ao patrimônio. Valores abaixo de 1 podem indicar ações subvalorizadas.'
        }
      case 'roe':
        return {
          name: 'Return on Equity',
          description: 'Retorno sobre o patrimônio líquido da empresa.',
          calculation: 'Lucro líquido ÷ Patrimônio líquido × 100',
          importance: 'Mede a eficiência da empresa em gerar lucro com seu patrimônio. Valores acima de 15% são considerados bons.'
        }
      case 'roic':
        return {
          name: 'Return on Invested Capital',
          description: 'Retorno sobre o capital investido.',
          calculation: 'NOPAT ÷ Capital investido × 100',
          importance: 'Mede a eficiência da empresa em gerar lucro com todo o capital investido. Valores acima de 10% são considerados bons.'
        }
      case 'margem_liquida':
        return {
          name: 'Margem Líquida',
          description: 'Percentual de lucro líquido em relação à receita.',
          calculation: 'Lucro líquido ÷ Receita líquida × 100',
          importance: 'Indica quanto da receita se converte em lucro. Valores acima de 10% são geralmente considerados bons.'
        }
      case 'div_liquida_ebitda':
        return {
          name: 'Dívida Líquida/EBITDA',
          description: 'Relação entre a dívida líquida e o EBITDA.',
          calculation: 'Dívida líquida ÷ EBITDA',
          importance: 'Indica quantos anos de geração de caixa seriam necessários para pagar a dívida. Valores abaixo de 3 são considerados saudáveis.'
        }
      case 'cap_rate':
        return {
          name: 'Cap Rate',
          description: 'Taxa de capitalização do imóvel.',
          calculation: 'Receita operacional líquida anual ÷ Valor do imóvel × 100',
          importance: 'Indica o retorno anual do imóvel. Valores acima de 8% são geralmente considerados atrativos.'
        }
      case 'vacancia':
        return {
          name: 'Vacância',
          description: 'Percentual de área vaga nos imóveis do FII.',
          calculation: 'Área vaga ÷ Área total × 100',
          importance: 'Indica quanto da área total não está gerando receita. Valores abaixo de 5% são considerados bons.'
        }
      case 'liquidez_diaria':
        return {
          name: 'Liquidez Diária',
          description: 'Volume financeiro médio negociado por dia.',
          calculation: 'Soma do volume financeiro ÷ Número de dias',
          importance: 'Indica a facilidade de comprar ou vender o ativo. Valores acima de R$ 1 milhão são considerados bons.'
        }
      case 'dividend_yield':
        return {
          name: 'Dividend Yield Mensal',
          description: 'Percentual de dividendos mensais em relação ao preço da cota.',
          calculation: 'Dividendo mensal ÷ Preço da cota × 100',
          importance: 'Indica o retorno mensal do FII. Valores acima de 0,8% ao mês são considerados atrativos.'
        }
      default:
        return {
          name: key,
          description: 'Indicador fundamentalista',
          calculation: 'Varia conforme o indicador',
          importance: 'Importante para análise fundamentalista'
        }
    }
  }

  // Função para calcular score dos indicadores (positivos/negativos)
  const getIndicatorScore = (key, value, type) => {
    if (value === null || value === undefined) return 0;
    
    // Definir parâmetros ideais para cada indicador
    const idealRanges = {
      dy: { good: [6, 15], bad: [0, 3] },
      pl: { good: [5, 15], bad: [25, 100] },
      pvp: { good: [0.5, 1.5], bad: [3, 10] },
      roe: { good: [15, 30], bad: [0, 8] },
      roic: { good: [10, 25], bad: [0, 5] },
      margem_liquida: { good: [10, 30], bad: [0, 5] },
      div_liquida_ebitda: { good: [0, 2], bad: [4, 10] },
      cap_rate: { good: [8, 12], bad: [0, 5] },
      vacancia: { good: [0, 5], bad: [15, 30] },
      liquidez_diaria: { good: [1000000, 10000000], bad: [0, 100000] },
      dividend_yield: { good: [0.8, 2], bad: [0, 0.3] }
    };
    
    const range = idealRanges[key];
    if (!range) return 0;
    
    if (type === 'positive') {
      // Para indicadores positivos, quanto mais próximo do ideal, melhor
      if (value >= range.good[0] && value <= range.good[1]) return 100;
      if (value > range.good[1]) return 80; // Muito alto pode ser ruim para alguns
      if (value < range.good[0] && value > range.bad[1]) return 60;
      return 20;
    } else {
      // Para indicadores negativos, invertemos a lógica
      if (value >= range.bad[0] && value <= range.bad[1]) return 100;
      if (value > range.bad[1]) return 80;
      if (value < range.bad[0] && value > range.good[1]) return 60;
      return 20;
    }
  }

  // Função para calcular recomendação ponderada
  const getWeightedRecommendation = (asset) => {
    const weights = {
      buffett: 0.4,  // 40%
      cerrado: 0.3,  // 30%
      arca: 0.2      // 20%
    };
    
    const scores = {
      COMPRAR: 3,
      MANTER: 2,
      NEUTRO: 2,
      VENDER: 1
    };
    
    const weightedScore = 
      (scores[asset.recommendation.buffett?.status] || 2) * weights.buffett +
      (scores[asset.recommendation.cerrado?.status] || 2) * weights.cerrado +
      (scores[asset.recommendation.arca?.status] || 2) * weights.arca;
    
    if (weightedScore >= 2.5) return 'COMPRAR';
    if (weightedScore >= 1.8) return 'MANTER';
    return 'VENDER';
  };

  // Função para análise temporal das metodologias
  const getTemporalAnalysis = (asset, methodology, period) => {
    // Simulação de análise temporal baseada nos fundamentos atuais
    // Em uma implementação real, isso viria de dados históricos
    
    const currentRecommendation = asset.recommendation[methodology]?.status || 'MANTER';
    
    // Lógica simplificada baseada no período e performance
    const performanceFactors = {
      '1m': asset.result_percent > 5 ? 1.1 : asset.result_percent < -5 ? 0.9 : 1.0,
      '3m': asset.result_percent > 15 ? 1.2 : asset.result_percent < -10 ? 0.8 : 1.0,
      '6m': asset.result_percent > 25 ? 1.3 : asset.result_percent < -15 ? 0.7 : 1.0
    };
    
    const factor = performanceFactors[period] || 1.0;
    
    // Ajustar recomendação baseada no período
    if (methodology === 'buffett') {
      // Warren Buffett foca no longo prazo
      if (period === '6m') return currentRecommendation;
      if (period === '3m' && currentRecommendation === 'COMPRAR') return 'COMPRAR';
      if (period === '1m') return factor > 1.1 ? 'MANTER' : currentRecommendation;
    }
    
    if (methodology === 'cerrado') {
      // Diagrama do Cerrado é mais técnico
      if (factor > 1.1) return 'COMPRAR';
      if (factor < 0.9) return 'VENDER';
      return currentRecommendation;
    }
    
    if (methodology === 'arca') {
      // ARCA foca no rebalanceamento
      return 'MANTER'; // Sempre manter para rebalanceamento
    }
    
    return currentRecommendation;
  };

  // Função para lidar com mensagens do chat
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isTyping) return;
    
    // NOVO: Detectar comandos de operação no texto
    const operationCommand = detectOperationCommand(chatInput);
    if (operationCommand) {
      const userMessage = {
        sender: 'user',
        text: chatInput,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput('');
      
      // Processar comando de operação
      handleOperationCommand(operationCommand);
      return;
    }
    
    const userMessage = {
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Simular delay de processamento
    setTimeout(() => {
      const response = generateIntelligentResponse(chatInput, portfolioData);
      const assistantMessage = {
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Função para análise de realização de lucros (NOVO)
  const generateProfitRealizationResponse = (question, data) => {
    // Identificar ativos com ganho superior a 50%
    const allAssets = getAllAssets(data.portfolio_allocation.allocation);
    const profitCandidates = allAssets.filter(asset => asset.result_percent > 50);
    
    // Verificar se a pergunta menciona um ativo específico
    const mentionedAsset = allAssets.find(asset => 
      question.includes(asset.symbol.toLowerCase())
    );
    
    if (mentionedAsset && mentionedAsset.result_percent > 50) {
      // Análise específica para o ativo mencionado
      const currentValue = mentionedAsset.quantity * mentionedAsset.current_price;
      const sellQuantity = Math.floor(mentionedAsset.quantity * 0.5);
      const sellValue = sellQuantity * mentionedAsset.current_price;
      const remainingQuantity = mentionedAsset.quantity - sellQuantity;
      
      // Calcular realocação baseada na estratégia ARCA
      const fiisAllocation = sellValue * 0.60;
      const internationalAllocation = sellValue * 0.30;
      const fixedIncomeAllocation = sellValue * 0.10;
      
      return `💰 **Realização de Lucro - ${mentionedAsset.symbol}**

📊 **1. Valor de Mercado da Posição:**
• Cotação atual: R$ ${mentionedAsset.current_price.toFixed(2)}
• Quantidade: ${mentionedAsset.quantity} cotas
• Valor total: R$ ${currentValue.toFixed(2)}
• Ganho acumulado: +${mentionedAsset.result_percent.toFixed(1)}% 🚀

⚖️ **2. Realização Parcial (50%):**
• Vender: ${sellQuantity} cotas
• Valor a realizar: R$ ${sellValue.toFixed(2)}
• Posição remanescente: ${remainingQuantity} cotas

🎯 **3. Realocação (Estratégia ARCA):**
• **FIIs (60%)**: R$ ${fiisAllocation.toFixed(2)} → HGLG11, VISC11, BTLG11
• **Internacional (30%)**: R$ ${internationalAllocation.toFixed(2)} → IVVB11, QBTC11
• **Renda Fixa (10%)**: R$ ${fixedIncomeAllocation.toFixed(2)} → CDB 101% CDI

📋 **4. Resumo da Operação:**
✅ Cristalizar R$ ${sellValue.toFixed(2)} em lucros
✅ Rebalancear carteira seguindo ARCA
✅ Reduzir concentração em ${mentionedAsset.symbol}
✅ Manter exposição parcial para futuras valorizações

💡 **Justificativa:** Com ganho de ${mentionedAsset.result_percent.toFixed(1)}%, é prudente realizar lucros parciais e diversificar o risco.`;
    }
    
    if (profitCandidates.length > 0) {
      // Análise geral dos candidatos
      let response = `💰 **Candidatos para Realização de Lucro (>50%):**\n\n`;
      
      profitCandidates.slice(0, 3).forEach((asset, index) => {
        const currentValue = asset.quantity * asset.current_price;
        response += `${index + 1}. **${asset.symbol}** - Ganho: ${asset.result_percent.toFixed(1)}% - Valor: R$ ${currentValue.toFixed(2)}\n`;
      });
      
      response += `\n🎯 **Recomendação:** Considere realizar 50% dos lucros do melhor performer (${profitCandidates[0].symbol}) e realocar seguindo a estratégia ARCA.`;
      
      return response;
    }
    
    return `📊 **Análise de Realização de Lucros:**

Atualmente, nenhum ativo da sua carteira apresenta ganho superior a 50%.

**Ativos com melhor performance:**
${allAssets.slice(0, 3).map((asset, index) => 
  `${index + 1}. ${asset.symbol}: ${asset.result_percent > 0 ? '+' : ''}${asset.result_percent.toFixed(1)}%`
).join('\n')}

💡 **Estratégia:** Mantenha as posições atuais e considere realizar lucros quando algum ativo atingir +50% de ganho.`;
  };

  // Função para gerar respostas inteligentes baseadas nos dados (MELHORADA)
  const generateIntelligentResponse = (question, data) => {
    const lowerQuestion = question.toLowerCase();
    
    // NOVO: Verificar contexto de operações recentes
    const recentOperations = operationHistory.slice(-3); // Últimas 3 operações
    const hasRecentOperations = recentOperations.length > 0;
    
    // NOVO: Análise de realização de lucro
    if (lowerQuestion.includes('realizar lucro') || lowerQuestion.includes('vender') || lowerQuestion.includes('lucro')) {
      return generateProfitRealizationResponse(lowerQuestion, data);
    }
    
    // NOVO: Análise contextual baseada em operações
    if (hasRecentOperations && (lowerQuestion.includes('como') || lowerQuestion.includes('análise') || lowerQuestion.includes('carteira'))) {
      const contextualAnalysis = generateContextualAnalysis(recentOperations, data);
      if (contextualAnalysis) return contextualAnalysis;
    }
    
    // NOVO: Análise de estratégias completa
    if (lowerQuestion.includes('estratégia') || lowerQuestion.includes('análise completa') || lowerQuestion.includes('score')) {
      const strategyAnalysis = performCompleteStrategyAnalysis(data, recentOperations);
      const recommendations = generateStrategicRecommendations(strategyAnalysis);
      
      let analysisResponse = `🎯 **Análise Completa de Estratégias:**\n\n`;
      
      // Score geral
      analysisResponse += `📊 **Score Geral**: ${strategyAnalysis.overallScore.toFixed(0)}/100\n\n`;
      
      // Análise ARCA
      if (strategyAnalysis.arca) {
        analysisResponse += `🏛️ **ARCA**: ${strategyAnalysis.arca.score.toFixed(0)}/100 (${strategyAnalysis.arca.status})\n`;
        analysisResponse += `• Desvio total: ${strategyAnalysis.arca.totalDeviation.toFixed(1)}%\n\n`;
      }
      
      // Análise Bola de Neve
      if (strategyAnalysis.snowball) {
        analysisResponse += `❄️ **Bola de Neve**: ${strategyAnalysis.snowball.score.toFixed(0)}/100\n`;
        analysisResponse += `• Renda atual: R$ ${strategyAnalysis.snowball.currentMonthlyIncome.toFixed(0)}/mês\n`;
        if (strategyAnalysis.snowball.nextTarget) {
          analysisResponse += `• Próxima meta: ${strategyAnalysis.snowball.nextTarget.description}\n`;
          analysisResponse += `• Faltam: R$ ${formatCurrency(strategyAnalysis.snowball.neededInvestment)} para investir\n\n`;
        }
      }
      
      // Análise Setorial
      if (strategyAnalysis.sectorDiversification) {
        analysisResponse += `🏭 **Diversificação**: ${strategyAnalysis.sectorDiversification.score.toFixed(0)}/100 (Risco ${strategyAnalysis.sectorDiversification.riskLevel})\n`;
        if (strategyAnalysis.sectorDiversification.concentrations.length > 0) {
          analysisResponse += `• Concentrações detectadas: ${strategyAnalysis.sectorDiversification.concentrations.length}\n\n`;
        }
      }
      
      // Recomendações prioritárias
      if (recommendations.length > 0) {
        analysisResponse += `💡 **Recomendações Prioritárias:**\n`;
        recommendations.slice(0, 3).forEach((rec, index) => {
          analysisResponse += `${index + 1}. **${rec.title}** (${rec.priority})\n`;
          analysisResponse += `   ${rec.description}\n`;
        });
      }
      
      return analysisResponse;
    }
    
    // MELHORADO: Análise ARCA com contexto de operações
    if (lowerQuestion.includes('rebalance') || lowerQuestion.includes('arca')) {
      const { allocation, total_value } = data.portfolio_allocation;
      
      let arcaAnalysis = `📊 **Análise ARCA da sua carteira:**
      
• **Ações**: ${allocation.renda_variavel.percentage.toFixed(1)}% (Meta: 25%)
• **FIIs**: ${allocation.fiis.percentage.toFixed(1)}% (Meta: 25%)
• **Internacional**: ${allocation.bitcoin.percentage.toFixed(1)}% (Meta: 25%)
• **Renda Fixa**: ${allocation.renda_fixa.percentage.toFixed(1)}% (Meta: 25%)

**Recomendação**: ${allocation.fiis.percentage < 25 ? `Aumente FIIs em ${formatCurrency((25 - allocation.fiis.percentage) * total_value / 100)}` : 'Carteira bem balanceada nos FIIs'}.`;

      // NOVO: Adicionar contexto de operações recentes
      if (hasRecentOperations) {
        const recentFIIOperations = recentOperations.filter(op => 
          ['BTLG11', 'HGLG11', 'VILG11', 'TGAR11'].includes(op.asset)
        );
        
        if (recentFIIOperations.length > 0) {
          arcaAnalysis += `\n\n🔄 **Operações Recentes Detectadas:**\n`;
          recentFIIOperations.forEach(op => {
            arcaAnalysis += `• ${op.type === 'buy' ? 'Comprou' : 'Vendeu'} ${op.asset}: ${op.quantity} cotas\n`;
          });
          arcaAnalysis += `\n✅ Suas operações estão alinhadas com a estratégia ARCA de concentração em FIIs!`;
        }
      }
      
      return arcaAnalysis;
    }
    
    if (lowerQuestion.includes('qbtc') || lowerQuestion.includes('bitcoin')) {
      return `₿ **Análise do QBTC11:**
      
• **Performance**: +83.11% (melhor ativo da carteira)
• **Estratégia Warren Buffett**: COMPRAR - Bitcoin como reserva de valor
• **Recomendação**: Considere realizar lucros parciais acima de 80% de ganho
• **Bola de Neve**: Para R$ 100/mês, você precisaria de ~47 cotas (R$ 1.669)`;
    }
    
    // MELHORADO: Renda passiva com contexto de operações
    if (lowerQuestion.includes('renda passiva') || lowerQuestion.includes('dividendo')) {
      let passiveIncomeAnalysis = `💰 **Estratégia de Renda Passiva:**
      
• **Atual**: Seus FIIs geram ~R$ ${(data.portfolio_allocation.allocation.fiis.value * 0.007).toFixed(0)}/mês
• **Meta R$ 1.000/mês**: Precisa de ~R$ 142.857 em FIIs (DY 0.7%)
• **Próximos passos**: Foque em BTLG11, VILG11 (logística) e HGLG11 (híbrido)
• **Bola de Neve**: Reinvista todos os dividendos para acelerar o crescimento`;

      // NOVO: Contexto baseado em operações recentes
      if (hasRecentOperations) {
        const fiiBuys = recentOperations.filter(op => 
          op.type === 'buy' && ['BTLG11', 'HGLG11', 'VILG11'].includes(op.asset)
        );
        
        if (fiiBuys.length > 0) {
          const totalInvested = fiiBuys.reduce((sum, op) => sum + op.totalValue, 0);
          const estimatedMonthlyIncome = totalInvested * 0.007; // 0.7% DY mensal
          
          passiveIncomeAnalysis += `\n\n🎯 **Impacto das Suas Operações Recentes:**
• Investiu R$ ${formatCurrency(totalInvested)} em FIIs de logística
• Renda passiva adicional estimada: +R$ ${estimatedMonthlyIncome.toFixed(0)}/mês
• Você está no caminho certo para aumentar sua renda passiva!`;
        }
      }
      
      return passiveIncomeAnalysis;
    }
    
    // MELHORADO: Warren Buffett com análise da carteira atual
    if (lowerQuestion.includes('warren') || lowerQuestion.includes('buffett')) {
      let buffettAnalysis = `🧠 **Estratégia Warren Buffett aplicada:**
      
• **Foco**: Empresas com vantagem competitiva (CPLE6, VIVT3)
• **Setores Perenes**: Energia elétrica e telecomunicações
• **Longo Prazo**: Mantenha por 10+ anos
• **Reinvestimento**: Use dividendos para comprar mais ações
• **Peso na carteira**: 40% das recomendações (maior peso)`;

      // NOVO: Análise específica dos ativos do usuário
      const buffettAssets = getAllAssets(data.portfolio_allocation.allocation)
        .filter(asset => asset.recommendation?.buffett?.status === 'COMPRAR')
        .slice(0, 3);
        
      if (buffettAssets.length > 0) {
        buffettAnalysis += `\n\n📈 **Seus Ativos Alinhados com Buffett:**\n`;
        buffettAssets.forEach(asset => {
          buffettAnalysis += `• **${asset.symbol}**: ${asset.recommendation.buffett.reason}\n`;
        });
      }
      
      // NOVO: Contexto de operações recentes
      if (hasRecentOperations) {
        const buffettOperations = recentOperations.filter(op => 
          buffettAssets.some(asset => asset.symbol === op.asset)
        );
        
        if (buffettOperations.length > 0) {
          buffettAnalysis += `\n✅ **Operações Recentes Alinhadas**: Você está seguindo a estratégia Buffett!`;
        }
      }
      
      return buffettAnalysis;
    }
    
    // Detectar comandos de operação primeiro
    const tradeCommand = processTradeCommand(question);
    if (tradeCommand) {
      return handleTradeCommand(tradeCommand);
    }
    
    if (lowerQuestion.includes('tgar11') || lowerQuestion.includes('substituir') || lowerQuestion.includes('fii')) {
      const suggestions = getAutomaticSuggestions('TGAR11', 'FII');
      
      let response = `🏢 **Análise TGAR11 e Substituição Automática:**

**TGAR11 (-18.92%)**: Performance negativa, recomendação de VENDA confirmada.

**🎯 Top 5 FIIs para substituição (Filtros Prioritários):**

`;
      
      suggestions.forEach((asset, index) => {
        response += `${index + 1}. **${asset.symbol}** - Score: ${asset.totalScore.toFixed(1)}/100
   • Prioridade: ${asset.priority}
   • ${asset.reasons}
   • Preço: R$ ${asset.current_price?.toFixed(2) || 'N/A'}
   • **Recomendação**: ${asset.recommendation?.weighted?.status || 'ANALISAR'}

`;
      });
      
      response += `**💡 Comando para executar:**
Digite: "Vendi 100 cotas TGAR11, comprei 50 ${suggestions[0]?.symbol}, 30 ${suggestions[1]?.symbol}, 20 ${suggestions[2]?.symbol}"

**🤖 Sistema atualizará automaticamente sua carteira!**`;
      
      return response;
    }
    
    if (lowerQuestion.includes('comprar') || lowerQuestion.includes('ativo')) {
      const topRecommendations = getAllAssets(data.portfolio_allocation.allocation)
        .filter(asset => asset.recommendation?.buffett?.status === 'COMPRAR')
        .slice(0, 3);
        
      return `🎯 **Melhores oportunidades de compra:**
      
${topRecommendations.map((asset, i) => 
        `${i + 1}. **${asset.symbol}**: ${asset.recommendation.buffett.reason}`
      ).join('\n')}
      
**Estratégia**: Diversifique entre os 3 com foco no Warren Buffett (maior peso).`;
    }
    
    // Resposta padrão inteligente
    return `🤖 Entendi sua pergunta sobre "${question}". 

Com base na sua carteira de R$ ${formatCurrency(data.portfolio_allocation.total_value)}, posso ajudar com:

• **Rebalanceamento ARCA** - análise da distribuição
• **Análise de ativos específicos** - fundamentos e recomendações  
• **Estratégias de renda passiva** - cálculos da bola de neve
• **Metodologias** - Warren Buffett, Cerrado, ARCA

Pode reformular sua pergunta ou escolher um dos tópicos acima?`;
  };

  // ===== NOVAS FUNÇÕES DE RECONHECIMENTO DE OPERAÇÕES (MÓDULO IA) =====
  
  // Função para detectar comandos de operação no texto
  const detectOperationCommand = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Padrões de comando
    const buyPattern = /comprei|compra|adicionei|aumentei/;
    const sellPattern = /vendi|venda|realizei|diminui/;
    const assetPattern = /([a-z]{4}11|[a-z]{4}3|[a-z]{4}4)/gi;
    const quantityPattern = /(\d+)\s*(cotas?|ações?)/i;
    const valuePattern = /r\$?\s*(\d+(?:\.\d{3})*(?:,\d{2})?)/i;
    
    if (buyPattern.test(lowerMessage) || sellPattern.test(lowerMessage)) {
      const type = buyPattern.test(lowerMessage) ? 'buy' : 'sell';
      const assets = lowerMessage.match(assetPattern);
      const quantities = lowerMessage.match(quantityPattern);
      const values = lowerMessage.match(valuePattern);
      
      if (assets && assets.length > 0) {
        return {
          type,
          asset: assets[0].toUpperCase(),
          quantity: quantities ? parseInt(quantities[1]) : null,
          value: values ? parseFloat(values[1].replace(/\./g, '').replace(',', '.')) : null,
          detected: true
        };
      }
    }
    
    return null;
  };

  // Função para processar comandos de operação detectados
  const handleOperationCommand = (operationCommand) => {
    const operation = {
      id: Date.now(),
      timestamp: new Date(),
      asset: operationCommand.asset,
      type: operationCommand.type,
      quantity: operationCommand.quantity,
      totalValue: operationCommand.value,
      price: operationCommand.value && operationCommand.quantity ? 
             operationCommand.value / operationCommand.quantity : null,
      status: 'detected',
      source: 'text'
    };
    
    setDetectedOperations(prev => [...prev, operation]);
    
    // Resposta do assistente
    const assistantMessage = {
      sender: 'assistant',
      text: `📝 **Operação Detectada via Texto!**
      
• **Ativo**: ${operation.asset}
• **Tipo**: ${operation.type === 'buy' ? 'Compra' : 'Venda'}
${operation.quantity ? `• **Quantidade**: ${operation.quantity} cotas` : ''}
${operation.totalValue ? `• **Valor Total**: ${formatCurrency(operation.totalValue)}` : ''}
${operation.price ? `• **Preço Médio**: ${formatCurrency(operation.price)}` : ''}

Deseja confirmar e atualizar sua carteira?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      operationId: operation.id,
      requiresConfirmation: true
    };
    
    setChatMessages(prev => [...prev, assistantMessage]);
  };

  // Função para processar imagens de operações
  const processOperationImage = async (imageFile) => {
    setProcessingOperation(true);
    
    try {
      // Simular OCR/análise de imagem
      const mockOperationData = await simulateImageOCR(imageFile);
      
      if (mockOperationData) {
        const operation = {
          id: Date.now(),
          timestamp: new Date(),
          ...mockOperationData,
          status: 'detected',
          source: 'image'
        };
        
        setDetectedOperations(prev => [...prev, operation]);
        
        // Adicionar mensagem do assistente
        const assistantMessage = {
          sender: 'assistant',
          text: `📸 **Operação Detectada na Imagem!**
          
• **Ativo**: ${operation.asset}
• **Tipo**: ${operation.type === 'buy' ? 'Compra' : 'Venda'}
• **Quantidade**: ${operation.quantity} cotas
• **Preço**: ${formatCurrency(operation.price)}
• **Valor Total**: ${formatCurrency(operation.totalValue)}
• **Horário**: ${operation.time}

Deseja confirmar e atualizar sua carteira?`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          operationId: operation.id,
          requiresConfirmation: true
        };
        
        setChatMessages(prev => [...prev, assistantMessage]);
      }
      
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      
      const errorMessage = {
        sender: 'assistant',
        text: '❌ Não consegui processar esta imagem. Certifique-se de que é um print de operação da corretora.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setProcessingOperation(false);
    }
  };

  // Simulação de OCR (temporária)
  const simulateImageOCR = async (imageFile) => {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Baseado nas operações reais identificadas
    const knownOperations = [
      {
        asset: 'BTLG11',
        type: 'buy',
        quantity: 26,
        price: 103.42,
        totalValue: 2690.06,
        time: '16:23'
      },
      {
        asset: 'HGLG11', 
        type: 'buy',
        quantity: 20,
        price: 160.82,
        totalValue: 3217.79,
        time: '16:20'
      },
      {
        asset: 'VILG11',
        type: 'buy', 
        quantity: 21,
        price: 87.91,
        totalValue: 1847.44,
        time: '16:19'
      },
      {
        asset: 'TGAR11',
        type: 'sell',
        quantity: 47,
        price: 86.95,
        totalValue: 4086.65,
        time: '16:13'
      }
    ];
    
    // Retornar uma operação aleatória para simulação
    const randomOperation = knownOperations[Math.floor(Math.random() * knownOperations.length)];
    return randomOperation;
  };

  // Função para confirmar operação (MELHORADA COM ANÁLISE DE RENTABILIDADE)
  const confirmOperation = (operationId) => {
    const operation = detectedOperations.find(op => op.id === operationId);
    if (!operation) return;
    
    // NOVO: Realizar análise completa de rentabilidade ANTES da atualização
    const profitabilityAnalysis = performCompleteProfitabilityAnalysis(operation, portfolioData);
    
    // Atualizar carteira local
    updateLocalPortfolio(operation);
    
    // Marcar operação como confirmada
    setDetectedOperations(prev => 
      prev.map(op => 
        op.id === operationId 
          ? { ...op, status: 'confirmed' }
          : op
      )
    );
    
    // Adicionar ao histórico
    setOperationHistory(prev => [...prev, { ...operation, status: 'confirmed' }]);
    
    // NOVO: Resposta do assistente com análise de rentabilidade
    let confirmMessage = `✅ **Carteira Atualizada com Análise Completa!**
    
• ${operation.asset}: ${operation.type === 'buy' ? '+' : '-'}${operation.quantity} cotas
• Patrimônio ${operation.type === 'buy' ? 'aumentou' : 'diminuiu'} em ${formatCurrency(operation.totalValue)}
• Nova posição calculada automaticamente

${generateOperationAnalysis(operation)}`;

    // NOVO: Adicionar análise de rentabilidade se disponível
    if (profitabilityAnalysis?.assetProfitability) {
      const prof = profitabilityAnalysis.assetProfitability;
      
      confirmMessage += `\n\n📊 **Análise de Rentabilidade:**`;
      
      if (operation.type === 'buy') {
        confirmMessage += `\n• Preço médio: ${formatCurrency(prof.beforeOperation.avgPrice)} → ${formatCurrency(prof.afterOperation.avgPrice)}`;
        confirmMessage += `\n• Rentabilidade: ${prof.beforeOperation.percentage.toFixed(2)}% → ${prof.afterOperation.percentage.toFixed(2)}%`;
        confirmMessage += `\n• Impacto: ${prof.impact.percentageChange > 0 ? '+' : ''}${prof.impact.percentageChange.toFixed(2)}% na rentabilidade`;
      } else {
        confirmMessage += `\n• Ganho realizado: ${formatCurrency(prof.impact.realizedGain)}`;
        confirmMessage += `\n• Rentabilidade realizada: ${prof.impact.percentageRealized.toFixed(2)}%`;
        if (prof.afterOperation.quantity > 0) {
          confirmMessage += `\n• Posição restante: ${prof.afterOperation.quantity} cotas`;
        } else {
          confirmMessage += `\n• Posição zerada completamente`;
        }
      }
    }
    
    // NOVO: Adicionar análise de dividend yield se disponível
    if (profitabilityAnalysis?.dividendYieldImpact) {
      const dy = profitabilityAnalysis.dividendYieldImpact;
      
      confirmMessage += `\n\n💰 **Impacto na Renda Passiva:**`;
      confirmMessage += `\n• DY do ativo: ${dy.assetDividendYield}% ao mês`;
      confirmMessage += `\n• Renda mensal ${operation.type === 'buy' ? 'adicional' : 'reduzida'}: ${formatCurrency(Math.abs(dy.impact.monthlyDividendChange))}`;
      confirmMessage += `\n• Renda anual ${operation.type === 'buy' ? 'adicional' : 'reduzida'}: ${formatCurrency(Math.abs(dy.impact.annualDividendChange))}`;
    }
    
    const assistantMessage = {
      sender: 'assistant',
      text: confirmMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, assistantMessage]);
  };

  // Função para atualizar carteira local
  const updateLocalPortfolio = (operation) => {
    if (!portfolioData) return;
    
    const updatedData = { ...portfolioData };
    
    // Encontrar o ativo na carteira
    let assetFound = false;
    
    // Procurar em todas as categorias
    Object.keys(updatedData.portfolio_allocation.allocation).forEach(category => {
      const assets = updatedData.portfolio_allocation.allocation[category].assets;
      
      const assetIndex = assets.findIndex(asset => asset.symbol === operation.asset);
      
      if (assetIndex !== -1) {
        assetFound = true;
        const currentAsset = assets[assetIndex];
        
        if (operation.type === 'buy') {
          // Compra: aumentar quantidade
          const newQuantity = currentAsset.quantity + operation.quantity;
          const newTotalValue = currentAsset.total_value + operation.totalValue;
          const newAvgPrice = newTotalValue / newQuantity;
          
          assets[assetIndex] = {
            ...currentAsset,
            quantity: newQuantity,
            avg_price: newAvgPrice,
            total_value: newTotalValue,
            current_price: operation.price // Atualizar preço atual
          };
        } else {
          // Venda: diminuir quantidade
          const newQuantity = Math.max(0, currentAsset.quantity - operation.quantity);
          
          if (newQuantity === 0) {
            // Remover ativo se quantidade chegou a zero
            assets.splice(assetIndex, 1);
          } else {
            const newTotalValue = newQuantity * currentAsset.avg_price;
            
            assets[assetIndex] = {
              ...currentAsset,
              quantity: newQuantity,
              total_value: newTotalValue
            };
          }
        }
      }
    });
    
    // Se ativo não foi encontrado e é uma compra, adicionar novo ativo
    if (!assetFound && operation.type === 'buy') {
      // Determinar categoria baseada no ativo
      const category = determineAssetCategory(operation.asset);
      
      if (category && updatedData.portfolio_allocation.allocation[category]) {
        const newAsset = {
          symbol: operation.asset,
          name: getAssetName(operation.asset),
          quantity: operation.quantity,
          avg_price: operation.price,
          current_price: operation.price,
          total_value: operation.totalValue,
          result: 0,
          percentage: 0 // Será recalculado
        };
        
        updatedData.portfolio_allocation.allocation[category].assets.push(newAsset);
      }
    }
    
    // Recalcular totais e percentuais
    recalculatePortfolioTotals(updatedData);
    
    // Atualizar estado
    setPortfolioData(updatedData);
    setLocalPortfolio(updatedData);
  };

  // Função para análise de operação
  const generateOperationAnalysis = (operation) => {
    const analyses = [];
    
    // Análise baseada no tipo de operação
    if (operation.type === 'sell') {
      if (operation.asset === 'TGAR11') {
        analyses.push('🎯 **Estratégia Inteligente**: Vendeu o ativo com pior performance (-18.92%)');
      }
      analyses.push('💰 **Realização**: Liberou capital para novas oportunidades');
    } else {
      if (['BTLG11', 'HGLG11', 'VILG11'].includes(operation.asset)) {
        analyses.push('📦 **Foco Logística**: Concentrando em FIIs de galpões logísticos');
      }
      analyses.push('📈 **Crescimento**: Aumentando posição em ativo estratégico');
    }
    
    // Análise de timing
    const hour = parseInt(operation.time?.split(':')[0] || '16');
    if (hour >= 16) {
      analyses.push('⏰ **Timing**: Operação no final do pregão, boa estratégia');
    }
    
    return analyses.length > 0 ? '\n' + analyses.join('\n') : '';
  };

  // Funções auxiliares
  const determineAssetCategory = (symbol) => {
    if (symbol.includes('11')) return 'fiis'; // FIIs terminam em 11
    if (symbol.includes('BTC') || symbol === 'QBTC11') return 'bitcoin';
    if (symbol.includes('3') || symbol.includes('4')) return 'renda_variavel'; // Ações
    return 'renda_fixa'; // Default
  };

  const getAssetName = (symbol) => {
    const names = {
      'BTLG11': 'BTG Pactual Logística',
      'HGLG11': 'Patria Log FII', 
      'VILG11': 'Vinci Logística',
      'TGAR11': 'FII TG Ativo Real',
      'QBTC11': 'QR Bitcoin'
    };
    return names[symbol] || symbol;
  };

  const recalculatePortfolioTotals = (data) => {
    let totalValue = 0;
    
    // Calcular valor total
    Object.keys(data.portfolio_allocation.allocation).forEach(category => {
      const categoryData = data.portfolio_allocation.allocation[category];
      let categoryValue = 0;
      
      categoryData.assets.forEach(asset => {
        categoryValue += asset.total_value;
      });
      
      categoryData.value = categoryValue;
      totalValue += categoryValue;
    });
    
    // Atualizar percentuais
    Object.keys(data.portfolio_allocation.allocation).forEach(category => {
      const categoryData = data.portfolio_allocation.allocation[category];
      categoryData.percentage = totalValue > 0 ? (categoryData.value / totalValue) * 100 : 0;
      
      // Atualizar percentuais dos ativos
      categoryData.assets.forEach(asset => {
        asset.percentage = totalValue > 0 ? (asset.total_value / totalValue) * 100 : 0;
      });
    });
    
    data.portfolio_allocation.total_value = totalValue;
  };

  // Handler de upload de imagem
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        processOperationImage(file);
        
        // Adicionar mensagem de processamento
        const processingMessage = {
          sender: 'assistant',
          text: '🔄 Processando imagem da operação...',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatMessages(prev => [...prev, processingMessage]);
      }
    });
  };

  // Função para análise contextual baseada em operações recentes
  const generateContextualAnalysis = (recentOperations, data) => {
    if (!recentOperations || recentOperations.length === 0) return null;
    
    // Análise de padrões nas operações
    const buyOperations = recentOperations.filter(op => op.type === 'buy');
    const sellOperations = recentOperations.filter(op => op.type === 'sell');
    
    let analysis = `🔍 **Análise Contextual da Sua Estratégia:**\n\n`;
    
    // Análise de vendas
    if (sellOperations.length > 0) {
      analysis += `📉 **Realizações Identificadas:**\n`;
      sellOperations.forEach(op => {
        analysis += `• Vendeu ${op.asset}: ${op.quantity} cotas por ${formatCurrency(op.totalValue)}\n`;
        
        if (op.asset === 'TGAR11') {
          analysis += `  ✅ Excelente decisão! TGAR11 estava com -18.92% de performance\n`;
        }
      });
      analysis += `\n`;
    }
    
    // Análise de compras
    if (buyOperations.length > 0) {
      analysis += `📈 **Novas Posições:**\n`;
      buyOperations.forEach(op => {
        analysis += `• Comprou ${op.asset}: ${op.quantity} cotas por ${formatCurrency(op.totalValue)}\n`;
      });
      
      // Identificar padrões estratégicos
      const logisticsFIIs = buyOperations.filter(op => 
        ['BTLG11', 'HGLG11', 'VILG11'].includes(op.asset)
      );
      
      if (logisticsFIIs.length >= 2) {
        analysis += `\n🎯 **Padrão Estratégico Detectado:**\n`;
        analysis += `• Concentração em FIIs de Logística (${logisticsFIIs.length} operações)\n`;
        analysis += `• Setor em crescimento com contratos atípicos\n`;
        analysis += `• Estratégia alinhada com tendências do e-commerce\n`;
      }
      
      // Calcular impacto total
      const totalInvested = buyOperations.reduce((sum, op) => sum + op.totalValue, 0);
      const totalSold = sellOperations.reduce((sum, op) => sum + op.totalValue, 0);
      const netInvestment = totalInvested - totalSold;
      
      analysis += `\n💰 **Impacto Financeiro:**\n`;
      analysis += `• Total investido: ${formatCurrency(totalInvested)}\n`;
      if (totalSold > 0) {
        analysis += `• Total realizado: ${formatCurrency(totalSold)}\n`;
        analysis += `• Aporte líquido: ${formatCurrency(netInvestment)}\n`;
      }
    }
    
    // Recomendações baseadas no padrão
    analysis += `\n💡 **Recomendações Personalizadas:**\n`;
    
    if (buyOperations.some(op => ['BTLG11', 'HGLG11', 'VILG11'].includes(op.asset))) {
      analysis += `• Continue focando em logística, mas considere diversificar\n`;
      analysis += `• Próximos segmentos: Shopping Centers (VISC11) ou Recebíveis (KNCR11)\n`;
    }
    
    if (sellOperations.some(op => op.asset === 'TGAR11')) {
      analysis += `• Boa estratégia de saída do TGAR11\n`;
      analysis += `• Reinvista o capital em FIIs com melhor performance\n`;
    }
    
    return analysis;
  };

  // ===== FUNÇÕES DE CÁLCULOS DE RENTABILIDADE EM TEMPO REAL =====
  
  // Função para cálculo de rentabilidade após operação
  const calculateOperationProfitability = (operation, currentAsset) => {
    if (!currentAsset || !operation) return null;
    
    const calculations = {
      operation: operation,
      asset: currentAsset.symbol,
      beforeOperation: {
        quantity: currentAsset.quantity,
        avgPrice: currentAsset.avg_price,
        currentPrice: currentAsset.current_price,
        totalValue: currentAsset.total_value,
        result: currentAsset.result,
        percentage: ((currentAsset.current_price - currentAsset.avg_price) / currentAsset.avg_price * 100)
      }
    };
    
    if (operation.type === 'buy') {
      // Cálculos para compra
      const newQuantity = currentAsset.quantity + operation.quantity;
      const newTotalInvested = (currentAsset.quantity * currentAsset.avg_price) + operation.totalValue;
      const newAvgPrice = newTotalInvested / newQuantity;
      const newCurrentValue = newQuantity * currentAsset.current_price;
      const newResult = newCurrentValue - newTotalInvested;
      const newPercentage = ((currentAsset.current_price - newAvgPrice) / newAvgPrice * 100);
      
      calculations.afterOperation = {
        quantity: newQuantity,
        avgPrice: newAvgPrice,
        currentPrice: currentAsset.current_price,
        totalValue: newCurrentValue,
        result: newResult,
        percentage: newPercentage
      };
      
      calculations.impact = {
        quantityChange: operation.quantity,
        avgPriceChange: newAvgPrice - currentAsset.avg_price,
        resultChange: newResult - currentAsset.result,
        percentageChange: newPercentage - calculations.beforeOperation.percentage
      };
      
    } else {
      // Cálculos para venda
      const newQuantity = Math.max(0, currentAsset.quantity - operation.quantity);
      const realizedGain = (operation.price - currentAsset.avg_price) * operation.quantity;
      
      if (newQuantity === 0) {
        // Venda total
        calculations.afterOperation = {
          quantity: 0,
          avgPrice: 0,
          currentPrice: 0,
          totalValue: 0,
          result: 0,
          percentage: 0
        };
        
        calculations.impact = {
          quantityChange: -operation.quantity,
          realizedGain: realizedGain,
          totalRealization: operation.totalValue,
          percentageRealized: ((operation.price - currentAsset.avg_price) / currentAsset.avg_price * 100)
        };
      } else {
        // Venda parcial
        const newTotalInvested = newQuantity * currentAsset.avg_price;
        const newCurrentValue = newQuantity * currentAsset.current_price;
        const newResult = newCurrentValue - newTotalInvested;
        const newPercentage = calculations.beforeOperation.percentage;
        
        calculations.afterOperation = {
          quantity: newQuantity,
          avgPrice: currentAsset.avg_price,
          currentPrice: currentAsset.current_price,
          totalValue: newCurrentValue,
          result: newResult,
          percentage: newPercentage
        };
        
        calculations.impact = {
          quantityChange: -operation.quantity,
          realizedGain: realizedGain,
          totalRealization: operation.totalValue,
          percentageRealized: ((operation.price - currentAsset.avg_price) / currentAsset.avg_price * 100)
        };
      }
    }
    
    return calculations;
  };

  // Função para cálculo de impacto no dividend yield
  const calculateDividendYieldImpact = (operation, portfolioData) => {
    if (!portfolioData) return null;
    
    // Dividend yields estimados por ativo
    const dividendYields = {
      'BTLG11': 0.75, // 0.75% ao mês
      'HGLG11': 0.70, // 0.70% ao mês
      'VILG11': 0.80, // 0.80% ao mês
      'TGAR11': 0.65, // 0.65% ao mês
      'QBTC11': 0.00, // Bitcoin não paga dividendos
      'CPLE6': 0.50,  // 0.50% ao mês
      'VIVT3': 0.45   // 0.45% ao mês
    };
    
    const assetDY = dividendYields[operation.asset] || 0;
    
    if (assetDY === 0) return null;
    
    const monthlyDividendImpact = operation.type === 'buy' 
      ? (operation.totalValue * assetDY / 100)
      : -(operation.totalValue * assetDY / 100);
    
    const annualDividendImpact = monthlyDividendImpact * 12;
    
    return {
      asset: operation.asset,
      assetDividendYield: assetDY,
      impact: {
        monthlyDividendChange: monthlyDividendImpact,
        annualDividendChange: annualDividendImpact,
        percentageIncrease: monthlyDividendImpact > 0 ? 
          `+${(monthlyDividendImpact / operation.totalValue * 100).toFixed(2)}%` : 
          `${(monthlyDividendImpact / operation.totalValue * 100).toFixed(2)}%`
      }
    };
  };

  // Função para análise completa de rentabilidade
  const performCompleteProfitabilityAnalysis = (operation, portfolioData) => {
    const asset = findAssetInPortfolio(operation.asset, portfolioData);
    
    const analysis = {
      timestamp: new Date(),
      operation: operation,
      assetProfitability: calculateOperationProfitability(operation, asset),
      dividendYieldImpact: calculateDividendYieldImpact(operation, portfolioData)
    };
    
    return analysis;
  };

  // Função auxiliar para encontrar ativo na carteira
  const findAssetInPortfolio = (symbol, portfolioData) => {
    const allCategories = portfolioData.portfolio_allocation.allocation;
    
    for (const category of Object.values(allCategories)) {
      const asset = category.assets.find(a => a.symbol === symbol);
      if (asset) return asset;
    }
    
    return null;
  };

  // ===== FUNÇÕES DE ANÁLISE DE ESTRATÉGIAS DE INVESTIMENTO =====
  
  // Função para análise da estratégia ARCA
  const analyzeARCAStrategy = (portfolioData, recentOperations = []) => {
    if (!portfolioData) return null;
    
    const allocation = portfolioData.portfolio_allocation.allocation;
    const totalValue = portfolioData.portfolio_allocation.total_value;
    
    // Metas ARCA (25% cada)
    const arcaTargets = {
      acoes: 25,
      fiis: 25,
      internacional: 25,
      rendaFixa: 25
    };
    
    // Situação atual
    const currentAllocation = {
      acoes: allocation.renda_variavel.percentage,
      fiis: allocation.fiis.percentage,
      internacional: allocation.bitcoin.percentage,
      rendaFixa: allocation.renda_fixa.percentage
    };
    
    // Calcular desvios
    const deviations = {};
    let totalDeviation = 0;
    
    Object.keys(arcaTargets).forEach(category => {
      const deviation = currentAllocation[category] - arcaTargets[category];
      deviations[category] = {
        current: currentAllocation[category],
        target: arcaTargets[category],
        deviation: deviation,
        status: Math.abs(deviation) <= 2 ? 'EQUILIBRADO' : 
                deviation > 2 ? 'ACIMA' : 'ABAIXO',
        adjustmentNeeded: Math.abs(deviation) > 2 ? (deviation * totalValue / 100) : 0
      };
      totalDeviation += Math.abs(deviation);
    });
    
    return {
      strategy: 'ARCA',
      totalDeviation: totalDeviation,
      status: totalDeviation <= 5 ? 'BEM_EQUILIBRADO' : 
              totalDeviation <= 10 ? 'MODERADAMENTE_EQUILIBRADO' : 'DESBALANCEADO',
      deviations: deviations,
      score: Math.max(0, 100 - totalDeviation * 2)
    };
  };

  // Função para análise da estratégia Bola de Neve
  const analyzeSnowballStrategy = (portfolioData, recentOperations = []) => {
    if (!portfolioData) return null;
    
    // Dividend yields por ativo
    const dividendYields = {
      'BTLG11': 0.75,
      'HGLG11': 0.70,
      'VILG11': 0.80,
      'TGAR11': 0.65,
      'CPLE6': 0.50,
      'VIVT3': 0.45
    };
    
    // Calcular renda passiva atual
    let currentMonthlyIncome = 0;
    const allAssets = getAllAssets(portfolioData.portfolio_allocation.allocation);
    
    allAssets.forEach(asset => {
      const dy = dividendYields[asset.symbol];
      if (dy) {
        const monthlyDividend = asset.total_value * (dy / 100);
        currentMonthlyIncome += monthlyDividend;
      }
    });
    
    // Metas da bola de neve
    const snowballTargets = [
      { goal: 100, description: 'R$ 100/mês - Primeira meta' },
      { goal: 500, description: 'R$ 500/mês - Meta intermediária' },
      { goal: 1000, description: 'R$ 1.000/mês - Meta principal' },
      { goal: 5000, description: 'R$ 5.000/mês - Independência financeira' }
    ];
    
    // Encontrar próxima meta
    const nextTarget = snowballTargets.find(target => target.goal > currentMonthlyIncome);
    const currentTarget = snowballTargets.find(target => target.goal <= currentMonthlyIncome) || snowballTargets[0];
    
    // Calcular quanto falta para próxima meta
    const missingIncome = nextTarget ? nextTarget.goal - currentMonthlyIncome : 0;
    const averageDY = 0.7; // 0.7% médio
    const neededInvestment = missingIncome / (averageDY / 100);
    
    return {
      strategy: 'BOLA_DE_NEVE',
      currentMonthlyIncome: currentMonthlyIncome,
      currentAnnualIncome: currentMonthlyIncome * 12,
      currentTarget: currentTarget,
      nextTarget: nextTarget,
      missingIncome: missingIncome,
      neededInvestment: neededInvestment,
      progress: currentTarget ? (currentMonthlyIncome / currentTarget.goal * 100) : 0,
      score: Math.min(100, (currentMonthlyIncome / 1000) * 100)
    };
  };

  // Função para análise de concentração setorial
  const analyzeSectorConcentration = (portfolioData) => {
    if (!portfolioData) return null;
    
    // Mapeamento de setores
    const sectorMapping = {
      'BTLG11': 'Logística',
      'HGLG11': 'Logística', 
      'VILG11': 'Logística',
      'TGAR11': 'Híbrido',
      'QBTC11': 'Criptomoedas',
      'CPLE6': 'Energia Elétrica',
      'VIVT3': 'Telecomunicações'
    };
    
    const allAssets = getAllAssets(portfolioData.portfolio_allocation.allocation);
    const sectorAnalysis = {};
    
    // Agrupar por setor
    allAssets.forEach(asset => {
      const sector = sectorMapping[asset.symbol] || 'Outros';
      
      if (!sectorAnalysis[sector]) {
        sectorAnalysis[sector] = {
          assets: [],
          totalValue: 0,
          percentage: 0,
          count: 0
        };
      }
      
      sectorAnalysis[sector].assets.push(asset);
      sectorAnalysis[sector].totalValue += asset.total_value;
      sectorAnalysis[sector].count += 1;
    });
    
    // Calcular percentuais
    const totalValue = portfolioData.portfolio_allocation.total_value;
    Object.keys(sectorAnalysis).forEach(sector => {
      sectorAnalysis[sector].percentage = (sectorAnalysis[sector].totalValue / totalValue) * 100;
    });
    
    // Identificar concentrações
    const concentrations = [];
    Object.keys(sectorAnalysis).forEach(sector => {
      const data = sectorAnalysis[sector];
      if (data.percentage > 30) {
        concentrations.push({
          sector: sector,
          percentage: data.percentage,
          risk: 'ALTO'
        });
      } else if (data.percentage > 20) {
        concentrations.push({
          sector: sector,
          percentage: data.percentage,
          risk: 'MÉDIO'
        });
      }
    });
    
    return {
      strategy: 'DIVERSIFICACAO_SETORIAL',
      sectorAnalysis: sectorAnalysis,
      concentrations: concentrations,
      riskLevel: concentrations.length === 0 ? 'BAIXO' : 
                 concentrations.some(c => c.risk === 'ALTO') ? 'ALTO' : 'MÉDIO',
      score: Math.max(0, 100 - (concentrations.length * 20))
    };
  };

  // Função para análise consolidada de estratégias
  const performCompleteStrategyAnalysis = (portfolioData, recentOperations = []) => {
    const arca = analyzeARCAStrategy(portfolioData, recentOperations);
    const snowball = analyzeSnowballStrategy(portfolioData, recentOperations);
    const sectorDiv = analyzeSectorConcentration(portfolioData);
    
    // Calcular score geral
    const scores = [arca?.score, snowball?.score, sectorDiv?.score].filter(s => s !== undefined);
    const overallScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;
    
    return {
      timestamp: new Date(),
      arca: arca,
      snowball: snowball,
      sectorDiversification: sectorDiv,
      overallScore: overallScore
    };
  };

  // Função para gerar recomendações estratégicas
  const generateStrategicRecommendations = (strategyAnalysis) => {
    const recommendations = [];
    
    // Baseado na análise ARCA
    if (strategyAnalysis.arca && strategyAnalysis.arca.status === 'DESBALANCEADO') {
      recommendations.push({
        priority: 'ALTA',
        category: 'REBALANCEAMENTO',
        title: 'Rebalancear Carteira ARCA',
        description: `Carteira desbalanceada (desvio: ${strategyAnalysis.arca.totalDeviation.toFixed(1)}%)`
      });
    }
    
    // Baseado na bola de neve
    if (strategyAnalysis.snowball && strategyAnalysis.snowball.currentMonthlyIncome < 500) {
      recommendations.push({
        priority: 'MÉDIA',
        category: 'RENDA_PASSIVA',
        title: 'Acelerar Estratégia Bola de Neve',
        description: `Renda atual: R$ ${strategyAnalysis.snowball.currentMonthlyIncome.toFixed(0)}/mês`
      });
    }
    
    // Baseado na concentração setorial
    if (strategyAnalysis.sectorDiversification && strategyAnalysis.sectorDiversification.riskLevel === 'ALTO') {
      recommendations.push({
        priority: 'ALTA',
        category: 'RISCO',
        title: 'Reduzir Concentração Setorial',
        description: 'Concentração alta detectada em alguns setores'
      });
    }
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { 'ALTA': 3, 'MÉDIA': 2, 'BAIXA': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  // ===== FUNÇÕES DO SIMULADOR ARCA E CALCULADORA BOLA DE NEVE =====
  
  // Função para calcular rebalanceamento ARCA
  const calculateRebalance = () => {
    const amount = parseFloat(rebalanceAmount) || 0;
    
    setRebalanceCalculation({
      fiis: amount * 0.60,           // 60% para FIIs
      internacional: amount * 0.30,  // 30% para Ativos Internacionais
      rendaFixa: amount * 0.10       // 10% para Renda Fixa
    });
  };
  
  // Função para calcular bola de neve
  const calculateSnowball = (targetAmount) => {
    const target = targetAmount || snowballTarget;
    
    if (!portfolioData) return [];
    
    const allFiis = portfolioData.portfolio_allocation.allocation.fiis.assets;
    
    // Calcular renda atual total da carteira
    const totalCurrentIncome = allFiis.reduce((sum, fii) => {
      const dy = 0.75; // DY médio de 0.75% ao mês
      return sum + (fii.quantity * fii.current_price * (dy / 100));
    }, 0);
    
    // Calcular valor total atual investido em FIIs
    const totalCurrentValue = allFiis.reduce((sum, fii) => {
      return sum + (fii.quantity * fii.current_price);
    }, 0);
    
    return allFiis.map(fii => {
      const currentDividendYield = 0.75; // DY médio de 0.75% ao mês
      const currentPrice = fii.current_price;
      const currentQuantity = fii.quantity;
      
      // Calcular participação atual deste FII na carteira
      const currentValue = currentQuantity * currentPrice;
      const portfolioWeight = totalCurrentValue > 0 ? currentValue / totalCurrentValue : 1 / allFiis.length;
      
      // Calcular meta de renda para este FII (proporcional à participação)
      const targetIncomeForThisFii = target * portfolioWeight;
      
      // Calcular quantas cotas precisa para gerar essa renda
      const cotasNeeded = Math.ceil(targetIncomeForThisFii / (currentPrice * currentDividendYield / 100));
      
      // Calcular quanto precisa investir total
      const totalInvestmentNeeded = cotasNeeded * currentPrice;
      
      // Calcular quanto já tem investido (usando preço atual para comparação justa)
      const currentInvestment = currentQuantity * currentPrice;
      
      // Calcular quanto falta investir
      const missingInvestment = Math.max(0, totalInvestmentNeeded - currentInvestment);
      
      // Calcular renda atual deste FII
      const currentMonthlyIncome = currentQuantity * currentPrice * (currentDividendYield / 100);
      
      return {
        symbol: fii.symbol,
        currentQuantity: currentQuantity,
        cotasNeeded: cotasNeeded,
        cotasMissing: Math.max(0, cotasNeeded - currentQuantity),
        currentPrice: currentPrice,
        totalInvestmentNeeded: totalInvestmentNeeded,
        missingInvestment: missingInvestment,
        currentMonthlyIncome: currentMonthlyIncome,
        targetMonthlyIncome: targetIncomeForThisFii,
        portfolioWeight: portfolioWeight
      };
    });
  };

  // Função para gerar recomendações inteligentes ARCA
  const generateARCARecommendations = () => {
    if (!portfolioData || !rebalanceCalculation.fiis) return null;
    
    const allocation = portfolioData.portfolio_allocation.allocation;
    
    // Recomendações para FIIs (60%)
    const fiisRecommendations = allocation.fiis.assets
      .map(fii => ({
        ...fii,
        score: fii.cerrado_score || 0,
        maxScore: fii.cerrado_max || 14
      }))
      .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
      .slice(0, 3)
      .map((fii, index) => {
        const percentage = index === 0 ? 0.45 : index === 1 ? 0.35 : 0.20;
        return {
          symbol: fii.symbol,
          amount: rebalanceCalculation.fiis * percentage,
          score: fii.score,
          maxScore: fii.maxScore,
          reason: `Score Cerrado: ${fii.score}/${fii.maxScore} (${((fii.score/fii.maxScore)*100).toFixed(0)}%)`
        };
      });
    
    // Recomendações para Ativos Internacionais (30%)
    const internationalRecommendations = allocation.renda_variavel.assets
      .filter(asset => asset.symbol.includes('34') || asset.symbol.includes('11') && asset.symbol !== allocation.fiis.assets.map(f => f.symbol))
      .map(asset => ({
        ...asset,
        score: asset.cerrado_score || 0,
        maxScore: asset.cerrado_max || 14
      }))
      .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
      .slice(0, 2)
      .map((asset, index) => {
        const percentage = index === 0 ? 0.60 : 0.40;
        return {
          symbol: asset.symbol,
          amount: rebalanceCalculation.internacional * percentage,
          score: asset.score,
          maxScore: asset.maxScore,
          reason: `Score Cerrado: ${asset.score}/${asset.maxScore} (${((asset.score/asset.maxScore)*100).toFixed(0)}%)`
        };
      });
    
    // Recomendações para Renda Fixa (10%)
    const rendaFixaRecommendations = [{
      symbol: 'TESOURO SELIC',
      amount: rebalanceCalculation.rendaFixa * 0.70,
      reason: 'Liquidez diária + proteção inflação'
    }, {
      symbol: 'CDB/LCI',
      amount: rebalanceCalculation.rendaFixa * 0.30,
      reason: 'Maior rentabilidade + garantia FGC'
    }];
    
    return {
      fiis: fiisRecommendations,
      internacional: internationalRecommendations,
      rendaFixa: rendaFixaRecommendations
    };
  };

  // ===== FIM DAS NOVAS FUNÇÕES DE RECONHECIMENTO =====

  // Função auxiliar para obter todos os ativos
  const getAllAssets = (allocation) => {
    return [
      ...allocation.renda_variavel.assets,
      ...allocation.fiis.assets,
      ...allocation.bitcoin.assets,
      ...allocation.renda_fixa.assets
    ];
  };

  // Sistema de sugestões automáticas baseado nos 3 filtros prioritários
  const getAutomaticSuggestions = (assetToReplace, assetCategory) => {
    if (!portfolioData) return [];
    
    const allAssets = getAllAssets(portfolioData.portfolio_allocation.allocation);
    const sameCategory = allAssets.filter(asset => 
      asset.category === assetCategory && asset.symbol !== assetToReplace
    );
    
    // Aplicar filtros prioritários: Warren Buffett (40%) > Cerrado (30%) > ARCA (20%) > Bola de Neve (10%)
    const scoredAssets = sameCategory.map(asset => {
      let totalScore = 0;
      let reasons = [];
      
      // 1. Warren Buffett (peso 40%)
      const buffettScore = asset.recommendation?.buffett?.status === 'COMPRAR' ? 40 : 
                          asset.recommendation?.buffett?.status === 'MANTER' ? 20 : 0;
      totalScore += buffettScore;
      if (buffettScore > 0) reasons.push(`Warren Buffett: ${asset.recommendation.buffett.status}`);
      
      // 2. Diagrama do Cerrado (peso 30%)
      const cerradoScore = asset.recommendation?.cerrado?.score || 0;
      const cerradoWeight = (cerradoScore / 14) * 30; // Normalizar para 30%
      totalScore += cerradoWeight;
      if (cerradoScore > 10) reasons.push(`Cerrado: ${cerradoScore}/14`);
      
      // 3. ARCA (peso 20%)
      const arcaScore = asset.recommendation?.arca?.status === 'COMPRAR' ? 20 :
                       asset.recommendation?.arca?.status === 'MANTER' ? 10 : 0;
      totalScore += arcaScore;
      if (arcaScore > 0) reasons.push(`ARCA: ${asset.recommendation.arca.status}`);
      
      // 4. Bola de Neve - Dividend Yield (peso 10%)
      const dividendYield = asset.fundamentals?.dividend_yield || 0;
      const dividendScore = Math.min(dividendYield * 2, 10); // Max 10 pontos
      totalScore += dividendScore;
      if (dividendYield > 0.5) reasons.push(`DY: ${dividendYield.toFixed(1)}%`);
      
      return {
        ...asset,
        totalScore,
        reasons: reasons.join(', '),
        priority: totalScore > 70 ? 'ALTA' : totalScore > 50 ? 'MÉDIA' : 'BAIXA'
      };
    });
    
    // Ordenar por score total e retornar top 5
    return scoredAssets
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 5);
  };

  // Função para processar comandos de operação
  const processTradeCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    
    // Detectar operação de venda
    const sellMatch = lowerCommand.match(/vend[aeio]\s+(\d+)\s+cotas?\s+([a-z0-9]+)/i);
    if (sellMatch) {
      const quantity = parseInt(sellMatch[1]);
      const symbol = sellMatch[2].toUpperCase();
      return { type: 'SELL', symbol, quantity };
    }
    
    // Detectar operação de compra
    const buyMatch = lowerCommand.match(/compr[aeio]\s+(\d+)\s+cotas?\s+([a-z0-9]+)/i);
    if (buyMatch) {
      const quantity = parseInt(buyMatch[1]);
      const symbol = buyMatch[2].toUpperCase();
      return { type: 'BUY', symbol, quantity };
    }
    
    return null;
  };

  // Função para lidar com comandos de operação
  const handleTradeCommand = (command) => {
    if (command.type === 'SELL') {
      return `📤 **Operação de Venda Detectada:**

**Ativo**: ${command.symbol}
**Quantidade**: ${command.quantity} cotas
**Status**: Aguardando confirmação

**🎯 Sugestões automáticas para substituição:**
${getAutomaticSuggestions(command.symbol, 'FII').slice(0, 3).map((asset, i) => 
  `${i + 1}. ${asset.symbol} (Score: ${asset.totalScore.toFixed(1)}/100)`
).join('\n')}

**💡 Para confirmar a operação, digite:**
"Confirmo venda de ${command.quantity} cotas ${command.symbol}"

**🤖 Sistema calculará automaticamente o rebalanceamento!**`;
    }
    
    if (command.type === 'BUY') {
      return `📥 **Operação de Compra Detectada:**

**Ativo**: ${command.symbol}
**Quantidade**: ${command.quantity} cotas
**Status**: Aguardando confirmação

**📊 Análise do ativo:**
• **Warren Buffett**: Verificando recomendação...
• **Diagrama do Cerrado**: Analisando score...
• **ARCA**: Checando balanceamento...

**💡 Para confirmar a operação, digite:**
"Confirmo compra de ${command.quantity} cotas ${command.symbol}"

**🤖 Sistema atualizará sua carteira automaticamente!**`;
    }
    
    return `❓ Comando não reconhecido. Tente:
• "Vendi X cotas ATIVO"
• "Comprei X cotas ATIVO"
• "Substitua TGAR11"`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Carregando dados...</h2>
          <p className="text-gray-500">Aguarde enquanto coletamos as cotações atualizadas</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  const { allocation, total_value, total_result } = portfolioData.portfolio_allocation
  const { selic, ipca, ibovespa } = portfolioData.market_indicators

  // Modal de informações fundamentalistas
  const renderFundamentalInfoModal = () => {
    if (!showFundamentalInfo) return null
    
    const info = getFundamentalInfo(showFundamentalInfo)
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{info.name}</h3>
            <button 
              onClick={() => setShowFundamentalInfo(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">O que é:</p>
              <p className="text-sm">{info.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Como é calculado:</p>
              <p className="text-sm">{info.calculation}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Por que é importante:</p>
              <p className="text-sm">{info.importance}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // LAYOUT PRINCIPAL COM ABAS FIXAS
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header com título e timestamp */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">📊 Dashboard de Investimentos</h1>
            <button 
              onClick={() => window.location.reload()} 
              className="text-blue-500 text-xl"
            >
              🔄
            </button>
          </div>
          <p className="text-sm text-gray-500">
            🕐 {lastUpdate}
          </p>
        </div>
      </div>

      {/* Barra Superior com Previdência e Chat */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 mb-4">
        <div className="max-w-md mx-auto space-y-3">
          {/* Primeira linha - Previdência */}
          <div className="flex items-center space-x-3">
            <div className="text-sm font-semibold">🏦 Previdência:</div>
            <input 
              type="text"
              value={previdenciaValue}
              onChange={(e) => setPrevidenciaValue(e.target.value)}
              className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-3 py-1 text-sm placeholder-white placeholder-opacity-70 text-white"
              placeholder="R$ 45.000"
            />
            <div className="text-xs opacity-80">PGBL/VGBL</div>
          </div>
          
          {/* Segunda linha - Chat IA */}
          <div className="flex items-center space-x-3">
            <div className="text-sm font-semibold">🤖 Chat IA:</div>
            <input 
              type="text"
              value={topChatInput}
              onChange={(e) => setTopChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && topChatInput.trim()) {
                  // Redirecionar para aba Insights e enviar mensagem
                  setActiveTab('insights')
                  setChatInput(topChatInput)
                  setTopChatInput('')
                  // Simular envio após um pequeno delay
                  setTimeout(() => {
                    handleChatSubmit()
                  }, 100)
                }
              }}
              className="flex-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-3 py-1 text-sm placeholder-white placeholder-opacity-70 text-white"
              placeholder="Pergunte sobre sua carteira..."
            />
            <button 
              onClick={() => {
                if (topChatInput.trim()) {
                  setActiveTab('insights')
                  setChatInput(topChatInput)
                  setTopChatInput('')
                  setTimeout(() => {
                    handleChatSubmit()
                  }, 100)
                }
              }}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-3 py-1 text-sm transition-colors"
            >
              💬
            </button>
          </div>
        </div>
      </div>

      {/* Abas Fixas */}
      <div className="bg-white shadow-sm mb-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex overflow-x-auto">
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'visao' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => {
              setActiveTab('visao')
              setCurrentView('overview')
              setSelectedCategory(null)
              setSelectedAsset(null)
            }}
          >
            Visão Geral 📊
          </button>
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'analise' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('analise')}
          >
            Análise 📈
          </button>
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'gestao' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('gestao')}
          >
            Gestão 🔧
          </button>
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'insights' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights 💡
          </button>
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'aprenda' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('aprenda')}
          >
            Aprenda 🎓
          </button>
          <button 
            className={`flex-1 py-3 px-2 text-center text-sm ${activeTab === 'descoberta' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('descoberta')}
          >
            Descoberta 🔍
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* CONTEÚDO DAS ABAS */}
          
          {/* ABA VISÃO GERAL */}
          {activeTab === 'visao' && (
            <>
              {/* OVERVIEW - Tela principal com cards clicáveis */}
              {currentView === 'overview' && (
                <div className="space-y-4">
                  {/* Patrimônio Total */}
                  <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h2 className="text-lg font-semibold">💰 Patrimônio Total</h2>
                    <p className="text-2xl font-bold">{formatCurrency(total_value)}</p>
                    <p className={`text-sm ${total_result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {total_result >= 0 ? '+' : ''}{formatCurrency(total_result)}
                    </p>
                  </div>

                  {/* Indicadores de Mercado */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">📈 Indicadores</h2>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-500">SELIC</p>
                        <p className="font-semibold">{selic}%</p>
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        <p className="text-xs text-gray-500">IPCA</p>
                        <p className="font-semibold">{ipca}%</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-500">IBOV</p>
                        <p className="font-semibold">{formatPercent(ibovespa.change_percent)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Cards de Categorias - CLICÁVEIS */}
                  <div className="space-y-3">
                    {Object.entries(allocation).map(([categoryKey, data]) => {
                      const isAboveTarget = data.percentage > 30
                      const isBelowTarget = data.percentage < 20
                      
                      return (
                        <div 
                          key={categoryKey} 
                          className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow p-4"
                          onClick={() => goToCategory(categoryKey)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{data.name}</h3>
                              <p className="text-2xl font-bold">{formatCurrency(data.value)}</p>
                              <p className="text-sm text-gray-500">
                                {formatPercent(data.percentage)} • {data.count} ativos
                              </p>
                              <p className={`text-sm ${data.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {data.result >= 0 ? '+' : ''}{formatCurrency(data.result)}
                              </p>
                            </div>
                            <div className="text-right">
                              {isAboveTarget && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">⚠️ Acima da meta</span>}
                              {isBelowTarget && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">📈 Abaixo da meta</span>}
                              {!isAboveTarget && !isBelowTarget && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">✅ Próximo da meta</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* CATEGORY VIEW - Lista de ativos da categoria */}
              {currentView === 'category' && selectedCategory && (
                <div className="space-y-4">
                  {/* Header com botão voltar */}
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={goBack} 
                      className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                    >
                      ←
                    </button>
                    <div>
                      <h1 className="text-xl font-bold">{allocation[selectedCategory].name}</h1>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(allocation[selectedCategory].value)} • {allocation[selectedCategory].count} ativos
                      </p>
                    </div>
                  </div>

                  {/* Comparativo com Benchmarks */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">📊 Comparativo</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Performance</span>
                        <span className={`text-sm font-semibold ${allocation[selectedCategory].result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {allocation[selectedCategory].result >= 0 ? '+' : ''}{formatPercent(allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs SELIC</span>
                        <span className={`text-sm font-semibold ${(allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) > selic ? 'text-green-600' : 'text-red-600'}`}>
                          {(allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) > selic ? '+' : ''}{((allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) - selic).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs IPCA</span>
                        <span className={`text-sm font-semibold ${(allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) > ipca ? 'text-green-600' : 'text-red-600'}`}>
                          {(allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) > ipca ? '+' : ''}{((allocation[selectedCategory].result / (allocation[selectedCategory].value - allocation[selectedCategory].result) * 100) - ipca).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lista de ativos - CLICÁVEIS */}
                  <div className="space-y-3">
                    {allocation[selectedCategory].assets.map((asset, index) => (
                      <div 
                        key={index}
                        className={`bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow p-4 ${getBorderColor(asset.result_percent)}`}
                        onClick={() => goToAsset(asset)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{asset.symbol}</h3>
                            <p className="text-sm text-gray-500">
                              {asset.quantity} {selectedCategory === 'bitcoin' ? 'BTC' : 'cotas'}
                            </p>
                            <p className="text-lg font-bold">
                              {formatCurrency(asset.current_price * asset.quantity)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${asset.result_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.result_percent >= 0 ? '+' : ''}{asset.result_percent.toFixed(2)}%
                            </p>
                            <p className={`text-xs ${asset.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.result >= 0 ? '+' : ''}{formatCurrency(asset.result)}
                            </p>
                            {asset.cerrado_score && (
                              <div className="mt-1 flex items-center justify-end">
                                <div className="w-16 h-2 bg-gray-200 rounded-full">
                                  <div 
                                    className={`h-2 rounded-full ${getCerradoColor(asset.cerrado_score, asset.cerrado_max)}`}
                                    style={{ width: `${(asset.cerrado_score / asset.cerrado_max) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs ml-1">{asset.cerrado_score}/{asset.cerrado_max}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ASSET VIEW - Página detalhada do ativo */}
              {currentView === 'asset' && selectedAsset && (
                <div className="space-y-4">
                  {/* Header com botão voltar */}
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={goBack} 
                      className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                    >
                      ←
                    </button>
                    <div>
                      <h1 className="text-xl font-bold">{selectedAsset.symbol}</h1>
                      <p className="text-sm text-gray-500">Análise detalhada</p>
                    </div>
                  </div>

                  {/* Resumo do Ativo */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">📊 Resumo</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Quantidade</p>
                        <p className="font-semibold">{selectedAsset.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Preço Atual</p>
                        <p className="font-semibold">{formatCurrency(selectedAsset.current_price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valor Total</p>
                        <p className="font-semibold">{formatCurrency(selectedAsset.current_price * selectedAsset.quantity)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Resultado</p>
                        <p className={`font-semibold ${selectedAsset.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAsset.result >= 0 ? '+' : ''}{formatCurrency(selectedAsset.result)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comparativo com Benchmarks */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">📈 Comparativo</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs SELIC</span>
                        <span className={`text-sm font-semibold ${selectedAsset.result_percent > selic ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAsset.result_percent > selic ? '+' : ''}{(selectedAsset.result_percent - selic).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs IPCA</span>
                        <span className={`text-sm font-semibold ${selectedAsset.result_percent > ipca ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAsset.result_percent > ipca ? '+' : ''}{(selectedAsset.result_percent - ipca).toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">vs IBOVESPA</span>
                        <span className={`text-sm font-semibold ${selectedAsset.result_percent > ibovespa.change_percent ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedAsset.result_percent > ibovespa.change_percent ? '+' : ''}{(selectedAsset.result_percent - ibovespa.change_percent).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Indicadores Fundamentalistas - POSITIVOS E NEGATIVOS */}
                  {selectedAsset.fundamentals && Object.keys(selectedAsset.fundamentals).some(key => selectedAsset.fundamentals[key] !== null) && (
                    <div className="bg-white rounded-lg shadow p-4">
                      <h2 className="text-lg font-semibold mb-3">🔍 Indicadores Fundamentalistas</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Coluna dos Indicadores Positivos */}
                        <div>
                          <h3 className="text-sm font-semibold text-green-700 mb-2">✅ Mais Positivos</h3>
                          <div className="space-y-2">
                            {(() => {
                              // Lógica para identificar os 5 indicadores mais positivos
                              const positiveIndicators = Object.entries(selectedAsset.fundamentals)
                                .filter(([key, value]) => value !== null)
                                .map(([key, value]) => ({
                                  key,
                                  value,
                                  score: getIndicatorScore(key, value, 'positive')
                                }))
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 5);
                              
                              return positiveIndicators.map(({key, value}) => (
                                <div 
                                  key={key} 
                                  className="p-2 bg-green-50 border border-green-200 rounded-lg cursor-pointer"
                                  onClick={() => setShowFundamentalInfo(key)}
                                >
                                  <p className="text-xs text-green-600">{getFundamentalInfo(key).name}</p>
                                  <p className="font-semibold text-green-800">
                                    {key === 'dy' || key === 'roe' || key === 'roic' || key === 'margem_liquida' || key === 'cap_rate' || key === 'vacancia' || key === 'dividend_yield' 
                                      ? `${value}%` 
                                      : key === 'liquidez_diaria' 
                                        ? formatCurrency(value)
                                        : value
                                    }
                                  </p>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                        
                        {/* Coluna dos Indicadores Negativos */}
                        <div>
                          <h3 className="text-sm font-semibold text-red-700 mb-2">⚠️ Mais Negativos</h3>
                          <div className="space-y-2">
                            {(() => {
                              // Lógica para identificar os 5 indicadores mais negativos
                              const negativeIndicators = Object.entries(selectedAsset.fundamentals)
                                .filter(([key, value]) => value !== null)
                                .map(([key, value]) => ({
                                  key,
                                  value,
                                  score: getIndicatorScore(key, value, 'negative')
                                }))
                                .sort((a, b) => a.score - b.score)
                                .slice(0, 5);
                              
                              return negativeIndicators.map(({key, value}) => (
                                <div 
                                  key={key} 
                                  className="p-2 bg-red-50 border border-red-200 rounded-lg cursor-pointer"
                                  onClick={() => setShowFundamentalInfo(key)}
                                >
                                  <p className="text-xs text-red-600">{getFundamentalInfo(key).name}</p>
                                  <p className="font-semibold text-red-800">
                                    {key === 'dy' || key === 'roe' || key === 'roic' || key === 'margem_liquida' || key === 'cap_rate' || key === 'vacancia' || key === 'dividend_yield' 
                                      ? `${value}%` 
                                      : key === 'liquidez_diaria' 
                                        ? formatCurrency(value)
                                        : value
                                    }
                                  </p>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">Toque em um indicador para mais informações</p>
                    </div>
                  )}

                  {/* Diagrama do Cerrado */}
                  {selectedAsset.cerrado_score && (
                    <div className="bg-white rounded-lg shadow p-4">
                      <h2 className="text-lg font-semibold mb-3">🎯 Diagrama do Cerrado</h2>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">Pontuação</span>
                          <span className="text-sm font-semibold">{selectedAsset.cerrado_score}/{selectedAsset.cerrado_max}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${getCerradoColor(selectedAsset.cerrado_score, selectedAsset.cerrado_max)}`}
                            style={{ width: `${(selectedAsset.cerrado_score / selectedAsset.cerrado_max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={`p-3 ${selectedAsset.recommendation.cerrado.status === 'COMPRAR' ? 'bg-green-50 border border-green-200' : selectedAsset.recommendation.cerrado.status === 'NEUTRO' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'} rounded-lg`}>
                        <p className={`font-semibold ${selectedAsset.recommendation.cerrado.status === 'COMPRAR' ? 'text-green-800' : selectedAsset.recommendation.cerrado.status === 'NEUTRO' ? 'text-yellow-800' : 'text-red-800'}`}>
                          {selectedAsset.recommendation.cerrado.status === 'COMPRAR' ? '🟢 COMPRAR' : selectedAsset.recommendation.cerrado.status === 'NEUTRO' ? '🟡 NEUTRO' : '🔴 VENDER'}
                        </p>
                        <p className={`text-sm ${selectedAsset.recommendation.cerrado.status === 'COMPRAR' ? 'text-green-700' : selectedAsset.recommendation.cerrado.status === 'NEUTRO' ? 'text-yellow-700' : 'text-red-700'}`}>
                          {selectedAsset.recommendation.cerrado.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Análise Temporal das 4 Metodologias */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">💼 Análise das Estratégias</h2>
                    
                    {/* Recomendação Geral - Média Ponderada */}
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-lg text-blue-900 mb-2">🎯 Recomendação Geral</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Média Ponderada:</span>
                        <span className={`text-lg font-bold ${getWeightedRecommendation(selectedAsset) === 'COMPRAR' ? 'text-green-600' : getWeightedRecommendation(selectedAsset) === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {getWeightedRecommendation(selectedAsset) === 'COMPRAR' ? '🟢 COMPRAR' : getWeightedRecommendation(selectedAsset) === 'VENDER' ? '🔴 VENDER' : '🟡 MANTER'}
                        </span>
                      </div>
                      {getWeightedRecommendation(selectedAsset) === 'COMPRAR' && (
                        <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                          <strong>💡 Estratégia de Compra:</strong> Compre {Math.ceil(selectedAsset.current_price / (selectedAsset.fundamentals?.dividend_yield || 1))} cotas para gerar R$ 1,00/mês em dividendos.
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {/* Warren Buffett - Peso 40% */}
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-purple-800">🧠 Warren Buffett (Peso: 40%)</p>
                          <span className="text-xs bg-purple-200 px-2 py-1 rounded">Maior Peso</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div className="text-center">
                            <p className="font-semibold">1 Mês</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'buffett', '1m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'buffett', '1m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'buffett', '1m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">3 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'buffett', '3m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'buffett', '3m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'buffett', '3m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">6 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'buffett', '6m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'buffett', '6m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'buffett', '6m')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-purple-700">
                          <span className="font-semibold">{selectedAsset.recommendation.buffett.status}:</span> {selectedAsset.recommendation.buffett.reason}
                        </p>
                      </div>
                      
                      {/* Diagrama do Cerrado - Peso 30% */}
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-green-800">🎯 Diagrama do Cerrado (Peso: 30%)</p>
                          <span className="text-xs bg-green-200 px-2 py-1 rounded">2º Peso</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div className="text-center">
                            <p className="font-semibold">1 Mês</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'cerrado', '1m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'cerrado', '1m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'cerrado', '1m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">3 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'cerrado', '3m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'cerrado', '3m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'cerrado', '3m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">6 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'cerrado', '6m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'cerrado', '6m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'cerrado', '6m')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-green-700">
                          <span className="font-semibold">{selectedAsset.recommendation.cerrado.status}:</span> {selectedAsset.recommendation.cerrado.reason}
                        </p>
                      </div>
                      
                      {/* ARCA - Peso 20% */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-blue-800">📊 Estratégia ARCA (Peso: 20%)</p>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">3º Peso</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                          <div className="text-center">
                            <p className="font-semibold">1 Mês</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'arca', '1m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'arca', '1m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'arca', '1m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">3 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'arca', '3m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'arca', '3m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'arca', '3m')}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold">6 Meses</p>
                            <span className={`${getTemporalAnalysis(selectedAsset, 'arca', '6m') === 'COMPRAR' ? 'text-green-600' : getTemporalAnalysis(selectedAsset, 'arca', '6m') === 'VENDER' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {getTemporalAnalysis(selectedAsset, 'arca', '6m')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-700">
                          <span className="font-semibold">{selectedAsset.recommendation.arca.status}:</span> {selectedAsset.recommendation.arca.reason}
                        </p>
                      </div>
                      
                      {/* Bola de Neve - Peso 10% (Informativo) */}
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-yellow-800">❄️ Bola de Neve (Informativo)</p>
                          <span className="text-xs bg-yellow-200 px-2 py-1 rounded">Não computado</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          {selectedAsset.symbol.includes('11') && !selectedAsset.symbol.includes('34') ? 
                            `Para gerar R$ 100/mês: ${Math.ceil(100 / ((selectedAsset.fundamentals?.dividend_yield || 0.7) * selectedAsset.current_price / 100))} cotas (${formatCurrency(Math.ceil(100 / ((selectedAsset.fundamentals?.dividend_yield || 0.7) * selectedAsset.current_price / 100)) * selectedAsset.current_price)})` :
                            'Estratégia focada em dividendos mensais para reinvestimento automático'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                     {/* O que é o ativo - CAIXA ROLÁVEL */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">🎓 O que é {selectedAsset.symbol}?</h2>
                    {/* Caixa de texto rolável com altura fixa */}
                    <div className="h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="space-y-3 text-sm">
                        <p>{selectedAsset.description}</p>
                        
                        {/* Conteúdo educacional expandido baseado no tipo de ativo */}
                        {selectedAsset.symbol.includes('11') && !selectedAsset.symbol.includes('34') && (
                          <div>
                            {selectedAsset.symbol.startsWith('Q') || selectedAsset.symbol.startsWith('I') || selectedAsset.symbol.startsWith('N') || selectedAsset.symbol.startsWith('A') ? (
                              <div>
                                <p className="font-semibold text-blue-800">📈 ETF (Exchange Traded Fund)</p>
                                <p>Os ETFs são fundos de investimento negociados em bolsa que replicam índices ou cestas de ativos. Oferecem diversificação instantânea com baixo custo operacional.</p>
                                <p className="mt-2"><strong>Vantagens:</strong> Diversificação, liquidez, baixas taxas de administração, transparência na composição.</p>
                                <p><strong>Como funciona:</strong> Cada cota representa uma fração proporcional de todos os ativos do fundo, permitindo exposição a múltiplos investimentos com uma única compra.</p>
                              </div>
                            ) : (
                              <div>
                                <p className="font-semibold text-green-800">🏢 FII (Fundo de Investimento Imobiliário)</p>
                                <p>Os FIIs são fundos que investem em imóveis ou títulos relacionados ao mercado imobiliário, distribuindo pelo menos 95% do lucro aos cotistas mensalmente.</p>
                                <p className="mt-2"><strong>Vantagens:</strong> Renda mensal, isenção de IR para pessoa física, diversificação imobiliária sem necessidade de grande capital.</p>
                                <p><strong>Como funciona:</strong> O fundo compra imóveis, aluga para empresas e distribui o aluguel aos cotistas proporcionalmente às cotas possuídas.</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {selectedAsset.symbol.includes('34') && (
                          <div>
                            <p className="font-semibold text-purple-800">🌍 BDR (Brazilian Depositary Receipt)</p>
                            <p>BDRs são certificados que representam ações de empresas estrangeiras negociadas na B3, permitindo investir no exterior sem sair do Brasil.</p>
                            <p className="mt-2"><strong>Vantagens:</strong> Diversificação internacional, proteção cambial, acesso a empresas globais líderes.</p>
                            <p><strong>Como funciona:</strong> Um banco custodiante compra as ações originais no exterior e emite certificados lastreados nessas ações para negociação no Brasil.</p>
                          </div>
                        )}
                        
                        {selectedAsset.symbol.includes('3') && !selectedAsset.symbol.includes('34') && !selectedAsset.symbol.includes('11') && (
                          <div>
                            <p className="font-semibold text-green-800">🏢 Ação Brasileira</p>
                            <p>Ações representam frações do capital social de uma empresa, tornando o investidor sócio do negócio com direito a participar dos lucros via dividendos.</p>
                            <p className="mt-2"><strong>Vantagens:</strong> Participação nos lucros, potencial de valorização, direitos societários.</p>
                            <p><strong>Como funciona:</strong> Ao comprar ações, você se torna acionista da empresa e tem direito a receber dividendos quando ela distribui lucros.</p>
                          </div>
                        )}
                        
                        {selectedAsset.symbol === 'Bitcoin' && (
                          <div>
                            <p className="font-semibold text-yellow-800">₿ Criptomoeda</p>
                            <p>Bitcoin é uma moeda digital descentralizada que funciona como reserva de valor e meio de troca, sem controle de governos ou bancos centrais.</p>
                            <p className="mt-2"><strong>Vantagens:</strong> Descentralização, escassez programada (21 milhões de unidades), proteção contra inflação.</p>
                            <p><strong>Como funciona:</strong> Utiliza tecnologia blockchain para registrar transações de forma transparente e imutável, sendo minerado por uma rede global de computadores.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contexto Setorial - NOVO */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold mb-3">🏭 Contexto Setorial</h2>
                    <div className="space-y-2">
                      {/* Análise setorial baseada no ativo */}
                      {(selectedAsset.symbol === 'CPLE6' || selectedAsset.symbol === 'EGIE3') && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-semibold text-blue-800">⚡ Setor: Energia Elétrica</p>
                          <p className="text-xs text-blue-700">
                            Setor perene e defensivo. Empresas de energia têm receitas previsíveis e pagam dividendos consistentes. 
                            Beneficiadas pela transição energética e crescimento da demanda.
                          </p>
                        </div>
                      )}
                      
                      {(selectedAsset.symbol === 'VIVT3') && (
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm font-semibold text-purple-800">📱 Setor: Telecomunicações</p>
                          <p className="text-xs text-purple-700">
                            Setor essencial com receitas recorrentes. Beneficiado pelo 5G e digitalização. 
                            Vivo é líder de mercado com vantagem competitiva.
                          </p>
                        </div>
                      )}
                      
                      {(selectedAsset.symbol === 'WEGE3') && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-semibold text-green-800">🔧 Setor: Bens Industriais</p>
                          <p className="text-xs text-green-700">
                            WEG é líder global em motores elétricos. Beneficiada pela eletrificação e automação industrial. 
                            Empresa com gestão excepcional e crescimento consistente.
                          </p>
                        </div>
                      )}
                      
                      {(selectedAsset.symbol === 'B3SA3') && (
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-semibold text-yellow-800">🏦 Setor: Serviços Financeiros</p>
                          <p className="text-xs text-yellow-700">
                            B3 é a bolsa brasileira - monopólio natural. Receitas crescem com volume de negociação e novos produtos. 
                            Beneficiada pela educação financeira e entrada de novos investidores.
                          </p>
                        </div>
                      )}
                      
                      {(selectedAsset.symbol.includes('34')) && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-semibold text-blue-800">🌍 Mercado: Estados Unidos</p>
                          <p className="text-xs text-blue-700">
                            Maior economia do mundo com empresas líderes globais. Mercado maduro com regulação sólida. 
                            Dólar como moeda de reserva oferece proteção cambial.
                          </p>
                        </div>
                      )}
                      
                      {selectedAsset.symbol.includes('11') && !selectedAsset.symbol.includes('34') && (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm font-semibold text-orange-800">🏢 Setor: Fundos Imobiliários</p>
                          <p className="text-xs text-orange-700">
                            {selectedAsset.symbol.startsWith('B') ? 'Logística: Galpões para e-commerce e distribuição.' :
                             selectedAsset.symbol.startsWith('V') ? 'Shopping Centers: Exposição ao varejo e consumo.' :
                             selectedAsset.symbol.startsWith('H') || selectedAsset.symbol.startsWith('C') ? 'Recebíveis: Renda fixa imobiliária com CRIs.' :
                             'Imóveis corporativos: Escritórios e lajes comerciais.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ABA ANÁLISE */}
          {activeTab === 'analise' && portfolioData && (
            // Definir allocation para uso na aba Análise
            (() => {
              const allocation = portfolioData.portfolio_allocation.allocation;
              const total_value = portfolioData.portfolio_allocation.total_value;
              return (
            <div className="space-y-4">
              {/* Análise ARCA */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">📊 Análise ARCA</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ações</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{formatPercent(allocation.renda_variavel.percentage)}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${allocation.renda_variavel.percentage > 25 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(allocation.renda_variavel.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fundos Imobiliários</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{formatPercent(allocation.fiis.percentage)}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${allocation.fiis.percentage > 25 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(allocation.fiis.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Internacional</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{formatPercent(allocation.bitcoin.percentage)}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${allocation.bitcoin.percentage > 25 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(allocation.bitcoin.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Renda Fixa</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{formatPercent(allocation.renda_fixa.percentage)}</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${allocation.renda_fixa.percentage > 25 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(allocation.renda_fixa.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">25%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recomendações de Rebalanceamento */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🎯 Rebalanceamento</h2>
                <div className="space-y-3">
                  {allocation.renda_variavel.percentage > 25 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-red-800">⬇️ Reduzir Ações</p>
                      <p className="text-sm text-red-700">
                        Reduza {formatCurrency((allocation.renda_variavel.percentage - 25) * total_value / 100)} ({(allocation.renda_variavel.percentage - 25).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  {allocation.fiis.percentage < 25 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-semibold text-green-800">⬆️ Aumentar FIIs</p>
                      <p className="text-sm text-green-700">
                        Aumente {formatCurrency((25 - allocation.fiis.percentage) * total_value / 100)} ({(25 - allocation.fiis.percentage).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  {allocation.bitcoin.percentage < 25 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-semibold text-green-800">⬆️ Aumentar Internacional</p>
                      <p className="text-sm text-green-700">
                        Aumente {formatCurrency((25 - allocation.bitcoin.percentage) * total_value / 100)} ({(25 - allocation.bitcoin.percentage).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  {allocation.renda_fixa.percentage > 25 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-semibold text-red-800">⬇️ Reduzir Renda Fixa</p>
                      <p className="text-sm text-red-700">
                        Reduza {formatCurrency((allocation.renda_fixa.percentage - 25) * total_value / 100)} ({(allocation.renda_fixa.percentage - 25).toFixed(1)}%)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Melhores e Piores */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🏆 Melhores e Piores</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">Top 3 Melhores</h3>
                    <div className="space-y-2">
                      {[...allocation.renda_variavel.assets, ...allocation.fiis.assets]
                        .sort((a, b) => b.result_percent - a.result_percent)
                        .slice(0, 3)
                        .map((asset, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{asset.symbol}</span>
                            <span className="text-sm font-semibold text-green-600">+{asset.result_percent.toFixed(2)}%</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-2">Top 3 Piores</h3>
                    <div className="space-y-2">
                      {[...allocation.renda_variavel.assets, ...allocation.fiis.assets]
                        .sort((a, b) => a.result_percent - b.result_percent)
                        .slice(0, 3)
                        .map((asset, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{asset.symbol}</span>
                            <span className="text-sm font-semibold text-red-600">{asset.result_percent.toFixed(2)}%</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
             </div>
          )
        })()
      )}

          {/* ABA GESTÃO */}
          {activeTab === 'gestao' && portfolioData && (
            <div className="space-y-4">
              {/* Header da Gestão */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">🔧 Gestão da Carteira</h2>
                    <p className="text-sm text-gray-600">Gerencie seus ativos e operações</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    syncStatus === 'success' ? 'bg-green-100 text-green-800' :
                    syncStatus === 'syncing' ? 'bg-blue-100 text-blue-800' :
                    syncStatus === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {syncStatus === 'success' ? '✅ Sincronizado' :
                     syncStatus === 'syncing' ? '🔄 Sincronizando' :
                     syncStatus === 'error' ? '❌ Erro' :
                     '⏸️ Aguardando'}
                  </div>
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Object.values(portfolioData.portfolio_allocation.allocation).reduce((sum, cat) => sum + cat.count, 0)}
                    </div>
                    <div className="text-xs text-gray-600">Total de Ativos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {operationHistory.length}
                    </div>
                    <div className="text-xs text-gray-600">Operações</div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowAssetManager(true)}
                    className="bg-blue-500 text-white rounded-lg py-3 px-4 text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>➕</span>
                    <span>Adicionar Ativo</span>
                  </button>
                  <button 
                    onClick={() => updateQuotes()}
                    className="bg-green-500 text-white rounded-lg py-3 px-4 text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Atualizar Cotações</span>
                  </button>
                </div>
              </div>

              {/* Processamento de Imagens */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-3">📸 Análise de Imagens</h3>
                <ImageProcessor 
                  onOperationDetected={(operation) => {
                    setDetectedOperations(prev => [...prev, operation])
                  }}
                  onProcessingStart={() => setProcessingImage(true)}
                  onProcessingEnd={() => setProcessingImage(false)}
                />
              </div>

              {/* Operações Detectadas */}
              {detectedOperations.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-3">🔍 Operações Detectadas</h3>
                  <div className="space-y-3">
                    {detectedOperations.map((operation) => (
                      <div key={operation.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              operation.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-semibold">{operation.asset}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {operation.type === 'buy' ? 'Compra' : 'Venda'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {operation.confidence && `${(operation.confidence * 100).toFixed(0)}% confiança`}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>Quantidade: {operation.quantity}</div>
                          <div>Preço: R$ {operation.price?.toFixed(2)}</div>
                          <div>Total: R$ {operation.totalValue?.toFixed(2)}</div>
                          <div>Arquivo: {operation.fileName}</div>
                        </div>

                        <div className="flex space-x-2">
                          <button 
                            onClick={() => confirmOperation(operation.id)}
                            className="flex-1 bg-green-500 text-white rounded py-2 text-xs hover:bg-green-600 transition-colors"
                          >
                            ✅ Confirmar
                          </button>
                          <button 
                            onClick={() => setDetectedOperations(prev => prev.filter(op => op.id !== operation.id))}
                            className="flex-1 bg-red-500 text-white rounded py-2 text-xs hover:bg-red-600 transition-colors"
                          >
                            ❌ Rejeitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Histórico de Operações */}
              {operationHistory.length > 0 && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold mb-3">📋 Operações Recentes</h3>
                  <div className="space-y-2">
                    {operationHistory.slice(0, 5).map((operation, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            operation.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="text-sm font-semibold">{operation.asset}</div>
                            <div className="text-xs text-gray-500">
                              {operation.quantity} cotas • R$ {operation.price?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            R$ {operation.totalValue?.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {operation.timestamp && new Date(operation.timestamp).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Distribuição por Categoria */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-3">📊 Distribuição Atual</h3>
                <div className="space-y-3">
                  {Object.entries(portfolioData.portfolio_allocation.allocation).map(([key, category]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-semibold">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.count} ativos</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{category.percentage}%</div>
                        <div className="text-xs text-gray-500">{formatCurrency(category.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ABA INSIGHTS */}
          {activeTab === 'insights' && portfolioData && (
            // Definir allocation para uso na aba Insights
            (() => {
              const allocation = portfolioData.portfolio_allocation.allocation;
              const total_value = portfolioData.portfolio_allocation.total_value;
              return (
            <div className="space-y-4">
              {/* Simulador de Rebalanceamento */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">💰 Simulador de Rebalanceamento</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold">Valor disponível para investir:</label>
                    <div className="flex space-x-2 mt-1">
                      <input 
                        type="number" 
                        placeholder="5000"
                        value={rebalanceAmount}
                        onChange={(e) => setRebalanceAmount(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      />
                      <button 
                        onClick={calculateRebalance}
                        className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600"
                      >
                        Calcular
                      </button>
                    </div>
                  </div>
                  
                  {/* Sugestões baseadas na estratégia ARCA */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-800">📈 Sugestão ARCA</p>
                    <div className="text-xs text-blue-700 space-y-1 mt-2">
                      <p>• 60% em FIIs ({formatCurrency(rebalanceCalculation.fiis)}) - Aumentar Real Estate</p>
                      <p>• 30% em Ativos Internacionais ({formatCurrency(rebalanceCalculation.internacional)}) - BDRs ou ETFs</p>
                      <p>• 10% em Renda Fixa ({formatCurrency(rebalanceCalculation.rendaFixa)}) - Reserva de emergência</p>
                    </div>
                  </div>
                  
                  {/* Recomendações Inteligentes Detalhadas */}
                  {rebalanceCalculation.fiis > 0 && (() => {
                    const recommendations = generateARCARecommendations();
                    if (!recommendations) return null;
                    
                    return (
                      <div className="space-y-3">
                        {/* FIIs Recomendados */}
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="font-semibold text-green-800 mb-2">🏢 FIIs Recomendados (Diagrama do Cerrado)</p>
                          <div className="space-y-1">
                            {recommendations.fiis.map((fii, index) => (
                              <div key={index} className="text-xs text-green-700">
                                <span className="font-semibold">{fii.symbol}</span>: {formatCurrency(fii.amount)} - {fii.reason}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Ativos Internacionais Recomendados */}
                        {recommendations.internacional.length > 0 && (
                          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <p className="font-semibold text-purple-800 mb-2">🌍 Ativos Internacionais Recomendados</p>
                            <div className="space-y-1">
                              {recommendations.internacional.map((asset, index) => (
                                <div key={index} className="text-xs text-purple-700">
                                  <span className="font-semibold">{asset.symbol}</span>: {formatCurrency(asset.amount)} - {asset.reason}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Renda Fixa Recomendada */}
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="font-semibold text-yellow-800 mb-2">🏦 Renda Fixa Recomendada</p>
                          <div className="space-y-1">
                            {recommendations.rendaFixa.map((rf, index) => (
                              <div key={index} className="text-xs text-yellow-700">
                                <span className="font-semibold">{rf.symbol}</span>: {formatCurrency(rf.amount)} - {rf.reason}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Calculadora Bola de Neve Avançada */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">❄️ Calculadora Bola de Neve</h2>
                <div className="space-y-3">
                  {/* Seletor de meta */}
                  <div>
                    <label className="text-sm font-semibold">Meta de renda passiva mensal:</label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[500, 1000, 5000, 10000].map(value => (
                        <button 
                          key={value}
                          onClick={() => setSnowballTarget(value)}
                          className={`p-2 text-xs border rounded-lg hover:bg-blue-50 ${
                            snowballTarget === value ? 'bg-blue-100 border-blue-500' : ''
                          }`}
                        >
                          R$ {value.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    
                    {/* Campo livre para valor customizado */}
                    <div className="flex space-x-2 mt-2">
                      <input 
                        type="number" 
                        placeholder="Digite valor customizado (ex: 15000)"
                        value={customSnowballTarget}
                        onChange={(e) => setCustomSnowballTarget(e.target.value)}
                        className="flex-1 border rounded-lg px-3 py-2 text-sm"
                      />
                      <button 
                        onClick={() => setSnowballTarget(parseFloat(customSnowballTarget) || 500)}
                        className="bg-green-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-600"
                      >
                        Calcular
                      </button>
                    </div>
                  </div>
                  
                  {/* Cálculo para TODOS os FIIs */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Para R$ {snowballTarget.toLocaleString()}/mês em dividendos:</p>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {calculateSnowball(snowballTarget).map((fii, index) => (
                        <div key={index} className="p-2 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm">{fii.symbol}</span>
                            <span className="text-xs text-gray-600">Preço: {formatCurrency(fii.currentPrice)}</span>
                          </div>
                          <div className="text-xs text-gray-700 mt-1">
                            <p>• Tem: {fii.currentQuantity} cotas (R$ {fii.currentMonthlyIncome.toFixed(0)}/mês)</p>
                            <p>• Precisa: {fii.cotasNeeded} cotas total</p>
                            <p className="font-semibold text-red-600">• Falta investir: {formatCurrency(fii.missingInvestment)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Estratégia progressiva */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">🎯 Estratégia Progressiva</p>
                    <div className="text-xs text-green-700 space-y-1 mt-2">
                      <p>• Meta atual: R$ {snowballTarget.toLocaleString()}/mês</p>
                      <p>• Mês 7-12: Meta de R$ 300/mês (≈ 450 cotas)</p>
                      <p>• Mês 13-24: Meta de R$ 500/mês (≈ 750 cotas)</p>
                      <p>• Ano 3+: Meta de R$ 1.000/mês (≈ 1.500 cotas)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Análise de Oportunidades */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🔍 Oportunidades Identificadas</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-yellow-800">⚡ Setor Energia</p>
                    <p className="text-sm text-yellow-700">
                      CPLE6 com score 12/14 no Cerrado. Considere aumentar posição em energia elétrica.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-semibold text-purple-800">🌍 Diversificação Internacional</p>
                    <p className="text-sm text-purple-700">
                      Apenas 2.8% em ativos internacionais. Meta ARCA: 25%. Considere mais BDRs ou ETFs.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-semibold text-orange-800">🏢 FIIs de Qualidade</p>
                    <p className="text-sm text-orange-700">
                      BTLG11 (+12.67%) está performando bem. Considere FIIs de logística para diversificar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">⚡ Insights Rápidos</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-800">📊 Distribuição ARCA</p>
                    <p className="text-sm text-blue-700">
                      Sua carteira está desbalanceada. Priorize FIIs (+{(25 - (portfolioData?.portfolio_allocation?.allocation?.fiis?.percentage || 0)).toFixed(1)}%) e Internacional (+{(25 - (portfolioData?.portfolio_allocation?.allocation?.bitcoin?.percentage || 0)).toFixed(1)}%).
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">🌟 Top Performance</p>
                    <p className="text-sm text-green-700">
                      QBTC11 (+83.11%) lidera. Bitcoin está em alta, mas considere realizar lucros parciais.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-semibold text-red-800">⚠️ Atenção Necessária</p>
                    <p className="text-sm text-red-700">
                      TGAR11 (-18.92%) e PVBI11 (-16.31%) precisam de análise. Considere substituição.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Inteligente - NOVO */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🤖 Assistente Inteligente</h2>
                <p className="text-sm text-gray-600 mb-4">Faça perguntas sobre sua carteira, rebalanceamento, ou estratégias de investimento.</p>
                
                {/* Área de conversa - CORRIGIDA PARA MOBILE */}
                <div className="min-h-[200px] max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-3 bg-gray-50 mb-3">
                  <div className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                          message.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border border-gray-200 shadow-sm'
                        }`}>
                          <div className="whitespace-pre-wrap">{message.text}</div>
                          <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                          
                          {/* NOVO: Botões de confirmação para operações detectadas */}
                          {message.requiresConfirmation && message.operationId && (
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={() => confirmOperation(message.operationId)}
                                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                              >
                                ✅ Confirmar
                              </button>
                              <button
                                onClick={() => {
                                  // Remover operação detectada
                                  setDetectedOperations(prev => 
                                    prev.filter(op => op.id !== message.operationId)
                                  );
                                  // Adicionar mensagem de cancelamento
                                  const cancelMessage = {
                                    sender: 'assistant',
                                    text: '❌ Operação cancelada. Não foi feita nenhuma alteração na carteira.',
                                    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                  };
                                  setChatMessages(prev => [...prev, cancelMessage]);
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                              >
                                ❌ Cancelar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-3 rounded-lg text-sm shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Campo de entrada */}
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pergunte sobre seus investimentos..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isTyping}
                    className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
                  >
                    Enviar
                  </button>
                </div>
                
                {/* Sugestões de perguntas */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Sugestões:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Análise completa de estratégias",
                      "Como rebalancear minha carteira?",
                      "Qual ativo devo comprar agora?",
                      "Como melhorar minha renda passiva?",
                      "Análise do QBTC11",
                      "Estratégia Warren Buffett",
                      "Score da minha carteira"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setChatInput(suggestion)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full border"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* NOVO: Botões de upload de imagem */}
                <div className="mt-3 flex justify-center space-x-3">
                  <label className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-green-600 flex items-center space-x-2">
                    <span>📷</span>
                    <span>Câmera</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <label className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-purple-600 flex items-center space-x-2">
                    <span>🖼️</span>
                    <span>Galeria</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Status da conexão */}
                <div className="mt-3 text-xs text-gray-500 text-center">
                  🟢 Assistente local ativo • Respostas baseadas em seus dados
                  {processingOperation && (
                    <div className="mt-1 text-blue-600">
                      🔄 Processando operação...
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()
      )}

          {/* ABA APRENDA */}
          {activeTab === 'aprenda' && (
            <div className="space-y-4">
              {/* Método ARCA */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">📚 Método ARCA</h2>
                <div className="space-y-3 text-sm">
                  <p>
                    O método ARCA, criado por Thiago Nigro (Primo Rico), divide seus investimentos em 4 cestas:
                  </p>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <p className="font-semibold">A - Ações (25%)</p>
                    <p className="text-xs text-gray-600">Empresas brasileiras listadas na B3.</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="font-semibold">R - Real Estate (25%)</p>
                    <p className="text-xs text-gray-600">Fundos Imobiliários (FIIs) para renda passiva.</p>
                  </div>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <p className="font-semibold">C - Caixa/Renda Fixa (25%)</p>
                    <p className="text-xs text-gray-600">Reserva de emergência e investimentos seguros.</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <p className="font-semibold">A - Ativos Internacionais (25%)</p>
                    <p className="text-xs text-gray-600">Diversificação global (BDRs, ETFs, Bitcoin).</p>
                  </div>
                </div>
              </div>

              {/* Diagrama do Cerrado */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🎯 Diagrama do Cerrado</h2>
                <div className="space-y-3 text-sm">
                  <p>
                    Criado por Raul Sena, o Diagrama do Cerrado usa 14 critérios para avaliar ações:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-xs">1. ROE &gt; 15%</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-xs">2. ROIC &gt; 10%</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-xs">3. Margem Líq. &gt; 10%</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-xs">4. Dív/EBITDA &lt; 3</p>
                    </div>
                  </div>
                  <p>
                    Foco em setores perenes: energia elétrica, saneamento, seguradoras.
                  </p>
                </div>
              </div>

              {/* Estratégia Bola de Neve */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">❄️ Estratégia Bola de Neve</h2>
                <div className="space-y-3 text-sm">
                  <p>
                    A estratégia Bola de Neve consiste em reinvestir dividendos para comprar mais cotas, gerando um ciclo virtuoso:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Invista em ativos pagadores de dividendos</li>
                    <li>Reinvista os dividendos em mais cotas</li>
                    <li>Aumente sua renda passiva mensalmente</li>
                    <li>Defina metas: 1, 5, 10, 100 cotas/mês</li>
                  </ol>
                  <p className="text-xs text-gray-600">
                    Exemplo: Com 100 cotas de um FII pagando R$ 1/cota/mês, você recebe R$ 100/mês. Reinvestindo, em alguns meses terá 101 cotas, aumentando sua renda.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA DESCOBERTA */}
          {activeTab === 'descoberta' && (
            <div className="space-y-4">
              {/* Setores Perenes */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🌳 Setores Perenes</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-800">⚡ Energia Elétrica</p>
                    <p className="text-sm text-blue-700">
                      Setor defensivo com dividendos consistentes. Exemplos: EGIE3, CPLE6, TAEE11.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">💧 Saneamento</p>
                    <p className="text-sm text-green-700">
                      Monopólio natural com receitas previsíveis. Exemplos: SBSP3, SAPR11.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-semibold text-purple-800">🏦 Seguradoras</p>
                    <p className="text-sm text-purple-700">
                      Modelo de negócio resiliente. Exemplos: BBSE3, PSSA3, SULA11.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tendências Emergentes */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🚀 Tendências Emergentes</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-semibold text-yellow-800">☢️ Urânio</p>
                    <p className="text-sm text-yellow-700">
                      Energia nuclear em expansão global. Considere ETFs como URA.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">🌱 Energia Renovável</p>
                    <p className="text-sm text-green-700">
                      Transição energética global. Exemplos: CSRN3, NEOE3.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-800">🔋 Lítio e Baterias</p>
                    <p className="text-sm text-blue-700">
                      Essencial para veículos elétricos. Considere ETFs como LIT.
                    </p>
                  </div>
                </div>
              </div>

              {/* FIIs por Segmento */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">🏢 FIIs por Segmento</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="font-semibold text-blue-800">📦 Logística</p>
                    <p className="text-sm text-blue-700">
                      Galpões logísticos com contratos atípicos. Exemplos: BTLG11, VILG11.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="font-semibold text-purple-800">🏬 Shopping Centers</p>
                    <p className="text-sm text-purple-700">
                      Exposição ao varejo e consumo. Exemplos: VISC11, XPML11.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-semibold text-green-800">📝 Recebíveis</p>
                    <p className="text-sm text-green-700">
                      Renda fixa imobiliária. Exemplos: KNCR11, KNIP11.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de informações fundamentalistas */}
      {renderFundamentalInfoModal()}

      {/* Componente de Gerenciamento de Ativos */}
      <AssetManagement 
        showAssetManager={showAssetManager}
        setShowAssetManager={setShowAssetManager}
        onAssetAdded={async (asset) => {
          // Recarregar dados após adicionar ativo
          await loadPortfolioData()
        }}
        portfolioData={portfolioData}
      />
    </div>
  )
}

export default App
