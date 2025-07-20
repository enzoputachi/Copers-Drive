// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hasSubmittedPassengerData, resetForm } = useBookingStore();
  const navigate = useNavigate();

  const handleProtectNav = (path: string) => (e: React.MouseEvent) => {
    if (hasSubmittedPassengerData) {
      e.preventDefault();
      if (window.confirm('Your booking is in progress. Leaving now will lose your progress. Do you want to continue?')) {
        resetForm();
        navigate(path);
      }
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(open => !open);

  // Uniform nav link classes
  const navLinkClasses = `
    relative px-4 py-2 font-medium text-gray-700 
    transition-all duration-300 ease-in-out
    hover:text-green-700 
    before:absolute before:bottom-0 before:left-0 before:h-0.5 before:w-0 
    before:bg-green-700 before:transition-all before:duration-300 
    hover:before:w-full
    transform hover:scale-105
  `;

  const mobileNavLinkClasses = `
    block px-4 py-3 font-medium text-gray-700 
    transition-all duration-300 ease-in-out
    hover:text-green-700 hover:bg-green-50
    hover:translate-x-2 hover:shadow-sm
    rounded-lg mx-2
  `;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm h-[5rem]">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="transition-transform duration-300 hover:scale-105"
              onClick={handleProtectNav('/')}
            >
              <img 
                src="/logo.png" 
                className="h-8 md:h-12 transition-all duration-300" 
                alt="Logo" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className={navLinkClasses}
              onClick={handleProtectNav('/')}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={navLinkClasses}
              onClick={handleProtectNav('/about')}
            >
              About
            </Link>
            <Link 
              to="/manage-booking" 
              className={navLinkClasses}
              onClick={handleProtectNav('/manage-booking')}
            >
              Manage Booking
            </Link>
            <Link 
              to="/contact" 
              className={navLinkClasses}
              onClick={handleProtectNav('/contact')}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 
                       transition-all duration-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-green-200" 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <Menu 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden bg-white transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            <Link 
              to="/" 
              className={mobileNavLinkClasses}
              onClick={handleProtectNav('/')}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={mobileNavLinkClasses}
              onClick={handleProtectNav('/about')}
            >
              About
            </Link>
            <Link 
              to="/manage-booking" 
              className={mobileNavLinkClasses}
              onClick={handleProtectNav('/manage-booking')}
            >
              Manage Booking
            </Link>
            <Link 
              to="/contact" 
              className={mobileNavLinkClasses}
              onClick={handleProtectNav('/contact')}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;