import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListing, JobApplication, SeekerProfile } from "@shared/schema";
import JobStatistics from "@/components/dashboard/job-statistics";
import RecentApplications from "@/components/dashboard/recent-applications";
import { Briefcase, FilePlus, PlusCircle, User, AlertCircle } from "lucide-react";
import Footer from "@/components/layout/footer";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch seeker profile
  const { data: profile, isLoading: profileLoading } = useQuery<SeekerProfile>({
    queryKey: ["/api/profile/seeker"],
    queryFn: async () => {
      const res = await fetch("/api/profile/seeker");
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  // Fetch job applications
  const { data: applications, isLoading: applicationsLoading } = useQuery<(JobApplication & { job: JobListing })[]>({
    queryKey: ["/api/applications/seeker"],
    queryFn: async () => {
      const res = await fetch("/api/applications/seeker");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
  });

  // Dashboard stats
  const totalApplications = applications?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === "applied" || app.status === "reviewing").length || 0;
  const interviewApplications = applications?.filter(app => app.status === "interview").length || 0;
  const completedApplications = applications?.filter(app => app.status === "accepted" || app.status === "rejected").length || 0;

  const profileComplete = !!profile;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">
              {user?.name ? `Welcome, ${user.name}` : 'Welcome to Your Dashboard'}
            </h1>
            <p className="text-neutral-600">Manage your job search and applications</p>
          </div>

          {!profileComplete && (
            <Card className="mb-6 border-yellow-300 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">Complete your profile to improve your job matches</p>
                  <p className="text-yellow-700 text-sm">Employers want to learn more about you</p>
                </div>
                <Button 
                  onClick={() => setLocation("/profile/seeker")} 
                  className="ml-auto"
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Applications</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{totalApplications}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Pending Review</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{pendingApplications}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FilePlus className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Interviews</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{interviewApplications}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Completed</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{completedApplications}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle>Application Activity</CardTitle>
                  <CardDescription>Your application status over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <JobStatistics 
                    data={applications || []} 
                    isLoading={applicationsLoading} 
                    type="seeker"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Things you can do now</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/jobs")}
                      className="w-full justify-start"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Browse Jobs
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/profile/seeker")}
                      className="w-full justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {profileComplete ? "Update Profile" : "Complete Profile"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/applications/seeker")}
                      className="w-full justify-start"
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      View All Applications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest job applications</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setLocation("/applications/seeker")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RecentApplications 
                applications={applications || []} 
                isLoading={applicationsLoading} 
                limit={5}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
