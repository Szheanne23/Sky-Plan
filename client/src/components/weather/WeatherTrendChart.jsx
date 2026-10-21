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
import { useTemperature } from '../../context/TemperatureContext';
import { useTheme } from '../../context/ThemeContext';

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
  const { toDisplayTemp, unitSymbol } = useTemperature();
  const { isDay } = useTheme();

  if (!forecastData || forecastData.length === 0) return null;

  const labels = forecastData.map((d) => d.day || d.formattedDate || d.date);
  const highTemps = forecastData.map((d) => toDisplayTemp(d.highTemp ?? d.high ?? 20));
  const lowTemps = forecastData.map((d) => toDisplayTemp(d.lowTemp ?? d.low ?? 12));
  const precipData = forecastData.map((d) => d.precipChance ?? d.precip ?? 0);

  const highColor = isDay ? '#d97706' : '#ffb781';
  const lowColor = isDay ? '#0284c7' : '#4cd6fb';
  const precipColor = isDay ? 'rgba(37, 99, 235, 0.35)' : 'rgba(173, 198, 255, 0.35)';
  const textColor = isDay ? '#475569' : '#bcc9ce';
  const gridColor = isDay ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.05)';

  const data = {
    labels,
    datasets: [
      {
        label: `High Temp (${unitSymbol})`,
        data: highTemps,
        borderColor: highColor,
        backgroundColor: isDay ? 'rgba(217, 119, 6, 0.12)' : 'rgba(255, 183, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: highColor,
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        label: `Low Temp (${unitSymbol})`,
        data: lowTemps,
        borderColor: lowColor,
        backgroundColor: isDay ? 'rgba(2, 132, 199, 0.10)' : 'rgba(76, 214, 251, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: lowColor,
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
        yAxisID: 'yTemp',
      },
      {
        type: 'bar',
        label: 'Precip Risk (%)',
        data: precipData,
        backgroundColor: precipColor,
        borderRadius: 6,
        maxBarThickness: 14,
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
          color: textColor,
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
        },
      },
      tooltip: {
        backgroundColor: isDay ? 'rgba(255, 255, 255, 0.96)' : 'rgba(19, 26, 51, 0.95)',
        titleColor: isDay ? '#0f172a' : '#dbe1ff',
        bodyColor: isDay ? '#334155' : '#bcc9ce',
        borderColor: isDay ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: isDay ? '#64748b' : '#869398', font: { size: 11 } },
      },
      yTemp: {
        type: 'linear',
        position: 'left',
        grid: { color: gridColor },
        ticks: {
          color: isDay ? '#64748b' : '#869398',
          font: { size: 11 },
          callback: (val) => `${val}${unitSymbol}`,
        },
      },
      yPrecip: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { display: false },
        ticks: {
          color: isDay ? '#64748b' : '#869398',
          font: { size: 10 },
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl border border-white/10 shadow-glass space-y-3">
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
