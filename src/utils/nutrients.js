export const nutrientDictionary = {
  "energy-kcal": {
    name: "Calories",
    description: "A measure of energy. Your body needs calories for energy to function and stay alive. Consuming too many can lead to weight gain.",
  },
  "proteins": {
    name: "Protein",
    description: "Essential for building and repairing tissues, muscles, and bones. It also plays a role in making enzymes and hormones.",
  },
  "carbohydrates": {
    name: "Carbohydrates",
    description: "The body's main source of energy. They are broken down into glucose, which fuels your cells, tissues, and organs.",
  },
  "sugars": {
    name: "Sugars",
    description: "A simple form of carbohydrate that provides quick energy. High amounts of added sugars can lead to health issues.",
  },
  "fat": {
    name: "Total Fat",
    description: "Important for absorbing vitamins, protecting organs, and providing energy. Try to choose healthy (unsaturated) fats.",
  },
  "saturated-fat": {
    name: "Saturated Fat",
    description: "Often found in animal products. High intake can raise cholesterol levels and increase heart disease risk.",
  },
  "fiber": {
    name: "Dietary Fiber",
    description: "A type of carbohydrate your body can't digest. It helps regulate blood sugar, keeps you feeling full, and supports digestion.",
  },
  "sodium": {
    name: "Sodium",
    description: "A mineral that helps control fluid balance and nerve function. Too much can lead to high blood pressure.",
  }
};

export const getNutrientInfo = (key) => {
  return nutrientDictionary[key] || { name: key, description: "Provides basic nutritional value." };
};