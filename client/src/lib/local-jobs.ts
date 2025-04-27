// Local jobs data that will be used instead of the API
import { JobListing } from "@shared/schema";

// Local storage key
const JOBS_KEY = "jobnexus_jobs";

// Helper function to create a properly formatted Date string for the database
function createDate(daysOffset: number = 0): string {
  const date = new Date();
  if (daysOffset !== 0) {
    date.setDate(date.getDate() + daysOffset);
  }
  return date.toISOString();
}

// Realistic job data
const DEFAULT_JOBS: JobListing[] = [
  {
    id: 1,
    employerId: 4, // Tech Corp
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer to join our product team. You will be responsible for building user interfaces using React, working with our designers and backend developers to create seamless user experiences.\n\nRequirements:\n- 3+ years of experience with React.js\n- Strong knowledge of HTML5, CSS3, and JavaScript\n- Experience with state management libraries\n- Familiarity with responsive design and cross-browser compatibility",
    location: "Bangalore, India",
    jobType: "full-time",
    salaryMin: 1200000,
    salaryMax: 2000000,
    skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    applicationDeadline: createDate(30),
    postedAt: createDate(),
    isActive: true,
  },
  {
    id: 2,
    employerId: 4, // Tech Corp
    title: "Backend Engineer",
    description: "Tech Corp is seeking a Backend Engineer to develop and maintain our core APIs and services. You'll work with a talented team to build scalable and maintainable systems.\n\nRequirements:\n- Experience with Node.js and Express\n- Knowledge of SQL and NoSQL databases\n- Understanding of RESTful API design principles\n- Experience with microservices architecture is a plus",
    location: "Mumbai, India",
    jobType: "full-time",
    salaryMin: 1500000,
    salaryMax: 2500000,
    skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "RESTful APIs"],
    applicationDeadline: createDate(45),
    postedAt: createDate(),
    isActive: true,
  },
  {
    id: 3,
    employerId: 5, // Global Systems
    title: "DevOps Engineer",
    description: "Join Global Systems as a DevOps Engineer to help us design, implement and maintain our infrastructure. You'll be working closely with development teams to streamline deployment processes and ensure system reliability.\n\nRequirements:\n- Experience with AWS or Azure cloud services\n- Knowledge of containerization (Docker, Kubernetes)\n- Experience with CI/CD pipelines\n- Scripting skills (Bash, Python)",
    location: "Pune, India",
    jobType: "full-time",
    salaryMin: 1800000,
    salaryMax: 2600000,
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    applicationDeadline: createDate(60),
    postedAt: createDate(-5),
    isActive: true,
  },
  {
    id: 4,
    employerId: 6, // Creative Co
    title: "UI/UX Designer",
    description: "Creative Co is looking for a UI/UX Designer to create attractive and functional interfaces for our clients. You'll collaborate with product managers and developers to deliver intuitive user experiences.\n\nRequirements:\n- Portfolio showcasing UI/UX projects\n- Proficiency with design tools (Figma, Sketch, Adobe XD)\n- Understanding of user-centered design principles\n- Knowledge of HTML/CSS is a plus",
    location: "Chennai, India",
    jobType: "full-time",
    salaryMin: 1000000,
    salaryMax: 1600000,
    skills: ["Figma", "Sketch", "User Research", "Wireframing", "Prototyping"],
    applicationDeadline: createDate(30),
    postedAt: createDate(-3),
    isActive: true,
  },
  {
    id: 5,
    employerId: 5, // Global Systems
    title: "Data Analyst",
    description: "Global Systems is seeking a Data Analyst to join our team. This role is responsible for interpreting data, analyzing results, and providing business insights.\n\nRequirements:\n- Experience with data analysis tools (Excel, SQL, Python)\n- Strong analytical and problem-solving skills\n- Ability to create dashboards and visualizations\n- Knowledge of statistics and data modeling",
    location: "Hyderabad, India",
    jobType: "part-time",
    salaryMin: 800000,
    salaryMax: 1200000,
    skills: ["SQL", "Python", "Excel", "Tableau", "Data Visualization"],
    applicationDeadline: createDate(45),
    postedAt: createDate(-7),
    isActive: true,
  },
  {
    id: 6,
    employerId: 6, // Creative Co
    title: "Social Media Coordinator",
    description: "Creative Co needs a Social Media Coordinator to manage our clients' social media presence. You'll develop content strategies, create engaging posts, and analyze performance metrics.\n\nRequirements:\n- Experience managing social media accounts for businesses\n- Knowledge of social media analytics\n- Content creation skills\n- Excellent communication abilities",
    location: "Austin, TX",
    jobType: "remote",
    salaryMin: 50000,
    salaryMax: 70000,
    skills: ["Social Media Marketing", "Content Creation", "Analytics", "Copywriting"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    isActive: true,
  },
  {
    id: 7,
    employerId: 4, // Tech Corp
    title: "Product Manager",
    description: "Tech Corp is looking for a Product Manager to lead our product development process. You'll work with cross-functional teams to define product vision, create roadmaps, and deliver solutions that meet user needs.\n\nRequirements:\n- 4+ years of experience in product management\n- Strong analytical and problem-solving skills\n- Experience with agile methodologies\n- Excellent communication and leadership abilities",
    location: "Seattle, WA",
    jobType: "full-time",
    salaryMin: 120000,
    salaryMax: 160000,
    skills: ["Product Strategy", "Agile", "User Stories", "Market Analysis", "Roadmapping"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    isActive: true,
  },
  {
    id: 8,
    employerId: 5, // Global Systems
    title: "Cloud Architect",
    description: "Global Systems is seeking a Cloud Architect to design and implement our cloud infrastructure. You'll be responsible for defining the cloud strategy and ensuring best practices in security, cost optimization, and scalability.\n\nRequirements:\n- Extensive experience with AWS, Azure, or GCP\n- Understanding of infrastructure as code\n- Knowledge of network architecture and security\n- Experience with distributed systems",
    location: "Denver, CO",
    jobType: "full-time",
    salaryMin: 130000,
    salaryMax: 180000,
    skills: ["AWS", "Azure", "Cloud Security", "Serverless", "Microservices"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    isActive: true,
  },
  {
    id: 9,
    employerId: 6, // Creative Co
    title: "Content Writer",
    description: "Creative Co needs a talented Content Writer to create engaging copy for our clients. You'll work on website content, blog posts, social media, and marketing materials.\n\nRequirements:\n- Portfolio of writing samples\n- Strong research skills\n- Understanding of SEO principles\n- Ability to adapt tone and style for different audiences",
    location: "Portland, OR",
    jobType: "remote",
    salaryMin: 60000,
    salaryMax: 80000,
    skills: ["Copywriting", "SEO", "Content Strategy", "Editing", "Research"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    isActive: true,
  },
  {
    id: 10,
    employerId: 4, // Tech Corp
    title: "QA Engineer",
    description: "Tech Corp is looking for a QA Engineer to ensure the quality of our software products. You'll design and execute test plans, identify bugs, and work with developers to improve product quality.\n\nRequirements:\n- Experience with manual and automated testing\n- Knowledge of test methodologies and best practices\n- Familiarity with testing tools like Selenium or Cypress\n- Attention to detail and problem-solving skills",
    location: "San Jose, CA",
    jobType: "full-time",
    salaryMin: 90000,
    salaryMax: 120000,
    skills: ["Manual Testing", "Automated Testing", "Selenium", "JIRA", "Test Planning"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    isActive: true,
  },
  {
    id: 11,
    employerId: 5, // Global Systems
    title: "Data Engineer",
    description: "Global Systems is seeking a Data Engineer to build and maintain data pipelines. You'll work with large datasets and create efficient systems for data processing and analysis.\n\nRequirements:\n- Experience with data processing frameworks (Spark, Hadoop)\n- Knowledge of ETL processes\n- Proficiency in Python or Scala\n- Experience with cloud-based data solutions",
    location: "Atlanta, GA",
    jobType: "full-time",
    salaryMin: 110000,
    salaryMax: 150000,
    skills: ["Apache Spark", "ETL", "Python", "SQL", "Data Modeling"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString(),
    isActive: true,
  },
  {
    id: 12,
    employerId: 6, // Creative Co
    title: "Marketing Specialist",
    description: "Creative Co is looking for a Marketing Specialist to develop and implement marketing strategies for our clients. You'll work on various campaigns across digital and traditional channels.\n\nRequirements:\n- Experience in digital marketing\n- Knowledge of SEO, SEM, and social media marketing\n- Analytical skills to measure campaign performance\n- Creative thinking and problem-solving abilities",
    location: "Miami, FL",
    jobType: "full-time",
    salaryMin: 70000,
    salaryMax: 90000,
    skills: ["Digital Marketing", "SEO", "SEM", "Social Media", "Analytics"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
    isActive: true,
  },
  {
    id: 13,
    employerId: 4, // Tech Corp
    title: "Full Stack Developer",
    description: "Tech Corp is seeking a Full Stack Developer to work on all aspects of our web applications. You'll be involved in both frontend and backend development, database design, and system architecture.\n\nRequirements:\n- Experience with frontend technologies (React, Angular, or Vue)\n- Proficiency in backend development (Node.js, Python, or Java)\n- Knowledge of database systems\n- Understanding of web security principles",
    location: "Raleigh, NC",
    jobType: "full-time",
    salaryMin: 100000,
    salaryMax: 140000,
    skills: ["JavaScript", "React", "Node.js", "SQL", "RESTful APIs"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(),
    isActive: true,
  },
  {
    id: 14,
    employerId: 5, // Global Systems
    title: "Cybersecurity Analyst",
    description: "Global Systems is looking for a Cybersecurity Analyst to protect our systems and data. You'll monitor security systems, identify vulnerabilities, and implement solutions to prevent security breaches.\n\nRequirements:\n- Experience in information security\n- Knowledge of security tools and best practices\n- Understanding of network security and encryption\n- Security certifications (e.g., CISSP, CEH) are a plus",
    location: "Washington, DC",
    jobType: "full-time",
    salaryMin: 110000,
    salaryMax: 150000,
    skills: ["Network Security", "Threat Analysis", "Penetration Testing", "Security Auditing"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 9)).toISOString(),
    isActive: true,
  },
  {
    id: 15,
    employerId: 6, // Creative Co
    title: "Graphic Designer",
    description: "Creative Co is seeking a Graphic Designer to create visual concepts for our clients. You'll develop layouts, illustrations, and graphics for various media including web, print, and social.\n\nRequirements:\n- Portfolio showcasing design work\n- Proficiency with Adobe Creative Suite\n- Understanding of typography, color theory, and layout\n- Ability to translate client needs into design solutions",
    location: "Philadelphia, PA",
    jobType: "part-time",
    salaryMin: 40000,
    salaryMax: 60000,
    skills: ["Adobe Photoshop", "Adobe Illustrator", "Typography", "Brand Design"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    isActive: true,
  },
  {
    id: 16,
    employerId: 4, // Tech Corp
    title: "Machine Learning Engineer",
    description: "Tech Corp is looking for a Machine Learning Engineer to develop and implement AI solutions. You'll work on building models, evaluating performance, and integrating ML systems into our products.\n\nRequirements:\n- Experience with machine learning frameworks (TensorFlow, PyTorch)\n- Strong programming skills in Python\n- Understanding of ML algorithms and techniques\n- Knowledge of data preprocessing and feature engineering",
    location: "Mountain View, CA",
    jobType: "full-time",
    salaryMin: 130000,
    salaryMax: 180000,
    skills: ["Python", "TensorFlow", "PyTorch", "Data Science", "Deep Learning"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 11)).toISOString(),
    isActive: true,
  },
  {
    id: 17,
    employerId: 5, // Global Systems
    title: "Project Manager",
    description: "Global Systems is seeking a Project Manager to lead cross-functional teams in delivering complex projects. You'll be responsible for planning, execution, and successful completion of projects within scope, time, and budget constraints.\n\nRequirements:\n- PMP certification preferred\n- Experience managing technical projects\n- Strong leadership and communication skills\n- Proficiency with project management tools",
    location: "Dallas, TX",
    jobType: "full-time",
    salaryMin: 100000,
    salaryMax: 140000,
    skills: ["Project Planning", "Risk Management", "Agile", "Stakeholder Management"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
    isActive: true,
  },
  {
    id: 18,
    employerId: 6, // Creative Co
    title: "Video Editor",
    description: "Creative Co needs a Video Editor to produce high-quality video content for our clients. You'll edit footage, add effects, sync audio, and ensure overall visual quality.\n\nRequirements:\n- Portfolio of video editing work\n- Proficiency with editing software (Premiere Pro, Final Cut Pro)\n- Understanding of storytelling through video\n- Knowledge of motion graphics is a plus",
    location: "Nashville, TN",
    jobType: "contract",
    salaryMin: 60000,
    salaryMax: 80000,
    skills: ["Adobe Premiere Pro", "Final Cut Pro", "Motion Graphics", "Color Grading"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(),
    isActive: true,
  },
  {
    id: 19,
    employerId: 4, // Tech Corp
    title: "Mobile App Developer",
    description: "Tech Corp is looking for a Mobile App Developer to create applications for iOS and Android platforms. You'll be responsible for coding, testing, and maintaining mobile applications.\n\nRequirements:\n- Experience with Swift or Kotlin\n- Knowledge of mobile app architecture\n- Understanding of UX/UI principles for mobile\n- Experience with RESTful APIs and data persistence",
    location: "Phoenix, AZ",
    jobType: "remote",
    salaryMin: 90000,
    salaryMax: 130000,
    skills: ["iOS", "Android", "Swift", "Kotlin", "React Native"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 13)).toISOString(),
    isActive: true,
  },
  {
    id: 20,
    employerId: 5, // Global Systems
    title: "Technical Support Specialist",
    description: "Global Systems is seeking a Technical Support Specialist to assist customers with technical issues. You'll troubleshoot problems, document solutions, and ensure customer satisfaction.\n\nRequirements:\n- Experience in customer support or IT help desk\n- Strong technical problem-solving skills\n- Excellent communication and patience\n- Knowledge of common software and hardware systems",
    location: "Minneapolis, MN",
    jobType: "full-time",
    salaryMin: 60000,
    salaryMax: 80000,
    skills: ["Technical Troubleshooting", "Customer Service", "IT Support", "Documentation"],
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    postedAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
    isActive: true,
  },
];

// Initialize jobs in local storage if not exists
export function initLocalJobs() {
  if (!localStorage.getItem(JOBS_KEY)) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(DEFAULT_JOBS));
  }
}

// Get all jobs
export function getJobs(): JobListing[] {
  const jobsJson = localStorage.getItem(JOBS_KEY);
  return jobsJson ? JSON.parse(jobsJson) : [];
}

// Get filtered jobs
export function getFilteredJobs(filters: {
  keyword?: string;
  location?: string;
  jobType?: string;
  employerId?: number;
}): JobListing[] {
  console.log("Filtering jobs with criteria:", filters);
  const jobs = getJobs();
  
  // For empty filters, return all jobs
  if (!filters.keyword && !filters.location && !filters.jobType && !filters.employerId) {
    console.log("No filters applied, returning all jobs:", jobs.length);
    return jobs;
  }
  
  const filtered = jobs.filter(job => {
    // Apply keyword filter (search in title, description, and skills)
    if (filters.keyword && filters.keyword.trim() !== "") {
      const keyword = filters.keyword.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(keyword);
      const descMatch = job.description.toLowerCase().includes(keyword);
      const skillsMatch = job.skills ? job.skills.some(skill => 
        skill.toLowerCase().includes(keyword)
      ) : false;
      
      if (!(titleMatch || descMatch || skillsMatch)) {
        return false;
      }
    }
    
    // Apply location filter
    if (filters.location && filters.location.trim() !== "") {
      if (!job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
    }
    
    // Apply job type filter (exact match)
    if (filters.jobType && filters.jobType !== "all" && filters.jobType.trim() !== "") {
      if (job.jobType !== filters.jobType) {
        return false;
      }
    }
    
    // Apply employer filter
    if (filters.employerId) {
      if (job.employerId !== filters.employerId) {
        return false;
      }
    }
    
    return true;
  });
  
  console.log("Filtered jobs:", filtered.length);
  return filtered;
}

// Get job by ID
export function getJobById(id: number): JobListing | undefined {
  const jobs = getJobs();
  return jobs.find(job => job.id === id);
}