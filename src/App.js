import React, { useState, useEffect } from 'react';
import { Flower, Activity, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// URLs de los servidores API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' // Use Vercel proxy in production
  : 'https://3.149.156.68'; // Direct URL in development

const App = () => {
  const [apiHealth, setApiHealth] = useState('unknown');
  
  // Estados para Iris
  const [irisData, setIrisData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: ''
  });
  
  // Estados para resultados secuenciales
  const [irisResult, setIrisResult] = useState(null);
  const [irisLoading, setIrisLoading] = useState(false);
  const [irisError, setIrisError] = useState('');
  
  // Estados para benchmark
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [benchmarkError, setBenchmarkError] = useState('');
  
  // Estado para comparación
  const [isComparing, setIsComparing] = useState(false);

  // Verificar salud de la API al cargar
  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setApiHealth('healthy');
      } else {
        setApiHealth('unhealthy');
      }
    } catch (error) {
      console.error('Health check error:', error);
      setApiHealth('offline');
    }
  };

  // Manejar cambios en el formulario de Iris
  const handleIrisInputChange = (e) => {
    const { name, value } = e.target;
    setIrisData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Comparar ambos modelos simultáneamente
  const compareModels = async () => {
    setIsComparing(true);
    setIrisLoading(true);
    setBenchmarkLoading(true);
    setIrisError('');
    setBenchmarkError('');
    setIrisResult(null);
    setBenchmarkData(null);

    const requestData = {
      sepal_length: parseFloat(irisData.sepal_length),
      sepal_width: parseFloat(irisData.sepal_width),
      petal_length: parseFloat(irisData.petal_length),
      petal_width: parseFloat(irisData.petal_width)
    };

    // Ejecutar ambas predicciones en paralelo
    const [sequentialResponse, benchmarkResponse] = await Promise.allSettled([
      // Predicción secuencial
      fetch(`${API_BASE_URL}/predict/iris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error secuencial: ${response.status}`);
        }
        return await response.json();
      }),
      
      // Benchmark de performance
      fetch(`${API_BASE_URL}/benchmark/results`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Error benchmark: ${response.status}`);
        }
        return await response.json();
      })
    ]);

    // Procesar resultado secuencial
    if (sequentialResponse.status === 'fulfilled') {
      setIrisResult(sequentialResponse.value);
    } else {
      setIrisError(`Error al predecir (secuencial): ${sequentialResponse.reason.message}`);
    }
    setIrisLoading(false);

    // Procesar resultado benchmark
    if (benchmarkResponse.status === 'fulfilled') {
      setBenchmarkData(benchmarkResponse.value);
    } else {
      setBenchmarkError(`Error al obtener benchmark: ${benchmarkResponse.reason.message}`);
    }
    setBenchmarkLoading(false);

    setIsComparing(false);
  };

  // Limpiar formulario
  const clearForm = () => {
    setIrisData({
      sepal_length: '',
      sepal_width: '',
      petal_length: '',
      petal_width: ''
    });
    setIrisResult(null);
    setIrisError('');
    setBenchmarkData(null);
    setBenchmarkError('');
  };

  // Cargar datos de ejemplo
  const loadExampleData = () => {
    setIrisData({
      sepal_length: '5.1',
      sepal_width: '3.5',
      petal_length: '1.4',
      petal_width: '0.2'
    });
  };

  // Componente de estado de la API
  const APIStatus = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Activity className="w-5 h-5" />
        <span className="font-medium">Estado de la API:</span>
        <div className="flex items-center gap-2">
          {apiHealth === 'healthy' && <CheckCircle className="w-4 h-4 text-green-500" />}
          {apiHealth === 'unhealthy' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
          {apiHealth === 'offline' && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className={`text-sm ${
            apiHealth === 'healthy' ? 'text-green-600' : 
            apiHealth === 'unhealthy' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {apiHealth === 'healthy' ? 'Conectado' : 
             apiHealth === 'unhealthy' ? 'Problemas' : 'Desconectado'}
          </span>
        </div>
        <button 
          onClick={checkAPIHealth}
          className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
        >
          Verificar
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flower className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Clasificador de Flores Iris
          </h1>
        </div>
        <p className="text-gray-600">
          Identifica la especie de flor Iris basándose en las medidas de sépalos y pétalos
        </p>
      </div>

      <APIStatus />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Flower className="w-5 h-5 text-purple-600" />
            Medidas de la Flor
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud del Sépalo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="sepal_length"
                value={irisData.sepal_length}
                onChange={handleIrisInputChange}
                placeholder="Ej: 5.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancho del Sépalo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="sepal_width"
                value={irisData.sepal_width}
                onChange={handleIrisInputChange}
                placeholder="Ej: 3.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud del Pétalo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="petal_length"
                value={irisData.petal_length}
                onChange={handleIrisInputChange}
                placeholder="Ej: 1.4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancho del Pétalo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                name="petal_width"
                value={irisData.petal_width}
                onChange={handleIrisInputChange}
                placeholder="Ej: 0.2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={compareModels}
                disabled={isComparing || apiHealth !== 'healthy' || !irisData.sepal_length || !irisData.sepal_width || !irisData.petal_length || !irisData.petal_width}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {isComparing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Comparando Modelos...
                  </>
                ) : (
                  'Clasificar y Comparar Performance'
                )}
              </button>
            </div>

            <div className="flex gap-2 text-sm">
              <button
                onClick={loadExampleData}
                className="px-3 py-1 text-purple-600 border border-purple-300 rounded hover:bg-purple-50 transition-colors"
              >
                Datos de ejemplo
              </button>
              <button
                onClick={clearForm}
                className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div>
          {/* Resultado de Clasificación */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Resultado de Clasificación</h2>
            
            {irisError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  {irisError}
                </div>
              </div>
            )}
            
            {irisResult && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">
                    {irisResult.predicted_species}
                  </h3>
                  <div className="inline-block bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-blue-800 font-medium">
                      Confianza: {(irisResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="font-medium">Clase predicha:</span>
                    <span>{irisResult.predicted_class}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-white rounded">
                    <span className="font-medium">Timestamp:</span>
                    <span>{new Date(irisResult.timestamp).toLocaleString()}</span>
                  </div>
                  
                  {irisResult.all_predictions && (
                    <div className="p-3 bg-white rounded">
                      <div className="font-medium mb-2">Probabilidades por especie:</div>
                      <div className="space-y-1">
                        {irisResult.all_predictions.map((pred, idx) => {
                          const species = ['Setosa', 'Versicolor', 'Virginica'][idx] || `Especie ${idx}`;
                          return (
                            <div key={idx} className="flex justify-between text-xs">
                              <span>{species}:</span>
                              <span className={idx === irisResult.predicted_class ? 'font-bold text-blue-700' : ''}>
                                {(pred * 100).toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-white rounded">
                    <div className="font-medium mb-2">Datos utilizados:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Sép. L: {irisData.sepal_length} cm</div>
                      <div>Sép. A: {irisData.sepal_width} cm</div>
                      <div>Pét. L: {irisData.petal_length} cm</div>
                      <div>Pét. A: {irisData.petal_width} cm</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!irisResult && !irisError && !irisLoading && (
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Flower className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  Introduce las medidas de la flor para obtener la clasificación
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benchmark Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Benchmark: Secuencial vs Paralelo
        </h2>
        
        {benchmarkError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              {benchmarkError}
            </div>
          </div>
        )}

        {benchmarkLoading && (
          <div className="text-center p-8">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-600" />
            <p className="text-gray-500">Obteniendo datos de benchmark...</p>
          </div>
        )}

        {benchmarkData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-800">
                    {benchmarkData.summary.speedup.toFixed(2)}x
                  </div>
                  <div className="text-sm text-purple-600">Speedup</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-800">
                    {(benchmarkData.summary.efficiency * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-green-600">Eficiencia</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">
                    {benchmarkData.summary.cpu_cores_used}
                  </div>
                  <div className="text-sm text-blue-600">CPU Cores</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-800">
                    {benchmarkData.summary.time_saved.toFixed(2)}s
                  </div>
                  <div className="text-sm text-orange-600">Tiempo Ahorrado</div>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Sequential Results */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Procesamiento Secuencial
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Tiempo Total:</span>
                    <span>{benchmarkData.sequential.total_time.toFixed(3)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Memoria Usada:</span>
                    <span>{benchmarkData.sequential.memory_used.toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">CPU Cores:</span>
                    <span>{benchmarkData.sequential.cpu_count}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="font-medium mb-2">Resultados por Modelo:</div>
                    <div className="space-y-2">
                      {benchmarkData.sequential.results.map((result, idx) => (
                        <div key={idx} className="bg-white p-3 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Modelo {result.model_id}</span>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                              {result.training_time.toFixed(3)}s
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Estimadores: {result.params.n_estimators}, Profundidad: {result.params.max_depth}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parallel Results */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Procesamiento Paralelo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Tiempo Total:</span>
                    <span>{benchmarkData.parallel.total_time.toFixed(3)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Memoria Usada:</span>
                    <span>{benchmarkData.parallel.memory_used.toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">CPU Cores:</span>
                    <span>{benchmarkData.parallel.cpu_count}</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="font-medium mb-2">Resultados por Modelo:</div>
                    <div className="space-y-2">
                      {benchmarkData.parallel.results.map((result, idx) => (
                        <div key={idx} className="bg-white p-3 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Modelo {result.model_id}</span>
                            <span className="text-xs bg-green-100 px-2 py-1 rounded">
                              {result.training_time.toFixed(3)}s
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Estimadores: {result.params.n_estimators}, Profundidad: {result.params.max_depth}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-center text-sm text-gray-500">
              Benchmark realizado: {benchmarkData.timestamp}
            </div>
          </div>
        )}

        {!benchmarkData && !benchmarkError && !benchmarkLoading && (
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              Haz clic en "Clasificar y Comparar Performance" para ver el benchmark
            </p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">Sobre el clasificador Iris</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            Este clasificador utiliza machine learning para identificar tres especies de flores Iris:
            <strong> Setosa, Versicolor y Virginica</strong>.
          </p>
          <p>
            Las medidas se toman en centímetros y se basan en la longitud y ancho de sépalos y pétalos.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>Clasificador ML de Flores Iris</p>
      </div>
    </div>
  );
};

export default App;