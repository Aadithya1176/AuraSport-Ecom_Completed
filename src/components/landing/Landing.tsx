import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Collections } from "./Collections";
import { Trending } from "./Trending";
import { Manifesto } from "./Manifesto";
import { WorldCup } from "./WorldCup";
import { Footer } from "./Footer";

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <WorldCup />
        <Collections />
        <Trending />
      </main>
      <Footer />
    </div>
  );
}