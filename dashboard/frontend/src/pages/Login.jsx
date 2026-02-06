import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, Tractor } from 'lucide-react';
import { useAuth, USER_ROLES } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import { cn } from '../utils/helpers';

// Configuration for different user types
const loginConfig = {
  ranger: {
    title: 'Ranger Portal',
    subtitle: 'Forest Ranger Dashboard',
    description: 'Access the full monitoring system with real-time alerts, camera controls, human intrusion detection, and advanced analytics.',
    icon: Shield,
    color: 'forest',
    features: [
      { icon: '📍', text: 'Real-time animal location tracking' },
      { icon: '🚨', text: 'Human intrusion alerts' },
      { icon: '📹', text: 'Camera health monitoring' },
    ],
    demoEmail: 'ranger@wildlife.gov',
    demoPassword: 'demo123',
    redirectPath: '/ranger',
    role: USER_ROLES.RANGER,
  },
  farmer: {
    title: 'Farmer Portal',
    subtitle: 'Farmland Alert System',
    description: 'Simple alert system showing nearby animal activity around your farmland. Get instant notifications when dangerous animals are detected.',
    icon: Tractor,
    color: 'earth',
    features: [
      { icon: '🔔', text: 'Real-time danger alerts' },
      { icon: '🗺️', text: 'Nearby animal tracking' },
      { icon: '📱', text: 'Mobile-friendly interface' },
    ],
    demoEmail: 'farmer@village.com',
    demoPassword: 'farm123',
    redirectPath: '/farmer',
    role: USER_ROLES.FARMER,
  },
};

function Login({ userType = 'ranger' }) {
  const navigate = useNavigate();
  const { loginAsRanger, loginAsFarmer } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const config = loginConfig[userType] || loginConfig.ranger;
  const Icon = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const loginFn = userType === 'farmer' ? loginAsFarmer : loginAsRanger;
    const result = await loginFn(email, password);
    
    if (result.success) {
      navigate(config.redirectPath);
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  const fillDemoCredentials = () => {
    setEmail(config.demoEmail);
    setPassword(config.demoPassword);
  };

  // Color classes based on user type
  const colorClasses = {
    forest: {
      bg: 'bg-forest-900',
      bgGradient: 'from-forest-900/90 to-forest-800/80',
      accent: 'bg-forest-700',
      textLight: 'text-forest-200',
      textAccent: 'text-forest-300',
      iconBg: 'bg-forest-100',
      iconText: 'text-forest-600',
      demoBg: 'bg-forest-50',
      demoBorder: 'border-forest-200',
      demoText: 'text-forest-800',
      demoTextLight: 'text-forest-700',
    },
    earth: {
      bg: 'bg-earth-900',
      bgGradient: 'from-earth-900/90 to-earth-800/80',
      accent: 'bg-earth-700',
      textLight: 'text-earth-200',
      textAccent: 'text-earth-300',
      iconBg: 'bg-earth-100',
      iconText: 'text-earth-600',
      demoBg: 'bg-earth-50',
      demoBorder: 'border-earth-200',
      demoText: 'text-earth-800',
      demoTextLight: 'text-earth-700',
    },
  };

  const colors = colorClasses[config.color];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className={cn('hidden lg:flex lg:w-1/2 relative overflow-hidden', colors.bg)}>
        <div className={cn('absolute inset-0 bg-gradient-to-br', colors.bgGradient)} />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <Icon className={cn('w-12 h-12', colors.textAccent)} />
            <h1 className="text-3xl font-display font-bold">{config.title}</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            {config.subtitle}
          </h2>
          <p className={cn('text-lg', colors.textLight)}>
            {config.description}
          </p>
          <div className="mt-12 space-y-4">
            {config.features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', colors.accent)}>
                  {feature.icon}
                </div>
                <p className={colors.textLight}>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Back to Home */}
          <Link 
            to="/" 
            className={cn('inline-flex items-center gap-2 mb-6 transition-colors', colors.iconText, 'hover:opacity-80')}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Role Selection
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Icon className={cn('w-16 h-16 mx-auto', colors.iconText)} />
            <h1 className="text-2xl font-display font-bold text-gray-900 mt-2">
              {config.title}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn('p-2 rounded-lg', colors.iconBg)}>
                <Icon className={cn('w-6 h-6', colors.iconText)} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {userType === 'farmer' ? 'Farmer Login' : 'Ranger Login'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {userType === 'farmer' ? 'Local farmer access' : 'Authorized personnel only'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={config.demoEmail}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                required
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                variant={userType === 'farmer' ? 'secondary' : 'primary'}
              >
                Sign In
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className={cn('mt-6 p-4 rounded-lg border', colors.demoBg, colors.demoBorder)}>
              <p className={cn('text-sm font-medium mb-2', colors.demoText)}>Demo Credentials:</p>
              <div className={cn('text-sm space-y-1', colors.demoTextLight)}>
                <p><strong>Email:</strong> {config.demoEmail}</p>
                <p><strong>Password:</strong> {config.demoPassword}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3 w-full"
                onClick={fillDemoCredentials}
              >
                Fill Demo Credentials
              </Button>
            </div>

            {/* Switch login type */}
            <div className="mt-4 text-center">
              <Link
                to={userType === 'farmer' ? '/ranger-login' : '/farmer-login'}
                className={cn('text-sm hover:underline', colors.iconText)}
              >
                {userType === 'farmer' 
                  ? 'Are you a Forest Ranger? Login here'
                  : 'Are you a Farmer? Login here'
                }
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <p className="text-center text-gray-500 text-sm mt-6">
            🔒 {userType === 'farmer' 
              ? 'This portal is for registered local farmers only.'
              : 'This portal is for authorized forest department personnel only.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
