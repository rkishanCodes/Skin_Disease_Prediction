import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescriptions } from "../../store/actions";
import Navbar from "../../Components/Patient/Navbar";
import CheckDisease from "../../components/Patient/CheckDisease";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Volume2, VolumeX, Download } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { prescriptions, loading } = useSelector((state) => state.dashboard);
  const [activeTab, setActiveTab] = React.useState("both");
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [currentUtterance, setCurrentUtterance] = React.useState(null);
  const dashboardRef = React.useRef(null);
  const patientId = localStorage.getItem("patient_id");
  const prediction = useSelector((state) => state.dashboard.prediction);

  React.useEffect(() => {
    dispatch(fetchPrescriptions(patientId));
  }, [dispatch, patientId]);

  const speakText = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentUtterance(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtterance(null);
    };
    setCurrentUtterance(utterance);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const generatePDF = async () => {
    if (!dashboardRef.current) return;

    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("medical-dashboard.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const tabVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.05, transition: { type: "spring", stiffness: 300 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        ref={dashboardRef}
      >
        {/* Download PDF Button */}
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            <Download size={20} />
            Download PDF
          </motion.button>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {["both", "checkDisease", "viewPrescription"].map((tab) => (
            <motion.button
              key={tab}
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === tab ? "active" : "inactive"}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full shadow-md transition-colors ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-50"
              }`}
            >
              {tab === "both"
                ? "All"
                : tab === "checkDisease"
                ? "Check Disease"
                : "View Prescription"}
            </motion.button>
          ))}
        </div>

        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6"
        >
          {(activeTab === "both" || activeTab === "checkDisease") && (
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Disease Checker
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      // Get prediction from Redux store

                      let textToSpeak = prediction
                        ? `Analysis Results: The disease detected is ${
                            prediction.details.name
                          }. 
         ${prediction.details.description}. 
         Risk factors include: ${prediction.details.risk_factors.join(", ")}. 
         Recommended action: ${prediction.details.recommended_action}`
                        : "Welcome to Disease Checker. Please upload an image for analysis.";

                      speakText(textToSpeak);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </motion.button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <CheckDisease />
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "both" || activeTab === "viewPrescription") && (
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Prescriptions
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      const prescriptionText =
                        prescriptions.length > 0
                          ? `You have ${
                              prescriptions.length
                            } prescriptions. ${prescriptions
                              .map(
                                (p) =>
                                  `For ${p.disease.name}, you were prescribed ${p.prescription} by Dr. ${p.doctor.username}`
                              )
                              .join(". ")}`
                          : "You have no prescriptions at this time.";
                      speakText(prescriptionText);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    {isSpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </motion.button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : prescriptions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prescriptions.map((prescription, index) => (
                      <motion.div
                        key={prescription.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow duration-300"
                      >
                        <h3 className="text-xl font-semibold text-blue-600">
                          {prescription.disease.name}
                        </h3>
                        <p className="text-gray-600 mt-2">
                          {prescription.disease.description}
                        </p>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="font-medium text-gray-800">
                            Prescribed Medicine: {prescription.prescription}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {prescription.doctor.username.charAt(0)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Dr. {prescription.doctor.username}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-8"
                  >
                    No prescriptions found.
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
