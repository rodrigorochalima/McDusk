import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// IMPORTAES DOS NOVOS MDULOS
import { searchAssets, getAssetDetails, validateAsset, getCurrentPrice } from './b3-api';
import { 
  loadPortfolio, 
  savePortfolio, 
  addAssetToPortfolio, 
  removeAssetFromPortfolio, 
  editAssetInPortfolio,
  getOperationsHistory,
  logOperation 
} from './portfolio-manager';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [activeTab, setActiveTab] = useState('visao');
  const [currentView, setCurrentView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [showFundamentalInfo, setShowFundamentalInfo] = useState(null);
  
  // Estados do chat inteligente
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'assistant',
      text: 'Ol! Sou seu assistente de investimentos. Posso ajudar com anlises da sua carteira, estratgias e recomendaes. Como posso ajudar?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Estados para gerenciamento da carteira local
  const [localPortfolio, setLocalPortfolio] = useState(null);
  const [pendingOperations, setPendingOperations] = useState([]);
  const [operationHistory, setOperationHistory] = useState([]);
  
  // Estados para processamento de operaes (NOVO - MDULO IA)
  const [uploadedImages, setUploadedImages] = useState([]);
  const [processingOperation, setProcessingOperation] = useState(false);
  const [detectedOperations, setDetectedOperations] = useState([]);
  const [operationQueue, setOperationQueue] = useState([]);
  
  // Estados para simulador ARCA e calculadora bola de neve
  const [rebalanceAmount, setRebalanceAmount] = useState('');
  const [rebalanceCalculation, setRebalanceCalculation] = useState({
    fiis: 0,
    internacional: 0,
    rendaFixa: 0
  });
  const [snowballTarget, setSnowballTarget] = useState(500);
  const [customSnowballTarget, setCustomSnowballTarget] = useState('');
  
  // NOVO: Estado para Performance (integrado cirurgicamente)
  const [showPerformance, setShowPerformance] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState('ipca');
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [performanceData, setPerformanceData] = useState(null);

  // NOVO: Estados para aba Gesto
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [assetModalType, setAssetModalType] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [assetSearchResults, setAssetSearchResults] = useState([]);
  const [newAssetData, setNewAssetData] = useState({
    symbol: '',
    quantity: '',
    price: '',
    type: 'acao' // 'acao', 'fii', 'internacional', 'renda_fixa'
  });
  const [managementHistory, setManagementHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // NOVO: Estados para operaes avanadas de compra/venda
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeModalType, setTradeModalType] = useState('buy'); // 'buy', 'sell'
  const [selectedAssetForTrade, setSelectedAssetForTrade] = useState(null);
  const [tradeData, setTradeData] = useState({
    quantity: '',
    price: '',
    reason: '',
    aiSuggestion: null
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tradeImpactAnalysis, setTradeImpactAnalysis] = useState(null);
  const [aiTradeRecommendations, setAiTradeRecommendations] = useState([]);
  const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState(false);

  // Carregar dados
  useEffect(() => {
    fetchData();
    
    // Atualizar a cada minuto
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const fetchData = async () => {
    try {
      // Dados reais com APENAS os 24 ativos que o usurio informou
      const data = {
        portfolio_allocation: {
          total_value: 386237.43,
          total_result: 36851.52,
          allocation: {
            renda_variavel: { 
              name: 'Aes', 
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
                    buffett: { status: 'NEUTRO', reason: 'Warren no investe em criptomoedas, mas  um hedge contra inflao' }
                  },
                  description: 'ETF que busca replicar a variao do preo do Bitcoin em reais.'
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
                    cerrado: { status: 'COMPRAR', reason: 'Banco slido com bons fundamentos' },
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Ativos Internacionais (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Warren  acionista do Bank of America, banco com vantagem competitiva' }
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
                    arca: { status: 'MANTER', reason: 'Faz parte da cesta de Aes (25%)' },
                    buffett: { status: 'COMPRAR', reason: 'Empresa com vantagem competitiva e gerao de caixa consistente' }
  