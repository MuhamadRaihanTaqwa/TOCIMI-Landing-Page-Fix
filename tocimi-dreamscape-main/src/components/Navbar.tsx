import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount, favoritesCount } = useCart();

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('tocimifashionshop5@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const { login } = useAuth();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Produk", href: "#products" },
    { name: "Testimoni", href: "#testimonials" },
    { name: "Kontak", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const scrollToCart = () => {
    const cartSection = document.querySelector('[data-cart-section]');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If no cart section, scroll to products and show message
      scrollToSection("#products");
    }
  };

  const scrollToFavorites = () => {
    const favoritesSection = document.querySelector('[data-favorites-section]');
    if (favoritesSection) {
      favoritesSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If no favorites section, scroll to products and show message
      scrollToSection("#products");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(adminEmail, adminPassword);
      toast.success('Login berhasil');
      setIsAdminOpen(false);
      setAdminPassword('');
      navigate('/admin');
    } catch (error) {
      toast.error('Login gagal. Periksa email dan password.');
    }
  }; 

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <img
              src="/tocimi-logo.jpeg"
              alt="Tocimi Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-xl lg:text-2xl font-bold text-foreground">
              TOCIMI
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-foreground/70 hover:text-primary transition-colors duration-300 font-medium"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent"
              onClick={() => setIsAdminOpen(true)}
            >
              Admin
            </Button> 

            <Button
              className="hover:bg-accent relative"
              onClick={scrollToFavorites}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {favoritesCount}
                </Badge>
              )}
            </Button>
            <Button
              className="hover:bg-accent relative"
              onClick={scrollToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-foreground/70 hover:text-primary transition-colors duration-300 font-medium py-2 text-left"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdminOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Admin
                </Button> 
                <Button
                  className="hover:bg-accent relative"
                  onClick={() => {
                    scrollToFavorites();
                    setIsOpen(false);
                  }}
                >
                  <Heart className="w-5 h-5" />
                  {favoritesCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {favoritesCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  className="hover:bg-accent relative"
                  onClick={() => {
                    scrollToCart();
                    setIsOpen(false);
                  }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* Admin Login Modal */}
        <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Admin</DialogTitle>
              <DialogDescription>Masukkan email dan password admin untuk mengakses dashboard</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit">Login</Button>
                <Button type="button" onClick={() => setIsAdminOpen(false)}>Cancel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
};

export default Navbar;
