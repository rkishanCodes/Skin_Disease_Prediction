import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewPrescription = () => {
  const patientId = localStorage.getItem("patient_id");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/patient/pescription/${patientId}`
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
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Prescriptions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-600">
                {prescription.disease.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {prescription.disease.description}
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium mb-2">Prescribed Medicine:</p>
                <p className="text-gray-800">{prescription.prescription}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Prescribed by:</p>
                <p>Dr. {prescription.doctor.username}</p>
                <p>{prescription.doctor.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No prescriptions found.</p>
      )}
    </div>
  );
};

export default ViewPrescription;
