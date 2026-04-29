import { motion } from "framer-motion";
import {
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Download,
    ArrowLeft,
    Shield,
    MapPin,
    Layers,
    Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CitizenApplication } from "@/lib/mockData";
import {
    getStatusBadgeClass,
    formatCurrency,
    formatDateTime,
    generateApprovalCertificate,
    generateRejectionReport,
    generateApplicationSummary,
} from "@/lib/citizenUtils";
import { pageTransition } from "@/lib/animations";

interface CitizenApplicationDetailProps {
    application: CitizenApplication;
    onBack: () => void;
    onApplyAgain?: () => void;
}

const CitizenApplicationDetail = ({
    application,
    onBack,
    onApplyAgain,
}: CitizenApplicationDetailProps) => {
    const isApproved = application.status === "APPROVED";
    const isRejected = application.status === "REJECTED";
    const isUnderReview =
        application.status === "UNDER_REVIEW" || application.status === "SUBMITTED";

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={onBack} className="gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Applications
                    </Button>
                    <h2 className="text-2xl font-bold">Application Details</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {application.applicationId}
                    </p>
                </div>
                <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeClass(
                        application.status
                    )}`}
                >
                    {application.status.replace("_", " ")}
                </span>
            </div>

            {/* Status Card */}
            <Card
                className={`p-6 ${isApproved
                        ? "border-success/50 bg-success/5"
                        : isRejected
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-warning/50 bg-warning/5"
                    }`}
            >
                <div className="flex items-center gap-4">
                    {isApproved ? (
                        <CheckCircle2 className="w-12 h-12 text-success" />
                    ) : isRejected ? (
                        <XCircle className="w-12 h-12 text-destructive" />
                    ) : (
                        <Clock className="w-12 h-12 text-warning" />
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">
                            {isApproved
                                ? "Application Approved"
                                : isRejected
                                    ? "Application Rejected"
                                    : "Under Review"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isApproved
                                ? "Your application has been approved. You may proceed with construction."
                                : isRejected
                                    ? "Your application has been rejected. Please review the reasons below."
                                    : "Your application is being reviewed by our officers. You will be notified once a decision is made."}
                        </p>
                    </div>
                    {isApproved && (
                        <Button
                            onClick={() => generateApprovalCertificate(application)}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Certificate
                        </Button>
                    )}
                    {isRejected && (
                        <Button
                            variant="outline"
                            onClick={() => generateRejectionReport(application)}
                            className="gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Report
                        </Button>
                    )}
                </div>
            </Card>

            {/* Application Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Details */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Land Details
                    </h3>
                    <div className="space-y-3">
                        <DetailRow label="Owner Name" value={application.ownerName} />
                        <DetailRow label="Survey Number" value={application.surveyNumber} />
                        <DetailRow label="Plot Area" value={`${application.plotArea} sq.m`} />
                        <DetailRow label="Location" value={application.location} />
                        <DetailRow label="Coordinates" value={application.coordinates} />
                        <DetailRow label="Zone Type" value={application.zoneType} />
                    </div>
                </Card>

                {/* Construction Details */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Construction Details
                    </h3>
                    <div className="space-y-3">
                        <DetailRow
                            label="Proposed Floors"
                            value={application.proposedFloors.toString()}
                        />
                        <DetailRow
                            label="Basement"
                            value={application.hasBasement ? "Yes" : "No"}
                        />
                        <DetailRow
                            label="Submitted On"
                            value={formatDateTime(application.submittedAt)}
                        />
                        <DetailRow
                            label="Fee Paid"
                            value={formatCurrency(application.payment.amount)}
                        />
                        <DetailRow
                            label="Transaction ID"
                            value={application.payment.transactionId}
                            mono
                        />
                    </div>
                </Card>
            </div>

            {/* Compliance Results */}
            {application.complianceResult && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Compliance Assessment
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Decision</p>
                            <p
                                className={`text-lg font-bold ${application.complianceResult.decision === "APPROVED"
                                        ? "text-success"
                                        : application.complianceResult.decision === "REJECTED"
                                            ? "text-destructive"
                                            : "text-warning"
                                    }`}
                            >
                                {application.complianceResult.decision}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${application.complianceResult.riskScore < 30
                                                ? "bg-success"
                                                : application.complianceResult.riskScore < 70
                                                    ? "bg-warning"
                                                    : "bg-destructive"
                                            }`}
                                        style={{
                                            width: `${application.complianceResult.riskScore}%`,
                                        }}
                                    />
                                </div>
                                <span className="font-mono font-bold">
                                    {application.complianceResult.riskScore}/100
                                </span>
                            </div>
                        </div>
                    </div>

                    {application.complianceResult.violatedRules.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-medium mb-3">Violated Rules:</p>
                            <ul className="space-y-2">
                                {application.complianceResult.violatedRules.map((rule, index) => (
                                    <li
                                        key={index}
                                        className="text-sm text-muted-foreground flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                                    >
                                        <span className="text-destructive mt-0.5">•</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {application.complianceResult.officerRemarks && (
                        <div className="mt-6">
                            <p className="text-sm font-medium mb-2">Officer Remarks:</p>
                            <p className="text-sm text-muted-foreground p-4 rounded-lg bg-secondary">
                                {application.complianceResult.officerRemarks}
                            </p>
                        </div>
                    )}
                </Card>
            )}

            {/* Blockchain Record */}
            {application.blockchainHash && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Blockchain Record</h3>
                    <div className="space-y-3">
                        <DetailRow
                            label="Blockchain Hash"
                            value={application.blockchainHash}
                            mono
                        />
                        <p className="text-xs text-muted-foreground">
                            This application is recorded on an immutable blockchain ledger for
                            transparency and security.
                        </p>
                    </div>
                </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    onClick={() => generateApplicationSummary(application)}
                    className="gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download Summary
                </Button>

                {isRejected && onApplyAgain && (
                    <Button onClick={onApplyAgain} className="gap-2">
                        <FileText className="w-4 h-4" />
                        Apply Again
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

const DetailRow = ({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) => (
    <div className="flex justify-between items-start gap-4">
        <span className="text-sm text-muted-foreground">{label}:</span>
        <span className={`text-sm font-medium text-right ${mono ? "font-mono" : ""}`}>
            {value}
        </span>
    </div>
);

export default CitizenApplicationDetail;
