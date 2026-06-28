import React from 'react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Github, href: 'https://github.com/pratap26pps', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/pratap26pps/', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://www.youtube.com/@pratap26pps', label: 'Youtube' },
    { icon: Mail, href: 'mailto:pankajpatna10321@gmail.com', label: 'Email' }
  ];
  
  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '/services' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-gray-900 dark:to-black text-neutral-700 dark:text-gray-300 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Pankaj Pratap Singh</h3>
            <p className="text-sm text-neutral-600 dark:text-gray-400">
              Co-Founder & CTO – CorpTube Solutions Pvt. Ltd.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">Connect</h4>
            <div className="flex gap-4 flex-wrap">
            {socialLinks.map((social) => (
            <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-gray-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
            >
                <social.icon className="w-5 h-5" />
            </a>
            ))}
            <a
              href="https://www.corptube.in/"
              aria-label="CorpTube"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full overflow-hidden bg-indigo-600 flex items-center justify-center hover:scale-110 transition-all duration-200 ring-2 ring-indigo-400/30"
            >
              <Image
                src="/corptube-icon.png"
                alt="CorpTube"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-neutral-300 dark:border-gray-800 my-8"></div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500 dark:text-gray-500">
          <p>© {currentYear} Pankaj Pratap Singh. All rights reserved.</p>
          <p className="flex items-center gap-2">
          Crafted with <Heart className="w-4 h-4 text-red-500 fill-current" /> and endless curiosity
          </p>
        </div>
      </div>
    </footer>
  );
}