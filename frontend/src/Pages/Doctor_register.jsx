import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorRegister = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const payload = { email, username, password };

    try {
      const response = await axios.post("http://localhost:8000/api/v1/doctor/auth/register", payload);

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/doctor/login"); // Navigate to login page after successful registration
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.");
    }
  };

  return (
    <div className="p-4 bg-[#fb6b68] min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-full md:w-1/3">
        <h2 className="text-2xl font-bold mb-4 text-[#fb6b68]">Doctor Registration</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-bold text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#fb6b68] text-white px-4 py-2 rounded-md hover:bg-opacity-90"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;
