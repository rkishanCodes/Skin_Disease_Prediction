import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchAndTransformData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/doctor/patients/");
        const patients = response.data.patients;

        // Aggregate data by disease
        const diseaseCounts = {};
        patients.forEach((patient) => {
          patient.diseases.forEach((disease) => {
            if (diseaseCounts[disease.name]) {
              diseaseCounts[disease.name] += 1;
            } else {
              diseaseCounts[disease.name] = 1;
            }
          });
        });

        const labels = Object.keys(diseaseCounts);
        const data = Object.values(diseaseCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Patients",
              data,
              backgroundColor: "#84cc16",
              borderColor: "#b9ef5d",
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchAndTransformData();
  }, []);

  return (
    <div>
      <h2 className="text-center text-xl font-bold mb-4">Diseases vs Patients</h2>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Number of Patients per Disease",
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};




export default Graph
