import { useState, useEffect, useCallback } from "react";

export interface FoodItem {
  id: string;
  name: string;
  type: "beef" | "potato" | "tofu";
  temp: number;
  heatCapacity: number; // J/g·K (Specific heat)
  mass: number; // grams
}

const FOOD_DATA = {
  beef: { name: "Beef", heatCapacity: 2.8, mass: 50 },
  potato: { name: "Potato", heatCapacity: 3.4, mass: 80 },
  tofu: { name: "Tofu", heatCapacity: 3.8, mass: 60 },
};

export const useHotPot = () => {
  // PHYSICS CONSTANTS
  const SPECIFIC_HEAT_WATER = 4.184; // J/g·K
  const MAX_VOLUME = 3000;
  const BOILING_POINT = 100;
  const AMBIENT_TEMP = 25;
  const EVAPORATION_RATE = 0.5;
  const BASE_HEAT_PER_SETTING = 500; // Balanced for 3.3x original speed (10x / 3)

  // STATE
  const [temp, setTemp] = useState(25);
  const [volume, setVolume] = useState(1000);
  const [firePowerSetting, setFirePowerSetting] = useState(5);
  const [foodInPot, setFoodInPot] = useState<FoodItem[]>([]);
  const [isBoiling, setIsBoiling] = useState(false);
  const [flicker, setFlicker] = useState(0);

  const getFireOutput = useCallback(() => {
    if (firePowerSetting === 0) return 0;
    const basePower = firePowerSetting * BASE_HEAT_PER_SETTING;
    const randomVariation = (Math.random() - 0.5) * 50;
    return Math.max(0, basePower + randomVariation);
  }, [firePowerSetting]);

  const getOverallHeatCapacity = useCallback(() => {
    const liquidC = volume * SPECIFIC_HEAT_WATER;
    const foodC = foodInPot.reduce((acc, item) => acc + (item.heatCapacity * item.mass), 0);
    return liquidC + foodC;
  }, [volume, foodInPot]);

  const getHeatGainRate = useCallback(() => {
    const power = getFireOutput();
    const heatLoss = (temp - AMBIENT_TEMP) * 12;
    return power - heatLoss;
  }, [getFireOutput, temp]);

  const addLiquid = (amount: number, liquidTemp: number) => {
    const currentC = getOverallHeatCapacity();
    const newLiquidC = amount * SPECIFIC_HEAT_WATER;
    const newTemp = (temp * currentC + liquidTemp * newLiquidC) / (currentC + newLiquidC);
    
    setVolume(v => Math.min(MAX_VOLUME, v + amount));
    setTemp(newTemp);
  };

  const addFood = (type: keyof typeof FOOD_DATA) => {
    const data = FOOD_DATA[type];
    const newItem: FoodItem = {
      id: Math.random().toString(36).substring(7),
      name: data.name,
      type: type,
      temp: AMBIENT_TEMP,
      heatCapacity: data.heatCapacity,
      mass: data.mass,
    };

    const currentC = getOverallHeatCapacity();
    const foodC = newItem.heatCapacity * newItem.mass;
    const newTemp = (temp * currentC + newItem.temp * foodC) / (currentC + foodC);

    setTemp(newTemp);
    setFoodInPot(prev => [...prev, newItem]);
  };

  const removeFood = (id: string) => {
    setFoodInPot(prev => prev.filter(f => f.id !== id));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(Math.random());
      const netHeat = getHeatGainRate();
      const totalC = getOverallHeatCapacity();
      
      if (temp >= BOILING_POINT && netHeat > 0) {
        setIsBoiling(true);
        setTemp(BOILING_POINT);
        setVolume(v => Math.max(200, v - EVAPORATION_RATE));
      } else {
        setIsBoiling(false);
        const deltaT = netHeat / totalC;
        setTemp(prev => Math.max(AMBIENT_TEMP, prev + deltaT));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [getHeatGainRate, getOverallHeatCapacity, temp]);

  return {
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
    isBoiling,
    flicker
  };
};