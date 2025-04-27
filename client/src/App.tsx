import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

import { ProtectedRoute } from "./lib/protected-route";
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
import NotFound from "@/pages/not-found";
import Preloader from "@/components/ui/preloader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/jobs" component={JobListingPage} />
      <Route path="/jobs/:id" component={JobDetail} />
      
      {/* Seeker routes */}
      <ProtectedRoute path="/dashboard/seeker" userType="seeker" component={SeekerDashboard} />
      <ProtectedRoute path="/profile/seeker" userType="seeker" component={SeekerProfile} />
      <ProtectedRoute path="/applications/seeker" userType="seeker" component={SeekerApplications} />
      
      {/* Employer routes */}
      <ProtectedRoute path="/dashboard/employer" userType="employer" component={EmployerDashboard} />
      <ProtectedRoute path="/profile/employer" userType="employer" component={EmployerProfile} />
      <ProtectedRoute path="/jobs/post" userType="employer" component={PostJob} />
      <ProtectedRoute path="/applications/employer/:jobId" userType="employer" component={EmployerApplications} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider>
        <Preloader />
        <Toaster />
        <Router />
        <div className="creator-tag animate-fade-in">Created by yaxploit</div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
