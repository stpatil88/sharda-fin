import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Demat Account', href: '/demat-account' },
    { name: 'Market News', href: '/market-news' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'Demat Account', href: '/services#demat' },
    { name: 'Mutual Funds', href: '/services#mutual-funds' },
    { name: 'Insurance', href: '/services#insurance' },
    { name: 'Loans', href: '/services#loans' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Disclaimer', href: '/disclaimer' },
    { name: 'Risk Disclosure', href: '/risk-disclosure' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">Sharada Financial</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Empowering Smart Investments & Financial Awareness. Your trusted partner 
              for comprehensive financial services and market insights.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 70201 30986</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 90281 23995</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>stpatill@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Sahyadri, Sainagar, Kopargaon 423601, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-3 mb-6">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div>
              <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-secondary-600 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} Sharada Financial Services. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>SEBI Registration No: INZ000161534</span>
              <span>•</span>
              <span>NSE Code: AP0397341801</span>
              <span>•</span>
              <span>MCX Code: MCX/AP/160734</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <ExternalLink className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-yellow-400 mb-1">Important Disclaimer</p>
                <p>
                  Investment in securities market is subject to market risks. Please read all scheme 
                  related documents carefully before investing. Past performance is not indicative of 
                  future results. Please consult your financial advisor before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
