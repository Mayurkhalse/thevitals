import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wind, Droplets, Thermometer, Gauge, Car } from 'lucide-react';

const ChartPanel = ({ site }) => {
  const [activeChart, setActiveChart] = useState('pollutants');

  // Generate time-series data for demonstration (24-hour forecast)
  const generateTimeSeriesData = () => {
    const data = [];
    const baseTime = new Date(site.timestamp);

    for (let i = 0; i < 24; i++) {
      const time = new Date(baseTime.getTime() + i * 3600000);
      const hourLabel = time.getHours() + ':00';

      data.push({
        time: hourLabel,
        NO2: site.no2_concentration + (Math.random() - 0.5) * 10,
        O3: site.o3_concentration + (Math.random() - 0.5) * 8,
        Temperature: site.temperature + (Math.random() - 0.5) * 3,
        Humidity: site.humidity + (Math.random() - 0.5) * 5,
        'Wind Speed': site.wind_speed + (Math.random() - 0.5) * 0.5,
        'Traffic Intensity': site.traffic_intensity + (Math.random() - 0.5) * 15,
      });
    }

    return data;
  };

  const timeSeriesData = generateTimeSeriesData();

  const chartButtons = [
    { id: 'pollutants', label: 'NO₂ & O₃', icon: TrendingUp },
    { id: 'weather', label: 'Weather', icon: Thermometer },
    { id: 'traffic', label: 'Traffic & Emissions', icon: Car },
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'pollutants':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Concentration (µg/m³)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="NO2"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="NO₂ (µg/m³)"
              />
              <Line
                type="monotone"
                dataKey="O3"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="O₃ (µg/m³)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'weather':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Humidity (%) / Wind Speed (m/s)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Temperature"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Temperature (°C)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Humidity"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Humidity (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Wind Speed"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Wind Speed (m/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'traffic':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="time"
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                label={{ value: 'Traffic Intensity', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Legend />
              <Bar
                dataKey="Traffic Intensity"
                fill="#10b981"
                name="Traffic Intensity"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {chartButtons.map((button) => {
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              onClick={() => setActiveChart(button.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeChart === button.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={18} />
              {button.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {activeChart === 'pollutants' && '24-Hour Pollutant Forecast'}
          {activeChart === 'weather' && '24-Hour Weather Conditions'}
          {activeChart === 'traffic' && '24-Hour Traffic Pattern'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {activeChart === 'pollutants' && 'Ground-level NO₂ and O₃ concentration trends'}
          {activeChart === 'weather' && 'Temperature, humidity, and wind speed variations'}
          {activeChart === 'traffic' && 'Traffic intensity and emission patterns'}
        </p>
      </div>

      {renderChart()}

      {/* Forecast comparison */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">NO₂ Current vs Forecast</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {site.no2_concentration.toFixed(1)} → {site.forecast_no2.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
            </div>
            <div className={`text-sm font-semibold ${
              site.forecast_no2 < site.no2_concentration ? 'text-green-600' : 'text-red-600'
            }`}>
              {site.forecast_no2 < site.no2_concentration ? '↓' : '↑'}
              {Math.abs(((site.forecast_no2 - site.no2_concentration) / site.no2_concentration) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">O₃ Current vs Forecast</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {site.o3_concentration.toFixed(1)} → {site.forecast_o3.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">µg/m³</p>
            </div>
            <div className={`text-sm font-semibold ${
              site.forecast_o3 < site.o3_concentration ? 'text-green-600' : 'text-red-600'
            }`}>
              {site.forecast_o3 < site.o3_concentration ? '↓' : '↑'}
              {Math.abs(((site.forecast_o3 - site.o3_concentration) / site.o3_concentration) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
