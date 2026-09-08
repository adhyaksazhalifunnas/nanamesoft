import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      {/* Delete this line and content/site.ts:experience if you do not want a work history. */}
      <Experience />
      <Contact />
    </>
  );
}
