/**
 * FarmerView - Simple full-screen alert system for farmers
 * Mobile-first, minimal UI with large buttons and icons
 * Shows: Animal type, Time detected, Distance from farmland
 */

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Bell, 
  MapPin, 
  Clock, 
  LogOut,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Shield,
  Ruler,
  Trees
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Card, Badge, Button } from '../components/ui';
import { formatSmartDate, getAnimalIcon, cn } from '../utils/helpers';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Farmer's farmland location (mock)
const FARMLAND_LOCATION = { lat: 29.52, lng: 79.06 };
const ALERT_RADIUS_KM = 3; // Alert radius in km

// Create large animal marker for farmer view
const createFarmerAnimalIcon = (animalType, riskLevel) => {
  const icon = getAnimalIcon(animalType);
  const bgColor = riskLevel === 'danger' ? '#DC2626' : riskLevel === 'warning' ? '#F59E0B' : '#22C55E';
  return L.divIcon({
    className: 'farmer-animal-marker',
    html: `
      <div style="
        width: 56px; 
        height: 56px; 
        border-radius: 50%; 
        background: ${bgColor}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 28px;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        animation: pulse 2s infinite;
      ">
        ${icon}
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 28],
  });
};

// Farmland marker
const farmlandIcon = L.divIcon({
  className: 'farmland-marker',
  html: `
    <div style="
      width: 48px; 
      height: 48px; 
      border-radius: 8px; 
      background: #166534; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
      </svg>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 48],
});

// Calculate distance between two coordinates in km
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Single Alert Card Component - Large and accessible
function AlertCard({ detection, distance, onDismiss }) {
  const riskColors = {
    danger: 'bg-red-600 border-red-700',
    warning: 'bg-amber-500 border-amber-600',
    safe: 'bg-green-600 border-green-700',
  };

  const riskTextColors = {
    danger: 'text-red-50',
    warning: 'text-amber-50',
    safe: 'text-green-50',
  };

  return (
    <div className={cn(
      'rounded-2xl p-6 border-2 shadow-xl transition-all duration-300',
      riskColors[detection.riskLevel] || riskColors.warning,
      riskTextColors[detection.riskLevel] || riskTextColors.warning
    )}>
      {/* Animal Icon and Name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{getAnimalIcon(detection.animalType)}</span>
          <div>
            <h3 className="text-2xl font-bold">{detection.animalName}</h3>
            <Badge 
              variant={detection.riskLevel === 'danger' ? 'danger' : detection.riskLevel === 'warning' ? 'warning' : 'success'}
              size="lg"
              className="mt-1"
            >
              {detection.riskLevel === 'danger' ? '⚠️ DANGER' : detection.riskLevel === 'warning' ? '⚡ WARNING' : '✓ SAFE'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Information - Large and readable */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Distance */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Ruler className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Distance</span>
          </div>
          <p className="text-3xl font-bold">{distance.toFixed(1)} km</p>
        </div>

        {/* Time */}
        <div className="bg-white/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Detected</span>
          </div>
          <p className="text-xl font-bold">{formatSmartDate(detection.timestamp)}</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onDismiss}
        className="w-full mt-4 py-4 bg-white/30 hover:bg-white/40 rounded-xl font-bold text-lg transition-colors"
      >
        ✓ Acknowledged
      </button>
    </div>
  );
}

// Bottom Sheet Component for Mobile
function BottomSheet({ isOpen, onToggle, children, title }) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 z-50',
      'border-t border-gray-200',
      isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-80px)]'
    )}>
      {/* Handle */}
      <button 
        onClick={onToggle}
        className="w-full py-4 flex flex-col items-center"
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-2" />
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-semibold">{title}</span>
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </div>
      </button>
      
      <div className="px-4 pb-8 max-h-[60vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function FarmerView() {
  const { user, logout } = useAuth();
  const { detections } = useApp();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filter detections near farmland (within alert radius) and exclude dismissed
  const nearbyDetections = detections
    .filter(d => d.animalType !== 'human') // Exclude human detections
    .map(d => ({
      ...d,
      distance: calculateDistance(
        FARMLAND_LOCATION.lat, 
        FARMLAND_LOCATION.lng, 
        d.location.lat, 
        d.location.lng
      )
    }))
    .filter(d => d.distance <= ALERT_RADIUS_KM && !dismissedAlerts.has(d.id))
    .sort((a, b) => {
      // Sort by risk level first, then by distance
      const riskOrder = { danger: 0, warning: 1, safe: 2 };
      if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      return a.distance - b.distance;
    });

  // Get most critical alert
  const criticalAlert = nearbyDetections[0];
  const otherAlerts = nearbyDetections.slice(1, 5);

  // All detections for map
  const allNearbyDetections = detections
    .filter(d => d.animalType !== 'human')
    .map(d => ({
      ...d,
      distance: calculateDistance(
        FARMLAND_LOCATION.lat, 
        FARMLAND_LOCATION.lng, 
        d.location.lat, 
        d.location.lng
      )
    }))
    .filter(d => d.distance <= ALERT_RADIUS_KM * 2);

  // Handle alert dismissal
  const dismissAlert = (id) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  // Sound alert effect
  useEffect(() => {
    if (soundEnabled && criticalAlert && criticalAlert.riskLevel === 'danger') {
      // In production, play an actual sound
      console.log('🔔 DANGER ALERT SOUND');
    }
  }, [soundEnabled, criticalAlert]);

  const mapCenter = [FARMLAND_LOCATION.lat, FARMLAND_LOCATION.lng];
  const mapZoom = 13;

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      {/* Header - Minimal */}
      <header className="bg-forest-800 text-white px-4 py-3 flex items-center justify-between safe-area-top">
        <div className="flex items-center gap-3">
          <Trees className="w-7 h-7 text-forest-300" />
          <div>
            <h1 className="text-lg font-bold">Wildlife Alert</h1>
            <p className="text-xs text-forest-300">{user?.name || 'Farmer'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              'p-3 rounded-full transition-colors',
              soundEnabled ? 'bg-forest-600' : 'bg-gray-600'
            )}
            aria-label={soundEnabled ? 'Mute alerts' : 'Enable sound alerts'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          {/* Logout */}
          <button
            onClick={logout}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative">
        {/* Full Screen Map */}
        <div className="absolute inset-0">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full"
            scrollWheelZoom={true}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Farmland location */}
            <Marker position={[FARMLAND_LOCATION.lat, FARMLAND_LOCATION.lng]} icon={farmlandIcon}>
              <Popup>
                <div className="text-center p-2">
                  <p className="font-bold text-forest-800">Your Farmland</p>
                  <p className="text-sm text-gray-600">{user?.farmlandId || 'FARM-2847'}</p>
                </div>
              </Popup>
            </Marker>

            {/* Alert radius circle */}
            <Circle
              center={[FARMLAND_LOCATION.lat, FARMLAND_LOCATION.lng]}
              radius={ALERT_RADIUS_KM * 1000}
              pathOptions={{
                color: '#22C55E',
                fillColor: '#22C55E',
                fillOpacity: 0.1,
                weight: 2,
                dashArray: '5, 10',
              }}
            />

            {/* Warning radius */}
            <Circle
              center={[FARMLAND_LOCATION.lat, FARMLAND_LOCATION.lng]}
              radius={ALERT_RADIUS_KM * 500}
              pathOptions={{
                color: '#F59E0B',
                fillColor: '#F59E0B',
                fillOpacity: 0.15,
                weight: 2,
              }}
            />

            {/* Danger radius */}
            <Circle
              center={[FARMLAND_LOCATION.lat, FARMLAND_LOCATION.lng]}
              radius={ALERT_RADIUS_KM * 200}
              pathOptions={{
                color: '#DC2626',
                fillColor: '#DC2626',
                fillOpacity: 0.2,
                weight: 2,
              }}
            />

            {/* Animal detections */}
            {allNearbyDetections.map((detection) => (
              <Marker
                key={detection.id}
                position={[detection.location.lat, detection.location.lng]}
                icon={createFarmerAnimalIcon(detection.animalType, detection.riskLevel)}
              >
                <Popup>
                  <div className="text-center p-2 min-w-[150px]">
                    <span className="text-4xl block mb-2">{getAnimalIcon(detection.animalType)}</span>
                    <p className="font-bold text-gray-900">{detection.animalName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      📍 {detection.distance.toFixed(1)} km away
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatSmartDate(detection.timestamp)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Critical Alert Overlay */}
        {criticalAlert && criticalAlert.riskLevel === 'danger' && (
          <div className="absolute top-4 left-4 right-4 z-40 animate-pulse">
            <div className="bg-red-600 text-white rounded-2xl p-4 shadow-2xl border-2 border-red-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-full">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {getAnimalIcon(criticalAlert.animalType)} {criticalAlert.animalName}
                  </h2>
                  <p className="text-red-100">
                    {criticalAlert.distance.toFixed(1)} km from your farm
                  </p>
                </div>
                <button
                  onClick={() => dismissAlert(criticalAlert.id)}
                  className="px-4 py-2 bg-white text-red-600 rounded-xl font-bold"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="absolute top-4 right-4 z-30">
          <div className={cn(
            'px-4 py-2 rounded-full font-bold shadow-lg',
            nearbyDetections.length === 0 
              ? 'bg-green-500 text-white' 
              : nearbyDetections.some(d => d.riskLevel === 'danger')
                ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-white'
          )}>
            {nearbyDetections.length === 0 
              ? '✓ All Clear' 
              : `⚠️ ${nearbyDetections.length} Alert${nearbyDetections.length > 1 ? 's' : ''}`
            }
          </div>
        </div>

        {/* Bottom Sheet with Alerts */}
        <BottomSheet 
          isOpen={sheetOpen} 
          onToggle={() => setSheetOpen(!sheetOpen)}
          title={`${nearbyDetections.length} Active Alerts`}
        >
          {nearbyDetections.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">All Clear</h3>
              <p className="text-gray-600 mt-2">
                No dangerous animals detected near your farmland
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {nearbyDetections.map((detection) => (
                <AlertCard
                  key={detection.id}
                  detection={detection}
                  distance={detection.distance}
                  onDismiss={() => dismissAlert(detection.id)}
                />
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">Map Legend</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span>Danger</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>Safe</span>
              </div>
            </div>
          </div>
        </BottomSheet>
      </main>

      {/* Quick Action Button - Fixed bottom right */}
      <button
        onClick={() => setSheetOpen(true)}
        className={cn(
          'fixed bottom-24 right-4 z-40 p-5 rounded-full shadow-xl transition-all',
          nearbyDetections.length > 0 
            ? 'bg-red-500 hover:bg-red-600 animate-bounce' 
            : 'bg-forest-600 hover:bg-forest-700'
        )}
        aria-label="View alerts"
      >
        <Bell className="w-7 h-7 text-white" />
        {nearbyDetections.length > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-red-600 rounded-full text-sm font-bold flex items-center justify-center">
            {nearbyDetections.length}
          </span>
        )}
      </button>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .safe-area-top {
          padding-top: max(12px, env(safe-area-inset-top));
        }
      `}</style>
    </div>
  );
}

export default FarmerView;
