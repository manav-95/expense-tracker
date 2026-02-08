import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data?: number[];
  labels?: string[];
}




const DoughnutChart = ({
  data,
  labels
}: DoughnutChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#8b5cf6", // violet
          "#ec4899", // pink
          "#f97316", // orange
          "#22c55e", // green
          "#3b82f6", // blue
          "#eab308", // yellow
          "#14b8a6", // teal
          "#ef4444", // red
          "#6366f1", // indigo
          "#84cc16", // lime
          "#06b6d4", // cyan
          "#a855f7", // purple
          "#f43f5e", // rose
          "#0ea5e9", // sky
          "#10b981", // emerald
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: "500" as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return "₹" + context.parsed.toLocaleString();
          }
        }
      }
    },
  };

  return (
    <div className="w-full flex justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
