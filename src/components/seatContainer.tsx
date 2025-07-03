import SeatIcon from "./ui/seat";


interface SeatContainerProps {
    id: number;
    isAvailable: boolean;
    isSelected: boolean;
    seatNo: string;
    onClick: (SeatNo: string, id: number) => void;
}

const SeatContainerProps = ({
    id,
    isAvailable,
    isSelected,
    seatNo,
    onClick
}: SeatContainerProps) => {
    const baseStyle = "p-2 transition-all duration-200 flex items-center justify-center relative group";
    const cls = !isAvailable ? `${baseStyle} cursor-not-allowed opacity-50` : `${baseStyle} hover:scale-105 cursor-pointer`;

    return (
        <div
            className={cls}
            onClick={() => isAvailable && onClick(seatNo, id)}
        >
            <SeatIcon isAvailable={isAvailable} isSelected={isSelected} />
            { (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2
                      bg-black text-white text-xs px-1 rounded
                      opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-semibold text-white">{seatNo}</span>
                </div>
            )}
        </div>
    );
}

export default SeatContainerProps;
// This component renders a seat container with an icon and a tooltip showing the seat number when selected.