import { useState, useEffect } from 'react';
import { X, Plane, Ticket, Trash2, ArrowRight, Eye, Calendar, UserCheck, AlertCircle } from 'lucide-react';
import { getBookedTickets, deleteBookedTicket, clearAllTickets } from '../../utils/storage';
import { formatPrice } from '../../utils/pricing';

export default function MyBookingsModal({ isOpen, onClose, onViewTicket }) {
  const [tickets, setTickets] = useState([]);

  const loadTickets = () => {
    setTickets(getBookedTickets());
  };

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => loadTickets();
    window.addEventListener('skybook_tickets_updated', handleUpdate);
    return () => window.removeEventListener('skybook_tickets_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const updated = deleteBookedTicket(id);
      setTickets(updated);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all booked tickets from local storage?')) {
      clearAllTickets();
      setTickets([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">My Booked Flights</h3>
              <p className="text-xs text-slate-400">Stored in browser LocalStorage ({tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tickets.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50 flex-1">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Ticket className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-700">No Bookings Yet</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                Select your seats and complete the checkout to generate and store your flight boarding passes.
              </p>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => onViewTicket(t)}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      PNR: {t.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(t.bookedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(t.id, e)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded transition"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 transition">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800">
                        <span>{t.from}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{t.to}</span>
                        <span className="text-xs font-semibold text-slate-400">({t.flightNumber})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {t.passengers.length} {t.passengers.length === 1 ? 'Passenger' : 'Passengers'}:{' '}
                        {t.passengers.map((p) => p.name).join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800 block">
                      {t.totals.grandTotal === 0 ? 'Free' : formatPrice(t.totals.grandTotal)}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-medium group-hover:underline flex items-center gap-1 justify-end mt-0.5">
                      <Eye className="w-3 h-3" />
                      View Pass
                    </span>
                  </div>
                </div>

                {/* Seat tags */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">Assigned Seats:</span>
                  {t.passengers.map((p, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
                    >
                      {p.name}: <span className="text-indigo-600 font-bold">{p.seatId}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
