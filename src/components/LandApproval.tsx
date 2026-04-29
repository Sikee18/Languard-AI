import { useState, useCallback } from "react";
import { Upload, FileCheck, Shield, Edit3, CheckCircle, XCircle, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ExtractedData,
  MOCK_EXTRACTIONS,
  ZONE_TYPES,
  checkCompliance,
  generateBlockchainHash,
  ComplianceResult,
  BlockchainRecord,
} from "@/lib/mockData";

interface LandApprovalProps {
  onDecision: (record: BlockchainRecord) => void;
}

const LandApproval = ({ onDecision }: LandApprovalProps) => {
  const [step, setStep] = useState<"upload" | "review" | "result">("upload");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [complianceResult, setComplianceResult] = useState<ComplianceResult | null>(null);
  const [blockchainRecord, setBlockchainRecord] = useState<BlockchainRecord | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  const simulateUpload = useCallback(() => {
    setProcessing(true);
    setTimeout(() => {
      const mock = MOCK_EXTRACTIONS[Math.floor(Math.random() * MOCK_EXTRACTIONS.length)];
      setExtractedData({ ...mock });
      setStep("review");
      setProcessing(false);
    }, 1500);
  }, []);

  const handleVerify = async () => {
    if (!extractedData) return;
    setProcessing(true);
    const result = checkCompliance(extractedData);
    setComplianceResult(result);

    const timestamp = new Date().toISOString();
    const decision = result.approved ? "APPROVED" : "REJECTED";
    const hashInput = `${extractedData.ownerName}|${extractedData.surveyNumber}|${decision}|${timestamp}`;
    const hash = await generateBlockchainHash(hashInput);
    const txId = `TX-${hash.substring(0, 12).toUpperCase()}`;

    const record: BlockchainRecord = {
      transactionId: txId,
      timestamp,
      ownerName: extractedData.ownerName,
      surveyNumber: extractedData.surveyNumber,
      decision,
      hash,
    };
    setBlockchainRecord(record);
    onDecision(record);
    setStep("result");
    setProcessing(false);
  };

  const reset = () => {
    setStep("upload");
    setExtractedData(null);
    setComplianceResult(null);
    setBlockchainRecord(null);
  };

  const updateField = (field: keyof ExtractedData, value: string | number | boolean) => {
    if (!extractedData) return;
    setExtractedData({ ...extractedData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className={step === "upload" ? "text-primary" : "text-muted-foreground"}>01 UPLOAD</span>
        <span>→</span>
        <span className={step === "review" ? "text-primary" : "text-muted-foreground"}>02 REVIEW</span>
        <span>→</span>
        <span className={step === "result" ? "text-primary" : "text-muted-foreground"}>03 DECISION</span>
      </div>

      {step === "upload" && (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); simulateUpload(); }}
          onClick={simulateUpload}
        >
          {processing ? (
            <div className="space-y-3">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Simulating OCR extraction...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-1">Drop land ownership & building plan documents</p>
              <p className="text-sm text-muted-foreground">PDF, JPG, PNG — Click or drag to simulate upload</p>
            </>
          )}
        </div>
      )}

      {step === "review" && extractedData && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-primary">
            <FileCheck className="w-4 h-4" />
            <span className="font-medium">OCR Extraction Complete</span>
            <Edit3 className="w-3 h-3 text-muted-foreground ml-auto" />
            <span className="text-xs text-muted-foreground">Click fields to edit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Owner Name">
              <Input value={extractedData.ownerName} onChange={(e) => updateField("ownerName", e.target.value)} className="bg-secondary border-border font-mono text-sm" />
            </Field>
            <Field label="Survey Number">
              <Input value={extractedData.surveyNumber} onChange={(e) => updateField("surveyNumber", e.target.value)} className="bg-secondary border-border font-mono text-sm" />
            </Field>
            <Field label="Plot Area (sq.ft)">
              <Input type="number" value={extractedData.plotArea} onChange={(e) => updateField("plotArea", Number(e.target.value))} className="bg-secondary border-border font-mono text-sm" />
            </Field>
            <Field label="Proposed Floors">
              <Input type="number" value={extractedData.proposedFloors} onChange={(e) => updateField("proposedFloors", Number(e.target.value))} className="bg-secondary border-border font-mono text-sm" />
            </Field>
            <Field label="Coordinates">
              <Input value={extractedData.coordinates} onChange={(e) => updateField("coordinates", e.target.value)} className="bg-secondary border-border font-mono text-sm" />
            </Field>
            <Field label="Zone Type">
              <Select value={extractedData.zoneType} onValueChange={(v) => updateField("zoneType", v)}>
                <SelectTrigger className="bg-secondary border-border font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONE_TYPES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Basement Included">
              <div className="flex items-center gap-2 pt-2">
                <Switch checked={extractedData.hasBasement} onCheckedChange={(v) => updateField("hasBasement", v)} />
                <span className="text-sm text-muted-foreground">{extractedData.hasBasement ? "Yes" : "No"}</span>
              </div>
            </Field>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleVerify} disabled={processing} className="gap-2">
              <Shield className="w-4 h-4" />
              {processing ? "Verifying..." : "Verify Compliance"}
            </Button>
            <Button variant="outline" onClick={reset}>Reset</Button>
          </div>
        </div>
      )}

      {step === "result" && complianceResult && blockchainRecord && (
        <div className="space-y-6">
          {/* Decision */}
          <div className={`rounded-lg border p-6 ${complianceResult.approved ? "status-approved glow-success" : "status-rejected glow-destructive"}`}>
            <div className="flex items-center gap-3 mb-4">
              {complianceResult.approved ? (
                <CheckCircle className="w-8 h-8 text-success" />
              ) : (
                <XCircle className="w-8 h-8 text-destructive" />
              )}
              <div>
                <h3 className="text-xl font-bold">{complianceResult.approved ? "APPROVED" : "REJECTED"}</h3>
                <p className="text-sm opacity-80">Regulatory compliance check completed</p>
              </div>
            </div>
            <div className="space-y-2">
              {complianceResult.reasons.map((r, i) => (
                <p key={i} className="text-sm font-mono">• {r}</p>
              ))}
              <div className="flex gap-6 mt-3 text-xs font-mono opacity-70">
                <span>FAR Calculated: {complianceResult.farCalculated.toFixed(2)}</span>
                <span>FAR Allowed: {complianceResult.farAllowed.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Blockchain */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <Hash className="w-4 h-4" />
              Blockchain Record Logged
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="text-primary">{blockchainRecord.transactionId}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Timestamp</span><span>{new Date(blockchainRecord.timestamp).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-success">Immutable ✓</span></div>
              <div className="pt-2 border-t border-border break-all">
                <span className="text-muted-foreground">SHA-256: </span>
                <span className="text-foreground/70">{blockchainRecord.hash}</span>
              </div>
            </div>
          </div>

          <Button variant="outline" onClick={reset}>New Application</Button>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
    {children}
  </div>
);

export default LandApproval;
