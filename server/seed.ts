import { storage } from "./storage";
import { hashPassword } from "./auth";
import { 
  InsertUser, 
  InsertSeekerProfile, 
  InsertEmployerProfile, 
  InsertJobListing,
  InsertJobApplication
} from "@shared/schema";

// Sample data to seed the application
async function seedDatabase() {
  console.log("Starting database seeding...");

  // Create users
  const users: InsertUser[] = [
    {
      username: "johndoe",
      email: "john@example.com",
      password: await hashPassword("password123"),
      name: "John Doe",
      userType: "seeker" as const
    },
    {
      username: "janedoe",
      email: "jane@example.com",
      password: await hashPassword("password123"),
      name: "Jane Doe",
      userType: "seeker" as const
    },
    {
      username: "mikebrown",
      email: "mike@example.com",
      password: await hashPassword("password123"),
      name: "Mike Brown",
      userType: "seeker" as const
    },
    {
      username: "techcorp",
      email: "hr@techcorp.com",
      password: await hashPassword("password123"),
      name: "Tech Corporation",
      userType: "employer" as const
    },
    {
      username: "globalsys",
      email: "careers@globalsys.com",
      password: await hashPassword("password123"),
      name: "Global Systems",
      userType: "employer" as const
    },
    {
      username: "creativeco",
      email: "jobs@creativeco.com",
      password: await hashPassword("password123"),
      name: "Creative Co.",
      userType: "employer" as const
    }
  ];

  const createdUsers = [];
  for (const user of users) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(user.username);
      if (!existingUser) {
        const newUser = await storage.createUser(user);
        createdUsers.push(newUser);
        console.log(`Created user: ${newUser.username}`);
      } else {
        console.log(`User ${user.username} already exists, skipping`);
        createdUsers.push(existingUser);
      }
    } catch (error) {
      console.error(`Error creating user ${user.username}:`, error);
    }
  }

  // Create seeker profiles
  const seekerProfiles = [
    {
      userId: createdUsers[0].id,
      title: "Senior Software Engineer",
      skills: ["JavaScript", "React", "Node.js", "TypeScript"],
      experience: "5+ years",
      education: "Bachelor of Computer Science",
      location: "San Francisco, CA",
      bio: "Experienced software engineer with a passion for building scalable web applications"
    },
    {
      userId: createdUsers[1].id,
      title: "UX/UI Designer",
      skills: ["UI Design", "Figma", "Adobe XD", "User Research"],
      experience: "3 years",
      education: "Bachelor of Fine Arts",
      location: "New York, NY",
      bio: "Creative designer focused on building intuitive and beautiful user experiences"
    },
    {
      userId: createdUsers[2].id,
      title: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      experience: "2 years",
      education: "Master of Data Science",
      location: "Boston, MA",
      bio: "Data scientist with a background in predictive analytics and machine learning"
    }
  ];

  for (const profile of seekerProfiles) {
    try {
      // Check if profile already exists
      const existingProfile = await storage.getSeekerProfile(profile.userId);
      if (!existingProfile) {
        const newProfile = await storage.createSeekerProfile(profile);
        console.log(`Created seeker profile for user ID: ${newProfile.userId}`);
      } else {
        console.log(`Seeker profile for user ID ${profile.userId} already exists, skipping`);
      }
    } catch (error) {
      console.error(`Error creating seeker profile for user ID ${profile.userId}:`, error);
    }
  }

  // Create employer profiles
  const employerProfiles = [
    {
      userId: createdUsers[3].id,
      companyName: "Tech Corporation",
      industry: "Technology",
      location: "San Francisco, CA",
      website: "https://techcorp.example.com",
      description: "Leading technology company specialized in cloud solutions",
      logo: "https://via.placeholder.com/150?text=TechCorp"
    },
    {
      userId: createdUsers[4].id,
      companyName: "Global Systems",
      industry: "IT Services",
      location: "Chicago, IL",
      website: "https://globalsys.example.com",
      description: "Global IT services and consulting company",
      logo: "https://via.placeholder.com/150?text=GlobalSys"
    },
    {
      userId: createdUsers[5].id,
      companyName: "Creative Co.",
      industry: "Design & Marketing",
      location: "Austin, TX",
      website: "https://creativeco.example.com",
      description: "Creative agency specialized in branding and digital marketing",
      logo: "https://via.placeholder.com/150?text=CreativeCo"
    }
  ];

  for (const profile of employerProfiles) {
    try {
      // Check if profile already exists
      const existingProfile = await storage.getEmployerProfile(profile.userId);
      if (!existingProfile) {
        const newProfile = await storage.createEmployerProfile(profile);
        console.log(`Created employer profile for user ID: ${newProfile.userId}`);
      } else {
        console.log(`Employer profile for user ID ${profile.userId} already exists, skipping`);
      }
    } catch (error) {
      console.error(`Error creating employer profile for user ID ${profile.userId}:`, error);
    }
  }

  // Create job listings
  const jobListings: Partial<InsertJobListing>[] = [
    {
      employerId: createdUsers[3].id,
      title: "Frontend Developer",
      description: "Looking for an experienced Frontend Developer to join our team and help build responsive and scalable web applications.",
      location: "San Francisco, CA",
      salaryMin: 90000,
      salaryMax: 120000,
      jobType: "full-time" as const,
      skills: ["JavaScript", "React", "HTML", "CSS", "TypeScript"],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      employerId: createdUsers[3].id,
      title: "Backend Engineer",
      description: "Seeking a skilled Backend Engineer to develop and maintain our server-side applications and databases.",
      location: "San Francisco, CA (Remote OK)",
      salaryMin: 100000,
      salaryMax: 140000,
      jobType: "full-time" as const,
      skills: ["Node.js", "Express", "Databases", "RESTful API", "AWS", "Azure", "GCP"],
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    },
    {
      employerId: createdUsers[4].id,
      title: "DevOps Engineer",
      description: "Join our DevOps team to help automate, deploy, and maintain our cloud infrastructure.",
      location: "Chicago, IL",
      salaryMin: 110000,
      salaryMax: 150000,
      jobType: "full-time" as const,
      skills: ["CI/CD", "Docker", "Kubernetes", "Terraform", "CloudFormation", "Networking", "Security"],
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    },
    {
      employerId: createdUsers[5].id,
      title: "UI/UX Designer",
      description: "Creative Co. is looking for a talented UI/UX Designer to create beautiful and intuitive interfaces for our clients.",
      location: "Austin, TX (Hybrid)",
      salaryMin: 80000,
      salaryMax: 110000,
      jobType: "full-time" as const,
      skills: ["UI Design", "UX Design", "Figma", "Adobe XD", "User Research", "Accessibility"],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      employerId: createdUsers[4].id,
      title: "Data Analyst (Part-time)",
      description: "Looking for a part-time Data Analyst to help interpret data and provide insights for business decisions.",
      location: "Remote",
      salaryMin: 40,
      salaryMax: 50,
      jobType: "part-time" as const,
      skills: ["Data Analysis", "SQL", "Excel", "Data Visualization", "Analytics"],
      applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      employerId: createdUsers[5].id,
      title: "Social Media Coordinator",
      description: "Creative Co. needs a Social Media Coordinator to manage and grow our clients' social media presence.",
      location: "Austin, TX",
      salaryMin: 50000,
      salaryMax: 65000,
      jobType: "full-time" as const,
      skills: ["Social Media", "Content Creation", "Analytics", "Digital Marketing"],
      applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
    }
  ];

  const createdJobs = [];
  for (const job of jobListings) {
    try {
      // Ensure required fields are present for proper type checking
      const validJob: InsertJobListing = {
        title: job.title ?? "Job Listing",
        location: job.location ?? "Remote",
        description: job.description ?? "No description provided",
        employerId: job.employerId ?? 0,
        jobType: job.jobType ?? "full-time",
        skills: job.skills ?? [],
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        applicationDeadline: job.applicationDeadline,
      };
      
      // Create the job listing
      const newJob = await storage.createJobListing(validJob);
      createdJobs.push(newJob);
      console.log(`Created job listing: ${newJob.title}`);
    } catch (error) {
      console.error(`Error creating job listing:`, error);
    }
  }

  // Create job applications
  const jobApplications: InsertJobApplication[] = [
    {
      jobId: createdJobs[0].id,
      seekerId: createdUsers[0].id,
      coverLetter: "I am excited to apply for the Frontend Developer position at Tech Corporation. With my extensive experience in React and JavaScript, I believe I would be a great fit for your team."
    },
    {
      jobId: createdJobs[0].id,
      seekerId: createdUsers[1].id,
      coverLetter: "As an experienced frontend developer with a background in design, I can bring a unique perspective to the Frontend Developer role."
    },
    {
      jobId: createdJobs[2].id,
      seekerId: createdUsers[0].id,
      coverLetter: "I'm interested in the DevOps Engineer position, as I have extensive experience with CI/CD pipelines and cloud infrastructure."
    },
    {
      jobId: createdJobs[3].id,
      seekerId: createdUsers[1].id,
      coverLetter: "I am writing to express my interest in the UI/UX Designer position at Creative Co. With my background in design and user research, I believe I would be a valuable addition to your team."
    },
    {
      jobId: createdJobs[4].id,
      seekerId: createdUsers[2].id,
      coverLetter: "I am applying for the Data Analyst position. With my background in data science and analytics, I am confident in my ability to provide valuable insights for your business decisions."
    }
  ];

  for (const application of jobApplications) {
    try {
      // We'll check for existing applications to avoid duplicates
      const existingApplications = await storage.getJobApplicationsBySeeker(application.seekerId);
      const alreadyApplied = existingApplications.some(
        app => app.jobId === application.jobId && app.seekerId === application.seekerId
      );
      
      if (!alreadyApplied) {
        const newApplication = await storage.createJobApplication(application);
        console.log(`Created job application for job ID: ${newApplication.jobId}, seeker ID: ${newApplication.seekerId}`);
      } else {
        console.log(`Application for job ID ${application.jobId}, seeker ID ${application.seekerId} already exists, skipping`);
      }
    } catch (error) {
      console.error(`Error creating job application for job ID ${application.jobId}, seeker ID ${application.seekerId}:`, error);
    }
  }

  console.log("Database seeding completed!");
}

export { seedDatabase };