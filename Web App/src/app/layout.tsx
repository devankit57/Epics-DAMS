import './globals.css'
import { Inter } from 'next/font/google'
import { Header } from './components/header'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DAMS - Digital Academic Management System',
  description: 'Empowering government schools with digital management tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          #tsparticles {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
          }
        `}</style>
      </head>
      <body className={`${inter.className} bg-white text-black min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-black text-white mt-8">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About DAMS</h3>
                <p className="text-sm text-gray-400">
                  Digital Academic Management System (DAMS) is revolutionizing education management in government schools.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">Support</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-sm text-gray-400">
                  Email: info@dams.in<br />
                  Phone: (123) 456-7890<br />
                  Address: Sehore,MP,India
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              © 2023 DAMS - Digital Academic Management System. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}

