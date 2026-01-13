import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { LogOut } from "lucide-react";

const GuestDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
        {/* Logout Button */}
        <div className="fixed top-4 right-4 z-50">
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

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

export default GuestDashboard;
