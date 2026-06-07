import { useRef, useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Camera, Loader2 } from 'lucide-react';

const CameraScanner = ({ onFoodRecognized }) => {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [error, setError] = useState(null);

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

  // Initialize camera
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for the video to load metadata to play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setStreamActive(true);
        };
      }
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      setError("Please allow camera permissions to scan food.");
      setStreamActive(false);
    }
  };

  // Stop camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  }, []);

  // Clean up stream on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  // Capture and classify
  const captureAndClassify = async () => {
    if (!model || !videoRef.current || !streamActive) return;

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
        // MobileNet predictions often look like "Granny Smith, apple"
        // Let's take the first prediction and split by comma to get the most general term, or use as is
        let topPrediction = predictions[0].className.split(',')[0].trim();
        
        // Sometimes it identifies generic things, pass it to parent
        onFoodRecognized(topPrediction);
        stopCamera();
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

  if (isLoadingModel) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">Loading AI Engine...</h3>
        <p className="text-sm text-gray-500 mt-2">Preparing to analyze your food.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Scan Your Food
        </h2>
      </div>

      <div className="relative aspect-[3/4] bg-black">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-900 text-white">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={startCamera}
              className="px-6 py-2 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            
            {!streamActive && !isClassifying && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                <button 
                  onClick={startCamera}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
              </div>
            )}

            {streamActive && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button 
                  onClick={captureAndClassify}
                  disabled={isClassifying}
                  className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full p-2 disabled:opacity-50 transition-opacity"
                >
                  <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors">
                    {isClassifying ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {streamActive && (
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 flex justify-between items-center">
          <span>Point the camera at your food</span>
          <button onClick={stopCamera} className="text-red-500 font-medium">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CameraScanner;