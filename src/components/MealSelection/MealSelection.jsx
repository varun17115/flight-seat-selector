import { useBooking } from '../../context/BookingContext';
import MealOption from './MealOption';

export default function MealSelection() {
  const { passengers, activePassengerId, meals, dispatch, ACTIONS } = useBooking();

  const activePassenger = passengers.find((p) => p.id === activePassengerId);

  const handleSelectMeal = (mealId) => {
    // Toggle — if already selected, remove it
    const newMealId = activePassenger.mealId === mealId ? null : mealId;
    if (newMealId) {
      dispatch({
        type: ACTIONS.ASSIGN_MEAL,
        payload: { passengerId: activePassengerId, mealId: newMealId },
      });
    } else {
      dispatch({ type: ACTIONS.REMOVE_MEAL, payload: activePassengerId });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
        <span>🍽️</span> Meal Selection
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-1">
          Bonus
        </span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Choose a meal for{' '}
        <span className="font-semibold text-gray-700">
          {activePassenger?.name || 'selected passenger'}
        </span>
      </p>

      <div className="flex flex-col gap-2">
        {meals.map((meal) => (
          <MealOption
            key={meal.id}
            meal={meal}
            isSelected={activePassenger?.mealId === meal.id}
            onSelect={handleSelectMeal}
          />
        ))}
      </div>
    </div>
  );
}

