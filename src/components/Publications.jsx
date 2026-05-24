import React from 'react';
import { motion } from 'framer-motion';
import { resumeData } from '../resumeData';

const Publications = () => {
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
      id="publications"
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
                Publications & Research
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
                {resumeData.publications.length}
              </div>
              <span className="text-xs text-gray-400 mt-1">Publications</span>
            </motion.div>
          </div>
          <p className="text-gray-400 font-light">
            Peer-reviewed research and thought leadership contributions to the technical community
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {resumeData.publications.map((pub, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ x: 8 }}
              className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500 p-8 rounded-lg transition-all duration-300 group overflow-hidden"
            >
              {/* Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-2xl flex-shrink-0">📚</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {pub.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                      <p className="text-cyan-400 text-sm font-medium tracking-wide">
                        {pub.journal}
                      </p>
                      <span className="hidden sm:inline text-gray-600">•</span>
                      <span className="text-gray-500 text-sm">
                        {pub.date}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm font-light leading-relaxed">
                  {pub.description}
                </p>

                {/* Subtle Action Indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="mt-4 flex items-center gap-2 text-cyan-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span>View Publication</span>
                  <span>→</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Publications;
