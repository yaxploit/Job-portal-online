import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import UserAuthForm from "@/components/ui/user-auth-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [userType, setUserType] = useState<string>("seeker");

  // Redirect to appropriate dashboard if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      const dashboardPath = user.userType === "seeker" ? "/dashboard/seeker" : "/dashboard/employer";
      setLocation(dashboardPath);
    }
  }, [user, isLoading, setLocation]);

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
              <UserAuthForm mode="login" userType={userType} />
            </TabsContent>

            <TabsContent value="register">
              <UserAuthForm mode="register" userType={userType} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right column - Hero/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-primary-700">
        <div className="flex flex-col justify-center px-8 py-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-extrabold text-white">
              {userType === "seeker" 
                ? "Find Your Dream Job Today"
                : "Find Top Talent For Your Company"
              }
            </h2>
            <p className="mt-4 text-lg text-primary-200">
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
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Browse thousands of job listings</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Create a professional profile</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Track your application status</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Post and manage job listings</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">Review applicant profiles</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-primary-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
