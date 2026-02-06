import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  Eye, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  Info,
  Clock,
  Shield,
  Trees,
  ChevronRight,
  BookOpen,
  X,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Card, Badge, Button } from '../components/ui';
import { formatSmartDate, getAnimalIcon, getRiskConfig, cn, getRelativeTime } from '../utils/helpers';
import { animalTypes, mapZones } from '../data/mockData';
import { animalInfo } from '../components/shared/AnimalInfoCard';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom animal icon for map
const createAnimalIcon = (animalType, riskLevel) => {
  const icon = getAnimalIcon(animalType);
  const bgColor = riskLevel === 'danger' ? '#DC2626' : riskLevel === 'warning' ? '#F59E0B' : '#22C55E';
  return L.divIcon({
    className: 'custom-animal-marker',
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        border-radius: 50%; 
        background: ${bgColor}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

function PublicDashboard() {
  const { detections } = useApp();
  const { isAuthenticated, logout, isPublicUser } = useAuth();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showAnimalModal, setShowAnimalModal] = useState(false);

  // Filter detections for public view (exclude human detections for privacy)
  // Also delay data by 30 minutes for safety (simulated)
  const publicDetections = detections
    .filter(d => d.animalType !== 'human')
    .map(d => ({
      ...d,
      // Simulate delayed data - add 30 min to timestamp display
      displayTime: new Date(new Date(d.timestamp).getTime() + 30 * 60 * 1000).toISOString(),
      isDelayed: true,
    }));

  // Stats for public view
  const totalSightings = publicDetections.length;
  const uniqueSpecies = [...new Set(publicDetections.map(d => d.animalType))].length;
  const dangerousAnimals = publicDetections.filter(d => d.riskLevel === 'danger').length;

  // Get recent dangerous animal alerts for public safety
  const safetyAlerts = publicDetections
    .filter(d => d.riskLevel === 'danger' || d.riskLevel === 'warning')
    .slice(0, 3);

  // Animal filter options (exclude human for public)
  const publicAnimalTypes = animalTypes.filter(a => a.id !== 'human');

  // Map configuration - slightly offset for privacy
  const mapCenter = [29.52, 79.06];
  const mapZoom = 12;

  // Handle animal info modal
  const openAnimalInfo = (animalType) => {
    setSelectedAnimal(animalType);
    setShowAnimalModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-forest-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trees className="w-8 h-8 text-forest-300" />
              <div>
                <h1 className="text-xl font-display font-bold">Wildlife Watch</h1>
                <p className="text-forest-300 text-sm">Public Wildlife Monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && isPublicUser ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-forest-700 hover:bg-forest-600 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit</span>
                </button>
              ) : (
                <Link 
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 bg-forest-700 hover:bg-forest-600 rounded-lg transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Staff Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Data Delay Notice */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Clock className="w-4 h-4" />
            <span>
              <strong>Note:</strong> For safety, public data is delayed by 30 minutes. 
              Camera locations are not shown.
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Safety Banner */}
        {safetyAlerts.length > 0 && (
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800">⚠️ Wildlife Safety Advisory</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The following animals have been spotted recently. Please maintain safe distance.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {safetyAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-amber-200"
                    >
                      <span className="text-lg">{getAnimalIcon(alert.animalType)}</span>
                      <span className="text-sm font-medium text-amber-800">{alert.animalName}</span>
                      <Badge 
                        variant={alert.riskLevel === 'danger' ? 'danger' : 'warning'} 
                        size="sm"
                      >
                        {alert.riskLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <Eye className="w-8 h-8 text-forest-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalSightings}</p>
            <p className="text-sm text-gray-500">Recent Sightings</p>
          </Card>
          <Card className="text-center">
            <TrendingUp className="w-8 h-8 text-forest-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{uniqueSpecies}</p>
            <p className="text-sm text-gray-500">Species Spotted</p>
          </Card>
          <Card className="text-center">
            <AlertTriangle className="w-8 h-8 text-danger-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{dangerousAnimals}</p>
            <p className="text-sm text-gray-500">Danger Alerts</p>
          </Card>
        </div>

        {/* Map Section */}
        <Card noPadding className="overflow-hidden">
          <div className="p-4 bg-forest-50 border-b border-forest-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-forest-600" />
                <h2 className="text-lg font-semibold text-gray-900">Live Animal Locations</h2>
              </div>
              <div className="flex gap-2">
                <Badge variant="danger" size="sm">🔴 Danger</Badge>
                <Badge variant="warning" size="sm">🟡 Warning</Badge>
                <Badge variant="success" size="sm">🟢 Safe</Badge>
              </div>
            </div>
          </div>
          <div className="h-[400px] lg:h-[500px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Risk Zones */}
              {mapZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[(zone.bounds[0][0] + zone.bounds[1][0]) / 2, (zone.bounds[0][1] + zone.bounds[1][1]) / 2]}
                  radius={1500}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
              ))}

              {/* Animal Markers */}
              {publicDetections.map((detection) => (
                <Marker
                  key={detection.id}
                  position={[detection.location.lat, detection.location.lng]}
                  icon={createAnimalIcon(detection.animalType, detection.riskLevel)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getAnimalIcon(detection.animalType)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{detection.animalName}</h3>
                          <p className="text-xs text-gray-500">{detection.cameraName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={detection.riskLevel === 'danger' ? 'danger' : 
                                  detection.riskLevel === 'warning' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {getRiskConfig(detection.riskLevel).label}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatSmartDate(detection.timestamp)}
                        </span>
                      </div>
                      {detection.notes && (
                        <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {detection.notes}
                        </p>
                      )}
                      {detection.riskLevel === 'danger' && (
                        <p className="mt-2 text-xs text-danger-600 font-medium">
                          ⚠️ Keep 100m+ distance
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>

        {/* Recent Sightings List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Animal Sightings</h2>
              <div className="space-y-3">
                {publicDetections.slice(0, 6).map((detection) => {
                  const riskConfig = getRiskConfig(detection.riskLevel);
                  return (
                    <div 
                      key={detection.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border',
                        detection.riskLevel === 'danger' ? 'bg-danger-50 border-danger-200' :
                        detection.riskLevel === 'warning' ? 'bg-warning-50 border-warning-200' :
                        'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getAnimalIcon(detection.animalType)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{detection.animalName}</p>
                          <p className="text-sm text-gray-500">{detection.cameraName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={detection.riskLevel === 'danger' ? 'danger' : 
                                  detection.riskLevel === 'warning' ? 'warning' : 'success'}
                        >
                          {riskConfig.label}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatSmartDate(detection.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Animal Legend */}
            <Card>
              <h3 className="font-semibold text-gray-900 mb-3">Animals in the Park</h3>
              <div className="space-y-2">
                {publicAnimalTypes.map((animal) => (
                  <div 
                    key={animal.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <span className="text-xl">{animal.icon}</span>
                    <span className="flex-1 text-sm text-gray-700">{animal.name}</span>
                    <Badge 
                      variant={animal.riskLevel === 'danger' ? 'danger' : 
                              animal.riskLevel === 'warning' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {animal.riskLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Safety Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800">Visitor Guidelines</h3>
                  <ul className="mt-2 space-y-1 text-sm text-blue-700">
                    <li>• Keep safe distance from wildlife</li>
                    <li>• Do not feed animals</li>
                    <li>• Stay on designated trails</li>
                    <li>• Report emergencies to rangers</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Educational Section */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-forest-600" />
                <h3 className="font-semibold text-gray-900">Learn About Wildlife</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Click on any animal to learn more about them, their behavior, and safety guidelines.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {['elephant', 'tiger', 'leopard', 'bear'].map((type) => (
                  <button
                    key={type}
                    onClick={() => openAnimalInfo(type)}
                    className="p-3 bg-gray-50 hover:bg-forest-50 rounded-lg text-2xl transition-colors"
                    title={`Learn about ${type}`}
                  >
                    {getAnimalIcon(type)}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Animal Info Modal */}
      {showAnimalModal && selectedAnimal && animalInfo[selectedAnimal] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{getAnimalIcon(selectedAnimal)}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {animalInfo[selectedAnimal].name}
                  </h2>
                  <p className="text-sm text-gray-500 italic">
                    {animalInfo[selectedAnimal].scientificName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAnimalModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Conservation Status */}
              <Badge 
                variant={animalInfo[selectedAnimal].conservation === 'Endangered' ? 'danger' : 
                        animalInfo[selectedAnimal].conservation === 'Vulnerable' ? 'warning' : 'success'}
                size="lg"
              >
                {animalInfo[selectedAnimal].conservation}
              </Badge>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Diet</p>
                  <p className="font-semibold text-gray-900">{animalInfo[selectedAnimal].diet}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Weight</p>
                  <p className="font-semibold text-gray-900">{animalInfo[selectedAnimal].weight}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Habitat</p>
                  <p className="font-semibold text-gray-900">{animalInfo[selectedAnimal].habitat}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase font-medium">Lifespan</p>
                  <p className="font-semibold text-gray-900">{animalInfo[selectedAnimal].lifespan}</p>
                </div>
              </div>

              {/* Behavior */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Behavior
                </h4>
                <p className="text-sm text-gray-600">{animalInfo[selectedAnimal].behavior}</p>
              </div>

              {/* Safety Tip */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Guidelines
                </h4>
                <p className="text-sm text-amber-700">{animalInfo[selectedAnimal].safetyTip}</p>
              </div>

              {/* Close Button */}
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowAnimalModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-forest-800 text-forest-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            🌲 Wildlife Monitoring System • Protecting Wildlife & Communities
          </p>
          <p className="text-xs text-forest-400 mt-2">
            For emergencies, contact Forest Department: 1800-XXX-XXXX
          </p>
          <p className="text-xs text-forest-500 mt-1">
            © 2026 Forest Department. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicDashboard;
