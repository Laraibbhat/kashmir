import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Experience = () => {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      id="experience"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-slate-950"
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-4 mb-16"
        >
          <h2 className="text-5xl font-light text-white tracking-tight">
            Professional Experience
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {resumeData.experience.map((job, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className="relative bg-slate-900 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-light text-white mb-2">{job.title}</h3>
                  <p className="text-cyan-400 text-sm font-medium tracking-wide">{job.company}</p>
                  {job.projectFocus && (
                    <p className="text-xs text-gray-500 mt-2">
                      Project Focus: {job.projectFocus}
                    </p>
                  )}
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-cyan-400 rounded text-sm font-medium whitespace-nowrap"
                >
                  {job.period}
                </motion.span>
              </div>

              <ul className="space-y-3">
                {job.highlights.map((highlight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3 text-gray-400 text-sm"
                  >
                    <span className="text-cyan-400 mt-1">▸</span>
                    <span className="leading-relaxed">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Experience;
