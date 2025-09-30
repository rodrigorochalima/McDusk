// Componente de Gerenciamento de Ativos
// Interface completa para adicionar, editar e remover ativos

import { useState, useEffect } from 'react'
import yahooFinanceService from '../services/yahooFinanceService'
import dataService from '../services/dataService'

const AssetManagement = ({ 
  showAssetManager, 
  setShowAssetManager, 
  onAssetAdded,
  portfolioData 
}) => {
  const [assetSearch, setAssetSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    quantity: '',
    averagePrice: '',
    category: 'renda_variavel'
  })
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Buscar ativos com debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (assetSearch.length >= 2) {
      const timeout = setTimeout(async () => {
        setIsSearching(true)
        try {
          const results = await yahooFinanceService.searchAssets(assetSearch)
          setSearchResults(results)
        } catch (error) {
          console.error('Erro na busca:', error)
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      }, 500)

      setSearchTimeout(timeout)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [assetSearch])

  // Selecionar ativo da busca
  const selectAsset = (asset) => {
    setNewAsset(prev => ({
      ...prev,
      symbol: asset.symbol
    }))
    setAssetSearch(asset.symbol)
    setSearchResults([])
  }

  // Adicionar ativo à carteira
  const addAsset = async () => {
    if (!newAsset.symbol || !newAsset.quantity || !newAsset.averagePrice) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      // Obter cotação atual
      const quote = await yahooFinanceService.getQuote(newAsset.symbol)
      
      const assetData = {
        symbol: newAsset.symbol,
        quantity: parseInt(newAsset.quantity),
        current_price: quote?.price || parseFloat(newAsset.averagePrice),
        avg_price: parseFloat(newAsset.averagePrice),
        result: 0,
        result_percent: 0
      }

      // Calcular resultado se preço atual diferente do preço médio
      if (quote?.price) {
        const totalValue = assetData.quantity * assetData.current_price
        const totalCost = assetData.quantity * assetData.avg_price
        assetData.result = totalValue - totalCost
        assetData.result_percent = ((totalValue - totalCost) / totalCost) * 100
      }

      // Adicionar ao dataService
      await dataService.addAsset(assetData, newAsset.category)

      // Registrar operação
      await dataService.addOperation({
        type: 'buy',
        asset: newAsset.symbol,
        quantity: parseInt(newAsset.quantity),
        price: parseFloat(newAsset.averagePrice),
        totalValue: parseInt(newAsset.quantity) * parseFloat(newAsset.averagePrice),
        source: 'manual_add'
      })

      // Limpar formulário
      setNewAsset({
        symbol: '',
        quantity: '',
        averagePrice: '',
        category: 'renda_variavel'
      })
      setAssetSearch('')
      setSearchResults([])

      // Notificar componente pai
      if (onAssetAdded) {
        onAssetAdded(assetData)
      }

      // Fechar modal
      setShowAssetManager(false)

      alert(`Ativo ${newAsset.symbol} adicionado com sucesso!`)

    } catch (error) {
      console.error('Erro ao adicionar ativo:', error)
      alert('Erro ao adicionar ativo. Tente novamente.')
    }
  }

  // Mapear categoria para nome amigável
  const getCategoryName = (category) => {
    const names = {
      'renda_variavel': 'Ações',
      'fiis': 'FIIs',
      'bitcoin': 'Internacional/Crypto',
      'renda_fixa': 'Renda Fixa'
    }
    return names[category] || category
  }

  // Obter tipo de ativo baseado no símbolo
  const getAssetTypeFromSymbol = (symbol) => {
    if (symbol.endsWith('11')) return 'fiis'
    if (symbol.endsWith('34')) return 'bitcoin'
    if (symbol === 'BTC' || symbol.includes('BTC')) return 'bitcoin'
    return 'renda_variavel'
  }

  // Atualizar categoria automaticamente baseada no símbolo
  useEffect(() => {
    if (newAsset.symbol) {
      const detectedCategory = getAssetTypeFromSymbol(newAsset.symbol)
      if (detectedCategory !== newAsset.category) {
        setNewAsset(prev => ({
          ...prev,
          category: detectedCategory
        }))
      }
    }
  }, [newAsset.symbol])

  if (!showAssetManager) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Adicionar Ativo</h3>
          <button 
            onClick={() => setShowAssetManager(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Busca de Ativo com Yahoo Finance */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Buscar Ativo:
            </label>
            <div className="relative mt-1">
              <input 
                type="text"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Digite o código (ex: BTLG11, PETR4, WEGE3)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Indicador de carregamento */}
              {isSearching && (
                <div className="absolute right-3 top-2.5">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Dropdown de Resultados */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {searchResults.map((result, index) => (
                    <div 
                      key={index}
                      onClick={() => selectAsset(result)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm">{result.symbol}</div>
                          <div className="text-xs text-gray-600 truncate">{result.name}</div>
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {result.type}
                        </div>
                      </div>
                      {result.price && (
                        <div className="text-xs text-gray-500 mt-1">
                          R$ {result.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Digite pelo menos 2 caracteres para buscar
            </div>
          </div>

          {/* Categoria (auto-detectada) */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Categoria:
            </label>
            <select 
              value={newAsset.category}
              onChange={(e) => setNewAsset(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="renda_variavel">Ações</option>
              <option value="fiis">FIIs</option>
              <option value="bitcoin">Internacional/Crypto</option>
              <option value="renda_fixa">Renda Fixa</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Categoria detectada automaticamente baseada no código
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Quantidade: *
            </label>
            <input 
              type="number"
              min="1"
              value={newAsset.quantity}
              onChange={(e) => setNewAsset(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preço Médio */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Preço Médio: *
            </label>
            <input 
              type="number"
              step="0.01"
              min="0.01"
              value={newAsset.averagePrice}
              onChange={(e) => setNewAsset(prev => ({ ...prev, averagePrice: e.target.value }))}
              placeholder="103.21"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-xs text-gray-500 mt-1">
              Preço médio de compra em reais
            </div>
          </div>

          {/* Resumo */}
          {newAsset.quantity && newAsset.averagePrice && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-semibold text-blue-800 mb-1">
                Resumo da Operação:
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>Ativo: {newAsset.symbol || 'Não selecionado'}</div>
                <div>Categoria: {getCategoryName(newAsset.category)}</div>
                <div>Quantidade: {newAsset.quantity} cotas</div>
                <div>Preço médio: R$ {parseFloat(newAsset.averagePrice || 0).toFixed(2)}</div>
                <div className="font-semibold">
                  Valor total: R$ {(parseInt(newAsset.quantity || 0) * parseFloat(newAsset.averagePrice || 0)).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex space-x-3 pt-4">
            <button 
              onClick={() => setShowAssetManager(false)}
              className="flex-1 bg-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={addAsset}
              disabled={!newAsset.symbol || !newAsset.quantity || !newAsset.averagePrice}
              className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetManagement
