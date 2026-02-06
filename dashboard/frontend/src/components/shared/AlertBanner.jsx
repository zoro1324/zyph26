/**
 * AlertBanner - Reusable alert/notification banner component
 * Supports: danger, warning, info, success variants
 * Mobile-friendly with dismiss and action buttons
 */

import { useState } from 'react';
import { X, AlertTriangle, Info, CheckCircle, AlertCircle, ChevronRight, Bell } from 'lucide-react';
import { cn, getAnimalIcon } from '../../utils/helpers';

const variants = {
  danger: {
    bg: 'bg-red-50 border-red-200',
    icon: 'bg-red-100 text-red-600',
    title: 'text-red-800',
    text: 'text-red-700',
    button: 'bg-red-600 hover:bg-red-700 text-white',
    dismissBtn: 'text-red-500 hover:bg-red-100',
    IconComponent: AlertTriangle,
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    title: 'text-amber-800',
    text: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700 text-white',
    dismissBtn: 'text-amber-500 hover:bg-amber-100',
    IconComponent: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    dismissBtn: 'text-blue-500 hover:bg-blue-100',
    IconComponent: Info,
  },
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'bg-green-100 text-green-600',
    title: 'text-green-800',
    text: 'text-green-700',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    dismissBtn: 'text-green-500 hover:bg-green-100',
    IconComponent: CheckCircle,
  },
};

// Compact inline alert
function InlineAlert({ variant = 'info', children, className, icon }) {
  const config = variants[variant];
  const Icon = icon || config.IconComponent;
  
  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm',
      config.bg,
      config.text,
      className
    )}>
      <Icon className="w-4 h-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

// Full featured alert banner
function AlertBanner({
  variant = 'info',
  title,
  message,
  animalType,
  timestamp,
  dismissible = true,
  onDismiss,
  actionLabel,
  onAction,
  className,
  animate = false,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const config = variants[variant];
  const Icon = config.IconComponent;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all duration-300',
      config.bg,
      animate && variant === 'danger' && 'animate-pulse',
      className
    )}>
      <div className="flex items-start gap-3">
        {/* Icon or Animal */}
        <div className={cn('p-2 rounded-lg shrink-0', config.icon)}>
          {animalType ? (
            <span className="text-2xl">{getAnimalIcon(animalType)}</span>
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('font-semibold', config.title)}>
              {title}
            </h4>
          )}
          {message && (
            <p className={cn('text-sm mt-0.5', config.text)}>
              {message}
            </p>
          )}
          {timestamp && (
            <p className={cn('text-xs mt-1 opacity-75', config.text)}>
              {timestamp}
            </p>
          )}
          
          {/* Action button */}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={cn(
                'mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1',
                config.button
              )}
            >
              {actionLabel}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'p-1.5 rounded-lg transition-colors shrink-0',
              config.dismissBtn
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Floating notification toast
function FloatingAlert({
  variant = 'info',
  title,
  message,
  position = 'top-right',
  autoHide = true,
  hideAfter = 5000,
  onHide,
  className,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const config = variants[variant];
  const Icon = config.IconComponent;

  const positionClasses = {
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-center': 'fixed top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2',
  };

  useState(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, hideAfter);
      return () => clearTimeout(timer);
    }
  });

  if (!isVisible) return null;

  return (
    <div className={cn(
      positionClasses[position],
      'z-50 max-w-sm w-full shadow-xl rounded-xl border animate-slide-up',
      config.bg,
      className
    )}>
      <div className="flex items-start gap-3 p-4">
        <div className={cn('p-2 rounded-lg', config.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className={cn('font-semibold', config.title)}>{title}</h4>
          {message && (
            <p className={cn('text-sm mt-0.5', config.text)}>{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onHide?.();
          }}
          className={cn('p-1 rounded-lg', config.dismissBtn)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Alert list item for notification centers
function AlertListItem({
  variant = 'info',
  title,
  message,
  timestamp,
  isRead = false,
  onClick,
  className,
}) {
  const config = variants[variant];
  const Icon = config.IconComponent;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 p-4 text-left transition-colors rounded-lg',
        isRead ? 'bg-gray-50' : 'bg-white hover:bg-gray-50',
        'border border-gray-100',
        className
      )}
    >
      <div className={cn('p-2 rounded-lg shrink-0', config.icon)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn('font-medium text-gray-900', !isRead && 'font-semibold')}>
            {title}
          </h4>
          {!isRead && (
            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />
          )}
        </div>
        {message && (
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{message}</p>
        )}
        {timestamp && (
          <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
        )}
      </div>
    </button>
  );
}

// Main export with sub-components
AlertBanner.Inline = InlineAlert;
AlertBanner.Floating = FloatingAlert;
AlertBanner.ListItem = AlertListItem;

export default AlertBanner;
export { InlineAlert, FloatingAlert, AlertListItem };
