// DoctorDashboard.js
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pill } from "lucide-react";
import { AuthContext } from "./Auth"; // Assuming the previous Auth context is imported

export const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/doctor/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients", error);
        logout();
        navigate("/login");
      }
    };

    if (token) {
      fetchPatients();
    }
  }, [token, logout, navigate]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Please select a patient");
      return;
    }

    try {
      await axios.post(
        "/api/doctor/prescribe",
        {
          patientId: selectedPatient.id,
          prescription: prescription,
          diseaseId: selectedPatient.diseaseId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Prescription submitted successfully");
      setPrescription("");
      setSelectedPatient(null);
    } catch (error) {
      console.error("Prescription submission failed", error);
      alert("Failed to submit prescription");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dr. {user.name} Dashboard</h1>
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

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl mb-4">Patient List</h2>
            <div className="max-h-[600px] overflow-y-auto">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className={`p-4 border mb-2 rounded cursor-pointer hover:bg-blue-50 ${
                    selectedPatient?.id === patient.id ? "bg-blue-100" : ""
                  }`}
                >
                  <div>
                    <strong>Name:</strong> {patient.username}
                    <p>
                      <strong>Email:</strong> {patient.email}
                    </p>
                    <p>
                      <strong>Age:</strong> {patient.age}
                    </p>
                    <p>
                      <strong>Recent Disease:</strong>{" "}
                      {patient.recentDisease || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl mb-4">Prescription</h2>
            {selectedPatient ? (
              <form onSubmit={handlePrescriptionSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Selected Patient</label>
                  <input
                    type="text"
                    value={selectedPatient.username}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Prescription Details</label>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    className="w-full p-2 border rounded h-40"
                    placeholder="Enter prescription details..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Submit Prescription
                </button>
              </form>
            ) : (
              <p className="text-gray-500">Select a patient to prescribe</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
