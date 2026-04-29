import jsPDF from "jspdf";
import { CitizenApplication, ApplicationStatus } from "./mockData";

// Status badge styling
export function getStatusBadgeClass(status: ApplicationStatus): string {
    switch (status) {
        case "APPROVED":
            return "bg-success/10 text-success border-success/30";
        case "REJECTED":
            return "bg-destructive/10 text-destructive border-destructive/30";
        case "UNDER_REVIEW":
            return "bg-warning/10 text-warning border-warning/30";
        case "SUBMITTED":
            return "bg-primary/10 text-primary border-primary/30";
        case "PAYMENT_PENDING":
            return "bg-muted text-muted-foreground border-border";
        default:
            return "bg-secondary text-secondary-foreground border-border";
    }
}

// Format currency in INR
export function formatCurrency(amount: number): string {
    return `₹${amount.toLocaleString("en-IN")}`;
}

// Format date for display
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Format datetime for display
export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// Generate payment receipt PDF
export async function generatePaymentReceipt(
    application: CitizenApplication
): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFillColor(20, 184, 166); // Teal
    pdf.rect(0, 0, pageWidth, 40, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("PAYMENT RECEIPT", pageWidth / 2, 20, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("LandGuard AI - Government Compliance Portal", pageWidth / 2, 30, {
        align: "center",
    });

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Transaction Details
    let y = 60;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Transaction Details", 20, y);

    y += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    const details = [
        ["Transaction ID:", application.payment.transactionId],
        ["Date & Time:", formatDateTime(application.payment.timestamp)],
        ["Payment Method:", application.payment.method],
        ["Status:", application.payment.status],
        ["Amount Paid:", formatCurrency(application.payment.amount)],
    ];

    details.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(label, 20, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, 80, y);
        y += 10;
    });

    // Application Details
    y += 10;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Application Details", 20, y);

    y += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    const appDetails = [
        ["Application ID:", application.applicationId],
        ["Owner Name:", application.ownerName],
        ["Survey Number:", application.surveyNumber],
        ["Location:", application.location],
        ["Plot Area:", `${application.plotArea} sq.m`],
        ["Zone Type:", application.zoneType],
        ["Proposed Floors:", application.proposedFloors.toString()],
    ];

    appDetails.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(label, 20, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, 80, y);
        y += 10;
    });

    // Footer
    y = pdf.internal.pageSize.getHeight() - 30;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
        "This is a computer-generated receipt and does not require a signature.",
        pageWidth / 2,
        y,
        { align: "center" }
    );
    pdf.text(
        `Generated on ${new Date().toLocaleString("en-IN")}`,
        pageWidth / 2,
        y + 7,
        { align: "center" }
    );

    // Save
    pdf.save(`payment-receipt-${application.payment.transactionId}.pdf`);
}

// Generate application summary PDF
export async function generateApplicationSummary(
    application: CitizenApplication
): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFillColor(20, 184, 166);
    pdf.rect(0, 0, pageWidth, 40, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("APPLICATION SUMMARY", pageWidth / 2, 20, { align: "center" });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("LandGuard AI - Land Approval System", pageWidth / 2, 30, {
        align: "center",
    });

    pdf.setTextColor(0, 0, 0);

    // Application Info
    let y = 60;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Application ID: ${application.applicationId}`, 20, y);

    y += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Submitted: ${formatDateTime(application.submittedAt)}`, 20, y);
    pdf.text(`Status: ${application.status}`, 120, y);

    // Land Details
    y += 20;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Land Details", 20, y);

    y += 12;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    const landDetails = [
        ["Owner Name:", application.ownerName],
        ["Survey Number:", application.surveyNumber],
        ["Plot Area:", `${application.plotArea} sq.m`],
        ["Location:", application.location],
        ["Coordinates:", application.coordinates],
        ["Zone Type:", application.zoneType],
        ["Proposed Floors:", application.proposedFloors.toString()],
        ["Basement:", application.hasBasement ? "Yes" : "No"],
    ];

    landDetails.forEach(([label, value]) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(label, 20, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(value, 70, y);
        y += 8;
    });

    // Payment Info
    y += 10;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Payment Information", 20, y);

    y += 12;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");

    pdf.setFont("helvetica", "bold");
    pdf.text("Amount Paid:", 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatCurrency(application.payment.amount), 70, y);

    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Transaction ID:", 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(application.payment.transactionId, 70, y);

    // Blockchain
    if (application.blockchainHash) {
        y += 15;
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Blockchain Record", 20, y);

        y += 12;
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Hash: ${application.blockchainHash}`, 20, y);
    }

    // Footer
    y = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
        "This is a system-generated document. For queries, contact support@landguard.gov.in",
        pageWidth / 2,
        y,
        { align: "center" }
    );

    pdf.save(`application-summary-${application.applicationId}.pdf`);
}

// Generate approval certificate PDF
export async function generateApprovalCertificate(
    application: CitizenApplication
): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Border
    pdf.setDrawColor(20, 184, 166);
    pdf.setLineWidth(2);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Header
    pdf.setFillColor(20, 184, 166);
    pdf.rect(15, 15, pageWidth - 30, 50, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(26);
    pdf.setFont("helvetica", "bold");
    pdf.text("APPROVAL CERTIFICATE", pageWidth / 2, 35, { align: "center" });

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    pdf.text("Government of India - Land Approval Authority", pageWidth / 2, 50, {
        align: "center",
    });

    pdf.setTextColor(0, 0, 0);

    // Certificate Body
    let y = 90;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    const certText = `This is to certify that the land development application submitted by ${application.ownerName} for Survey Number ${application.surveyNumber} has been reviewed and APPROVED by the competent authority.`;

    const lines = pdf.splitTextToSize(certText, pageWidth - 60);
    pdf.text(lines, pageWidth / 2, y, { align: "center" });

    // Details Box
    y += 40;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(30, y, pageWidth - 60, 80);

    y += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Application Details:", 40, y);

    y += 10;
    pdf.setFont("helvetica", "normal");

    const certDetails = [
        `Application ID: ${application.applicationId}`,
        `Survey Number: ${application.surveyNumber}`,
        `Location: ${application.location}`,
        `Plot Area: ${application.plotArea} sq.m`,
        `Approved Floors: ${application.proposedFloors}`,
        `Zone Type: ${application.zoneType}`,
    ];

    certDetails.forEach((detail) => {
        pdf.text(detail, 40, y);
        y += 8;
    });

    // Approval Info
    y += 20;
    pdf.setFontSize(10);
    pdf.text(`Approved on: ${formatDate(application.submittedAt)}`, 40, y);
    y += 7;
    pdf.text(
        `Blockchain Hash: ${application.blockchainHash || "N/A"}`,
        40,
        y
    );

    // Digital Signature
    y = pageHeight - 60;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Authorized Signatory", pageWidth - 60, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("LandGuard AI System", pageWidth - 60, y + 7);
    pdf.text(formatDate(new Date().toISOString()), pageWidth - 60, y + 14);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
        "This is a digitally generated certificate. Verify authenticity at landguard.gov.in/verify",
        pageWidth / 2,
        pageHeight - 25,
        { align: "center" }
    );

    pdf.save(`approval-certificate-${application.applicationId}.pdf`);
}

// Generate rejection report PDF
export async function generateRejectionReport(
    application: CitizenApplication
): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header
    pdf.setFillColor(239, 68, 68); // Red
    pdf.rect(0, 0, pageWidth, 40, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("APPLICATION REJECTION NOTICE", pageWidth / 2, 20, {
        align: "center",
    });

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("LandGuard AI - Land Approval System", pageWidth / 2, 30, {
        align: "center",
    });

    pdf.setTextColor(0, 0, 0);

    // Application Info
    let y = 60;
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Application ID: ${application.applicationId}`, 20, y);

    y += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Applicant: ${application.ownerName}`, 20, y);
    pdf.text(`Survey No: ${application.surveyNumber}`, 120, y);

    // Rejection Notice
    y += 20;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(239, 68, 68);
    pdf.text("STATUS: REJECTED", 20, y);
    pdf.setTextColor(0, 0, 0);

    // Violated Rules
    if (
        application.complianceResult &&
        application.complianceResult.violatedRules.length > 0
    ) {
        y += 15;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Reasons for Rejection:", 20, y);

        y += 10;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        application.complianceResult.violatedRules.forEach((rule, index) => {
            const lines = pdf.splitTextToSize(`${index + 1}. ${rule}`, pageWidth - 50);
            pdf.text(lines, 25, y);
            y += lines.length * 7 + 3;
        });
    }

    // Officer Remarks
    if (
        application.complianceResult &&
        application.complianceResult.officerRemarks
    ) {
        y += 10;
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("Officer Remarks:", 20, y);

        y += 10;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        const remarks = pdf.splitTextToSize(
            application.complianceResult.officerRemarks,
            pageWidth - 40
        );
        pdf.text(remarks, 20, y);
        y += remarks.length * 7;
    }

    // Next Steps
    y += 15;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Next Steps:", 20, y);

    y += 10;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    const nextSteps = [
        "1. Review the violations listed above",
        "2. Modify your application to comply with regulations",
        "3. Submit a new application with corrected details",
        "4. Contact support@landguard.gov.in for clarifications",
    ];

    nextSteps.forEach((step) => {
        pdf.text(step, 20, y);
        y += 8;
    });

    // Footer
    y = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
        "For assistance, contact LandGuard AI Support at support@landguard.gov.in",
        pageWidth / 2,
        y,
        { align: "center" }
    );

    pdf.save(`rejection-report-${application.applicationId}.pdf`);
}
