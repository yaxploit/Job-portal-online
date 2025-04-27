import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("seeker");
  
  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Error state
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Basic validation
    if (activeTab === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      
      if (!name || !email || !username || !password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }
      
      // Handle registration (simulate saving)
      setTimeout(() => {
        // Store in localStorage
        const newUser = {
          id: Date.now(),
          name,
          username,
          email,
          password, // In real app, this would be hashed
          userType,
          createdAt: new Date().toISOString()
        };
        
        // Save to local storage (using jobnexus_users key for consistency)
        try {
          const existingUsers = JSON.parse(localStorage.getItem('jobnexus_users') || '[]');
          localStorage.setItem('jobnexus_users', JSON.stringify([...existingUsers, newUser]));
          
          // Also store as current user
          const { password: _, ...userWithoutPassword } = newUser;
          localStorage.setItem('jobnexus_user', JSON.stringify(userWithoutPassword));
          localStorage.setItem('currentUser', JSON.stringify({
            ...userWithoutPassword,
            isLoggedIn: true
          }));
          
          setIsLoading(false);
          alert("Account created successfully!");
          setLocation("/");
        } catch (err: any) {
          setError(err.message || "Registration failed");
          setIsLoading(false);
        }
      }, 1000);
      
    } else {
      // Login validation
      if (!username || !password) {
        setError("Username and password are required");
        setIsLoading(false);
        return;
      }
      
      // Hardcoded admin credentials
      if (username === "admin" && password === "yaxploit") {
        // Admin login successful
        localStorage.setItem('currentUser', JSON.stringify({
          id: 0,
          username: "admin",
          name: "Administrator",
          userType: "admin",
          isLoggedIn: true
        }));
        
        setIsLoading(false);
        setLocation("/admin");
        return;
      }
      
      // Check localStorage for other users (using both storage keys for compatibility)
      const users = JSON.parse(localStorage.getItem('jobnexus_users') || '[]');
      const matchedUser = users.find((user: any) => 
        user.username === username && user.password === password
      );
      
      if (matchedUser) {
        // Login successful
        const { password: _, ...userWithoutPassword } = matchedUser;
        
        // Store in both localStorage keys for compatibility
        localStorage.setItem('jobnexus_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('currentUser', JSON.stringify({
          ...userWithoutPassword,
          isLoggedIn: true
        }));
        
        setIsLoading(false);
        
        if (matchedUser.userType === "seeker") {
          setLocation("/jobs");
        } else {
          setLocation("/");
        }
      } else {
        // Login failed
        setError("Invalid username or password");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Back to home link */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
      </div>
      
      <div className="flex min-h-screen py-12">
        {/* Auth form container */}
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
              <h1 className="text-2xl font-extrabold text-white">
                {activeTab === "login" ? "Welcome Back" : "Create Your Account"}
              </h1>
              <p className="mt-2 text-sm text-blue-100">
                {activeTab === "login" 
                  ? "Sign in to your account to continue"
                  : "Join thousands of job seekers and employers"
                }
              </p>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button 
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === "login"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button 
                className={`flex-1 py-4 text-center font-medium ${
                  activeTab === "register"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>
            
            {/* User Type Selector */}
            <div className="px-8 pt-6">
              <p className="text-sm text-gray-600 mb-2">I am a:</p>
              <div className="flex border border-gray-300 rounded-md p-1">
                <button 
                  className={`w-1/2 py-2 text-center rounded-md text-sm font-medium transition ${
                    userType === "seeker" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setUserType("seeker")}
                >
                  Job Seeker
                </button>
                <button 
                  className={`w-1/2 py-2 text-center rounded-md text-sm font-medium transition ${
                    userType === "employer" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setUserType("employer")}
                >
                  Employer
                </button>
              </div>
            </div>
            
            {/* Form */}
            <div className="px-8 py-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "register" && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Choose a username"
                  />
                </div>
                
                {activeTab === "register" && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={activeTab === "login" ? "Enter your password" : "Create a password"}
                  />
                </div>
                
                {activeTab === "register" && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}
                
                {activeTab === "login" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        id="remember" 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </a>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : activeTab === "login" 
                      ? 'Sign In' 
                      : 'Create Account'
                  }
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  {activeTab === "login" 
                    ? "Don't have an account?" 
                    : "Already have an account?"
                  }
                  <button
                    onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                    className="ml-1 font-medium text-blue-600 hover:text-blue-500"
                  >
                    {activeTab === "login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
