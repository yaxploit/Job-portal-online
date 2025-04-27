import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getCurrentUser } from "@/lib/local-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Simple authentication form component
const SimpleAuthForm = ({ mode, userType }: { mode: string, userType: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For testing purposes, simulate a login or registration
    setTimeout(() => {
      setIsLoading(false);
      if (userType === "seeker") {
        setLocation("/");
      } else {
        setLocation("/");
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Your name"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className="w-full rounded-md border border-gray-300 p-2"
          placeholder="Your username"
        />
      </div>
      
      {mode === "register" && (
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Your email"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-md border border-gray-300 p-2"
          placeholder="Your password"
        />
      </div>
      
      {mode === "register" && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full rounded-md border border-gray-300 p-2"
            placeholder="Confirm your password"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        {mode === "login" && (
          <>
            <div className="flex items-center">
              <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot password?
            </a>
          </>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 py-2 px-4 text-white rounded-md hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading
          ? 'Processing...'
          : mode === 'login'
            ? 'Sign In'
            : 'Create Account'
        }
      </button>
    </form>
  );
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<string>("seeker");
  
  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const dashboardPath = user.userType === "seeker" ? "/" : "/";
      setLocation(dashboardPath);
    }
  }, [setLocation]);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Left column - Auth form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900">JobNexus</h1>
            <p className="mt-2 text-sm text-neutral-600">
              {activeTab === "login" 
                ? "Sign in to your account to continue"
                : "Create an account to get started"
              }
            </p>
          </div>

          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <div className="mb-4">
              <div className="flex border border-neutral-300 rounded-md p-1 mb-4">
                <button 
                  className={`w-1/2 py-2 text-center rounded-md text-sm font-medium ${
                    userType === "seeker" 
                      ? "bg-primary text-white" 
                      : "text-neutral-700"
                  }`}
                  onClick={() => setUserType("seeker")}
                >
                  Job Seeker
                </button>
                <button 
                  className={`w-1/2 py-2 text-center rounded-md text-sm font-medium ${
                    userType === "employer" 
                      ? "bg-primary text-white" 
                      : "text-neutral-700"
                  }`}
                  onClick={() => setUserType("employer")}
                >
                  Employer
                </button>
              </div>
            </div>

            <TabsContent value="login">
              <SimpleAuthForm mode="login" userType={userType} />
            </TabsContent>

            <TabsContent value="register">
              <SimpleAuthForm mode="register" userType={userType} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right column - Hero/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-blue-700">
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold text-white">
              {userType === "seeker" 
                ? "Find Your Dream Job Today"
                : "Find Top Talent For Your Company"
              }
            </h2>
            <p className="mt-4 text-lg text-blue-200">
              {userType === "seeker"
                ? "Connect with top employers and discover opportunities that match your skills and career goals."
                : "Post job listings and connect with qualified candidates to build your team."
              }
            </p>
            <div className="mt-6">
              <ul className="space-y-4">
                {userType === "seeker" ? (
                  <>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Browse thousands of job listings</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Create a professional profile</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Track your application status</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Post and manage job listings</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Review applicant profiles</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Manage your company profile</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
