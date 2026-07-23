import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import EMICalculator from "@/components/site/EMICalculator";
import Brochures from "@/components/site/Brochures";
import About from "@/components/site/About";
import Process from "@/components/site/Process";
import Insurance from "@/components/site/Insurance";
import Testimonials from "@/components/site/Testimonials";
import FAQ from "@/components/site/FAQ";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import FloatingCTA from "@/components/site/FloatingCTA";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <div className="min-h-screen bg-white text-brand-dark">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <EMICalculator />
        <Brochures />
        <About />
        <Process />
        <Insurance />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
