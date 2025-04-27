import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from 'wouter';

const jobTypes = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Remote', label: 'Remote' },
];

const locations = [
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'Hyderabad, India',
  'Chennai, India',
  'Kolkata, India',
  'Pune, India',
  'Ahmedabad, India',
  'Jaipur, India',
  'Remote, India',
];

// Custom skills input component with tags
function SkillsInput({ value, onChange }: { value: string[], onChange: (skills: string[]) => void }) {
  const [currentSkill, setCurrentSkill] = useState('');

  const handleAddSkill = () => {
    if (currentSkill.trim() !== '' && !value.includes(currentSkill.trim())) {
      onChange([...value, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill and press Enter"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={handleAddSkill}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((skill, index) => (
          <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm">
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AddJobForm() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.username || '',
    location: '',
    jobType: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    skills: [] as string[],
    requirements: '',
    responsibilities: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({ ...prev, skills }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.location || !formData.jobType || !formData.description) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate salary
    if (formData.salaryMin && formData.salaryMax) {
      const min = parseInt(formData.salaryMin, 10);
      const max = parseInt(formData.salaryMax, 10);
      
      if (isNaN(min) || isNaN(max) || min >= max) {
        toast({
          title: "Invalid Salary Range",
          description: "Minimum salary must be less than maximum salary.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      // Get current user and jobs from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const existingJobs = JSON.parse(localStorage.getItem('jobnexus_jobs') || '[]');
      
      // Create new job object
      const newJob = {
        id: existingJobs.length + 1,
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin, 10) : 0,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax, 10) : 0,
        postedAt: new Date().toISOString(),
        employerId: currentUser.id,
        status: 'OPEN'
      };
      
      // Log the job data
      console.log('Job posting submitted:', newJob);
      
      // Save to local storage with delay to simulate API call
      setTimeout(() => {
        // Save the new job to localStorage
        localStorage.setItem('jobnexus_jobs', JSON.stringify([...existingJobs, newJob]));
        
        toast({
          title: "Job Posted",
          description: "Your job listing has been posted successfully!"
        });
        
        setIsSubmitting(false);
        
        // Redirect to jobs page where the user can see their posting
        navigate('/jobs');
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Post a New Job</CardTitle>
        <CardDescription>
          Complete the form below to post a new job opening to the JobNexus platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer"
                required
              />
            </div>
            
            {/* Company name */}
            <div className="space-y-2">
              <Label htmlFor="company">Company Name <span className="text-red-500">*</span></Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name"
                required
              />
            </div>
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => handleSelectChange('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Job Type */}
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.jobType} 
                onValueChange={(value) => handleSelectChange('jobType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Salary Range */}
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Minimum Salary (₹)</Label>
              <Input
                id="salaryMin"
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g., 500000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Maximum Salary (₹)</Label>
              <Input
                id="salaryMax"
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g., 1000000"
              />
            </div>
          </div>
          
          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the job role..."
              rows={6}
              required
            />
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills</Label>
            <SkillsInput 
              value={formData.skills} 
              onChange={handleSkillsChange} 
            />
          </div>
          
          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the requirements for this position..."
              rows={4}
            />
          </div>
          
          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="List the key responsibilities for this position..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}