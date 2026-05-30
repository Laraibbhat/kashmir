import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { resumeData } from "../resumeData";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (username) => {
    if (!username) return;
    setLoading(true);
    setError(null);
    try {
      // const response = await axios.get(
      //   `http://localhost:8080/api/profiles/${encodeURIComponent(username)}`
      // );
      const response = await axios.get(
        `http://localhost:8080/api/users/username/${encodeURIComponent(username)}`
      );

      const apiData = response.data;
      
      // Transform API response to match UI expectations (nesting metrics, handle pluralization)
      const transformed = {
        ...apiData,
        metrics: {
          experience: `${apiData.experienceYears || 0}+`,
          yearsAsSenior: `${apiData.yearsAsSenior || 0}+`,
          projectsDelivered: `${apiData.projectsDelivered || 0}+`,
          cloudInfraProjects: `${apiData.cloudInfraProjects || 0}+`,
          teamsManagedInfra: `${apiData.teamsManagedInfra || 0}+`,
          performanceOptimization: `${apiData.performanceOptimization || 0}%`,
        },
        educations: apiData.education || [], // Match the prop name used in ProfilePage
      };

      // Transform technicalExpertise array of objects into object of arrays for Skills section
      if (Array.isArray(apiData.technicalExpertise)) {
        transformed.technicalExpertise = apiData.technicalExpertise.reduce((acc, item) => {
          if (item.category && item.skill) {
            if (!acc[item.category]) acc[item.category] = [];
            acc[item.category].push(item.skill);
          }
          return acc;
        }, {});
      }

      // Handle awards if they come back as an array of objects
      if (Array.isArray(apiData.awards) && apiData.awards.length > 0 && typeof apiData.awards[0] === 'object') {
        transformed.awards = apiData.awards.map(a => a.award_text).filter(Boolean);
      }

      setProfile(transformed);
    } catch (err) {
      if (username?.toLowerCase() === "laraib") {
        setProfile({ ...resumeData, educations: resumeData.education });
        setError(null);
      } else if (err.response?.status === 404) {
        setError("Profile not found");
        setProfile(null);
      } else {
        setError("Failed to load profile");
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = useCallback(async (profilePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/profiles`,
        profilePayload,
        { headers: { "Content-Type": "application/json" } }
      );
      // Set created profile locally
      setProfile(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create profile";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, fetchProfile, createProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};