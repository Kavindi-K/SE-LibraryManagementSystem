import React from "react";
import Header from "./Header";
import Hero from "./Hero";
import FeaturedBooks from "./FeaturedBooks";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <FeaturedBooks />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
