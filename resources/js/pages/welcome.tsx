import { Link, usePage } from "@inertiajs/react";
import { ChevronDown, Mail, Send, ArrowRight, BarChart, Zap, Waves, MessageSquare, Users } from "lucide-react";

export default function Welcome() {
  const { auth } = usePage().props; // Access the authentication status from Inertia's shared props

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-2 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80 shadow-lg group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-50 blur-md group-hover:opacity-70 transition-opacity duration-300"></div>
              <div className="absolute inset-[5px] rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Mailing App
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/lists"
              className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Lists
            </Link>
            <Link
              href="/campaigns"
              className="flex items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Campaigns
            </Link>
            <Link
              href="/templates"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Templates
            </Link>
            <Link
              href="/smtp-config"
              className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
            >
              Brevo Configuration
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {auth?.user ? (
              // Logout Button
              <Link
                href="/logout"
                method="post"
                as="button"
                className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:text-red-600 hover:border-red-400 transition-colors duration-200 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400"
              >
                Logout
              </Link>
            ) : (
              // Login Button
              <Link
                href="/login"
                className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-colors duration-200 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
              >
                Login
              </Link>
            )}
            <Link
              href="/lists"
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg dark:from-blue-600 dark:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-16 md:py-24 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:bg-blue-700 dark:opacity-10"></div>
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:bg-cyan-700 dark:opacity-10"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:bg-sky-700 dark:opacity-10"></div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-8 shadow-sm dark:bg-gray-800/80 z-10 relative">
            <Send className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-gray-800 dark:text-gray-200 font-medium">Email marketing platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 leading-tight z-10 relative">
            Automated marketing that fuels growth.
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 dark:text-gray-300 leading-relaxed z-10 relative">
            Simplify your journey to success – from capturing leads to turning them into loyal customers, we're here to
            do the heavy lifting.
          </p>

          {/* CTA Button */}
          <div className="relative z-10 mb-20">
            <Link
              href="/lists"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg dark:from-blue-600 dark:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
