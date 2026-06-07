const HISTORY_KEY = 'nutritracker_history';
const MAX_HISTORY = 100;

export const saveScan = (scanData) => {
  try {
    const history = getHistory();
    const newScan = {
      ...scanData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    history.unshift(newScan);

    // Keep only the last 100 scans
    if (history.length > MAX_HISTORY) {
      history.pop();
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Failed to save scan history:", error);
    return false;
  }
};

export const getHistory = () => {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    if (historyStr) {
      return JSON.parse(historyStr);
    }
  } catch (error) {
    console.error("Failed to parse history from local storage:", error);
  }
  return [];
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear history:", error);
    return false;
  }
};

export const getDailySummary = () => {
  const history = getHistory();
  const today = new Date().toDateString();

  const dailyScans = history.filter(scan => {
    return new Date(scan.timestamp).toDateString() === today;
  });

  const summary = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  dailyScans.forEach(scan => {
    if (scan.nutriments) {
      summary.calories += Number(scan.nutriments['energy-kcal_100g'] || 0);
      summary.protein += Number(scan.nutriments['proteins_100g'] || 0);
      summary.carbs += Number(scan.nutriments['carbohydrates_100g'] || 0);
      summary.fat += Number(scan.nutriments['fat_100g'] || 0);
    }
  });

  return summary;
};
