import { Link } from "wouter";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-6">
          <div className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-white text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          <Link 
            href="/jobs" 
            className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
