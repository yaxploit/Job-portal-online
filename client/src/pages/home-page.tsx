import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { JobListing } from "@shared/schema";
import JobCard from "@/components/ui/job-card";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Search, MapPin, Briefcase } from "lucide-react";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");
  
  // Try to use auth, but handle the case when it's not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth context not available, continuing without user data");
  }
  
  // Fetch featured job listings
  const { data: jobs, isLoading: jobsLoading } = useQuery<JobListing[]>({
    queryKey: ["/api/jobs", { limit: 6 }],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/jobs?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  const handleDashboardNavigation = () => {
    if (user) {
      if (user.userType === "seeker") {
        setLocation("/dashboard/seeker");
      } else {
        setLocation("/dashboard/employer");
      }
    } else {
      setLocation("/auth");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                Find Your Dream Job Today
              </h1>
              <p className="mt-4 text-xl text-neutral-500">
                Connect with top employers and discover opportunities that match your skills and career goals.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Job title, skills, or keywords"
                    className="pl-10 pr-4 py-6 w-full"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <Search className="h-5 w-5 text-neutral-400 absolute left-3 top-3" />
                </div>
                <Button type="submit" className="py-6">Search Jobs</Button>
              </form>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">Engineering</span>
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">Marketing</span>
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">Design</span>
                <span className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm font-medium">Full-time</span>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <img 
                className="mx-auto rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                alt="People working in an office environment"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-neutral-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Why Choose JobNexus?</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Our platform connects talented job seekers with top employers around the world.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Personalized Job Matches</h3>
              <p className="text-neutral-600">Our intelligent matching system helps you discover jobs aligned with your skills and career goals.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Simple Application Process</h3>
              <p className="text-neutral-600">Apply to multiple jobs with a single profile and track your application status in real-time.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Direct Employer Connection</h3>
              <p className="text-neutral-600">Connect directly with hiring managers and recruiters without intermediaries.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Jobs Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Popular Job Listings</h2>
            <Link href="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
              View all jobs →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobsLoading ? (
              // Loading state
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white border border-neutral-200 rounded-lg p-5 animate-pulse">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-5 bg-neutral-200 rounded w-16"></div>
                    <div className="h-5 bg-neutral-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-neutral-200 rounded w-20"></div>
                    <div className="h-4 bg-neutral-200 rounded w-24"></div>
                  </div>
                </div>
              ))
            ) : jobs && jobs.length > 0 ? (
              jobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} showApplyButton={false} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neutral-500">No job listings available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Employer CTA */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Are you hiring?</span>
            <span className="block text-primary-200">Post a job and find top talent today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button 
                variant="secondary" 
                onClick={() => user?.userType === "employer" ? setLocation("/jobs/post") : setLocation("/auth")}
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium"
              >
                Post a Job
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button 
                variant="default"
                onClick={handleDashboardNavigation} 
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium"
              >
                {user ? "Go to Dashboard" : "Sign Up"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
