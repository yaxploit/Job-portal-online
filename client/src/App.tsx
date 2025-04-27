import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import SeekerDashboard from "@/pages/dashboard/seeker-dashboard";
import EmployerDashboard from "@/pages/dashboard/employer-dashboard";
import JobListingPage from "@/pages/jobs/job-listing";
import JobDetail from "@/pages/jobs/job-detail";
import PostJob from "@/pages/jobs/post-job";
import SeekerProfile from "@/pages/profile/seeker-profile";
import EmployerProfile from "@/pages/profile/employer-profile";
import SeekerApplications from "@/pages/applications/seeker-applications";
import EmployerApplications from "@/pages/applications/employer-applications";
import AdminLogin from "@/pages/admin/admin-login";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import NotFound from "@/pages/not-found";
import Preloader from "@/components/ui/preloader";
import Footer from "@/components/layout/footer";

// Simplified routing - no auth restrictions for testing
function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/jobs" component={JobListingPage} />
      <Route path="/jobs/:id" component={JobDetail} />
      
      {/* Seeker routes */}
      <Route path="/dashboard/seeker" component={SeekerDashboard} />
      <Route path="/profile/seeker" component={SeekerProfile} />
      <Route path="/applications/seeker" component={SeekerApplications} />
      
      {/* Employer routes */}
      <Route path="/dashboard/employer" component={EmployerDashboard} />
      <Route path="/profile/employer" component={EmployerProfile} />
      <Route path="/jobs/post" component={PostJob} />
      <Route path="/applications/employer/:jobId" component={EmployerApplications} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize local storage
  useEffect(() => {
    // Initialize local auth data
    try {
      import("@/lib/local-auth").then(({ initLocalAuth }) => {
        initLocalAuth();
      });
      
      // Initialize local jobs data
      import("@/lib/local-jobs").then(({ initLocalJobs }) => {
        initLocalJobs();
      });
    } catch (error) {
      console.error("Error initializing local data:", error);
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Preloader />
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Router />
          </div>
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
