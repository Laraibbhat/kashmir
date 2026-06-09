import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { resumeData } from "../resumeData";
import { mapProfileData } from "../dataMapper";

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
      //   `http://localhost:8080/api/users/username/${encodeURIComponent(username)}`
      // );

      const response = await axios.get(
        `https://portfolio-backend-tbur.onrender.com/api/users/username/${encodeURIComponent(username)}`
      );

      const apiData = response.data;
      
      // Use the centralized mapper to handle normalization and flattening (fixes "Objects are not valid as a React child")
      const transformed = mapProfileData(apiData);

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
        `http://localhost:8080/api/users`,
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