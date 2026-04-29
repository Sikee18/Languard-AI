import { motion } from "framer-motion";
import { useState } from "react";
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    IndianRupee,
    Plus,
    Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CitizenApplication } from "@/lib/mockData";
import {
    getStatusBadgeClass,
    formatCurrency,
    formatDate,
} from "@/lib/citizenUtils";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface CitizenDashboardProps {
    applications: CitizenApplication[];
    onNewApplication: () => void;
    onViewDetails: (app: CitizenApplication) => void;
}

const CitizenDashboard = ({
    applications,
    onNewApplication,
    onViewDetails,
}: CitizenDashboardProps) => {
    // Calculate statistics
    const totalSubmitted = applications.length;
    const approved = applications.filter((app) => app.status === "APPROVED").length;
    const rejected = applications.filter((app) => app.status === "REJECTED").length;
    const underReview = applications.filter(
        (app) => app.status === "UNDER_REVIEW" || app.status === "SUBMITTED"
    ).length;
    const totalPaid = applications.reduce(
        (sum, app) => sum + (app.payment.status === "SUCCESS" ? app.payment.amount : 0),
        0
    );

    return (
        <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {/* Welcome Header */}
            <motion.div variants={staggerItem} className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">My Applications</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Track and manage your land approval applications
                    </p>
                </div>
                <Button onClick={onNewApplication} className="gap-2" size="lg">
                    <Plus className="w-4 h-4" />
                    New Application
                </Button>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
                <StatCard
                    icon={FileText}
                    label="Total Submitted"
                    value={totalSubmitted}
                    color="text-primary"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={approved}
                    color="text-success"
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={rejected}
                    color="text-destructive"
                />
                <StatCard
                    icon={Clock}
                    label="Under Review"
                    value={underReview}
                    color="text-warning"
                />
                <StatCard
                    icon={IndianRupee}
                    label="Total Paid"
                    value={formatCurrency(totalPaid)}
                    color="text-primary"
                    isAmount
                />
            </motion.div>

            {/* Applications Table */}
            <motion.div variants={staggerItem}>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Application Status</h3>

                    {applications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                No applications submitted yet
                            </p>
                            <Button onClick={onNewApplication} className="gap-2">
                                <Plus className="w-4 h-4" />
                                Submit Your First Application
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Application ID
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Survey Number
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Location
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Submitted
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Status
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Fee Paid
                                        </th>
                                        <th className="pb-3 text-xs font-medium text-muted-foreground uppercase">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map((app, index) => (
                                        <motion.tr
                                            key={app.applicationId}
                                            className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td className="py-4 font-mono text-sm text-primary">
                                                {app.applicationId}
                                            </td>
                                            <td className="py-4 text-sm">{app.surveyNumber}</td>
                                            <td className="py-4 text-sm">{app.location}</td>
                                            <td className="py-4 text-sm text-muted-foreground">
                                                {formatDate(app.submittedAt)}
                                            </td>
                                            <td className="py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                                                        app.status
                                                    )}`}
                                                >
                                                    {app.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-medium">
                                                {formatCurrency(app.payment.amount)}
                                            </td>
                                            <td className="py-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onViewDetails(app)}
                                                    className="gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Help Section */}
            <motion.div variants={staggerItem}>
                <Card className="p-6 bg-primary/5 border-primary/20">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Need Help?</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                If you have questions about the application process or need assistance,
                                our support team is here to help.
                            </p>
                            <div className="flex gap-4 text-sm">
                                <a href="#" className="text-primary hover:underline">
                                    Application Guide
                                </a>
                                <a href="#" className="text-primary hover:underline">
                                    FAQs
                                </a>
                                <a href="#" className="text-primary hover:underline">
                                    Contact Support
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
};

const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    isAmount = false,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
    isAmount?: boolean;
}) => (
    <motion.div variants={staggerItem}>
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold ${isAmount ? "" : "font-mono"}`}>
                {value}
            </p>
        </Card>
    </motion.div>
);

export default CitizenDashboard;
