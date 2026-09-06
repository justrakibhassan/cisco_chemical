"use client";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { submitContactInquiryAction } from "@/modules/home/actions";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building2,
  User,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

interface ContactCardData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
  gradient: string;
}

interface InfoCardData {
  title: string;
  description: string;
  icon: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  inquiry: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    inquiry: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [visibleInfo, setVisibleInfo] = useState<Set<number>>(new Set());

  const heroRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const infoCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const index = parseInt(element.dataset.index || "0");

            if (element.dataset.type === "contact-card") {
              setVisibleCards((prev) => new Set([...prev, index]));
            } else if (element.dataset.type === "info-card") {
              setVisibleInfo((prev) => new Set([...prev, index]));
            } else if (element.dataset.type === "form") {
              setTimeout(() => setIsVisible(true), 200);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    // Observe contact cards
    contactCardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    // Observe form
    if (formRef.current) observer.observe(formRef.current);

    // Observe info cards
    infoCardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Initial hero animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (heroRef.current) {
        heroRef.current.classList.add("animate-fade-in");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields (Name, Email, Message)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactInquiryAction(formData);
      if (res.success) {
        toast.success("Inquiry Submitted Successfully!", {
          description:
            "Our chemical engineering specialists will contact you within 24 business hours.",
        });
        setFormData({
          name: "",
          email: "",
          company: "",
          inquiry: "general",
          message: "",
        });
      } else {
        toast.error(res.error || "Failed to submit message");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white pt-18">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .animate-slide-in-down {
          animation: slideInDown 0.6s ease-out forwards;
        }

        .card-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s ease-out;
        }

        .card-animate.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .form-animate {
          opacity: 0;
          transform: translateX(40px);
          transition: all 0.8s ease-out;
        }

        .form-animate.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .stagger-1 {
          animation-delay: 0.1s;
        }
        .stagger-2 {
          animation-delay: 0.2s;
        }
        .stagger-3 {
          animation-delay: 0.3s;
        }
        .stagger-4 {
          animation-delay: 0.4s;
        }
        .stagger-5 {
          animation-delay: 0.5s;
        }
        .stagger-6 {
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Hero Section */}
      <div
        ref={heroRef}
        className="py-16 bg-white dark:bg-slate-800 transition-colors opacity-0"
      >
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-slide-in-down stagger-1">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-600 dark:text-slate-300 animate-slide-in-down stagger-2">
            Ready to innovate with industry-leading chemical solutions? Our
            expert team is here to help you achieve your goals.
          </p>
        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 animate-fade-in-left">
                Get in Touch
              </h2>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-slate-300 animate-fade-in-left stagger-1">
                Whether you need custom chemical formulations, bulk orders, or
                technical consulting, we&apos;re here to provide expert
                solutions for your business needs.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {(
                [
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    content:
                      "1234 Industrial Blvd\nChemical District, NY 10001",
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    content: "+1 (555) 123-4567\n+1 (555) 987-6543",
                    gradient: "from-emerald-500 to-teal-500",
                  },
                  {
                    icon: Mail,
                    title: "Email Us",
                    content: "info@chemcorp.com\nsales@chemcorp.com",
                    gradient: "from-teal-500 to-cyan-500",
                  },
                  {
                    icon: Clock,
                    title: "Business Hours",
                    content:
                      "Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM",
                    gradient: "from-green-600 to-green-500",
                  },
                ] as ContactCardData[]
              ).map((item, index) => (
                <div
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    contactCardsRef.current[index] = el;
                  }}
                  data-type="contact-card"
                  data-index={index}
                  className={`card-animate ${visibleCards.has(index) ? "visible" : ""} p-6 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}
                  >
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="whitespace-pre-line text-gray-600 dark:text-slate-400">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="p-6 rounded-2xl border-2 border-dashed transition-colors border-red-400 dark:border-red-600/50 bg-red-50 dark:bg-red-900/10 animate-scale-in stagger-5">
              <h3 className="text-xl font-semibold mb-2 text-red-600">
                24/7 Emergency Hotline
              </h3>
              <p className="text-2xl font-bold text-red-600">
                +1 (555) EMERGENCY
              </p>
              <p className="text-sm mt-2 text-gray-600 dark:text-slate-400">
                For chemical spills, safety incidents, or urgent technical
                support
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div
            ref={formRef}
            data-type="form"
            className={`form-animate ${isVisible ? "visible" : ""} p-8 rounded-3xl border shadow-2xl transition-colors bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700`}
          >
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Send us a Message
            </h3>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium">
                    <Mail className="h-4 w-4 mr-2 text-green-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <Building2 className="h-4 w-4 mr-2 text-green-600" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                  placeholder="Your company name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <ChevronDown className="h-4 w-4 mr-2 text-green-600" />
                  Inquiry Type
                </label>
                <select
                  name="inquiry"
                  value={formData.inquiry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white"
                >
                  <option value="general">General Inquiry</option>
                  <option value="products">Product Information</option>
                  <option value="custom">Custom Solutions</option>
                  <option value="partnership">Partnership</option>
                  <option value="technical">Technical Support</option>
                  <option value="quote">Request Quote</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium">
                  <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border transition-colors focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400"
                  placeholder="Tell us about your chemical needs, project requirements, or any questions you have..."
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 hover:shadow-lg"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {(
            [
              {
                title: "Quality Assurance",
                description:
                  "ISO 9001:2015 certified facility with rigorous quality control processes.",
                icon: "🔬",
              },
              {
                title: "Environmental Safety",
                description:
                  "Committed to sustainable practices and environmental responsibility.",
                icon: "🌱",
              },
              {
                title: "Expert Support",
                description:
                  "24/7 technical support from our team of chemical engineering experts.",
                icon: "👨‍🔬",
              },
            ] as InfoCardData[]
          ).map((item, index) => (
            <div
              key={index}
              ref={(el: HTMLDivElement | null) => {
                infoCardsRef.current[index] = el;
              }}
              data-type="info-card"
              data-index={index}
              className={`card-animate ${visibleInfo.has(index) ? "visible" : ""} text-center p-6 rounded-2xl border transition-all duration-300 hover:scale-105 bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-lg font-semibold mb-2 text-green-600">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
