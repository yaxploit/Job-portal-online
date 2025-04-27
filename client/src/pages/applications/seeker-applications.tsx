import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { JobApplication, JobListing } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck,
  ClipboardList,
  Search,
  Briefcase,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

export default function SeekerApplications() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  // Fetch job applications
  const { data: applications, isLoading } = useQuery<(JobApplication & { job: JobListing })[]>({
    queryKey: ["/api/applications/seeker"],
    queryFn: async () => {
      const res = await fetch("/api/applications/seeker");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
    enabled: !!user,
  });

  // Filter applications based on search term and status
  const filteredApplications = applications?.filter(app => {
    const matchesSearch = searchTerm 
      ? app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.job.employerName && app.job.employerName.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesStatus = activeStatus === "all" 
      ? true 
      : app.status === activeStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Group applications by status
  const applicationsByStatus = {
    applied: applications?.filter(app => app.status === "applied") || [],
    reviewing: applications?.filter(app => app.status === "reviewing") || [],
    interview: applications?.filter(app => app.status === "interview") || [],
    accepted: applications?.filter(app => app.status === "accepted") || [],
    rejected: applications?.filter(app => app.status === "rejected") || [],
  };

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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-neutral-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-neutral-600">Loading your applications...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">My Applications</h1>
            <p className="text-neutral-600">
              Track and manage your job applications
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Search applications..."
                  className="pl-10 pr-4 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/jobs")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Browse Jobs
            </Button>
          </div>

          {applications?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No applications yet</h3>
                  <p className="text-neutral-500 mb-4">
                    You haven't applied for any jobs yet. Start your job search today!
                  </p>
                  <Button onClick={() => setLocation("/jobs")}>
                    Browse Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Track the progress of your job applications
                </CardDescription>

                <Tabs
                  defaultValue="all"
                  value={activeStatus}
                  onValueChange={setActiveStatus}
                  className="w-full mt-4"
                >
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                    <TabsTrigger value="all">
                      All ({applications?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="applied">
                      Applied ({applicationsByStatus.applied.length})
                    </TabsTrigger>
                    <TabsTrigger value="reviewing">
                      Reviewing ({applicationsByStatus.reviewing.length})
                    </TabsTrigger>
                    <TabsTrigger value="interview">
                      Interview ({applicationsByStatus.interview.length})
                    </TabsTrigger>
                    <TabsTrigger value="accepted">
                      Accepted ({applicationsByStatus.accepted.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected ({applicationsByStatus.rejected.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    {renderApplicationsList(filteredApplications || [])}
                  </TabsContent>
                  <TabsContent value="applied" className="mt-0">
                    {renderApplicationsList(applicationsByStatus.applied)}
                  </TabsContent>
                  <TabsContent value="reviewing" className="mt-0">
                    {renderApplicationsList(applicationsByStatus.reviewing)}
                  </TabsContent>
                  <TabsContent value="interview" className="mt-0">
                    {renderApplicationsList(applicationsByStatus.interview)}
                  </TabsContent>
                  <TabsContent value="accepted" className="mt-0">
                    {renderApplicationsList(applicationsByStatus.accepted)}
                  </TabsContent>
                  <TabsContent value="rejected" className="mt-0">
                    {renderApplicationsList(applicationsByStatus.rejected)}
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );

  function renderApplicationsList(apps: (JobApplication & { job: JobListing })[]) {
    if (apps.length === 0) {
      return (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-neutral-500">No applications in this category</p>
        </div>
      );
    }

    return (
      <div className="divide-y">
        {apps.map((app) => (
          <div key={app.id} className="py-4 flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-lg text-neutral-900">{app.job.title}</h3>
              <p className="text-neutral-600">{app.job.employerName || "Company Name"}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  <span className="ml-1 capitalize">{app.status}</span>
                </span>
                <span className="text-xs text-neutral-500">
                  Applied on {formatDate(app.appliedAt)}
                </span>
                <span className="text-xs text-neutral-500">
                  {app.job.location}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation(`/jobs/${app.job.id}`)}
              >
                View Job
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
