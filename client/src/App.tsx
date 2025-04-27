import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";

// Import these modules directly for initialization
import { initLocalAuth } from "@/lib/local-auth";
import { initLocalJobs } from "@/lib/local-jobs";

// Lazy load pages
const JobsPage = React.lazy(() => import("@/pages/jobs"));
const JobDetail = React.lazy(() => import("@/pages/jobs/simple-job-detail"));
const AdminDashboard = React.lazy(() => import("@/pages/admin"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/jobs/:id">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading job details...</div>}>
          <JobDetail />
        </React.Suspense>
      </Route>
      <Route path="/jobs">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading jobs...</div>}>
          <JobsPage />
        </React.Suspense>
      </Route>
      <Route path="/admin">
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <AdminDashboard />
        </React.Suspense>
      </Route>
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize data when app loads
  useEffect(() => {
    try {
      // Initialize local data 
      initLocalAuth();
      initLocalJobs();
      console.log("Local data initialized successfully");
    } catch (error) {
      console.error("Error initializing local data:", error);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Router />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
