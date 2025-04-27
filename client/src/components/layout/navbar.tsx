import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Simple navbar that doesn't rely on auth context
  // This is a temporary workaround until we properly set up the AuthProvider hierarchy
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary-600 text-xl font-bold">JobNexus</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" className={location === "/" ? "text-primary-600" : ""}>
                  Home
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="ghost" className={location === "/jobs" || location.startsWith("/jobs/") ? "text-primary-600" : ""}>
                  Jobs
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Button variant="ghost" onClick={() => setLocation("/auth")}>
              Log In
            </Button>
            <Button onClick={() => setLocation("/auth")}>
              Sign Up
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden bg-white border-t`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full justify-start ${location === "/" ? "text-primary-600" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Button>
          </Link>
          <Link href="/jobs">
            <Button
              variant="ghost"
              className={`w-full justify-start ${location === "/jobs" || location.startsWith("/jobs/") ? "text-primary-600" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Button>
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="space-y-1 px-4">
            <Button
              className="w-full mb-2"
              onClick={() => {
                setLocation("/auth");
                setMobileMenuOpen(false);
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setLocation("/auth");
                setMobileMenuOpen(false);
              }}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}