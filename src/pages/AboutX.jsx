import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Target, Eye, Quote, Bus, MapPin, Clock, Shield } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Alimi Nurudeen Adeleye",
      position: "Chief Financial Officer",
      description: "The Chief Financial Officer of Corpers Drive oversees all financial operations, ensuring transparency, sustainability, and efficiency in managing the company's resources. He is responsible for budgeting, financial planning, record-keeping, and reporting.",
      bgColor: "bg-green-50"
    },
    {
      name: "ISAKUNLE EMMANUEL AYOBAMI",
      position: "Brand Strategist", 
      description: "The Brand Strategist of Corpers Drive is responsible for shaping and strengthening the company's brand identity across all platforms. He helps develop creative strategies that enhance brand visibility, engagement, and loyalty among Corps Members.",
      bgColor: "bg-blue-50"
    },
    {
      name: "OGUNLANA IBRAHIM OLADAYO",
      position: "Public Relations Officer",
      description: "The Public Relations Officer of Corpers Drive is responsible for managing the company's image and communications with the public, partners, and stakeholders. He crafts and delivers clear, positive messages that reflect the brand's values.",
      bgColor: "bg-amber-50"
    },
    {
      name: "[Name TBD]",
      position: "Chief Customer Service Officer",
      description: "The Chief Customer Service Officer of Corpers Drive leads all customer experience initiatives, ensuring every interaction reflects the company's commitment to excellence and reliability.",
      bgColor: "bg-purple-50"
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
      <Helmet>
        <title>About Us - Corpers Drive</title>
        <meta name="description" content="Learn about Corpers Drive - Nigeria's leading transportation service for NYSC corps members. Our mission, vision, and dedicated team." />
      </Helmet>
      
      <Navbar />
      
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
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white"
          
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {missionVisionData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="group perspective-1000 h-64">
                    <div className="relative preserve-3d w-full h-full duration-500 group-hover:rotate-y-180">
                      {/* Front Face - Only Heading */}
                      <div
                        className="absolute inset-0 w-full h-full backface-hidden"
                        style={{
                          backgroundImage: `url('/bg.jpg')`,
                        }}
                      >
                        <Card className="text-center h-full flex flex-col justify-center border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <CardHeader className="flex-1 flex flex-col justify-center">
                            <div
                              className={`bg-${item.color}-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-${item.color}-200 transition-colors`}
                            >
                              <IconComponent
                                className={`h-8 w-8 text-${item.color}-600 mx-auto`}
                              />
                            </div>
                            <CardTitle
                              className={`text-3xl text-${item.color}-800`}
                            >
                              {item.title}
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-4 italic">
                              Hover to learn m
                            </p>
                          </CardHeader>
                        </Card>
                      </div>

                      {/* Back Face - Only Content */}
                      <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                        <Card
                          className={`h-full flex flex-col justify-center border-0 shadow-lg bg-${item.color}-50 p-6`}
                        >
                          <CardContent className="flex-1 flex items-center justify-center p-0">
                            <p
                              className={`text-${item.color}-800 leading-relaxed text-center`}
                            >
                              {item.content}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section 
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet the People Behind the Wheels</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The dedicated professionals driving Corpers Drive forward with passion and expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <Card key={index} className={`${member.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow">
                        <User className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-1">{member.name}</CardTitle>
                        <p className="text-green-600 font-semibold text-sm uppercase tracking-wide">{member.position}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Address & Contact Strip */}
        <section className="bg-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-green-700 p-3 rounded-full">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Our Location</h3>
                  <p className="text-green-100">No 1, Jibowu, Yaba, Lagos State</p>
                </div>
              </div>
              <button className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>View on Map</span>
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
