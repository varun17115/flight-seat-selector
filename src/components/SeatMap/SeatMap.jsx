import { useBooking } from '../../context/BookingContext';
import LayoutToggle from './LayoutToggle';
import SeatRow from './SeatRow';
import SeatLegend from './SeatLegend';

export default function SeatMap() {
  const { seatLayout, activePassenger } = useBooking();
  const { seats, columns, aisleAfter, totalRows } = seatLayout;

  // Group seats by row
  const rows = [];
  for (let r = 1; r <= totalRows; r++) {
    rows.push({
      rowNumber: r,
      seats: seats.filter((s) => s.row === r),
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>💺</span> Seat Map
        </h2>
        <LayoutToggle />
      </div>

      {/* Active passenger indicator */}
      {activePassenger && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-4 text-sm text-indigo-700">
          Selecting seat for{' '}
          <span className="font-bold">{activePassenger.name}</span>
          {activePassenger.seatId && (
            <span>
              {' '}— currently assigned to{' '}
              <span className="font-mono font-bold">{activePassenger.seatId}</span>
            </span>
          )}
        </div>
      )}

      {/* Aircraft fuselage wrapper */}
      <div className="relative bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 p-4 sm:p-6 overflow-x-auto">
        {/* Cockpit indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-200 text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            ✈ Front
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-0.5 sm:gap-1 mb-2 justify-center">
          <span className="w-6 mr-1 flex-shrink-0"></span>
          {columns.map((col) => {
            const hasAisle = aisleAfter.includes(col);
            return (
              <div key={col} className="flex items-center">
                <span className="w-9 sm:w-10 text-center text-xs font-bold text-gray-500">
                  {col}
                </span>
                {hasAisle && <div className="w-4 sm:w-6 flex-shrink-0" />}
              </div>
            );
          })}
          <span className="w-6 ml-1 flex-shrink-0"></span>
        </div>

        {/* Seat rows */}
        <div className="flex flex-col gap-1 items-center">
          {rows.map((row) => (
            <SeatRow
              key={row.rowNumber}
              rowNumber={row.rowNumber}
              seats={row.seats}
              columns={columns}
              aisleAfter={aisleAfter}
            />
          ))}
        </div>

        {/* Rear indicator */}
        <div className="flex justify-center mt-4">
          <div className="bg-gray-200 text-gray-500 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
            Rear ✈
          </div>
        </div>
      </div>

      <SeatLegend />
    </div>
  );
}

