import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Beef, 
  Utensils, 
  Info, 
  Thermometer, 
  Wind,
  Droplet,
  Soup
} from "lucide-react";
import { useHotPot } from "@/hooks/useHotPot";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { SEO } from "@/components/SEO";

export default function HotPotLab() {
  const {
    temp,
    volume,
    foodInPot,
    firePowerSetting,
    setFirePowerSetting,
    addLiquid,
    addFood,
    removeFood,
    getOverallHeatCapacity,
    getFireOutput,
    getHeatGainRate,
    isBoiling
  } = useHotPot();

  const FOOD_TYPES = [
    { type: "beef" as const, name: "Beef", color: "bg-red-700", icon: Beef, heatCap: 2.8, mass: 50 },
    { type: "potato" as const, name: "Potato", color: "bg-yellow-600", icon: Utensils, heatCap: 3.4, mass: 80 },
    { type: "tofu" as const, name: "Tofu", color: "bg-yellow-100", icon: Utensils, heatCap: 3.8, mass: 60 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-orange-100">
      <SEO title="Hot Pot Lab | Heat Capacity Simulation" />
      
      <header className="p-6 flex justify-between items-start fixed top-0 w-full z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Hot Pot Lab</h1>
          <p className="text-sm text-slate-500">Thermal Physics Simulation</p>
        </div>
        
        <div className="flex gap-3 pointer-events-auto">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center cursor-help hover:bg-slate-50 transition-colors">
                  <Info className="w-5 h-5 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-80 p-4">
                <h3 className="font-bold mb-2">What is Heat Capacity?</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  It's how much energy a substance needs to raise its temperature. Water has a high heat capacity, meaning it "holds" a lot of energy!
                </p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border flex items-center justify-center cursor-help hover:bg-slate-50 transition-colors">
                  <Thermometer className="w-5 h-5 text-slate-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-80 p-4">
                <h3 className="font-bold mb-2">Thermal Equilibrium</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When you add cold water or food, they absorb energy from the hot soup until everything reaches the same temperature.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Large STATIC Temperature Display */}
        <div className="mb-12 text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-8xl font-black tabular-nums tracking-tighter text-slate-900">
              {temp.toFixed(1)}°C
            </span>
            <div className="h-2 w-32 bg-orange-500 rounded-full mt-2" />
            {isBoiling && (
              <span className="text-orange-600 font-bold text-sm mt-4 uppercase tracking-widest">Boiling Point Reached</span>
            )}
          </div>
        </div>

        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-24">
          
          {/* Liquids */}
          <div className="flex flex-col gap-12 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.point.x - window.innerWidth/2) < 200) addLiquid(200, 10);
                    }}
                    className="w-24 h-36 bg-blue-100/40 border-2 border-blue-200 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-end p-2 shadow-sm backdrop-blur-sm"
                  >
                    <div className="h-3/4 w-full bg-blue-400/30 rounded-lg relative overflow-hidden">
                       <div className="absolute bottom-0 w-full h-1/2 bg-blue-400/40" />
                    </div>
                    <Droplet className="w-8 h-8 text-blue-500 mt-2" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Cold Water (10°C)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      if (Math.abs(info.point.x - window.innerWidth/2) < 200) addLiquid(200, 60);
                    }}
                    className="w-24 h-36 bg-orange-100/40 border-2 border-orange-200 rounded-xl cursor-grab active:cursor-grabbing flex flex-col items-center justify-end p-2 shadow-sm backdrop-blur-sm"
                  >
                    <div className="h-3/4 w-full bg-orange-400/30 rounded-lg relative overflow-hidden">
                      <div className="absolute bottom-0 w-full h-3/4 bg-orange-400/40" />
                    </div>
                    <Soup className="w-8 h-8 text-orange-500 mt-2" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>Hot Soup (60°C)</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* STATIC Pot & Stove */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence>
              {temp > 40 && (
                <div className="absolute -top-24 flex gap-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        y: [-20, -80], 
                        x: [0, (i-2)*15], 
                        opacity: [0, 0.4, 0],
                        scale: [0.8, 1.4]
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5, ease: "easeOut" }}
                    >
                      <Wind className="w-8 h-8 text-slate-200" />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* NO MOTION WRAPPER ON POT - COMPLETELY STATIC CONTAINER */}
                  <div className="relative w-80 h-56 bg-slate-300 rounded-b-[5rem] border-x-[10px] border-b-[10px] border-slate-400 shadow-2xl overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full transition-colors duration-1000"
                      style={{ 
                        height: `${Math.min(100, (volume / 3000) * 100)}%`,
                        backgroundColor: temp > 80 ? '#ef4444' : temp > 50 ? '#f97316' : '#3b82f6'
                      }}
                    >
                      {isBoiling && (
                        <div className="absolute inset-0">
                          {[...Array(10)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-4 h-4 bg-white/30 rounded-full"
                              style={{ left: `${Math.random() * 100}%`, bottom: '0%' }}
                              animate={{ y: [-10, -180], opacity: [0, 1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: Math.random() }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 flex flex-wrap gap-3 p-6 items-end justify-center">
                      <AnimatePresence>
                        {foodInPot.map((food) => (
                          <Tooltip key={food.id}>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                onClick={() => removeFood(food.id)}
                                className={`w-14 h-14 rounded-xl shadow-lg cursor-pointer flex items-center justify-center text-white text-2xl
                                  ${food.type === 'beef' ? 'bg-red-800' : food.type === 'potato' ? 'bg-yellow-700' : 'bg-slate-100 text-slate-600'}
                                `}
                              >
                                {food.type === 'beef' ? <Beef size={28} /> : <Utensils size={28} />}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-bold capitalize">{food.name}</p>
                              <p className="text-xs">Temp: {food.temp.toFixed(1)}°C</p>
                              <p className="text-xs">Specific Heat: {food.heatCapacity} J/g·°C</p>
                              <p className="text-xs text-red-400 mt-1">Click to remove</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-4 w-64">
                  <div className="space-y-2">
                    <p className="font-bold text-lg">Pot Data</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Total Heat Capacity:</span>
                      <span className="font-mono">{getOverallHeatCapacity().toFixed(0)} J/°C</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Soup Volume:</span>
                      <span className="font-mono">{volume.toFixed(0)} ml</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Net Energy Rate:</span>
                      <span className="font-mono text-orange-600">+{getHeatGainRate().toFixed(0)} W</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-[22rem] h-14 bg-slate-800 rounded-t-2xl mt-[-4px] flex items-center justify-center p-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: firePowerSetting > 0 ? [10, 20 + (firePowerSetting * 5), 10] : 4,
                            opacity: firePowerSetting > 0 ? 1 : 0.2
                          }}
                          transition={{ repeat: Infinity, duration: 0.2, delay: i * 0.05 }}
                          className="w-5 bg-orange-500 rounded-full"
                        />
                      ))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">Fire Power</p>
                    <p className="font-mono text-orange-500">{getFireOutput().toFixed(0)} Watts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="mt-12 w-72">
              <div className="flex justify-between mb-3 text-xs uppercase tracking-widest text-slate-400 font-bold">
                <span>Off</span>
                <span>Stove Setting</span>
                <span>Max</span>
              </div>
              <Slider
                value={[firePowerSetting]}
                onValueChange={(vals) => setFirePowerSetting(vals[0])}
                max={10}
                step={1}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Larger Food Bowls */}
          <div className="flex flex-col gap-8 items-center">
            {FOOD_TYPES.map((food) => (
              <TooltipProvider key={food.type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      drag
                      dragSnapToOrigin
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.point.x - window.innerWidth/2) < 200) {
                          addFood(food.type);
                        }
                      }}
                      className="w-32 h-32 rounded-full border-[6px] border-slate-200 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform bg-white group"
                    >
                      <food.icon className={`w-16 h-16 ${food.type === 'beef' ? 'text-red-700' : 'text-slate-400'}`} />
                      <div className="absolute -bottom-4 px-3 py-1 bg-slate-800 text-white rounded text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {food.name}
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-bold">{food.name}</p>
                    <p className="text-xs">Mass: {food.mass}g</p>
                    <p className="text-xs">Specific Heat: {food.heatCap} J/g·°C</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

        </div>

        <div className="mt-24 flex items-center gap-4 text-slate-400 text-sm uppercase tracking-widest font-semibold">
          <div className="w-12 h-px bg-slate-200" />
          <span>Investigation: Thermal Equilibrium Lab</span>
          <div className="w-12 h-px bg-slate-200" />
        </div>
      </main>
    </div>
  );
}