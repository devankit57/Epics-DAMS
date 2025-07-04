"use client";

import { useSession, signOut } from "next-auth/react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetails() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/view-product?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.imageUrl);
        if (data.size?.length > 0) setSelectedSize(data.size[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const toastId = toast.loading("Adding to cart...");

    try {
      const res = await fetch("/api/add-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, size: selectedSize }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`${product.name} added to cart!`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to add product to cart.", { id: toastId });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  if (!id) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (loading) return <div className="text-center py-20 text-gray-400">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-red-500">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />

      {/* Navbar */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolling ? "bg-gray-900/80 backdrop-blur-lg shadow-lg" : "bg-transparent"}`} style={{ height: "4rem" }}>
             <div className="max-w-7xl mx-auto flex items-center justify-between w-full h-full px-6">
               <h1 className="text-2xl font-bold text-green-400 cursor-pointer" onClick={() => router.push("/")}>
                 Eko Hand
               </h1>
     
               {/* Desktop Menu */}
               <nav className="hidden md:flex space-x-6 items-center">
                 <button onClick={() => router.push("/products")} className="text-white hover:text-green-400 transition-all">Products</button>
                 <button onClick={() => router.push("/about")} className="text-white hover:text-green-400 transition-all">About Us</button>
                 <button onClick={() => router.push("/contact")} className="text-white hover:text-green-400 transition-all">Contact</button>
                 {status === "authenticated" ? (
                   <>
                     <button onClick={() => router.push("/orders")} className="text-white hover:text-green-400 transition-all">Orders</button>
                     <button onClick={() => router.push("/cart")} className="flex items-center space-x-1 text-white hover:text-green-400 transition-all">
                       <ShoppingCart className="w-5 h-5" />
                       <span>Cart</span>
                     </button>
                     <div className="flex items-center space-x-3">
                       <img src={session.user?.image} alt="Profile" className="w-8 h-8 rounded-full" />
                       <span className="text-white">{session.user?.name}</span>
                       <button onClick={() => signOut()} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all">Logout</button>
                     </div>
                   </>
                 ) : (
                   <button onClick={() => router.push("/login")} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all">Login</button>
                 )}
               </nav>
     
               {/* Mobile Menu Button */}
               <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                 {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
               </button>
             </div>
     
            {/* Mobile Menu Dropdown */}
     {/* Mobile Menu Dropdown */}
     {isMenuOpen && (
       <div className="md:hidden bg-gray-900 text-white absolute top-16 left-0 w-full py-5 px-6 shadow-lg z-500">
         <button onClick={() => router.push("/products")} className="block py-2 hover:text-green-400">Products</button>
         <button onClick={() => router.push("/about")} className="block py-2 hover:text-green-400">About Us</button>
         <button onClick={() => router.push("/contact")} className="block py-2 hover:text-green-400">Contact</button>
         {status === "authenticated" ? (
           <>
             <button onClick={() => router.push("/orders")} className="block py-2 hover:text-green-400">Orders</button>
             <button onClick={() => router.push("/cart")} className="block py-2 flex items-center space-x-2 hover:text-green-400">
               <ShoppingCart className="w-5 h-5" />
               <span>Cart</span>
             </button>
             {/* User Profile */}
             <div className="flex items-center space-x-3 mt-4 border-t border-gray-700 pt-4">
               <img src={session.user?.image} alt="Profile" className="w-10 h-10 rounded-full" />
               <span className="text-white text-lg font-semibold">{session.user?.name}</span>
             </div>
             <button onClick={() => signOut()} className="w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all mt-3">
               Logout
             </button>
           </>
         ) : (
           <button onClick={() => router.push("/login")} className="block py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-all">Login</button>
         )}
       </div>
     )}
     
           </header>

      {/* Product Container */}
      <div className="max-w-6xl mx-auto mt-20 bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 flex flex-col md:flex-row">
        {/* Left - Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <img
            src={selectedImage}
            alt={product.name}
            className="h-64 w-64 sm:h-80 sm:w-80 md:h-96 md:w-96 object-cover rounded-lg border border-gray-600"
          />
          <div className="flex mt-4 space-x-2 sm:space-x-4 overflow-x-auto">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="product"
                className={`h-12 w-12 sm:h-16 sm:w-16 object-cover cursor-pointer rounded-md border-2 ${
                  selectedImage === img ? "border-blue-400" : "border-gray-600"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-300 mt-2">{product.description}</p>

          <div className="mt-4">
            <p className="text-green-400 text-xl sm:text-2xl font-semibold">₹{product.price}</p>
            <p className="text-gray-400 text-sm sm:text-lg">Inclusive of all taxes</p>
          </div>
          <Toaster />
          {/* Size Selection */}
      {product.size && product.size.length > 0 && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-gray-300">Select Size:</p>
          <div className="flex flex-wrap justify-center space-x-2 mt-2">
            {product.size.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 rounded-lg border-2 ${
                  selectedSize === size ? "border-blue-400 bg-blue-500 text-white" : "border-gray-600 text-gray-300"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

          <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition" onClick={addToCart}>
              Add to Cart
            </button>
            <button className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition" onClick={() => router.push("/products")}>
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="max-w-6xl mx-auto mt-10 mb-10 bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
  <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">Product Description</h2>
  <p className="text-gray-300 mt-4 text-lg leading-relaxed">
    {product.descriptionmore}
  </p>
</div>


      {/* Call to Action */}
      <section className="py-20 px-10 bg-green-600 text-white text-center flex flex-col items-center justify-center">
        <h3 className="text-3xl font-bold">Join Our Eco-Friendly Journey</h3>
        <p className="mt-4 max-w-xl">Be part of a community that values sustainability and craftsmanship.</p>
        <button onClick={() => router.push("/products")} className="mt-6 px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-200">Shop Now</button>
      </section>
       {/* Footer */}
       <footer className="py-12 px-10 bg-gray-900 text-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
    
    {/* Company Info */}
    <div>
      <h4 className="text-2xl font-bold text-green-400">Eko Hand</h4>
      <p className="mt-4 text-gray-400">Crafting a sustainable future, one product at a time.</p>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-xl font-bold">Quick Links</h4>
      <ul className="mt-4 space-y-2 text-gray-400">
        <li><button onClick={() => router.push("/products")} className="hover:text-green-400">Products</button></li>
        <li><button onClick={() => router.push("/about")} className="hover:text-green-400">About Us</button></li>
        <li><button onClick={() => router.push("/contact")} className="hover:text-green-400">Contact</button></li>
      </ul>
    </div>

    {/* Company Policies */}
    <div>
      <h4 className="text-xl font-bold">Company</h4>
      <ul className="mt-4 space-y-2 text-gray-400">
        <li><button onClick={() => router.push("/privacy-policy")} className="hover:text-green-400">Privacy Policy</button></li>
        <li><button onClick={() => router.push("/refund-policy")} className="hover:text-green-400">Refund Policy</button></li>
        <li><button onClick={() => router.push("/terms")} className="hover:text-green-400">Terms & Conditions</button></li>
        <li><button onClick={() => router.push("/copyright")} className="hover:text-green-400">Copyright</button></li>
      </ul>
    </div>

    {/* Support Section */}
    <div>
      <h4 className="text-xl font-bold">Support</h4>
      <p className="mt-4 text-gray-400">Need help? Contact us.</p>
      <div className="mt-4 flex flex-col space-y-3">
        <a href="https://wa.me/+918917593576" target="_blank" rel="noopener noreferrer" className="bg-green-500 px-4 py-2 rounded-lg text-center hover:bg-green-600 transition-all">
          WhatsApp
        </a>
        <a href="mailto:team@ekohand.com" className="bg-blue-500 px-4 py-2 rounded-lg text-center hover:bg-blue-600 transition-all">
          Email Support
        </a>
      </div>
    </div>

  </div>

  {/* Copyright Section */}
  <div className="mt-10 border-t border-gray-700 text-center py-4 text-gray-400">
    All Rights Reserved © 2025 | EkoHand
  </div>
</footer>
    </div>
  );
}
