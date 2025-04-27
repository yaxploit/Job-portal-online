import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, Briefcase, MapPin, Clock, ChevronRight, Filter, X } from "lucide-react";

// Sample job data for demo (same as homepage)
const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Mumbai, India",
    salary: "₹8,00,000 - ₹15,00,000",
    type: "Full-time",
    createdAt: "2 days ago"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "DesignHub",
    location: "Bangalore, India",
    salary: "₹7,00,000 - ₹12,00,000",
    type: "Full-time",
    createdAt: "1 day ago"
  },
  {
    id: 3,
    title: "React Native Developer",
    company: "MobileApps Inc",
    location: "Delhi, India",
    salary: "₹10,00,000 - ₹18,00,000",
    type: "Full-time",
    createdAt: "Just now"
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "DataCorp",
    location: "Hyderabad, India",
    salary: "₹6,00,000 - ₹9,00,000",
    type: "Part-time",
    createdAt: "3 days ago"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Pune, India",
    salary: "₹12,00,000 - ₹20,00,000",
    type: "Remote",
    createdAt: "1 week ago"
  },
  {
    id: 6,
    title: "Social Media Manager",
    company: "MarketingPro",
    location: "Chennai, India",
    salary: "₹5,00,000 - ₹8,00,000",
    type: "Contract",
    createdAt: "2 days ago"
  }
];

// Add more job listings
const allJobs = [
  ...sampleJobs,
  {
    id: 7,
    title: "Backend Developer",
    company: "ServerTech",
    location: "Kolkata, India",
    salary: "₹9,00,000 - ₹16,00,000",
    type: "Full-time",
    createdAt: "5 days ago"
  },
  {
    id: 8,
    title: "Product Manager",
    company: "ProductCorp",
    location: "Bengaluru, India",
    salary: "₹15,00,000 - ₹25,00,000",
    type: "Full-time",
    createdAt: "1 week ago"
  },
  {
    id: 9,
    title: "Marketing Specialist",
    company: "BrandGrowth",
    location: "Delhi, India",
    salary: "₹6,00,000 - ₹10,00,000",
    type: "Full-time",
    createdAt: "3 days ago"
  },
  {
    id: 10,
    title: "Data Scientist",
    company: "AnalyticsCorp",
    location: "Hyderabad, India",
    salary: "₹12,00,000 - ₹20,00,000",
    type: "Full-time",
    createdAt: "4 days ago"
  },
  {
    id: 11,
    title: "QA Engineer",
    company: "QualityTech",
    location: "Pune, India",
    salary: "₹7,00,000 - ₹12,00,000",
    type: "Full-time",
    createdAt: "1 week ago"
  },
  {
    id: 12,
    title: "Technical Writer",
    company: "DocuTech",
    location: "Mumbai, India",
    salary: "₹5,00,000 - ₹8,00,000",
    type: "Remote",
    createdAt: "2 weeks ago"
  }
];

// Job card component
const JobCard = ({ job }: { job: any }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
          {job.company.charAt(0)}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Briefcase className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.type}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{job.createdAt}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-800 font-medium">{job.salary}</span>
        <Link href={`/auth`} className="text-blue-600 hover:text-blue-800 flex items-center">
          Apply Now
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter jobs based on search term and filters
  useEffect(() => {
    let result = allJobs;
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }
    
    // Apply job type filter
    if (jobType !== "All") {
      result = result.filter(job => job.type === jobType);
    }
    
    // Apply location filter
    if (location !== "All") {
      result = result.filter(job => job.location.includes(location));
    }
    
    setFilteredJobs(result);
  }, [searchTerm, jobType, location]);
  
  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the filtering
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setJobType("All");
    setLocation("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">JobNexus</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/jobs" className="text-blue-600 hover:text-blue-800">Jobs</Link>
              <Link href="/auth" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Login / Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Search and filter section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Your Perfect Job</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Job title, company, or keyword"
                className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden py-3 px-6 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 flex items-center justify-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            <button 
              type="submit" 
              className="py-3 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Search Jobs
            </button>
          </form>
          
          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden bg-gray-50 p-4 rounded-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="All">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="All">All Locations</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-blue-600 text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Desktop filters */}
          <div className="hidden md:flex items-center space-x-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="rounded-md border border-gray-300 py-2 px-3"
              >
                <option value="All">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-md border border-gray-300 py-2 px-3"
              >
                <option value="All">All Locations</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={resetFilters}
              className="text-blue-600 text-sm font-medium flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Job listings */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredJobs.length} Jobs Found
            {(searchTerm || jobType !== "All" || location !== "All") && (
              <span className="text-gray-500 font-normal"> based on your filters</span>
            )}
          </h2>
          <div className="text-sm text-gray-500">
            Sorted by: <span className="font-medium">Most Recent</span>
          </div>
        </div>
        
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any jobs matching your current filters.
            </p>
            <button
              onClick={resetFilters}
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      {/* Simple footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 JobNexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}