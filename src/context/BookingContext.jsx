import { createContext, useContext, useReducer, useMemo } from 'react';
import { generateSeatData } from '../data/seatLayouts';
import MEALS from '../data/meals';
import { calculateTotal } from '../utils/pricing';

// --- Initial State ---
const createInitialState = () => ({
  passengerCount: 1,
  passengers: [{ id: 1, name: 'Passenger 1', seatId: null, mealId: null }],
  activePassengerId: 1,
  activeLayout: '3-2',
});

// --- Action Types ---
const ACTIONS = {
  SET_PASSENGER_COUNT: 'SET_PASSENGER_COUNT',
  SET_ACTIVE_PASSENGER: 'SET_ACTIVE_PASSENGER',
  UPDATE_PASSENGER_NAME: 'UPDATE_PASSENGER_NAME',
  ASSIGN_SEAT: 'ASSIGN_SEAT',
  REMOVE_SEAT: 'REMOVE_SEAT',
  SET_LAYOUT: 'SET_LAYOUT',
  ASSIGN_MEAL: 'ASSIGN_MEAL',
  REMOVE_MEAL: 'REMOVE_MEAL',
  RESET_BOOKING: 'RESET_BOOKING',
};

// --- Reducer ---
function bookingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PASSENGER_COUNT: {
      const count = Math.max(1, Math.min(9, action.payload));
      const passengers = [];
      for (let i = 1; i <= count; i++) {
        // Preserve existing passenger data if available
        const existing = state.passengers.find((p) => p.id === i);
        passengers.push(
          existing || { id: i, name: `Passenger ${i}`, seatId: null, mealId: null }
        );
      }
      // If active passenger was removed, select the first one
      const activePassengerId =
        count >= state.activePassengerId ? state.activePassengerId : 1;
      return { ...state, passengerCount: count, passengers, activePassengerId };
    }

    case ACTIONS.SET_ACTIVE_PASSENGER: {
      return { ...state, activePassengerId: action.payload };
    }

    case ACTIONS.UPDATE_PASSENGER_NAME: {
      const { passengerId, name } = action.payload;
      const passengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, name: name.trim() || `Passenger ${passengerId}` } : p
      );
      return { ...state, passengers };
    }

    case ACTIONS.ASSIGN_SEAT: {
      const seatId = action.payload;
      // Check if seat is already assigned to another passenger
      const alreadyAssigned = state.passengers.find(
        (p) => p.seatId === seatId && p.id !== state.activePassengerId
      );
      if (alreadyAssigned) return state; // Block assignment

      const passengers = state.passengers.map((p) => {
        if (p.id === state.activePassengerId) {
          // If clicking the same seat, toggle it off
          return { ...p, seatId: p.seatId === seatId ? null : seatId };
        }
        return p;
      });
      return { ...state, passengers };
    }

    case ACTIONS.REMOVE_SEAT: {
      const passengerId = action.payload;
      const passengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, seatId: null } : p
      );
      return { ...state, passengers };
    }

    case ACTIONS.SET_LAYOUT: {
      // When switching layouts, clear all seat assignments since seats differ
      const passengers = state.passengers.map((p) => ({ ...p, seatId: null }));
      return { ...state, activeLayout: action.payload, passengers };
    }

    case ACTIONS.ASSIGN_MEAL: {
      const { passengerId, mealId } = action.payload;
      const passengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, mealId } : p
      );
      return { ...state, passengers };
    }

    case ACTIONS.REMOVE_MEAL: {
      const pid = action.payload;
      const passengers = state.passengers.map((p) =>
        p.id === pid ? { ...p, mealId: null } : p
      );
      return { ...state, passengers };
    }

    case ACTIONS.RESET_BOOKING: {
      return createInitialState();
    }

    default:
      return state;
  }
}

// --- Context ---
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, null, createInitialState);

  // Derive seat layout data from active layout
  const seatLayout = useMemo(
    () => generateSeatData(state.activeLayout),
    [state.activeLayout]
  );

  // Derive pricing totals
  const totals = useMemo(
    () => calculateTotal(state.passengers, seatLayout.seats, MEALS),
    [state.passengers, seatLayout.seats]
  );

  // Find active passenger object
  const activePassenger = state.passengers.find(
    (p) => p.id === state.activePassengerId
  );

  // Build set of seats assigned to any passenger (for quick lookup)
  const assignedSeats = useMemo(() => {
    const map = {};
    state.passengers.forEach((p) => {
      if (p.seatId) map[p.seatId] = p.id;
    });
    return map;
  }, [state.passengers]);

  const value = {
    ...state,
    seatLayout,
    totals,
    activePassenger,
    assignedSeats,
    meals: MEALS,
    dispatch,
    ACTIONS,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

export { ACTIONS };
