import Image from "next/image";
import { Phone, Mail } from "lucide-react"; // Ensure you have lucide-react installed

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Grid Layout: Stacks on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 items-start">
            
            {/* Column 1: Branding & Logo */}
            <div className="space-y-8">
                {/* Unum Sint Brand */}
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                         <Image
                            src="/Unum_Sint_White.png"
                            alt="Catholic Diocese of Port Harcourt"
                            width={40}
                            height={40}
                            className="object-contain p-0.5"
                         />
                    </div>
                    <span className="text-sm font-medium text-gray-200">Unum Sint</span>
                </div>

                {/* Diocese Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
                         <Image
                            src="/Diocese_Logo.png"
                            alt="Catholic Diocese of Port Harcourt"
                            width={40}
                            height={40}
                            className="object-contain p-0.5"
                         />
                    </div>
                    <span className="text-sm font-medium text-gray-200">Catholic Diocese of Port Harcourt</span>
                </div>
            </div>

            {/* Column 2: Contact Info */}
            <div>
                <h3 className="font-bold text-lg mb-6">Contact us</h3>
                <div className="space-y-4 text-sm text-gray-300">
                    
                    {/* Phone Numbers */}
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 mt-0.5 shrink-0" />
                        <span>
                            0810 133 0277 
                            <span className="text-gray-500 mx-2">or</span> 
                            0803 861 2926
                        </span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 shrink-0" />
                        <a href="mailto:buildunumsint@gmail.com" className="hover:text-white transition-colors">
                            buildunumsint@gmail.com
                        </a>
                    </div>
                </div>
            </div>

            {/* Column 3: Quote (Aligned right on desktop) */}
            <div className="md:text-right pt-2 md:pt-0">
                <p className="italic text-gray-200 text-base mb-1">
                    'Ut omnes unum sint'
                </p>
                <p className="text-gray-400 text-sm">
                    That they may all be one.
                </p>
            </div>
        </div>

        {/* Bottom Separator Line */}
        <div className="border-t border-gray-800 w-full h-px"></div>
        
      </div>
    </footer>
  );
}