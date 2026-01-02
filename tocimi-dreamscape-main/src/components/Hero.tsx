import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToProducts = () => {
    const element = document.querySelector("#products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-800/60 to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-40 left-10 w-32 h-32 bg-accent/30 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Koleksi Terbaru 2025</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in-up leading-tight" style={{ animationDelay: "0.2s" }}>
            <span className="inline-block">Ekspresikan</span>{" "}
            <span className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">Gayamu</span>
            <span className="block mt-2">
              <span className="relative">
                Setiap Hari
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8C50 2 150 2 198 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="animate-fade-in" style={{ animationDelay: "1s" }}/>
                </svg>
              </span>
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            TOCIMI menghadirkan koleksi fashion dan kebutuhan sehari-hari yang stylish dan trendi.
            Dari pakaian, tas, sepatu, hingga aksesoris — semua yang kamu butuhkan ada di sini.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="group"
            >
              Lihat Koleksi
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Hubungi Kami
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Produk Tersedia</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Pelanggan Puas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Original</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
