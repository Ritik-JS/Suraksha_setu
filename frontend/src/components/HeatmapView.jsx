import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Thermometer, Droplets, Wind } from 'lucide-react';

const HeatmapView = ({ data, type = 'aqi' }) => {
  const canvasRef = useRef(null);
  const [heatmapType, setHeatmapType] = useState(type);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background map (placeholder)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);
    
    // Generate heatmap data based on type
    const generateHeatmapData = () => {
      const points = [];
      const numPoints = 50;
      
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          intensity: Math.random(),
          radius: 30 + Math.random() * 40
        });
      }
      return points;
    };
    
    const heatmapData = data || generateHeatmapData();
    
    // Get color based on heatmap type and intensity
    const getColor = (intensity) => {
      if (heatmapType === 'aqi') {
        if (intensity > 0.8) return { r: 139, g: 0, b: 0 }; // Dark red
        if (intensity > 0.6) return { r: 255, g: 69, b: 0 }; // Orange-red
        if (intensity > 0.4) return { r: 255, g: 165, b: 0 }; // Orange
        if (intensity > 0.2) return { r: 255, g: 255, b: 0 }; // Yellow
        return { r: 0, g: 255, b: 0 }; // Green
      } else if (heatmapType === 'temperature') {
        if (intensity > 0.7) return { r: 200, g: 0, b: 0 };
        if (intensity > 0.5) return { r: 255, g: 100, b: 0 };
        if (intensity > 0.3) return { r: 255, g: 200, b: 0 };
        return { r: 100, g: 150, b: 255 };
      } else if (heatmapType === 'rainfall') {
        if (intensity > 0.7) return { r: 0, g: 0, b: 139 };
        if (intensity > 0.4) return { r: 0, g: 100, b: 255 };
        return { r: 100, g: 200, b: 255 };
      }
      return { r: 100, g: 100, b: 255 };
    };
    
    // Draw heatmap points
    heatmapData.forEach(point => {
      const color = getColor(point.intensity);
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, point.radius
      );
      
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${point.intensity})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${point.intensity * 0.5})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        point.x - point.radius,
        point.y - point.radius,
        point.radius * 2,
        point.radius * 2
      );
    });
    
    // Add grid overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
  }, [heatmapType, data]);
  
  const heatmapTypes = [
    { id: 'aqi', label: 'Air Quality', icon: Activity },
    { id: 'temperature', label: 'Temperature', icon: Thermometer },
    { id: 'rainfall', label: 'Rainfall', icon: Droplets },
    { id: 'wind', label: 'Wind Speed', icon: Wind },
  ];
  
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Heatmap Visualization</h3>
        <p className="text-sm text-slate-400">Interactive environmental data overlay</p>
      </div>
      
      <Tabs value={heatmapType} onValueChange={setHeatmapType} className="mb-4">
        <TabsList className="grid grid-cols-4 bg-slate-800/50">
          {heatmapTypes.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="data-[state=active]:bg-slate-700">
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="relative rounded-lg overflow-hidden border-2 border-slate-700">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto"
        />
        
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
            Live Data
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Legend:</span>
          <div className="flex items-center gap-4">
            {heatmapType === 'aqi' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-green-500"></span>
                  <span>Good</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-yellow-500"></span>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-orange-500"></span>
                  <span>Unhealthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600"></span>
                  <span>Hazardous</span>
                </div>
              </>
            )}
            {heatmapType === 'temperature' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-400"></span>
                  <span>Cool</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-yellow-400"></span>
                  <span>Warm</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-500"></span>
                  <span>Hot</span>
                </div>
              </>
            )}
            {heatmapType === 'rainfall' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-cyan-200"></span>
                  <span>Light</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-400"></span>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-700"></span>
                  <span>Heavy</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HeatmapView;
