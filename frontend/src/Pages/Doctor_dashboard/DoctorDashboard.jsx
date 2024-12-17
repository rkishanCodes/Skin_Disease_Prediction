import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Doctor/Navbar";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prescription, setPrescription] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/doctor/patients/");
        setPatients(response.data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);
  
  const handlePrescriptionSubmit = async () => {
    if (!selectedPatient) {
      alert("No patient selected.");
      return;
    }
  
    const doctorId = parseInt(localStorage.getItem("doctor_id"));
    const diseaseId = selectedPatient.diseases[0]?.id;
  
    if (!doctorId) {
      console.error("Missing doctorId");
      return alert("Doctor ID is missing.");
    }
  
    if (!diseaseId) {
      console.error("Missing diseaseId");
      return alert("Disease ID is missing.");
    }
  
    const payload = { doctorId, diseaseId, prescription };
  
    try {
      const response = await axios.post("http://localhost:8000/api/v1/doctor/prescribe", payload);
  
      if (response.status === 201) {
        alert("Prescription added successfully!");
        setIsModalOpen(false);
        setPrescription("");
      } else {
        console.error("Unexpected response:", response);
        alert("Unexpected server response.");
      }
    } catch (error) {
      console.error("Error adding prescription:", error.response?.data || error.message);
      alert("Failed to add prescription. Check the logs for details.");
    }
  };

  return (
    <div className=" bg-[#fb6b68] min-h-screen">
      <Navbar/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-lg font-bold mb-2 text-[#fb6b68]">{patient.username}</h2>
            <p className="text-sm mb-2">Age: {patient.age}</p>
            <p className="text-sm font-bold">Diseases:</p>
            <ul className="text-sm list-disc list-inside mb-4">
              {patient.diseases.map((disease) => (
                <li key={disease.id}>{disease.name}</li>
              ))}
            </ul>
            <button
              className="bg-[#fb6b68] text-white rounded-md mt-4 px-4 py-2 hover:bg-opacity-90"
              onClick={() => {
                setSelectedPatient(patient);
                setIsModalOpen(true);
              }}
            >
              Add Prescription
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-md">
            <h2 className="text-xl font-bold mb-4 text-[#fb6b68]">
              Add Prescription for {selectedPatient?.username}
            </h2>
            <textarea
              rows="6"
              className="w-full border rounded-md p-2 mb-4 focus:outline-[#fb6b68]"
              placeholder="Enter medicine details..."
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#fb6b68] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                onClick={handlePrescriptionSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
