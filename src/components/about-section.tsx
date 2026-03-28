import { Target, Rocket, Users, Code, BrainCircuit } from "lucide-react";

export function AboutSection() {
  const teamMembers = [
    {
      name: "Andrew Tiger Hoang",
      title: "Cofounder",
      icon: <Code className="w-12 h-12 text-[#95bdc9] mb-4 group-hover:scale-110 transition-transform duration-500" />,
    },
    {
      name: "Danny Le",
      title: "Cofounder",
      icon: <Code className="w-12 h-12 text-[#95bdc9] mb-4 group-hover:scale-110 transition-transform duration-500" />,
    },
    {
      name: "Aman Sahu",
      title: "Cofounder & AI Algorithms Developer",
      icon: <BrainCircuit className="w-12 h-12 text-[#95bdc9] mb-4 group-hover:scale-110 transition-transform duration-500" />,
    },
  ];

  return (
    <section id="about" className="bg-[#000000] text-white py-32 px-4 md:px-12 lg:px-24 overflow-hidden relative w-full">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-32 w-full">
        
        {/* Header Section */}
        <div className="text-left animate-in fade-in duration-1000 w-full">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e8e8e8] to-[#95bdc9] mb-6 pb-2 drop-shadow-[0_0_15px_rgba(126,227,135,0.2)]">
            About ADDR
          </h2>
          <p className="text-lg md:text-xl text-[#95bdc9] tracking-widest uppercase font-light max-w-xl">
            Innovating the future of autonomous rescue operations
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full">
          
          {/* Mission Card */}
          <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 transition-all duration-500 group animate-in fade-in duration-1000 text-left border border-[#2C2C2E]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#000000] border border-[#2C2C2E] flex items-center justify-center group-hover:bg-[#95bdc9]/10 transition-colors duration-500">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-[#95bdc9]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Our Mission</h3>
            </div>
            <p className="text-[#a0a0a5] text-base md:text-lg leading-relaxed font-light">
              Drones have seen rapid adoption in industries like agriculture, 
              videography, and logistics. We as ADDR see drones having potential 
              in life-saving scenarios, aiming for the greatest possible impact 
              within disaster response and search and rescue operations.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#1C1C1E] rounded-2xl p-8 md:p-12 transition-all duration-500 group animate-in fade-in duration-1000 text-left border border-[#2C2C2E]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#000000] border border-[#2C2C2E] flex items-center justify-center group-hover:bg-[#95bdc9]/10 transition-colors duration-500">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#95bdc9]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Our Vision</h3>
            </div>
            <p className="text-[#a0a0a5] text-base md:text-lg leading-relaxed font-light mb-4">
              Leveraging AI advancements and powerful hardware, we envision a flexible network 
              of autonomous drones working with a master AI system to rapidly access hard-to-reach 
              areas and streamline emergency response and communication.
            </p>
            <p className="text-[#a0a0a5] text-base md:text-lg leading-relaxed font-light">
              Our ultimate goal is to reduce response times, make rescue operations more accurate 
              and efficient, and remove the possibility of any type of error. In the future, we 
              plan to expand into the different horizons of drone technology.
            </p>
          </div>
          
        </div>

        {/* Team Section */}
        <div className="animate-in fade-in duration-1000 w-full text-left">
          <div className="mb-12 md:mb-16 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#95bdc9]" />
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Meet Our Team</h3>
            </div>
            <p className="text-[#a0a0a5] font-light text-base md:text-lg max-w-2xl">
              We are dedicated students with a passion for AI and robotics, committed to making a difference through our innovative drone technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-[#1C1C1E] rounded-2xl p-8 group transition-all duration-500 border border-[#2C2C2E] text-left flex flex-col items-start"
              >
                {member.icon}
                <h4 className="text-lg md:text-xl font-bold text-[#e8e8e8]">{member.name}</h4>
                <p className="text-[#95bdc9] text-xs md:text-sm mt-2 font-mono tracking-wider">{member.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
