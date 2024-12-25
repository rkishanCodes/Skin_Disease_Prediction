import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Doctor/Navbar";
import Box_comp from "../../Components/Doctor/Box_comp";
import fetchStats from "../../Utils/Fetchstats";
import Graph from "../../Components/Doctor/Graph";
import Stats_graph from "../../Components/Doctor/Stats_graph";

const DoctorDashboard = () => {
  const [stats, setstats] = useState({
    completed: 0,
    pending: 0,
  });
  const doctor_id = localStorage.getItem("doctor_id");
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats(doctor_id);
        setstats({
          completed: data.consultedPatients,
          pending: data.pendingConsults,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    loadStats();
  }, []);
  return (
    <div className="flex w-full  bg-gray-100 h-screen">
      <Navbar />
      <div className="w-[95vw] p-5 flex flex-col gap-5 overflow-y-scroll">
        <div className="bg-gradient-to-r from-lime-500 to-lime-300 w-full rounded-lg p-2 flex ">
          <div className="w-36">
            <img src="/doctor.png" alt="image" className="object-cover" />
          </div>
          <div className="w-1/2 h-full flex justify-center flex-col text-white">
            <h1 className="text-3xl font-semibold">Hello! Doctor Ready to Cure</h1>
            <h1 className="text-2xl">
              The best way to find yourself is to lose yourself in the service
              of others
            </h1>
          </div>
        </div>
        <div className="flex gap-4">
          <Box_comp
            text={"Patient attended"}
            count={stats.completed}
            color={true}
          />
          <Box_comp
            text={"Patient Pending"}
            count={stats.pending}
            color={false}
          />
        </div>
        <div>
          <Stats_graph/>
        </div>
        <div>
          <Graph />
        </div>
        
      </div>
    </div>
  );
};

export default DoctorDashboard;
