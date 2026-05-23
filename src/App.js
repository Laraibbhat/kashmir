import "./App.css";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Awards from "./components/Awards";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Hero />
      <Skills />
      <Experience />
      <Education />
      <Awards />
      <Footer />
    </div>
  );
}

export default App;
