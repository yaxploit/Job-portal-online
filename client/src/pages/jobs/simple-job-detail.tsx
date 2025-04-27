import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getJobById } from "@/lib/local-jobs";
import { getCurrentUser } from "@/lib/local-auth";
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock,
  Briefcase,
  CheckCircle,
  Loader2,
  Upload,
  FileText,
  AlertTriangle
} from "lucide-react";
import BaseLayout from "@/components/layout/base-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SimpleJobDetail() {
  // ----------- GETTING STARTED -----------
  // Get job ID from the URL parameter
  const { id } = useParams();
  const jobId = id ? parseInt(id) : 0;
  
  // Hook for navigating between pages
  const [, navigate] = useLocation();
  
  // Hook for showing notification messages
  const { toast } = useToast();
  
  // ----------- STATE MANAGEMENT -----------
  // Store job details and loading state
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Application form state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form fields
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  
  // ----------- DATA LOADING -----------
  // This runs when the page first loads
  useEffect(() => {
    // Function to load the job details and user info
    const fetchData = async () => {
      try {
        // Step 1: Load job details from our database
        const jobData = await getJobById(jobId);
        setJob(jobData);
        
        // Step 2: Get the current logged-in user (if any)
        const userData = getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Show error message if something goes wrong
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive"
        });
      } finally {
        // Always mark loading as complete
        setLoading(false);
      }
    };
    
    // Start loading data
    fetchData();
  }, [jobId, toast]);
  
  // ----------- FORM HANDLERS -----------
  
  // This function handles when a user uploads their resume file
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Step 1: Check if the user selected any files
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Step 2: Make sure the file isn't too big (5MB limit)
      // This prevents server overload and ensures quick uploads
      if (file.size > 5 * 1024 * 1024) {
        // Show an error message if file is too large
        toast({
          title: "File too large",
          description: "Resume file must be less than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      // Step 3: Make sure the file is a valid resume format (PDF or Word docs only)
      // This ensures the employer can open the resume
      if (!file.type.match('application/pdf') && 
          !file.type.match('application/msword') &&
          !file.type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        // Show an error message if wrong file type
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive"
        });
        return;
      }
      
      // Step 4: If all checks pass, save the resume file
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };
  
  // This function handles the entire job application submission
  const handleSubmitApplication = (e: React.FormEvent) => {
    // Step 1: Prevent the page from refreshing (default form behavior)
    e.preventDefault();
    
    // Step 2: Show loading state so user knows submission is in progress
    setSubmitting(true);
    
    // Step 3: Make sure a resume is attached (it's required)
    if (!resumeFile) {
      // Show error if no resume
      toast({
        title: "Resume required",
        description: "Please upload your resume before submitting",
        variant: "destructive"
      });
      setSubmitting(false);
      return;
    }
    
    // Step 4: Submit the application to our server
    // In this demo, we use a timeout to simulate server communication
    // In a real application, this would be an API call to our backend
    setTimeout(() => {
      // Log what would be sent to the server (for debugging)
      console.log("Application submitted with:", {
        jobId,
        userName: user?.username,
        email: user?.email,
        coverLetter,
        resumeFile: resumeFileName
      });
      
      // Step 5: Update the UI to show success
      setSubmitting(false);
      setApplicationSubmitted(true);
      setShowApplicationForm(false);
      
      // Step 6: Show a success message to the user
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully.",
      });
    }, 1500); // 1.5 second delay to simulate server processing
  };
  
  if (loading) {
    return (
      <BaseLayout>
        <div className="bg-neutral-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-neutral-600">Loading job details...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </BaseLayout>
    );
  }
  
  if (!job) {
    return (
      <BaseLayout>
        <div className="bg-neutral-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card>
              <CardContent className="p-6 text-center py-10">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">Job Not Found</h2>
                <p className="text-neutral-600 mb-6">
                  The job listing you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate("/jobs")}>
                  View All Jobs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </BaseLayout>
    );
  }
  
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Not specified";
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  
  return (
    <BaseLayout>
      {/* Responsive padding for all screen sizes */}
      <div className="bg-neutral-50 py-4 sm:py-6 md:py-8">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          {/* Job Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-start flex-wrap">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-2xl font-bold text-neutral-900 mb-1">{job.title}</h1>
                  <p className="text-neutral-600 mb-4">{job.company || "Company Name"}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-neutral-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{job.jobType}</span>
                    </div>
                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center text-neutral-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center text-neutral-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Posted {job.postedAt ? formatDate(job.postedAt) : "Recently"}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills && job.skills.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-block bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Job Description */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Application Section */}
          {applicationSubmitted ? (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-center text-green-800">Application Submitted!</CardTitle>
                <CardDescription className="text-center text-green-700">
                  Your application has been submitted successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-green-700">
                    Thanks for applying to <span className="font-semibold">{job.title}</span>. The hiring team will review your application and get back to you soon.
                  </p>
                  <div className="p-4 bg-white rounded-lg border border-green-200 text-neutral-700">
                    <h4 className="font-medium mb-2">What happens next?</h4>
                    <ol className="list-decimal list-inside text-sm space-y-1 text-left">
                      <li>Your application is now under review</li>
                      <li>You may receive an email with additional questions</li>
                      <li>Selected candidates will be invited for an interview</li>
                    </ol>
                  </div>
                  <div className="flex justify-center space-x-2 mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => navigate("/jobs")}
                    >
                      Browse More Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center mb-8">
              {!showApplicationForm ? (
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (!user) {
                      navigate("/auth");
                    } else {
                      setShowApplicationForm(true);
                    }
                  }}
                  className="mb-4"
                >
                  Apply for this Position
                </Button>
              ) : null}
              
              {showApplicationForm && user && (
                <Card className="w-full border-primary-200 mt-4">
                  <CardHeader>
                    <CardTitle className="text-center">Apply for {job.title}</CardTitle>
                    <CardDescription className="text-center">Please fill out the form below to apply</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitApplication}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Your Name</Label>
                          <Input 
                            id="name" 
                            defaultValue={user.username || ""} 
                            readOnly 
                            className="mt-1" 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue={user.email || ""} 
                            readOnly 
                            className="mt-1" 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="coverLetter">Cover Letter / Message</Label>
                          <Textarea 
                            id="coverLetter"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Tell the employer why you're a good fit for this position..."
                            className="mt-1"
                            rows={6}
                            required
                          />
                        </div>
                        
                        {/* Resume upload section */}
                        <div>
                          <Label htmlFor="resume">Upload Resume <span className="text-red-500">*</span></Label>
                          <div className="mt-1 border-2 border-dashed border-neutral-200 rounded-lg p-6 flex flex-col items-center justify-center">
                            {resumeFileName ? (
                              // Show file info when uploaded
                              <div className="w-full text-center">
                                <div className="flex items-center justify-center mb-2">
                                  <FileText className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-neutral-700 mb-1">
                                  {resumeFileName}
                                </p>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setResumeFile(null);
                                    setResumeFileName("");
                                  }}
                                  className="text-xs text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              // Show upload UI when no file
                              <>
                                <Upload className="h-10 w-10 text-neutral-400 mb-2" />
                                <p className="text-sm text-neutral-500 text-center mb-2">
                                  <span className="font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-neutral-400 text-center mb-4">
                                  PDF or Word document (max 5MB)
                                </p>
                                <Button 
                                  variant="outline" 
                                  className="relative"
                                  type="button"
                                >
                                  Browse files
                                  <input
                                    id="resume"
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleResumeUpload}
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  />
                                </Button>
                              </>
                            )}
                          </div>
                          {!resumeFile && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                Resume is required to apply for this position
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                        
                        {/* Form action buttons - stack on mobile, side by side on larger screens */}
                        <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowApplicationForm(false)}
                            className="w-full sm:w-auto"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Application"
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}