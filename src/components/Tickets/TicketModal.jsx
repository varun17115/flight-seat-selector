import { useState } from 'react';
import { X, Plane, ArrowRight, Printer, CheckCircle2, QrCode, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { formatPrice } from '../../utils/pricing';

export default function TicketModal({ ticket, isOpen, onClose }) {
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);

  if (!isOpen || !ticket) return null;

  const currentPassenger = ticket.passengers[activePassengerIndex] || ticket.passengers[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">E-Ticket & Boarding Pass</h3>
              <p className="text-[11px] text-slate-400">PNR Reference: <span className="font-mono text-emerald-400 font-bold">{ticket.id}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition"
              title="Print ticket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Passenger selector tabs if multiple travelers */}
        {ticket.passengers.length > 1 && (
          <div className="bg-slate-100 px-6 py-2.5 flex items-center gap-2 overflow-x-auto border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 mr-2 flex-shrink-0">Pass for:</span>
            {ticket.passengers.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setActivePassengerIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activePassengerIndex === idx
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.name} ({p.seatId})
              </button>
            ))}
          </div>
        )}

        {/* Ticket Container */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
          {/* Authentic Boarding Pass Card */}
          <div className="relative bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Top Flight Banner */}
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 text-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-indigo-200">SkyBook Airways</span>
                    <h4 className="font-extrabold text-lg leading-tight">Boarding Pass</h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">Flight</span>
                  <span className="font-mono text-base font-extrabold">{ticket.flightNumber}</span>
                </div>
              </div>

              {/* Route */}
              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <div>
                  <span className="text-3xl font-black tracking-tight">{ticket.from}</span>
                  <p className="text-xs text-indigo-200">{ticket.fromCity}</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-indigo-200 uppercase font-semibold">2h 15m</span>
                  <div className="w-24 sm:w-32 flex items-center my-1">
                    <div className="w-2 h-2 rounded-full bg-white" />
                    <div className="flex-1 border-t-2 border-dashed border-white/50" />
                    <Plane className="w-4 h-4 text-white transform rotate-90 mx-1" />
                    <div className="flex-1 border-t-2 border-dashed border-white/50" />
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-[10px] text-emerald-300 font-bold">Non-Stop</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black tracking-tight">{ticket.to}</span>
                  <p className="text-xs text-indigo-200">{ticket.toCity}</p>
                </div>
              </div>
            </div>

            {/* Perforated divider visual effect */}
            <div className="relative flex items-center justify-between px-3 py-1 bg-white">
              <div className="w-5 h-5 -ml-5 rounded-full bg-slate-50 border-r border-slate-200" />
              <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-2" />
              <div className="w-5 h-5 -mr-5 rounded-full bg-slate-50 border-l border-slate-200" />
            </div>

            {/* Passenger & Flight Details */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passenger Name</span>
                <p className="font-bold text-sm text-slate-800 truncate">{currentPassenger.name}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seat Number</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-base font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {currentPassenger.seatId}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">({currentPassenger.seatCategory})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gate / Terminal</span>
                <p className="font-bold text-sm text-slate-800">{ticket.gate} / {ticket.terminal}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Boarding Time</span>
                <p className="font-bold text-sm text-emerald-600">{ticket.boardingTime}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meal Selection</span>
                <p className="font-medium text-xs text-slate-700 mt-0.5 flex items-center gap-1">
                  <span>{currentPassenger.mealEmoji}</span>
                  <span className="truncate">{currentPassenger.mealName}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PNR / Booking ID</span>
                <p className="font-mono font-bold text-xs text-slate-800 mt-0.5">{ticket.id}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment</span>
                <p className="font-semibold text-xs text-slate-700 mt-0.5">{ticket.paymentMethod}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="inline-block mt-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Bottom Barcode simulation */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-10 h-10 text-slate-800" />
                <div className="text-[10px] text-slate-500 font-mono">
                  <div>ELECTRONIC BOARDING PASS</div>
                  <div>SECURE DIGITAL VERIFICATION</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {/* Barcode representation */}
                <div className="flex items-center gap-0.5 h-7">
                  {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3, 1, 2].map((w, idx) => (
                    <div key={idx} className="bg-slate-800 h-full rounded-xs" style={{ width: `${w * 2}px` }} />
                  ))}
                </div>
                <span className="font-mono text-[9px] text-slate-400 mt-1 tracking-widest">{ticket.id}-E09-8472</span>
              </div>
            </div>
          </div>

          {/* Passenger Overview if multiple passengers booked together */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">All Travelers in this Booking</h5>
            <div className="space-y-2">
              {ticket.passengers.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setActivePassengerIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    activePassengerIndex === idx
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Seat {p.seatId}
                    </span>
                    <span className="text-slate-500">{p.mealEmoji} {p.mealName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Saved securely in your browser's <span className="font-semibold text-slate-700">localStorage</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
