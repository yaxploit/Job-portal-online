import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import Footer from "@/components/layout/footer";

// Import these modules directly for initialization
import { initLocalAuth } from "@/lib/local-auth";
import { initLocalJobs } from "@/lib/local-jobs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
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
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Router />
          </div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
