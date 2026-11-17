import { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Plane,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatPrice } from '../../utils/pricing';
import { saveBookedTicket } from '../../utils/storage';

export default function BookingModal({ isOpen, onClose, onBookingSuccess }) {
  const { passengers, seatLayout, meals, totals, dispatch, ACTIONS } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card'
  const [upiId, setUpiId] = useState('traveller@okaxis');
  const [upiApp, setUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'qr'
  const [cardData, setCardData] = useState({
    number: '4532 8921 4452 7890',
    name: 'AARAV SHARMA',
    expiry: '08/29',
    cvv: '345',
  });

  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handlePay = () => {
    setPaymentStatus('processing');
    setStatusMessage('Connecting to payment gateway...');

    setTimeout(() => {
      setStatusMessage('Authorizing transaction...');
    }, 800);

    setTimeout(() => {
      setStatusMessage('Generating Boarding Passes & E-Tickets...');
    }, 1600);

    setTimeout(() => {
      // Create comprehensive ticket object
      const pnr = 'SK' + Math.floor(100000 + Math.random() * 900000);
      const bookedTicket = {
        id: pnr,
        bookedAt: new Date().toISOString(),
        flightNumber: 'SK 204',
        from: 'DEL',
        fromCity: 'New Delhi',
        to: 'BOM',
        toCity: 'Mumbai',
        departureTime: '10:30 AM',
        arrivalTime: '12:45 PM',
        terminal: 'T3',
        gate: '14B',
        boardingTime: '09:45 AM',
        passengers: passengers.map((p) => {
          const seat = p.seatId
            ? seatLayout.seats.find((s) => s.id === p.seatId)
            : null;
          const meal = p.mealId
            ? meals.find((m) => m.id === p.mealId)
            : null;

          return {
            id: p.id,
            name: p.name,
            seatId: p.seatId || 'N/A',
            seatCategory: seat ? seat.category : 'Standard',
            seatPrice: seat ? seat.price : 0,
            mealName: meal ? meal.name : 'No meal',
            mealPrice: meal ? meal.price : 0,
            mealEmoji: meal ? meal.emoji : '🍽️',
          };
        }),
        totals: {
          seatTotal: totals.seatTotal,
          mealTotal: totals.mealTotal,
          grandTotal: totals.grandTotal,
        },
        paymentMethod: paymentMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` : 'Credit/Debit Card',
        status: 'Confirmed',
      };

      // Save to localStorage
      saveBookedTicket(bookedTicket);

      setPaymentStatus('success');
      setStatusMessage('Booking successfully confirmed!');

      setTimeout(() => {
        dispatch({ type: ACTIONS.RESET_BOOKING });
        onBookingSuccess(bookedTicket);
      }, 1200);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Checkout & Confirmation</h3>
              <p className="text-xs text-indigo-100">Flight SK 204 · New Delhi → Mumbai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={paymentStatus === 'processing'}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {paymentStatus === 'processing' ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">Processing Payment</h4>
                <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>
              </div>
              <p className="text-xs text-gray-400">Please do not refresh or close this window.</p>
            </div>
          ) : paymentStatus === 'success' ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">Payment Successful!</h4>
                <p className="text-sm text-emerald-600 font-medium mt-1">Generating your Boarding Passes...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Trip Summary Card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Flight</span>
                    <p className="text-sm font-bold text-slate-800">Air SkyBook · SK 204</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Date</span>
                    <p className="text-sm font-semibold text-slate-800">Today, 10:30 AM</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500 block">Passenger Assignments:</span>
                  {passengers.map((p) => {
                    const seat = p.seatId
                      ? seatLayout.seats.find((s) => s.id === p.seatId)
                      : null;
                    const meal = p.mealId
                      ? meals.find((m) => m.id === p.mealId)
                      : null;

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200/70"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                            {p.id}
                          </span>
                          <span className="font-semibold text-gray-800">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span className="font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                            {p.seatId ? `Seat ${p.seatId}` : 'No Seat'}
                          </span>
                          {meal && (
                            <span className="text-gray-500">
                              {meal.emoji} {meal.name}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods Section */}
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Select Payment Method
                </h4>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold text-xs transition ${
                      paymentMethod === 'upi'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-semibold text-xs transition ${
                      paymentMethod === 'card'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit / Debit Card</span>
                  </button>
                </div>

                {/* UPI Content */}
                {paymentMethod === 'upi' && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-4">
                    <div className="flex gap-2">
                      {[
                        { id: 'gpay', label: 'Google Pay' },
                        { id: 'phonepe', label: 'PhonePe' },
                        { id: 'paytm', label: 'Paytm' },
                        { id: 'qr', label: 'Scan QR' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setUpiApp(app.id)}
                          className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                            upiApp === app.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {app.label}
                        </button>
                      ))}
                    </div>

                    {upiApp === 'qr' ? (
                      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <QrCode className="w-20 h-20 text-gray-700" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 font-medium">Scan with any UPI app to pay</p>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Enter UPI ID / VPA
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full text-xs font-mono font-medium px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                          />
                          <button
                            type="button"
                            onClick={() => setUpiId('skybook.travel@okaxis')}
                            className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-2.5 rounded-xl whitespace-nowrap hover:bg-indigo-100 transition"
                          >
                            Sample ID
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Content */}
                {paymentMethod === 'card' && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        placeholder="4532 0000 0000 0000"
                        className="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                          placeholder="NAME ON CARD"
                          className="w-full text-xs px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Expiry
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="•••"
                            className="w-full text-xs font-mono px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown Footer */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-700 font-medium">Total Payable Amount</span>
                  <p className="text-xl font-extrabold text-indigo-900">
                    {totals.grandTotal === 0 ? 'Free (₹0)' : formatPrice(totals.grandTotal)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Encrypted Mock Checkout</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Actions */}
        {paymentStatus === 'idle' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePay}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <span>Confirm & Pay {totals.grandTotal === 0 ? '₹0' : formatPrice(totals.grandTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
