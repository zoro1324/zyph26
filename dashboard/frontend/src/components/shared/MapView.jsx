/**
 * MapView - Reusable map component for all role views
 * Supports: Camera markers, animal markers, zones, trails
 */

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getAnimalIcon } from '../../utils/helpers';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Trail colors by animal type
const trailColors = {
  elephant: '#92400E',
  tiger: '#DC2626',
  lion: '#EA580C',
  leopard: '#F59E0B',
  bear: '#78350F',
  buffalo: '#1E40AF',
  bison: '#1E40AF',
  deer: '#22C55E',
  boar: '#6B7280',
};

// Create animal marker icon
export const createAnimalIcon = (animalType, riskLevel, size = 36) => {
  const icon = getAnimalIcon(animalType);
  const bgColor = riskLevel === 'danger' ? '#DC2626' : riskLevel === 'warning' ? '#F59E0B' : '#22C55E';
  return L.divIcon({
    className: 'custom-animal-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        background: ${bgColor}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: ${size * 0.5}px;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Create camera marker icon
export const createCameraIcon = (status, size = 28) => {
  const bgColor = status === 'online' ? '#166534' : '#DC2626';
  return L.divIcon({
    className: 'custom-camera-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 6px; 
        background: ${bgColor}; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Create location marker icon
export const createLocationIcon = (type = 'default') => {
  const colors = {
    farmland: '#166534',
    village: '#B45309',
    default: '#3B82F6',
  };
  const icons = {
    farmland: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
    </svg>`,
    village: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M3 21h18M5 21V11l7-7 7 7v10M9 21v-4h6v4"/>
    </svg>`,
    default: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`,
  };
  
  return L.divIcon({
    className: 'location-marker',
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        border-radius: 8px; 
        background: ${colors[type]}; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">
        ${icons[type]}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

// Map centering component
function SetMapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Main MapView Component
function MapView({
  center = [29.52, 79.06],
  zoom = 13,
  height = '400px',
  className = '',
  // Data props
  detections = [],
  cameras = [],
  zones = [],
  trails = [],
  customMarkers = [],
  // Display options
  showDetections = true,
  showCameras = false,
  showZones = true,
  showTrails = false,
  showZoomControl = true,
  // Interaction options
  scrollWheelZoom = true,
  dragging = true,
  // Marker size
  markerSize = 36,
  // Callbacks
  onDetectionClick,
  onCameraClick,
  // Children for custom overlays
  children,
}) {
  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={scrollWheelZoom}
        dragging={dragging}
        zoomControl={showZoomControl}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Zones */}
        {showZones && zones.map((zone) => (
          <Circle
            key={zone.id}
            center={[(zone.bounds[0][0] + zone.bounds[1][0]) / 2, (zone.bounds[0][1] + zone.bounds[1][1]) / 2]}
            radius={zone.radius || 1500}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: zone.fillOpacity || 0.1,
              weight: 2,
            }}
          />
        ))}

        {/* Movement trails */}
        {showTrails && trails.map((trail) => (
          <Polyline
            key={trail.id}
            positions={trail.points.map(p => [p.lat, p.lng])}
            pathOptions={{
              color: trailColors[trail.animalType] || '#6B7280',
              weight: 3,
              opacity: 0.7,
              dashArray: '10, 5',
            }}
          />
        ))}

        {/* Camera markers */}
        {showCameras && cameras.map((camera) => (
          <Marker
            key={camera.id}
            position={[camera.location.lat, camera.location.lng]}
            icon={createCameraIcon(camera.status)}
            eventHandlers={{
              click: () => onCameraClick?.(camera),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[140px]">
                <p className="font-bold text-gray-900">{camera.name}</p>
                <p className="text-sm text-gray-600">{camera.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm capitalize">{camera.status}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">🔋 {camera.battery}%</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Detection markers */}
        {showDetections && detections.map((detection) => (
          <Marker
            key={detection.id}
            position={[detection.location.lat, detection.location.lng]}
            icon={createAnimalIcon(detection.animalType, detection.riskLevel, markerSize)}
            eventHandlers={{
              click: () => onDetectionClick?.(detection),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[140px] text-center">
                <span className="text-3xl block mb-1">{getAnimalIcon(detection.animalType)}</span>
                <p className="font-bold text-gray-900">{detection.animalName}</p>
                {detection.cameraName && (
                  <p className="text-xs text-gray-500 mt-1">📷 {detection.cameraName}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Custom markers */}
        {customMarkers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={[marker.lat, marker.lng]}
            icon={marker.icon || createLocationIcon(marker.type)}
          >
            {marker.popup && (
              <Popup>
                {typeof marker.popup === 'string' ? (
                  <div className="p-1">{marker.popup}</div>
                ) : (
                  marker.popup
                )}
              </Popup>
            )}
          </Marker>
        ))}

        {/* Custom children */}
        {children}
      </MapContainer>
    </div>
  );
}

export default MapView;
