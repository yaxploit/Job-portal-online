import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Menu, 
  X, 
  User,
  Briefcase, 
  LogOut,
  FileText, 
  Building
} from "lucide-react";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/");
  };

  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    
    const nameParts = user.name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  const getDashboardLink = () => {
    return user?.userType === "seeker" ? "/dashboard/seeker" : "/dashboard/employer";
  };

  const getProfileLink = () => {
    return user?.userType === "seeker" ? "/profile/seeker" : "/profile/employer";
  };

  const getApplicationsLink = () => {
    return user?.userType === "seeker" ? "/applications/seeker" : null;
  };

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
              {user && (
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" className={location.includes("/dashboard") ? "text-primary-600" : ""}>
                    Dashboard
                  </Button>
                </Link>
              )}
              {user?.userType === "employer" && (
                <Link href="/jobs/post">
                  <Button variant="ghost" className={location === "/jobs/post" ? "text-primary-600" : ""}>
                    Post Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-neutral-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation(getDashboardLink())}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation(getProfileLink())}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  {user.userType === "seeker" && getApplicationsLink() && (
                    <DropdownMenuItem onClick={() => setLocation(getApplicationsLink()!)}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>My Applications</span>
                    </DropdownMenuItem>
                  )}
                  {user.userType === "employer" && (
                    <DropdownMenuItem onClick={() => setLocation("/jobs/post")}>
                      <Building className="mr-2 h-4 w-4" />
                      <span>Post a Job</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation("/auth")}>
                  Log In
                </Button>
                <Button onClick={() => setLocation("/auth")}>
                  Sign Up
                </Button>
              </>
            )}
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
          {user && (
            <Link href={getDashboardLink()}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${location.includes("/dashboard") ? "text-primary-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Button>
            </Link>
          )}
          {user?.userType === "employer" && (
            <Link href="/jobs/post">
              <Button
                variant="ghost"
                className={`w-full justify-start ${location === "/jobs/post" ? "text-primary-600" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Post Job
              </Button>
            </Link>
          )}
        </div>

        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <>
              <div className="flex items-center px-4 py-2">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">{user.name}</div>
                  <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setLocation(getProfileLink());
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
                {user.userType === "seeker" && getApplicationsLink() && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setLocation(getApplicationsLink()!);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    My Applications
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
}
