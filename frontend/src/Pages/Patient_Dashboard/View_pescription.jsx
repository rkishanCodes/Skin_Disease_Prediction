import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Patient/Navbar";
import Sidebar from "../../Components/Patient/Sidebar";
import axios from "axios";

const ViewPrescription = () => {
  const patientId = localStorage.getItem("patient_id");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/patient/pescription/${patientId}`,
        );
        setPrescriptions(response.data.prescriptions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="w-full p-6">
          <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
          {loading ? (
            <p>Loading...</p>
          ) : prescriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border p-4 rounded shadow-md"
                >
                  <h2 className="text-xl font-semibold">
                    Disease: {prescription.disease.name}
                  </h2>
                  <p className="text-gray-600">
                    Description: {prescription.disease.description}
                  </p>
                  <p className="mt-2">
                    <strong>Prescribed Medicine:</strong>{" "}
                    {prescription.prescription}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Prescribed by: Dr. {prescription.doctor.username} (
                    {prescription.doctor.email})
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No prescriptions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
