"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* --- LEFT: Logo --- */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/Unum_Logo.svg" alt="Logo" width={36} height={36} />
              <span className="ml-2 font-semibold text-lg">Unum Sint</span>
            </Link>
          </div>

          {/* --- CENTER: Desktop Nav (Hidden on Mobile) --- */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-purple-900 transition">Home</a>
            <a href="#about" className="text-gray-700 hover:text-purple-900 transition">About</a>
            <a href="#goal" className="text-gray-700 hover:text-purple-900 transition">Goal</a>
            <a href="#features" className="text-gray-700 hover:text-purple-900 transition">Features</a>
            <a href="#contact" className="text-gray-700 hover:text-purple-900 transition">Contact</a>
          </nav>

          {/* --- RIGHT: Desktop Action Button (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSftpGWQpKe5rfDc06GMOwbAvWED6lCp4UGWaTJouUHYU5EYIw/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-purple-950 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
                Join Waitlist
              </button></a>
          </div>

          {/* --- MOBILE: Hamburger Button (Visible on Mobile) --- */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-900 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon switches based on state */}
              {!isMenuOpen ? (
                /* Hamburger Icon */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Close (X) Icon */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {/* Only renders when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <a href="#home" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-900 hover:bg-gray-50">Home</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-900 hover:bg-gray-50">About</a>
            <a href="#goal" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-900 hover:bg-gray-50">Goal</a>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-900 hover:bg-gray-50">Features</a>
            <a href="#contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-900 hover:bg-gray-50">Contact</a>

            {/* Mobile Action Button */}
            <div className="mt-4 px-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSftpGWQpKe5rfDc06GMOwbAvWED6lCp4UGWaTJouUHYU5EYIw/viewform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="w-full bg-purple-950 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
                  Join Waitlist
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}