import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Briefcase, MapPin, Clock, ChevronRight } from "lucide-react";

// Sample job data for demo
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

// Simple job card component
const SimpleJobCard = ({ job }: { job: any }) => {
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

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Search for: ${searchKeyword}`);
    // In a real app, this would redirect to the jobs page with the search term
  };

  return (
    <div className="min-h-screen">
      {/* Simple Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">JobNexus</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900">Jobs</Link>
              <Link href="/auth" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Login / Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="mb-10 lg:mb-0">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Find Your Dream Job Today
              </h1>
              <p className="mt-4 text-xl opacity-90">
                Connect with top employers and discover opportunities that match your skills and career goals.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Job title, skills, or keywords"
                    className="pl-10 pr-4 py-3 w-full rounded-md border-0 shadow-sm"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                </div>
                <button 
                  type="submit" 
                  className="py-3 px-6 bg-indigo-900 text-white font-medium rounded-md hover:bg-indigo-800 transition-colors"
                >
                  Search Jobs
                </button>
              </form>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">Engineering</span>
                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">Marketing</span>
                <span className="inline-block bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium">Design</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="bg-white p-8 rounded-lg shadow-xl transform -rotate-3">
                <img
                  className="rounded-lg"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Team working together"
                />
              </div>
              <div className="absolute top-1/4 -right-8 bg-yellow-400 p-4 rounded-lg shadow-lg transform rotate-6">
                <div className="text-black font-bold">10,000+ Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose JobNexus?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects talented job seekers with top employers around the world.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-6">
                <Briefcase className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Job Matches</h3>
              <p className="text-gray-600">Our intelligent matching system helps you discover jobs aligned with your skills and career goals.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simple Application Process</h3>
              <p className="text-gray-600">Apply to multiple jobs with a single profile and track your application status in real-time.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Employer Connection</h3>
              <p className="text-gray-600">Connect directly with hiring managers and recruiters without intermediaries.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Listings Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Job Opportunities</h2>
              <p className="mt-2 text-lg text-gray-600">Handpicked positions for top talent</p>
            </div>
            <Link href="/auth" className="mt-4 md:mt-0 text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View all jobs
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleJobs.map(job => (
              <SimpleJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="block">Ready to start your job search?</span>
              <span className="block opacity-90 text-2xl mt-1">Join thousands of job seekers today.</span>
            </h2>
            <p className="mt-4 max-w-lg opacity-90">
              Create your profile, find matching jobs, and connect with employers from top companies.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row lg:ml-8 lg:mt-0 lg:shrink-0">
            <Link 
              href="/auth" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md text-center hover:bg-gray-50 shadow-md"
            >
              Sign up for free
            </Link>
            <Link 
              href="/jobs" 
              className="mt-3 sm:mt-0 sm:ml-3 px-6 py-3 bg-blue-800 text-white font-medium rounded-md text-center hover:bg-blue-900 shadow-md"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join our growing community
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Thousands of companies and job seekers trust JobNexus every day
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-blue-600">10k+</div>
              <div className="mt-2 text-gray-600">Active jobs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-blue-600">5k+</div>
              <div className="mt-2 text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-blue-600">25k+</div>
              <div className="mt-2 text-gray-600">Job seekers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-blue-600">97%</div>
              <div className="mt-2 text-gray-600">Satisfaction rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
