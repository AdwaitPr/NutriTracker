import { useState, useEffect } from 'react';
import { getHistory, clearHistory, getDailySummary } from '../utils/history';
import { Trash2, Calendar, Activity, Database, Flame, Beef, Wheat, Droplets } from 'lucide-react';

const HistoryView = () => {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);

  const loadData = () => {
    setHistory(getHistory());
    setSummary(getDailySummary());
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire scan history?")) {
      clearHistory();
      loadData();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-600" />
          Your History
        </h2>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {summary && history.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-2xl shadow-sm border border-indigo-100">
          <h3 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Today's Summary (per 100g estimates)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Calories</p>
                <p className="font-bold text-gray-800">{summary.calories.toFixed(0)} kcal</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50 flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <Beef className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Protein</p>
                <p className="font-bold text-gray-800">{summary.protein.toFixed(1)}g</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50 flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Carbs</p>
                <p className="font-bold text-gray-800">{summary.carbs.toFixed(1)}g</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-50 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">Fat</p>
                <p className="font-bold text-gray-800">{summary.fat.toFixed(1)}g</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
          <Database className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No scans yet</h3>
          <p className="text-gray-500 text-sm">Your scanned items will appear here securely. Data is stored only on your device.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-2">Past Scans (Last 100)</h3>
          {history.map((scan) => (
            <div key={scan.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 capitalize text-lg">{scan.foodName}</h4>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {formatDate(scan.timestamp)}
                </span>
              </div>

              {scan.nutriments ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {scan.nutriments['energy-kcal_100g'] !== undefined && (
                     <span className="text-xs font-medium bg-orange-50 text-orange-700 px-2 py-1 rounded-md flex items-center gap-1">
                       <Flame className="w-3 h-3" /> {Number(scan.nutriments['energy-kcal_100g']).toFixed(0)} kcal
                     </span>
                  )}
                  {scan.nutriments['proteins_100g'] !== undefined && (
                     <span className="text-xs font-medium bg-red-50 text-red-700 px-2 py-1 rounded-md flex items-center gap-1">
                       <Beef className="w-3 h-3" /> {Number(scan.nutriments['proteins_100g']).toFixed(1)}g
                     </span>
                  )}
                  {scan.nutriments['carbohydrates_100g'] !== undefined && (
                     <span className="text-xs font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded-md flex items-center gap-1">
                       <Wheat className="w-3 h-3" /> {Number(scan.nutriments['carbohydrates_100g']).toFixed(1)}g
                     </span>
                  )}
                  {scan.nutriments['fat_100g'] !== undefined && (
                     <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md flex items-center gap-1">
                       <Droplets className="w-3 h-3" /> {Number(scan.nutriments['fat_100g']).toFixed(1)}g
                     </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mt-1">No nutritional data available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;