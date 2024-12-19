import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Doctor/Navbar";
import getPatient from "../../Utils/GetPatients";
import givePrescription from "../../Utils/GivePescription";

const GivePrescription = () => {
  const [patients, setPatients] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const doctor_id = parseInt(localStorage.getItem("doctor_id"));

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatient(doctor_id);
        setPatients(data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    loadPatients();
  }, [doctor_id]);

  const handleAddPrescription = async () => {
    // Ensure patient and disease are selected
    if (!selectedPatient || !selectedDisease) {
      console.error("Patient or Disease not selected.");
      return;
    }

    try {
      console.log(
        `Saving prescription for patientId: ${selectedPatient}, diseaseId: ${selectedDisease.id}`,
        prescription
      );

      const response = await givePrescription(doctor_id, selectedPatient, prescription, selectedDisease.id);

      // Reset states after prescription is saved
      setShowModal(false);
      setPrescription("");
      setSelectedPatient(null);
      setSelectedDisease(null);

      console.log("Prescription saved successfully:", response);
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };

  return (
    <div className="flex w-full bg-gray-100 h-screen">
      <Navbar />
      <div className="w-[95vw] p-5 overflow-y-scroll">
        <h1 className="text-2xl font-bold mb-4">Your Patients</h1>
        {patients.map((patient) => (
          <div key={patient.id} className="bg-white shadow-md rounded p-4 mb-5">
            <h2 className="text-lg font-semibold">Name: {patient.username}</h2>
            <p>Age: {patient.age}</p>
            <p>Gender: {patient.gender}</p>
            <h3 className="font-medium mt-3">Diseases:</h3>
            <ul className="list-disc pl-5">
              {patient.diseases.map((disease) => (
                <li key={disease.id} className="mb-2">
                  <div className="flex items-center justify-between">
                    <span>
                      <strong>{disease.name}:</strong> {disease.description}
                    </span>
                    <button
                      className="bg-lime-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedDisease(disease);
                        setSelectedPatient(patient.id); 
                        setShowModal(true);
                      }}
                    >
                      Add Prescription
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-lg font-bold mb-4">Add Prescription</h2>
              <p>
                <strong>Disease:</strong> {selectedDisease?.name}
              </p>
              <textarea
                className="w-full border rounded p-2 mt-3"
                rows="4"
                placeholder="Enter prescription"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowModal(false);
                    setPrescription("");
                    setSelectedPatient(null); 
                    setSelectedDisease(null); 
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-lime-500 text-white px-4 py-2 rounded"
                  onClick={handleAddPrescription} 
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GivePrescription;
