import React, { useState } from "react";
import axios from "axios";

const CheckDisease = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection
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

  // Handle file upload and prediction
  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsLoading(true);

      // Step 1: Get prediction
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPrediction(response.data);

      // Step 2: Get patientId and token from local storage
      const token = localStorage.getItem("patient_token");
      const patientId = localStorage.getItem("patient_id");

      if (!token || !patientId) {
        throw new Error("No token or patientId found in local storage");
      }

      const diseaseName = response.data.details.name;
      const diseaseDescription = response.data.details.description;

      // Step 3: Send disease data to /api/v1/patient/disease
      await axios.post("http://localhost:8000/api/v1/patient/disease", {
        patientId: parseInt(patientId),
        name: diseaseName,
        description: diseaseDescription,
      });

      console.log("Disease added successfully for patient ID", patientId);
    } catch (error) {
      console.error("Error during prediction or disease creation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Check Disease</h1>

      {/* File Upload */}
      <div className="mb-6">
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="fileInput"
          className="block w-full py-2 px-4 bg-blue-500 text-white rounded cursor-pointer text-center hover:bg-blue-600"
        >
          {selectedFile ? "Change Image" : "Upload Image"}
        </label>

        {previewImage && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-60 rounded-md"
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isLoading}
          className="w-full py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? "Analyzing..." : "Submit"}
        </button>
      </div>

      {/* Prediction Result */}
      {prediction && (
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="font-semibold text-lg mb-2">
            Prediction: {prediction.details.name}
          </h2>
          <p className="text-sm mb-2">
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
          <p className="text-sm mt-2">
            <strong>Recommended Action:</strong>{" "}
            {prediction.details.recommended_action}
          </p>
          <div className="mt-4 text-xs italic text-gray-500">
            Note: This is a preliminary analysis. Consult a healthcare
            professional.
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckDisease;
