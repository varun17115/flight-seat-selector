import { useState, useEffect } from 'react';
import { Plane, ArrowRight, LayoutGrid, Ticket, CheckCircle2 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { getBookedTickets } from '../../utils/storage';

export default function Header({ onOpenMyBookings }) {
  const { activeLayout, passengers } = useBooking();
  const assignedCount = passengers.filter((p) => p.seatId).length;
  const isAllAssigned = assignedCount === passengers.length && passengers.length > 0;

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
    <header className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/40 text-white shadow-xl">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Brand & Flight Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Plane className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">SkyBook</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  Boeing 737
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Flight Seat Selection & Passenger Management</p>
            </div>
          </div>

          {/* Flight Info & Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
            
            {/* Flight Code */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
              <span className="text-[11px] font-medium text-slate-400">Flight</span>
              <span className="font-mono font-bold text-xs text-indigo-300">SK 204</span>
            </div>

            {/* Route */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
              <span className="font-extrabold text-xs text-white tracking-wide">DEL</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-extrabold text-xs text-white tracking-wide">BOM</span>
            </div>

            {/* Layout Type */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">
                {activeLayout} <span className="text-slate-400 font-normal text-[11px]">Layout</span>
              </span>
            </div>

            {/* Seats Assigned Counter */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner transition-colors ${
              isAllAssigned
                ? 'bg-emerald-950/50 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300'
            }`}>
              <span className="text-[11px] text-slate-400 font-medium">Seats</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-mono text-xs font-bold ${isAllAssigned ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {assignedCount}/{passengers.length}
                </span>
                {isAllAssigned && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
            </div>

            {/* My Tickets Button */}
            <button
              onClick={onOpenMyBookings}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 border border-indigo-400/30 transition-all active:scale-95 cursor-pointer ml-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Tickets</span>
              {ticketCount > 0 && (
                <span className="px-1.5 py-0.2 bg-white text-indigo-900 text-[10px] font-extrabold rounded-full">
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
