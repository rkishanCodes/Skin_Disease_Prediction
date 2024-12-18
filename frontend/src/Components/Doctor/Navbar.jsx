import React, { useState } from "react";
import { User, ShieldPlus, Home, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  const [isclicked, setisclicked] = useState(false);
  const doctor_name = localStorage.getItem("doctor_name");
  const handlelogout = () =>{
    localStorage.removeItem('doctor_token')
    localStorage.removeItem('doctor_name')
    localStorage.removeItem('doctor_id')
    navigate("/");
  }
  return (
    <>
      <div className="flex bg-[#4641f2] rounded-tr-lg rounded-br-lg w-20 h-screen items-center gap-5 py-5 flex-col">
        <button className="rounded-full bg-white p-2 w-fit h-fit" onClick={()=>{setisclicked(true)}}>
          <User />
        </button>
        <div className="text-white">
          <h1 className="font-semibold">Hello!</h1>
          <h1 className="font-semibold">Doctor</h1>
        </div>
        <div className="flex flex-col gap-5">
          <Link to="/doctor/dashboard">
            <div className="bg-white rounded-lg p-2">
              <Home />
            </div>
          </Link>
          <Link to="/doctor/pescription">
            <div className="bg-white rounded-lg p-2">
              <ShieldPlus />
            </div>
          </Link>
        </div>
      </div>
      {isclicked && (
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-black/60 text-white flex items-center justify-center`}
          onClick={() => setisclicked(false)}
        >
          <div className="bg-white w-1/2 h-1/2 rounded-lg flex items-center justify-center flex-col gap-5">
            <div className=" bg-black rounded-full w-20 h-20 flex items-center justify-center">
              <User size={40} />
            </div>
            <div className="text-black">
              <h1 className="text-xl font-bold">Name: Dr {doctor_name}</h1>
            </div>
            <button className="bg-red-500 p-2 rounded-md" onClick={handlelogout}>Logout</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
