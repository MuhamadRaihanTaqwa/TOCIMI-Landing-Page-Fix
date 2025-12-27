import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TOCIMI - Toko Fashion Wanita Trendy & Elegan</title>
        <meta
          name="description"
          content="TOCIMI adalah toko fashion wanita terlengkap dengan koleksi baju, aksesoris, makeup, celana, sepatu, dan tas berkualitas premium. Temukan gaya feminin terbaikmu!"
        />
        <meta
          name="keywords"
          content="fashion wanita, baju wanita, aksesoris, makeup, sepatu, tas, toko online fashion"
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Products />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
