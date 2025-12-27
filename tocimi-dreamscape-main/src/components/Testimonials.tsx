import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Anisa Putri",
    role: "Fashion Enthusiast",
    content:
      "Produk TOCIMI selalu berkualitas tinggi! Dress yang saya beli sangat nyaman dan elegan. Pasti akan belanja lagi!",
    rating: 5,
    avatar: "AP",
  },
  {
    id: 2,
    name: "Dewi Kartika",
    role: "Beauty Blogger",
    content:
      "Makeup collection mereka luar biasa! Warna-warnanya cantik dan tahan lama. Sangat recommended untuk semua wanita.",
    rating: 5,
    avatar: "DK",
  },
  {
    id: 3,
    name: "Rina Maharani",
    role: "Content Creator",
    content:
      "Pelayanan sangat ramah dan pengiriman cepat. Tas yang saya order sangat sesuai dengan foto. Love it!",
    rating: 5,
    avatar: "RM",
  },
  {
    id: 4,
    name: "Sarah Amelia",
    role: "Professional",
    content:
      "Sepatu heels nya super nyaman dipakai seharian. Desainnya cantik dan elegan. Worth every penny!",
    rating: 5,
    avatar: "SA",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-accent text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Testimoni
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Lihat apa yang mereka katakan tentang TOCIMI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="border-border hover:shadow-lg transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/80 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
