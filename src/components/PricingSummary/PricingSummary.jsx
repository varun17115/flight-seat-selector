import { ArrowRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';
import { formatPrice } from '../../utils/pricing';

export default function PricingSummary({ onOpenBooking }) {
  const { passengers, seatLayout, meals, totals } = useBooking();

  const hasAnySelection = passengers.some((p) => p.seatId || p.mealId);
  const unassignedSeatsCount = passengers.filter((p) => !p.seatId).length;
  const allSeatsAssigned = unassignedSeatsCount === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 overflow-hidden">
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🧾</span> Booking Summary
      </h2>

      {!hasAnySelection ? (
        <div className="text-sm text-gray-400 text-center py-6">
          <p className="text-2xl mb-2">🎯</p>
          <p className="text-xs">Select seats and meals to see price breakdown</p>
        </div>
      ) : (
        <>
          {/* Per-passenger breakdown */}
          <div className="space-y-2.5 mb-4 max-h-60 overflow-y-auto pr-1">
            {passengers.map((p) => {
              const seat = p.seatId
                ? seatLayout.seats.find((s) => s.id === p.seatId)
                : null;
              const meal = p.mealId
                ? meals.find((m) => m.id === p.mealId)
                : null;

              if (!seat && !meal) return null;

              return (
                <div
                  key={p.id}
                  className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/60"
                >
                  <div className="font-semibold text-xs text-gray-800 mb-1 flex items-center justify-between">
                    <span>{p.name}</span>
                    {seat && (
                      <span className="font-mono text-[11px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                        {seat.id}
                      </span>
                    )}
                  </div>

                  {seat && (
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="text-[11px]">
                        Seat ({seat.category})
                      </span>
                      <span className={seat.price === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                        {formatPrice(seat.price)}
                      </span>
                    </div>
                  )}

                  {meal && (
                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="text-[11px] flex items-center gap-1">
                        <span>{meal.emoji}</span> {meal.name}
                      </span>
                      <span className={meal.price === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                        {formatPrice(meal.price)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Subtotals */}
          <div className="border-t border-gray-200/80 pt-3 space-y-1.5">
            {totals.seatTotal > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Seat charges</span>
                <span className="font-semibold">{formatPrice(totals.seatTotal)}</span>
              </div>
            )}
            {totals.mealTotal > 0 && (
              <div className="flex justify-between text-xs text-gray-600">
                <span>Meal charges</span>
                <span className="font-semibold">{formatPrice(totals.mealTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-200/80">
              <span>Total Amount</span>
              <span className={totals.grandTotal === 0 ? 'text-emerald-600' : 'text-indigo-600'}>
                {totals.grandTotal === 0 ? 'Free' : formatPrice(totals.grandTotal)}
              </span>
            </div>
          </div>

          {/* Seat assignment status prompt */}
          {!allSeatsAssigned && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center gap-2 text-[11px] text-amber-800">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
              <span>
                {unassignedSeatsCount} {unassignedSeatsCount === 1 ? 'passenger needs' : 'passengers need'} seat assignment
              </span>
            </div>
          )}

          {/* Checkout Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={onOpenBooking}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                allSeatsAssigned
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-200 active:scale-[0.98]'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              }`}
            >
              <span>{allSeatsAssigned ? 'Proceed to Payment' : 'Review & Book Tickets'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant Confirmation & Boarding Pass</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
