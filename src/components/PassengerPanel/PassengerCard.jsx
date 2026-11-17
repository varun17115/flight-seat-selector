import { useState } from 'react';
import { User, X, Armchair, UtensilsCrossed, Pencil, Check } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatPrice } from '../../utils/pricing';

export default function PassengerCard({ passenger }) {
  const { activePassengerId, dispatch, ACTIONS, seatLayout, meals } = useBooking();
  const isActive = passenger.id === activePassengerId;

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(passenger.name);

  const seat = passenger.seatId
    ? seatLayout.seats.find((s) => s.id === passenger.seatId)
    : null;

  const meal = passenger.mealId
    ? meals.find((m) => m.id === passenger.mealId)
    : null;

  const handleSaveName = (e) => {
    e?.stopPropagation?.();
    setIsEditing(false);
    dispatch({
      type: ACTIONS.UPDATE_PASSENGER_NAME,
      payload: { passengerId: passenger.id, name: nameInput },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName(e);
    } else if (e.key === 'Escape') {
      setNameInput(passenger.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={() =>
        dispatch({ type: ACTIONS.SET_ACTIVE_PASSENGER, payload: passenger.id })
      }
      className={`group w-full text-left rounded-xl p-3.5 border-2 transition-all duration-300 animate-fade-in-up cursor-pointer
        ${
          isActive
            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50/90 to-purple-50/90 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-200/50'
            : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-gray-100/50'
        }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
              ${isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}
          >
            <User className="w-4 h-4" />
          </div>

          {/* Name Display or Editable Input */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleSaveName}
                  autoFocus
                  placeholder="Enter name"
                  className="w-full text-xs font-semibold px-2 py-1 bg-white border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  title="Save Name"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className={`font-semibold text-sm truncate leading-tight ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
                  {passenger.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNameInput(passenger.name);
                    setIsEditing(true);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-indigo-600 rounded"
                  title="Edit passenger name"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            )}

            {!seat && !meal && !isEditing && (
              <span className="text-[11px] text-gray-400 block truncate">Tap to pick seat</span>
            )}
          </div>
        </div>

        {isActive && (
          <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded-full shadow-sm flex-shrink-0">
            Active
          </span>
        )}
      </div>

      {/* Seat info */}
      <div className="flex items-center gap-2 text-xs mt-1">
        <Armchair className={`w-3.5 h-3.5 flex-shrink-0 ${seat ? 'text-indigo-500' : 'text-gray-300'}`} />
        {seat ? (
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <span className="font-mono font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md text-[11px]">
              {seat.id}
            </span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-500">{seat.category}</span>
            <span className="text-gray-400">·</span>
            <span className={`font-semibold ${seat.price === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
              {formatPrice(seat.price)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.REMOVE_SEAT, payload: passenger.id });
              }}
              className="ml-auto w-5 h-5 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
              title="Remove seat"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-gray-400 italic">No seat assigned</span>
        )}
      </div>

      {/* Meal info */}
      {meal && (
        <div className="flex items-center gap-2 text-xs mt-1.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <div className="flex items-center gap-1.5 flex-wrap flex-1">
            <span>{meal.emoji}</span>
            <span className="text-gray-600">{meal.name}</span>
            <span className="text-gray-400">·</span>
            <span className={`font-semibold ${meal.price === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
              {formatPrice(meal.price)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: ACTIONS.REMOVE_MEAL, payload: passenger.id });
              }}
              className="ml-auto w-5 h-5 rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors"
              title="Remove meal"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
