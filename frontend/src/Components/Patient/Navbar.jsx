import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const username = localStorage.getItem("patient_name");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("patient_token");
    localStorage.removeItem("patient_name");
    navigate("/");
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl font-bold text-white tracking-wider">
              Patient Portal
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              className="flex items-center gap-2 bg-blue-500/30 px-4 py-2 rounded-lg"
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }}
            >
              <User className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Hello, {username}</span>
            </motion.div>

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-3 bg-blue-500/20 backdrop-blur-sm">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/30"
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.4)" }}
              >
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-medium">
                  Hello, {username}
                </span>
              </motion.div>

              <motion.button
                onClick={handleLogout}
                className="flex items-center w-full gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
