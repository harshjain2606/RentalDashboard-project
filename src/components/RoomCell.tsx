import React from 'react';

interface RoomCellProps {
  roomNumber: number;
  capacity: number;
  occupied: number;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

const RoomCell: React.FC<RoomCellProps> = ({
  roomNumber,
  capacity,
  occupied,
  isSelected,
  isAvailable,
  onClick,
}) => {
  const getBaseStyle = () => {
    if (!isAvailable) {
      return "border-red-500 cursor-not-allowed";
    }
    if (isSelected) {
      return "border-blue-500 cursor-pointer";
    }
    return "border-gray-300 cursor-pointer";
  };

  // Calculate the height of the red (occupied) section
  const occupiedHeight = (occupied / capacity) * 100;

  return (
    <div
      className={`relative w-24 h-24 border-2 rounded-lg overflow-hidden transition-colors duration-200 ${getBaseStyle()}`}
      onClick={isAvailable ? onClick : undefined}
      style={{ pointerEvents: !isAvailable ? "none" : "auto" }}
      title={`Room ${roomNumber} (Capacity: ${capacity}, Occupied: ${occupied})`}
    >
      {/* Red section (occupied) */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-red-500"
        style={{ height: `${occupiedHeight}%` }}
      />
      
      {/* Green section (available) */}
      <div 
        className="absolute top-0 left-0 right-0 bg-green-500"
        style={{ height: `${100 - occupiedHeight}%` }}
      />
      
      {/* Room number and capacity overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80">
        <span className="font-bold text-xl text-gray-900">
          {roomNumber}
        </span>
        <span className="text-sm text-gray-700">
          {occupied}/{capacity}
        </span>
      </div>
    </div>
  );
};

export default RoomCell;