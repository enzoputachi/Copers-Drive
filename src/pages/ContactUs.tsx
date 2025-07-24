import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/useApi";

const Contact = () => {
  const { toast } = useToast();
  const { data, isLoading, error } = useSettings();
  const settings = data?.data?.data;
  console.log("Contact settings:", settings);
  

  // State to track message length
  const [messageLength, setMessageLength] = useState(0);
  const MESSAGE_MAX = 500;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const fd = new FormData(form);
    const formData = {
      name: (fd.get("name") as string) || "",
      email: (fd.get("email") as string) || "",
      phone: (fd.get("phone") as string) || "",
      subject: (fd.get("subject") as string) || "",
      message: (fd.get("message") as string) || "",
    };

    try {
      const baseUrl = import.meta.env.VITE_APP_URL;
      const response = await fetch(`${baseUrl}/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast({
        title: "Message sent successfully",
        description: "We've received your message and will get back to you soon.",
      });
      form.reset();
      setMessageLength(0);
    } catch (err) {
      console.error("Error sending contact message:", err);
      toast({
        title: "Failed to send message",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MESSAGE_MAX) {
      setMessageLength(value.length);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Corpers Drive</title>
        <meta
          name="description"
          content="Get in touch with Corpers Drive customer service for any queries or support related to NYSC transport services."
        />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-2 py-4 sm:px-4 sm:py-8 min-h-screen bg-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-12 text-sm sm:text-base px-2">
          Have questions or need assistance? We're here to help. Reach out to us
          through any of the channels below or send us a message directly.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-4 sm:space-y-8">
              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Head Office</h3>
                      <address className="not-italic text-gray-600 text-sm sm:text-base">
                        {settings?.address}
                      </address>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Phone</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{settings?.contactPhone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Email</h3>
                      <p className="text-gray-600 text-sm sm:text-base">{settings?.contactEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">Business Hours</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Monday - Friday: 8am - 8pm</p>
                      <p className="text-gray-600 text-sm sm:text-base">Saturday: 9am - 6pm</p>
                      <p className="text-gray-600 text-sm sm:text-base">Sunday: 10am - 4pm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        required
                        className="h-10 sm:h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        className="h-10 sm:h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      className="h-10 sm:h-12"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                        name="subject"
                      placeholder="What is your message about?"
                      required
                        className="h-10 sm:h-12"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Type your message here..."
                      rows={4}
                      className="sm:min-h-[120px]"
                      required
                      maxLength={MESSAGE_MAX}
                      onChange={handleMessageChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {messageLength}/{MESSAGE_MAX} characters
                    </p>
                  </div>

                  <Button type="submit" className="w-full h-10 sm:h-12">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default Contact;
