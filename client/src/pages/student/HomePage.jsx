import React from "react";
import HeroSection from "./HeroSection";
import Courses from "./Courses";
import FAQ from "@/components/FAQ";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Courses />
      <div className="bg-white dark:bg-[#141414] py-16">
        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;
