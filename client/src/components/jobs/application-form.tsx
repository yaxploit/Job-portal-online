import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, User, Briefcase, Clock, CheckCircle, Loader2 } from "lucide-react";
import { JobListing } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  job: JobListing;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const STEPS = [
  { id: "personal", title: "Personal Info", icon: User },
  { id: "experience", title: "Experience", icon: Briefcase },
  { id: "questions", title: "Questions", icon: FileText },
  { id: "review", title: "Review", icon: CheckCircle },
];

export default function ApplicationForm({
  job,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal info
    fullName: "",
    email: "",
    phone: "",
    location: "",
    // Experience
    yearsOfExperience: "",
    currentCompany: "",
    currentRole: "",
    education: "",
    // Questions
    whyThisRole: "",
    salary: "",
    noticePeriod: "2 weeks",
    availability: "",
    // Cover letter
    coverLetter: "",
    // Resume details for review
    resumeFileName: "resume.pdf",
    resumeUpdated: true,
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };
  
  const handleNext = () => {
    // Simple validation based on current step
    if (currentStep === 0) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields to continue.",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 3) {
      // Submit the application
      onSubmit({
        jobId: job.id,
        coverLetter: formData.coverLetter,
        applicationDetails: formData,
      });
      setIsSubmitted(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Mumbai, India"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Select 
                value={formData.yearsOfExperience} 
                onValueChange={(value) => handleSelectChange("yearsOfExperience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currentCompany">Current/Last Company</Label>
              <Input
                id="currentCompany"
                name="currentCompany"
                placeholder="Company name"
                value={formData.currentCompany}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currentRole">Current/Last Job Title</Label>
              <Input
                id="currentRole"
                name="currentRole"
                placeholder="Job title"
                value={formData.currentRole}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="education">Highest Education</Label>
              <Select 
                value={formData.education} 
                onValueChange={(value) => handleSelectChange("education", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Upload Resume <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-2 border border-input p-2 rounded-md">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm">resume.pdf</span>
                <Button size="sm" variant="outline" className="ml-auto">
                  Change
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: PDF, DOCX, RTF (Max 2MB)
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="whyThisRole">Why are you interested in this role?</Label>
              <Textarea
                id="whyThisRole"
                name="whyThisRole"
                placeholder="Share what excites you about this position..."
                value={formData.whyThisRole}
                onChange={handleInputChange}
                className="mt-1"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="salary">Expected Salary (INR per annum)</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="₹8,00,000"
                value={formData.salary}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="noticePeriod">Notice Period</Label>
              <RadioGroup
                value={formData.noticePeriod}
                onValueChange={(value) => handleSelectChange("noticePeriod", value)}
                className="flex flex-col gap-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Immediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2 weeks" id="two-weeks" />
                  <Label htmlFor="two-weeks">2 weeks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1 month" id="one-month" />
                  <Label htmlFor="one-month">1 month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2 months" id="two-months" />
                  <Label htmlFor="two-months">2 months or more</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                placeholder="Tell the employer why you're a good fit for this position..."
                value={formData.coverLetter}
                onChange={handleInputChange}
                className="mt-1"
                rows={5}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Personal Information</h3>
              <Card className="bg-neutral-50">
                <CardContent className="p-4 pt-4">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="font-medium text-neutral-500">Name:</dt>
                      <dd>{formData.fullName}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Email:</dt>
                      <dd>{formData.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Phone:</dt>
                      <dd>{formData.phone}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Location:</dt>
                      <dd>{formData.location || "Not specified"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Experience</h3>
              <Card className="bg-neutral-50">
                <CardContent className="p-4 pt-4">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="font-medium text-neutral-500">Years of Experience:</dt>
                      <dd>{formData.yearsOfExperience || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Current Company:</dt>
                      <dd>{formData.currentCompany || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Current Role:</dt>
                      <dd>{formData.currentRole || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Education:</dt>
                      <dd>{formData.education || "Not specified"}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-neutral-500 mb-2">Additional Information</h3>
              <Card className="bg-neutral-50">
                <CardContent className="p-4 pt-4">
                  <dl className="space-y-3 text-sm">
                    <div>
                      <dt className="font-medium text-neutral-500">Expected Salary:</dt>
                      <dd>{formData.salary || "Not specified"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Notice Period:</dt>
                      <dd>{formData.noticePeriod}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-neutral-500">Resume:</dt>
                      <dd className="flex items-center">
                        <FileText className="h-4 w-4 mr-1 text-primary" />
                        {formData.resumeFileName}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={formData.resumeUpdated}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("resumeUpdated", checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I confirm that all information provided is accurate and up-to-date
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-neutral-600 max-w-md mx-auto mb-6">
              Thank you for applying to {job.title}. 
              Your application has been received.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              The employer will review your application and contact you if there's a match. 
              You can track your application status in your dashboard.
            </p>
            <Button onClick={onClose}>Return to Job</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply to {job.title}</DialogTitle>
              <DialogDescription>
                {job.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="my-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2">
                {STEPS.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? 'text-primary' : 'text-neutral-400'
                    }`}
                    style={{ width: `${100 / STEPS.length}%` }}
                  >
                    <step.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="py-4">{renderStepContent()}</div>
            
            <DialogFooter className="flex justify-between items-center">
              {currentStep > 0 ? (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
              )}
              <Button 
                onClick={handleNext} 
                disabled={isSubmitting || (currentStep === 3 && !formData.resumeUpdated)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === STEPS.length - 1 ? (
                  "Submit Application"
                ) : (
                  "Next"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}