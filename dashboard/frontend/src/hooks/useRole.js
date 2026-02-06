/**
 * useRole - Custom hook for role-based feature access
 * Provides utilities for conditional rendering based on user role
 */

import { useMemo } from 'react';
import { useAuth, USER_ROLES } from '../context/AuthContext';

// Feature permissions by role
const ROLE_PERMISSIONS = {
  [USER_ROLES.RANGER]: {
    canViewCameras: true,
    canViewLiveFeeds: true,
    canViewAnalytics: true,
    canViewAlerts: true,
    canManageAlerts: true,
    canViewDetectionHistory: true,
    canViewRealTimeData: true,
    canViewHumanDetections: true,
    canViewCameraLocations: true,
    canExportData: true,
    canAccessSettings: true,
    canViewMovementTrails: true,
    dataDelay: 0, // Real-time
  },
  [USER_ROLES.FARMER]: {
    canViewCameras: false,
    canViewLiveFeeds: false,
    canViewAnalytics: false,
    canViewAlerts: true,
    canManageAlerts: false,
    canViewDetectionHistory: false,
    canViewRealTimeData: true,
    canViewHumanDetections: false,
    canViewCameraLocations: false,
    canExportData: false,
    canAccessSettings: false,
    canViewMovementTrails: false,
    dataDelay: 0, // Real-time alerts for safety
  },
  [USER_ROLES.PUBLIC]: {
    canViewCameras: false,
    canViewLiveFeeds: false,
    canViewAnalytics: false,
    canViewAlerts: false,
    canManageAlerts: false,
    canViewDetectionHistory: true, // Read-only
    canViewRealTimeData: false,
    canViewHumanDetections: false,
    canViewCameraLocations: false,
    canExportData: false,
    canAccessSettings: false,
    canViewMovementTrails: false,
    dataDelay: 30 * 60 * 1000, // 30 minutes delay
  },
};

export function useRole() {
  const { role, isRanger, isFarmer, isPublicUser, isAuthenticated } = useAuth();

  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[USER_ROLES.PUBLIC];
  }, [role]);

  // Check if current role has a specific permission
  const hasPermission = (permissionKey) => {
    return permissions[permissionKey] === true;
  };

  // Get data with appropriate delay for role
  const getDelayedTimestamp = (timestamp) => {
    if (permissions.dataDelay === 0) {
      return timestamp;
    }
    return new Date(new Date(timestamp).getTime() + permissions.dataDelay).toISOString();
  };

  // Filter data based on role permissions
  const filterDataForRole = (detections) => {
    if (!Array.isArray(detections)) return [];

    return detections.filter((detection) => {
      // Filter out human detections for non-rangers
      if (!permissions.canViewHumanDetections && detection.animalType === 'human') {
        return false;
      }
      return true;
    });
  };

  // Get appropriate navigation items for role
  const getNavigationItems = () => {
    const baseItems = [];

    if (isRanger) {
      return [
        { path: '/ranger', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/ranger/live-monitoring', label: 'Live Monitoring', icon: 'Video' },
        { path: '/ranger/map-tracking', label: 'Map Tracking', icon: 'Map' },
        { path: '/ranger/detection-history', label: 'Detection History', icon: 'History' },
        { path: '/ranger/alerts', label: 'Alerts Center', icon: 'Bell' },
        { path: '/ranger/camera-health', label: 'Camera Health', icon: 'Camera' },
        { path: '/ranger/analytics', label: 'Analytics', icon: 'BarChart3' },
        { path: '/ranger/settings', label: 'Settings', icon: 'Settings' },
      ];
    }

    if (isFarmer) {
      // Farmer has single-page view, no navigation needed
      return [];
    }

    if (isPublicUser) {
      // Public has single-page view, no navigation needed
      return [];
    }

    return baseItems;
  };

  return {
    role,
    permissions,
    hasPermission,
    getDelayedTimestamp,
    filterDataForRole,
    getNavigationItems,
    isRanger,
    isFarmer,
    isPublicUser,
    isAuthenticated,
    // Quick permission checks
    canViewCameras: permissions.canViewCameras,
    canViewAlerts: permissions.canViewAlerts,
    canViewAnalytics: permissions.canViewAnalytics,
    canViewRealTimeData: permissions.canViewRealTimeData,
  };
}

export { USER_ROLES };
export default useRole;
