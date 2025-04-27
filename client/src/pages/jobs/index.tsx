import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, MapPin, ChevronDown, Filter, X, ChevronLeft } from "lucide-react";
import { getJobs, getFilteredJobs } from "@/lib/local-jobs";

// Job Listing Component
const JobCard = ({ job }: { job: any }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.company || 'Unknown Company'}</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 font-bold">
          {(job.company && job.company.charAt(0)) || 'C'}
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-gray-500 text-sm">
        <MapPin className="h-4 w-4 mr-1" />
        <span>{job.location || 'Remote'}</span>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {job.type || job.jobType || 'Full-time'}
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
          {job.salary || (job.salaryMin && job.salaryMax ? `₹${job.salaryMin/100000} - ₹${job.salaryMax/100000} LPA` : '₹Competitive')}
        </span>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Posted {job.createdAt || job.postedAt ? 
            (typeof job.createdAt === 'string' ? job.createdAt : 
             typeof job.postedAt === 'string' ? 
               new Date(job.postedAt).toLocaleDateString('en-IN') : 'Recently') : 
            'Recently'}
        </span>
        <Link href={`/jobs/${job.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

// Job Filter Component
const JobFilter = ({ 
  jobType, 
  setJobType, 
  onApplyFilters, 
  onClearFilters 
}: { 
  jobType: string, 
  setJobType: (type: string) => void, 
  onApplyFilters: () => void, 
  onClearFilters: () => void 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button 
          onClick={onClearFilters}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="space-y-5">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="job-type" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                checked={jobType === ""}
                onChange={() => setJobType("")}
              />
              <span className="ml-2 text-sm text-gray-600">All Types</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="job-type" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                checked={jobType === "Full-time"}
                onChange={() => setJobType("Full-time")}
              />
              <span className="ml-2 text-sm text-gray-600">Full-time</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="job-type" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                checked={jobType === "Part-time"}
                onChange={() => setJobType("Part-time")}
              />
              <span className="ml-2 text-sm text-gray-600">Part-time</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="job-type" 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                checked={jobType === "Contract"}
                onChange={() => setJobType("Contract")}
              />
              <span className="ml-2 text-sm text-gray-600">Contract</span>
            </label>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h4>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue=""
          >
            <option value="">Any</option>
            <option value="0-500000">₹0 - ₹5,00,000</option>
            <option value="500000-1000000">₹5,00,000 - ₹10,00,000</option>
            <option value="1000000-1500000">₹10,00,000 - ₹15,00,000</option>
            <option value="1500000-2000000">₹15,00,000 - ₹20,00,000</option>
            <option value="2000000+">₹20,00,000+</option>
          </select>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md"
            defaultValue=""
          >
            <option value="">Any</option>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        
        <div className="pt-2">
          <button 
            onClick={onApplyFilters}
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Jobs Page
export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  
  // Load jobs
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      const allJobs = getJobs();
      setJobs(allJobs);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Apply filters
  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filteredJobs = getFilteredJobs({
        keyword: searchTerm,
        jobType: jobType,
        location: location
      });
      setJobs(filteredJobs);
      setIsLoading(false);
    }, 300);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setJobType("");
    setLocation("");
    
    setIsLoading(true);
    setTimeout(() => {
      const allJobs = getJobs();
      setJobs(allJobs);
      setIsLoading(false);
    }, 300);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to home link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
      </div>
      
      {/* Page Header */}
      <header className="py-8 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
          <p className="mt-2 text-lg text-gray-600">Browse through thousands of job opportunities</p>
          
          {/* Search Bar */}
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Job title, keyword, or company"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            
            <div className="relative md:w-64">
              <input
                type="text"
                placeholder="Location"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            
            <button 
              onClick={applyFilters}
              className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sort controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Found <span className="font-medium">{jobs.length}</span> job opportunities
            </p>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <div className="relative">
                <select
                  className="appearance-none pl-3 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  defaultValue="newest"
                >
                  <option value="newest">Most Recent</option>
                  <option value="salary-high">Highest Salary</option>
                  <option value="salary-low">Lowest Salary</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
                <ChevronDown className="h-4 w-4 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <JobFilter 
                jobType={jobType}
                setJobType={setJobType}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
              />
            </div>
            
            {/* Job Listings */}
            <div className="lg:col-span-3">
              {isLoading ? (
                // Loading state
                <div className="grid grid-cols-1 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                      <div className="flex justify-between">
                        <div className="w-3/4">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                        </div>
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                      </div>
                      <div className="mt-4 h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="mt-4 flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="mt-6 flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                // Jobs list
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                // No jobs found
                <div className="bg-white p-10 rounded-lg shadow-sm text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Search className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
                  <p className="mt-2 text-gray-500">
                    We couldn't find any jobs matching your search criteria.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}