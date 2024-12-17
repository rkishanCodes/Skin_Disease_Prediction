import React, { useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import axios from "axios";

const Patient_login = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/v1/patient/auth/login/", {
        email,
        password,
      });
      setMessage("Login successful!");
      localStorage.setItem("patient_token",response.data.token)
      localStorage.setItem("patient_name",response.data.patient_name)
      localStorage.setItem("patient_id",response.data.patient_id)
      navigate("/dashboard")
    } catch (e) {
      const errorMessage = e.response?.data?.error || "Login failed. Please check your credentials.";
      setMessage(errorMessage);
    }
    setemail("");
    setpassword("");
  };

  return (
    <div className="bg-blue-400 w-full h-screen flex items-center justify-center">
      <form onSubmit={handlesubmit} className="bg-white p-5 rounded-md w-1/2 h-1/2">
        <h1 className="text-xl font-bold mb-4">Patient Login</h1>
        <input
          type="email"
          name="email"
          className="border-[.1rem] border-b-black outline-none w-full p-2 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className="border-[.1rem] border-b-black outline-none w-full p-2 mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-600"
        >
          Login
        </button>
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <p className="mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Patient_login;
