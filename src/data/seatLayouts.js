// Seat layout configurations
// Layout 1: 3-2 (A B C | aisle | D E)
// Layout 2: 2-3-2 (A B | aisle | C D E | aisle | F G)

const SEAT_CATEGORIES = {
  STANDARD: { label: 'Standard', color: 'bg-emerald-100 border-emerald-400 hover:bg-emerald-200', price: 0 },
  EXTRA_LEGROOM: { label: 'Extra Legroom', color: 'bg-amber-100 border-amber-400 hover:bg-amber-200', price: 350 },
  PREMIUM: { label: 'Premium', color: 'bg-violet-100 border-violet-400 hover:bg-violet-200', price: 250 },
};

function generateSeatData(layoutType) {
  const totalRows = 15;
  const seats = [];

  const columns = layoutType === '3-2'
    ? ['A', 'B', 'C', 'D', 'E']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Define aisle positions for rendering
  const aisleAfter = layoutType === '3-2'
    ? ['C']          // aisle after column C
    : ['B', 'E'];    // aisles after B and E

  // Pre-occupied seats (simulating already booked seats)
  const occupiedSeats = new Set([
    '1A', '1C', '2D', '3B', '3E', '4A', '5C', '5D',
    '6B', '7A', '7E', '8C', '9D', '10A', '10B',
    '11E', '12C', '13A', '14D', '15B',
    // Extra for 2-3-2 layout
    '1F', '2G', '3C', '4E', '5F', '6G', '7D',
    '8F', '9G', '10E', '11C', '12F', '13G', '14C', '15F',
  ]);

  for (let row = 1; row <= totalRows; row++) {
    for (const col of columns) {
      const seatId = `${row}${col}`;

      // Determine category based on row and column
      let category;
      if (row <= 2) {
        // First 2 rows are premium
        category = SEAT_CATEGORIES.PREMIUM;
      } else if (row <= 4) {
        // Rows 3-4 are extra legroom
        category = SEAT_CATEGORIES.EXTRA_LEGROOM;
      } else if (col === 'A' || col === columns[columns.length - 1]) {
        // Window seats in economy have a small premium (extra legroom)
        category = row % 3 === 0 ? SEAT_CATEGORIES.EXTRA_LEGROOM : SEAT_CATEGORIES.STANDARD;
      } else {
        category = SEAT_CATEGORIES.STANDARD;
      }

      seats.push({
        id: seatId,
        row,
        column: col,
        category: category.label,
        price: category.price,
        colorClass: category.color,
        isOccupied: occupiedSeats.has(seatId),
      });
    }
  }

  return { seats, columns, aisleAfter, totalRows };
}

export { SEAT_CATEGORIES, generateSeatData };

