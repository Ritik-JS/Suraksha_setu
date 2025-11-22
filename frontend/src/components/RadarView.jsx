import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radar, Satellite, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RadarView = ({ type = 'weather' }) => {
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [radarData, setRadarData] = useState([]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Generate mock radar data
    const generateRadarData = () => {
      const data = [];
      for (let i = 0; i < 20; i++) {
        data.push({
          angle: Math.random() * 360,
          distance: Math.random() * radius,
          intensity: Math.random(),
          type: ['rain', 'storm', 'clear'][Math.floor(Math.random() * 3)]
        });
      }
      setRadarData(data);
    };
    
    generateRadarData();
    
    let animationId;
    let scanAngle = 0;
    
    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = 'rgba(0, 20, 40, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw concentric circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 150, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.strokeStyle = 'rgba(0, 255, 150, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw radar data points
      radarData.forEach(point => {
        const x = centerX + point.distance * Math.cos(point.angle * Math.PI / 180);
        const y = centerY + point.distance * Math.sin(point.angle * Math.PI / 180);
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        
        if (point.type === 'storm') {
          ctx.fillStyle = `rgba(255, 50, 50, ${point.intensity})`;
        } else if (point.type === 'rain') {
          ctx.fillStyle = `rgba(50, 150, 255, ${point.intensity})`;
        } else {
          ctx.fillStyle = `rgba(100, 255, 100, ${point.intensity * 0.3})`;
        }
        ctx.fill();
        
        // Add glow effect for intense readings
        if (point.intensity > 0.7) {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 100, 100, ${point.intensity * 0.3})`;
          ctx.fill();
        }
      });
      
      // Draw scanning line
      if (scanning) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(scanAngle * Math.PI / 180);
        
        const gradient = ctx.createLinearGradient(0, 0, radius, 0);
        gradient.addColorStop(0, 'rgba(0, 255, 150, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 150, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 255, 150, 0)');
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius, 0);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
        
        scanAngle = (scanAngle + 2) % 360;
      }
      
      animationId = requestAnimationFrame(drawRadar);
    };
    
    drawRadar();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scanning, radarData]);
  
  const handleRefresh = () => {
    setScanning(true);
    setTimeout(() => setScanning(false), 3000);
  };
  
  return (
    <Card className="p-6 bg-slate-900 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Radar className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {type === 'weather' ? 'Weather Radar' : 'Satellite View'}
            </h3>
            <p className="text-sm text-slate-400">Real-time monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
            Live
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="border-slate-600 hover:bg-slate-800"
            data-testid="radar-refresh-button"
          >
            <RefreshCw className={`w-4 h-4 text-slate-300 ${scanning ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-auto rounded-lg"
      />
      
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Storm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Rain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Clear</span>
          </div>
        </div>
        <span>Range: 200 km</span>
      </div>
    </Card>
  );
};

export default RadarView;
