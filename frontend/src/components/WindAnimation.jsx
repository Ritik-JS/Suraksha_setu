import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WindAnimation = ({ speed = 15, direction = 'NW', windData }) => {
  const [particles, setParticles] = useState([]);
  
  // Convert direction to degrees (N=0, E=90, S=180, W=270)
  const getDirectionDegrees = (dir) => {
    const directions = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    };
    return directions[dir] || 0;
  };
  
  useEffect(() => {
    // Generate wind particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);
  
  const directionDegrees = getDirectionDegrees(direction);
  const speedClass = speed > 40 ? 'text-red-500' : speed > 20 ? 'text-orange-500' : 'text-green-500';
  
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950 dark:to-blue-950 border-sky-200 dark:border-sky-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Wind Conditions</h3>
            <p className="text-sm text-muted-foreground">Real-time wind monitoring</p>
          </div>
          <motion.div
            animate={{ rotate: directionDegrees }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="p-3 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur"
          >
            <Wind className={`w-8 h-8 ${speedClass}`} />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur">
            <p className="text-sm text-muted-foreground mb-1">Speed</p>
            <p className={`text-3xl font-bold ${speedClass}`}>{speed} km/h</p>
          </div>
          <div className="p-4 rounded-lg bg-white/60 dark:bg-black/20 backdrop-blur">
            <p className="text-sm text-muted-foreground mb-1">Direction</p>
            <p className="text-3xl font-bold text-foreground">{direction}</p>
          </div>
        </div>
        
        {windData && (
          <div className="mt-4 p-3 rounded-lg bg-white/40 dark:bg-black/10 backdrop-blur">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Gusts:</span>
                <span className="ml-2 font-semibold">{windData.gusts || 'N/A'} km/h</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pressure:</span>
                <span className="ml-2 font-semibold">{windData.pressure || 'N/A'} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Animated wind particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-8 bg-white/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: `rotate(${directionDegrees}deg)`,
            }}
            animate={{
              x: [0, Math.cos((directionDegrees * Math.PI) / 180) * 200],
              y: [0, Math.sin((directionDegrees * Math.PI) / 180) * 200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </Card>
  );
};

export default WindAnimation;
