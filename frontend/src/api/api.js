import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const loginUser = async (email, password, userType) => {
  const endpoint =
    userType === "patient" ? `/patient/auth/login` : `/doctor/auth/login`;

  const response = await api.post(endpoint, { email, password });
  return response.data;
};

export const registerUser = async (formData, userType) => {
  const endpoint =
    userType === "patient" ? `/patient/auth/register` : `/doctor/auth/register`;

  const response = await api.post(endpoint, formData);
  return response.data;
};
