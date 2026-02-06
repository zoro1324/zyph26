/**
 * CameraCard - Reusable camera health/status card
 * Shows: Battery %, Online/Offline status, Last detected animal
 * Used in Ranger dashboard
 */

import { Camera, Battery, Wifi, WifiOff, Sun, Clock, AlertTriangle, MapPin } from 'lucide-react';
import { Card, Badge } from '../ui';
import { formatSmartDate, getRelativeTime, getAnimalIcon, cn } from '../../utils/helpers';

// Battery level indicator with color coding
function BatteryLevel({ percent, className }) {
  const getColor = () => {
    if (percent > 60) return 'text-green-500';
    if (percent > 30) return 'text-amber-500';
    return 'text-red-500';
  };

  const getFill = () => {
    if (percent > 60) return 'bg-green-500';
    if (percent > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative w-8 h-4">
        {/* Battery outline */}
        <div className="absolute inset-0 border-2 border-gray-400 rounded-sm">
          {/* Battery fill */}
          <div 
            className={cn('h-full rounded-sm transition-all', getFill())}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        {/* Battery tip */}
        <div className="absolute -right-1 top-1 bottom-1 w-1 bg-gray-400 rounded-r-sm" />
      </div>
      <span className={cn('text-sm font-medium', getColor())}>
        {percent}%
      </span>
    </div>
  );
}

// Signal strength indicator
function SignalStrength({ strength, className }) {
  const bars = 4;
  const activeBars = Math.ceil((strength / 100) * bars);
  
  const getColor = () => {
    if (strength > 60) return 'bg-green-500';
    if (strength > 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('flex items-end gap-0.5', className)}>
      {[...Array(bars)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 rounded-t transition-colors',
            i < activeBars ? getColor() : 'bg-gray-300'
          )}
          style={{ height: `${(i + 1) * 4}px` }}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{strength}%</span>
    </div>
  );
}

// Compact camera card for lists
function CameraCardCompact({ camera, onClick, className }) {
  const isOnline = camera.status === 'online';
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl border transition-all',
        isOnline 
          ? 'bg-white border-gray-200 hover:border-forest-300 hover:shadow-md' 
          : 'bg-red-50 border-red-200',
        className
      )}
    >
      {/* Camera icon with status indicator */}
      <div className="relative">
        <div className={cn(
          'p-2.5 rounded-lg',
          isOnline ? 'bg-forest-100' : 'bg-red-100'
        )}>
          <Camera className={cn('w-5 h-5', isOnline ? 'text-forest-600' : 'text-red-600')} />
        </div>
        {/* Status dot */}
        <span className={cn(
          'absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white',
          isOnline ? 'bg-green-500' : 'bg-red-500'
        )} />
      </div>
      
      {/* Info */}
      <div className="flex-1 text-left">
        <p className="font-semibold text-gray-900">{camera.name}</p>
        <p className="text-xs text-gray-500">{camera.id} • {camera.zone}</p>
      </div>
      
      {/* Battery */}
      <BatteryLevel percent={camera.battery} />
    </button>
  );
}

// Full camera card with all details
function CameraCardFull({ camera, lastDetection, onClick, className }) {
  const isOnline = camera.status === 'online';
  const isCriticalBattery = camera.battery < 20;
  
  return (
    <Card 
      className={cn(
        'transition-all hover:shadow-lg cursor-pointer overflow-hidden',
        !isOnline && 'border-red-200 bg-red-50/50',
        isCriticalBattery && isOnline && 'border-amber-200',
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-3 rounded-xl',
            isOnline ? 'bg-forest-100' : 'bg-red-100'
          )}>
            <Camera className={cn('w-6 h-6', isOnline ? 'text-forest-600' : 'text-red-600')} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{camera.name}</h3>
            <p className="text-sm text-gray-500">{camera.id}</p>
          </div>
        </div>
        
        <Badge 
          variant={isOnline ? 'success' : 'danger'}
          size="sm"
        >
          <span className={cn(
            'w-2 h-2 rounded-full mr-1.5',
            isOnline ? 'bg-green-500' : 'bg-red-500'
          )} />
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Battery */}
        <div className={cn(
          'p-3 rounded-lg border',
          isCriticalBattery ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'
        )}>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Battery className="w-4 h-4" />
            <span className="text-xs font-medium">Battery</span>
          </div>
          <BatteryLevel percent={camera.battery} />
          {camera.solarCharging && (
            <div className="flex items-center gap-1 mt-1 text-amber-600">
              <Sun className="w-3 h-3" />
              <span className="text-xs">Charging</span>
            </div>
          )}
        </div>

        {/* Signal */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-red-500" />}
            <span className="text-xs font-medium">Signal</span>
          </div>
          <SignalStrength strength={camera.signalStrength} />
        </div>
      </div>

      {/* Zone & Location */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {camera.zone}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {getRelativeTime(camera.lastSeen)}
        </span>
      </div>

      {/* Last Detection */}
      {lastDetection && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Last Detection</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getAnimalIcon(lastDetection.animalType)}</span>
            <div>
              <p className="font-medium text-gray-900">{lastDetection.animalName}</p>
              <p className="text-xs text-gray-500">{formatSmartDate(lastDetection.timestamp)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning for offline or critical battery */}
      {(!isOnline || isCriticalBattery) && (
        <div className={cn(
          'mt-4 p-3 rounded-lg flex items-center gap-2',
          !isOnline ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
        )}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">
            {!isOnline 
              ? 'Camera offline - Check connection' 
              : 'Critical battery - Needs attention'
            }
          </span>
        </div>
      )}
    </Card>
  );
}

// Grid view optimized card
function CameraCardGrid({ camera, onClick, className }) {
  const isOnline = camera.status === 'online';
  
  return (
    <Card 
      className={cn(
        'p-4 transition-all hover:shadow-lg cursor-pointer text-center',
        !isOnline && 'border-red-200 bg-red-50/50',
        className
      )}
      onClick={onClick}
    >
      {/* Status icon */}
      <div className="relative inline-block mb-3">
        <div className={cn(
          'p-4 rounded-xl',
          isOnline ? 'bg-forest-100' : 'bg-red-100'
        )}>
          <Camera className={cn('w-8 h-8', isOnline ? 'text-forest-600' : 'text-red-600')} />
        </div>
        <span className={cn(
          'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white',
          isOnline ? 'bg-green-500' : 'bg-red-500'
        )} />
      </div>
      
      <h3 className="font-bold text-gray-900 truncate">{camera.name}</h3>
      <p className="text-xs text-gray-500 mb-3">{camera.zone}</p>
      
      <div className="flex items-center justify-center gap-4">
        <BatteryLevel percent={camera.battery} />
        <SignalStrength strength={camera.signalStrength} />
      </div>
    </Card>
  );
}

// Main component with subcomponents
function CameraCard(props) {
  const { variant = 'full', ...rest } = props;
  
  switch (variant) {
    case 'compact':
      return <CameraCardCompact {...rest} />;
    case 'grid':
      return <CameraCardGrid {...rest} />;
    default:
      return <CameraCardFull {...rest} />;
  }
}

CameraCard.Compact = CameraCardCompact;
CameraCard.Full = CameraCardFull;
CameraCard.Grid = CameraCardGrid;
CameraCard.BatteryLevel = BatteryLevel;
CameraCard.SignalStrength = SignalStrength;

export default CameraCard;
export { CameraCardCompact, CameraCardFull, CameraCardGrid, BatteryLevel, SignalStrength };
