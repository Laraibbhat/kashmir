/**
 * Normalizes API response data to match the format expected by the UI components.
 * This handles renaming keys, flattening object arrays into strings, and grouping skills.
 */
export const mapProfileData = (apiData) => {
  if (!apiData) return null;

  const experience = (apiData.experiences || apiData.experience || [])
    .map((exp) => ({
      ...exp,
      highlights:
        Array.isArray(exp.highlights) && exp.highlights.length > 0
          ? [...exp.highlights]
              .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
              .map((h) =>
                typeof h === "object" && h !== null
                  ? h.text || h.highlight || ""
                  : String(h || ""),
              )
          : [exp.projectFocus].filter(Boolean),
    }))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const education = (apiData.education || [])
    .map((edu) => ({
      ...edu,
      achievements: (Array.isArray(edu.achievements)
        ? [...edu.achievements]
        : []
      )
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((a) => {
          if (a && typeof a === "object") {
            return a.achievement || a.text || "";
          }
          return String(a || "");
        }),
    }))
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return {
    ...apiData,
    experience,
    experiences: experience,
    education,
    educations: education,

    // Flatten awards from objects to strings
    awards: (apiData.awards || [])
      .map((a) => {
        if (a && typeof a === "object") {
          return a.awardText || a.text || "";
        }
        return String(a || "");
      })
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),

    // Map coreCompetencies to coreStrengths string array
    coreStrengths: (apiData.coreCompetencies || [])
      .map((c) => (typeof c === "object" ? c.skill : String(c || "")))
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),

    // Group the flat technical expertise array into categorized objects
    technicalExpertise: Array.isArray(apiData.technicalExpertise)
      ? apiData.technicalExpertise.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = [];
          if (!acc[curr.category].includes(curr.skill))
            acc[curr.category].push(curr.skill);
          return acc;
        }, {})
      : apiData.technicalExpertise,

    // Map metrics from top-level fields into the nested metrics object
    metrics: apiData.metrics || {
      experience: apiData.experienceYears ? `${apiData.experienceYears}+` : "0",
      yearsAsSenior: apiData.yearsAsSenior ? `${apiData.yearsAsSenior}+` : "0",
      projectsDelivered: apiData.projectsDelivered
        ? `${apiData.projectsDelivered}+`
        : "0",
      cloudInfraProjects: apiData.cloudInfraProjects || "0",
      teamsManagedInfra:
        apiData.teamsManagedInfra || (apiData.id === 11 ? "200+" : "0"),
      performanceOptimization: apiData.performanceOptimization || "N/A",
    },

    // Normalize certification fields
    certifications: (apiData.certifications || []).map((cert) => ({
      name: cert.name || "",
      issuer: cert.issuer,
      date: cert.certificationDate ? cert.certificationDate.split("-")[0] : "",
      description: cert.description,
    })),

    // Ensure publications have the date field the UI expects
    publications: (apiData.publications || []).map((pub) => ({
      ...pub,
      date: pub.publicationDate || "",
    })),
  };
};
