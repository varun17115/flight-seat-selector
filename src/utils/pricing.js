/**
 * Format a price in INR
 */
export function formatPrice(price) {
  if (price === 0) return 'Free';
  return `₹${price.toLocaleString('en-IN')}`;
}

/**
 * Calculate total cost from passengers array
 */
export function calculateTotal(passengers, seatData, meals) {
  let seatTotal = 0;
  let mealTotal = 0;

  passengers.forEach((p) => {
    if (p.seatId) {
      const seat = seatData.find((s) => s.id === p.seatId);
      if (seat) seatTotal += seat.price;
    }
    if (p.mealId) {
      const meal = meals.find((m) => m.id === p.mealId);
      if (meal) mealTotal += meal.price;
    }
  });

  return { seatTotal, mealTotal, grandTotal: seatTotal + mealTotal };
}

