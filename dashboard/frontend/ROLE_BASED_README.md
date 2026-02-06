# Wildlife Watch - Role-Based Frontend

Real-Time Animal Movement Detection System for forest rangers, farmers, and the public.

## Tech Stack

- **React.js** (functional components, hooks)
- **Tailwind CSS** (earth-tone color palette)
- **React Router** (role-based routing)
- **JWT-based role handling** (ranger | farmer | public)
- **Leaflet** (map integration with placeholder data)
- **Mobile-first, accessible UI**

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Role-Based Architecture

One codebase → three role-based experiences using conditional rendering.

### 1. Forest Ranger View (`/ranger`)
**Credentials:** `ranger@wildlife.gov` / `demo123`

Advanced dashboard with full access:
- ✅ Live camera feeds
- ✅ Interactive map with camera locations & movement trails
- ✅ Detection timeline & history
- ✅ Camera health monitoring (battery %, online/offline status)
- ✅ Alert management
- ✅ Analytics & reports
- ✅ Human intrusion detection
- ✅ Filter by animal type, time range

### 2. Farmer View (`/farmer`)
**Credentials:** `farmer@village.com` / `farm123`

Simple full-screen alert system:
- ✅ Real-time danger alerts
- ✅ Map showing nearby animal detections
- ✅ Large buttons and icons (accessibility)
- ✅ Bottom sheet for alert details
- ✅ Sound toggle for alerts
- ❌ No analytics or technical data
- ❌ No camera locations

**Shows:**
- Animal type (with emoji icons)
- Time detected
- Distance from farmland

### 3. Public View (`/public`)
**No login required**

Read-only awareness dashboard:
- ✅ Delayed data (30 min delay for safety)
- ✅ Safe/Unsafe zone visualization
- ✅ Animal info cards (educational)
- ✅ Safety guidelines
- ❌ No real-time alerts
- ❌ No camera locations
- ❌ No human detections

## Folder Structure

```
src/
├── components/
│   ├── layout/          # MainLayout, Header, Sidebar, MobileNav
│   ├── shared/          # Reusable role-agnostic components
│   │   ├── MapView.jsx         # Universal map component
│   │   ├── AnimalInfoCard.jsx  # Detection & educational cards
│   │   ├── AlertBanner.jsx     # Alert notifications
│   │   └── CameraCard.jsx      # Camera health cards
│   └── ui/              # Base UI components (Button, Card, Badge, etc.)
├── context/
│   ├── AuthContext.jsx  # JWT role management
│   ├── AppContext.jsx   # Global app state
│   └── AlertContext.jsx # Alert management
├── data/
│   └── mockData.js      # Realistic mock API responses
├── hooks/
│   └── useRole.js       # Role-based permission hook
├── pages/
│   ├── RoleSwitcher.jsx # Entry point for role selection
│   ├── Login.jsx        # Multi-role login
│   ├── FarmerView.jsx   # Farmer dashboard
│   ├── PublicDashboard.jsx # Public dashboard
│   ├── Dashboard.jsx    # Ranger dashboard
│   └── ...              # Other ranger pages
├── utils/
│   └── helpers.js       # Utility functions
└── App.jsx              # Role-based routing
```

## Authentication Flow

```jsx
// Central AuthContext manages role
const { role, isRanger, isFarmer, isPublicUser } = useAuth();

// Conditional rendering in App.jsx
{role === "ranger" && <RangerDashboard />}
{role === "farmer" && <FarmerView />}
{role === "public" && <PublicView />}
```

## Key Components

### MapView
Universal map component with role-specific features:
```jsx
<MapView
  center={[29.52, 79.06]}
  detections={filteredDetections}
  cameras={cameras}           // Ranger only
  showCameras={isRanger}
  showTrails={isRanger}
  markerSize={isFarmer ? 56 : 36}
/>
```

### AnimalInfoCard
Detection cards and educational content:
```jsx
// Detection alert
<AnimalInfoCard.Detection detection={detection} />

// Educational (public view)
<AnimalInfoCard.Educational animalType="tiger" showFullInfo />
```

### AlertBanner
Flexible alert/notification component:
```jsx
<AlertBanner
  variant="danger"
  title="Tiger Detected"
  message="1.2 km from farmland"
  animalType="tiger"
  animate
/>
```

### CameraCard
Camera health display (ranger only):
```jsx
<CameraCard
  camera={camera}
  lastDetection={lastDetection}
  variant="full" // or "compact" or "grid"
/>
```

## Color Palette (Earth Tones)

```css
/* Forest Greens */
forest-600: #16A34A
forest-800: #166534

/* Earth Browns */
earth-600: #A16938
earth-400: #C4864F

/* Savanna Yellows */
savanna-600: #D97706

/* Risk Colors */
danger-600: #DC2626
warning-600: #F59E0B
safe-600: #22C55E
```

## Accessibility Features

- Large touch targets (48px minimum)
- High contrast mode support
- Reduced motion support
- Screen reader friendly
- Focus indicators
- Large fonts for farmer view

## Mock Data

Demo credentials and sample data included:
- 6 cameras with varying battery/signal levels
- 13 animal detections
- Movement trails for elephant and tiger
- Zone configurations
- Alert history

## API Mock Response Format

```javascript
{
  success: true,
  timestamp: "2026-01-15T10:30:00Z",
  data: {
    cameras: [...],
    detections: [...],
  }
}
```

## Development Notes

1. All real-time data is simulated with mock data
2. JWT tokens are mock-generated (replace with real backend)
3. Map uses OpenStreetMap tiles (replace with Mapbox in production)
4. Camera locations are placeholder coordinates

## License

© 2026 Forest Department. For government/wildlife use.
