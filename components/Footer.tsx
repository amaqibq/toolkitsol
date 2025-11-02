import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 border-t border-slate-700 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h3 className="text-xl font-bold text-white">ToolKit</h3>
            </div>
            <p className="text-slate-300 mb-4 max-w-md leading-relaxed">
              Essential tools for digital creators. Convert, generate, count, and edit with ease.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Tools</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/tools/image-converter"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Image Converter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/qr-generator"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                >
                  QR Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/content-counter"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Content Counter
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/background-remover"
                  className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
                >
                  Background Remover
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#privacy" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-slate-300 hover:text-blue-400 transition-colors duration-200">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400">© 2025 ToolKit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
