import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Footer = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const socialLinks = [
    { icon: "💼", label: "LinkedIn", url: "https://www.linkedin.com/in/laraib-bhat" },
    { icon: "🐙", label: "GitHub", url: "https://github.com/laraibbhat" },
    { icon: "📧", label: "Email", url: `mailto:${resumeData.email}` },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-slate-950 text-gray-300 py-20 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">
              {resumeData.name.split(' ')[0]}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-light">
              Senior Software Engineer crafting elegant solutions to complex problems.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Navigate</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#about', label: 'About' },
                { href: '#skills', label: 'Skills' },
                { href: '#experience', label: 'Experience' },
                { href: '#education', label: 'Education' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-cyan-400 transition-colors flex items-center space-x-2 group font-light"
                  >
                    <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Connect</h3>
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${resumeData.email}`}
                className="hover:text-cyan-400 transition-colors flex items-center space-x-2 group font-light"
              >
                <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                <span>{resumeData.email}</span>
              </a>
              <a
                href={`tel:${resumeData.phone}`}
                className="hover:text-cyan-400 transition-colors flex items-center space-x-2 group font-light"
              >
                <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                <span>{resumeData.phone}</span>
              </a>
              <div className="flex items-center space-x-2 text-sm font-light">
                <span className="text-gray-500">→</span>
                <span>{resumeData.location}</span>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Collaborate</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              Open to exciting opportunities and partnerships. Let's build something amazing together.
            </p>
            <motion.a
              href={`mailto:${resumeData.email}`}
              whileHover={{ x: 4 }}
              whileTap={{ x: 0 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded font-light hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
            >
              <span>Get In Touch</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-slate-800 to-slate-800 my-12"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-8"
        >
          <div className="flex items-center gap-6">
            {socialLinks.map((social, idx) => (
              <motion.a
                key={idx}
                variants={itemVariants}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-lg hover:border-cyan-500 hover:bg-slate-800 transition-all group"
                title={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 text-xs text-gray-500 font-light"
          >
            <div className="h-px w-8 bg-slate-700 hidden sm:block" />
            <span>© {new Date().getFullYear()} Laraib Mushtaq. All rights reserved.</span>
            <div className="h-px w-8 bg-slate-700 hidden sm:block" />
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
