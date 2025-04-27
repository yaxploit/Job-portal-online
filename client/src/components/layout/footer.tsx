import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">JobNexus</h3>
            <p className="text-neutral-400 mb-4">Connecting talent with opportunity.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Job Alerts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">For Employers</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/jobs/post" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/auth" className="hover:text-white transition-colors">Browse Candidates</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Recruitment Solutions</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-neutral-700 text-neutral-400 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} JobNexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
