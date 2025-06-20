
import { Seat } from '@/services/adminApi';
import { get } from 'http';
interface SeatIconProps {
    isAvailable: boolean;
    isSelected: boolean;
}

const SeatIcon = ({ isAvailable, isSelected }: SeatIconProps) => {
    const getColors = () => {
        if (!isAvailable) {
            return { fill: '#9CA3AF', stroke: '#6B7280' };  // gray-400 / gray-500
        }
        if (isSelected) {
            return { fill: '#FBBF24', stroke: '#F59E0B' };  // yellow-400 / yellow-500
        }
        return { fill: '#FFFFFF', stroke: '#6B7280' };    // white / gray-300
    };

    const { fill, stroke } = getColors();

     return (
    <svg
      width="32"
      height="28"
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors duration-200"
    >
      {/* Seat back */}
      <rect x="6" y="2" width="20" height="10" rx="2" ry="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Seat base */}
      <rect x="4" y="8" width="24" height="16" rx="2" ry="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
      {/* Armrests */}
      <rect x="2" y="8" width="3" height="8" rx="1.5" ry="1.5" fill={fill} stroke={stroke} strokeWidth="1" />
      <rect x="27" y="8" width="3" height="8" rx="1.5" ry="1.5" fill={fill} stroke={stroke} strokeWidth="1" />
    </svg>
    );
}

export default SeatIcon;
// This component renders a seat icon with different colors based on availability and selection state.


