import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Awards = () => {
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
                Awards & Recognition
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
                {resumeData.awards.length}
              </div>
              <span className="text-xs text-gray-400 mt-1">Awards</span>
            </motion.div>
          </div>
          <p className="text-gray-400 font-light text-lg">
            Recognition for excellence and innovation in the field
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {resumeData.awards.map((award, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className="relative bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 flex items-start gap-6 group overflow-hidden"
            >
              {/* Glow on Hover */}
              <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white relative z-10"
              >
                {idx + 1}
              </motion.div>
              <p className="text-gray-300 leading-relaxed font-light text-sm group-hover:text-gray-200 transition-colors relative z-10 pt-1">
                {award}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Awards;
