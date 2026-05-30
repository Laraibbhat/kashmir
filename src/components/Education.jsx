import React from 'react';
import { motion } from 'framer-motion';

const Education = ({ data }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <motion.section
      id="education"
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
                Education & Credentials
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
              <span className="text-xs text-gray-400 mt-1">Degrees</span>
            </motion.div>
          </div>
          <p className="text-gray-400 font-light text-lg">
            Advanced education with distinction and continuous learning mindset
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8"
        >
          {data.map((edu, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl flex-shrink-0 mt-1">🎓</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-light text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-cyan-400 text-sm font-medium tracking-wide">
                          {edu.school}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="px-4 py-2 bg-slate-900 border border-slate-700 text-cyan-400 rounded text-sm font-medium whitespace-nowrap group-hover:border-cyan-500 group-hover:bg-slate-800 transition-all"
                  >
                    {edu.year}
                  </motion.span>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-gray-300 leading-relaxed text-sm font-light ml-11 group-hover:text-gray-200 transition-colors"
                >
                  {edu.details}
                </motion.p>

                {/* Key Achievements */}
                {edu.achievements && (
                  <div className="mt-6 ml-11 space-y-3">
                    {edu.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-2.5 text-xs text-gray-400 group-hover:text-gray-300 transition-colors"
                      >
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>{achievement}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Education;
