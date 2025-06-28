import React, { useState } from "react";
import {
  Gamepad2,
  Headphones,
  Monitor,
  Keyboard,
  Mouse,
  ShoppingCart,
  Star,
  Zap,
  Trophy,
  Users,
  Truck,
  Shield,
  ArrowRight,
  Menu,
  Search,
  User,
} from "lucide-react";
import AuthModal from "./AuthModal";

function Homepage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const openLoginModal = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode("register");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Gearnix
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Gaming Mice
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Keyboards
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Headsets
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Monitors
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Accessories
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={openLoginModal}
                  className="text-gray-300 hover:text-purple-400 transition-colors px-3 py-1 rounded-lg hover:bg-gray-800"
                >
                  Sign In
                </button>
                <button
                  onClick={openRegisterModal}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </button>
              </div>

              <Menu className="h-5 w-5 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors md:hidden" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg')] bg-cover bg-center opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Level Up
              </span>
              <br />
              <span className="text-white">Your Gaming</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover premium gaming accessories that give you the competitive
              edge. From ultra-responsive mice to crystal-clear headsets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              Shop Now
              <ArrowRight className="inline ml-2 h-5 w-5" />
            </button>
            <button className="border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              View Catalog
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Pro Grade</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">50K+ Gamers</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Ultra Fast</p>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 animate-bounce">
          <div className="w-3 h-3 bg-purple-500 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/3 right-20 animate-pulse">
          <div className="w-2 h-2 bg-cyan-500 rounded-full opacity-40"></div>
        </div>
        <div
          className="absolute bottom-1/4 left-1/4 animate-bounce"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-4 h-4 bg-pink-500 rounded-full opacity-50"></div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Gaming Arsenal
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to dominate the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mouse,
                title: "Gaming Mice",
                desc: "Precision & Speed",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Keyboard,
                title: "Keyboards",
                desc: "Mechanical Excellence",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: Headphones,
                title: "Headsets",
                desc: "Immersive Audio",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Monitor,
                title: "Monitors",
                desc: "Crystal Clear",
                color: "from-blue-500 to-cyan-500",
              },
            ].map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="group cursor-pointer">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center transition-all duration-300 hover:border-purple-500/50 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                    <div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:animate-pulse`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {category.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Featured Gear
              </span>
            </h2>
            <p className="text-xl text-gray-400">Handpicked by pro gamers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "UltraStrike Pro Mouse",
                price: "$129.99",
                originalPrice: "$159.99",
                rating: 4.9,
                image:
                  "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg",
                badge: "Best Seller",
              },
              {
                name: "MechForce RGB Keyboard",
                price: "$199.99",
                originalPrice: "$249.99",
                rating: 4.8,
                image:
                  "https://images.pexels.com/photos/1734334/pexels-photo-1734334.jpeg",
                badge: "New",
              },
              {
                name: "SoundWave Elite Headset",
                price: "$89.99",
                originalPrice: "$119.99",
                rating: 4.7,
                image:
                  "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
                badge: "Sale",
              },
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {product.badge}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-400 text-sm">
                          ({product.rating})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-purple-400">
                          {product.price}
                        </span>
                        <span className="text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      </div>
                      <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-yellow-300 mr-2" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Limited Time Offer!
            </h2>
            <Zap className="h-8 w-8 text-yellow-300 ml-2" />
          </div>
          <p className="text-xl text-white/90 mb-8">
            Get up to 40% off on selected gaming accessories. Offer ends soon!
          </p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            Shop Sale Items
            <ArrowRight className="inline ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-12 w-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-400">On orders over $75</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">2-Year Warranty</h3>
              <p className="text-gray-400">On all gaming gear</p>
            </div>
            <div className="flex flex-col items-center">
              <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Pro Support</h3>
              <p className="text-gray-400">24/7 expert assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Stay in the Game
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Get the latest gaming gear updates and exclusive deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Gamepad2 className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Gearnix
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Premium gaming accessories for the ultimate gaming experience.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Gaming Mice
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Keyboards
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Headsets
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Monitors
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Warranty
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 GameGear Pro. All rights reserved. Built for gamers,
              by gamers.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </div>
  );
}

export default Homepage;
