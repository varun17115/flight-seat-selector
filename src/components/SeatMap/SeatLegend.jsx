export default function SeatLegend() {
  const legendItems = [
    { label: 'Standard (Free)', cls: 'bg-emerald-50 border-emerald-300' },
    { label: 'Extra Legroom (₹350)', cls: 'bg-amber-50 border-amber-300' },
    { label: 'Premium (₹250)', cls: 'bg-violet-50 border-violet-300' },
    { label: 'Your Seat', cls: 'bg-indigo-600 border-indigo-500' },
    { label: 'Other Passenger', cls: 'bg-gradient-to-br from-orange-400 to-amber-400 border-orange-300' },
    { label: 'Occupied', cls: 'bg-gray-100 border-gray-200' },
  ];

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2.5 justify-center mt-5 pt-5 border-t border-gray-100">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
          <span className={`w-4 h-4 rounded-md border-2 ${item.cls} inline-block shadow-sm`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
