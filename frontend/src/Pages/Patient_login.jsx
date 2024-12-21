import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Stethoscope, LogIn, Mail, Lock } from "lucide-react";

const CombinedLogin = () => {
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      role === "patient"
        ? "http://localhost:8000/api/v1/patient/auth/login/"
        : "http://localhost:8000/api/v1/doctor/auth/login/";

    try {
      const response = await axios.post(endpoint, { email, password });

      setMessage("Login successful!");

      // Save respective details based on role
      if (role === "patient") {
        localStorage.setItem("patient_token", response.data.token);
        localStorage.setItem("patient_name", response.data.patient_name);
        localStorage.setItem("patient_id", response.data.patient_id);
        navigate("/patient/dashboard");
      } else {
        localStorage.setItem("doctor_token", response.data.token);
        localStorage.setItem("doctor_name", response.data.doctor_username);
        localStorage.setItem("doctor_id", response.data.doctor_id);
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Login failed. Please try again.";
      setMessage(errorMsg);
    }
    setEmail("");
    setPassword("");
  };

  // Variants for Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const roleButtonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50 z-0"></div>

      {/* Floating Medical Elements */}
      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{
          opacity: 0.2,
          rotate: 360,
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        className="absolute top-10 left-10 z-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-blue-300"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="10" y2="16" />
          <line x1="9" x2="15" y1="13" y2="13" />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, rotate: 0 }}
        animate={{
          opacity: 0.2,
          rotate: -360,
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        className="absolute bottom-10 right-10 z-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-green-300"
        >
          <path d="M10 2v8H2v-2h6V2h2z" />
          <path d="M10 20v-8h8v2h-6v6h-2z" />
        </svg>
      </motion.div>

      {/* Login Container */}
      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-96 border border-gray-100"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-6 text-gray-800 flex justify-center items-center gap-3"
          variants={itemVariants}
        >
          {role === "patient" ? (
            <>
              <UserCircle className="text-blue-500" />
              Patient Login
            </>
          ) : (
            <>
              <Stethoscope className="text-green-500" />
              Doctor Login
            </>
          )}
        </motion.h1>

        {/* Role Selector */}
        <motion.div
          className="flex justify-center gap-4 mb-6"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => setRole("patient")}
            variants={roleButtonVariants}
            whileHover="hover"
            whileTap="pressed"
            className={`px-4 py-2 rounded-md font-bold transition-all duration-300 flex items-center gap-2 ${
              role === "patient"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-blue-100"
            }`}
          >
            <UserCircle size={20} />
            Patient
          </motion.button>
          <motion.button
            onClick={() => setRole("doctor")}
            variants={roleButtonVariants}
            whileHover="hover"
            whileTap="pressed"
            className={`px-4 py-2 rounded-md font-bold transition-all duration-300 flex items-center gap-2 ${
              role === "doctor"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-green-100"
            }`}
          >
            <Stethoscope size={20} />
            Doctor
          </motion.button>
        </motion.div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <motion.div variants={itemVariants} className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:border-${
                role === "patient" ? "blue" : "green"
              }-500 outline-none transition-colors`}
            />
            <Mail
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${
                role === "patient" ? "blue" : "green"
              }-500 transition-colors`}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full pl-10 pr-3 py-2 border-b-2 border-gray-300 focus:border-${
                role === "patient" ? "blue" : "green"
              }-500 outline-none transition-colors`}
            />
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${
                role === "patient" ? "blue" : "green"
              }-500 transition-colors`}
            />
          </motion.div>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className={`bg-${
              role === "patient" ? "blue" : "green"
            }-500 text-white px-4 py-2 rounded-md hover:bg-${
              role === "patient" ? "blue" : "green"
            }-600 transition-all duration-300 transform flex items-center justify-center gap-2`}
          >
            <LogIn size={20} />
            Login
          </motion.button>
        </form>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-red-500 mt-4"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Link to Register */}
        <motion.p
          variants={itemVariants}
          className="text-center mt-4 text-gray-600"
        >
          Don't have an account?{" "}
          <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to={role === "patient" ? "/register" : "/doctor/register"}
              className="text-blue-500 underline hover:text-blue-700 transition-colors"
            >
              Register
            </Link>
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CombinedLogin;
