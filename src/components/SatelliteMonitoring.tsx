import { useState } from "react";
import { Radar, Mountain, AlertTriangle, CheckCircle, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ImageComparison from "./ImageComparison";
import RiskGauge from "./RiskGauge";
import {
  runSatelliteAnalysis,
  runElevationAnalysis,
  calculateRiskScore,
  SatelliteAnalysis,
  ElevationData,
  SEED_MONITORING_SCANS,
  MonitoringScan,
} from "@/lib/mockData";

interface SatelliteMonitoringProps {
  complianceApproved: boolean | null;
}

const SatelliteMonitoring = ({ complianceApproved }: SatelliteMonitoringProps) => {
  const [satelliteResult, setSatelliteResult] = useState<SatelliteAnalysis | null>(null);
  const [elevationEnabled, setElevationEnabled] = useState(false);
  const [elevationResult, setElevationResult] = useState<ElevationData | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedScan, setSelectedScan] = useState<MonitoringScan | null>(null);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const sat = runSatelliteAnalysis();
      setSatelliteResult(sat);

      let elev: ElevationData | null = null;
      if (elevationEnabled) {
        elev = runElevationAnalysis();
        setElevationResult(elev);
      }

      const score = calculateRiskScore(
        complianceApproved ?? true,
        sat.landCoverChange,
        elev?.difference ?? 0
      );
      setRiskScore(score);
      setAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-success";
    if (score <= 70) return "text-warning";
    return "text-destructive";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 30) return "Low";
    if (score <= 70) return "Medium";
    return "High";
  };

  return (
    <div className="space-y-6">
      {/* Scan History Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Radar className="w-4 h-4 text-primary" />
            Monitoring Scan History
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            {SEED_MONITORING_SCANS.filter(s => s.flagged).length} flagged of {SEED_MONITORING_SCANS.length} scans
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left p-3">Scan ID</th>
                <th className="text-left p-3">Survey No.</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Land Δ</th>
                <th className="text-left p-3">Veg Loss</th>
                <th className="text-left p-3">Built-up ↑</th>
                <th className="text-left p-3">Risk</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {SEED_MONITORING_SCANS.map((scan) => (
                <tr
                  key={scan.id}
                  className={`border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer ${selectedScan?.id === scan.id ? "bg-secondary/70" : ""}`}
                  onClick={() => setSelectedScan(selectedScan?.id === scan.id ? null : scan)}
                >
                  <td className="p-3 text-primary">{scan.id}</td>
                  <td className="p-3">{scan.surveyNumber}</td>
                  <td className="p-3">{scan.location}</td>
                  <td className="p-3">{scan.scanDate}</td>
                  <td className={`p-3 ${scan.landCoverChange > 15 ? "text-destructive" : "text-success"}`}>{scan.landCoverChange}%</td>
                  <td className={`p-3 ${scan.vegetationLoss > 20 ? "text-destructive" : "text-success"}`}>{scan.vegetationLoss}%</td>
                  <td className={`p-3 ${scan.builtUpIncrease > 25 ? "text-destructive" : "text-success"}`}>{scan.builtUpIncrease}%</td>
                  <td className="p-3">
                    <span className={`font-bold ${getRiskColor(scan.riskScore)}`}>{scan.riskScore}</span>
                    <span className={`ml-1 ${getRiskColor(scan.riskScore)}`}>({getRiskLabel(scan.riskScore)})</span>
                  </td>
                  <td className="p-3">
                    {scan.flagged ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border status-rejected">
                        <AlertTriangle className="w-3 h-3" /> FLAGGED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border status-approved">
                        <CheckCircle className="w-3 h-3" /> CLEAR
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected scan detail */}
      {selectedScan && (
        <div className={`rounded-lg border p-5 space-y-3 ${selectedScan.flagged ? "border-destructive/50 bg-destructive/5" : "border-success/50 bg-success/5"}`}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              {selectedScan.flagged ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <CheckCircle className="w-4 h-4 text-success" />}
              Scan Detail — {selectedScan.id}
            </h4>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setSelectedScan(null)}>Close</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Survey Number</span>
              <span className="font-mono font-medium">{selectedScan.surveyNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Location</span>
              <span className="font-mono font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedScan.location}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Coordinates</span>
              <span className="font-mono font-medium">{selectedScan.coordinates}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Scan Date</span>
              <span className="font-mono font-medium flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedScan.scanDate}</span>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <MetricBar label="Land Cover Change" value={selectedScan.landCoverChange} threshold={15} />
            <MetricBar label="Vegetation Loss" value={selectedScan.vegetationLoss} threshold={20} />
            <MetricBar label="Built-up Increase" value={selectedScan.builtUpIncrease} threshold={25} />
            {selectedScan.elevationDiff > 0 && (
              <div className="flex justify-between text-xs pt-1">
                <span className="text-muted-foreground">Elevation Difference</span>
                <span className={`font-mono font-medium ${selectedScan.elevationDiff > 5 ? "text-destructive" : "text-success"}`}>{selectedScan.elevationDiff}m</span>
              </div>
            )}
          </div>
          {selectedScan.flagged && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
              <span className="font-medium text-destructive">Flag Reason: </span>
              <span className="text-foreground/80">{selectedScan.flagReason}</span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Risk Score:</span>
            <span className={`text-lg font-bold font-mono ${getRiskColor(selectedScan.riskScore)}`}>{selectedScan.riskScore}/100</span>
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${
              selectedScan.riskScore <= 30 ? "status-approved" : selectedScan.riskScore <= 70 ? "border-warning/50 bg-warning/10 text-warning" : "status-rejected"
            }`}>{getRiskLabel(selectedScan.riskScore)}</span>
          </div>
        </div>
      )}

      {/* Satellite Comparison */}
      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Radar className="w-4 h-4 text-primary" />
          Satellite Image Comparison
        </div>
        <ImageComparison />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch checked={elevationEnabled} onCheckedChange={setElevationEnabled} />
          <span className="text-sm text-muted-foreground">Enable Elevation Analysis (DEM)</span>
        </div>
        <Button onClick={runAnalysis} disabled={analyzing} className="gap-2">
          <Radar className="w-4 h-4" />
          {analyzing ? "Analyzing..." : "Run New Analysis"}
        </Button>
      </div>

      {analyzing && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Processing satellite imagery...
        </div>
      )}

      {satelliteResult && !analyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Detection Results */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <h4 className="text-sm font-medium flex items-center gap-2">
              {satelliteResult.unauthorizedFlag ? (
                <AlertTriangle className="w-4 h-4 text-destructive" />
              ) : (
                <CheckCircle className="w-4 h-4 text-success" />
              )}
              Live Analysis Result
            </h4>

            {satelliteResult.unauthorizedFlag && (
              <div className="rounded-md border p-3 status-rejected text-sm font-medium">
                ⚠ Unauthorized Construction Detected
              </div>
            )}
            {!satelliteResult.unauthorizedFlag && (
              <div className="rounded-md border p-3 status-approved text-sm font-medium">
                ✓ No Significant Unauthorized Change
              </div>
            )}

            <div className="space-y-3">
              <MetricBar label="Land Cover Change" value={satelliteResult.landCoverChange} threshold={15} />
              <MetricBar label="Vegetation Loss" value={satelliteResult.vegetationLoss} threshold={20} />
              <MetricBar label="Built-up Increase" value={satelliteResult.builtUpIncrease} threshold={25} />
            </div>
          </div>

          {/* Elevation / Risk */}
          <div className="space-y-6">
            {elevationResult && (
              <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-primary" />
                  DEM Elevation Analysis
                </h4>

                {elevationResult.verticalConstruction ? (
                  <div className="rounded-md border p-3 status-rejected text-sm font-medium">
                    ⚠ Vertical Construction Detected
                  </div>
                ) : (
                  <div className="rounded-md border p-3 status-approved text-sm font-medium">
                    ✓ No Height Change
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <ElevationBar label="Old" value={elevationResult.oldElevation} maxVal={180} />
                  <ElevationBar label="New" value={elevationResult.newElevation} maxVal={180} />
                </div>
                <p className="text-center text-xs font-mono text-muted-foreground">
                  Difference: {elevationResult.difference}m
                </p>
              </div>
            )}

            {riskScore !== null && (
              <div className="rounded-lg border border-border bg-card p-5">
                <h4 className="text-sm font-medium text-center mb-4">Composite Risk Score</h4>
                <RiskGauge score={riskScore} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MetricBar = ({ label, value, threshold }: { label: string; value: number; threshold: number }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono font-medium ${value > threshold ? "text-destructive" : "text-success"}`}>{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${value > threshold ? "bg-destructive" : "bg-success"}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

const ElevationBar = ({ label, value, maxVal }: { label: string; value: number; maxVal: number }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs font-mono text-primary font-bold">{value}m</span>
    <div className="w-12 h-32 bg-secondary rounded-md relative overflow-hidden">
      <div
        className="absolute bottom-0 w-full bg-primary/60 rounded-b-md transition-all duration-1000"
        style={{ height: `${(value / maxVal) * 100}%` }}
      />
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export default SatelliteMonitoring;