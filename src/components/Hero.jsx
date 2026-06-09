import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white pt-40 pb-20 overflow-hidden"
    >
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          {/* Text Content */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <motion.h1
                variants={itemVariants}
                className="text-6xl lg:text-7xl font-light tracking-tight text-white leading-tight"
              >
                {data?.name?.split(' ').map((word, idx) => (
                  <div key={idx}>{word}</div>
                ))}
              </motion.h1>
            </div>

            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
              <span className="text-xl font-light text-cyan-400 tracking-wide">
                {data?.title}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed font-light">
                {data?.summary}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-xs tracking-widest">EMAIL</span>
                  <a 
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data?.email}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline">
                    {data?.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors">
                  <span className="text-xs tracking-widest">PHONE</span>
                  <a href={`tel:${data?.phone}`} className="hover:underline">
                    {data?.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="text-xs tracking-widest">LOCATION</span>
                  <span>{data?.location}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex gap-4 pt-8"
            >
              <motion.a
                href="#experience"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded hover:shadow-xl hover:shadow-cyan-500/30 transition-all"
              >
                Explore My Work
              </motion.a>
              <motion.a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data?.email}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 5 }}
                whileTap={{ x: 0 }}
                className="px-8 py-3 border border-gray-600 text-white font-medium rounded hover:border-cyan-400 hover:text-cyan-400 transition-all"
              >
                Get In Touch
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Profile Image - Smaller and Refined */}
          <motion.div
            variants={itemVariants}
            className="relative lg:col-span-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl opacity-30 blur-xl" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20" />
              <img
                src={data?.avatarUrl || "/profilePhoto.jpeg"}
                alt={data?.name || "Profile Photo"}
                className="relative rounded-xl shadow-2xl w-full object-cover aspect-[3/4]"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
      >
        <div className="text-gray-500 text-center text-sm tracking-widest">
          <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
