import { useState, useEffect } from 'react';
import { CloudOff, Sparkles } from 'lucide-react';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import ChatbotWidget from './components/ChatbotWidget';
import mockData from './data/mockdata.json';

function App() {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSites(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
  };

  const handleCloseDashboard = () => {
    setSelectedSite(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CloudOff className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Air Pollution Forecast System
                </h1>
                <p className="text-sm text-gray-600">
                  Short-Term Forecast of NO₂ and O₃ Ground-Level Concentrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Sparkles className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Active Sites</p>
                <p className="text-lg font-bold text-gray-800">{sites.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Monitoring Sites Map
            </h2>
            <p className="text-gray-600">
              Click on any marker to view detailed pollution data and forecasts for that location.
            </p>
          </div>

          {/* Map Container */}
          <div className="h-[600px] rounded-lg overflow-hidden border-2 border-gray-200">
            <MapView sites={sites} onSiteSelect={handleSiteSelect} />
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">NO₂ Monitoring</h3>
              <p className="text-sm text-red-700">
                Nitrogen Dioxide primarily from vehicle emissions and industrial activities
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">O₃ Monitoring</h3>
              <p className="text-sm text-blue-700">
                Ground-level Ozone formed by photochemical reactions in the atmosphere
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">24-Hour Forecast</h3>
              <p className="text-sm text-green-700">
                Short-term predictions using satellite and reanalysis data
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Data updated every hour | Using satellite and reanalysis data sources</p>
          <p className="mt-1">
            Last system update: {new Date().toLocaleString()}
          </p>
        </div>
      </main>

      {/* Dashboard Modal */}
      {selectedSite && (
        <Dashboard site={selectedSite} onClose={handleCloseDashboard} />
      )}

      {/* Chatbot Widget */}
      <ChatbotWidget selectedSite={selectedSite} />
    </div>
  );
}

export default App;
