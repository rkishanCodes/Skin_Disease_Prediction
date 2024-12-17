import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Patient_register = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem("patient_token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Registration handler
  const handleregister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !username || !age || !gender) {
      setError("All fields are required.");
      return;
    }

    try {
      // Post request for registration
      const response = await axios.post(
        "http://localhost:8000/api/v1/patient/auth/register",
        {
          email,
          password,
          username,
          age,
          gender,
        }
      );

      // Store token and user info in localStorage
      localStorage.setItem("patient_token", response.data.token);
      localStorage.setItem("patient_name", response.data.patient_name);
      localStorage.setItem("patient_id", response.data.patient_id);
      navigate("/dashboard");

      // Clear form fields after successful registration
      setemail("");
      setpassword("");
      setusername("");
      setage("");
      setgender("");
    } catch (e) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", e);
    }
  };

  return (
    <div className="bg-blue-400 w-full h-screen flex items-center justify-center">
      <form
        className="bg-white w-1/2 h-1/2 flex flex-col gap-4 p-2 rounded-md"
        onSubmit={handleregister}
      >
        <h1>Patient Register</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-b-[.1rem] border-black"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border-b-[.1rem] border-black"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border-b-[.1rem] border-black"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="border-b-[.1rem] border-black"
          value={age}
          onChange={(e) => setage(parseInt(e.target.value))}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          className="border-b-[.1rem] border-black"
          value={gender}
          onChange={(e) => setgender(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        <button
          type="submit"
          className="bg-blue-400 text-white rounded-md p-1 w-fit"
        >
          Register
        </button>
        <h1>
          Already have an account?{" "}
          <Link to="/" className="text-blue-400 underline">
            Login
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default Patient_register;
