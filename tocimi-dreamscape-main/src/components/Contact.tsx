import { MapPin, Phone, Clock, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    nama: "",
    subjek: "",
    pesan: "",
  });

  const phoneNumber = "6285559443785";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Halo TOCIMI!%0A%0ANama: ${formData.nama}%0ASubjek: ${formData.subjek}%0APesan: ${formData.pesan}`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-accent text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Kontak
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Hubungi Kami
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Punya pertanyaan atau ingin berbelanja? Jangan ragu untuk menghubungi kami!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Alamat</h3>
                <p className="text-muted-foreground">
                  Jl. Jendral Sudirman, Gg. Mawar No. 2<br />
                  Purwakarta, Jawa Barat
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                <a 
                  href={`https://wa.me/${phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +62 855-5944-3785
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Jam Operasional</h3>
                <p className="text-muted-foreground">
                  Senin - Minggu: 08:00 - 22:00
                </p>
              </div>
            </div>

            {/* Social Media - Instagram Only */}
            <div className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">Ikuti Kami di Instagram</h3>
              <a
                href="https://instagram.com/tocimi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white px-6 py-3 rounded-full hover:scale-105 transition-transform"
              >
                <Instagram className="w-6 h-6" />
                <span className="font-medium">@tocimi</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg border border-border animate-slide-in-right">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Kirim Pesan via WhatsApp
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nama
                </label>
                <Input 
                  placeholder="Nama lengkap" 
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Subjek
                </label>
                <Input 
                  placeholder="Tentang apa?" 
                  value={formData.subjek}
                  onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pesan
                </label>
                <Textarea
                  placeholder="Tulis pesan Anda di sini..."
                  rows={5}
                  value={formData.pesan}
                  onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Kirim via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
