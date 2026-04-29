import { analyzeLand, analyzeElevation } from './satelliteService.js';

export const runFullAudit = (application) => {
  const satelliteData = analyzeLand(application.coordinates);
  const elevationData = analyzeElevation(application.coordinates);
  
  const violations = [];
  
  // Rule 1: Land Cover Change (Max 15% allowed)
  if (satelliteData.landCoverChange > 15) {
    violations.push(`Unauthorized Land Clearing: ${satelliteData.landCoverChange}% detected.`);
  }
  
  // Rule 2: Vertical Construction (Max 5m difference allowed)
  if (elevationData.difference > 5) {
    violations.push(`Unauthorized Vertical Height: ${elevationData.difference}m change detected.`);
  }

  const riskScore = (violations.length * 40) + (satelliteData.landCoverChange / 2);

  return {
    decision: violations.length > 0 ? 'NEEDS_REVIEW' : 'APPROVED',
    riskScore: Math.min(Math.round(riskScore), 100),
    violatedRules: violations,
    officerRemarks: violations.length > 0 
      ? 'Automated audit flagged significant physical changes.' 
      : 'No significant anomalies detected via satellite.'
  };
};
