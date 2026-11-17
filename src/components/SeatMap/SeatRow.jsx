import Seat from './Seat';

export default function SeatRow({ rowNumber, seats, columns, aisleAfter }) {
  return (
    <div className="flex items-center gap-[3px] sm:gap-1">
      {/* Row number left */}
      <span className="w-7 text-right text-[11px] font-mono font-semibold text-gray-400 mr-1 flex-shrink-0 tabular-nums">
        {rowNumber}
      </span>

      {columns.map((col) => {
        const seat = seats.find((s) => s.column === col);
        const hasAisle = aisleAfter.includes(col);

        return (
          <div key={col} className="flex items-center">
            {seat ? (
              <Seat seat={seat} />
            ) : (
              <div className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px]" />
            )}
            {/* Aisle gap with subtle line */}
            {hasAisle && (
              <div className="w-5 sm:w-7 flex-shrink-0 flex items-center justify-center">
                <div className="w-px h-6 bg-gray-200 rounded-full" />
              </div>
            )}
          </div>
        );
      })}

      {/* Row number right */}
      <span className="w-7 text-left text-[11px] font-mono font-semibold text-gray-400 ml-1 flex-shrink-0 tabular-nums">
        {rowNumber}
      </span>
    </div>
  );
}
