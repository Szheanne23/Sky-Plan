import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function WeatherTrendChart({ forecastData = [] }) {
  if (!forecastData || forecastData.length === 0) return null;

  const labels = forecastData.map((d) => d.day || d.formattedDate || d.date);
  const highTemps = forecastData.map((d) => d.highTemp ?? d.high ?? 20);
  const lowTemps = forecastData.map((d) => d.lowTemp ?? d.low ?? 12);
  const precipData = forecastData.map((d) => d.precipChance ?? d.precip ?? 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'High Temp (°C)',
        data: highTemps,
        borderColor: '#ffb781',
        backgroundColor: 'rgba(255, 183, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffb781',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        label: 'Low Temp (°C)',
        data: lowTemps,
        borderColor: '#4cd6fb',
        backgroundColor: 'rgba(76, 214, 251, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4cd6fb',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'bar',
        label: 'Precip Risk (%)',
        data: precipData,
        backgroundColor: 'rgba(173, 198, 255, 0.35)',
        borderRadius: 6,
        barThickness: 18,
        yAxisID: 'yPrecip',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#bcc9ce',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(19, 26, 51, 0.95)',
        titleColor: '#dbe1ff',
        bodyColor: '#bcc9ce',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#869398', font: { size: 11 } },
      },
      yTemp: {
        type: 'linear',
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#869398',
          font: { size: 11 },
          callback: (val) => `${val}°C`,
        },
      },
      yPrecip: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: {
          color: '#869398',
          font: { size: 10 },
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl border border-white/10 shadow-glass space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-on-surface">
              7-Day Meteorological Trajectory
            </h3>
            <p className="text-xs text-outline">
              Temperature spread & precipitation probability (Chart.js engine)
            </p>
          </div>
        </div>
      </div>
      <div className="h-56 sm:h-64 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
