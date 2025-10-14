import { X, MapPin, Calendar, Wind, Droplets, Thermometer, Gauge, TrendingUp, AlertCircle } from 'lucide-react';
import ChartPanel from './ChartPanel';

const Dashboard = ({ site, onClose }) => {
  if (!site) return null;

  const getAQIColor = (category) => {
    if (category.includes('Poor')) return 'text-red-600 bg-red-50 border-red-200';
    if (category.includes('Moderate')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const metrics = [
    {
      label: 'NO₂ Concentration',
      value: site.no2_concentration.toFixed(1),
      unit: 'µg/m³',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'O₃ Concentration',
      value: site.o3_concentration.toFixed(1),
      unit: 'µg/m³',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Temperature',
      value: site.temperature.toFixed(1),
      unit: '°C',
      icon: Thermometer,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Humidity',
      value: site.humidity.toFixed(1),
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      label: 'Wind Speed',
      value: site.wind_speed.toFixed(1),
      unit: 'm/s',
      icon: Wind,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Pressure',
      value: site.pressure.toFixed(1),
      unit: 'hPa',
      icon: Gauge,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
    },
  ];

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <MapPin size={32} />
                {site.site_name}
              </h2>
              <p className="text-blue-100 mt-2 flex items-center gap-2">
                <Calendar size={16} />
                Last Updated: {formatDate(site.timestamp)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* AQI Badge */}
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <AlertCircle size={20} />
              <div>
                <p className="text-xs text-blue-100">Air Quality Index</p>
                <p className="text-2xl font-bold">{site.air_quality_index}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold border-2 ${getAQIColor(site.aqi_category)}`}>
              {site.aqi_category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {metric.value}
                        <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>
                      </p>
                    </div>
                    <div className={`${metric.bgColor} p-3 rounded-lg`}>
                      <Icon className={metric.color} size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Wind Direction</p>
              <p className="text-2xl font-bold text-gray-800">{site.wind_direction}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Traffic Intensity</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-800">{site.traffic_intensity}</p>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${site.traffic_intensity}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1">Emission Index</p>
              <p className="text-2xl font-bold text-gray-800">{site.emission_index.toFixed(2)}</p>
            </div>
          </div>

          {/* Chart Panel */}
          <ChartPanel site={site} />

          {/* Forecast Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Short-Term Forecast Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">NO₂ Forecast</h4>
                <p className="text-gray-600">
                  Current concentration of <span className="font-semibold">{site.no2_concentration.toFixed(1)} µg/m³</span> is
                  expected to {site.forecast_no2 < site.no2_concentration ? 'decrease' : 'increase'} to{' '}
                  <span className="font-semibold">{site.forecast_no2.toFixed(1)} µg/m³</span> within the next 24 hours.
                </p>
                {site.forecast_no2 > 100 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                      <AlertCircle size={16} />
                      High NO₂ levels expected. Limit outdoor activities.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">O₃ Forecast</h4>
                <p className="text-gray-600">
                  Current concentration of <span className="font-semibold">{site.o3_concentration.toFixed(1)} µg/m³</span> is
                  expected to {site.forecast_o3 < site.o3_concentration ? 'decrease' : 'increase'} to{' '}
                  <span className="font-semibold">{site.forecast_o3.toFixed(1)} µg/m³</span> within the next 24 hours.
                </p>
                {site.forecast_o3 > 80 && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <AlertCircle size={16} />
                      Elevated O₃ levels expected during peak sunlight hours.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
