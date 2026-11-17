const STORAGE_KEY = 'skybook_tickets';

export function getBookedTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read bookings from localStorage:', err);
    return [];
  }
}

export function saveBookedTicket(ticket) {
  try {
    const existing = getBookedTickets();
    const updated = [ticket, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity in other components
    window.dispatchEvent(new Event('skybook_tickets_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to save booking to localStorage:', err);
    return [];
  }
}

export function deleteBookedTicket(ticketId) {
  try {
    const existing = getBookedTickets();
    const updated = existing.filter((t) => t.id !== ticketId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('skybook_tickets_updated'));
    return updated;
  } catch (err) {
    console.error('Failed to delete booking from localStorage:', err);
    return [];
  }
}

export function clearAllTickets() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('skybook_tickets_updated'));
    return [];
  } catch (err) {
    console.error('Failed to clear tickets from localStorage:', err);
    return [];
  }
}

