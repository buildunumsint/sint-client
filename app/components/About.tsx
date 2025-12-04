

export default function About() {
  return (
    <section className="relative bg-[#2e0249] py-20 px-6 overflow-hidden">
      
      {/* --- Decorative Background Rings (Mimicking the screenshot's curves) --- */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -left-20 top-0 w-80 h-80 rounded-full border-[16px] border-purple-400/30"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full border-[24px] border-purple-500/20 translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* --- Content Container --- */}
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
        
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3">About us</h2>
        
        {/* Subheader - Using a lighter lavender color for contrast */}
        <h3 className="text-xl md:text-2xl text-purple-200 font-medium mb-8">
            Building a Connection that Lasts Forever
        </h3>

        {/* Text Body */}
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-purple-50/90">
            <p>
                <span className="font-bold italic">Unum Sint</span>, derived from the Latin phrase 
                <span className="italic"> “Ut omnes unum sint”</span>, meaning 
                <span className="font-bold"> “That they may all be one”</span> (John 17:21), 
                embodies the prayer of Christ for unity within His Church.
            </p>
            
            <p>
                Born from this vision, <span className="font-bold">Unum Sint</span> is a digital platform developed by the Catholic Diocese of Port Harcourt to connect Parishes, strengthen communication, and bring various forms of Church life into one unified digital space, rooted in faith. Our goal is to help the Diocese live out its call to communion, to be one body, united in mission and spirit.
            </p>
        </div>

      </div>
    </section>
  );
}
