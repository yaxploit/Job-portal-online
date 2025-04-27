import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { JobListing as JobListingType } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import JobCard from "@/components/ui/job-card";
import JobFilter from "@/components/ui/job-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Briefcase, Filter } from "lucide-react";
import { AuthContext } from "@/hooks/use-auth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";

export default function JobListingPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  // Use useContext directly to safely access auth context
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [locationFilter, setLocationFilter] = useState(params.get('location') || '');
  const [jobType, setJobType] = useState(params.get('jobType') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse the search parameters
  useEffect(() => {
    setKeyword(params.get('keyword') || '');
    setLocationFilter(params.get('location') || '');
    setJobType(params.get('jobType') || '');
  }, [search, params]);

  // Import local jobs functions
  const [localJobs, setLocalJobs] = useState<JobListingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize and fetch jobs
  useEffect(() => {
    try {
      // Dynamically import to avoid issues with window/localStorage
      import("@/lib/local-jobs").then(({ initLocalJobs, getFilteredJobs }) => {
        // Initialize jobs
        initLocalJobs();
        
        // Get filtered jobs
        const filteredJobs = getFilteredJobs({
          keyword,
          location: locationFilter,
          jobType
        });
        
        setLocalJobs(filteredJobs);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Error loading jobs:", error);
      setIsLoading(false);
    }
  }, [keyword, locationFilter, jobType]);
  
  // Refetch function for consistent API
  const refetch = () => {
    setIsLoading(true);
    import("@/lib/local-jobs").then(({ getFilteredJobs }) => {
      const filteredJobs = getFilteredJobs({
        keyword,
        location: locationFilter,
        jobType
      });
      setLocalJobs(filteredJobs);
      setIsLoading(false);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't update URL to prevent actual page navigation
    // Instead, just refetch with the current filter values
    refetch();
    
    // Optional: Update URL without reloading
    const updateUrl = () => {
      // Build query string
      let newSearch = "?";
      if (keyword) newSearch += `keyword=${encodeURIComponent(keyword)}&`;
      if (locationFilter) newSearch += `location=${encodeURIComponent(locationFilter)}&`;
      if (jobType) newSearch += `jobType=${encodeURIComponent(jobType)}&`;
      
      // Remove trailing & if exists
      if (newSearch.endsWith("&")) {
        newSearch = newSearch.slice(0, -1);
      }
      
      // Replace current URL without reloading
      window.history.replaceState(
        {}, 
        '', 
        window.location.pathname + newSearch
      );
    };
    
    // Update URL without triggering reload
    updateUrl();
  };

  const clearFilters = () => {
    setKeyword('');
    setLocationFilter('');
    setJobType('');
    
    // Update URL without causing page navigation
    window.history.replaceState({}, '', '/jobs');
    
    // Refetch with cleared filters
    setTimeout(() => refetch(), 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Find Your Perfect Job</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Job title, skills, or keywords"
                className="pl-10 pr-4 py-6 w-full"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="h-5 w-5 text-neutral-400 absolute left-3 top-3" />
            </div>
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 pr-4 py-6 w-full"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
              <MapPin className="h-5 w-5 text-neutral-400 absolute left-3 top-3" />
            </div>
            <Button type="submit" className="py-6">Search Jobs</Button>
          </form>
        </div>
      </div>
      
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                {localJobs && localJobs.length > 0 ? `${localJobs.length} Jobs Found` : 'Job Listings'}
              </h2>
              {(keyword || locationFilter || jobType) && (
                <div className="flex gap-2 mt-1">
                  {keyword && (
                    <span className="text-sm text-neutral-500">
                      Keyword: {keyword}
                    </span>
                  )}
                  {locationFilter && (
                    <span className="text-sm text-neutral-500">
                      Location: {locationFilter}
                    </span>
                  )}
                  {jobType && (
                    <span className="text-sm text-neutral-500">
                      Type: {jobType}
                    </span>
                  )}
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile filter button */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Filter Jobs</h3>
                  <JobFilter 
                    jobType={jobType}
                    setJobType={(value) => {
                      setJobType(value);
                      // We need a timeout to ensure the state is updated before searching
                      setTimeout(() => {
                        const event = {preventDefault: () => {}} as React.FormEvent;
                        handleSearch(event);
                      }, 0);
                    }}
                    onApplyFilters={() => {
                      handleSearch({preventDefault: () => {}} as React.FormEvent);
                    }}
                    onClearFilters={clearFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Desktop filters sidebar */}
            <div className="hidden md:block">
              <div className="bg-white rounded-lg border p-4 sticky top-4">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Filter Jobs</h3>
                <JobFilter 
                  jobType={jobType}
                  setJobType={(value) => {
                    setJobType(value);
                    // We need a timeout to ensure the state is updated before searching
                    setTimeout(() => {
                      const event = {preventDefault: () => {}} as React.FormEvent;
                      handleSearch(event);
                    }, 0);
                  }}
                  onApplyFilters={() => {
                    handleSearch({preventDefault: () => {}} as React.FormEvent);
                  }}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>
            
            {/* Job listings */}
            <div className="md:col-span-3">
              {isLoading ? (
                // Loading state
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white border rounded-lg p-5 animate-pulse">
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
                        <div className="h-8 bg-neutral-200 rounded w-24"></div>
                        <div className="h-4 bg-neutral-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : localJobs && localJobs.length > 0 ? (
                <div className="space-y-4">
                  {localJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      showApplyButton={!!user && user.userType === "seeker"}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border rounded-lg p-8 text-center">
                  <Briefcase className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No jobs found</h3>
                  <p className="text-neutral-500 mb-4">Try adjusting your search filters</p>
                  <Button onClick={clearFilters}>Clear All Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
