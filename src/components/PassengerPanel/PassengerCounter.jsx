import { Minus, Plus, Users } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function PassengerCounter() {
  const { passengerCount, dispatch, ACTIONS } = useBooking();

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200/80">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Users className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-700">Passengers</span>
          <p className="text-[11px] text-gray-400">Max 9 travelers</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.SET_PASSENGER_COUNT, payload: passengerCount - 1 })
          }
          disabled={passengerCount <= 1}
          className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center
                     hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          aria-label="Decrease passengers"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-lg font-bold text-gray-800 w-7 text-center tabular-nums">
          {passengerCount}
        </span>
        <button
          onClick={() =>
            dispatch({ type: ACTIONS.SET_PASSENGER_COUNT, payload: passengerCount + 1 })
          }
          disabled={passengerCount >= 9}
          className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center
                     hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-200"
          aria-label="Increase passengers"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
