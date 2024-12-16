import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Skin Condition Classifier
        </h1>

        {/* File Upload Section */}
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer text-center block"
          >
            {selectedFile ? selectedFile.name : "Select Image"}
          </label>
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div className="mb-4 flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-64 rounded-md shadow-sm"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? "Analyzing..." : "Predict Skin Condition"}
        </button>

        {/* Prediction Result */}
        {prediction && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Prediction: {prediction.details.name}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {/* Confidence: {prediction.confidence}% */}
            </p>
            <div className="space-y-2">
              <p>
                <strong>Description:</strong> {prediction.details.description}
              </p>
              <div>
                <strong>Risk Factors:</strong>
                <ul className="list-disc list-inside text-sm">
                  {prediction.details.risk_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Recommended Action:</strong>{" "}
                {prediction.details.recommended_action}
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-500 italic">
              Note: This is a preliminary analysis. Always consult a healthcare
              professional for accurate diagnosis.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
