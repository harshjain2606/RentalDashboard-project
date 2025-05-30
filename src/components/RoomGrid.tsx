import React from 'react';
import PropTypes from 'prop-types';

export const RoomGrid = ({ floorDetails, selectedRoom, onReserve }) => {
  const reversedFloors = [...(floorDetails || [])].reverse();
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-2">
        <tbody>
          {reversedFloors.map((floor, floorIdx) => (
            <tr key={floor.id}>
              <td className="pr-2 font-bold">
                {String.fromCharCode(65 + (reversedFloors.length - 1 - floorIdx))}
              </td>
              {floor.rooms.map((room, colIdx) => {
                const availability = room?.capacity - room?.occupied;
                const occupiedWidth = (room.occupied / room.capacity) * 100;
                
                return (
                  <td key={colIdx}>
                    <div
                      className="relative w-20 h-8 border-2 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer"
                      onClick={
                        availability > 0 && onReserve
                          ? () => onReserve(room.id)
                          : undefined
                      }
                      style={{
                        pointerEvents: !availability ? "none" : "auto",
                        borderColor: selectedRoom === room.id ? '#22c55e' : '#e5e7eb'
                      }}
                      title={`Room ${room.roomNumber} (Capacity: ${room.capacity}, Occupied: ${room.occupied})`}
                    >
                      {/* Red section (occupied) */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-red-500"
                        style={{ width: `${occupiedWidth}%` }}
                      />
                      
                      {/* Green section (available) */}
                      <div 
                        className="absolute top-0 bottom-0 bg-green-500"
                        style={{ 
                          left: `${occupiedWidth}%`,
                          width: `${100 - occupiedWidth}%`
                        }}
                      />
                      
                      {/* Room number overlay */}
                      <span className="relative z-10 font-medium text-gray-900 bg-white bg-opacity-75 px-2 rounded">
                        {room.roomNumber}
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RoomGrid.propTypes = {
  floorDetails: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      floorNumber: PropTypes.number.isRequired,
      rooms: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          roomNumber: PropTypes.number.isRequired,
          capacity: PropTypes.number.isRequired,
          occupied: PropTypes.number,
          isAvailable: PropTypes.bool.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  selectedRoom: PropTypes.number,
  onReserve: PropTypes.func.isRequired
};

export default RoomGrid;