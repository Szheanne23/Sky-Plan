import React, { createContext, useContext, useState, useEffect } from 'react';

const TemperatureContext = createContext({
  unit: 'C',
  setUnit: () => {},
  toggleUnit: () => {},
  toDisplayTemp: (val) => val,
  unitSymbol: '°C',
  unitLabel: 'Celsius',
});

const STORAGE_KEY = 'skyplan_temp_unit';

export function TemperatureProvider({ children }) {
  const [unit, setUnitState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'F' ? 'F' : 'C';
    } catch {
      return 'C';
    }
  });

  const setUnit = (newUnit) => {
    const valid = newUnit === 'F' ? 'F' : 'C';
    setUnitState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
    } catch (err) {
      console.warn('Failed to persist temperature unit preference:', err);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  /**
   * Converts a Celsius value to the selected unit display value.
   * @param {number|string|null|undefined} celsiusVal
   * @param {number} precision (default 0)
   * @returns {number|string}
   */
  const toDisplayTemp = (celsiusVal, precision = 0) => {
    if (celsiusVal === null || celsiusVal === undefined || celsiusVal === '') {
      return '--';
    }
    const num = Number(celsiusVal);
    if (Number.isNaN(num)) return celsiusVal;

    const converted = unit === 'F' ? (num * 9) / 5 + 32 : num;
    if (precision === 0) {
      return Math.round(converted);
    }
    return Number(converted.toFixed(precision));
  };

  const unitSymbol = unit === 'F' ? '°F' : '°C';
  const unitLabel = unit === 'F' ? 'Fahrenheit' : 'Celsius';

  return (
    <TemperatureContext.Provider
      value={{
        unit,
        setUnit,
        toggleUnit,
        toDisplayTemp,
        unitSymbol,
        unitLabel,
      }}
    >
      {children}
    </TemperatureContext.Provider>
  );
}

export function useTemperature() {
  const context = useContext(TemperatureContext);
  if (!context) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
}
