import { Users } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import PassengerCounter from './PassengerCounter';
import PassengerCard from './PassengerCard';

export default function PassengerPanel() {
  const { passengers } = useBooking();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
      {/* Section header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Passengers</h2>
            <p className="text-xs text-gray-400">Select a passenger, then pick a seat</p>
          </div>
        </div>
        <PassengerCounter />
      </div>

      {/* Passenger list */}
      <div className="px-5 pb-5 mt-1">
        <div className="flex flex-col gap-2.5">
          {passengers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Add passengers to begin</p>
            </div>
          ) : (
            passengers.map((p) => <PassengerCard key={p.id} passenger={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
