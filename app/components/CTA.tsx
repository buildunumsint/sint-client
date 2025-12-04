export default function CTA() {
  return (
    <section className="relative bg-[#2e0249] py-24 px-6 overflow-hidden">
      
      {/* --- Background Decorative Elements --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Glow Gradients */}
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        {/* Wireframe Wave Simulation (SVG) - Mimics the lines in the screenshot */}
        <svg className="absolute top-0 right-0 h-full w-full md:w-1/2 opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
           <path d="M0 100 Q 50 50 100 0" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M10 100 Q 60 50 100 10" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M20 100 Q 70 50 100 20" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M30 100 Q 80 50 100 30" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M40 100 Q 90 50 100 40" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M50 100 Q 100 50 100 50" stroke="cyan" strokeWidth="0.2" fill="none" />
           <path d="M60 100 Q 110 50 100 60" stroke="cyan" strokeWidth="0.2" fill="none" />
           {/* Add more lines for denser effect if desired */}
        </svg>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white space-y-8">
        
        {/* Primary Heading */}
        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
          Let’s Build the Future of Our Diocese Together!
        </h2>

        {/* Secondary Heading */}
        <p className="text-xl md:text-2xl font-bold text-white/95">
          Be a part of the community shaping the digital future of the Catholic Diocese of Port Harcourt.
        </p>

        {/* Description Text */}
        <p className="text-sm md:text-base text-purple-200 font-light max-w-2xl mx-auto leading-relaxed">
          Join our waitlist to receive updates, get sneak peeks, and become one of the first to experience Unum Sint when we go live.
        </p>

        {/* CTA Button */}
        <div className="pt-6">
          <button className="bg-white text-[#2e0249] px-10 py-4 rounded-lg font-bold shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:scale-105 transition-all duration-300">
            Join waitlist now
          </button>
        </div>

      </div>
    </section>
  );
}