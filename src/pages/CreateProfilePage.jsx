import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Footer from "../components/Footer";

const steps = [
  {
    title: "Basic Info",
    description: "A clean start with your name, title, contact details and summary.",
  },
  {
    title: "Experience Metrics",
    description: "Showcase your career impact with measurable values.",
  },
  {
    title: "Technical Expertise",
    description: "Add the skills that define your technical profile.",
  },
  {
    title: "Professional Experience",
    description: "Capture your most powerful work stories and achievements.",
  },
  {
    title: "Education",
    description: "List your degrees, school, and standout achievements.",
  },
  {
    title: "Final Details",
    description: "Wrap up with certifications, publications, awards, and competencies.",
  },
];

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
  });

  const [validationError, setValidationError] = useState("");

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Username *</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFieldValue("username", e.target.value)}
                  placeholder="newuser1234"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Full Name *</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  placeholder="New User Name"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Title</span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                  placeholder="new.user@example.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFieldValue("phone", e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Location</span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) => setFieldValue("location", e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-300">Summary</span>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={(e) => setFieldValue("summary", e.target.value)}
                rows="5"
                placeholder="Experienced software engineer with a focus on backend development."
                className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
              />
            </label>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Years Experience</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.experienceYears}
                  onChange={(e) => setFieldValue("experienceYears", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Years as Senior</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.yearsAsSenior}
                  onChange={(e) => setFieldValue("yearsAsSenior", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Projects Delivered</span>
                <input
                  type="number"
                  min="0"
                  value={formData.projectsDelivered}
                  onChange={(e) => setFieldValue("projectsDelivered", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Cloud Infra Projects</span>
                <input
                  type="number"
                  min="0"
                  value={formData.cloudInfraProjects}
                  onChange={(e) => setFieldValue("cloudInfraProjects", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Teams Managed</span>
                <input
                  type="number"
                  min="0"
                  value={formData.teamsManagedInfra}
                  onChange={(e) => setFieldValue("teamsManagedInfra", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">Performance Optimization %</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.performanceOptimization}
                  onChange={(e) => setFieldValue("performanceOptimization", e.target.value)}
                  className="w-full px-4 py-3 rounded-3xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {(formData.technicalExpertise || []).map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 rounded-3xl bg-slate-900 border border-slate-700">
                  <label className="space-y-2">
                    <span className="text-sm text-slate-300">Category</span>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateListItem("technicalExpertise", index, "category", e.target.value)}
                      placeholder="Programming Languages"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-slate-300">Skill</span>
                    <input
                      type="text"
                      value={item.skill}
                      onChange={(e) => updateListItem("technicalExpertise", index, "skill", e.target.value)}
                      placeholder="Java"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removeListItem("technicalExpertise", index)}
                    className="w-full px-4 py-3 rounded-2xl bg-red-700 text-white transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addListItem("technicalExpertise", { category: "", skill: "" })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
            >
              Add Expertise
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {(formData.experiences || []).map((exp, index) => (
              <div key={index} className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Title</span>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateListItem("experiences", index, "title", e.target.value)}
                      placeholder="Senior Software Engineer"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Company</span>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateListItem("experiences", index, "company", e.target.value)}
                      placeholder="Tech Solutions Inc."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Period</span>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateListItem("experiences", index, "period", e.target.value)}
                      placeholder="2020-Present"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Project Focus</span>
                    <input
                      type="text"
                      value={exp.projectFocus}
                      onChange={(e) => updateListItem("experiences", index, "projectFocus", e.target.value)}
                      placeholder="Led development of scalable microservices."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-300">Highlights</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateListItem("experiences", index, "highlights", [
                          ...(exp.highlights || []),
                          { highlight: "" },
                        ])
                      }
                      className="rounded-full bg-cyan-500 px-4 py-2 text-slate-950 font-semibold shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
                    >
                      Add Highlight
                    </button>
                  </div>
                  {(exp.highlights || []).map((highlightItem, hi) => (
                    <div key={hi} className="grid grid-cols-[1fr_auto] gap-3">
                      <input
                        type="text"
                        value={highlightItem.highlight}
                        onChange={(e) => {
                          const nextHighlights = (exp.highlights || []).map((item, idx) =>
                            idx === hi ? { ...item, highlight: e.target.value } : item,
                          );
                          updateListItem("experiences", index, "highlights", nextHighlights);
                        }}
                        placeholder="Designed and implemented a new payment gateway."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextHighlights = (exp.highlights || []).filter((_, idx) => idx !== hi);
                          updateListItem("experiences", index, "highlights", nextHighlights);
                        }}
                        className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeListItem("experiences", index)}
                    className="rounded-full bg-red-700 px-5 py-3 text-white hover:bg-red-600"
                  >
                    Remove Experience
                  </button>
                </div>
              </div>
            ))}

            <button
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
            >
              Add Experience
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {(formData.education || []).map((edu, index) => (
              <div key={index} className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Degree</span>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateListItem("education", index, "degree", e.target.value)}
                      placeholder="Master of Science in Computer Science"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">School</span>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateListItem("education", index, "school", e.target.value)}
                      placeholder="University of Example"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Year</span>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateListItem("education", index, "year", e.target.value)}
                      placeholder="2017"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-300">Details</span>
                    <input
                      type="text"
                      value={edu.details}
                      onChange={(e) => updateListItem("education", index, "details", e.target.value)}
                      placeholder="Specialized in Distributed Systems."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-300">Achievements</span>
                    <button
                      type="button"
                      onClick={() => updateListItem("education", index, "achievements", [
                        ...(edu.achievements || []),
                        { achievement: "" },
                      ])}
                      className="rounded-full bg-cyan-500 px-4 py-2 text-slate-950 font-semibold shadow-md shadow-cyan-500/20 hover:bg-cyan-400"
                    >
                      Add Achievement
                    </button>
                  </div>
                  {(edu.achievements || []).map((achievementItem, ai) => (
                    <div key={ai} className="grid grid-cols-[1fr_auto] gap-3">
                      <input
                        type="text"
                        value={achievementItem.achievement}
                        onChange={(e) => {
                          const nextAchievements = (edu.achievements || []).map((item, idx) =>
                            idx === ai ? { ...item, achievement: e.target.value } : item,
                          );
                          updateListItem("education", index, "achievements", nextAchievements);
                        }}
                        placeholder="Graduated with honors."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextAchievements = (edu.achievements || []).filter((_, idx) => idx !== ai);
                          updateListItem("education", index, "achievements", nextAchievements);
                        }}
                        className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeListItem("education", index)}
                    className="rounded-full bg-red-700 px-5 py-3 text-white hover:bg-red-600"
                  >
                    Remove Education
                  </button>
                </div>
              </div>
            ))}

            <button
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
            >
              Add Education
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">Certifications</h3>
                {(formData.certifications || []).map((cert, index) => (
                  <div key={index} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateListItem("certifications", index, "name", e.target.value)}
                        placeholder="AWS Certified Solutions Architect - Associate"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateListItem("certifications", index, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cert.certificationDate}
                        onChange={(e) => updateListItem("certifications", index, "certificationDate", e.target.value)}
                        placeholder="2021-03-15"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <input
                        type="text"
                        value={cert.description}
                        onChange={(e) => updateListItem("certifications", index, "description", e.target.value)}
                        placeholder="Validated expertise in designing distributed systems on AWS."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListItem("certifications", index)}
                      className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                    >
                      Remove Certification
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("certifications", {
                    name: "",
                    issuer: "",
                    certificationDate: "",
                    description: "",
                  })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
                >
                  Add Certification
                </button>
              </section>

              <section className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">Publications</h3>
                {(formData.publications || []).map((publication, index) => (
                  <div key={index} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={publication.title}
                        onChange={(e) => updateListItem("publications", index, "title", e.target.value)}
                        placeholder="Optimizing Database Queries in Microservices"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <input
                        type="text"
                        value={publication.journal}
                        onChange={(e) => updateListItem("publications", index, "journal", e.target.value)}
                        placeholder="Journal of Software Engineering"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={publication.publicationDate}
                        onChange={(e) => updateListItem("publications", index, "publicationDate", e.target.value)}
                        placeholder="2022-01"
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                      <input
                        type="text"
                        value={publication.description}
                        onChange={(e) => updateListItem("publications", index, "description", e.target.value)}
                        placeholder="A study on performance improvements in PostgreSQL."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListItem("publications", index)}
                      className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                    >
                      Remove Publication
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("publications", {
                    title: "",
                    journal: "",
                    publicationDate: "",
                    description: "",
                  })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
                >
                  Add Publication
                </button>
              </section>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">Awards</h3>
                {(formData.awards || []).map((award, index) => (
                  <div key={index} className="grid grid-cols-[1fr_auto] gap-3">
                    <input
                      type="text"
                      value={award.awardText}
                      onChange={(e) => updateListItem("awards", index, "awardText", e.target.value)}
                      placeholder="Employee of the Year - 2021 - Tech Solutions Inc."
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem("awards", index)}
                      className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("awards", { awardText: "" })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
                >
                  Add Award
                </button>
              </section>

              <section className="space-y-4 p-5 rounded-3xl bg-slate-900 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100">Core Competencies</h3>
                {(formData.coreCompetencies || []).map((competency, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <input
                      type="text"
                      value={competency.skill}
                      onChange={(e) => updateListItem("coreCompetencies", index, "skill", e.target.value)}
                      placeholder="Backend Development"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      value={competency.level}
                      onChange={(e) => updateListItem("coreCompetencies", index, "level", e.target.value)}
                      placeholder="Expert"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem("coreCompetencies", index)}
                      className="rounded-full bg-red-700 px-4 py-3 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListItem("coreCompetencies", { skill: "", level: "" })}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
                >
                  Add Competency
                </button>
              </section>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Create Profile</p>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Build a profile that feels alive.</h1>
              <p className="max-w-3xl text-slate-400">Move through the sections one page at a time, add details that matter, and create a professional payload ready to submit to your backend.</p>
            </div>
            <div className="rounded-full bg-slate-900 px-6 py-4 ring-1 ring-slate-700 text-center">
              <p className="text-sm uppercase text-slate-400">Step</p>
              <p className="text-3xl font-bold text-cyan-300">{step + 1} / {steps.length}</p>
              <p className="text-sm text-slate-500 mt-1">{steps[step].title}</p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl bg-slate-900 border border-slate-700 p-8">
            <div className="mb-8">
              <div className="flex flex-col gap-4 text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  {steps.map((item, index) => (
                    <div key={item.title} className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${index <= step ? "border-cyan-400 bg-cyan-500 text-slate-950" : "border-slate-700 text-slate-500"}`}>{index + 1}</span>
                      <span className={index <= step ? "font-semibold text-slate-100" : "text-slate-500"}>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            {displayError && (
              <div className="rounded-3xl border border-red-500 bg-red-950/80 px-5 py-4 text-sm text-red-100 mb-6">
                {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {renderStepContent()}

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-stretch">
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={step === 0}
                  className="rounded-3xl border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous Section
                </button>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {step < steps.length - 1 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                    >
                      Next Section
                    </button>
                  )}
                  {step === steps.length - 1 && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-3xl bg-gradient-to-r from-cyan-500 to-slate-200 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? "Sending payload..." : "Submit Profile"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="rounded-3xl border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CreateProfilePage;
