import { useState } from 'react';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header/Header';
import PassengerPanel from './components/PassengerPanel/PassengerPanel';
import SeatMap from './components/SeatMap/SeatMap';
import PricingSummary from './components/PricingSummary/PricingSummary';
import MealSelection from './components/MealSelection/MealSelection';
import BookingModal from './components/Booking/BookingModal';
import TicketModal from './components/Tickets/TicketModal';
import MyBookingsModal from './components/Tickets/MyBookingsModal';

function AppContent() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);

  const handleBookingSuccess = (ticket) => {
    setIsBookingModalOpen(false);
    setActiveTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleViewTicketFromHistory = (ticket) => {
    setActiveTicket(ticket);
    setIsTicketModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      <Header onOpenMyBookings={() => setIsMyBookingsOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column — Passengers + Price Breakdown */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <PassengerPanel />
            <PricingSummary onOpenBooking={() => setIsBookingModalOpen(true)} />
          </div>

          {/* Center column — Seat Map Grid */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <SeatMap />
          </div>

          {/* Right column — Meal Selection Module */}
          <div className="lg:col-span-3 order-3">
            <MealSelection />
          </div>
        </div>
      </main>

      {/* Booking Checkout Modal (UPI / Card) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* E-Ticket & Boarding Pass Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        ticket={activeTicket}
        onClose={() => setIsTicketModalOpen(false)}
      />

      {/* My Booked Tickets / History Modal (from LocalStorage) */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        onViewTicket={handleViewTicketFromHistory}
      />

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200 mt-auto">
        Built for EPaisa Frontend Assessment · SkyBook ✈️ · Data persisted in Browser LocalStorage
      </footer>
    </div>
  );
}

function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

export default App;
