import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom colored markers based on AQI
const createCustomIcon = (aqiCategory) => {
  let color = '#22c55e';
  if (aqiCategory.includes('Poor')) color = '#ef4444';
  else if (aqiCategory.includes('Moderate')) color = '#eab308';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapView = ({ sites, onSiteSelect }) => {
  const defaultCenter = [28.6139, 77.2090]; // Delhi center
  const defaultZoom = 11;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full rounded-lg shadow-lg"
        style={{ zIndex: 0 }}
        minZoom={3}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sites.map((site) => (
          <Marker
            key={site.id}
            position={[site.location.lat, site.location.lng]}
            icon={createCustomIcon(site.aqi_category)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{site.site_name}</h3>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">NO₂:</span>
                    <span className="font-semibold">{site.no2_concentration.toFixed(1)} µg/m³</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">O₃:</span>
                    <span className="font-semibold">{site.o3_concentration.toFixed(1)} µg/m³</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">AQI:</span>
                    <span className="font-semibold">{site.air_quality_index}</span>
                  </p>
                  <div
                    className={`mt-2 px-2 py-1 rounded text-center text-xs font-semibold ${
                      site.aqi_category.includes('Poor')
                        ? 'bg-red-100 text-red-800'
                        : site.aqi_category.includes('Moderate')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {site.aqi_category}
                  </div>
                </div>
                <button
                  onClick={() => onSiteSelect(site)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  View Dashboard
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend (Flushed to Left Edge) */}
      {/*<div className="absolute bottom-4 left-0 bg-white/90 backdrop-blur-sm p-3 rounded-r-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2 text-gray-700">Air Quality</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span>Poor</span>
          </div>
        </div>
      </div>*/}
    </div>
  );
};

export default MapView;
