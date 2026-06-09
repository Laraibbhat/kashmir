import React from "react";
import { Navigate } from "react-router-dom";

function HomePage() {
  // Default to Laraib's profile
  return <Navigate to="/laraib" replace />;
}

export default HomePage;