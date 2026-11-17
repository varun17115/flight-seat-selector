import { Monitor, Columns3 } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export default function LayoutToggle() {
  const { activeLayout, dispatch, ACTIONS } = useBooking();

  const layouts = [
    { id: '3-2', label: '3–2', desc: 'Narrow body', icon: Monitor },
    { id: '2-3-2', label: '2–3–2', desc: 'Wide body', icon: Columns3 },
  ];

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 gap-1">
      {layouts.map((l) => {
        const Icon = l.icon;
        const isActive = activeLayout === l.id;
        return (
          <button
            key={l.id}
            onClick={() => dispatch({ type: ACTIONS.SET_LAYOUT, payload: l.id })}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-300
              ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-md shadow-gray-200/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{l.label}</span>
            <span className={`hidden sm:inline text-[10px] font-normal ${isActive ? 'text-indigo-400' : 'text-gray-400'}`}>
              {l.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}
