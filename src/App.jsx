import { useState } from 'react';
import CameraScanner from './components/CameraScanner';
import { fetchNutritionalData } from './utils/api';
import { getNutrientInfo } from './utils/nutrients';
import { Leaf, Info, Loader2, ArrowLeft } from 'lucide-react';
import './App.css';

function App() {
  const [view, setView] = useState('home'); // 'home', 'scanning', 'results'
  const [foodItem, setFoodItem] = useState('');
  const [loadingData, setLoadingData] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(null);

  const handleFoodRecognized = async (foodName) => {
    setFoodItem(foodName);
    setView('results');
    setLoadingData(true);
    setError(null);

    const result = await fetchNutritionalData(foodName);
    
    if (result.success) {
      setNutritionData(result);
    } else {
      setError(result.error);
    }
    
    setLoadingData(false);
  };

  const resetScanner = () => {
    setFoodItem('');
    setNutritionData(null);
    setError(null);
    setView('home');
  };

  // Nutrients to highlight if they exist in the API response
  const targetNutrients = [
    'energy-kcal', 'proteins', 'carbohydrates', 'sugars', 'fat', 'saturated-fat', 'fiber', 'sodium'
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-600">
            <Leaf className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight">Smart NutriTracker</h1>
          </div>
          {view !== 'home' && (
            <button 
              onClick={resetScanner}
              className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        {view === 'home' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md">
              <h2 className="text-2xl font-bold mb-2">Track Your Food</h2>
              <p className="text-green-50 mb-6">Scan your food using AI to instantly discover its nutritional value and health benefits.</p>
              <button 
                onClick={() => setView('scanning')}
                className="w-full bg-white text-green-700 py-3 rounded-xl font-bold shadow-sm hover:bg-green-50 transition-colors"
              >
                Start Scanning
              </button>
            </div>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" /> How it works
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>Uses completely free on-device AI to identify food.</li>
                <li>Queries public databases for nutritional facts.</li>
                <li>Explains what each nutrient does for your body.</li>
                <li>No account or sign-up required.</li>
              </ul>
            </div>
          </div>
        )}

        {view === 'scanning' && (
          <div className="space-y-4">
            <p className="text-center text-gray-600 text-sm mb-2">Ensure good lighting for better results</p>
            <CameraScanner onFoodRecognized={handleFoodRecognized} />
          </div>
        )}

        {view === 'results' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <h2 className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Identified As</h2>
              <h3 className="text-2xl font-bold text-gray-900 capitalize">{foodItem}</h3>
            </div>

            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin mb-4" />
                <p className="text-gray-600">Fetching nutritional facts...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-5 rounded-2xl border border-red-100 text-center">
                <p className="mb-4">{error}</p>
                <button 
                  onClick={() => setView('scanning')}
                  className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700"
                >
                  Try scanning again
                </button>
              </div>
            ) : nutritionData && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">Nutritional Facts & Benefits</h3>
                <p className="text-xs text-gray-500 mb-4">Values are approximate per 100g based on public databases.</p>
                
                {targetNutrients.map((nutrientKey) => {
                  const val_100g = nutritionData.nutriments[`${nutrientKey}_100g`];
                  const unit = nutritionData.nutriments[`${nutrientKey}_unit`] || (nutrientKey === 'energy-kcal' ? 'kcal' : 'g');
                  
                  if (val_100g === undefined) return null;

                  const info = getNutrientInfo(nutrientKey);

                  return (
                    <div key={nutrientKey} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{info.name}</span>
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {Number(val_100g).toFixed(1)} {unit}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg leading-relaxed">
                        {info.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!loadingData && (
              <button 
                onClick={() => setView('scanning')}
                className="w-full mt-6 bg-gray-100 text-gray-800 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-200 transition-colors"
              >
                Scan Another Item
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;