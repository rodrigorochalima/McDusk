// Componente de Processamento de Imagens
// Interface para upload e análise de prints de operações

import { useState } from 'react'
import imageProcessingService from '../services/imageProcessingService'

const ImageProcessor = ({ 
  onOperationDetected, 
  onProcessingStart, 
  onProcessingEnd 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  // Manipular drag and drop
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Manipular drop de arquivo
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0])
    }
  }

  // Manipular seleção de arquivo
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImage(e.target.files[0])
    }
  }

  // Processar imagem
  const processImage = async (file) => {
    try {
      setProcessing(true)
      if (onProcessingStart) onProcessingStart()

      // Validar arquivo
      const validFormats = ['image/jpeg', 'image/png', 'image/webp']
      if (!validFormats.includes(file.type)) {
        throw new Error('Formato não suportado. Use JPEG, PNG ou WebP.')
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 10MB.')
      }

      // Processar com IA
      const result = await imageProcessingService.processOperationImage(file)
      setLastResult(result)

      if (result.success) {
        // Notificar operação detectada
        if (onOperationDetected) {
          onOperationDetected({
            id: Date.now(),
            ...result.data,
            fileName: file.name,
            confidence: result.confidence,
            timestamp: new Date(),
            status: 'detected'
          })
        }
      } else {
        alert(`Erro no processamento: ${result.error}`)
      }

    } catch (error) {
      console.error('Erro ao processar imagem:', error)
      alert(`Erro: ${error.message}`)
      setLastResult({
        success: false,
        error: error.message
      })
    } finally {
      setProcessing(false)
      if (onProcessingEnd) onProcessingEnd()
    }
  }

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${processing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {processing ? (
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="text-sm text-gray-600">
              Processando imagem com IA...
            </div>
            <div className="text-xs text-gray-500">
              Extraindo dados da operação
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl text-gray-400">📸</div>
            <div className="text-lg font-semibold text-gray-700">
              Envie um print da sua operação
            </div>
            <div className="text-sm text-gray-500">
              Arraste e solte aqui ou clique para selecionar
            </div>
            <div className="text-xs text-gray-400">
              Suporta JPEG, PNG e WebP (máx. 10MB)
            </div>
            
            <input 
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <label 
              htmlFor="image-upload"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors text-sm"
            >
              Selecionar Arquivo
            </label>
          </div>
        )}
      </div>

      {/* Resultado do Último Processamento */}
      {lastResult && (
        <div className={`p-4 rounded-lg border ${
          lastResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`text-lg ${
              lastResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {lastResult.success ? '✅' : '❌'}
            </div>
            <div className={`font-semibold text-sm ${
              lastResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {lastResult.success ? 'Operação Detectada!' : 'Erro no Processamento'}
            </div>
          </div>
          
          {lastResult.success ? (
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold">Ativo:</span> {lastResult.data.asset}
                </div>
                <div>
                  <span className="font-semibold">Tipo:</span> {
                    lastResult.data.type === 'buy' ? 'Compra' : 'Venda'
                  }
                </div>
                <div>
                  <span className="font-semibold">Quantidade:</span> {lastResult.data.quantity}
                </div>
                <div>
                  <span className="font-semibold">Preço:</span> R$ {lastResult.data.price?.toFixed(2)}
                </div>
              </div>
              
              <div className="text-xs text-green-700">
                <span className="font-semibold">Confiança:</span> {(lastResult.confidence * 100).toFixed(1)}%
              </div>
              
              <div className="text-xs text-green-600 mt-2">
                Operação adicionada à lista para confirmação
              </div>
            </div>
          ) : (
            <div className="text-sm text-red-700">
              {lastResult.error}
            </div>
          )}
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm font-semibold text-blue-800 mb-2">
          💡 Como usar:
        </div>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Tire um print da tela de confirmação da sua corretora</div>
          <div>• Certifique-se que o código do ativo, quantidade e preço estejam visíveis</div>
          <div>• A IA irá extrair os dados automaticamente</div>
          <div>• Confirme os dados antes de atualizar sua carteira</div>
        </div>
      </div>

      {/* Estatísticas de Processamento */}
      <div className="text-xs text-gray-500 text-center">
        Powered by IA • Processamento local seguro
      </div>
    </div>
  )
}

export default ImageProcessor
