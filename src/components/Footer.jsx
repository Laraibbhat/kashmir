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

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-slate-950 text-gray-300 py-16 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
        >
          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Contact</h3>
            <a
              href={`mailto:${resumeData.email}`}
              className="flex items-center space-x-3 hover:text-cyan-400 transition text-sm group"
            >
              <span className="text-gray-500 group-hover:text-cyan-400 transition">→</span>
              <span>{resumeData.email}</span>
            </a>
            <a
              href={`tel:${resumeData.phone}`}
              className="flex items-center space-x-3 hover:text-cyan-400 transition text-sm group"
            >
              <span className="text-gray-500 group-hover:text-cyan-400 transition">→</span>
              <span>{resumeData.phone}</span>
            </a>
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-500">→</span>
              <span>{resumeData.location}</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Navigate</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#experience', label: 'Experience' },
                { href: '#skills', label: 'Skills' },
                { href: '#education', label: 'Education' }
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-cyan-400 transition flex items-center space-x-2 group"
                  >
                    <span className="text-gray-500 group-hover:text-cyan-400 transition">→</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-light text-white mb-6 tracking-wide">Connect</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Open to exciting opportunities and collaborations. Let's discuss how I can contribute to your vision.
            </p>
            <motion.a
              href="mailto:lmushtaq10@gmail.com"
              whileHover={{ x: 4 }}
              whileTap={{ x: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-700 hover:border-cyan-400 hover:text-cyan-400 rounded text-sm transition"
            >
              <span>Send Email</span>
              <span>→</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="h-px bg-slate-800 my-8"
        />

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-gray-500 text-sm space-y-2"
        >
          <p>© 2024 {resumeData.name}. All rights reserved.</p>
          <p className="text-xs">Crafted with attention to detail using React, Tailwind CSS & Framer Motion</p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
