import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function LineChart({ daily, statType, startDate, endDate }) {
  const filtered = useMemo(() => {
    if (!daily?.length) return [];
    const s = new Date(startDate);
    const e = new Date(endDate);
    return daily.filter((d) => {
      const dt = new Date(d.date);
      return dt >= s && dt <= e;
    });
  }, [daily, startDate, endDate]);

  const data = useMemo(() => {
    if (!filtered.length) return null;

    
    const lineColor = "#7aa2ff";      
    const fillColor = "rgba(122,162,255,0.15)";

    return {
      labels: filtered.map((d) => String(d.date).slice(0, 10)),
      datasets: [
        {
          label: statType,
          data: filtered.map((d) => Number(d[statType]) || 0),

          borderColor: lineColor,
          backgroundColor: fillColor,
          fill: true,

          borderWidth: 2,
          tension: 0.35,

          pointRadius: 0,
          pointHoverRadius: 4,
          pointHitRadius: 12
        }
      ]
    };
  }, [filtered, statType]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color: "#f2f5ff",
            font: { size: 12, weight: "700" }
          }
        },
        tooltip: {
          backgroundColor: "rgba(10,16,30,0.95)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: "rgba(122,162,255,0.6)",
          borderWidth: 1
        }
      },

      scales: {
        x: {
          ticks: {
            color: "rgba(242,245,255,0.85)",
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          }
        },
        y: {
          ticks: {
            color: "rgba(242,245,255,0.85)"
          },
          grid: {
            color: "rgba(255,255,255,0.10)"
          }
        }
      }
    };
  }, []);

  return (
    <div className="card" style={{ height: 420 }}>
      {data ? (
        <Line data={data} options={options} />
      ) : (
        <div className="small">Aucune donnée disponible pour cette période.</div>
      )}
    </div>
  );
}
