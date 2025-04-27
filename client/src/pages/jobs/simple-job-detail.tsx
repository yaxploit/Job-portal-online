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
  Loader2
} from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function SimpleJobDetail() {
  const { id } = useParams();
  const jobId = id ? parseInt(id) : 0;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  
  // Fetch job and user on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load job
        const jobData = await getJobById(jobId);
        setJob(jobData);
        
        // Load user
        const userData = getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load job details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [jobId, toast]);
  
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setApplicationSubmitted(true);
      setShowApplicationForm(false);
      
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully.",
      });
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-neutral-50 py-8">
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
        <Footer />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-neutral-50 py-8">
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
        <Footer />
      </div>
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
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
                        
                        <div className="flex justify-end space-x-2 mt-6">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowApplicationForm(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={submitting}
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
      <Footer />
    </div>
  );
}