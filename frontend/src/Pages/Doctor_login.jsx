import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/v1/doctor/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        setMessage("Login successful!");
        localStorage.setItem("doctor_token", response.data.token);
        localStorage.setItem("doctor_name", response.data.doctor_username);
        localStorage.setItem("doctor_id", response.data.doctor_id);
        navigate("/doctor/dashboard")
      } else {
        setMessage("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Invalid email or password");
      } else {
        setMessage("An error occurred. Please try again.");
      }
      console.error("Error:", error);
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#fb6b68] w-1/2 h-1/2 rounded-md p-6 text-white flex flex-col gap-4"
      >
        <h1 className="text-center text-4xl font-bold">Hello, Doctor!</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-b-[.1rem] border-white w-full p-2 mb-4 rounded-lg text-black outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-b-[.1rem] border-white w-full p-2 mb-4 rounded-lg text-black outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {message && <p className="text-center">{message}</p>}
        <button type="submit" className="bg-white rounded-lg p-2 w-fit mx-auto text-[#fb6b68] font-bold">
          Login
        </button>
        <h1 className="text-center">Don't have an account?{" "}
          <Link to="/doctor_register" className="text-white underline">
            Register
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default DoctorLogin;
