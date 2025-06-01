
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock component wrapper with router
const NavbarWithRouter = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);

describe('Navbar Component', () => {
  test('renders logo and navigation links on desktop', () => {
    render(<NavbarWithRouter />);
    
    // Check if logo is displayed
    expect(screen.getByText('Copers Drive')).toBeInTheDocument();
    
    // Check if desktop navigation links are displayed
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Online Booking')).toBeInTheDocument();
    expect(screen.getByText('Schedules')).toBeInTheDocument();
    expect(screen.getByText('Manage Booking')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });
  
  test('opens and closes mobile menu on button click', () => {
    // Mock window innerWidth to simulate mobile view
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    
    render(<NavbarWithRouter />);
    
    // Open menu button should be visible (doesn't have aria-label of "Close menu")
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    // Close menu button should now be visible
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    
    // Links should be visible in mobile menu
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(screen.getByLabelText('Close menu'));
    
    // Open menu button should be visible again
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });
});
