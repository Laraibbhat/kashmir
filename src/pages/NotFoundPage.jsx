import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-8">Profile Not Found</p>
        <p className="text-gray-400 mb-8">
          Sorry, the profile you're looking for doesn't exist.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-block"
          >
            Go Home
          </Link>
          <Link
            to="/create-profile"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg inline-block"
          >
            Create Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;