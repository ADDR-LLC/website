import { TechSolutionsHeroSection } from "@/components/ui/tech-solutions-hero-section";
import { AboutSection } from "@/components/about-section";
import { BlogSection } from "@/components/blog-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <section id="home" className="w-full">
        <TechSolutionsHeroSection />
      </section>
      
      <AboutSection />
      
      <BlogSection />
    </main>
  );
}
