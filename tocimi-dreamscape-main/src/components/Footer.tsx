import { Heart, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produk: ["Baju", "Aksesoris", "Makeup", "Celana & Rok", "Sepatu", "Tas"],
    bantuan: ["FAQ", "Cara Pemesanan", "Pengembalian", "Pembayaran"],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#home" className="flex items-center gap-2 mb-4">
              <img
                src="/tocimi-logo.jpeg"
                alt="Tocimi Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-foreground">TOCIMI</span>
            </a>
            <p className="text-muted-foreground mb-4">
              Toko fashion wanita terlengkap dengan koleksi trendy dan elegan untuk menemani setiap momen spesialmu.
            </p>
            <a
              href="https://instagram.com/tocimi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span>@tocimi</span>
            </a>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Produk</h4>
            <ul className="space-y-2">
              {footerLinks.produk.map((link) => (
                <li key={link}>
                  <a
                    href="#products"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Bantuan</h4>
            <ul className="space-y-2">
              {footerLinks.bantuan.map((link) => (
                <li key={link}>
                  <a
                    href="#contact"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">
                Jl. Jendral Sudirman, Gg. Mawar No. 2<br />
                Purwakarta, Jawa Barat
              </li>
              <li>
                <a
                  href="https://wa.me/6285559443785"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +62 855-5944-3785
                </a>
              </li>
              <li className="text-muted-foreground text-sm">
                Buka: 08:00 - 22:00
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              © {currentYear} TOCIMI. Dibuat dengan
              <Heart className="w-4 h-4 text-primary fill-primary" />
              untuk wanita Indonesia.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Kebijakan Privasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
