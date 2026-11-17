import { useState, useEffect } from 'react';
import { Plane, ArrowRight, LayoutGrid, Ticket } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { getBookedTickets } from '../../utils/storage';

export default function Header({ onOpenMyBookings }) {
  const { activeLayout, passengers } = useBooking();
  const assignedCount = passengers.filter((p) => p.seatId).length;

  const [ticketCount, setTicketCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      setTicketCount(getBookedTickets().length);
    };
    updateCount();
    window.addEventListener('skybook_tickets_updated', updateCount);
    return () => window.removeEventListener('skybook_tickets_updated', updateCount);
  }, []);

  return (
    <header className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <Plane className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                SkyBook
              </h1>
              <p className="text-indigo-200 text-xs font-medium tracking-wide">
                Flight Seat Selection & Passenger Management
              </p>
            </div>
          </div>

          {/* Flight info pills & Bookings trigger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <div className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-sm text-white/90 shadow-sm">
              <Plane className="w-3.5 h-3.5 text-indigo-200" />
              <span className="font-bold">SK 204</span>
            </div>

            <div className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-sm text-white/90 shadow-sm">
              <span className="font-bold">DEL</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
              <span className="font-bold">BOM</span>
            </div>

            <div className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-sm text-white/90 shadow-sm">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-200" />
              <span className="font-semibold">{activeLayout}</span>
            </div>

            <div className="glass rounded-xl px-3.5 py-2 flex items-center gap-2 text-sm shadow-sm">
              <span className="text-indigo-200 text-xs">Seats</span>
              <span className="font-bold text-emerald-300">
                {assignedCount}/{passengers.length}
              </span>
            </div>

            {/* My Bookings Button */}
            <button
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-md shadow-indigo-900/10 transition active:scale-95 cursor-pointer ml-1"
            >
              <Ticket className="w-3.5 h-3.5 text-indigo-600" />
              <span>My Tickets</span>
              {ticketCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {ticketCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
