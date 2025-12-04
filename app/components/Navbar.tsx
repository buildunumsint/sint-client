import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* left: logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/Unum_Logo.svg" alt="Logo" width={36} height={36} />
              <span className="ml-2 font-semibold text-lg">Unum Sint</span>
            </Link>
          </div>

          {/* center: nav */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden sm:flex space-x-8">
              <Link href="#" className="text-gray-700 hover:text-gray-900">Home</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900">About</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900">Goal</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900">Features</Link>
              <Link href="#" className="text-gray-700 hover:text-gray-900">Contact</Link>
            </nav>
          </div>

          {/* right: action button */}
          <div className="flex items-center">
            <button className="ml-4 bg-purple-950 text-white px-4 py-2 rounded-md hover:bg-purle-700">Join Waitlist</button>
          </div>
        </div>
      </div>
    </header>
  );
}
