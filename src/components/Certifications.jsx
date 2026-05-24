import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Certifications = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      id="certifications"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-slate-900"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4 mb-16"
        >
          <div className="flex items-end justify-between">
            <div className="space-y-4 flex-1">
              <h2 className="text-5xl font-light text-white tracking-tight">
                Certifications & Credentials
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center ml-8"
            >
              <div className="text-4xl font-light bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {resumeData.certifications.length}
              </div>
              <span className="text-xs text-gray-400 mt-1">Professional Credentials</span>
            </motion.div>
          </div>
          <p className="text-gray-400 font-light">
            Industry-recognized certifications demonstrating commitment to professional excellence
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {resumeData.certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className="relative bg-slate-800 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Hover Background Effect */}
              <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl mt-1">📜</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-light text-white mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-cyan-400 text-sm font-medium tracking-wide">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 text-cyan-400 rounded text-sm font-medium whitespace-nowrap group-hover:bg-slate-800 transition-colors"
                  >
                    {cert.date}
                  </motion.span>
                </div>

                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Certifications;
