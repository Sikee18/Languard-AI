import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
    FileText,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ShieldAlert,
    TrendingUp,
    TrendingDown,
    Activity,
    IndianRupee,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { BlockchainRecord, SEED_MONITORING_SCANS, CitizenApplication, calculateTotalRevenue } from "@/lib/mockData";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface DashboardOverviewProps {
    records: BlockchainRecord[];
    citizenApplications?: CitizenApplication[];
}

// Mock monthly data for trend chart
const monthlyData = [
    { month: "Mar", approved: 45, rejected: 12 },
    { month: "Apr", approved: 52, rejected: 15 },
    { month: "May", approved: 48, rejected: 18 },
    { month: "Jun", approved: 61, rejected: 14 },
    { month: "Jul", approved: 55, rejected: 20 },
    { month: "Aug", approved: 67, rejected: 16 },
    { month: "Sep", approved: 72, rejected: 13 },
    { month: "Oct", approved: 58, rejected: 22 },
    { month: "Nov", approved: 64, rejected: 17 },
    { month: "Dec", approved: 70, rejected: 15 },
    { month: "Jan", approved: 76, rejected: 19 },
    { month: "Feb", approved: 82, rejected: 14 },
];

// Zone-wise data
const zoneData = [
    { zone: "Residential", applications: 145, approved: 112 },
    { zone: "Commercial", applications: 89, approved: 67 },
    { zone: "Airport Zone", applications: 34, approved: 18 },
    { zone: "Eco Zone", applications: 28, approved: 12 },
];

const COLORS = {
    low: "hsl(142, 70%, 45%)",
    medium: "hsl(38, 92%, 50%)",
    high: "hsl(0, 72%, 51%)",
    primary: "hsl(175, 80%, 45%)",
    approved: "hsl(142, 70%, 45%)",
    rejected: "hsl(0, 72%, 51%)",
};

const DashboardOverview = ({ records, citizenApplications = [] }: DashboardOverviewProps) => {
    const approved = records.filter((r) => r.decision === "APPROVED").length;
    const rejected = records.filter((r) => r.decision === "REJECTED").length;
    const flaggedScans = SEED_MONITORING_SCANS.filter((s) => s.flagged);
    const highRiskScans = SEED_MONITORING_SCANS.filter((s) => s.riskScore > 70);

    // Calculate total revenue from citizen applications
    const totalRevenue = calculateTotalRevenue(citizenApplications);

    // Calculate risk distribution
    const lowRisk = SEED_MONITORING_SCANS.filter((s) => s.riskScore <= 30).length;
    const mediumRisk = SEED_MONITORING_SCANS.filter(
        (s) => s.riskScore > 30 && s.riskScore <= 70
    ).length;
    const highRisk = SEED_MONITORING_SCANS.filter((s) => s.riskScore > 70).length;

    const riskDistribution = [
        { name: "Low Risk", value: lowRisk, color: COLORS.low },
        { name: "Medium Risk", value: mediumRisk, color: COLORS.medium },
        { name: "High Risk", value: highRisk, color: COLORS.high },
    ];

    // Recent activity (last 5 records)
    const recentActivity = records.slice(0, 5);

    return (
        <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
        >
            {/* Statistics Cards */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
                variants={staggerContainer}
            >
                <StatCard
                    icon={FileText}
                    label="Total Applications"
                    value={records.length}
                    trend={12}
                    color="text-primary"
                />
                <StatCard
                    icon={CheckCircle}
                    label="Approved"
                    value={approved}
                    percentage={(approved / records.length) * 100}
                    color="text-success"
                />
                <StatCard
                    icon={XCircle}
                    label="Rejected"
                    value={rejected}
                    percentage={(rejected / records.length) * 100}
                    color="text-destructive"
                />
                <StatCard
                    icon={AlertTriangle}
                    label="Flagged"
                    value={flaggedScans.length}
                    trend={-5}
                    color="text-warning"
                />
                <StatCard
                    icon={ShieldAlert}
                    label="High Risk"
                    value={highRiskScans.length}
                    trend={-8}
                    color="text-destructive"
                />
                <StatCard
                    icon={Activity}
                    label="Active Zones"
                    value={4}
                    color="text-primary"
                />
                <StatCard
                    icon={IndianRupee}
                    label="Total Revenue"
                    value={totalRevenue}
                    trend={15}
                    color="text-success"
                    isCurrency
                />
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Approval Trend */}
                <motion.div variants={staggerItem}>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Monthly Approval Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="approved"
                                    stroke={COLORS.approved}
                                    strokeWidth={2}
                                    dot={{ fill: COLORS.approved }}
                                    name="Approved"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="rejected"
                                    stroke={COLORS.rejected}
                                    strokeWidth={2}
                                    dot={{ fill: COLORS.rejected }}
                                    name="Rejected"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>

                {/* Risk Distribution */}
                <motion.div variants={staggerItem}>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-primary" />
                            Risk Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>

                {/* Zone-wise Analysis */}
                <motion.div variants={staggerItem} className="lg:col-span-2">
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            Zone-wise Analysis
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={zoneData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="zone"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="applications" fill={COLORS.primary} name="Total Applications" />
                                <Bar dataKey="approved" fill={COLORS.approved} name="Approved" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity & Flagged Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity Timeline */}
                <motion.div variants={staggerItem}>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivity.map((record, index) => (
                                <motion.div
                                    key={record.transactionId}
                                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${record.decision === "APPROVED" ? "bg-success" : "bg-destructive"
                                            }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{record.ownerName}</p>
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {record.surveyNumber}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(record.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded font-medium ${record.decision === "APPROVED"
                                            ? "status-approved"
                                            : "status-rejected"
                                            }`}
                                    >
                                        {record.decision}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>

                {/* Flagged Alerts */}
                <motion.div variants={staggerItem}>
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning" />
                            Recent Flagged Alerts
                        </h3>
                        <div className="space-y-4">
                            {flaggedScans.slice(0, 5).map((scan, index) => (
                                <motion.div
                                    key={scan.id}
                                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <AlertTriangle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium font-mono">{scan.id}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {scan.location}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{scan.scanDate}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p
                                            className={`text-sm font-bold font-mono ${scan.riskScore > 70
                                                ? "text-destructive"
                                                : "text-warning"
                                                }`}
                                        >
                                            {scan.riskScore}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Risk</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number;
    trend?: number;
    percentage?: number;
    color: string;
    isCurrency?: boolean;
}

const StatCard = ({ icon: Icon, label, value, trend, percentage, color, isCurrency = false }: StatCardProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    const formatValue = (val: number) => {
        if (isCurrency) {
            return `₹${val.toLocaleString("en-IN")}`;
        }
        return val.toString();
    };

    return (
        <motion.div variants={staggerItem}>
            <Card className="p-4 space-y-2 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="flex items-end justify-between">
                    <p className={`text-2xl font-bold ${isCurrency ? "" : "font-mono"} ${color} animate-count-up`}>
                        {formatValue(displayValue)}
                    </p>
                    {trend !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                            {trend > 0 ? (
                                <TrendingUp className="w-3 h-3 text-success" />
                            ) : (
                                <TrendingDown className="w-3 h-3 text-destructive" />
                            )}
                            <span className={trend > 0 ? "text-success" : "text-destructive"}>
                                {Math.abs(trend)}%
                            </span>
                        </div>
                    )}
                    {percentage !== undefined && (
                        <span className="text-xs text-muted-foreground">
                            {percentage.toFixed(1)}%
                        </span>
                    )}
                </div>
            </Card>
        </motion.div>
    );
};

export default DashboardOverview;
