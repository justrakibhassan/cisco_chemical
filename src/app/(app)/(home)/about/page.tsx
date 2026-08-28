"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Award,
  Users,
  Globe,
  Lightbulb,
  Shield,
  Leaf,
  Factory,
  Target,
  Eye,
  Heart,
} from "lucide-react";

const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [animatedElements, setAnimatedElements] = useState<Set<number>>(
    new Set()
  );
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    elementsRef.current.forEach((element, index) => {
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setAnimatedElements((prev) => new Set([...prev, index]));
              observer.unobserve(element);
            }
          },
          {
            threshold: 0.1,
            rootMargin: "-50px 0px",
          }
        );

        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const addToRefs = (el: HTMLElement | null, index: number): void => {
    if (el && !elementsRef.current[index]) {
      elementsRef.current[index] = el;
    }
  };

  const stats = [
    { number: "50+", label: "Years of Excellence", icon: Award },
    { number: "500+", label: "Expert Team Members", icon: Users },
    { number: "80+", label: "Countries Served", icon: Globe },
    { number: "1000+", label: "Chemical Solutions", icon: Lightbulb },
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Uncompromising commitment to safety in every process, protecting our people and communities.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description:
        "Leading the transition to green chemistry with eco-friendly solutions and processes.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Pioneering research and development driving the future of chemical technology.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "Building trust through transparency, ethical practices, and reliable partnerships.",
    },
  ];

  const milestones = [
    {
      year: "1973",
      title: "Founded",
      description:
        "Cisco Chemical Inc. established with a vision to revolutionize industrial chemistry",
    },
    {
      year: "1985",
      title: "Global Expansion",
      description:
        "Opened first international facility, marking our journey as a global leader",
    },
    {
      year: "1998",
      title: "Innovation Hub",
      description:
        "Launched state-of-the-art R&D center, driving breakthrough discoveries",
    },
    {
      year: "2010",
      title: "Green Initiative",
      description:
        "Committed to sustainable practices with our comprehensive environmental program",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description:
        "Integrated AI and IoT technologies across all manufacturing processes",
    },
    {
      year: "2024",
      title: "Future Ready",
      description:
        "Leading the industry with next-generation chemical solutions and technologies",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-green-100 dark:from-slate-900 dark:via-green-950 dark:to-green-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-900 via-indigo-900 to-purple-900 dark:from-green-950 dark:via-indigo-950 dark:to-purple-950 text-white">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-purple-600/20 dark:from-green-500/10 dark:to-purple-500/10 animate-pulse"></div>

        <div className="relative max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-32">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-green-200 to-purple-200 dark:from-gray-100 dark:via-green-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                Cisco Chemical Inc.
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-green-100 dark:text-green-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
                Pioneering the future of chemistry through innovation,
                sustainability, and excellence since 1973
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 px-4">
                <div className="flex items-center justify-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/20 dark:border-white/10">
                  <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    Advanced Manufacturing
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/20 dark:border-white/10">
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    Sustainable Solutions
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-white/20 dark:border-white/10">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Global Reach</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements - Hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-20 left-10 w-20 h-20 bg-green-400/20 dark:bg-green-300/10 rounded-full blur-xl animate-bounce"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-32 h-32 bg-purple-400/20 dark:bg-purple-300/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="hidden lg:block absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-400/20 dark:bg-indigo-300/10 rounded-full blur-lg animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
          <div
            ref={(el) => addToRefs(el, 1)}
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 transform transition-all duration-1000 ${
              animatedElements.has(1)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center group cursor-pointer transform transition-all duration-700 hover:scale-105 p-2 sm:p-4 ${
                    animatedElements.has(1)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:shadow-2xl group-hover:shadow-green-500/25 dark:group-hover:shadow-green-400/25 transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                    {stat.number}
                  </div>

                  <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-50 to-green-50 dark:from-green-950/20 dark:to-green-950/20">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div
              ref={(el) => addToRefs(el, 2)}
              className={`space-y-6 sm:space-y-8 transform transition-all duration-1000 ${
                animatedElements.has(2)
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mr-3" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  To deliver innovative chemical solutions that drive industrial
                  progress while maintaining the highest standards of safety,
                  quality, and environmental responsibility. We empower
                  industries worldwide with cutting-edge chemistry.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Our Vision
                  </h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                  To be the world&apos;s most trusted chemical partner, leading
                  the transformation towards sustainable chemistry and setting
                  new benchmarks for innovation, safety, and environmental
                  stewardship.
                </p>
              </div>
            </div>

            <div
              ref={(el) => addToRefs(el, 3)}
              className={`relative mt-8 lg:mt-0 transform transition-all duration-1000 ${
                animatedElements.has(3)
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
            >
              <div className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 dark:bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-purple-400/20 dark:bg-purple-300/10 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    Why Choose Cisco Chemical?
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-200 dark:text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Industry-leading research and development
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-200 dark:text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Comprehensive quality assurance programs
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-200 dark:text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Sustainable and eco-friendly solutions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-200 dark:text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Global supply chain and local support
                      </span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-200 dark:text-green-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">
                        Regulatory compliance expertise
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
          <div
            ref={(el) => addToRefs(el, 4)}
            className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${
              animatedElements.has(4)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Our Core Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              The principles that guide everything we do, from research and
              development to customer partnerships
            </p>
          </div>

          <div
            ref={(el) => addToRefs(el, 5)}
            className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transform transition-all duration-1000 ${
              animatedElements.has(5)
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`group bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-700 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600 cursor-pointer transform hover:-translate-y-2 ${
                    animatedElements.has(5)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:shadow-2xl group-hover:shadow-green-500/25 dark:group-hover:shadow-green-400/25 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950/20">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12">
          <div
            ref={(el) => addToRefs(el, 6)}
            className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${
              animatedElements.has(6)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Our Journey
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Five decades of innovation, growth, and leadership in the chemical
              industry
            </p>
          </div>

          <div
            ref={(el) => addToRefs(el, 7)}
            className={`relative transform transition-all duration-1000 ${
              animatedElements.has(7) ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Timeline Line - Hidden on mobile, shown as left line on tablet+ */}
            <div className="hidden sm:block absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 h-full w-0.5 sm:w-1 bg-gradient-to-b from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 rounded-full"></div>

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-start sm:items-center ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} relative transform transition-all duration-700 ${
                    animatedElements.has(7)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden flex items-start space-x-4 w-full">
                    <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full mt-2"></div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 flex-1 hover:scale-105">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className={`hidden sm:block w-1/2 ${index % 2 === 0 ? "pr-6 lg:pr-8 text-right" : "pl-6 lg:pl-8 text-left"}`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm lg:text-base">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-4 lg:w-6 h-4 lg:h-6 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full border-2 lg:border-4 border-white dark:border-gray-900 shadow-lg z-10"></div>

                  <div className="hidden sm:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-900 via-indigo-900 to-purple-900 dark:from-green-950 dark:via-indigo-950 dark:to-purple-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/10 to-purple-600/10 dark:from-green-500/5 dark:to-purple-500/5 animate-pulse"></div>

        <div
          ref={(el) => addToRefs(el, 8)}
          className={`relative max-w-4xl mx-auto text-center px-4 sm:px-6 transform transition-all duration-1000 ${
            animatedElements.has(8)
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Innovate Together?
          </h2>
          <p className="text-lg sm:text-xl text-green-100 dark:text-green-200 mb-6 sm:mb-8 leading-relaxed">
            Partner with Cisco Chemical Inc. and discover how our expertise can
            drive your business forward with cutting-edge chemical solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button className="bg-white text-green-900 dark:bg-gray-100 dark:text-green-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-green-50 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-sm sm:text-base">
              Contact Our Experts
            </button>
            <button className="border-2 border-white dark:border-gray-300 text-white dark:text-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-green-900 dark:hover:bg-gray-100 dark:hover:text-green-900 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
              View Our Solutions
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
