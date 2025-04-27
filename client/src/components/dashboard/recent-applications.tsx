import { JobApplication, JobListing } from "@shared/schema";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck,
  ClipboardList 
} from "lucide-react";

interface RecentApplicationsProps {
  applications: (JobApplication & { job?: JobListing })[];
  isLoading: boolean;
  limit?: number;
}

export default function RecentApplications({ 
  applications, 
  isLoading,
  limit = 5
}: RecentApplicationsProps) {
  const [, setLocation] = useLocation();
  
  // Sort applications by date (newest first) and limit
  const sortedApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "reviewing":
        return <ClipboardList className="h-5 w-5 text-amber-500" />;
      case "interview":
        return <UserCheck className="h-5 w-5 text-purple-500" />;
      case "accepted":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-neutral-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-amber-100 text-amber-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <Skeleton className="h-5 w-60 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <ClipboardList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-1">No applications yet</h3>
        <p className="text-neutral-500 mb-4">
          You haven't applied for any jobs yet.
        </p>
        <Button onClick={() => setLocation("/jobs")}>
          Browse Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedApplications.map((application) => (
        <div 
          key={application.id} 
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900">
              {application.job?.title || "Job Title Not Available"}
            </h3>
            <p className="text-sm text-neutral-500">
              {application.job?.employerName || "Company Name"} • Applied on {formatDate(application.appliedAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="ml-1 capitalize">{application.status}</span>
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => application.job && setLocation(`/jobs/${application.job.id}`)}
            >
              View
            </Button>
          </div>
        </div>
      ))}
      
      {applications.length > limit && (
        <div className="text-center pt-4">
          <Button 
            variant="outline"
            onClick={() => setLocation("/applications/seeker")}
          >
            View All Applications
          </Button>
        </div>
      )}
    </div>
  );
}
