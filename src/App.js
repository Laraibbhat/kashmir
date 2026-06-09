import "./App.css";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateProfilePage from "./pages/CreateProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage defaultUsername="laraib" />} />
      <Route path="/:username" element={<ProfilePage />} />
      <Route path="/create-profile" element={<CreateProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
