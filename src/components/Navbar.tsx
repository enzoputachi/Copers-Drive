// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hasSubmittedPassengerData } = useBookingStore();
  // const shouldPrevent = hasSubmittedPassengerData;
  // const message = 'Your booking is in progress. Leaving now will lose your progress.';

  const toggleMenu = () => setIsMenuOpen(open => !open);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm p-4">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-700" >
              <img src="/logo.png" className="h-[4rem]" alt="Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium" >
              Home
            </Link>
            <Link to="/about" className="text-gray-900 hover:text-primary font-medium">
              
            </Link>
            <Link to="/booking" className="text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium" >
              Online Booking
            </Link>
            <Link to="/manage-booking" className="text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium" >
              Manage Booking
            </Link>
            <Link to="/contact" className="text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium" >
              Contact Us
            </Link>
            <Link to="/admin" className="text-primary hover:text-primary-dark font-medium" >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-white hover:bg-green-800 p-3 focus:outline-none" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium py-2"  onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
             <Link 
              to="/about" 
              className="block text-gray-900 hover:text-primary font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              
            </Link>
            <Link to="/booking" className="block text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium py-2"  onClick={() => setIsMenuOpen(false)}>
              Online Booking
            </Link>
            <Link to="/manage-booking" className="block text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium py-2"  onClick={() => setIsMenuOpen(false)}>
              Manage Booking
            </Link>
            <Link to="/contact" className="block text-green-700 hover:text-white hover:bg-green-800 p-3 font-medium py-2"  onClick={() => setIsMenuOpen(false)}>
              Contact Us
            </Link>
            <Link to="/admin" className="block text-primary hover:text-primary-dark font-medium py-2"  onClick={() => setIsMenuOpen(false)}>
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;