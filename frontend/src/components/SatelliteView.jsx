import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Satellite, Layers, ZoomIn, ZoomOut, RotateCw, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SatelliteView = () => {
  const [zoom, setZoom] = useState(50);
  const [layer, setLayer] = useState('visible');
  const [opacity, setOpacity] = useState(100);
  const [timeframe, setTimeframe] = useState('current');
  
  const layers = [
    { value: 'visible', label: 'Visible Light', color: 'bg-blue-500' },
    { value: 'infrared', label: 'Infrared', color: 'bg-red-500' },
    { value: 'water-vapor', label: 'Water Vapor', color: 'bg-cyan-500' },
    { value: 'composite', label: 'Composite', color: 'bg-purple-500' },
  ];
  
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-950 to-slate-900 border-indigo-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20">
            <Satellite className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Satellite Imagery</h3>
            <p className="text-sm text-slate-400">Real-time Earth observation</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
          Live Feed
        </Badge>
      </div>
      
      {/* Controls */}
      <div className="mb-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Layer Type</label>
            <Select value={layer} onValueChange={setLayer}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layers.map(l => (
                  <SelectItem key={l.value} value={l.value}>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${l.color}`}></span>
                      {l.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-xs text-slate-400 mb-2 block">Timeframe</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="1h-ago">1 Hour Ago</SelectItem>
                <SelectItem value="3h-ago">3 Hours Ago</SelectItem>
                <SelectItem value="6h-ago">6 Hours Ago</SelectItem>
                <SelectItem value="24h-ago">24 Hours Ago</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-xs text-slate-400 mb-2 block">Opacity: {opacity}%</label>
          <Slider
            value={[opacity]}
            onValueChange={([val]) => setOpacity(val)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
            onClick={() => setZoom(Math.min(zoom + 10, 100))}
            data-testid="satellite-zoom-in-button"
          >
            <ZoomIn className="w-4 h-4 mr-2" />
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
            onClick={() => setZoom(Math.max(zoom - 10, 0))}
            data-testid="satellite-zoom-out-button"
          >
            <ZoomOut className="w-4 h-4 mr-2" />
            Zoom Out
          </Button>
        </div>
      </div>
      
      {/* Satellite View */}
      <div className="relative rounded-lg overflow-hidden border-2 border-slate-700 bg-slate-950 h-[500px]">
        {/* Satellite Image Placeholder */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-green-900"
          style={{ opacity: opacity / 100 }}
          animate={{
            scale: 1 + (zoom / 100),
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Simulated cloud patterns */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20 blur-xl"
                style={{
                  width: `${50 + Math.random() * 100}px`,
                  height: `${50 + Math.random() * 100}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
          
          {/* Storm system visualization */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,100,0,0.3) 50%, transparent 70%)',
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity },
            }}
          />
          
          {/* Geographic overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="geo-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#fff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#geo-grid)" />
          </svg>
        </motion.div>
        
        {/* Coordinates Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between text-xs text-white font-mono">
          <div className="bg-black/50 backdrop-blur px-3 py-1 rounded">
            LAT: 20.2961° N
          </div>
          <div className="bg-black/50 backdrop-blur px-3 py-1 rounded">
            LONG: 85.8245° E
          </div>
          <div className="bg-black/50 backdrop-blur px-3 py-1 rounded">
            ALT: {(zoom * 5).toFixed(0)} km
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur p-3 rounded-lg text-xs text-white">
          <div className="font-semibold mb-2">Color Legend</div>
          {layer === 'visible' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded"></span>
                <span>Water Bodies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-600 rounded"></span>
                <span>Vegetation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-600 rounded"></span>
                <span>Urban Areas</span>
              </div>
            </div>
          )}
          {layer === 'infrared' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-600 rounded"></span>
                <span>High Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-yellow-600 rounded"></span>
                <span>Medium Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-600 rounded"></span>
                <span>Low Temperature</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur px-3 py-2 rounded-lg text-xs text-white flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center text-slate-400">
        Imagery provided by Earth Observation Satellites • Updated every 15 minutes
      </div>
    </Card>
  );
};

export default SatelliteView;
