import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      
      {/* Column 1: Text Content */}
      <div className="space-y-8"> 
        {/* Row 1: Big Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-purple-700 leading-tight">
          Join the waitlist and be the first to get notified when we launch.
        </h1>

        {/* Row 2: Subtitle */}
        <p className="text-lg md:text-xl text-black font-medium">
          One platform. One community. One church.
        </p>

        {/* Row 3: Button */}
        {/* Added custom shadow and hover effects to match the screenshot's depth */}
        <button className="bg-[#1a0b2e] text-white px-8 py-3.5 rounded-lg font-medium shadow-[0_4px_20px_-2px_rgba(126,34,206,0.5)] hover:shadow-[0_4px_25px_-2px_rgba(126,34,206,0.6)] hover:scale-105 transition-all duration-300">
          Join waitlist now
        </button>
      </div>

      {/* Column 2: Logo / Image */}
      <div className="flex justify-center md:justify-end">
        <Image 
          src="/Diocese_Logo.png" 
          alt="Diocese Coat of Arms" 
          /* Increased size significantly so it looks good on desktop */
          width={500} 
          height={500} 
          /* Ensures the image is responsive */
          className="w-full max-w-[350px] md:max-w-[450px] h-auto object-contain"
          priority
        />
      </div>

    </section>
  );
}