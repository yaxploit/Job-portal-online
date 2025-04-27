import React from 'react';
import { Link } from 'wouter';
import { Github } from 'lucide-react';

/**
 * Footer component for the website.
 * Displays navigation links, social media links, and a copyright notice.
 */
export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">JobNexus</h3>
            <p className="text-neutral-600 mb-4 max-w-md">
              Connecting talented professionals with innovative companies across India.
              Find your dream job or hire top talent with JobNexus.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-neutral-600 hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-neutral-600 hover:text-blue-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-neutral-600 hover:text-blue-600 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/" className="text-neutral-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact section */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-neutral-600">
                Email: support@jobnexus.com
              </li>
              <li className="text-neutral-600">
                Phone: +91 1234567890
              </li>
              <li className="text-neutral-600">
                Address: Mumbai, India
              </li>
            </ul>
            
            {/* Social Media Links moved to copyright section */}
          </div>
        </div>
        
        {/* Divider and Copyright */}
        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} JobNexus. All rights reserved.
          </p>
          <div className="text-neutral-600 text-sm flex items-center gap-2">
            <span>Developed by</span>
            <a 
              href="https://yaxploit.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              yaxploit
            </a>
            <a 
              href="https://github.com/yaxploit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-blue-600 transition-colors"
            >
              <Github size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}