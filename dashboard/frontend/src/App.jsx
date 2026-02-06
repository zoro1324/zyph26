import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, USER_ROLES } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { AlertProvider } from './context/AlertContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import Login from './pages/Login';
import RoleSwitcher from './pages/RoleSwitcher';
import RangerDashboard from './pages/Dashboard';
import PublicDashboard from './pages/PublicDashboard';
import FarmerView from './pages/FarmerView';
import LiveMonitoring from './pages/LiveMonitoring';
import MapTracking from './pages/MapTracking';
import DetectionHistory from './pages/DetectionHistory';
import AlertsCenter from './pages/AlertsCenter';
import CameraHealth from './pages/CameraHealth';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

/**
 * RoleBasedApp - Renders different views based on user role
 * Central conditional rendering component
 */
function RoleBasedApp() {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-forest-700 font-medium">Loading Wildlife Watch...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show role switcher/login
  if (!isAuthenticated) {
    return <RoleSwitcher />;
  }

  // Role-based conditional rendering
  return (
    <>
      {role === USER_ROLES.RANGER && <RangerRoutes />}
      {role === USER_ROLES.FARMER && <FarmerView />}
      {role === USER_ROLES.PUBLIC && <PublicDashboard />}
    </>
  );
}

/**
 * Protected route for ranger-only pages
 */
function RangerRoute({ children }) {
  const { isAuthenticated, isLoading, isRanger } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <div className="animate-spin w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated || !isRanger) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

/**
 * Protected route for farmer-only access
 */
function FarmerRoute({ children }) {
  const { isAuthenticated, isLoading, isFarmer } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earth-50">
        <div className="animate-spin w-12 h-12 border-4 border-earth-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated || !isFarmer) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

/**
 * Show login only if not authenticated
 */
function LoginRoute({ children }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-50">
        <div className="animate-spin w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    // Redirect based on role
    if (role === USER_ROLES.RANGER) return <Navigate to="/ranger" replace />;
    if (role === USER_ROLES.FARMER) return <Navigate to="/farmer" replace />;
    return <Navigate to="/public" replace />;
  }
  
  return children;
}

/**
 * Ranger routes with nested navigation
 */
function RangerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ranger" replace />} />
      <Route path="/ranger" element={<RangerRoute><MainLayout /></RangerRoute>}>
        <Route index element={<RangerDashboard />} />
        <Route path="live-monitoring" element={<LiveMonitoring />} />
        <Route path="map-tracking" element={<MapTracking />} />
        <Route path="detection-history" element={<DetectionHistory />} />
        <Route path="alerts" element={<AlertsCenter />} />
        <Route path="camera-health" element={<CameraHealth />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/ranger" replace />} />
    </Routes>
  );
}

/**
 * Main App Routes
 */
function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Main entry - Role switcher or redirect */}
      <Route path="/" element={<RoleBasedApp />} />
      
      {/* Direct public access */}
      <Route path="/public" element={<PublicDashboard />} />
      
      {/* Login routes */}
      <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
      <Route path="/ranger-login" element={<LoginRoute><Login userType="ranger" /></LoginRoute>} />
      <Route path="/farmer-login" element={<LoginRoute><Login userType="farmer" /></LoginRoute>} />
      
      {/* Farmer route */}
      <Route path="/farmer" element={<FarmerRoute><FarmerView /></FarmerRoute>} />
      
      {/* Ranger routes with layout */}
      <Route path="/ranger" element={<RangerRoute><MainLayout /></RangerRoute>}>
        <Route index element={<RangerDashboard />} />
        <Route path="live-monitoring" element={<LiveMonitoring />} />
        <Route path="map-tracking" element={<MapTracking />} />
        <Route path="detection-history" element={<DetectionHistory />} />
        <Route path="alerts" element={<AlertsCenter />} />
        <Route path="camera-health" element={<CameraHealth />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AlertProvider>
            <AppRoutes />
          </AlertProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
