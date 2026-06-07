# Smart NutriTracker 🥑✨

> **Next-Generation, Privacy-First, On-Device AI Calorie & Nutrition Tracker**

Smart NutriTracker is a modern, lightweight web application that enables users to scan their food using advanced, on-device artificial intelligence to instantly discover its nutritional value and health benefits. By utilizing client-side machine learning, it processes camera feeds instantly with zero server latency, maintaining complete user privacy.

---

## 🚀 Key Features

*   🧠 **On-Device Computer Vision**: Powered by **TensorFlow.js** and the **MobileNet v2** neural network, allowing instant food classification directly inside your browser. No video frames or images are ever uploaded to a server.
*   📊 **Deep Nutritional Insights**: Automatically fetches detailed nutritional profiles (calories, proteins, carbohydrates, sugars, fiber, fats, and sodium) per 100g.
*   💡 **Educational Nutrient Descriptions**: Learn *how* each nutrient functions in your body. Every metric comes with a clear, concise explanation of its physiological benefits (e.g., muscle recovery, sustained energy, or digestive support).
*   🔒 **Privacy-First Architecture**: No accounts, no sign-ups, no cookies, and no cloud-side processing. All camera streams and image captures remain local to your device.
*   ⚡ **Fluid & Premium UX**: Built with React, Vite, Tailwind CSS, and Lucide React, featuring smooth entrance transitions, responsive design for mobile screens, and clean glassmorphism.

---

## 🛠️ Technology Stack

*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) (for ultra-fast development and build times)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (modern responsive utility framework)
*   **Machine Learning**: [TensorFlow.js](https://js.tensorflow.org/) & [MobileNet v2 Model](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **API Sources**: Public Open Food Facts & USDA-mapped nutritional profiles

---

## 🔍 How it Works

1.  **AI Initialization**: The app downloads and prepares the lightweight MobileNet model on startup.
2.  **Local Capture**: When you capture a photo of your food, a snapshot is drawn onto an in-memory HTML5 canvas.
3.  **Local Classification**: TensorFlow.js classifies the canvas pixels and extracts the most probable food label.
4.  **Nutrient Mapping**: The label is queried against a nutritional API to map calories and macros.
5.  **Smart Delivery**: The results are displayed along with dynamic descriptions detailing the physiological impact of the food you are eating.

---

## 🚀 Quick Start / Development

If you want to run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd calorie-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌎 Hosting on GitHub Pages (Bonus)

Because the project can be built as a single static bundle, you can easily host it for free on GitHub Pages:
1. Create a repository on GitHub.
2. Link your local directory to it.
3. Go to **Settings > Pages** on your repo, select your deploy branch, and view your live app instantly!
