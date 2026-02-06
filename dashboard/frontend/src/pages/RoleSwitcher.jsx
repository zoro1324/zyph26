/**
 * RoleSwitcher - Entry point for role selection
 * Allows users to choose their role: Ranger, Farmer, or Public
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trees, 
  Shield, 
  Tractor, 
  Users, 
  ChevronRight,
  Eye,
  AlertTriangle,
  MapPin,
  Camera,
  BarChart3,
  Bell
} from 'lucide-react';
import { useAuth, USER_ROLES } from '../context/AuthContext';
import { Card, Button } from '../components/ui';
import { cn } from '../utils/helpers';

// Role configuration
const roles = [
  {
    id: USER_ROLES.RANGER,
    title: 'Forest Ranger',
    subtitle: 'Wildlife Officer Access',
    description: 'Full dashboard with camera feeds, analytics, and alert management',
    icon: Shield,
    color: 'forest',
    features: [
      { icon: Camera, text: 'Live camera feeds' },
      { icon: BarChart3, text: 'Analytics & reports' },
      { icon: AlertTriangle, text: 'Alert management' },
      { icon: MapPin, text: 'Movement tracking' },
    ],
    requiresLogin: true,
    demoCredentials: { email: 'ranger@wildlife.gov', password: 'demo123' },
  },
  {
    id: USER_ROLES.FARMER,
    title: 'Farmer',
    subtitle: 'Local Farmer Access',
    description: 'Simple alert system showing nearby animal activity around your farmland',
    icon: Tractor,
    color: 'earth',
    features: [
      { icon: Bell, text: 'Real-time alerts' },
      { icon: MapPin, text: 'Nearby detections' },
      { icon: AlertTriangle, text: 'Danger warnings' },
      { icon: Eye, text: 'Simple map view' },
    ],
    requiresLogin: true,
    demoCredentials: { email: 'farmer@village.com', password: 'farm123' },
  },
  {
    id: USER_ROLES.PUBLIC,
    title: 'Public Visitor',
    subtitle: 'General Public Access',
    description: 'View wildlife sightings and safety information (read-only)',
    icon: Users,
    color: 'savanna',
    features: [
      { icon: Eye, text: 'Wildlife sightings' },
      { icon: MapPin, text: 'Safe zone map' },
      { icon: AlertTriangle, text: 'Safety advisories' },
      { icon: Trees, text: 'Animal education' },
    ],
    requiresLogin: false,
  },
];

// Color mappings for Tailwind
const colorClasses = {
  forest: {
    bg: 'bg-forest-600',
    bgLight: 'bg-forest-50',
    bgHover: 'hover:bg-forest-700',
    border: 'border-forest-200',
    borderHover: 'hover:border-forest-400',
    text: 'text-forest-600',
    textLight: 'text-forest-700',
    ring: 'ring-forest-500',
  },
  earth: {
    bg: 'bg-earth-600',
    bgLight: 'bg-earth-50',
    bgHover: 'hover:bg-earth-700',
    border: 'border-earth-200',
    borderHover: 'hover:border-earth-400',
    text: 'text-earth-600',
    textLight: 'text-earth-700',
    ring: 'ring-earth-500',
  },
  savanna: {
    bg: 'bg-savanna-600',
    bgLight: 'bg-savanna-50',
    bgHover: 'hover:bg-savanna-700',
    border: 'border-savanna-200',
    borderHover: 'hover:border-savanna-400',
    text: 'text-savanna-600',
    textLight: 'text-savanna-700',
    ring: 'ring-savanna-500',
  },
};

// Login modal for ranger/farmer
function LoginModal({ role, onClose, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = colorClasses[role.color];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password, role.id);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail(role.demoCredentials.email);
    setPassword(role.demoCredentials.password);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={cn('p-3 rounded-xl', colors.bgLight)}>
            <role.icon className={cn('w-6 h-6', colors.text)} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{role.title} Login</h2>
            <p className="text-sm text-gray-500">{role.subtitle}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Demo credentials hint */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo credentials:</strong>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="ml-2 underline hover:no-underline"
              >
                Click to fill
              </button>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {role.demoCredentials.email} / {role.demoCredentials.password}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors',
                colors.bg,
                colors.bgHover,
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

// Role selection card
function RoleCard({ role, onSelect, selected }) {
  const colors = colorClasses[role.color];
  const Icon = role.icon;

  return (
    <button
      onClick={() => onSelect(role)}
      className={cn(
        'w-full text-left p-6 rounded-2xl border-2 transition-all duration-300',
        'hover:shadow-lg',
        selected 
          ? `${colors.border} ${colors.bgLight} ring-2 ${colors.ring}` 
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-4 rounded-xl', colors.bgLight)}>
          <Icon className={cn('w-8 h-8', colors.text)} />
        </div>
        {!role.requiresLogin && (
          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
            No login required
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">{role.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{role.subtitle}</p>
      <p className="text-gray-600 mb-4">{role.description}</p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {role.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
            <feature.icon className={cn('w-4 h-4', colors.text)} />
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={cn(
        'flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors',
        colors.bg, 'text-white', colors.bgHover
      )}>
        <span>Continue as {role.title}</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </button>
  );
}

function RoleSwitcher() {
  const navigate = useNavigate();
  const { enterAsPublic } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    
    if (role.requiresLogin) {
      setShowLogin(true);
    } else {
      // Public access - no login needed
      enterAsPublic();
      navigate('/public');
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (selectedRole.id === USER_ROLES.RANGER) {
      navigate('/ranger');
    } else if (selectedRole.id === USER_ROLES.FARMER) {
      navigate('/farmer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-earth-50">
      {/* Header */}
      <header className="bg-forest-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <Trees className="w-10 h-10 text-forest-300" />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                Wildlife Watch
              </h1>
              <p className="text-forest-300 text-sm">
                Real-Time Animal Movement Detection System
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Wildlife Watch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your role to access the wildlife monitoring system. 
            Different roles provide different levels of access and features.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selectedRole?.id === role.id}
              onSelect={handleRoleSelect}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            About This System
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Forest Rangers</h4>
              <p>
                Complete access to all camera feeds, detection history, analytics, 
                and alert management. Monitor wildlife movement patterns and respond 
                to critical situations in real-time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Farmers</h4>
              <p>
                Simple, mobile-friendly interface showing nearby animal activity. 
                Receive immediate alerts when dangerous animals are detected near 
                your farmland.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">For Public</h4>
              <p>
                View delayed, anonymized wildlife sighting data. Learn about local 
                wildlife and stay informed about safety zones in the area.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy & Security</h4>
              <p>
                All data is processed securely. Camera locations and real-time 
                positions are only visible to authorized personnel. Public data 
                is delayed for safety.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Wildlife Monitoring System • Powered by AI Detection</p>
          <p className="mt-1">© 2026 Forest Department. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      {showLogin && selectedRole && (
        <LoginModal
          role={selectedRole}
          onClose={() => {
            setShowLogin(false);
            setSelectedRole(null);
          }}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default RoleSwitcher;
