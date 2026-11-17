# ✈️ SkyBook — Flight Seat Selection & Passenger Management

A modern, responsive React.js application for flight seat selection, customized passenger management, in-flight meal ordering, seamless payment checkout (UPI / Card), and electronic boarding pass generation stored in browser `localStorage`.

Built for the **EPaisa Frontend Developer Assessment**.

---

## 🚀 Getting Started

```bash
# Navigate to the project directory
cd flight-seat-selector

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

The application will run at `http://localhost:5173/`.

---

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | Core UI library & reactive components |
| **Vite** | Blazing-fast build tool and HMR |
| **Tailwind CSS 4** | Modern utility-first styling with custom theme & animations |
| **Lucide React** | Sleek iconography |
| **Context + useReducer** | Predictable local state management |
| **Browser LocalStorage** | Persistent ticket & boarding pass storage |

---

## 🌟 Key Features

### 1. Passenger Management & Editable Names
- Support for **1 to 9 passengers** with dynamic counter controls.
- **Customizable Passenger Names**: Click on the pencil icon or name to edit inline; changes persist across seat assignments and boarding passes.
- Instant switching between passengers with active status indicator.
- Single-seat per passenger constraint and conflict protection.

### 2. Interactive Aircraft Seat Layout
- Dual aircraft configurations:
  - **3–2 Layout** (Narrow Body — Aisle after seat C)
  - **2–3–2 Layout** (Wide Body — Aisles after seats B & E)
- Real-time layout switching with state safety (resets unmapped assignments cleanly).
- Category color coding:
  - **Standard**: ₹0 (Free)
  - **Extra Legroom**: ₹350
  - **Premium**: ₹250
  - **Occupied / Locked**: Grayed out with lock icon (non-selectable)
  - **Active Selection**: Glowing ring + pulse animation
  - **Other Passenger**: Warm amber badge showing the passenger's number
- Interactive hover tooltips showing seat ID, category, and price.

### 3. Bonus: In-Flight Meal Selection
- 6 curated meal options (Vegetarian Pasta, Chicken Wrap, Club Sandwich, Asian Noodle Bowl, Fresh Fruit Platter, Premium Steak).
- Supports free (₹0) and paid options.
- Per-passenger meal assignment with immediate reflection in the summary.

### 4. Booking & Mock Payment Module (UPI / Card)
- **Review & Checkout**: Validates seat assignments and displays an itemized receipt.
- **UPI Methods**:
  - Quick apps (Google Pay, PhonePe, Paytm)
  - Virtual Payment Address (VPA / UPI ID)
  - Interactive QR Code scan simulator
- **Credit / Debit Card**:
  - Formatted Card Number, Cardholder Name, Expiry MM/YY, CVV
- Realistic payment processing simulation with gateway handshake animation and confirmation feedback.

### 5. LocalStorage Ticket & Boarding Pass System
- Completed bookings are automatically saved to `localStorage` under `skybook_tickets`.
- **Authentic Airline Boarding Pass**:
  - PNR booking reference
  - Flight SK 204 (DEL → BOM) route graphic
  - Prominent seat number, gate (14B), terminal (T3), boarding time
  - Digital barcode / QR code simulation
  - Integrated browser print support (`window.print()`)
- **"My Tickets" History Drawer**:
  - Accessible anytime from the top navigation bar with a live ticket count badge
  - Review past bookings, re-open boarding passes, or remove records

---

## 🧠 State Management & Seat Assignment Logic

### 1. Architecture: React Context + useReducer
The application leverages React's built-in `useReducer` paired with `useContext` (`BookingContext.jsx`). This eliminates external dependencies like Redux while keeping state transitions strictly predictable.

### 2. State Shape
```js
{
  passengerCount: 2,
  passengers: [
    { id: 1, name: "Aarav Sharma", seatId: "2C", mealId: "meal-2" },
    { id: 2, name: "Priya Patel",  seatId: "2D", mealId: "meal-1" }
  ],
  activePassengerId: 1,
  activeLayout: "3-2" // or "2-3-2"
}
```

### 3. Conflict Prevention & Assignment Flow
- **Lookup Map (`assignedSeats`)**: A memoized mapping of `{ [seatId]: passengerId }` provides O(1) conflict validation.
- **Duplicate Prevention**: Before assigning a seat, the reducer checks if another passenger holds it. If so, the action is blocked.
- **Toggle Deselection**: Clicking a seat that the active passenger already owns un-assigns it.
- **Layout Safety**: Switching layout types resets seat assignments to prevent invalid row/column mismatches between the 3–2 and 2–3–2 configurations.

### 4. LocalStorage Reactivity
The `storage.js` utility dispatches a custom browser event (`skybook_tickets_updated`) whenever tickets are created, deleted, or cleared. This guarantees the Header badge and My Bookings modal remain in sync without polling or manual refreshes.

---

## 📂 Project Structure

```
flight-seat-selector/
├── src/
│   ├── components/
│   │   ├── Booking/
│   │   │   └── BookingModal.jsx        # UPI & Card payment checkout
│   │   ├── Header/
│   │   │   └── Header.jsx              # Flight banner & My Tickets counter
│   │   ├── MealSelection/
│   │   │   ├── MealOption.jsx          # Individual meal card
│   │   │   └── MealSelection.jsx       # Meal selector
│   │   ├── PassengerPanel/
│   │   │   ├── PassengerCard.jsx       # Passenger item with inline editable name
│   │   │   ├── PassengerCounter.jsx    # 1-9 passenger stepper
│   │   │   └── PassengerPanel.jsx      # Panel container
│   │   ├── PricingSummary/
│   │   │   └── PricingSummary.jsx      # Price breakdown & checkout trigger
│   │   ├── SeatMap/
│   │   │   ├── LayoutToggle.jsx        # 3-2 vs 2-3-2 switcher
│   │   │   ├── Seat.jsx                # Seat button, states, tooltip
│   │   │   ├── SeatLegend.jsx          # Color indicators
│   │   │   ├── SeatRow.jsx             # Row grid with aisle gaps
│   │   │   └── SeatMap.jsx             # Fuselage container
│   │   └── Tickets/
│   │       ├── MyBookingsModal.jsx     # Saved tickets list from localStorage
│   │       └── TicketModal.jsx         # Boarding pass & print view
│   ├── context/
│   │   └── BookingContext.jsx          # Reducer & global booking context
│   ├── data/
│   │   ├── meals.js                    # Mock meal data (free & paid)
│   │   └── seatLayouts.js              # Layout definitions & occupied seats
│   ├── utils/
│   │   ├── pricing.js                  # Total calculations & INR formatting
│   │   └── storage.js                  # LocalStorage CRUD & event dispatch
│   ├── App.jsx                         # Main app composition
│   ├── index.css                       # Tailwind CSS & theme styling
│   └── main.jsx                        # React root entry
├── index.html                          # HTML shell with Inter typography
└── package.json
```

---

## 🎨 Seat Configurations & Price Rules

| Category | Price | UI Color Theme | Notes |
|---|---|---|---|
| **Standard** | ₹0 | Emerald Green | Rows 5–15 (Middle / Non-window) |
| **Extra Legroom** | ₹350 | Amber / Orange | Rows 3–4 & specific window rows |
| **Premium** | ₹250 | Violet / Purple | Front Rows 1–2 |
| **Occupied** | N/A | Gray with Lock | Pre-booked seats (non-selectable) |
