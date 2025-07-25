import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, ArrowLeft } from 'lucide-react';

const CustomSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option", 
  searchPlaceholder = "Search",
  disabled = false,
  label = "",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOption = options.find(option => option === value);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm items-center justify-between"
      >
        <span className={`truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
          {selectedOption || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Full Screen Overlay for Mobile */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" />
          
          {/* Dropdown */}
          <div className="fixed inset-0 z-50 bg-white md:absolute md:top-full md:left-0 md:right-0 md:inset-auto md:mt-1 md:bg-white md:border md:border-gray-200 md:rounded-md md:shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h3 className="text-base font-medium text-gray-900">
                {label || "Please Select Source"}
              </h3>
              <div className="w-6" />
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 border-0"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="flex-1 overflow-y-auto max-h-96 md:max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className={`
                      w-full px-4 py-4 text-left border-b border-gray-100 last:border-b-0
                      hover:bg-gray-50 transition-colors
                      ${option === value ? 'bg-green-50 text-green-600 font-medium' : 'text-gray-900'}
                    `}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;