"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Filter,
  Briefcase,
  Globe,
  Star,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string[];
  salary: string;
};

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsIntersecting(true);
        setHasAnimated(true);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, options]);

  return [ref, isIntersecting] as const;
};

// Counter animation hook
const useCountUp = (
  end: number,
  duration: number = 2000,
  shouldStart: boolean = false
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

export const CareersView = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const heroOptions = useMemo(() => ({ threshold: 0.1 }), []);
  const statsOptions = useMemo(() => ({ threshold: 0.3 }), []);
  const searchOptions = useMemo(() => ({ threshold: 0.2 }), []);
  const benefitsOptions = useMemo(() => ({ threshold: 0.1 }), []);

  const [heroRef, heroInView] = useIntersectionObserver(heroOptions);
  const [statsRef, statsInView] = useIntersectionObserver(statsOptions);
  const [searchRef, searchInView] = useIntersectionObserver(searchOptions);
  const [benefitsRef, benefitsInView] = useIntersectionObserver(benefitsOptions);

  const jobs = [
    {
      id: 1,
      title: "Senior Chemical Engineer",
      department: "Research & Development",
      location: "Houston, TX",
      type: "Full-time",
      level: "Senior",
      description:
        "Lead innovative chemical processes and drive sustainable solutions for next-generation products.",
      requirements: [
        "PhD in Chemical Engineering",
        "5+ years experience",
        "Process optimization expertise",
      ],
      salary: "$120k - $150k",
    },
    {
      id: 2,
      title: "Process Safety Manager",
      department: "Safety & Compliance",
      location: "Baton Rouge, LA",
      type: "Full-time",
      level: "Manager",
      description:
        "Oversee safety protocols and ensure compliance with environmental regulations across operations.",
      requirements: [
        "Masters in Safety Engineering",
        "7+ years experience",
        "HAZOP certification",
      ],
      salary: "$100k - $130k",
    },
    {
      id: 3,
      title: "Laboratory Technician",
      department: "Quality Control",
      location: "Dallas, TX",
      type: "Full-time",
      level: "Entry",
      description:
        "Conduct quality testing and analysis of chemical products in state-of-the-art facilities.",
      requirements: [
        "Bachelor's in Chemistry",
        "1+ years experience",
        "Analytical skills",
      ],
      salary: "$50k - $65k",
    },
    {
      id: 4,
      title: "Environmental Scientist",
      department: "Sustainability",
      location: "Remote",
      type: "Full-time",
      level: "Mid",
      description:
        "Develop environmental impact assessments and sustainable chemistry initiatives.",
      requirements: [
        "MS Environmental Science",
        "3+ years experience",
        "EPA knowledge",
      ],
      salary: "$75k - $95k",
    },
    {
      id: 5,
      title: "Data Scientist - Chemical Analytics",
      department: "Digital Innovation",
      location: "Austin, TX",
      type: "Full-time",
      level: "Mid",
      description:
        "Apply machine learning and AI to optimize chemical processes and predict outcomes.",
      requirements: [
        "PhD in Data Science/Chemistry",
        "4+ years experience",
        "Python/R expertise",
      ],
      salary: "$110k - $140k",
    },
    {
      id: 6,
      title: "Sales Engineer",
      department: "Sales & Marketing",
      location: "Chicago, IL",
      type: "Full-time",
      level: "Mid",
      description:
        "Drive technical sales of specialty chemicals to industrial clients worldwide.",
      requirements: [
        "Bachelor's in Engineering",
        "3+ years sales experience",
        "Technical communication",
      ],
      salary: "$80k - $110k",
    },
  ];

  const departments = [
    "All Departments",
    "Research & Development",
    "Safety & Compliance",
    "Quality Control",
    "Sustainability",
    "Digital Innovation",
    "Sales & Marketing",
  ];
  const locations = [
    "All Locations",
    "Houston, TX",
    "Baton Rouge, LA",
    "Dallas, TX",
    "Austin, TX",
    "Chicago, IL",
    "Remote",
  ];

  const stats = [
    { icon: Users, label: "Team Members", value: "2,500+", numericValue: 2500 },
    { icon: Globe, label: "Global Offices", value: "25", numericValue: 25 },
    { icon: TrendingUp, label: "Growth Rate", value: "15%", numericValue: 15 },
    { icon: Award, label: "Industry Awards", value: "50+", numericValue: 50 },
  ];

  const count1 = useCountUp(stats[0].numericValue, 2000, statsInView);
  const count2 = useCountUp(stats[1].numericValue, 2000, statsInView);
  const count3 = useCountUp(stats[2].numericValue, 2000, statsInView);
  const count4 = useCountUp(stats[3].numericValue, 2000, statsInView);

  const animatedStats = [count1, count2, count3, count4];

  const benefits = [
    "Comprehensive Health Insurance",
    "401(k) with Company Match",
    "Professional Development Programs",
    "Flexible Work Arrangements",
    "Wellness Programs",
    "Tuition Reimbursement",
  ];

  const filteredJobs = jobs.filter((job) => {
    return (
      (searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLocation === "" ||
        selectedLocation === "All Locations" ||
        job.location === selectedLocation) &&
      (selectedDepartment === "" ||
        selectedDepartment === "All Departments" ||
        job.department === selectedDepartment)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 mt-18">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse bg-green-500/20 dark:bg-green-400/10 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-20">
          <div
            ref={heroRef}
            className={`text-center transform transition-all duration-1000 ease-out ${
              heroInView
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              <span
                className={`inline-block transform transition-all duration-1000 delay-300 ${heroInView ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
              >
                Shape the
              </span>
              <span
                className={`text-green-500 animate-pulse inline-block transform transition-all duration-1000 delay-500 ${heroInView ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              >
                {" "}
                Future
              </span>
              <br />
              <span
                className={`inline-block transform transition-all duration-1000 delay-700 ${heroInView ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
              >
                of Chemistry
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300 transform transition-all duration-1000 delay-900 ${
                heroInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              Join our innovative team of scientists, engineers, and visionaries
              creating sustainable solutions for tomorrow&apos;s challenges.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-1100 ${
                heroInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:-translate-y-1">
                View Open Positions
              </button>
              <button className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white dark:border-green-400 dark:text-green-400 dark:hover:bg-green-400 dark:hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1">
                Learn About Culture
              </button>
            </div>
          </div>

          {/* Stats Section with Counter Animation */}
          <div
            ref={statsRef}
            className={`grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 transform transition-all duration-1000 delay-300 ${
              statsInView
                ? "translate-y-0 opacity-100"
                : "translate-y-16 opacity-0"
            }`}
          >
            {stats.map((stat, index) => {
              const count = animatedStats[index];
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-2xl backdrop-blur-sm bg-white/70 dark:bg-white/10 hover:scale-110 transition-all duration-500 hover:shadow-2xl transform ${
                    statsInView ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${400 + index * 200}ms`,
                    animationDelay: `${400 + index * 200}ms`,
                  }}
                >
                  <stat.icon
                    className={`h-10 w-10 text-green-500 mx-auto mb-4 transform transition-all duration-700 ${
                      statsInView ? "rotate-0 scale-100" : "rotate-180 scale-0"
                    }`}
                    style={{ transitionDelay: `${600 + index * 200}ms` }}
                  />
                  <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                    {statsInView
                      ? stat.label === "Team Members"
                        ? `${count.toLocaleString()}+`
                        : stat.label === "Growth Rate"
                          ? `${count}%`
                          : stat.label === "Industry Awards"
                            ? `${count}+`
                            : count.toString()
                      : "0"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div
          ref={searchRef}
          className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl mb-12 transform transition-all duration-1000 border ${
            searchInView
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-16 opacity-0 scale-95"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div
              className={`flex-1 relative transform transition-all duration-700 delay-200 ${
                searchInView
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent focus:scale-[1.02]"
              />
            </div>

            <div
              className={`relative transform transition-all duration-700 delay-400 ${
                searchInView
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-lg border transition-all duration-300 appearance-none cursor-pointer bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent hover:scale-105"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <div
              className={`relative transform transition-all duration-700 delay-600 ${
                searchInView
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
            >
              <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-lg border transition-all duration-300 appearance-none cursor-pointer bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent hover:scale-105"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <JobListings filteredJobs={filteredJobs} />

        {filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl border">
            <div className="text-6xl mb-4 text-gray-400 dark:text-gray-600">
              🔍
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-green-50 dark:bg-gray-800 py-20">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
          <div
            ref={benefitsRef}
            className={`text-center mb-16 transform transition-all duration-1000 ${
              benefitsInView
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why Join Our Team?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We invest in our people&apos;s growth and well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform border hover:scale-110 hover:-translate-y-2 ${
                  benefitsInView
                    ? "translate-y-0 opacity-100 scale-100"
                    : "translate-y-8 opacity-0 scale-90"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-700 ${
                      benefitsInView
                        ? "rotate-0 scale-100"
                        : "rotate-180 scale-0"
                    }`}
                    style={{ transitionDelay: `${index * 150 + 300}ms` }}
                  >
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className={`font-semibold text-gray-900 dark:text-white transform transition-all duration-500 ${
                      benefitsInView
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 150 + 200}ms` }}
                  >
                    {benefit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-gray-900 dark:to-green-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of innovators working on solutions that matter for
            our planet&apos;s future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Browse All Jobs
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300">
              Join Talent Network
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }

        /* Custom scrollbar for better UX */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  );
};

// Separate Job Listings Component
const JobListings = ({ filteredJobs }: { filteredJobs: Job[] }) => {
  // Create refs for each job card
  const jobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleJobs, setVisibleJobs] = useState<boolean[]>([]);

  useEffect(() => {
    const observers = jobRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleJobs((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [filteredJobs.length]);

  return (
    <div className="space-y-6">
      {filteredJobs.map((job, index) => (
        <div
          key={job.id}
          ref={(el: HTMLDivElement | null) => {
            jobRefs.current[index] = el;
          }}
          className={`bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform border ${
            visibleJobs[index]
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-8 opacity-0 scale-95"
          } hover:scale-[1.02] hover:-translate-y-2`}
          style={{
            transitionDelay: `${index * 100}ms`,
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3
                  className={`text-xl font-bold mb-2 sm:mb-0 text-gray-900 dark:text-white transform transition-all duration-500 ${
                    visibleJobs[index]
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  {job.title}
                </h3>
                <span
                  className={`text-green-500 font-semibold text-lg transform transition-all duration-500 ${
                    visibleJobs[index]
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  {job.salary}
                </span>
              </div>

              <div
                className={`flex flex-wrap gap-4 mb-4 transform transition-all duration-500 ${
                  visibleJobs[index]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex items-center gap-2 text-gray-500">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">{job.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{job.type}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold transform transition-all duration-300 hover:scale-110 ${
                    job.level === "Senior"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-100/20 dark:text-purple-300"
                      : job.level === "Manager"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-100/20 dark:text-blue-300"
                        : job.level === "Mid"
                          ? "bg-green-100 text-green-800 dark:bg-green-100/20 dark:text-green-300"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-100/20 dark:text-orange-300"
                  }`}
                >
                  {job.level} Level
                </span>
              </div>

              <p
                className={`mb-4 text-gray-600 dark:text-gray-300 transform transition-all duration-500 ${
                  visibleJobs[index]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100 + 500}ms` }}
              >
                {job.description}
              </p>

              <div
                className={`flex flex-wrap gap-2 mb-4 transform transition-all duration-500 ${
                  visibleJobs[index]
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100 + 600}ms` }}
              >
                {job.requirements.map((req: string, reqIndex: number) => (
                  <span
                    key={reqIndex}
                    className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform duration-200"
                    style={{ transitionDelay: `${reqIndex * 50}ms` }}
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={`flex flex-col sm:flex-row gap-3 lg:ml-6 transform transition-all duration-500 ${
                visibleJobs[index]
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100 + 700}ms` }}
            >
              <button className="px-6 py-3 rounded-lg border border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-400 dark:hover:text-gray-900 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                View Details
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 group hover:scale-105 hover:-translate-y-1">
                Apply Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
