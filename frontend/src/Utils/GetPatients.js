import axios from 'axios';

const getPatient = async (doctorId) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/v1/doctor/${doctorId}/patients`);
    return response.data.patients; 
  } catch (error) {
    console.error("Error fetching doctor stats:", error.message || error);
    throw new Error("Failed to fetch doctor stats. Please try again later.");
  }
};

export default getPatient;
