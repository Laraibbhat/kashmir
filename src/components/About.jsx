import React from 'react';
import { motion } from 'framer-motion';

const About = ({ data }) => {
  if (!data) return null;

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

  const metrics = [
    {
      number: data.metrics?.experience || "0+",
      label: "Years of Experience",
      icon: "🚀",
    },
    {
      number: data.metrics?.projectsDelivered || "0+",
      label: "Projects Delivered",
      icon: "✓",
    },
    {
      number: data.metrics?.yearsAsSenior || "0+",
      label: "Years as Senior Engineer",
      icon: "⭐",
    },
    {
      number: data.metrics?.cloudInfraProjects || "0+",
      label: "Cloud Infrastructure Projects",
      icon: "☁️",
    },
  ];

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-5xl font-light text-white tracking-tight">
              About & Impact
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
          </motion.div>

          {/* About Text */}
          <motion.div variants={itemVariants} className="max-w-3xl">
            <div className="space-y-6">
              {(data.aboutDescription || data.summary) && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-cyan-400">
                    What Sets Me Apart
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    {data.aboutDescription || data.summary}
                  </p>
                </div>
              )}

              {data.impactResults && data.impactResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-cyan-400">
                    Impact & Results
                  </h3>
                  <ul className="space-y-3 text-gray-300 font-light">
                    {data.impactResults.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.philosophy && (
                <div className="space-y-2">
                  <h3 className="text-2xl font-light text-cyan-400">
                    My Philosophy
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    {data.philosophy}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500 p-8 rounded-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="text-3xl mb-3">{metric.icon}</div>
                  <div className="text-3xl font-light text-cyan-400 mb-2">
                    {metric.number}
                  </div>
                  <p className="text-sm text-gray-400 font-light">
                    {metric.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Strengths */}
          {data.coreStrengths && data.coreStrengths.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-light text-white tracking-tight">
                Core Strengths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.coreStrengths.map((strength, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-500 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300 font-light">{strength}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
