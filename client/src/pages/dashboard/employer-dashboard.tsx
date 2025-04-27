import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobListing, EmployerProfile } from "@shared/schema";
import JobStatistics from "@/components/dashboard/job-statistics";
import { AlertCircle, Building, Plus, User, FileText, Users, Briefcase } from "lucide-react";
import Footer from "@/components/layout/footer";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch employer profile
  const { data: profile, isLoading: profileLoading } = useQuery<EmployerProfile>({
    queryKey: ["/api/profile/employer"],
    queryFn: async () => {
      const res = await fetch("/api/profile/employer");
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  // Fetch employer job listings
  const { data: jobs, isLoading: jobsLoading } = useQuery<JobListing[]>({
    queryKey: ["/api/jobs", { employerId: user?.id }],
    queryFn: async () => {
      const res = await fetch(`/api/jobs?employerId=${user?.id}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    enabled: !!user,
  });

  // Dashboard stats
  const totalJobs = jobs?.length || 0;
  const activeJobs = jobs?.filter(job => job.isActive).length || 0;
  const draftJobs = jobs?.filter(job => !job.isActive).length || 0;
  const totalApplicants = jobs?.reduce((acc, job) => {
    // This would be implemented when we add applicant count to jobs
    return acc + (job.applicantCount || 0);
  }, 0) || 0;

  const profileComplete = !!profile;
  const companyName = profile?.companyName || user?.name;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">
              {companyName ? `Welcome, ${companyName}` : 'Welcome to Your Dashboard'}
            </h1>
            <p className="text-neutral-600">Manage your job listings and applicants</p>
          </div>

          {!profileComplete && (
            <Card className="mb-6 border-yellow-300 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-yellow-800 font-medium">Complete your company profile to attract better candidates</p>
                  <p className="text-yellow-700 text-sm">Job seekers want to learn more about your company</p>
                </div>
                <Button 
                  onClick={() => setLocation("/profile/employer")} 
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
                    <p className="text-sm font-medium text-neutral-500">Total Job Listings</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{totalJobs}</p>
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
                    <p className="text-sm font-medium text-neutral-500">Active Jobs</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{activeJobs}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Draft Jobs</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{draftJobs}</p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Applicants</p>
                    <p className="text-3xl font-bold text-neutral-900 mt-1">{totalApplicants}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle>Job Activity</CardTitle>
                  <CardDescription>Overview of your job listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <JobStatistics 
                    data={jobs || []} 
                    isLoading={jobsLoading} 
                    type="employer"
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
                      variant="default" 
                      onClick={() => setLocation("/jobs/post")}
                      className="w-full justify-start"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Post New Job
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation("/profile/employer")}
                      className="w-full justify-start"
                    >
                      <Building className="mr-2 h-4 w-4" />
                      {profileComplete ? "Update Company Profile" : "Complete Company Profile"}
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
                  <CardTitle>Your Job Listings</CardTitle>
                  <CardDescription>Manage your active job listings</CardDescription>
                </div>
                <Button 
                  onClick={() => setLocation("/jobs/post")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex border rounded-lg p-4">
                      <div className="flex-1">
                        <div className="h-5 bg-neutral-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                        <div className="flex gap-2">
                          <div className="h-4 bg-neutral-200 rounded w-16"></div>
                          <div className="h-4 bg-neutral-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-neutral-200 rounded w-20"></div>
                        <div className="h-8 bg-neutral-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex justify-between items-center border rounded-lg p-4 hover:bg-neutral-50">
                      <div>
                        <h3 className="font-medium text-neutral-900">{job.title}</h3>
                        <p className="text-sm text-neutral-500">
                          {job.location} • {job.jobType}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {job.isActive ? 'Active' : 'Draft'}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                            {job.applicantCount || 0} Applicants
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/applications/employer/${job.id}`)}
                        >
                          View Applicants
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/jobs/${job.id}`)}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Briefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No job listings yet</h3>
                  <p className="text-neutral-500 mb-4">Get started by posting your first job listing</p>
                  <Button 
                    onClick={() => setLocation("/jobs/post")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
