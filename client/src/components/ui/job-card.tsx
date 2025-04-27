import { JobListing } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/hooks/use-auth";

interface JobCardProps {
  job: JobListing;
  showApplyButton?: boolean;
}

export default function JobCard({ job, showApplyButton = true }: JobCardProps) {
  // Use useContext directly to avoid error when context is null
  const auth = useContext(AuthContext);
  const user = auth?.user || null;
  const [, setLocation] = useLocation();

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setLocation("/auth");
    } else {
      setLocation(`/jobs/${job.id}`);
    }
  };

  const handleCardClick = () => {
    setLocation(`/jobs/${job.id}`);
  };

  // Format posted date
  const getPostedDate = (dateString: string | Date) => {
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    } else {
      return format(postedDate, "MMM dd, yyyy");
    }
  };

  // Generate company logo placeholder if no image
  const getCompanyInitials = () => {
    // employerName might be added by the server but not in the schema
    // so we need to use this approach to avoid TypeScript errors
    const name = (job as any).employerName || "Company";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div 
      className="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">{job.title}</h3>
            <p className="text-neutral-600 text-sm mb-3">{(job as any).employerName || "Company Name"}</p>
          </div>
          <div className="h-12 w-12 bg-neutral-100 rounded-md flex items-center justify-center">
            <span className="text-neutral-700 font-bold text-sm">{getCompanyInitials()}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`inline-block ${
            job.jobType === "full-time" 
              ? "bg-primary-50 text-primary-700" 
              : job.jobType === "remote" 
                ? "bg-green-50 text-green-700"
                : job.jobType === "contract"
                  ? "bg-purple-50 text-purple-700"
                  : "bg-amber-50 text-amber-700"
          } px-2.5 py-0.5 rounded-full text-xs font-medium`}>
            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
          </span>
          
          {job.skills && job.skills.slice(0, 2).map((skill, index) => (
            <span 
              key={index} 
              className="inline-block bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          
          {job.skills && job.skills.length > 2 && (
            <span className="inline-block bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
              +{job.skills.length - 2} more
            </span>
          )}
        </div>
        
        <div className="mt-4 text-sm text-neutral-600 space-y-2">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-neutral-500 mr-2 mt-0.5 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          
          {job.salaryMin && job.salaryMax && (
            <div className="flex items-start">
              <DollarSign className="h-4 w-4 text-neutral-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} per year</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          {showApplyButton && user?.userType === "seeker" ? (
            <Button 
              variant="outline" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              onClick={handleApplyClick}
            >
              Apply Now
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              onClick={handleCardClick}
            >
              View Details
            </Button>
          )}
          <span className="text-xs text-neutral-500">Posted {job.postedAt ? getPostedDate(job.postedAt) : "Recently"}</span>
        </div>
      </div>
    </div>
  );
}
