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
          <h2 className="text-5xl font-light text-white tracking-tight">
            Awards & Honors
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
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
              className="bg-slate-900 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 flex items-start gap-4"
            >
              <div className="flex-shrink-0 pt-1">
                <span className="text-2xl">✦</span>
              </div>
              <p className="text-gray-300 leading-relaxed font-light">{award}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Awards;
