import React, { useState } from "react";
import {Link} from "react-router-dom";
import axios from "axios"

const Patient_register = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setusername] = useState("");
  const [age, setage] = useState("");
  const [gender, setgender] = useState("");

  const handleregister = (e) => {
    e.preventDefault();
    try {
      const response = axios.post(
        "http://localhost:8000/api/v1/patient/auth/register",
        {
          email,
          password,
          username,
          age,
          gender,
        }
      );
      console.log(response.data);
    } catch (e) {
      console.log("error", e);
    }
    setemail("");
    setpassword("");
    setusername("");
    setage("");
    setgender("");
  };

  return (
    <div className="bg-blue-400 w-full  h-screen flex items-center justify-center">
      <form action="" className="bg-white w-1/2 h-1/2 flex flex-col gap-4 p-2 rounded-md">
        <h1>Patient Register</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border-b-[.1rem] border-black "
          value={email}
          onChange={(e)=>{setemail(e.target.value)}}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="border-b-[.1rem] border-black "
          value={password}
          onChange={(e)=>{setpassword(e.target.value)}}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="border-b-[.1rem] border-black "
          value={username}
          onChange={(e)=>{setusername(e.target.value)}}
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          className="border-b-[.1rem] border-black "
          value={age}
          onChange={(e)=>{setage(e.target.value)}}
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          className="border-b-[.1rem] border-black "
          value={gender}
          onChange={(e)=>{setgender(e.target.value)}}
        />
        <button type="button" className="bg-blue-400 text-white rounded-md p-1 w-fit" onClick={handleregister}>Register</button>
        <h1>Already have account? <Link to="/" className="text-blue-400 underline">Login</Link></h1>
      </form>
    </div>
  );
};

export default Patient_register;
