import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Footer from "../components/Footer";

function CreateProfilePage() {
  const navigate = useNavigate();
  const { createProfile, loading, error } = useProfile();

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
    technicalExpertise: {},
    // technicalExpertise should be an array of { category, skill }
    technicalExpertise: [],
    experiences: [],
    educations: [],
    certifications: [],
    publications: [],
    awards: [],
    coreCompetencies: [],
  });

  const [validationError, setValidationError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationError("");
  };

  const addListItem = (key, template = {}) => {
    setFormData((prev) => ({ ...prev, [key]: [...(prev[key] || []), template] }));
  };

  const updateListItem = (key, index, field, value) => {
    setFormData((prev) => {
      const list = [...(prev[key] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [key]: list };
    });
  };

  const removeListItem = (key, index) => {
    setFormData((prev) => {
      const list = [...(prev[key] || [])];
      list.splice(index, 1);
      return { ...prev, [key]: list };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.name.trim()) {
      setValidationError("Username and Name are required");
      return;
    }

    if (formData.username.length < 3) {
      setValidationError("Username must be at least 3 characters");
      return;
    }

    // Validate dynamic sections
    const validateForm = () => {
      if (!Array.isArray(formData.technicalExpertise)) return { valid: false, msg: 'Technical expertise must be an array' };
      for (let i = 0; i < formData.technicalExpertise.length; i++) {
        const it = formData.technicalExpertise[i];
        if (!it.category?.trim() || !it.skill?.trim()) return { valid: false, msg: `Technical expertise #${i + 1} requires category and skill` };
      }

      for (let i = 0; i < (formData.experiences || []).length; i++) {
        const ex = formData.experiences[i];
        if (!ex.title?.trim() || !ex.company?.trim()) return { valid: false, msg: `Experience #${i + 1} requires title and company` };
      }

      for (let i = 0; i < (formData.educations || []).length; i++) {
        const ed = formData.educations[i];
        if (!ed.degree?.trim() || !ed.school?.trim()) return { valid: false, msg: `Education #${i + 1} requires degree and school` };
      }

      for (let i = 0; i < (formData.certifications || []).length; i++) {
        const c = formData.certifications[i];
        if (!c.name?.trim()) return { valid: false, msg: `Certification #${i + 1} requires a name` };
      }

      for (let i = 0; i < (formData.publications || []).length; i++) {
        const p = formData.publications[i];
        if (!p.title?.trim()) return { valid: false, msg: `Publication #${i + 1} requires a title` };
      }

      for (let i = 0; i < (formData.awards || []).length; i++) {
        const a = formData.awards[i];
        if (!a.award_text?.trim()) return { valid: false, msg: `Award #${i + 1} requires text` };
      }

      for (let i = 0; i < (formData.coreCompetencies || []).length; i++) {
        const cc = formData.coreCompetencies[i];
        if (!cc.skill?.trim()) return { valid: false, msg: `Core competency #${i + 1} requires a skill` };
      }

      return { valid: true };
    };

    const validation = validateForm();
    if (!validation.valid) {
      setValidationError(validation.msg);
      return;
    }

    // Prepare payload to match backend DTO (snake_case keys for server-side mapping)
    const payload = {
      username: formData.username,
      name: formData.name,
      title: formData.title,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      summary: formData.summary,
      experience_years: Number(formData.experienceYears) || 0,
      years_as_senior: Number(formData.yearsAsSenior) || 0,
      projects_delivered: Number(formData.projectsDelivered) || 0,
      cloud_infra_projects: Number(formData.cloudInfraProjects) || 0,
      teams_managed_infra: Number(formData.teamsManagedInfra) || 0,
      performance_optimization: Number(formData.performanceOptimization) || 0,
      technical_expertise: formData.technicalExpertise,
      experiences: formData.experiences,
      educations: formData.educations,
      certifications: formData.certifications,
      publications: formData.publications,
      awards: formData.awards,
      core_competencies: formData.coreCompetencies,
    };

    const result = await createProfile(payload);

    if (result.success) {
      navigate(`/${formData.username}`);
    }
  };

  const displayError = error || validationError;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">Create Your Profile</h1>
        <p className="text-gray-400 text-center mb-8">
          Fill in your details to create your professional portfolio
        </p>

        {displayError && (
          <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-3 rounded mb-6">
            {displayError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-lg p-8 space-y-6"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="e.g., laraib"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Laraib Mushtaq"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 1234567890"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Brief summary about yourself..."
                rows="4"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          {/* Experience Metrics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-400">Experience Metrics</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Years Experience
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Years as Senior
                </label>
                <input
                  type="number"
                  name="yearsAsSenior"
                  value={formData.yearsAsSenior}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Projects Delivered
                </label>
                <input
                  type="number"
                  name="projectsDelivered"
                  value={formData.projectsDelivered}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Cloud Infra Projects
                </label>
                <input
                  type="number"
                  name="cloudInfraProjects"
                  value={formData.cloudInfraProjects}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Teams Managed
                </label>
                <input
                  type="number"
                  name="teamsManagedInfra"
                  value={formData.teamsManagedInfra}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Performance Optimization %
                </label>
                <input
                  type="number"
                  name="performanceOptimization"
                  value={formData.performanceOptimization}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            Note: You can add experiences, education, certifications, and other details after creating your profile.
          </p>

          {/* Dynamic Sections */}
          <div className="space-y-6">
            {/* Technical Expertise */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Technical Expertise</h2>
              {(formData.technicalExpertise || []).length === 0 && (
                <p className="text-sm text-gray-400">Add categories and skills.</p>
              )}
              {(formData.technicalExpertise || []).map((item, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Category"
                    value={item.category || ''}
                    onChange={(e) => updateListItem('technicalExpertise', idx, 'category', e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <input
                    type="text"
                    placeholder="Skill"
                    value={item.skill || ''}
                    onChange={(e) => updateListItem('technicalExpertise', idx, 'skill', e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  />
                  <button type="button" onClick={() => removeListItem('technicalExpertise', idx)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('technicalExpertise', { category: '', skill: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Expertise</button>
              </div>
            </div>

            {/* Experiences */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Experiences</h2>
              {(formData.experiences || []).map((exp, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Title" value={exp.title || ''} onChange={(e)=>updateListItem('experiences', i, 'title', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Company" value={exp.company || ''} onChange={(e)=>updateListItem('experiences', i, 'company', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Period" value={exp.period || ''} onChange={(e)=>updateListItem('experiences', i, 'period', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Project Focus" value={exp.project_focus || ''} onChange={(e)=>updateListItem('experiences', i, 'project_focus', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeListItem('experiences', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('experiences', { title: '', company: '', period: '', project_focus: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Experience</button>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Education</h2>
              {(formData.educations || []).map((edu, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Degree" value={edu.degree || ''} onChange={(e)=>updateListItem('educations', i, 'degree', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="School" value={edu.school || ''} onChange={(e)=>updateListItem('educations', i, 'school', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Year" value={edu.year || ''} onChange={(e)=>updateListItem('educations', i, 'year', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Details" value={edu.details || ''} onChange={(e)=>updateListItem('educations', i, 'details', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeListItem('educations', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('educations', { degree: '', school: '', year: '', details: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Education</button>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Certifications</h2>
              {(formData.certifications || []).map((c, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Name" value={c.name || ''} onChange={(e)=>updateListItem('certifications', i, 'name', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Issuer" value={c.issuer || ''} onChange={(e)=>updateListItem('certifications', i, 'issuer', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Date" value={c.certification_date || ''} onChange={(e)=>updateListItem('certifications', i, 'certification_date', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Description" value={c.description || ''} onChange={(e)=>updateListItem('certifications', i, 'description', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeListItem('certifications', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('certifications', { name: '', issuer: '', certification_date: '', description: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Certification</button>
              </div>
            </div>

            {/* Publications */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Publications</h2>
              {(formData.publications || []).map((p, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Title" value={p.title || ''} onChange={(e)=>updateListItem('publications', i, 'title', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Journal" value={p.journal || ''} onChange={(e)=>updateListItem('publications', i, 'journal', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Date" value={p.publication_date || ''} onChange={(e)=>updateListItem('publications', i, 'publication_date', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                    <input type="text" placeholder="Description" value={p.description || ''} onChange={(e)=>updateListItem('publications', i, 'description', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeListItem('publications', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('publications', { title: '', journal: '', publication_date: '', description: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Publication</button>
              </div>
            </div>

            {/* Awards */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Awards</h2>
              {(formData.awards || []).map((a, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded space-y-2">
                  <input type="text" placeholder="Award Text" value={a.award_text || ''} onChange={(e)=>updateListItem('awards', i, 'award_text', e.target.value)} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeListItem('awards', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                  </div>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('awards', { award_text: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Award</button>
              </div>
            </div>

            {/* Core Competencies */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-400">Core Competencies</h2>
              {(formData.coreCompetencies || []).map((c, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <input type="text" placeholder="Skill" value={c.skill || ''} onChange={(e)=>updateListItem('coreCompetencies', i, 'skill', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  <input type="text" placeholder="Level" value={c.level || ''} onChange={(e)=>updateListItem('coreCompetencies', i, 'level', e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  <button type="button" onClick={() => removeListItem('coreCompetencies', i)} className="bg-red-700 px-3 py-2 rounded">Remove</button>
                </div>
              ))}
              <div>
                <button type="button" onClick={() => addListItem('coreCompetencies', { skill: '', level: '' })} className="bg-blue-600 px-4 py-2 rounded">Add Competency</button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

export default CreateProfilePage;
