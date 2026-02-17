import SocialIcons from './SocialIcons';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo Section */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex items-center space-x-3">
              {/* EOMC Lips Logo Placeholder */}
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center border-4 border-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-black rounded-t-full"></div>
              </div>
              <span className="text-2xl font-bold">EOMC</span>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="flex justify-center">
            <SocialIcons />
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-right space-y-2">
            <p className="text-sm text-gray-700">
              <a href="mailto:eyesopenmouthsclosed@gmail.com" className="hover:text-black transition-colors">
                eyesopenmouthsclosed@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-700">
              Tel: 1-xxx-xxx-xxxx
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-300 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} EYES OPEN MOUTHS CLOSED. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
