import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { checkOnlineStatus, setupOnlineStatusListeners } from '@/utils/offlineUtils';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(checkOnlineStatus());
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    const cleanup = setupOnlineStatusListeners(
      () => {
        setIsOnline(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      },
      () => {
        setIsOnline(false);
        setShowNotification(true);
      }
    );
    
    return cleanup;
  }, []);
  
  if (isOnline && !showNotification) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        {!isOnline ? (
          <Badge className="bg-red-500 text-white border-none px-4 py-2 text-sm shadow-2xl">
            <WifiOff className="w-4 h-4 mr-2" />
            You are offline - Using cached data
          </Badge>
        ) : (
          showNotification && (
            <Badge className="bg-green-500 text-white border-none px-4 py-2 text-sm shadow-2xl">
              <Wifi className="w-4 h-4 mr-2" />
              Back online!
            </Badge>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineIndicator;
