import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ComplianceReportData {
    totalApplications: number;
    approved: number;
    rejected: number;
    flagged: number;
    highRisk: number;
    records: Array<{
        transactionId: string;
        timestamp: string;
        ownerName: string;
        surveyNumber: string;
        decision: string;
    }>;
    scans: Array<{
        id: string;
        surveyNumber: string;
        location: string;
        riskScore: number;
        flagged: boolean;
    }>;
}

export async function generateComplianceReport(data: ComplianceReportData): Promise<void> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 150, 136); // Teal color
    pdf.text("LANDGUARD AI", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Compliance Intelligence Report", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 15;
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" });

    // Divider
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);

    // Summary Statistics
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Executive Summary", 20, yPosition);

    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);

    const stats = [
        `Total Applications: ${data.totalApplications}`,
        `Approved: ${data.approved} (${((data.approved / data.totalApplications) * 100).toFixed(1)}%)`,
        `Rejected: ${data.rejected} (${((data.rejected / data.totalApplications) * 100).toFixed(1)}%)`,
        `Flagged Constructions: ${data.flagged}`,
        `High Risk Alerts: ${data.highRisk}`,
    ];

    stats.forEach((stat) => {
        pdf.text(`• ${stat}`, 25, yPosition);
        yPosition += 6;
    });

    // Audit Trail Section
    yPosition += 10;
    if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text("Audit Trail", 20, yPosition);

    yPosition += 8;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;

    // Table headers
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("TX ID", 20, yPosition);
    pdf.text("Owner", 55, yPosition);
    pdf.text("Survey No.", 100, yPosition);
    pdf.text("Decision", 140, yPosition);
    pdf.text("Date", 170, yPosition);

    yPosition += 5;
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;

    // Table rows
    pdf.setFontSize(7);
    pdf.setTextColor(0, 0, 0);

    data.records.slice(0, 20).forEach((record) => {
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.text(record.transactionId.substring(0, 12), 20, yPosition);
        pdf.text(record.ownerName.substring(0, 18), 55, yPosition);
        pdf.text(record.surveyNumber, 100, yPosition);

        // Color code decision
        if (record.decision === "APPROVED") {
            pdf.setTextColor(0, 150, 0);
        } else {
            pdf.setTextColor(200, 0, 0);
        }
        pdf.text(record.decision, 140, yPosition);
        pdf.setTextColor(0, 0, 0);

        pdf.text(new Date(record.timestamp).toLocaleDateString(), 170, yPosition);
        yPosition += 5;
    });

    // Flagged Constructions Section
    if (data.scans.filter(s => s.flagged).length > 0) {
        yPosition += 10;
        if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text("Flagged Constructions", 20, yPosition);

        yPosition += 8;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 8;

        // Table headers
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Scan ID", 20, yPosition);
        pdf.text("Survey No.", 50, yPosition);
        pdf.text("Location", 90, yPosition);
        pdf.text("Risk Score", 150, yPosition);

        yPosition += 5;
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 5;

        // Table rows
        pdf.setFontSize(7);

        data.scans.filter(s => s.flagged).slice(0, 15).forEach((scan) => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage();
                yPosition = 20;
            }

            pdf.setTextColor(0, 0, 0);
            pdf.text(scan.id, 20, yPosition);
            pdf.text(scan.surveyNumber, 50, yPosition);
            pdf.text(scan.location.substring(0, 25), 90, yPosition);

            // Color code risk score
            if (scan.riskScore > 70) {
                pdf.setTextColor(200, 0, 0);
            } else if (scan.riskScore > 30) {
                pdf.setTextColor(255, 150, 0);
            } else {
                pdf.setTextColor(0, 150, 0);
            }
            pdf.text(scan.riskScore.toString(), 150, yPosition);

            yPosition += 5;
        });
    }

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
            `Page ${i} of ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
        pdf.text(
            "LandGuard AI - Confidential",
            pageWidth - 20,
            pageHeight - 10,
            { align: "right" }
        );
    }

    // Save PDF
    pdf.save(`landguard-compliance-report-${Date.now()}.pdf`);
}

export async function captureElementAsPDF(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
}
