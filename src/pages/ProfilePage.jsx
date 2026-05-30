import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import Education from "../components/Education";
import Certifications from "../components/Certifications";
import Publications from "../components/Publications";
import Awards from "../components/Awards";
import Footer from "../components/Footer";
import NotFoundPage from "./NotFoundPage";
import LoadingSkeletons from "../components/LoadingSkeletons";

function ProfilePage({ defaultUsername }) {
  const { username } = useParams();
  const { profile, loading, error, fetchProfile } = useProfile();

  useEffect(() => {
    const target = username || defaultUsername || "laraib";
    fetchProfile(target);
  }, [username, defaultUsername, fetchProfile]);

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (error || !profile) {
    return <NotFoundPage />;
  }

  return (
    <div className="App">
      <Header data={profile} />
      <Hero data={profile} />
      <About data={profile} />
      <Skills data={profile} />
      <Experience data={profile.experiences} />
      <Education data={profile.educations} />
      <Certifications data={profile.certifications} />
      <Publications data={profile.publications} />
      <Awards data={profile.awards} />
      <Footer data={profile} />
    </div>
  );
}

export default ProfilePage;