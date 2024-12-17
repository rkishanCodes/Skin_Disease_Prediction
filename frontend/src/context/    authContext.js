import React, { useState, createContext } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = async (email, password, userType) => {
    try {
      const endpoint =
        userType === "patient"
          ? `${API_BASE_URL}/patient/auth/login`
          : `${API_BASE_URL}/doctor/auth/login`;

      const response = await axios.post(endpoint, { email, password });

      const { token, patient_name, doctor_username } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);

      setToken(token);
      setUser({
        name: userType === "patient" ? patient_name : doctor_username,
        type: userType,
      });

      return response.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
