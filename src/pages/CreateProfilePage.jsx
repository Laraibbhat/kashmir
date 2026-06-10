import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Footer from "../components/Footer";

// SVG Icons
const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const steps = [
  {
    title: "Basic Info",
    description: "A clean start with your name, title, contact details and summary.",
    icon: "👤",
  },
  {
    title: "Experience Metrics",
    description: "Showcase your career impact with measurable values.",
    icon: "📊",
  },
  {
    title: "Technical Expertise",
    description: "Add the skills that define your technical profile.",
    icon: "⚙️",
  },
  {
    title: "Professional Experience",
    description: "Capture your most powerful work stories and achievements.",
    icon: "💼",
  },
  {
    title: "Education",
    description: "List your degrees, school, and standout achievements.",
    icon: "🎓",
  },
  {
    title: "Final Details",
    description: "Wrap up with certifications, publications, awards, and competencies.",
    icon: "⭐",
  },
];

// Enhanced animation variants
const stepVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } },
  exit: { opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.3 } },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20 },
};

// Change this to your backend URL
// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://portfolio-backend-tbur.onrender.com";

function CreateProfilePage() {
  const navigate = useNavigate();
  const { createProfile, loading, error } = useProfile();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experienceYears: 0,
    yearsAsSenior: 0,
    projectsDelivered: 0,
    cloudInfraProjects: 0,
    teamsManagedInfra: 0,
    performanceOptimization: 0,
    technicalExpertise: [],
    experiences: [],
    education: [],
    certifications: [],
    publications: [],
    awards: [],
    coreCompetencies: [],
    avatarKey: null,
    avatarUrl: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const [validationError, setValidationError] = useState("");

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  // Resize image client-side to reduce upload size (keeps free-tier costs low)
  const resizeImage = (file, maxSize = 800, quality = 0.8) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob);
            else reject(new Error('Failed to convert image'));
          },
          'image/jpeg',
          quality,
        );
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });

  const getFileExt = (name = '') => {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  };

  const uploadToPresigned = async (fileBlob, filename, contentType) => {
    // Request presigned URL from backend
    const presignResp = await fetch(`${API_BASE_URL}/api/uploads/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, contentType }),
    });
    if (!presignResp.ok) throw new Error('Failed to get presigned URL');
    const presignData = await presignResp.json();
    const { uploadUrl, key } = presignData;

    // Upload directly to S3 using signed URL
    const putResp = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: fileBlob,
    });
    if (!putResp.ok) throw new Error('Failed to upload to storage');

    // For new profile creation, we don't need a separate association call.
    // We return the key so it can be sent in the final handleSubmit 
    // along with the rest of the profile data.
    return { key };
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    setValidationError('');
    try {
      const ext = getFileExt(file.name) || 'jpg';
      const resizedBlob = await resizeImage(file, 600, 0.8);
      const filename = `${formData.username || 'anon'}-${Date.now()}.${ext}`;
      const contentType = 'image/jpeg';

      // show preview immediately
      const previewUrl = URL.createObjectURL(resizedBlob);
      setAvatarPreview(previewUrl);

      const { key } = await uploadToPresigned(resizedBlob, filename, contentType);
      setFieldValue('avatarKey', key);
      setFieldValue('avatarUrl', previewUrl);
    } catch (err) {
      console.error(err);
      setValidationError('Avatar upload failed. Try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const addListItem = (key, template = {}) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), template],
    }));
  };

  const updateListItem = (key, index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev[key] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [key]: list };
    });
    setValidationError("");
  };

  const removeListItem = (key, index) => {
    setFormData((prev) => {
      const list = [...(prev[key] || [])];
      list.splice(index, 1);
      return { ...prev, [key]: list };
    });
    setValidationError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!formData.username.trim() || !formData.name.trim()) {
        setValidationError("Username and name are required.");
        return false;
      }
      if (formData.username.trim().length < 3) {
        setValidationError("Username must be at least 3 characters.");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (formData.technicalExpertise.length === 0) {
        setValidationError("Add at least one technical expertise entry.");
        return false;
      }
      for (let i = 0; i < formData.technicalExpertise.length; i += 1) {
        const item = formData.technicalExpertise[i];
        if (!item.category?.trim() || !item.skill?.trim()) {
          setValidationError(`Expertise #${i + 1} needs category and skill.`);
          return false;
        }
      }
    }

    if (step === 3) {
      for (let i = 0; i < formData.experiences.length; i += 1) {
        const exp = formData.experiences[i];
        if (!exp.title?.trim() || !exp.company?.trim()) {
          setValidationError(`Experience #${i + 1} requires title and company.`);
          return false;
        }
      }
    }

    if (step === 4) {
      for (let i = 0; i < formData.education.length; i += 1) {
        const edu = formData.education[i];
        if (!edu.degree?.trim() || !edu.school?.trim()) {
          setValidationError(`Education #${i + 1} requires degree and school.`);
          return false;
        }
      }
    }

    setValidationError("");
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const previousStep = () => {
    setValidationError("");
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const buildDisplayOrderedList = (items) =>
    (items || []).map((item, index) => ({ ...item, displayOrder: index + 1 }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const payload = {
      username: formData.username.trim(),
      name: formData.name.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: formData.location.trim(),
      summary: formData.summary.trim(),
      experienceYears: Number(formData.experienceYears) || 0,
      yearsAsSenior: Number(formData.yearsAsSenior) || 0,
      projectsDelivered: Number(formData.projectsDelivered) || 0,
      cloudInfraProjects: Number(formData.cloudInfraProjects) || 0,
      teamsManagedInfra: Number(formData.teamsManagedInfra) || 0,
      performanceOptimization: Number(formData.performanceOptimization) || 0,
      technicalExpertise: buildDisplayOrderedList(formData.technicalExpertise),
      experiences: buildDisplayOrderedList(
        (formData.experiences || []).map((exp) => ({
          ...exp,
          highlights: buildDisplayOrderedList(exp.highlights || []),
        })),
      ),
      education: buildDisplayOrderedList(
        (formData.education || []).map((edu) => ({
          ...edu,
          achievements: buildDisplayOrderedList(edu.achievements || []),
        })),
      ),
      certifications: buildDisplayOrderedList(formData.certifications),
      publications: buildDisplayOrderedList(formData.publications),
      awards: buildDisplayOrderedList(formData.awards),
      coreCompetencies: buildDisplayOrderedList(formData.coreCompetencies),
      avatarKey: formData.avatarKey || null,
      avatarUrl: formData.avatarUrl || null,
    };

    const result = await createProfile(payload);
    if (result.success) {
      navigate(`/${formData.username.trim()}`);
    }
  };

  const displayError = error || validationError;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div className="space-y-8" variants={containerVariants} initial="initial" animate="animate">
            {/* Avatar Section - Center and Elegant */}
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                {/* Avatar Background Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 blur-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Avatar Container */}
                <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl shadow-cyan-500/20 flex items-center justify-center">
                  {avatarPreview || formData.avatarUrl ? (
                    <motion.img 
                      src={avatarPreview || formData.avatarUrl} 
                      alt="avatar" 
                      className="h-full w-full object-cover"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  ) : (
                    <motion.div 
                      className="flex flex-col items-center justify-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-4xl">📷</span>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Avatar Upload Section */}
              <div className="mt-8 text-center space-y-3 max-w-sm">
                <label className="block">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all">
                      <UploadIcon />
                      {uploadingAvatar ? "Uploading..." : "Choose Photo"}
                    </div>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </motion.div>
                </label>
                <p className="text-xs text-slate-400">Square image recommended • Max 5MB • Auto-optimized</p>
              </div>
            </motion.div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Username *</span>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) => setFieldValue("username", e.target.value)}
                    placeholder="newuser1234"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                  />
                </div>
              </motion.label>
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Full Name *</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                />
              </motion.label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Professional Title</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                />
              </motion.label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="space-y-2 group">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Location</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFieldValue("location", e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200"
                />
              </motion.label>
            </div>

            <motion.label variants={itemVariants} className="space-y-2 group">
              <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Professional Summary</span>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={(e) => setFieldValue("summary", e.target.value)}
                rows="5"
                placeholder="Tell your professional story. Highlight your key achievements and what drives your career..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-slate-800/80 transition-all duration-200 resize-none"
              />
            </motion.label>
          </motion.div>
        );

      case 1:
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="initial" animate="animate">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>📅</span> Years Experience
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.experienceYears}
                  onChange={(e) => setFieldValue("experienceYears", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>⭐</span> Years as Senior
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.yearsAsSenior}
                  onChange={(e) => setFieldValue("yearsAsSenior", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>✅</span> Projects Delivered
                </span>
                <input
                  type="number"
                  min="0"
                  value={formData.projectsDelivered}
                  onChange={(e) => setFieldValue("projectsDelivered", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>☁️</span> Cloud Infra Projects
                </span>
                <input
                  type="number"
                  min="0"
                  value={formData.cloudInfraProjects}
                  onChange={(e) => setFieldValue("cloudInfraProjects", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>👥</span> Teams Managed
                </span>
                <input
                  type="number"
                  min="0"
                  value={formData.teamsManagedInfra}
                  onChange={(e) => setFieldValue("teamsManagedInfra", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
              <motion.label variants={itemVariants} className="group space-y-2">
                <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition flex items-center gap-2">
                  <span>⚡</span> Optimization %
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performanceOptimization}
                  onChange={(e) => setFieldValue("performanceOptimization", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
              </motion.label>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="initial" animate="animate">
            <div className="space-y-4">
              {(formData.technicalExpertise || []).map((item, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-slate-950/20"
                >
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Category</span>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateListItem("technicalExpertise", index, "category", e.target.value)}
                      placeholder="e.g. Programming Languages"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Skill</span>
                    <input
                      type="text"
                      value={item.skill}
                      onChange={(e) => updateListItem("technicalExpertise", index, "skill", e.target.value)}
                      placeholder="e.g. Java, Python, TypeScript"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <motion.button
                    type="button"
                    onClick={() => removeListItem("technicalExpertise", index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-2.5 rounded-lg bg-red-500/80 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-200"
                  >
                    Remove
                  </motion.button>
                </motion.div>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={() => addListItem("technicalExpertise", { category: "", skill: "" })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <span className="text-lg">+</span> Add Expertise
            </motion.button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="initial" animate="animate">
            {(formData.experiences || []).map((exp, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-slate-950/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-cyan-400">Experience #{index + 1}</span>
                  <span className="text-sm text-slate-400">💼</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Job Title *</span>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateListItem("experiences", index, "title", e.target.value)}
                      placeholder="Senior Software Engineer"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Company *</span>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateListItem("experiences", index, "company", e.target.value)}
                      placeholder="Tech Company Inc."
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Period</span>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateListItem("experiences", index, "period", e.target.value)}
                      placeholder="Jan 2020 - Present"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Project Focus</span>
                    <input
                      type="text"
                      value={exp.projectFocus}
                      onChange={(e) => updateListItem("experiences", index, "projectFocus", e.target.value)}
                      placeholder="Led microservices development..."
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-300">✨ Highlights</span>
                    <motion.button
                      type="button"
                      onClick={() =>
                        updateListItem("experiences", index, "highlights", [
                          ...(exp.highlights || []),
                          { highlight: "" },
                        ])
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-all"
                    >
                      + Add
                    </motion.button>
                  </div>
                  {(exp.highlights || []).map((highlightItem, hi) => (
                    <motion.div 
                      key={hi} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-[1fr_auto] gap-3"
                    >
                      <input
                        type="text"
                        value={highlightItem.highlight}
                        onChange={(e) => {
                          const nextHighlights = (exp.highlights || []).map((item, idx) =>
                            idx === hi ? { ...item, highlight: e.target.value } : item,
                          );
                          updateListItem("experiences", index, "highlights", nextHighlights);
                        }}
                        placeholder="Implemented new payment gateway..."
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => {
                          const nextHighlights = (exp.highlights || []).filter((_, idx) => idx !== hi);
                          updateListItem("experiences", index, "highlights", nextHighlights);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-2.5 text-red-300 hover:bg-red-500/30 transition-all"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    type="button"
                    onClick={() => removeListItem("experiences", index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-red-500/80 hover:bg-red-600 text-white px-4 py-2.5 text-sm font-semibold transition-all"
                  >
                    Remove Experience
                  </motion.button>
                </div>
              </motion.div>
            ))}

            <motion.button
              type="button"
              onClick={() =>
                addListItem("experiences", {
                  title: "",
                  company: "",
                  period: "",
                  projectFocus: "",
                  highlights: [],
                })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <span className="text-lg">+</span> Add Experience
            </motion.button>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="space-y-6" variants={containerVariants} initial="initial" animate="animate">
            {(formData.education || []).map((edu, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-slate-950/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-cyan-400">Education #{index + 1}</span>
                  <span className="text-lg">🎓</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Degree *</span>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateListItem("education", index, "degree", e.target.value)}
                      placeholder="Master of Science in Computer Science"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">School/University *</span>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateListItem("education", index, "school", e.target.value)}
                      placeholder="University of Technology"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Year</span>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateListItem("education", index, "year", e.target.value)}
                      placeholder="2020"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                  <label className="space-y-2 group">
                    <span className="text-sm font-semibold text-slate-300 group-focus-within:text-cyan-400 transition">Specialization</span>
                    <input
                      type="text"
                      value={edu.details}
                      onChange={(e) => updateListItem("education", index, "details", e.target.value)}
                      placeholder="Distributed Systems & Cloud Computing"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                    />
                  </label>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-300">🏆 Achievements</span>
                    <motion.button
                      type="button"
                      onClick={() => updateListItem("education", index, "achievements", [
                        ...(edu.achievements || []),
                        { achievement: "" },
                      ])}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-sm text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-all"
                    >
                      + Add
                    </motion.button>
                  </div>
                  {(edu.achievements || []).map((achievementItem, ai) => (
                    <motion.div 
                      key={ai}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-[1fr_auto] gap-3"
                    >
                      <input
                        type="text"
                        value={achievementItem.achievement}
                        onChange={(e) => {
                          const nextAchievements = (edu.achievements || []).map((item, idx) =>
                            idx === ai ? { ...item, achievement: e.target.value } : item,
                          );
                          updateListItem("education", index, "achievements", nextAchievements);
                        }}
                        placeholder="Graduated with honors • GPA 3.9"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => {
                          const nextAchievements = (edu.achievements || []).filter((_, idx) => idx !== ai);
                          updateListItem("education", index, "achievements", nextAchievements);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-2.5 text-red-300 hover:bg-red-500/30 transition-all"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    type="button"
                    onClick={() => removeListItem("education", index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-lg bg-red-500/80 hover:bg-red-600 text-white px-4 py-2.5 text-sm font-semibold transition-all"
                  >
                    Remove Education
                  </motion.button>
                </div>
              </motion.div>
            ))}

            <motion.button
              type="button"
              onClick={() =>
                addListItem("education", {
                  degree: "",
                  school: "",
                  year: "",
                  details: "",
                  achievements: [],
                })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
            >
              <span className="text-lg">+</span> Add Education
            </motion.button>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="space-y-8" variants={containerVariants} initial="initial" animate="animate">
            {/* Certifications */}
            <motion.section variants={itemVariants} className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <span>🏅</span> Certifications
                </h3>
                <span className="text-sm text-slate-500">({formData.certifications?.length || 0})</span>
              </div>

              <div className="space-y-3">
                {(formData.certifications || []).map((cert, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3 p-3 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500/30 transition"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateListItem("certifications", index, "name", e.target.value)}
                        placeholder="AWS Certified Solutions Architect"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateListItem("certifications", index, "issuer", e.target.value)}
                        placeholder="Issuing Organization"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.certificationDate}
                        onChange={(e) => updateListItem("certifications", index, "certificationDate", e.target.value)}
                        placeholder="2023-06"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <input
                        type="text"
                        value={cert.description}
                        onChange={(e) => updateListItem("certifications", index, "description", e.target.value)}
                        placeholder="Brief description of certification"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={() => removeListItem("certifications", index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-1.5 text-red-300 text-sm hover:bg-red-500/30 transition"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() => addListItem("certifications", { name: "", issuer: "", certificationDate: "", description: "" })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition"
              >
                + Add Certification
              </motion.button>
            </motion.section>

            {/* Publications */}
            <motion.section variants={itemVariants} className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <span>📰</span> Publications
                </h3>
                <span className="text-sm text-slate-500">({formData.publications?.length || 0})</span>
              </div>

              <div className="space-y-3">
                {(formData.publications || []).map((publication, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3 p-3 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500/30 transition"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={publication.title}
                        onChange={(e) => updateListItem("publications", index, "title", e.target.value)}
                        placeholder="Publication Title"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <input
                        type="text"
                        value={publication.journal}
                        onChange={(e) => updateListItem("publications", index, "journal", e.target.value)}
                        placeholder="Journal/Publication"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={publication.publicationDate}
                        onChange={(e) => updateListItem("publications", index, "publicationDate", e.target.value)}
                        placeholder="2023-06"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <input
                        type="text"
                        value={publication.description}
                        onChange={(e) => updateListItem("publications", index, "description", e.target.value)}
                        placeholder="Brief description"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                    </div>
                    <div className="flex justify-end">
                      <motion.button
                        type="button"
                        onClick={() => removeListItem("publications", index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-1.5 text-red-300 text-sm hover:bg-red-500/30 transition"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() => addListItem("publications", { title: "", journal: "", publicationDate: "", description: "" })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition"
              >
                + Add Publication
              </motion.button>
            </motion.section>

            {/* Awards & Competencies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Awards */}
              <motion.section variants={itemVariants} className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                    <span>🎖️</span> Awards
                  </h3>
                  <span className="text-sm text-slate-500">({formData.awards?.length || 0})</span>
                </div>

                <div className="space-y-3">
                  {(formData.awards || []).map((award, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-[1fr_auto] gap-3 items-start p-3 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500/30 transition"
                    >
                      <input
                        type="text"
                        value={award.awardText}
                        onChange={(e) => updateListItem("awards", index, "awardText", e.target.value)}
                        placeholder="Employee of the Year • 2023"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeListItem("awards", index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-2.5 text-red-300 hover:bg-red-500/30 transition"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={() => addListItem("awards", { awardText: "" })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition"
                >
                  + Add Award
                </motion.button>
              </motion.section>

              {/* Core Competencies */}
              <motion.section variants={itemVariants} className="space-y-4 p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                    <span>⚡</span> Core Competencies
                  </h3>
                  <span className="text-sm text-slate-500">({formData.coreCompetencies?.length || 0})</span>
                </div>

                <div className="space-y-3">
                  {(formData.coreCompetencies || []).map((competency, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-[1fr_auto_auto] gap-3 items-start p-3 rounded-lg bg-slate-950 border border-slate-700 hover:border-cyan-500/30 transition"
                    >
                      <input
                        type="text"
                        value={competency.skill}
                        onChange={(e) => updateListItem("coreCompetencies", index, "skill", e.target.value)}
                        placeholder="e.g. System Design"
                        className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <input
                        type="text"
                        value={competency.level}
                        onChange={(e) => updateListItem("coreCompetencies", index, "level", e.target.value)}
                        placeholder="Expert"
                        className="w-auto px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeListItem("coreCompetencies", index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg bg-red-500/20 px-3 py-2.5 text-red-300 hover:bg-red-500/30 transition"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={() => addListItem("coreCompetencies", { skill: "", level: "" })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-4 py-2.5 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition"
                >
                  + Add Competency
                </motion.button>
              </motion.section>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-8 md:py-12 px-4 md:px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="text-center md:text-left space-y-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Create Your Portfolio</p>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build Your Professional Profile
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl">
            Craft a stunning portfolio that showcases your expertise, experience, and achievements. Move through each section at your own pace.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/50 via-slate-950/50 to-slate-900/50 backdrop-blur-xl p-6 md:p-10 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Step Indicator */}
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap">
              <span className="text-sm md:text-base font-semibold text-cyan-400">
                {steps[step].icon} {steps[step].title}
              </span>
              <span className="text-sm text-slate-400 font-medium bg-slate-800/50 px-3 py-1 rounded-full">
                Step {step + 1} of {steps.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* Mini Step Indicators - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-wrap gap-2 mt-4">
              {steps.map((item, index) => (
                <motion.button
                  key={item.title}
                  onClick={() => index <= step && setStep(index)}
                  disabled={index > step}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    index === step
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                      : index < step
                      ? 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:border-cyan-400/50 cursor-pointer'
                      : 'bg-slate-900/50 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                  whileHover={index < step ? { scale: 1.05 } : {}}
                  whileTap={index < step ? { scale: 0.95 } : {}}
                >
                  {index + 1}. {item.title}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-950/30 backdrop-blur-sm text-red-200 text-sm font-medium flex items-start gap-3"
              >
                <span className="text-lg flex-shrink-0">⚠️</span>
                <span>{displayError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-[300px]"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch pt-6 border-t border-slate-700/50">
              <motion.button
                type="button"
                onClick={previousStep}
                disabled={step === 0}
                whileHover={step !== 0 ? { scale: 1.02 } : {}}
                whileTap={step !== 0 ? { scale: 0.98 } : {}}
                className="px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </motion.button>

              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {step < steps.length - 1 && (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="order-2 md:order-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                  >
                    Next →
                  </motion.button>
                )}

                {step === steps.length - 1 && (
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="order-2 md:order-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⚙️</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        Submit Profile
                      </>
                    )}
                  </motion.button>
                )}

                <motion.button
                  type="button"
                  onClick={() => navigate("/")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="order-1 md:order-2 px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold text-sm transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Footer Spacing */}
        <div className="h-4" />
      </div>

      <Footer />
    </motion.div>
  );
}

export default CreateProfilePage;
