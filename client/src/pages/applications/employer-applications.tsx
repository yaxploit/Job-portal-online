import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { JobListing, JobApplication, User, SeekerProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  UserCheck,
  ClipboardList,
  Search,
  Briefcase,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  FileText,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

// Extended interface for the application data with user and profile information
type ExtendedApplication = JobApplication & { 
  seeker?: User; 
  seekerProfile?: SeekerProfile;
};

export default function EmployerApplications() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<ExtendedApplication | null>(null);
  const [applicationDetailOpen, setApplicationDetailOpen] = useState(false);

  // Fetch job details
  const { data: job, isLoading: jobLoading } = useQuery<JobListing>({
    queryKey: [`/api/jobs/${jobId}`],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job details");
      return res.json();
    },
    enabled: !!jobId,
  });

  // Fetch applications for this job
  const { data: applications, isLoading: applicationsLoading } = useQuery<ExtendedApplication[]>({
    queryKey: [`/api/applications/job/${jobId}`],
    queryFn: async () => {
      const res = await fetch(`/api/applications/job/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch applications");
      return res.json();
    },
    enabled: !!jobId,
  });

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "The application status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/applications/job/${jobId}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter applications based on search term and status
  const filteredApplications = applications?.filter(app => {
    const seekerName = app.seeker?.name || "";
    const matchesSearch = searchTerm 
      ? seekerName.toLowerCase().includes(searchTerm.toLowerCase())
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
  
  const getStatusName = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  const formatDate = (date: Date | string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  const handleStatusChange = (applicationId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: applicationId, status: newStatus });
    // If the application details dialog is open and this is the selected application,
    // update the UI state immediately to show the change
    if (selectedApplication && selectedApplication.id === applicationId) {
      setSelectedApplication({
        ...selectedApplication,
        status: newStatus
      });
    }
  };

  const handleViewApplication = (application: ExtendedApplication) => {
    setSelectedApplication(application);
    setApplicationDetailOpen(true);
  };

  const getUserInitials = (name: string) => {
    if (!name) return "?";
    
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Loading state
  if (jobLoading || applicationsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-neutral-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-neutral-600">Loading applications...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If job doesn't exist or user doesn't have permission
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-neutral-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">Job Not Found</h2>
                  <p className="text-neutral-600 mb-6">The job listing you're looking for doesn't exist or you don't have permission to view it.</p>
                  <Button 
                    onClick={() => setLocation("/dashboard/employer")}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setLocation("/dashboard/employer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">{job.title} - Applications</h1>
            <p className="text-neutral-600">
              Review and manage candidates for this position
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="font-medium text-lg">Job Overview</h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Posted on {formatDate(job.postedAt)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="outline"
                    onClick={() => setLocation(`/jobs/${job.id}`)}
                  >
                    View Job Listing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="w-full md:w-auto">
              <div className="relative">
                <Input
                  placeholder="Search applicants..."
                  className="pl-10 pr-4 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-4 w-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-neutral-600 mr-2">
                {applications?.length || 0} Total Applicants
              </span>
            </div>
          </div>

          {applications?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">No applications yet</h3>
                  <p className="text-neutral-500 mb-4">
                    Your job posting hasn't received any applications yet. Check back later!
                  </p>
                  <Button onClick={() => setLocation("/dashboard/employer")}>
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Applicants</CardTitle>
                <CardDescription>
                  Review and manage candidate applications
                </CardDescription>
              </CardHeader>

              <Tabs
                defaultValue="all"
                value={activeStatus}
                onValueChange={setActiveStatus}
                className="w-full mt-4"
              >
                <div className="px-6">
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
                </div>

                <CardContent className="pt-0">
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
                </CardContent>
              </Tabs>
            </Card>
          )}

          {/* Application Detail Dialog */}
          <Dialog open={applicationDetailOpen} onOpenChange={setApplicationDetailOpen}>
            <DialogContent className="max-w-3xl">
              {selectedApplication && (
                <>
                  <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                      Review candidate information and update application status
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <Avatar className="h-16 w-16 hidden md:flex">
                        <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                          {getUserInitials(selectedApplication.seeker?.name || "")}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{selectedApplication.seeker?.name}</h3>
                        <p className="text-neutral-600">{selectedApplication.seekerProfile?.title || "Job Seeker"}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                            {getStatusIcon(selectedApplication.status)}
                            <span className="ml-1 capitalize">{selectedApplication.status}</span>
                          </span>
                          <span className="text-xs text-neutral-500">
                            Applied on {formatDate(selectedApplication.appliedAt)}
                          </span>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {selectedApplication.seeker?.email}
                          </div>
                          {selectedApplication.seekerProfile?.phone && (
                            <div className="flex items-center text-sm text-neutral-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {selectedApplication.seekerProfile.phone}
                            </div>
                          )}
                          {selectedApplication.seekerProfile?.location && (
                            <div className="flex items-center text-sm text-neutral-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {selectedApplication.seekerProfile.location}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0">
                        <Select 
                          value={selectedApplication.status}
                          onValueChange={(value) => handleStatusChange(selectedApplication.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {selectedApplication.coverLetter && (
                      <div>
                        <h4 className="font-medium mb-2">Cover Letter</h4>
                        <Card className="bg-neutral-50">
                          <CardContent className="p-4">
                            <p className="text-sm whitespace-pre-line">{selectedApplication.coverLetter}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    
                    {selectedApplication.seekerProfile?.resume && (
                      <div>
                        <h4 className="font-medium mb-2">Resume</h4>
                        <Button 
                          variant="outline" 
                          className="flex items-center"
                          onClick={() => window.open(selectedApplication.seekerProfile?.resume, '_blank')}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Resume
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Skills Section */}
                    {selectedApplication.seekerProfile?.skills && selectedApplication.seekerProfile.skills.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.seekerProfile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Experience Section */}
                    {selectedApplication.seekerProfile?.experience && selectedApplication.seekerProfile.experience.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Experience</h4>
                        <div className="space-y-3">
                          {(selectedApplication.seekerProfile.experience as any[]).map((exp, index) => (
                            <div key={index} className="border rounded p-3">
                              <div className="flex justify-between">
                                <h5 className="font-medium">{exp.title}</h5>
                                <p className="text-sm text-neutral-500">
                                  {exp.startDate} - {exp.endDate || 'Present'}
                                </p>
                              </div>
                              <p className="text-neutral-600">{exp.company}</p>
                              {exp.location && <p className="text-sm text-neutral-500">{exp.location}</p>}
                              {exp.description && <p className="text-sm mt-2 whitespace-pre-line">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Education Section */}
                    {selectedApplication.seekerProfile?.education && selectedApplication.seekerProfile.education.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Education</h4>
                        <div className="space-y-3">
                          {(selectedApplication.seekerProfile.education as any[]).map((edu, index) => (
                            <div key={index} className="border rounded p-3">
                              <div className="flex justify-between">
                                <h5 className="font-medium">{edu.degree}</h5>
                                <p className="text-sm text-neutral-500">
                                  {edu.startDate} - {edu.endDate || 'Present'}
                                </p>
                              </div>
                              <p className="text-neutral-600">{edu.institution}</p>
                              {edu.fieldOfStudy && <p className="text-sm text-neutral-500">{edu.fieldOfStudy}</p>}
                              {edu.description && <p className="text-sm mt-2 whitespace-pre-line">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setApplicationDetailOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );

  function renderApplicationsList(apps: ExtendedApplication[]) {
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
          <div key={app.id} className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getUserInitials(app.seeker?.name || "")}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="font-medium text-neutral-900">{app.seeker?.name}</h3>
                <p className="text-sm text-neutral-600">{app.seekerProfile?.title || "Job Seeker"}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="ml-1 capitalize">{app.status}</span>
                  </span>
                  <span className="text-xs text-neutral-500">
                    Applied on {formatDate(app.appliedAt)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Select 
                value={app.status}
                onValueChange={(value) => handleStatusChange(app.id, value)}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                onClick={() => handleViewApplication(app)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
