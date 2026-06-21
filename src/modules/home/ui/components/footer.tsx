import Link from "next/link";
import Image from "next/image";
import {
  Youtube,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 border-t border-gray-200">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-12 py-3 lg:py-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8 lg:ml-10">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 overflow-hidden p-2 transition-all duration-300">
                <Image
                  src="/images/logo.png"
                  alt="Cisco Chemicals Logo"
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">
                  Cisco Chemicals
                </h3>
                <p className="text-sm text-green-600 font-medium">Inc.</p>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Providing reliable chemical solutions and services since 1992.
              Your trusted partner for quality and innovation.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-sm">info@ciscochem.com</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                <span className="text-sm">
                  123 Chemical Avenue
                  <br />
                  Industrial District, NY 10001
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900 relative">
              Services
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-600 to-green-400 block"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Chemical Branding", href: "/services/branding" },
                { label: "Product Design", href: "/services/design" },
                { label: "Market Analysis", href: "/services/marketing" },
                { label: "Advertisement", href: "/services/advertisement" },
                { label: "Consulting", href: "/services/consulting" },
              ].map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="group flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-all duration-300"
                  >
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-sm group-hover:underline underline-offset-2">
                      {service.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white relative">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300 block"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "/careers" },
                { label: "Press Kit", href: "/press" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                  >
                    <ChevronRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="text-sm group-hover:underline underline-offset-2">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social*/}
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-gray-900 dark:text-white relative">
              Connect With Us
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-green-600 to-green-400 dark:from-green-400 dark:to-green-300 block"></span>
            </h4>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Follow us on social media for updates and industry insights.
              </p>

              <div className="flex items-center space-x-4">
                <Link
                  href="https://youtube.com"
                  className="group relative p-3 rounded-full bg-white border border-gray-200 hover:border-red-300 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Youtube className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-red-50 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>

                <Link
                  href="https://facebook.com"
                  className="group relative p-3 rounded-full bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <Facebook className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  <div className="absolute inset-0 rounded-full bg-blue-50 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright moved to bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 text-center" suppressHydrationWarning>
            © {currentYear} Cisco Chemicals Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
