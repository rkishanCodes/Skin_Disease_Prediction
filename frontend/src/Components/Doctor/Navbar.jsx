import React from "react";
import { User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex bg-[#4641f2] rounded-tr-lg rounded-br-lg w-20 h-screen items-center gap-5 py-5 flex-col">
      <div className="rounded-full bg-white p-2 w-fit h-fit">
        <User />
      </div>
      <div className="text-white">
        <h1 className="font-semibold">Hello!</h1>
        <h1 className="font-semibold">Doctor</h1>
      </div>
    </div>
  );
};

export default Navbar;
