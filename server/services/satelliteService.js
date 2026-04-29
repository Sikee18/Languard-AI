// This service simulates real satellite data fetching
// Instead of random numbers, it uses coordinates to generate "Deterministic" results
export const analyzeLand = (coordinates) => {
  // Use coordinates to create a consistent 'seed' for this location
  const seed = coordinates.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Deterministic results (Always the same for the same location)
  const landCoverChange = (seed % 40) + 5;
  const vegetationLoss = (seed % 30) + 2;
  const builtUpIncrease = (seed % 35) + 3;
  
  return {
    landCoverChange,
    vegetationLoss,
    builtUpIncrease,
    unauthorizedFlag: landCoverChange > 15,
    timestamp: new Date().toISOString()
  };
};

export const analyzeElevation = (coordinates) => {
  const seed = coordinates.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const oldElevation = 100 + (seed % 50);
  const diff = (seed % 20) - 5;
  const newElevation = oldElevation + diff;
  
  return {
    oldElevation,
    newElevation,
    difference: Math.abs(diff),
    verticalConstruction: Math.abs(diff) > 5
  };
};
