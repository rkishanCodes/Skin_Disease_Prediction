import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Statsdata from "../../Utils/Stats";
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

const Stats_graph = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        
      const labels = Statsdata.map((item) => item.cancer);
      const cases = Statsdata.map((item) => item.case);
      const deathRates = Statsdata.map((item) => item.deathRate);

      setChartData({
        labels,
        datasets: [
          {
            label: "Cases",
            data: cases,
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgba(53, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Death Rates",
            data: deathRates,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-center text-xl font-bold mb-4">Skin Cancer Cases vs Death Rates</h2>
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
                text: "Skin Cancer Statistics",
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


export default Stats_graph
