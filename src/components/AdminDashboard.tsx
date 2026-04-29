import { useState } from "react";
import { FileText, CheckCircle, XCircle, AlertTriangle, ShieldAlert, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlockchainRecord, SEED_MONITORING_SCANS } from "@/lib/mockData";

interface AdminDashboardProps {
  records: BlockchainRecord[];
}

type FilterType = "all" | "approved" | "rejected" | "flagged" | "high-risk";

const AdminDashboard = ({ records }: AdminDashboardProps) => {
  const [filter, setFilter] = useState<FilterType>("all");

  const approved = records.filter((r) => r.decision === "APPROVED").length;
  const rejected = records.filter((r) => r.decision === "REJECTED").length;

  const flaggedScans = SEED_MONITORING_SCANS.filter(s => s.flagged);
  const highRiskScans = SEED_MONITORING_SCANS.filter(s => s.riskScore > 70);

  const filteredRecords = filter === "approved"
    ? records.filter(r => r.decision === "APPROVED")
    : filter === "rejected"
      ? records.filter(r => r.decision === "REJECTED")
      : filter === "all"
        ? records
        : [];

  const showScanData = filter === "flagged" || filter === "high-risk";
  const displayedScans = filter === "flagged" ? flaggedScans : filter === "high-risk" ? highRiskScans : [];

  const downloadReport = async () => {
    const { generateComplianceReport } = await import("@/lib/pdfGenerator");

    const reportData = {
      totalApplications: records.length,
      approved,
      rejected,
      flagged: flaggedScans.length,
      highRisk: highRiskScans.length,
      records: records.map(r => ({
        transactionId: r.transactionId,
        timestamp: r.timestamp,
        ownerName: r.ownerName,
        surveyNumber: r.surveyNumber,
        decision: r.decision,
      })),
      scans: SEED_MONITORING_SCANS.map(s => ({
        id: s.id,
        surveyNumber: s.surveyNumber,
        location: s.location,
        riskScore: s.riskScore,
        flagged: s.flagged,
      })),
    };

    await generateComplianceReport(reportData);
  };

  const handleStatClick = (type: FilterType) => {
    setFilter(filter === type ? "all" : type);
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return "text-success";
    if (score <= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={FileText} label="Total Applications" value={records.length} color="text-primary" active={filter === "all"} onClick={() => handleStatClick("all")} />
        <StatCard icon={CheckCircle} label="Approved" value={approved} color="text-success" active={filter === "approved"} onClick={() => handleStatClick("approved")} />
        <StatCard icon={XCircle} label="Rejected" value={rejected} color="text-destructive" active={filter === "rejected"} onClick={() => handleStatClick("rejected")} />
        <StatCard icon={AlertTriangle} label="Flagged" value={flaggedScans.length} color="text-warning" active={filter === "flagged"} onClick={() => handleStatClick("flagged")} />
        <StatCard icon={ShieldAlert} label="High Risk" value={highRiskScans.length} color="text-destructive" active={filter === "high-risk"} onClick={() => handleStatClick("high-risk")} />
      </div>

      {/* Active filter indicator */}
      {filter !== "all" && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Showing:</span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary font-medium">
            {filter === "approved" ? "Approved Records" : filter === "rejected" ? "Rejected Records" : filter === "flagged" ? "Flagged Constructions" : "High Risk Alerts"}
            <button onClick={() => setFilter("all")} className="ml-1 hover:text-foreground"><X className="w-3 h-3" /></button>
          </span>
        </div>
      )}

      {/* Flagged / High Risk Scan Table */}
      {showScanData && (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-medium flex items-center gap-2">
              {filter === "flagged" ? <AlertTriangle className="w-4 h-4 text-warning" /> : <ShieldAlert className="w-4 h-4 text-destructive" />}
              {filter === "flagged" ? "Flagged Constructions" : "High Risk Alerts"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left p-3">Scan ID</th>
                  <th className="text-left p-3">Survey No.</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Scan Date</th>
                  <th className="text-left p-3">Risk Score</th>
                  <th className="text-left p-3">Reason</th>
                </tr>
              </thead>
              <tbody>
                {displayedScans.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-3 text-primary">{s.id}</td>
                    <td className="p-3">{s.surveyNumber}</td>
                    <td className="p-3">{s.location}</td>
                    <td className="p-3">{s.scanDate}</td>
                    <td className="p-3">
                      <span className={`font-bold ${getRiskColor(s.riskScore)}`}>{s.riskScore}</span>
                    </td>
                    <td className="p-3 max-w-xs text-foreground/70">{s.flagReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Trail */}
      {!showScanData && (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-medium">Audit Trail</h3>
            <Button variant="outline" size="sm" onClick={downloadReport} className="gap-2 text-xs">
              <Download className="w-3 h-3" />
              Download Report
            </Button>
          </div>
          {filteredRecords.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left p-3">TX ID</th>
                    <th className="text-left p-3">Timestamp</th>
                    <th className="text-left p-3">Owner</th>
                    <th className="text-left p-3">Survey No.</th>
                    <th className="text-left p-3">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="p-3 text-primary">{r.transactionId}</td>
                      <td className="p-3">{new Date(r.timestamp).toLocaleString()}</td>
                      <td className="p-3">{r.ownerName}</td>
                      <td className="p-3">{r.surveyNumber}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${r.decision === "APPROVED" ? "status-approved" : "status-rejected"}`}>
                          {r.decision}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, active, onClick }: { icon: any; label: string; value: number; color: string; active: boolean; onClick: () => void }) => (
  <div
    className={`rounded-lg border bg-card p-4 space-y-2 cursor-pointer transition-all hover:bg-secondary/50 ${active ? "border-primary ring-1 ring-primary/30" : "border-border"}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;