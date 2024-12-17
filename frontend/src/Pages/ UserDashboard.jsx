// UserDashboard.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileText, Mic, Image } from "lucide-react";
import { AuthContext } from "./Auth"; // Assuming the previous Auth context is imported

export const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);

        const recordsResponse = await axios.get("/api/user/medical-records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicalRecords(recordsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
        logout();
        navigate("/login");
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, logout, navigate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("/api/upload/skin-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    }
  };

  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get("/api/user/medical-report", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medical_report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {userData.username}</h1>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl mb-4">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Username:</strong> {userData.username}
            </div>
            <div>
              <strong>Email:</strong> {userData.email}
            </div>
            <div>
              <strong>Age:</strong> {userData.age}
            </div>
            <div>
              <strong>Gender:</strong> {userData.gender}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl mb-4 flex items-center">
            Upload Skin Image <Image className="ml-2 text-blue-500" />
          </h2>
          <div className="border-2 border-dashed border-gray-300 p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
            >
              <Image className="mr-2" /> Upload Skin Image
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl mb-4 flex items-center">
            Medical Records <Pill className="ml-2 text-green-500" />
          </h2>
          {medicalRecords.length === 0 ? (
            <p className="text-gray-500">No medical records found.</p>
          ) : (
            medicalRecords.map((record, index) => (
              <div key={index} className="border p-4 mb-4 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Disease:</strong> {record.diseaseName}
                    <p>
                      <strong>Prescription:</strong> {record.prescription}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleTextToSpeech(
                        `Disease: ${record.diseaseName}. Prescription: ${record.prescription}`
                      )
                    }
                    className="bg-blue-100 p-2 rounded"
                  >
                    <Mic className="text-blue-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <FileText className="mr-2" /> Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
