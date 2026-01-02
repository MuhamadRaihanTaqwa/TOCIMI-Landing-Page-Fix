import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import tasTocimi from "@/assets/tas tocimi.png";
import tas2 from "@/assets/tas 2.png";
import tas3 from "@/assets/tas 3.png";
import tas4 from "@/assets/tas 4.png";
import tas5 from "@/assets/tas 5.png";
import tas6 from "@/assets/tas 6.jpeg";
import tas7 from "@/assets/tas 7.jpeg";
import tas8 from "@/assets/tas 8.jpeg";

const products = [
  {
    id: 7,
    name: "Tas Tocimi",
    category: "Tas",
    price: "Rp 65.000",
    description: "Tas fashion Tocimi stylish dan modern",
    image: tasTocimi,
    isNew: true,
  },
  {
    id: 8,
    name: "Tas Style 2",
    category: "Tas",
    price: "Rp 70.000",
    description: "Tas selempang dengan desain elegan",
    image: tas2,
    isNew: true,
  },
  {
    id: 9,
    name: "Tas Style 3",
    category: "Tas",
    price: "Rp 85.000",
    description: "Tas tote besar untuk sehari-hari",
    image: tas3,
    isNew: true,
  },
  {
    id: 10,
    name: "Tas Style 4",
    category: "Tas",
    price: "Rp 85.000",
    description: "Tas mini compact dan praktis",
    image: tas4,
    isNew: true,
  },
  {
    id: 11,
    name: "Tas Style 5",
    category: "Tas",
    price: "Rp 85.000",
    description: "Tas backpack multifungsi",
    image: tas5,
    isNew: true,
  },
  {
    id: 12,
    name: "Tas Style 6",
    category: "Tas",
    price: "Rp 45.000",
    description: "Tas style 6 dengan desain unik",
    image: tas6,
    isNew: true,
  },
  {
    id: 13,
    name: "Tas Style 7",
    category: "Tas",
    price: "Rp 45.000",
    description: "Tas style 7 praktis dan stylish",
    image: tas7,
    isNew: true,
  },
  {
    id: 14,
    name: "Tas Style 8",
    category: "Tas",
    price: "Rp 65.000",
    description: "Tas style 8 elegan dan modern",
    image: tas8,
    isNew: true,
  },
];

const categories = ["Semua", "Tas"];

const Products = () => {
  const { cart, favorites, cartCount, favoritesCount, addToCart, removeFromCart, toggleFavorite, isInCart, isFavorite } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredProducts = selectedCategory === "Semua"
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleToggleFavorite = (product: any) => {
    toggleFavorite(product);
  };

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-accent text-primary px-4 py-1 rounded-full text-sm font-medium mb-4">
            Produk Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Koleksi Pilihan Terbaik
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Temukan berbagai produk fashion dan kecantikan dengan kualitas premium dan harga terjangkau
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-accent hover:text-primary border border-border"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-border hover:shadow-lg transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* New Badge */}
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    NEW
                  </span>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full ${isFavorite(product.id) ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
                    onClick={() => handleToggleFavorite(product)}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full ${isInCart(product.id) ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="text-xs text-primary font-medium mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="text-lg font-bold text-foreground">
                  {product.price}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart Section */}
        {cartCount > 0 && (
          <div className="mt-16" data-cart-section>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Keranjang Belanja ({cartCount})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cart.map((product) => (
                <Card key={`cart-${product.id}`} className="border-border">
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-primary font-medium">{product.price}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(product)}
                    >
                      Hapus
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button
                size="lg"
                onClick={() => {
                  const phoneNumber = "6285559443785";
                  const message = `Halo TOCIMI! Saya ingin memesan:\n${cart.map(p => `- ${p.name} (${p.price})`).join('\n')}`;
                  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
              >
                Next Order via WhatsApp
              </Button>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favoritesCount > 0 && (
          <div className="mt-16" data-favorites-section>
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Produk Favorit ({favoritesCount})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((product) => (
                <Card key={`fav-${product.id}`} className="border-border">
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{product.name}</h4>
                      <p className="text-primary font-medium">{product.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        disabled={isInCart(product.id)}
                      >
                        {isInCart(product.id) ? 'Di Keranjang' : 'Tambah ke Keranjang'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleToggleFavorite(product)}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Lihat Semua Produk
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Products;
