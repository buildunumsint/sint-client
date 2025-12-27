import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="goal">
          <CTA />
        </section>
        <section id="contact">
          <Footer />
        </section>
        <ChatBot />
      </main>
    </div>
  );
}
