import axios from 'axios';

const GivePrescription = async (doctorId, patientId, prescription) => {
  try {
    const requestData = {
      doctorId,
      patientId,
      prescription,
    };

    const response = await axios.post('http://localhost:8000/api/v1/doctor/prescribe/', requestData);
    return response.data; 
  } catch (error) {
    console.error("Error sending prescription:", error.message || error);
    throw new Error("Failed to send prescription. Please try again later.");
  }
};

export default GivePrescription;
