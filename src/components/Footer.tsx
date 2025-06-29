
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useApi";

const Footer = () => {
  const { data, isLoading, error } = useSettings()
  const settings = data?.data?.data;
  console.log("Seetings DATA:", settings);
  
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-green-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold mb-4">Corpers Drive</div>
            <p className="text-gray-200 mb-4">
              Your trusted transportation partner for safe and reliable journeys to and from NYSC camps across Nigeria.
            </p>
            <div className="flex space-x-4">
              <a href={`${settings?.facebookUrl}` || "#"} aria-label="Facebook" className="text-gray-200 hover:text-white transition-colors">
                <Facebook />
              </a>
              <a href={`${settings?.twitterUrl}` || "#"} aria-label="Twitter" className="text-gray-200 hover:text-white transition-colors">
                <Twitter />
              </a>
              <a href={`${settings?.instagramUrl}` || "#"} aria-label="Instagram" className="text-gray-200 hover:text-white transition-colors">
                <Instagram />
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-gray-200">
              <div>
                <div className="font-medium">Email Support:</div>
                <a href="mailto:corpersdrive@gmail.com" className="hover:text-white transition-colors">
                  {`${settings?.contactEmail}`}
                </a>
              </div>
              <div>
                <div className="font-medium">Booking Hotline:</div>
                <a href="tel:+2348012345678" className="hover:text-white transition-colors">
                  
                </a>
              </div>
              <div>
                <div className="font-medium">Head Office:</div>
                <address className="not-italic">
                  {`${settings?.address}`}
                </address>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                {/* <Link to="/schedules" className="text-gray-200 hover:text-white transition-colors">
                  Schedules
                </Link> */}
              </li>
              <li>
                <Link to="/booking" className="text-gray-200 hover:text-white transition-colors">
                  Book Ticket
                </Link>
              </li>
              <li>
                <Link to="/manage-booking" className="text-gray-200 hover:text-white transition-colors">
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                {/* <Link to="/agent-login" className="text-gray-200 hover:text-white transition-colors">
                  Agent Login
                </Link> */}
              </li>
            </ul>
          </div>
          
          {/* Terminals */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Terminals</h3>
            <ul className="space-y-2 text-gray-200">
              <li>Lagos - Ikeja Terminal</li>
              <li>Lagos - Yaba Terminal</li>
              {/* <li>Abuja - Central Terminal</li>
              <li>Port Harcourt - Main Terminal</li>
              <li>Enugu - City Terminal</li>
              <li>Kaduna - Central Terminal</li> */}
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-200" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-200 text-sm">
          <div>
            &copy; {year} Corpers Drive Transportation Ltd. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
