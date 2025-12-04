import Image from "next/image";

// Data array to keep the code clean and easier to manage
const featureList = [
  {
    title: "Database & Archive",
    description: "A secure digital record system for the entire Diocese, storing parish data, clergy information, and sacramental records in one unified place.",
    imageSrc: "/feature_images/archive.png", // Replace with your actual image path
  },
  {
    title: "Catechesis Hub",
    description: "An online space for sermons, reflections and diocesan-approved catechetical content for Catholics, in audio, video and text formats.",
    imageSrc: "/feature_images/catechesis.png", 
  },
  {
    title: "Social Media Communication",
    description: "A safe, faith-based social space for the Diocesan community to connect, share announcements, and stay informed on all parish and Diocesan events.",
    imageSrc: "/feature_images/social.png", 
  },
  {
    title: "AI Chatbot",
    description: "Your AI-powered Faith Companion for guidance on doctrinal issues and instant access to faith-based questions and answers, just a click away!",
    imageSrc: "/feature_images/chatbot.png", 
  },
  {
    title: "Faith Quest",
    description: "A faith-based, gamified learning module designed by Logic-Dev Studios, aimed at making catechesis fun, exciting, and engaging.",
    imageSrc: "/feature_images/faith-quest.png", 
  },
];

export default function Features() {
  return (
    <section className="relative py-20 px-6 bg-white overflow-hidden">
      
      {/* Decorative Background Lines (Optional visual match for the wireframe curves in screenshot) */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-5">
         {/* You can replace this SVG with the actual wave pattern graphic if you have it */}
         <svg className="absolute top-0 right-0 w-full h-[800px]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="purple" vectorEffect="non-scaling-stroke"/>
         </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Features
          </h2>
          <p className="text-lg md:text-xl text-purple-800 font-medium">
            Faith, Communication, and Fun - All in One Place
          </p>
        </div>

        {/* Card Grid */}
        {/* using flex-wrap + justify-center creates the 3-top / 2-bottom centered layout */}
        <div className="flex flex-wrap justify-center gap-8">
          {featureList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow duration-300 w-full md:max-w-[350px] flex flex-col overflow-hidden"
            >
              {/* Image Area */}
              <div className="relative h-52 w-full bg-gray-200">
                <Image
                  src={feature.imageSrc}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>

              {/* Text Content */}
              <div className="p-6 text-center flex flex-col items-center flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}