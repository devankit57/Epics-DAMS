import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, X, School, FileText, Bell, Users, BookOpen, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolling ? "bg-white shadow-md" : "bg-transparent"
        }`}
        style={{ height: "4rem" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full h-full px-6">
          <h1
            className="text-3xl font-bold text-[rgb(189,20,20)] cursor-pointer"
            onClick={() => router.push("/")}
          >
            DAMS
          </h1>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button onClick={() => router.push("/features")} className="text-gray-700 hover:text-[rgb(189,20,20)] transition-all">
              Features
            </button>
            <button onClick={() => router.push("/about")} className="text-gray-700 hover:text-[rgb(189,20,20)] transition-all">
              About Us
            </button>
            <button onClick={() => router.push("/contact")} className="text-gray-700 hover:text-[rgb(189,20,20)] transition-all">
              Contact
            </button>
            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-gray-700 hover:text-[rgb(189,20,20)] transition-all"
                >
                  Dashboard
                </button>
                <div className="flex items-center space-x-3">
                  <img
                    src={session.user?.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-[rgb(189,20,20)] shadow-lg"
                  />
                  <span className="text-gray-800 font-semibold">{session.user?.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="bg-[rgb(189,20,20)] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Login
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white text-gray-800 absolute top-16 left-0 w-full py-5 px-6 shadow-lg z-50">
            <button
              onClick={() => router.push("/features")}
              className="block py-2 hover:text-[rgb(189,20,20)]"
            >
              Features
            </button>
            <button
              onClick={() => router.push("/about")}
              className="block py-2 hover:text-[rgb(189,20,20)]"
            >
              About Us
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="block py-2 hover:text-[rgb(189,20,20)]"
            >
              Contact
            </button>
            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="block py-2 hover:text-[rgb(189,20,20)]"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full text-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all mt-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="block py-2 bg-[rgb(189,20,20)] text-white text-center rounded-lg hover:bg-red-700 transition-all"
              >
                Login
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-cover bg-center bg-gradient-to-r from-red-100 to-red-50 text-gray-900">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-[rgb(189,20,20)]">
            Empowering Education Digitally
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Monitor, analyze, and enhance academic performance with DAMS.
          </p>
          <button
            onClick={() => router.push("/features")}
            className="mt-4 inline-block px-8 py-3 bg-[rgb(189,20,20)] text-white rounded-lg text-lg font-semibold hover:bg-red-700 transition-all"
          >
            Explore Features
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-10 bg-white text-center">
        <h3 className="text-4xl font-bold text-[rgb(189,20,20)]">Key Features</h3>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {[
            {
              title: "Real-Time Monitoring",
              description: "Track student performance and attendance in real-time.",
              icon: <School className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
            {
              title: "Automated Reports",
              description: "Generate detailed academic reports for insightful analysis.",
              icon: <FileText className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
            {
              title: "Custom Notifications",
              description: "Send instant notifications to parents and teachers.",
              icon: <Bell className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200"
            >
              {feature.icon}
              <h4 className="text-2xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-10 bg-gray-100 text-center">
        <h3 className="text-4xl font-bold text-[rgb(189,20,20)]">About Us</h3>
        <div className="mt-8 max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed">
          <p className="mb-4">
            DAMS (Digital Academic Monitoring System) is committed to revolutionizing education by 
            providing real-time insights and analytics to enhance academic performance. Our platform 
            empowers educators, parents, and students by offering a seamless interface to track 
            attendance, generate reports, and send custom notifications.
          </p>
          <p>
            With our innovative solutions, we aim to bridge the gap between traditional and digital 
            education, ensuring that every institution can harness the power of data to improve learning outcomes.
          </p>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-10 bg-red-50 text-center">
        <h3 className="text-4xl font-bold text-[rgb(189,20,20)]">Our Impact</h3>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {[
            {
              title: "500+ Schools Connected",
              description: "Bringing digital transformation to educational institutions.",
              icon: <BookOpen className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
            {
              title: "10,000+ Teachers Engaged",
              description: "Empowering educators to enhance learning outcomes.",
              icon: <Users className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
            {
              title: "50,000+ Students Benefited",
              description: "Improving academic results and student performance.",
              icon: <UserCheck className="w-16 h-16 mx-auto mb-6 text-[rgb(189,20,20)]" />,
            },
          ].map((impact, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200"
            >
              {impact.icon}
              <h4 className="text-2xl font-semibold mb-2 text-gray-800">{impact.title}</h4>
              <p className="text-gray-600">{impact.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h4 className="text-2xl font-bold text-[rgb(189,20,20)]">DAMS</h4>
            <p className="mt-4 text-gray-400">Empowering education through technology.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li>
                <button
                  onClick={() => router.push("/features")}
                  className="hover:text-[rgb(189,20,20)]"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/about")}
                  className="hover:text-[rgb(189,20,20)]"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/contact")}
                  className="hover:text-[rgb(189,20,20)]"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold">Support</h4>
            <p className="mt-4 text-gray-400">Need help? Contact us.</p>
            <button
              onClick={() => router.push("/support")}
              className="bg-[rgb(189,20,20)] px-4 py-2 rounded-lg text-center text-white mt-4 hover:bg-red-700 transition-all"
            >
              Get Support
            </button>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-700 text-center py-4 text-gray-400">
          All Rights Reserved © 2025 | DAMS
        </div>
      </footer>
    </div>
  );
}
