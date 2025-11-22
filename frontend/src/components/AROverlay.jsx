import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Maximize2, Navigation, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AROverlay = ({ onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [arMode, setArMode] = useState('safe-route');
  const [annotations, setAnnotations] = useState([
    { id: 1, x: 30, y: 40, type: 'danger', label: 'Flood Zone', distance: '200m' },
    { id: 2, x: 60, y: 30, type: 'safe', label: 'Evacuation Center', distance: '500m' },
    { id: 3, x: 45, y: 60, type: 'warning', label: 'Blocked Road', distance: '150m' },
  ]);
  
  const getAnnotationColor = (type) => {
    switch (type) {
      case 'danger': return 'border-red-500 bg-red-500/20 text-red-300';
      case 'safe': return 'border-green-500 bg-green-500/20 text-green-300';
      case 'warning': return 'border-yellow-500 bg-yellow-500/20 text-yellow-300';
      default: return 'border-blue-500 bg-blue-500/20 text-blue-300';
    }
  };
  
  const getAnnotationIcon = (type) => {
    switch (type) {
      case 'danger': return AlertTriangle;
      case 'safe': return Navigation;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 bg-black ${
        isFullscreen ? '' : 'md:inset-4 md:rounded-2xl md:border-4 md:border-white/20'
      }`}
    >
      {/* Camera Feed Simulation */}
      <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Simulated camera feed background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920')] bg-cover bg-center"></div>
        </div>
        
        {/* AR Grid Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Scanning Line Effect */}
        <motion.div
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          animate={{
            y: ['0%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* AR Annotations */}
        <AnimatePresence>
          {annotations.map((annotation) => {
            const Icon = getAnnotationIcon(annotation.type);
            return (
              <motion.div
                key={annotation.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute"
                style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
              >
                {/* Pulsing indicator */}
                <div className="relative">
                  <motion.div
                    className={`absolute inset-0 rounded-full border-2 ${getAnnotationColor(annotation.type)}`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  
                  {/* Marker */}
                  <div className={`relative w-3 h-3 rounded-full border-2 ${getAnnotationColor(annotation.type)}`} />
                  
                  {/* Info Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute left-6 top-0 min-w-[200px] p-3 rounded-lg border-2 backdrop-blur-xl ${getAnnotationColor(annotation.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">{annotation.label}</p>
                        <p className="text-xs opacity-80">{annotation.distance} away</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Compass */}
        <motion.div
          className="absolute top-20 right-8 w-20 h-20 rounded-full border-2 border-cyan-400 bg-black/50 backdrop-blur flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <Navigation className="w-8 h-8 text-cyan-400" />
          <span className="absolute top-1 text-xs text-cyan-400 font-bold">N</span>
        </motion.div>
        
        {/* Status Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-300 border-red-500/50 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse mr-2"></span>
              AR MODE ACTIVE
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/50">
              Safe Route Detection
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="bg-black/50 hover:bg-black/70 text-white backdrop-blur"
              data-testid="ar-fullscreen-button"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="bg-black/50 hover:bg-black/70 text-white backdrop-blur"
              data-testid="ar-close-button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          <Button
            variant="outline"
            className="bg-black/50 backdrop-blur border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
            onClick={() => setarMode('safe-route')}
            data-testid="ar-safe-route-button"
          >
            Safe Route
          </Button>
          <Button
            variant="outline"
            className="bg-black/50 backdrop-blur border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
            onClick={() => setarMode('hazards')}
            data-testid="ar-hazards-button"
          >
            Show Hazards
          </Button>
          <Button
            variant="outline"
            className="bg-black/50 backdrop-blur border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
            onClick={() => setarMode('shelters')}
            data-testid="ar-shelters-button"
          >
            Nearby Shelters
          </Button>
        </div>
        
        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-50"></div>
            <div className="absolute inset-2 border-2 border-cyan-400 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-cyan-400"></div>
              <div className="absolute w-full h-px bg-cyan-400"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AROverlay;
