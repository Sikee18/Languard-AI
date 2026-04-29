import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield,
  Radar,
  LayoutDashboard,
  FileText,
  Mountain,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import LandApproval from "@/components/LandApproval";
import SatelliteMonitoring from "@/components/SatelliteMonitoring";
import AdminDashboard from "@/components/AdminDashboard";
import DashboardOverview from "@/components/DashboardOverview";
import ElevationAnalysis from "@/components/ElevationAnalysis";
import CitizenDashboard from "@/components/CitizenDashboard";
import NewApplicationFlow from "@/components/NewApplicationFlow";
import CitizenApplicationDetail from "@/components/CitizenApplicationDetail";
import { BlockchainRecord, SEED_RECORDS, CitizenApplication, MOCK_CITIZEN_APPLICATIONS } from "@/lib/mockData";
import { pageTransition } from "@/lib/animations";
import * as api from "@/lib/api";
import { toast } from "sonner";

type Tab =
  | "dashboard"
  | "approval"
  | "satellite"
  | "elevation"
  | "audit";

type CitizenView = "dashboard" | "newApplication" | "applicationDetail";

type Role = "admin" | "officer" | "citizen";

const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "approval", label: "New Application", icon: FileText },
  { id: "satellite", label: "Satellite Monitoring", icon: Radar },
  { id: "elevation", label: "Elevation Analysis", icon: Mountain },
  { id: "audit", label: "Audit Trail", icon: Shield },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [records, setRecords] = useState<BlockchainRecord[]>(SEED_RECORDS);
  const [lastApproval, setLastApproval] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const { theme, toggleTheme } = useTheme();

  // Citizen portal state
  const [citizenView, setCitizenView] = useState<CitizenView>("dashboard");
  const [citizenApplications, setCitizenApplications] = useState<CitizenApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<CitizenApplication | null>(null);

  // REAL SYNC: Fetch from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const apps = await api.fetchApplications();
        if (apps.length > 0) {
          setCitizenApplications(apps);
        } else {
          setCitizenApplications(MOCK_CITIZEN_APPLICATIONS);
        }
      } catch (err) {
        console.error("Backend offline, using mocks");
        setCitizenApplications(MOCK_CITIZEN_APPLICATIONS);
      }
    };
    loadData();
  }, []);

  const handleDecision = (record: BlockchainRecord) => {
    setRecords((prev) => [record, ...prev]);
    setLastApproval(record.decision === "APPROVED");
  };

  const handleCitizenApplicationSubmit = (application: CitizenApplication) => {
    setCitizenApplications((prev) => [application, ...prev]);
    setCitizenView("dashboard");
    toast.success("Application submitted successfully to real-time database");
  };

  const handleViewApplicationDetail = (application: CitizenApplication) => {
    setSelectedApplication(application);
    setCitizenView("applicationDetail");
  };

  const cycleRole = () => {
    setRole((prev) => {
      if (prev === "admin") return "officer";
      if (prev === "officer") return "citizen";
      return "admin";
    });
    // Reset views when switching roles
    if (role === "citizen") {
      setCitizenView("dashboard");
    }
  };

  // If citizen role, show citizen portal
  if (role === "citizen") {
    return (
      <div className="min-h-screen bg-background">
        {/* Citizen Header */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-wide">LANDGUARD AI</h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Citizen Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={cycleRole}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                <span className="capitalize">{role}</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Citizen Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">
            {citizenView === "dashboard" && (
              <CitizenDashboard
                applications={citizenApplications}
                onNewApplication={() => setCitizenView("newApplication")}
                onViewDetails={handleViewApplicationDetail}
              />
            )}
            {citizenView === "newApplication" && (
              <NewApplicationFlow
                onSubmit={handleCitizenApplicationSubmit}
                onCancel={() => setCitizenView("dashboard")}
              />
            )}
            {citizenView === "applicationDetail" && selectedApplication && (
              <CitizenApplicationDetail
                application={selectedApplication}
                onBack={() => setCitizenView("dashboard")}
                onApplyAgain={() => setCitizenView("newApplication")}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 LandGuard AI - Government of India. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Admin/Officer view
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:transform-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        initial={false}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-wide">LANDGUARD AI</h1>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  Compliance Intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Footer Controls */}
          <div className="p-4 border-t border-border space-y-2">
            {/* Role Toggle */}
            <button
              onClick={cycleRole}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="capitalize">{role}</span>
              </div>
              <span className="text-xs text-muted-foreground">Switch</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span>{theme === "dark" ? "Dark" : "Light"}</span>
              </div>
              <span className="text-xs text-muted-foreground">Theme</span>
            </button>

            {/* System Status */}
            <div className="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              System Active
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <div>
                <h2 className="text-lg font-bold">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {activeTab === "dashboard" && "Overview of all compliance activities"}
                  {activeTab === "approval" && "Submit and verify new land applications"}
                  {activeTab === "satellite" &&
                    "Monitor construction via satellite imagery"}
                  {activeTab === "elevation" &&
                    "Analyze elevation changes for violations"}
                  {activeTab === "audit" && "Immutable blockchain audit trail"}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
              <User className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary capitalize">
                {role}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
              >
                {activeTab === "dashboard" && <DashboardOverview records={records} citizenApplications={citizenApplications} />}
                {activeTab === "approval" && (
                  <LandApproval onDecision={handleDecision} />
                )}
                {activeTab === "satellite" && (
                  <SatelliteMonitoring complianceApproved={lastApproval} />
                )}
                {activeTab === "elevation" && <ElevationAnalysis />}
                {activeTab === "audit" && <AdminDashboard records={records} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
              <p>© 2026 LandGuard AI. All rights reserved.</p>
              <p className="font-mono">
                Last updated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
