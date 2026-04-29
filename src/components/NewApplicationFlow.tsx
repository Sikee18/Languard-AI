import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    Upload,
    FileText,
    Shield,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Download,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StepProgress from "./StepProgress";
import {
    ZONE_TYPES,
    REGULATIONS,
    calculateApplicationFee,
    generateApplicationId,
    generatePaymentTransactionId,
    CitizenApplication,
    PaymentMethod,
} from "@/lib/mockData";
import {
    formatCurrency,
    generatePaymentReceipt,
    generateApplicationSummary,
} from "@/lib/citizenUtils";
import { pageTransition } from "@/lib/animations";
import * as api from "@/lib/api";
import { toast } from "sonner";

const INDIAN_CITIES = [
    "Bangalore, Karnataka",
    "Mumbai, Maharashtra",
    "Delhi",
    "Chennai, Tamil Nadu",
    "Hyderabad, Telangana",
    "Pune, Maharashtra",
    "Kolkata, West Bengal",
    "Ahmedabad, Gujarat",
    "Jaipur, Rajasthan",
    "Kochi, Kerala",
];

const STEPS = ["Land Details", "Upload Docs", "Pre-Check", "Payment", "Confirmation"];

interface NewApplicationFlowProps {
    onSubmit: (application: CitizenApplication) => void;
    onCancel: () => void;
}

const NewApplicationFlow = ({ onSubmit, onCancel }: NewApplicationFlowProps) => {
    const [currentStep, setCurrentStep] = useState(1);

    // Step 1: Land Details
    const [ownerName, setOwnerName] = useState("");
    const [surveyNumber, setSurveyNumber] = useState("");
    const [plotArea, setPlotArea] = useState("");
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [zoneType, setZoneType] = useState("");
    const [proposedFloors, setProposedFloors] = useState("");
    const [hasBasement, setHasBasement] = useState(false);

    // Step 2: Document Upload
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [documentUploaded, setDocumentUploaded] = useState(false);

    // Step 3: Compliance Pre-check
    const [preCheckResult, setPreCheckResult] = useState<{
        status: "LIKELY_APPROVED" | "LIKELY_REJECTED" | "NEEDS_REVIEW";
        riskScore: number;
        violatedRules: string[];
    } | null>(null);

    // Step 4: Payment
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [transactionId, setTransactionId] = useState("");

    // Step 5: Confirmation
    const [applicationId, setApplicationId] = useState("");
    const [blockchainHash, setBlockchainHash] = useState("");

    const calculatedFee = zoneType && plotArea && proposedFloors
        ? calculateApplicationFee(
            parseInt(plotArea),
            parseInt(proposedFloors),
            zoneType
        )
        : 0;

    const handleNext = () => {
        if (currentStep === 1) {
            // Validate Step 1
            if (!ownerName || !surveyNumber || !plotArea || !location || !zoneType || !proposedFloors) {
                alert("Please fill all required fields");
                return;
            }
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!documentUploaded) {
                alert("Please upload documents");
                return;
            }
            // Run pre-check
            runPreCheck();
            setCurrentStep(3);
        } else if (currentStep === 3) {
            setCurrentStep(4);
        } else if (currentStep === 4) {
            if (!paymentComplete) {
                alert("Please complete payment");
                return;
            }
            // Submit application
            submitApplication();
            setCurrentStep(5);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadProgress(0);

            try {
                const result = await api.extractOCR(file);
                setUploadProgress(100);
                setIsUploading(false);
                setDocumentUploaded(true);
                
                if (result.extractedSurveyNumber !== 'Not Found') {
                    setSurveyNumber(result.extractedSurveyNumber);
                    toast.success(`OCR Extracted Survey No: ${result.extractedSurveyNumber}`);
                }
            } catch (err) {
                setIsUploading(false);
                toast.error("OCR extraction failed. Please enter details manually.");
            }
        }
    };

    const runPreCheck = () => {
        const floors = parseInt(proposedFloors);
        const regulation = REGULATIONS[zoneType];
        const violations: string[] = [];

        if (floors > regulation.maxFloors) {
            violations.push(`Exceeds max floors for ${zoneType} (${regulation.maxFloors})`);
        }

        if (hasBasement && !regulation.basementAllowed) {
            violations.push(`Basement not allowed in ${zoneType}`);
        }

        const area = parseInt(plotArea);
        const far = (floors * area) / area;
        if (far > regulation.far) {
            violations.push(`FAR exceeds limit (${regulation.far})`);
        }

        const riskScore = violations.length * 30 + Math.floor(Math.random() * 20);

        setPreCheckResult({
            status:
                violations.length === 0
                    ? "LIKELY_APPROVED"
                    : violations.length > 2
                        ? "LIKELY_REJECTED"
                        : "NEEDS_REVIEW",
            riskScore: Math.min(riskScore, 100),
            violatedRules: violations,
        });
    };

    const handlePayment = () => {
        setIsProcessingPayment(true);

        setTimeout(() => {
            const txnId = generatePaymentTransactionId();
            setTransactionId(txnId);
            setIsProcessingPayment(false);
            setPaymentComplete(true);
        }, 2000);
    };

    const submitApplication = async () => {
        const appId = generateApplicationId();
        
        const applicationData: any = {
            applicationId: appId,
            submittedAt: new Date().toISOString(),
            status: "UNDER_REVIEW",
            ownerName,
            surveyNumber,
            plotArea: parseInt(plotArea),
            location,
            coordinates: coordinates || "12.9716° N, 77.5946° E",
            zoneType,
            proposedFloors: parseInt(proposedFloors),
            hasBasement,
            payment: {
                transactionId,
                amount: calculatedFee,
                method: paymentMethod,
                timestamp: new Date().toISOString(),
                status: "SUCCESS",
            },
        };

        try {
            const savedApp = await api.submitApplication(applicationData);
            setApplicationId(savedApp.applicationId);
            setBlockchainHash(savedApp.blockchainHash || `0x${Math.random().toString(16).substring(2, 42)}`);
            
            onSubmit(savedApp);
        } catch (err) {
            toast.error("Failed to submit application to backend.");
        }
    };

    const downloadPaymentReceipt = async () => {
        const tempApp: CitizenApplication = {
            applicationId,
            submittedAt: new Date().toISOString(),
            status: "UNDER_REVIEW",
            ownerName,
            surveyNumber,
            plotArea: parseInt(plotArea),
            location,
            coordinates,
            zoneType,
            proposedFloors: parseInt(proposedFloors),
            hasBasement,
            payment: {
                transactionId,
                amount: calculatedFee,
                method: paymentMethod,
                timestamp: new Date().toISOString(),
                status: "SUCCESS",
            },
        };
        await generatePaymentReceipt(tempApp);
    };

    const downloadApplicationSummary = async () => {
        const tempApp: CitizenApplication = {
            applicationId,
            submittedAt: new Date().toISOString(),
            status: "UNDER_REVIEW",
            ownerName,
            surveyNumber,
            plotArea: parseInt(plotArea),
            location,
            coordinates,
            zoneType,
            proposedFloors: parseInt(proposedFloors),
            hasBasement,
            payment: {
                transactionId,
                amount: calculatedFee,
                method: paymentMethod,
                timestamp: new Date().toISOString(),
                status: "SUCCESS",
            },
            blockchainHash,
        };
        await generateApplicationSummary(tempApp);
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-6"
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
        >
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">New Application</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit your land approval application in 5 simple steps
                </p>
            </div>

            {/* Step Progress */}
            <StepProgress currentStep={currentStep} steps={STEPS} />

            {/* Step Content */}
            <Card className="p-8">
                <AnimatePresence mode="wait">
                    {/* Step 1: Land Details */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Land Details</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enter the details of your land and proposed construction
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="ownerName">Owner Name *</Label>
                                    <Input
                                        id="ownerName"
                                        value={ownerName}
                                        onChange={(e) => setOwnerName(e.target.value)}
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="surveyNumber">Survey Number *</Label>
                                    <Input
                                        id="surveyNumber"
                                        value={surveyNumber}
                                        onChange={(e) => setSurveyNumber(e.target.value)}
                                        placeholder="SY/2026/XXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="plotArea">Plot Area (sq.m) *</Label>
                                    <Input
                                        id="plotArea"
                                        type="number"
                                        value={plotArea}
                                        onChange={(e) => setPlotArea(e.target.value)}
                                        placeholder="2000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Select value={location} onValueChange={setLocation}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDIAN_CITIES.map((city) => (
                                                <SelectItem key={city} value={city}>
                                                    {city}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="coordinates">Coordinates</Label>
                                    <Input
                                        id="coordinates"
                                        value={coordinates}
                                        onChange={(e) => setCoordinates(e.target.value)}
                                        placeholder="12.9716° N, 77.5946° E"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zoneType">Zone Type *</Label>
                                    <Select value={zoneType} onValueChange={setZoneType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select zone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ZONE_TYPES.map((zone) => (
                                                <SelectItem key={zone} value={zone}>
                                                    {zone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="proposedFloors">Proposed Floors *</Label>
                                    <Input
                                        id="proposedFloors"
                                        type="number"
                                        value={proposedFloors}
                                        onChange={(e) => setProposedFloors(e.target.value)}
                                        placeholder="3"
                                    />
                                </div>

                                <div className="space-y-2 flex items-center gap-3 pt-8">
                                    <input
                                        type="checkbox"
                                        id="hasBasement"
                                        checked={hasBasement}
                                        onChange={(e) => setHasBasement(e.target.checked)}
                                        className="w-4 h-4 rounded border-border"
                                    />
                                    <Label htmlFor="hasBasement" className="cursor-pointer">
                                        Include Basement
                                    </Label>
                                </div>
                            </div>

                            {calculatedFee > 0 && (
                                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <p className="text-sm text-muted-foreground">
                                        Estimated Processing Fee
                                    </p>
                                    <p className="text-2xl font-bold text-primary mt-1">
                                        {formatCurrency(calculatedFee)}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 2: Upload Documents */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Upload Documents</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Upload land ownership and building plan documents
                                    </p>
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.png"
                                />
                                <label htmlFor="fileUpload" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-sm font-medium mb-2">
                                        Drop land ownership & building plan documents
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        PDF, JPG, PNG — Click or drag to simulate upload
                                    </p>
                                </label>
                            </div>

                            {isUploading && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: "0%" }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {documentUploaded && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                    <div>
                                        <p className="text-sm font-medium text-success">
                                            Documents uploaded successfully
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            OCR extraction completed • All fields verified
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Compliance Pre-Check */}
                    {currentStep === 3 && preCheckResult && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Compliance Pre-Check</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Preliminary compliance analysis results
                                    </p>
                                </div>
                            </div>

                            <div
                                className={`p-6 rounded-lg border-2 ${preCheckResult.status === "LIKELY_APPROVED"
                                        ? "bg-success/5 border-success/30"
                                        : preCheckResult.status === "LIKELY_REJECTED"
                                            ? "bg-destructive/5 border-destructive/30"
                                            : "bg-warning/5 border-warning/30"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    {preCheckResult.status === "LIKELY_APPROVED" ? (
                                        <CheckCircle2 className="w-8 h-8 text-success" />
                                    ) : (
                                        <Shield className="w-8 h-8 text-warning" />
                                    )}
                                    <div>
                                        <h4 className="text-lg font-bold">
                                            {preCheckResult.status.replace("_", " ")}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Risk Score: {preCheckResult.riskScore}/100
                                        </p>
                                    </div>
                                </div>

                                {preCheckResult.violatedRules.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm font-medium">Potential Issues:</p>
                                        <ul className="space-y-1">
                                            {preCheckResult.violatedRules.map((rule, index) => (
                                                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="text-destructive">•</span>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Important:</strong> This is a preliminary automated check. Final
                                    approval will be determined by a government officer after thorough review.
                                    Proceed with payment to submit your application for official review.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Payment */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Payment</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pay the compliance processing fee to submit your application
                                    </p>
                                </div>
                            </div>

                            {!paymentComplete ? (
                                <>
                                    <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Compliance Processing Fee
                                        </p>
                                        <p className="text-4xl font-bold text-primary">
                                            {formatCurrency(calculatedFee)}
                                        </p>
                                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                            <div className="flex justify-between">
                                                <span>Base Fee:</span>
                                                <span>₹500</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Plot Size Factor:</span>
                                                <span>
                                                    {plotArea && parseInt(plotArea) > 3000 ? "₹300" : "₹150"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Floors ({proposedFloors}):</span>
                                                <span>₹{parseInt(proposedFloors) * 100}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Zone Multiplier ({zoneType}):</span>
                                                <span>
                                                    {zoneType === "Commercial"
                                                        ? "1.5x"
                                                        : zoneType === "Airport Zone"
                                                            ? "2.0x"
                                                            : zoneType === "Eco Zone"
                                                                ? "1.8x"
                                                                : "1.0x"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Select Payment Method</Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {(["UPI", "CARD", "NET_BANKING"] as PaymentMethod[]).map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`p-4 rounded-lg border-2 transition-all ${paymentMethod === method
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium">
                                                        {method.replace("_", " ")}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessingPayment}
                                        className="w-full gap-2"
                                        size="lg"
                                    >
                                        {isProcessingPayment ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-4 h-4" />
                                                Pay {formatCurrency(calculatedFee)}
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8 text-success" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Payment Successful!</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Transaction ID: {transactionId}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={downloadPaymentReceipt}
                                        className="gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Receipt
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Step 5: Confirmation */}
                    {currentStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-success" />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                                <p className="text-muted-foreground">
                                    Your application has been successfully submitted and is now under review
                                </p>
                            </div>

                            <div className="max-w-md mx-auto space-y-4 text-left">
                                <div className="p-4 rounded-lg bg-secondary">
                                    <p className="text-xs text-muted-foreground mb-1">Application ID</p>
                                    <p className="font-mono font-bold text-primary">{applicationId}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-secondary">
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <p className="font-medium">Under Review</p>
                                </div>

                                <div className="p-4 rounded-lg bg-secondary">
                                    <p className="text-xs text-muted-foreground mb-1">Blockchain Reference</p>
                                    <p className="font-mono text-xs break-all">{blockchainHash}</p>
                                </div>

                                <div className="p-4 rounded-lg bg-secondary">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Estimated Processing Time
                                    </p>
                                    <p className="font-medium">3-5 business days</p>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <Button variant="outline" onClick={downloadApplicationSummary} className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download Summary
                                </Button>
                                <Button onClick={onCancel}>Go to Dashboard</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Navigation Buttons */}
            {currentStep < 5 && (
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={currentStep === 1 ? onCancel : handleBack}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {currentStep === 1 ? "Cancel" : "Back"}
                    </Button>
                    <Button onClick={handleNext} className="gap-2">
                        {currentStep === 4 ? "Submit Application" : "Next"}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export default NewApplicationFlow;
