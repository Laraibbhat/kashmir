import React from 'react';
import { motion } from 'framer-motion';

const Skills = ({ data }) => {
  const expertise = (() => {
    const raw = data?.technicalExpertise;
    if (!raw) return {};

    if (Array.isArray(raw)) {
      return raw.reduce((acc, curr) => {
        const category = curr?.category?.trim() || "Other";
        const skill = curr?.skill || curr?.name || curr?.title || "";
        if (!acc[category]) acc[category] = [];
        if (skill && !acc[category].includes(skill)) acc[category].push(skill);
        return acc;
      }, {});
    }

    if (typeof raw === "object") {
      return Object.entries(raw).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc[key] = value
            .map((item) => {
              if (typeof item === "string") return item;
              if (item && typeof item === "object") return item.skill || item.name || item.title || "";
              return String(item || "");
            })
            .filter(Boolean);
        } else if (typeof value === "string") {
          acc[key] = [value];
        } else if (value && typeof value === "object") {
          acc[key] = [value.skill || value.name || value.title || ""].filter(Boolean);
        } else {
          acc[key] = [];
        }
        return acc;
      }, {});
    }

    return {};
  })();

  const hasExpertise = Object.keys(expertise).length > 0;
  const hasCompetencies = data?.coreCompetencies && data.coreCompetencies.length > 0;
  if (!hasExpertise && !hasCompetencies) return null;

  const totalSkills = Object.values(expertise).reduce(
    (acc, skills) => acc + (Array.isArray(skills) ? skills.length : 0),
    0
  );

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
      y: -12,
      transition: { duration: 0.3 },
    },
  };

  const getCategoryConfig = (category) => {
    const configs = {
      "Languages & Core": {
        icon: "⚙️",
        gradient: "from-blue-600 to-cyan-500",
        lightGradient: "from-blue-500/10 to-cyan-500/10",
        borderGradient: "from-blue-500 to-cyan-400",
      },
      "Languages & Methods": {
        icon: "📊",
        gradient: "from-blue-600 to-cyan-500",
        lightGradient: "from-blue-500/10 to-cyan-500/10",
        borderGradient: "from-blue-500 to-cyan-400",
      },
      "Frameworks & Libs": {
        icon: "🛠️",
        gradient: "from-cyan-600 to-emerald-500",
        lightGradient: "from-cyan-500/10 to-emerald-500/10",
        borderGradient: "from-cyan-500 to-emerald-400",
      },
      "Tools & Platforms": {
        icon: "💻",
        gradient: "from-cyan-600 to-emerald-500",
        lightGradient: "from-cyan-500/10 to-emerald-500/10",
        borderGradient: "from-cyan-500 to-emerald-400",
      },
      "Cloud & DevOps": {
        icon: "☁️",
        gradient: "from-violet-600 to-purple-500",
        lightGradient: "from-violet-500/10 to-purple-500/10",
        borderGradient: "from-violet-500 to-purple-400",
      },
      "Databases & Tools": {
        icon: "💾",
        gradient: "from-orange-600 to-pink-500",
        lightGradient: "from-orange-500/10 to-pink-500/10",
        borderGradient: "from-orange-500 to-pink-400",
      },
      "Business Skills": {
        icon: "📈",
        gradient: "from-green-600 to-teal-500",
        lightGradient: "from-green-500/10 to-teal-500/10",
        borderGradient: "from-green-500 to-teal-400",
      },
    };
    // Return a default config for unknown categories
    return configs[category] || {
      icon: "💡",
      gradient: "from-indigo-600 to-blue-500",
      lightGradient: "from-indigo-500/10 to-blue-500/10",
      borderGradient: "from-indigo-500 to-blue-400",
    };
  };

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-24 bg-gradient-to-b from-slate-900 to-slate-950"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-5xl font-light text-white tracking-tight">
              Technical Expertise
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-500" />
            <p className="text-gray-400 font-light text-lg">
              Expertise spanning {totalSkills}+ technologies across modern architecture
            </p>
          </motion.div>

          {/* Skills Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {Object.entries(expertise).map((category, idx) => {
              const config = getCategoryConfig(category[0]);
              return (
                <motion.div
                  key={idx}
                  variants={skillBoxVariants}
                  whileHover="hover"
                  className="relative group cursor-pointer"
                >
                  {/* Animated Background Blob - Only on Hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl -z-10"
                    style={{
                      backgroundImage: `linear-gradient(135deg, var(--color1), var(--color2))`,
                      '--color1': 'rgb(6, 182, 212)',
                      '--color2': 'rgb(59, 130, 246)',
                    }} />

                  {/* Card */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 group-hover:border-cyan-500 p-6 rounded-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Top Gradient Accent - Only on Hover */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    {/* Content */}
                    <div className="relative z-10 space-y-4">
                      {/* Header: Icon + Title */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-3xl pt-1">
                          {config.icon}
                        </div>
                        <h3 className="text-base font-medium text-white leading-tight pt-2">
                          {category[0]}
                        </h3>
                      </div>

                      {/* Skills List */}
                      <ul className="space-y-2.5">
                        {category[1].map((skill, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2.5 text-gray-300 text-sm group/item"
                          >
                            <motion.span
                              whileHover={{ scale: 1.6 }}
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} flex-shrink-0 block`} />
                            <span className="font-light group-hover/item:text-gray-100 transition-colors">
                              {skill}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Proficiency Levels */}
          <motion.div variants={itemVariants} className="mt-16 space-y-10">
            <h3 className="text-3xl font-light text-white tracking-tight">
              Core Competencies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.coreCompetencies?.map((comp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative">
                    {/* Background gradient on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />

                    <div className="relative bg-slate-900 border border-slate-700 group-hover:border-cyan-500/50 p-6 rounded-lg transition-all duration-300">
                      {/* Header with Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-white font-light text-base flex-1">{comp.skill}</span>
                        <motion.span
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: idx * 0.08 + 0.2 }}
                          viewport={{ once: true }}
                          className={`px-3 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap ml-2 bg-gradient-to-r ${
                            comp.level === "Expert"
                              ? "from-cyan-600 to-cyan-400"
                              : "from-blue-600 to-blue-400"
                          }`}
                        >
                          {comp.level}
                        </motion.span>
                      </div>

                      {/* Skill Bar */}
                      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse rounded-full" />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: comp.level === "Expert" ? "100%" : "85%"
                          }}
                          transition={{ delay: idx * 0.08 + 0.3, duration: 1, ease: "easeOut" }}
                          viewport={{ once: true }}
                          className={`h-full rounded-full bg-gradient-to-r ${
                            comp.level === "Expert"
                              ? "from-cyan-500 via-blue-500 to-blue-600"
                              : "from-blue-500 to-cyan-500"
                          } shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/70 transition-shadow duration-300`}
                        />
                      </div>

                      {/* Proficiency Indicator */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-light">Proficiency</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: idx * 0.08 + 0.5 }}
                          viewport={{ once: true }}
                          className="text-xs text-cyan-400 font-medium"
                        >
                          {comp.level === "Expert" ? "100%" : "85%"}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack Summary */}
          <motion.div
            variants={itemVariants}
            className="mt-16 p-8 bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h4 className="text-xl font-light text-white mb-2">
                  Tech Stack Diversity
                </h4>
                <p className="text-gray-400 font-light">
                  Proficient across {totalSkills}+ technologies spanning multiple technical domains
                </p>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <div className="text-5xl font-light bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {totalSkills}+
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Skills;
