import { useState, useRef, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, Loader2 } from 'lucide-react';
import { ResultsBottomSheet } from './ResultsBottomSheet';
import { fetchNutritionalData } from '../utils/api';
import { saveScan } from '../utils/history';

// Helper to determine status based on nutrient thresholds per 100g (Simplified rules)
const getNutrientStatus = (nutrient, value) => {
  if (nutrient === 'Protein' && value > 15) return 'optimal';
  if (nutrient === 'Fats' && value > 20) return 'warning';
  if (nutrient === 'Carbs' && value > 50) return 'warning';
  if (nutrient === 'Sugars' && value > 15) return 'danger';
  if (nutrient === 'Sodium' && value > 1) return 'danger';
  return 'neutral';
};

export const MainScannerView = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState(null);

  const [model, setModel] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);

  const videoRef = useRef(null);

  // Load the MobileNet model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        setModel(loadedModel);
        setIsLoadingModel(false);
      } catch (err) {
        console.error("Failed to load model:", err);
        setError("Failed to load the AI model. Please check your connection.");
        setIsLoadingModel(false);
      }
    };
    loadModel();
  }, []);

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Initialize camera
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
        };
      }
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      setError("Please allow camera permissions to scan food.");
      setCameraActive(false);
    }
  };

  // Clean up stream on unmount
  useEffect(() => {
    // Initial camera start
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();

    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScanClick = async () => {
    if (!model || !videoRef.current || !cameraActive) return;

    setIsClassifying(true);
    try {
      // Create a canvas to draw the current video frame
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Classify the image
      const predictions = await model.classify(canvas);

      if (predictions && predictions.length > 0) {
        let topPrediction = predictions[0].className.split(',')[0].trim();

        // Stop the camera once we get a prediction so we have a static frame
        stopCamera();

        // Open the sheet to show loading state for the api request
        setIsSheetOpen(true);
        setIsLoadingData(true);

        // Fetch real data
        const result = await fetchNutritionalData(topPrediction);

        if (result.success) {
          // Format for Bento Box
          const nutriments = result.nutriments;

          const getVal = (key) => Number(nutriments[`${key}_100g`] || 0).toFixed(1);
          const getUnit = (key) => nutriments[`${key}_unit`] || 'g';

          const caloriesVal = getVal('energy-kcal');
          const proteinVal = getVal('proteins');
          const carbsVal = getVal('carbohydrates');
          const fatsVal = getVal('fat');

          const formattedData = {
            itemName: topPrediction,
            primaryMacro: {
              label: "Calories",
              value: caloriesVal,
              unit: "kcal",
              icon: "Flame"
            },
            subMacros: [
              { label: "Protein", value: proteinVal, unit: getUnit('proteins'), status: getNutrientStatus('Protein', proteinVal) },
              { label: "Carbs", value: carbsVal, unit: getUnit('carbohydrates'), status: getNutrientStatus('Carbs', carbsVal) },
              { label: "Fats", value: fatsVal, unit: getUnit('fat'), status: getNutrientStatus('Fats', fatsVal) }
            ],
            healthInsights: []
          };

          // Generate some health insights based on macros
          if (proteinVal > 15) {
            formattedData.healthInsights.push({ text: "High Protein", icon: "Activity", colorTheme: "emerald" });
          }
          if (getVal('fiber') > 5) {
            formattedData.healthInsights.push({ text: "Good Source of Fiber", icon: "Leaf", colorTheme: "emerald" });
          }
          if (getVal('sugars') > 15) {
            formattedData.healthInsights.push({ text: "High Sugar Content", icon: "Info", colorTheme: "amber" });
          }

          if (formattedData.healthInsights.length === 0) {
             formattedData.healthInsights.push({ text: "Standard Macros", icon: "Info", colorTheme: "blue" });
          }

          setScanData(formattedData);

          // Save to history using old structure format or new format
          saveScan({
            foodName: topPrediction,
            nutriments: result.nutriments,
          });

        } else {
          setError(result.error || "Failed to fetch nutritional data.");
        }
        setIsLoadingData(false);

      } else {
        setError("Could not identify any food. Please try again.");
      }
    } catch (err) {
      console.error("Classification error:", err);
      setError("Failed to analyze the image.");
    } finally {
      setIsClassifying(false);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    // When closing the sheet, we're back to scanning
    if (!cameraActive) {
      startCamera();
    }
  };

  return (
    <div className="relative w-full h-screen max-w-md mx-auto overflow-hidden bg-gray-900 text-white">
      {/* Background Camera Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient for better visibility of UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-gray-900/40"></div>
      </div>

      {/* Main UI Overlay (z-10) */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6 pointer-events-none">

        {/* Header */}
        <div className="flex justify-center pt-8 pointer-events-auto">
           {isLoadingModel ? (
             <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin text-white" />
               <span className="text-sm font-medium tracking-wide">Loading AI...</span>
             </div>
           ) : error ? (
             <div className="bg-red-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm text-center">
               {error}
               <button
                 onClick={startCamera}
                 className="block mt-2 font-bold underline w-full"
               >
                 Retry Camera
               </button>
             </div>
           ) : (
             <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
               <span className="text-sm font-medium tracking-wide">
                 {cameraActive ? 'Camera Active' : 'Camera Inactive'}
               </span>
             </div>
           )}
        </div>

        {/* Scan FAB Container */}
        <div className="flex justify-center pb-8 pointer-events-auto">
          <button
            onClick={handleScanClick}
            disabled={!cameraActive || isClassifying || isLoadingData}
            className="group relative flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full p-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="w-full h-full bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center text-gray-900 transition-transform group-hover:scale-95">
              {isClassifying || isLoadingData ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Results Bottom Sheet */}
      <ResultsBottomSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        data={scanData}
        isLoading={isLoadingData}
        error={error}
      />
    </div>
  );
};
