import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Skills = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const skillBoxVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-5xl font-light text-white tracking-tight">
              Technical Expertise
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {Object.entries(resumeData.technicalExpertise).map((category, idx) => (
              <motion.div
                key={idx}
                variants={skillBoxVariants}
                whileHover="hover"
                className="bg-slate-800 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 group cursor-pointer"
              >
                <h3 className="text-lg font-medium text-white mb-6 text-opacity-80 group-hover:text-opacity-100 transition-all">
                  {category[0]}
                </h3>
                <ul className="space-y-3">
                  {category[1].map((skill, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-2 text-gray-400 text-sm hover:text-cyan-400 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Skills;
