import { useBooking } from '../../context/BookingContext';
import { formatPrice } from '../../utils/pricing';
import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function Seat({ seat }) {
  const { activePassengerId, assignedSeats, dispatch, ACTIONS } = useBooking();
  const [showTooltip, setShowTooltip] = useState(false);

  const assignedTo = assignedSeats[seat.id];
  const isAssignedToActive = assignedTo === activePassengerId;
  const isAssignedToOther = assignedTo && assignedTo !== activePassengerId;
  const isOccupied = seat.isOccupied;
  const isSelectable = !isOccupied && !isAssignedToOther;

  // Build class string based on seat state
  let seatClasses =
    'relative w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-lg text-[11px] font-bold border-2 transition-all duration-200 flex items-center justify-center select-none ';

  if (isOccupied) {
    seatClasses +=
      'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed';
  } else if (isAssignedToActive) {
    seatClasses +=
      'bg-indigo-600 border-indigo-500 text-white cursor-pointer shadow-lg shadow-indigo-300/50 scale-110 seat-active-pulse';
  } else if (isAssignedToOther) {
    seatClasses +=
      'bg-gradient-to-br from-orange-400 to-amber-400 border-orange-300 text-white cursor-not-allowed shadow-md';
  } else {
    // Available — color by category
    const catColors = {
      Standard:
        'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-100/50',
      'Extra Legroom':
        'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400 hover:shadow-md hover:shadow-amber-100/50',
      Premium:
        'bg-violet-50 border-violet-300 text-violet-700 hover:bg-violet-100 hover:border-violet-400 hover:shadow-md hover:shadow-violet-100/50',
    };
    seatClasses += `${catColors[seat.category] || catColors.Standard} cursor-pointer hover:scale-105`;
  }

  const handleClick = () => {
    if (!isSelectable) return;
    if (!activePassengerId) return;
    dispatch({ type: ACTIONS.ASSIGN_SEAT, payload: seat.id });
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={isOccupied}
        className={seatClasses}
        aria-label={`Seat ${seat.id}, ${seat.category}, ${formatPrice(seat.price)}${
          isOccupied ? ', occupied' : ''
        }`}
      >
        {isOccupied ? (
          <Lock className="w-3.5 h-3.5 text-gray-300" />
        ) : (
          seat.column
        )}

        {/* Green dot for active selection */}
        {isAssignedToActive && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
        )}

        {/* Passenger number badge for other passengers */}
        {isAssignedToOther && (
          <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-orange-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
            {assignedTo}
          </span>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && !isOccupied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 pointer-events-none animate-fade-in-up">
          <div className="bg-gray-900/95 backdrop-blur-sm text-white text-[11px] rounded-xl px-3.5 py-2.5 whitespace-nowrap shadow-xl">
            <div className="font-bold text-sm">{seat.id}</div>
            <div className="text-gray-400 mt-0.5">{seat.category}</div>
            <div
              className={`mt-0.5 font-bold ${
                seat.price === 0 ? 'text-emerald-400' : 'text-amber-300'
              }`}
            >
              {formatPrice(seat.price)}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-gray-900/95" />
          </div>
        </div>
      )}
    </div>
  );
}
