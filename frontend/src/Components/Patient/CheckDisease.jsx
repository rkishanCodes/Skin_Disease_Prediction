import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  setPrediction,
  resetPrediction,
  setSelectedFile,
  setPreviewImage,
  setLoading,
} from "../../store/actions";

const CheckDisease = () => {
  const dispatch = useDispatch();
  const { selectedFile, previewImage, prediction, loading: isLoading } = useSelector(
    (state) => state.dashboard
  );

  const [dragActive, setDragActive] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorError, setShowDoctorError] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/patient/getdoctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(setSelectedFile(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setPreviewImage(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      dispatch(setSelectedFile(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setPreviewImage(reader.result));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    if (!selectedDoctor) {
      setShowDoctorError(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      dispatch(setLoading(true));
      const response = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { details } = response.data;

      if (!details?.name || !details?.description) {
        throw new Error("Prediction response is missing required details.");
      }

      dispatch(setPrediction(response.data));

      const token = localStorage.getItem("patient_token");
      const patientId = localStorage.getItem("patient_id");

      if (!token || !patientId) {
        throw new Error("No token or patientId found in local storage.");
      }

      await axios.post(
        "http://localhost:8000/api/v1/patient/disease",
        {
          patientId: parseInt(patientId, 10),
          doctorId: selectedDoctor.id,
          diseaseName: details.name,
          diseaseDescription: details.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error during prediction or disease creation:", error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <motion.div className="w-full max-w-2xl mx-auto" initial="hidden" animate="visible">
      <motion.div className="bg-white rounded-2xl shadow-xl p-8">
        <motion.h1 className="text-3xl font-bold text-center mb-8">
          AI Disease Detection
        </motion.h1>

        {/* Doctor Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Doctor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 rounded-lg border-2 cursor-pointer ${
                  selectedDoctor?.id === doctor.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowDoctorError(false);
                }}
              >
                <p>{doctor.username}</p>
                <p className="text-sm text-gray-500">{doctor.email}</p>
              </div>
            ))}
          </div>
          {showDoctorError && <p className="text-red-500 text-sm">Please select a doctor</p>}
        </div>

        {/* File Upload Section */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center ${
            dragActive ? "border-blue-500" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <label htmlFor="fileInput" className="cursor-pointer">
            <p>Drag and drop an image here, or click to select</p>
          </label>
        </div>

        {previewImage && (
          <div className="mt-4">
            <img src={previewImage} alt="Preview" className="w-full max-h-80 object-cover" />
            <button
              className="mt-2 text-red-500"
              onClick={() => {
                dispatch(setPreviewImage(null));
                dispatch(setSelectedFile(null));
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          className="w-full py-3 mt-6 rounded-xl text-white bg-blue-500"
          onClick={handleSubmit}
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? "Analyzing..." : "Analyze Image"}
        </button>

        {/* Prediction Results */}
        <AnimatePresence>
          {prediction && (
            <motion.div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h2>{prediction.details.name}</h2>
              <p>{prediction.details.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CheckDisease;
