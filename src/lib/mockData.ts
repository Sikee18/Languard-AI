export interface RegulationRule {
  maxFloors: number;
  far: number;
  basementAllowed: boolean;
  maxHeight: number;
  setback: number;
}

export const REGULATIONS: Record<string, RegulationRule> = {
  Residential: { maxFloors: 5, far: 2.0, basementAllowed: true, maxHeight: 50, setback: 3 },
  Commercial: { maxFloors: 8, far: 3.0, basementAllowed: true, maxHeight: 80, setback: 5 },
  "Airport Zone": { maxFloors: 3, far: 1.5, basementAllowed: true, maxHeight: 30, setback: 10 },
  "Eco Zone": { maxFloors: 2, far: 1.0, basementAllowed: false, maxHeight: 20, setback: 8 },
};

export const ZONE_TYPES = Object.keys(REGULATIONS);

export interface ExtractedData {
  ownerName: string;
  surveyNumber: string;
  plotArea: number;
  proposedFloors: number;
  coordinates: string;
  zoneType: string;
  hasBasement: boolean;
}

export const MOCK_EXTRACTIONS: ExtractedData[] = [
  { ownerName: "Rajesh Kumar", surveyNumber: "SY/2024/1847", plotArea: 2400, proposedFloors: 4, coordinates: "12.9716° N, 77.5946° E", zoneType: "Residential", hasBasement: false },
  { ownerName: "Priya Sharma", surveyNumber: "SY/2024/2103", plotArea: 1800, proposedFloors: 6, coordinates: "13.0827° N, 80.2707° E", zoneType: "Airport Zone", hasBasement: false },
  { ownerName: "Amit Patel", surveyNumber: "SY/2024/0956", plotArea: 5000, proposedFloors: 3, coordinates: "19.0760° N, 72.8777° E", zoneType: "Commercial", hasBasement: true },
  { ownerName: "Sunita Reddy", surveyNumber: "SY/2024/3421", plotArea: 3200, proposedFloors: 4, coordinates: "17.3850° N, 78.4867° E", zoneType: "Eco Zone", hasBasement: true },
  { ownerName: "Vikram Singh", surveyNumber: "SY/2024/4782", plotArea: 1500, proposedFloors: 7, coordinates: "28.7041° N, 77.1025° E", zoneType: "Commercial", hasBasement: true },
  { ownerName: "Meena Devi", surveyNumber: "SY/2024/5219", plotArea: 3800, proposedFloors: 2, coordinates: "26.9124° N, 75.7873° E", zoneType: "Residential", hasBasement: true },
  { ownerName: "Arjun Nair", surveyNumber: "SY/2024/6034", plotArea: 4200, proposedFloors: 1, coordinates: "9.9312° N, 76.2673° E", zoneType: "Eco Zone", hasBasement: false },
  { ownerName: "Fatima Begum", surveyNumber: "SY/2024/7891", plotArea: 2800, proposedFloors: 5, coordinates: "17.3616° N, 78.4747° E", zoneType: "Residential", hasBasement: false },
  { ownerName: "Deepak Joshi", surveyNumber: "SY/2024/8345", plotArea: 6200, proposedFloors: 4, coordinates: "23.0225° N, 72.5714° E", zoneType: "Airport Zone", hasBasement: true },
  { ownerName: "Lakshmi Iyer", surveyNumber: "SY/2024/9102", plotArea: 1200, proposedFloors: 10, coordinates: "13.0827° N, 80.2707° E", zoneType: "Commercial", hasBasement: false },
  { ownerName: "Mohammed Rafi", surveyNumber: "SY/2025/0123", plotArea: 4500, proposedFloors: 2, coordinates: "15.3173° N, 75.7139° E", zoneType: "Residential", hasBasement: true },
  { ownerName: "Kavitha Rao", surveyNumber: "SY/2025/0456", plotArea: 3100, proposedFloors: 3, coordinates: "12.2958° N, 76.6394° E", zoneType: "Eco Zone", hasBasement: true },
];

// Pre-seeded historical records for the dashboard
export const SEED_RECORDS: BlockchainRecord[] = [
  { transactionId: "TX-A1B2C3D4E5F6", timestamp: "2025-12-01T09:14:22.000Z", ownerName: "Anand Mehta", surveyNumber: "SY/2024/0112", decision: "APPROVED", hash: "3a7f2c1e9b4d6a8f0c2e4b6d8a0f2c4e6b8d0a2f4c6e8b0d2a4f6c8e0b2d4a" },
  { transactionId: "TX-F6E5D4C3B2A1", timestamp: "2025-12-03T11:32:05.000Z", ownerName: "Neha Gupta", surveyNumber: "SY/2024/0234", decision: "REJECTED", hash: "9c1e3a5f7b9d1c3e5a7f9b1d3c5e7a9f1b3d5c7e9a1f3b5d7c9e1a3f5b7d9c" },
  { transactionId: "TX-1234ABCD5678", timestamp: "2025-12-05T14:48:19.000Z", ownerName: "Ravi Shankar", surveyNumber: "SY/2024/0567", decision: "APPROVED", hash: "d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4" },
  { transactionId: "TX-ABCDEF123456", timestamp: "2025-12-08T08:21:47.000Z", ownerName: "Pooja Verma", surveyNumber: "SY/2024/0789", decision: "REJECTED", hash: "e5a7c9f1b3d5e7a9c1f3b5d7e9a1c3f5b7d9e1a3c5f7b9d1e3a5c7f9b1d3e5" },
  { transactionId: "TX-987654FEDCBA", timestamp: "2025-12-10T16:05:33.000Z", ownerName: "Suresh Babu", surveyNumber: "SY/2024/1023", decision: "APPROVED", hash: "f6b8d0e2a4c6f8b0d2e4a6c8f0b2d4a6e8c0f2b4d6a8e0c2f4b6d8a0e2c4f6" },
  { transactionId: "TX-CAFE12345678", timestamp: "2025-12-14T10:39:12.000Z", ownerName: "Divya Krishnan", surveyNumber: "SY/2024/1198", decision: "REJECTED", hash: "a1c3e5f7b9d1a3c5e7f9b1d3a5c7e9f1b3d5a7c9e1f3b5d7a9c1e3f5b7d9a1" },
  { transactionId: "TX-DEAD0BEEF001", timestamp: "2025-12-18T13:55:28.000Z", ownerName: "Harish Pandey", surveyNumber: "SY/2024/1345", decision: "APPROVED", hash: "b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2" },
  { transactionId: "TX-BABE98765432", timestamp: "2025-12-22T07:12:41.000Z", ownerName: "Shalini Das", surveyNumber: "SY/2024/1567", decision: "APPROVED", hash: "c3e5a7f9b1d3c5e7a9f1b3d5c7e9a1f3b5d7c9e1a3f5b7d9c1e3a5f7b9d1c3" },
  { transactionId: "TX-C0FFEE000001", timestamp: "2026-01-05T15:27:56.000Z", ownerName: "Manoj Tiwari", surveyNumber: "SY/2025/0011", decision: "REJECTED", hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a" },
  { transactionId: "TX-DECADE123456", timestamp: "2026-01-12T09:44:03.000Z", ownerName: "Anjali Saxena", surveyNumber: "SY/2025/0089", decision: "APPROVED", hash: "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" },
  { transactionId: "TX-FACEB00C1234", timestamp: "2026-01-28T12:18:37.000Z", ownerName: "Gopal Menon", surveyNumber: "SY/2025/0145", decision: "REJECTED", hash: "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c" },
  { transactionId: "TX-ACE0FACE5678", timestamp: "2026-02-09T17:02:14.000Z", ownerName: "Rekha Pillai", surveyNumber: "SY/2025/0201", decision: "APPROVED", hash: "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d" },
];

export interface ComplianceResult {
  approved: boolean;
  reasons: string[];
  farCalculated: number;
  farAllowed: number;
}

export function checkCompliance(data: ExtractedData): ComplianceResult {
  const rule = REGULATIONS[data.zoneType];
  if (!rule) return { approved: false, reasons: ["Unknown zone type"], farCalculated: 0, farAllowed: 0 };

  const reasons: string[] = [];
  const farCalculated = (data.proposedFloors * data.plotArea * 0.6) / data.plotArea;

  if (data.proposedFloors > rule.maxFloors) {
    reasons.push(`Proposed ${data.proposedFloors} floors exceeds ${data.zoneType} limit of ${rule.maxFloors} floors`);
  }
  if (farCalculated > rule.far) {
    reasons.push(`Calculated FAR ${farCalculated.toFixed(2)} exceeds maximum FAR ${rule.far} for ${data.zoneType}`);
  }
  if (data.hasBasement && !rule.basementAllowed) {
    reasons.push(`Basement construction is not allowed in ${data.zoneType}`);
  }

  return {
    approved: reasons.length === 0,
    reasons: reasons.length > 0 ? reasons : ["All parameters within regulatory limits"],
    farCalculated,
    farAllowed: rule.far,
  };
}

export async function generateBlockchainHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface BlockchainRecord {
  transactionId: string;
  timestamp: string;
  ownerName: string;
  surveyNumber: string;
  decision: string;
  hash: string;
}

export interface SatelliteAnalysis {
  landCoverChange: number;
  vegetationLoss: number;
  builtUpIncrease: number;
  unauthorizedFlag: boolean;
}

export function runSatelliteAnalysis(): SatelliteAnalysis {
  const landCoverChange = Math.round(Math.random() * 40 + 5);
  const vegetationLoss = Math.round(Math.random() * 30 + 2);
  const builtUpIncrease = Math.round(Math.random() * 35 + 3);
  return {
    landCoverChange,
    vegetationLoss,
    builtUpIncrease,
    unauthorizedFlag: landCoverChange > 15,
  };
}

export interface ElevationData {
  oldElevation: number;
  newElevation: number;
  difference: number;
  verticalConstruction: boolean;
}

export function runElevationAnalysis(): ElevationData {
  const oldElevation = Math.round(Math.random() * 50 + 100);
  const newDiff = Math.round(Math.random() * 20 - 5);
  const newElevation = oldElevation + newDiff;
  const difference = Math.abs(newDiff);
  return {
    oldElevation,
    newElevation,
    difference,
    verticalConstruction: difference > 5,
  };
}

// ==================== CITIZEN PORTAL DATA ====================

export type ApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "PAYMENT_PENDING";
export type PaymentMethod = "UPI" | "CARD" | "NET_BANKING";

export interface PaymentInfo {
  transactionId: string;
  amount: number;
  method: PaymentMethod;
  timestamp: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export interface CitizenApplication {
  applicationId: string;
  submittedAt: string;
  status: ApplicationStatus;

  // Land details
  ownerName: string;
  surveyNumber: string;
  plotArea: number;
  location: string;
  coordinates: string;
  zoneType: string;
  proposedFloors: number;
  hasBasement: boolean;

  // Payment
  payment: PaymentInfo;

  // Compliance results (filled after review)
  complianceResult?: {
    decision: "APPROVED" | "REJECTED" | "NEEDS_REVIEW";
    riskScore: number;
    violatedRules: string[];
    officerRemarks?: string;
  };

  // Blockchain
  blockchainHash?: string;
}

// Fee calculation based on plot size, floors, and zone
export function calculateApplicationFee(
  plotArea: number,
  proposedFloors: number,
  zoneType: string
): number {
  let baseFee = 500;

  // Zone-based multiplier
  const zoneMultiplier: Record<string, number> = {
    "Residential": 1.0,
    "Commercial": 1.5,
    "Airport Zone": 2.0,
    "Eco Zone": 1.8,
  };

  // Plot size factor
  if (plotArea > 5000) baseFee += 500;
  else if (plotArea > 3000) baseFee += 300;
  else if (plotArea > 1500) baseFee += 150;

  // Floors factor
  baseFee += proposedFloors * 100;

  // Apply zone multiplier
  const multiplier = zoneMultiplier[zoneType] || 1.0;

  return Math.round(baseFee * multiplier);
}

// Mock citizen applications
export const MOCK_CITIZEN_APPLICATIONS: CitizenApplication[] = [
  {
    applicationId: "APP-2026-001",
    submittedAt: "2026-01-15T10:30:00.000Z",
    status: "APPROVED",
    ownerName: "Ramesh Kumar",
    surveyNumber: "SY/2026/0001",
    plotArea: 2000,
    location: "Bangalore, Karnataka",
    coordinates: "12.9716° N, 77.5946° E",
    zoneType: "Residential",
    proposedFloors: 3,
    hasBasement: false,
    payment: {
      transactionId: "PAY-TXN-001-ABC123",
      amount: 800,
      method: "UPI",
      timestamp: "2026-01-15T10:25:00.000Z",
      status: "SUCCESS",
    },
    complianceResult: {
      decision: "APPROVED",
      riskScore: 15,
      violatedRules: [],
      officerRemarks: "All regulations met. Approved for construction.",
    },
    blockchainHash: "0x7a8f9c2e4b6d8a0f2c4e6b8d0a2f4c6e8b0d2a4f",
  },
  {
    applicationId: "APP-2026-002",
    submittedAt: "2026-01-18T14:20:00.000Z",
    status: "REJECTED",
    ownerName: "Priya Sharma",
    surveyNumber: "SY/2026/0002",
    plotArea: 1500,
    location: "Chennai, Tamil Nadu",
    coordinates: "13.0827° N, 80.2707° E",
    zoneType: "Airport Zone",
    proposedFloors: 5,
    hasBasement: true,
    payment: {
      transactionId: "PAY-TXN-002-DEF456",
      amount: 1500,
      method: "CARD",
      timestamp: "2026-01-18T14:15:00.000Z",
      status: "SUCCESS",
    },
    complianceResult: {
      decision: "REJECTED",
      riskScore: 85,
      violatedRules: ["Exceeds max floors for Airport Zone (3)", "Basement not allowed in this zone"],
      officerRemarks: "Application violates height restrictions near airport. Rejected.",
    },
    blockchainHash: "0x3c5e7a9f1b3d5c7e9a1f3b5d7c9e1a3f5b7d9c1e",
  },
  {
    applicationId: "APP-2026-003",
    submittedAt: "2026-02-01T09:45:00.000Z",
    status: "UNDER_REVIEW",
    ownerName: "Amit Patel",
    surveyNumber: "SY/2026/0003",
    plotArea: 4500,
    location: "Mumbai, Maharashtra",
    coordinates: "19.0760° N, 72.8777° E",
    zoneType: "Commercial",
    proposedFloors: 6,
    hasBasement: true,
    payment: {
      transactionId: "PAY-TXN-003-GHI789",
      amount: 1350,
      method: "NET_BANKING",
      timestamp: "2026-02-01T09:40:00.000Z",
      status: "SUCCESS",
    },
  },
  {
    applicationId: "APP-2026-004",
    submittedAt: "2026-02-05T16:10:00.000Z",
    status: "APPROVED",
    ownerName: "Lakshmi Iyer",
    surveyNumber: "SY/2026/0004",
    plotArea: 3200,
    location: "Hyderabad, Telangana",
    coordinates: "17.3850° N, 78.4867° E",
    zoneType: "Residential",
    proposedFloors: 4,
    hasBasement: true,
    payment: {
      transactionId: "PAY-TXN-004-JKL012",
      amount: 950,
      method: "UPI",
      timestamp: "2026-02-05T16:05:00.000Z",
      status: "SUCCESS",
    },
    complianceResult: {
      decision: "APPROVED",
      riskScore: 20,
      violatedRules: [],
      officerRemarks: "Compliant with all residential zone regulations.",
    },
    blockchainHash: "0x9e1a3c5f7b9d1e3a5c7f9b1d3e5a7c9f1b3d5e7a",
  },
  {
    applicationId: "APP-2026-005",
    submittedAt: "2026-02-10T11:30:00.000Z",
    status: "UNDER_REVIEW",
    ownerName: "Vikram Singh",
    surveyNumber: "SY/2026/0005",
    plotArea: 2800,
    location: "Delhi",
    coordinates: "28.7041° N, 77.1025° E",
    zoneType: "Residential",
    proposedFloors: 5,
    hasBasement: false,
    payment: {
      transactionId: "PAY-TXN-005-MNO345",
      amount: 1000,
      method: "CARD",
      timestamp: "2026-02-10T11:25:00.000Z",
      status: "SUCCESS",
    },
  },
];

// Calculate total revenue from all applications
export function calculateTotalRevenue(applications: CitizenApplication[]): number {
  return applications.reduce((total, app) => {
    if (app.payment.status === "SUCCESS") {
      return total + app.payment.amount;
    }
    return total;
  }, 0);
}

// Generate application ID
export function generateApplicationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `APP-${year}-${random.toString().padStart(3, '0')}`;
}

// Generate payment transaction ID
export function generatePaymentTransactionId(): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `PAY-TXN-${timestamp}-${random}`;
}

export function calculateRiskScore(
  complianceApproved: boolean,
  satelliteChange: number,
  elevationDiff: number
): number {
  let score = 0;
  if (!complianceApproved) score += 40;
  score += Math.min(satelliteChange * 1.2, 35);
  score += Math.min(elevationDiff * 3, 25);
  return Math.min(Math.round(score), 100);
}

export interface MonitoringScan {
  id: string;
  surveyNumber: string;
  location: string;
  coordinates: string;
  scanDate: string;
  landCoverChange: number;
  vegetationLoss: number;
  builtUpIncrease: number;
  elevationDiff: number;
  riskScore: number;
  flagged: boolean;
  flagReason: string;
}

export const SEED_MONITORING_SCANS: MonitoringScan[] = [
  { id: "SCN-001", surveyNumber: "SY/2024/0112", location: "Whitefield, Bangalore", coordinates: "12.9698° N, 77.7500° E", scanDate: "2025-11-15", landCoverChange: 28, vegetationLoss: 18, builtUpIncrease: 32, elevationDiff: 12, riskScore: 82, flagged: true, flagReason: "Unauthorized vertical construction + excessive land cover change" },
  { id: "SCN-002", surveyNumber: "SY/2024/0234", location: "Andheri East, Mumbai", coordinates: "19.1197° N, 72.8464° E", scanDate: "2025-11-20", landCoverChange: 8, vegetationLoss: 5, builtUpIncrease: 10, elevationDiff: 2, riskScore: 18, flagged: false, flagReason: "" },
  { id: "SCN-003", surveyNumber: "SY/2024/0567", location: "Gachibowli, Hyderabad", coordinates: "17.4401° N, 78.3489° E", scanDate: "2025-12-02", landCoverChange: 22, vegetationLoss: 25, builtUpIncrease: 19, elevationDiff: 8, riskScore: 68, flagged: true, flagReason: "High vegetation loss in Eco Zone buffer area" },
  { id: "SCN-004", surveyNumber: "SY/2024/0789", location: "Dwarka, Delhi", coordinates: "28.5921° N, 77.0460° E", scanDate: "2025-12-10", landCoverChange: 12, vegetationLoss: 7, builtUpIncrease: 15, elevationDiff: 3, riskScore: 25, flagged: false, flagReason: "" },
  { id: "SCN-005", surveyNumber: "SY/2024/1023", location: "Shamshabad, Hyderabad", coordinates: "17.2403° N, 78.4294° E", scanDate: "2025-12-18", landCoverChange: 35, vegetationLoss: 12, builtUpIncrease: 38, elevationDiff: 15, riskScore: 91, flagged: true, flagReason: "Airport Zone violation — structure exceeds height restriction, major built-up increase" },
  { id: "SCN-006", surveyNumber: "SY/2024/1198", location: "Electronic City, Bangalore", coordinates: "12.8440° N, 77.6568° E", scanDate: "2025-12-25", landCoverChange: 18, vegetationLoss: 22, builtUpIncrease: 14, elevationDiff: 6, riskScore: 55, flagged: true, flagReason: "Unauthorized land clearing detected near protected wetland" },
  { id: "SCN-007", surveyNumber: "SY/2024/1345", location: "Salt Lake, Kolkata", coordinates: "22.5800° N, 88.4200° E", scanDate: "2026-01-03", landCoverChange: 6, vegetationLoss: 3, builtUpIncrease: 8, elevationDiff: 1, riskScore: 12, flagged: false, flagReason: "" },
  { id: "SCN-008", surveyNumber: "SY/2024/1567", location: "Baner, Pune", coordinates: "18.5590° N, 73.7868° E", scanDate: "2026-01-15", landCoverChange: 19, vegetationLoss: 14, builtUpIncrease: 22, elevationDiff: 9, riskScore: 72, flagged: true, flagReason: "Vertical construction detected beyond approved plan, DEM anomaly" },
  { id: "SCN-009", surveyNumber: "SY/2025/0011", location: "Madhapur, Hyderabad", coordinates: "17.4486° N, 78.3908° E", scanDate: "2026-01-22", landCoverChange: 10, vegetationLoss: 8, builtUpIncrease: 12, elevationDiff: 4, riskScore: 30, flagged: false, flagReason: "" },
  { id: "SCN-010", surveyNumber: "SY/2025/0089", location: "Koramangala, Bangalore", coordinates: "12.9352° N, 77.6245° E", scanDate: "2026-02-01", landCoverChange: 31, vegetationLoss: 28, builtUpIncrease: 26, elevationDiff: 11, riskScore: 85, flagged: true, flagReason: "Massive vegetation loss + unauthorized multi-story construction in residential zone" },
];
