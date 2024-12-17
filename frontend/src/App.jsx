import React from "react";
import { Routes, Route } from "react-router-dom";
import Patient_login from "./Pages/Patient_login";
import Patient_register from "./Pages/Patient_register";
import Doctor_login from "./Pages/Doctor_login";
import Doctor_register from "./Pages/Doctor_register";
import Dashboard from "./Pages/Patient_Dashboard/Dashboard";

const App = () => {
  const Patient_token = localStorage.getItem("patient_token");
  return (
    <>
      <Routes>
        <Route path="/" element={<Patient_login />} />
        <Route path="/register" element={<Patient_register />} />
        <Route path="/doctor/login" element={<Doctor_login />} />
        <Route path="/doctor/register" element={<Doctor_register />} />
        {Patient_token && <Route path="/dashboard" element={<Dashboard />} />}
      </Routes>
    </>
  );
};
export default App;
