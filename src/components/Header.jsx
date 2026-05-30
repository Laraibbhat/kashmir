import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Header = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Publications', href: '#publications' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-xl font-light text-white tracking-tight hover:text-cyan-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LM
          </motion.a>

          {/* Navigation Items - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                className="px-3 py-2 text-sm font-light text-gray-400 hover:text-cyan-400 transition-colors relative group"
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
                <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data?.email}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            Contact
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
