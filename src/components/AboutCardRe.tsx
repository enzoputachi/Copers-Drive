import React from "react";
import { User, Target, Eye, Quote, Bus, MapPin, Clock, Shield } from "lucide-react";

const About = () => {
  const teamMembers = [
  {
    name: "ALIMI NURUDEEN ADELEYE",
    position: "Chief Financial Officer",
    description: "The Chief Financial Officer of Corpers Drive oversees all financial operations, ensuring transparency, sustainability, and efficiency in managing the company's resources. He is responsible for budgeting, financial planning, record-keeping, and reporting.",
    image: ""
  },
  {
    name: "EMMANUEL AYOBAMI",
    position: "Brand Strategist",
    description: "The Brand Strategist of Corpers Drive is responsible for shaping and strengthening the company's brand identity across all platforms. He helps develop creative strategies that enhance brand visibility, engagement, and loyalty among Corps Members.",
    image: ""
  },
  {
    name: "OGUNLANA IBRAHIM OLADAYO",
    position: "Public Relations Officer",
    description: "The Public Relations Officer of Corpers Drive is responsible for managing the company's image and communications with the public, partners, and stakeholders. He crafts and delivers clear, positive messages that reflect the brand's values.",
    image: ""
  },
  {
    name: "OGUNDERU SAMUEL OLUWASEUN",
    position: "Chief Customer Service Officer",
    description: "The Chief Customer Service Officer of Corpers Drive leads all customer experience initiatives, ensuring every interaction reflects the company's commitment to excellence and reliability.",
    image: ""
  }
];



  const serviceIcons = [
    { icon: Bus, label: "Safe Transport" },
    { icon: MapPin, label: "Route Planning" },
    { icon: Clock, label: "Scheduled Trips" },
    { icon: Shield, label: "Security First" }
  ];

  const missionVisionData = [
    {
      title: "Mission",
      icon: Target,
      color: "green",
      content: "Providing world-class and reliable transportation for NYSC corps members. We bridge logistic gaps and strengthen trustworthy networks, ensuring safe journeys while contributing to Nigeria's youth empowerment."
    },
    {
      title: "Vision",
      icon: Eye,
      color: "blue",
      content: "To become Nigeria's leading indigenous brand in transportation and logistics. We envision setting new industry standards while expanding across the nation with innovation, reliability, and excellence."
    },
    {
      title: "Motto",
      icon: Quote,
      color: "amber",
      content: "Your safety and comfort are our top priorities. This motto guides every decision we make, from vehicle maintenance to driver training, delivering peace of mind for you and your loved ones."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50">
      <main>
        {/* Intro Banner */}
        <section className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Changing the Way Corps Members Move
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed opacity-90">
              Logistics made easy, safe, and reliable for Nigerian youth in service.
            </p>
          </div>
        </section>

        {/* Business Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">What We Do</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Corpers Drive is a logistics and transportation service specifically designed for NYSC corps members. 
                  We focus on providing safe, convenient, and organized travel to and from NYSC orientation camps across Nigeria.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our services include coordinating travel schedules, securing reliable vehicles, and ensuring that corps members 
                  have a stress-free journey. The goal is to make camp mobility easier and more reliable for young graduates 
                  during their national service.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {serviceIcons.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <div key={index} className="bg-green-50 p-8 rounded-2xl text-center hover:bg-green-100 transition-colors duration-300 hover:scale-105">
                      <IconComponent className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="font-semibold text-gray-800">{service.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Motto - Flipable Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {missionVisionData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="group perspective-1000 h-64">
                    <div className="relative preserve-3d w-full h-full duration-500 group-hover:rotate-y-180">
                      {/* Front Face - Only Heading */}
                      <div className="absolute inset-0 w-full h-full backface-hidden">
                        <div 
                          className="bg-white rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 text-center h-full flex flex-col justify-center border-0"
                        >
                          <div className="flex-1 flex flex-col justify-center p-6">
                            <div className={`bg-${item.color}-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-${item.color}-200 transition-colors`}>
                              <IconComponent className={`h-8 w-8 text-${item.color}-600 mx-auto`} />
                            </div>
                            <h3 className={`text-3xl font-bold text-${item.color}-800 mb-4`}>{item.title}</h3>
                            <p className="text-sm text-gray-500 italic">Hover to learn more</p>
                          </div>
                        </div>
                      </div>

                      {/* Back Face - Only Content */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <div className={`h-full flex flex-col justify-center border-0 shadow-lg bg-${item.color}-50 p-6 rounded-lg`}>
                          <div className="flex-1 flex items-center justify-center p-0">
                            <p className={`text-${item.color}-800 leading-relaxed text-center`}>
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section - Updated Style */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
               <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet the People Behind the Wheels</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The dedicated professionals driving Corpers Drive forward with passion and expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center group">
                  {/* Profile Image Container */}
                  <div className="relative mb-6">
                    <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shadow-lg overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                          <User className="w-20 h-20 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-4 px-2">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;