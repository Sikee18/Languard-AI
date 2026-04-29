import { motion } from "framer-motion";
import { useState } from "react";
import { Mountain, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { runElevationAnalysis, ElevationData } from "@/lib/mockData";
import { pageTransition } from "@/lib/animations";

const ElevationAnalysis = () => {
    const [elevationResult, setElevationResult] = useState<ElevationData | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            const result = runElevationAnalysis();
            setElevationResult(result);
            setAnalyzing(false);
        }, 2000);
    };

    // Generate elevation profile data for visualization
    const generateElevationProfile = (oldElev: number, newElev: number) => {
        const points = 20;
        const data = [];

        for (let i = 0; i <= points; i++) {
            const progress = i / points;
            data.push({
                distance: i * 5, // meters
                oldElevation: oldElev + (Math.sin(progress * Math.PI) * 5),
                newElevation: newElev + (Math.sin(progress * Math.PI) * 5),
            });
        }

        return data;
    };

    const elevationProfile = elevationResult
        ? generateElevationProfile(elevationResult.oldElevation, elevationResult.newElevation)
        : [];

    const threshold = 5; // meters

    return (
        <motion.div
            className="space-y-6"
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Mountain className="w-6 h-6 text-primary" />
                        DEM Elevation Analysis
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Digital Elevation Model analysis for vertical construction detection
                    </p>
                </div>
                <Button onClick={runAnalysis} disabled={analyzing} className="gap-2">
                    <Mountain className="w-4 h-4" />
                    {analyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
            </div>

            {analyzing && (
                <Card className="p-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground">
                            Processing DEM data and calculating elevation changes...
                        </p>
                    </div>
                </Card>
            )}

            {elevationResult && !analyzing && (
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Status Card */}
                    <Card
                        className={`p-6 ${elevationResult.verticalConstruction
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-success/50 bg-success/5"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            {elevationResult.verticalConstruction ? (
                                <AlertTriangle className="w-8 h-8 text-destructive" />
                            ) : (
                                <CheckCircle className="w-8 h-8 text-success" />
                            )}
                            <div>
                                <h3 className="text-xl font-bold">
                                    {elevationResult.verticalConstruction
                                        ? "Vertical Construction Detected"
                                        : "No Significant Height Change"}
                                </h3>
                                <p className="text-sm opacity-80">
                                    {elevationResult.verticalConstruction
                                        ? "Elevation change exceeds regulatory threshold"
                                        : "Elevation within acceptable limits"}
                                </p>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <MetricCard
                                label="Old Elevation"
                                value={`${elevationResult.oldElevation}m`}
                                icon={Mountain}
                            />
                            <MetricCard
                                label="New Elevation"
                                value={`${elevationResult.newElevation}m`}
                                icon={Mountain}
                            />
                            <MetricCard
                                label="Difference"
                                value={`${elevationResult.difference}m`}
                                icon={TrendingUp}
                                highlight={elevationResult.difference > threshold}
                            />
                            <MetricCard
                                label="Threshold"
                                value={`${threshold}m`}
                                icon={AlertTriangle}
                            />
                        </div>

                        {elevationResult.verticalConstruction && (
                            <div className="mt-4 p-4 rounded-md border border-destructive/30 bg-destructive/10">
                                <p className="text-sm font-medium text-destructive">
                                    ⚠ Violation Detected
                                </p>
                                <p className="text-sm text-foreground/80 mt-1">
                                    Elevation increase of {elevationResult.difference}m exceeds the maximum
                                    allowed threshold of {threshold}m. This may indicate unauthorized
                                    vertical construction or additional floors beyond approved plans.
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Elevation Profile Chart */}
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                            <Mountain className="w-4 h-4 text-primary" />
                            Elevation Profile Comparison
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={elevationProfile}>
                                <defs>
                                    <linearGradient id="oldElevation" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(175, 80%, 45%)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(175, 80%, 45%)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="newElevation" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={
                                                elevationResult.verticalConstruction
                                                    ? "hsl(0, 72%, 51%)"
                                                    : "hsl(142, 70%, 45%)"
                                            }
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={
                                                elevationResult.verticalConstruction
                                                    ? "hsl(0, 72%, 51%)"
                                                    : "hsl(142, 70%, 45%)"
                                            }
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="distance"
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    label={{ value: "Distance (m)", position: "insideBottom", offset: -5 }}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    fontSize={12}
                                    label={{ value: "Elevation (m)", angle: -90, position: "insideLeft" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value: number) => [`${value.toFixed(1)}m`, ""]}
                                />
                                <ReferenceLine
                                    y={elevationResult.oldElevation + threshold}
                                    stroke="hsl(var(--warning))"
                                    strokeDasharray="5 5"
                                    label="Threshold"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="oldElevation"
                                    stroke="hsl(175, 80%, 45%)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#oldElevation)"
                                    name="Old Elevation"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="newElevation"
                                    stroke={
                                        elevationResult.verticalConstruction
                                            ? "hsl(0, 72%, 51%)"
                                            : "hsl(142, 70%, 45%)"
                                    }
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#newElevation)"
                                    name="New Elevation"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Additional Analysis */}
                    <Card className="p-6">
                        <h3 className="text-sm font-medium mb-4">Detailed Analysis</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estimated Additional Floors:</span>
                                <span className="font-mono font-medium">
                                    {Math.floor(elevationResult.difference / 3)} floors
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Vertical Change Rate:</span>
                                <span className="font-mono font-medium">
                                    {((elevationResult.difference / elevationResult.oldElevation) * 100).toFixed(
                                        1
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Compliance Status:</span>
                                <span
                                    className={`font-medium ${elevationResult.verticalConstruction
                                        ? "text-destructive"
                                        : "text-success"
                                        }`}
                                >
                                    {elevationResult.verticalConstruction ? "NON-COMPLIANT" : "COMPLIANT"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Recommended Action:</span>
                                <span className="font-medium">
                                    {elevationResult.verticalConstruction
                                        ? "Manual Inspection Required"
                                        : "No Action Needed"}
                                </span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {!elevationResult && !analyzing && (
                <Card className="p-12 text-center">
                    <Mountain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Analysis Data</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        Click "Run Analysis" to perform DEM elevation analysis and detect vertical
                        construction changes.
                    </p>
                </Card>
            )}
        </motion.div>
    );
};

const MetricCard = ({
    label,
    value,
    icon: Icon,
    highlight = false,
}: {
    label: string;
    value: string;
    icon: React.ElementType;
    highlight?: boolean;
}) => (
    <div className={`p-4 rounded-lg border ${highlight ? "border-destructive/50 bg-destructive/5" : "border-border bg-secondary/30"}`}>
        <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-4 h-4 ${highlight ? "text-destructive" : "text-muted-foreground"}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className={`text-xl font-bold font-mono ${highlight ? "text-destructive" : ""}`}>
            {value}
        </p>
    </div>
);

export default ElevationAnalysis;
