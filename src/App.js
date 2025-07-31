import React, { useState, useEffect } from 'react';
import { Flower, Activity, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// Usar directamente la URL del servidor API
const API_BASE_URL = 'http://3.13.70.131:8000';

const App = () => {
  const [apiHealth, setApiHealth] = useState('unknown');
  
  // Estados para Iris
  const [irisData, setIrisData] = useState({
    sepal_length: '',
    sepal_width: '',
    petal_length: '',
    petal_width: ''
  });
  const [irisResult, setIrisResult] = useState(null);
  const [irisLoading, setIrisLoading] = useState(false);
  const [irisError, setIrisError] = useState('');

  // Verificar salud de la API al cargar
  useEffect(() => {
    checkAPIHealth();
  }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setApiHealth('healthy');
      } else {
        setApiHealth('unhealthy');
      }
    } catch (error) {
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

  // Predecir Iris
  const predictIris = async () => {
    setIrisLoading(true);
    setIrisError('');
    setIrisResult(null);

    try {
      const requestData = {
        sepal_length: parseFloat(irisData.sepal_length),
        sepal_width: parseFloat(irisData.sepal_width),
        petal_length: parseFloat(irisData.petal_length),
        petal_width: parseFloat(irisData.petal_width)
      };

      const response = await fetch(`${API_BASE_URL}/predict/iris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setIrisResult(result);
    } catch (error) {
      setIrisError(`Error al predecir: ${error.message}`);
    } finally {
      setIrisLoading(false);
    }
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
                onClick={predictIris}
                disabled={irisLoading || apiHealth !== 'healthy' || !irisData.sepal_length || !irisData.sepal_width || !irisData.petal_length || !irisData.petal_width}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                {irisLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Clasificando...
                  </>
                ) : (
                  'Clasificar Especie'
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  {irisResult.predicted_species}
                </h3>
                <div className="inline-block bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 font-medium">
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
                            <span className={idx === irisResult.predicted_class ? 'font-bold text-green-700' : ''}>
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