import React, { useState } from "react";
import Navbar from "../../Components/Patient/Navbar";
import CheckDisease from "../../components/Patient/CheckDisease";
import ViewPrescription from "../../components/Patient/ViewPrescription";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("checkDisease");

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex">
        {/* Tabs */}
        <div className="w-64 bg-blue-500 h-screen p-4">
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab("checkDisease")}
              className={`w-full py-2 rounded ${
                activeTab === "checkDisease"
                  ? "bg-white text-blue-500"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              Check Disease
            </button>
            <button
              onClick={() => setActiveTab("viewPrescription")}
              className={`w-full py-2 rounded ${
                activeTab === "viewPrescription"
                  ? "bg-white text-blue-500"
                  : "text-white hover:bg-blue-600"
              }`}
            >
              Check Prescription
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeTab === "checkDisease" && <CheckDisease />}
          {activeTab === "viewPrescription" && <ViewPrescription />}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
