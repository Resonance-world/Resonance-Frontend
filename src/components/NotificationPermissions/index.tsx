'use client';

import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { useEffect, useState } from 'react';

/**
 * This component handles notification permissions for InnerView
 * It asks users if they want to receive notifications and manages the permission state
 */
export const NotificationPermissions = () => {
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isInstalled } = useMiniKit();

  useEffect(() => {
    const fetchPermissions = async () => {
      if (isInstalled) {
        try {
          // Fetch current permissions from MiniKit
          const permissions = await MiniKit.commandsAsync.getPermissions();
          if (permissions?.finalPayload.status === 'success') {
            const currentPermissions = permissions?.finalPayload.permissions || {};
            setNotificationPermission(currentPermissions.notifications || false);
            console.log('📱 Current notification permission:', currentPermissions.notifications);
          }
        } catch (error) {
          console.error('❌ Failed to fetch permissions:', error);
        }
      }
    };
    
    fetchPermissions();
  }, [isInstalled]);

  const handleNotificationToggle = async (enable: boolean) => {
    setIsLoading(true);
    
    try {
      console.log(`📱 ${enable ? 'Enabling' : 'Disabling'} notifications...`);
      
      // TODO: Implement permission request/update logic when available in MiniKit
      // For now, we'll just update the local state
      setNotificationPermission(enable);
      
      console.log(`✅ Notifications ${enable ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('❌ Failed to update notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInstalled) {
    return null;
  }

  return (
    <div className="grid w-full gap-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">📱 Notifications</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Would you like to receive notifications about new messages, updates, and important information?
        </p>
        
        <div className="flex gap-3">
          <Button
            onClick={() => handleNotificationToggle(true)}
            disabled={isLoading || notificationPermission === true}
            variant={notificationPermission === true ? "primary" : "secondary"}
            size="sm"
            className="flex-1"
          >
            {isLoading && notificationPermission !== true ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                Enabling...
              </div>
            ) : (
              <>
                {notificationPermission === true ? '✅' : '🔔'} Enable Notifications
              </>
            )}
          </Button>
          
          <Button
            onClick={() => handleNotificationToggle(false)}
            disabled={isLoading || notificationPermission === false}
            variant={notificationPermission === false ? "secondary" : "tertiary"}
            size="sm"
            className="flex-1"
          >
            {isLoading && notificationPermission !== false ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Disabling...
              </div>
            ) : (
              <>
                {notificationPermission === false ? '✅' : '🔕'} No Notifications
              </>
            )}
          </Button>
        </div>
        
        {notificationPermission !== null && (
          <p className="text-xs text-muted-foreground mt-3">
            Status: Notifications are currently{' '}
            <span className="font-medium">
              {notificationPermission ? 'enabled' : 'disabled'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}; 