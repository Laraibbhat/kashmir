import React from 'react';
import { motion } from 'framer-motion';

const Experience = ({ data }) => {
  if (!data || data.length === 0) return null;

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
          <div className="flex items-end justify-between">
            <div className="space-y-4 flex-1">
              <h2 className="text-5xl font-light text-white tracking-tight">
                Professional Experience
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
                {data.length}
              </div>
              <span className="text-xs text-gray-400 mt-1">Positions</span>
            </motion.div>
          </div>
          <p className="text-gray-400 font-light text-lg">
            A proven track record of delivering high-impact solutions across diverse domains
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {data.map((job, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Accent Gradient on Hover */}
              <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl mt-1">💼</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-white mb-1">
                          {job.title}
                        </h3>
                        <p className="text-cyan-400 text-sm font-medium tracking-wide">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    {job.projectFocus && (
                      <p className="text-xs text-gray-500 mt-3 ml-11 italic">
                        Project: {job.projectFocus}
                      </p>
                    )}
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 text-cyan-400 rounded text-sm font-medium whitespace-nowrap group-hover:bg-slate-700 transition-colors"
                  >
                    {job.period}
                  </motion.span>
                </div>

                {/* Highlights with Better Styling */}
                <div className="space-y-4 mt-6">
                  {job.highlights.map((highlight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 group/item"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white"
                      >
                        {i + 1}
                      </motion.div>
                      <span className="text-gray-300 text-sm leading-relaxed font-light group-hover/item:text-gray-200 transition-colors">
                        {highlight}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Experience;
