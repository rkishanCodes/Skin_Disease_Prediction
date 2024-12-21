import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
} from "lucide-react";

const  DoctorRegister= () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("doctor_token")) {
      navigate("/doctor/dashboard");
    }
  }, [navigate]);

  // Registration handler
  const handleregister = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password || !username ) {
      setError("All fields are required.");
      return;
    }
    try {
      // Post request for registration
      const response = await axios.post(
        "http://localhost:8000/api/v1/doctor/auth/register",
        {
          email,
          password,
          username,
        }
      );
      console.log(response)
      // Store token and user info in localStorage
      localStorage.setItem("doctor_token", response.data.token);
      localStorage.setItem("doctor_name", response.data.doctor_username);
      localStorage.setItem("doctor_id", response.data.doctor_id);
      navigate("/doctor/dashboard");
      // Clear form fields after successful registration
      setemail("");
      setpassword("");
      setusername("");
    } catch (e) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", e);
    }
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

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 to-green-300">
      {/* Background Medial Icons */}
      <div className="absolute top-10 left-10 opacity-20 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-green-500"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" x2="12" y1="10" y2="16" />
          <line x1="9" x2="15" y1="13" y2="13" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-[500px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-8 text-green-500 flex justify-center items-center gap-3"
          variants={itemVariants}
        >
          <UserPlus className="text-green-500" />
          Doctor Registration
        </motion.h1>

        <form onSubmit={handleregister} className="space-y-6">
          <motion.div variants={itemVariants} className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 pr-3 py-2 border-b-2 border-green-300 focus:border-green-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 pr-3 py-2 border-b-2 border-green-300 focus:border-green-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full pl-10 pr-3 py-2 border-b-2 border-green-300 focus:border-green-500 outline-none transition-colors"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              required
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-red-500 text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-full hover:bg-green-600 transition-colors"
          >
            Register
          </motion.button>
        </form>

        <motion.p
          variants={itemVariants}
          className="text-center mt-4 text-gray-600"
        >
          Already have an account?{" "}
          <Link
            to="/"
            className="text-green-500 underline hover:text-green-700 transition-colors"
          >
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default DoctorRegister;


