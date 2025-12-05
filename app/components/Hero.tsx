import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
      
      {/* Column 1: Text Content */}
      <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left"> 
        
        {/* Row 1: Big Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-purple-700 leading-tight">
          Join the waitlist and be the first to get notified when we launch.
        </h1>

        {/* Row 2: Subtitle */}
        <p className="text-lg md:text-xl text-black font-medium">
          One platform. One community. One church.
        </p>

        {/* Row 3: Button */}
        <button className="w-full sm:w-auto bg-[#1a0b2e] text-white px-10 py-4 rounded-lg font-medium shadow-[0_4px_20px_-2px_rgba(126,34,206,0.5)] hover:shadow-[0_4px_25px_-2px_rgba(126,34,206,0.6)] hover:scale-105 transition-all duration-300">
          Join waitlist now
        </button>
      </div>

      {/* Column 2: Logo / Image */}
      <div className="flex justify-center md:justify-end w-full">
        <Image 
          src="/Diocese_Logo.png" 
          alt="Diocese Coat of Arms" 
          width={500} 
          height={500} 
          className="w-full max-w-[300px] md:max-w-[450px] h-auto object-contain drop-shadow-xl"
          priority
        />
      </div>

    </section>
  );
}