import React from "react";
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
const {
  selectedFile,
  previewImage,
  prediction,
  loading: isLoading,
} = useSelector((state) => state.dashboard);
const [dragActive, setDragActive] = React.useState(false);

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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
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
    dispatch(setLoading(true));
    const response = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(setPrediction(response.data));

    const token = localStorage.getItem("patient_token");
    const patientId = localStorage.getItem("patient_id");

    if (!token || !patientId) {
      throw new Error("No token or patientId found in local storage");
    }

    const diseaseName = response.data.details.name;
    const diseaseDescription = response.data.details.description;

    await axios.post("http://localhost:8000/api/v1/patient/disease", {
      patientId: parseInt(patientId),
      name: diseaseName,
      description: diseaseDescription,
    });
  } catch (error) {
    console.error("Error during prediction or disease creation:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <motion.h1
            className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            AI Disease Detection
          </motion.h1>

          <motion.div className="mb-8" variants={itemVariants}>
            {!previewImage && (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-gray-500 mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-4h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-1">
                        Drag and drop an image here, or click to select
                      </p>
                    </div>
                  </motion.div>
                </label>
              </div>
            )}

            <AnimatePresence>
              {previewImage && (
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full max-h-80 object-cover"
                    />
                    <motion.button
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-70 hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className={`w-full py-3 mt-6 rounded-xl text-white font-semibold shadow-lg ${
                !selectedFile || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              }`}
              whileHover={!isLoading && selectedFile ? { scale: 1.02 } : {}}
              whileTap={!isLoading && selectedFile ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing Image...
                </motion.div>
              ) : (
                "Analyze Image"
              )}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-bold mb-4 text-blue-800">
                  {prediction.details.name}
                </h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-700 mb-4">
                    {prediction.details.description}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-2">
                        Risk Factors
                      </h3>
                      <ul className="list-none space-y-2">
                        {prediction.details.risk_factors.map(
                          (factor, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center text-gray-700"
                            >
                              <svg
                                className="w-4 h-4 mr-2 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {factor}
                            </motion.li>
                          )
                        )}
                      </ul>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white p-4 rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Recommended Action
                      </h3>
                      <p className="text-gray-700">
                        {prediction.details.recommended_action}
                      </p>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
                  >
                    <p className="text-sm text-yellow-800">
                      ⚠️ This is an AI-powered preliminary analysis. Please
                      consult with a healthcare professional for accurate
                      diagnosis and treatment.
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckDisease;
