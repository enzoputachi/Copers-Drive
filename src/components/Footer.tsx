import React, { useState } from "react";
import { Facebook, Twitter, Instagram, Mail, ArrowUp, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  // Mock settings data for demonstration
  const { data, isLoading, error } = useSettings()
  const settings = data?.data?.data;
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);

  console.log("Settings Data:", settings);

  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinWhatsApp = () => {
    const whatsAppUrl = settings?.whatsAppUrl;
    const whatsappGroupLink = whatsAppUrl;
    window.open(whatsappGroupLink, "_blank"); // Replace with actual link
  };
  
  return (
    <footer className="bg-green-800 text-white pt-16 pb-8 relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4 text-yellow-400">
              Corpers Drive
            </div>
            <p className="text-gray-40 mb-4 leading-relaxed">
              Your trusted transportation partner for safe and reliable journeys
              to and from NYSC camps across Nigeria.
            </p>
            {/* <div className="flex space-x-4">
              <a
                href={settings?.facebookUrl || "#"}
                aria-label="Facebook"
                className="text-gray-50 hover:text-yellow-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
              >
                <Facebook size={20} />
              </a>
              <a
                href={settings?.twitterUrl || "#"}
                aria-label="Twitter"
                className="text-gray-50 hover:text-yellow-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
              >
                <Twitter size={20} />
              </a>
              <a
                href={settings?.instagramUrl || "#"}
                aria-label="Instagram"
                className="text-gray-50 hover:text-yellow-400 transition-colors duration-300 p-2 rounded-full hover:bg-gray-800"
              >
                <Instagram size={20} />
              </a>
            </div> */}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Contact Us
            </h3>
            <div className="space-y-3 text-gray-40">
              <div>
                <div className="font-medium text-white mb-1">
                  Email Support:
                </div>
                <a
                  href={`mailto:${settings?.contactEmail}`}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  {settings?.contactEmail}
                </a>
              </div>
              <div>
                <div className="font-medium text-white mb-1">
                  Booking Hotline:
                </div>
                <a
                  href={`tel:${settings?.contactPhone}`}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  {settings?.contactPhone}
                </a>
              </div>
              <div>
                <div className="font-medium text-white mb-1">Head Office:</div>
                <address className="not-italic">{settings?.address}</address>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-gray-30 hover:text-yellow-400 transition-colors duration-300 block py-1"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/booking"
                  className="text-gray-30 hover:text-yellow-400 transition-colors duration-300 block py-1"
                >
                  Book Ticket
                </a>
              </li>
              <li>
                <a
                  href="/manage-booking"
                  className="text-gray-30 hover:text-yellow-400 transition-colors duration-300 block py-1"
                >
                  Manage Booking
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-30 hover:text-yellow-400 transition-colors duration-300 block py-1"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us & Subscribe */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-6">
              <a
                href={settings?.facebookUrl || "#"}
                aria-label="Facebook"
                className="text-gray-50 hover:text-yellow-400 transition-all duration-300 hover:bg-gray-800 p-2 rounded-full hover:-translate-y-2 hover:scale-105"
              >
                <div>
                  <Facebook size={24} />
                </div>
              </a>
              <a
                href={settings?.twitterUrl || "#"}
                aria-label="Twitter"
                className="text-gray-50 hover:text-yellow-400 transition-all duration-300 hover:bg-gray-800 p-2 rounded-full hover:-translate-y-2 hover:scale-105"
              >
                <Twitter size={24} />
              </a>
              <a
                href={settings?.instagramUrl || "#"}
                aria-label="Instagram"
                className="text-gray-50 hover:text-yellow-400 transition-all duration-300 hover:bg-gray-800 p-2 rounded-full hover:-translate-y-2 hover:scale-105"
              >
                <Instagram size={24} />
              </a>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-2">
                Join Our Community
              </h4>
              <button
                onClick={() => setShowWhatsAppDialog(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-300 font-medium"
              >
                <MessageCircle size={20} />
                <span>Join WhatsApp Community</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-50 text-sm">
            <div>
              &copy; {year} Corpers Drive Transportation Ltd. All rights
              reserved.
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-6">
              <a href="#" className="transition-colors duration-300">
                Privacy Policy
              </a>
              <Link to="terms" className="transition-colors duration-300">
                Terms & Conditions
              </Link>
              <a href="#" className="transition-colors duration-300">
                Disclaimer
              </a>
              <a href="/about" className=" transition-colors duration-300">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute bottom-8 hover:animate-bounce right-8 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg transition-colors duration-300 "
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Join Our Travel Community
            </DialogTitle>
            <DialogDescription>
              Connect with other travelers and get exclusive updates!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                🚌 Get real-time travel updates
                <br />
                💬 Connect with fellow travelers
                <br />
                🎁 Access exclusive offers & discounts
                <br />
                📍 Receive important route information
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  handleJoinWhatsApp();
                  setShowWhatsAppDialog(false);
                }}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Join WhatsApp Community
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWhatsAppDialog(false)}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;