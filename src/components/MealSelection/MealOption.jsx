import { formatPrice } from '../../utils/pricing';

export default function MealOption({ meal, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(meal.id)}
      className={`w-full text-left rounded-xl p-3 border-2 transition-all duration-200
        ${
          isSelected
            ? 'border-indigo-500 bg-indigo-50 shadow-sm ring-1 ring-indigo-200'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{meal.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${isSelected ? 'text-indigo-900' : 'text-gray-800'}`}>
              {meal.name}
            </span>
            {meal.tag && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                  ${
                    meal.tag === 'Free'
                      ? 'bg-emerald-100 text-emerald-700'
                      : meal.tag === 'Popular'
                      ? 'bg-blue-100 text-blue-700'
                      : meal.tag === 'Premium'
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {meal.tag}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
            {meal.description}
          </p>
        </div>
        <span
          className={`text-sm font-bold flex-shrink-0 ${
            meal.price === 0 ? 'text-emerald-600' : 'text-gray-700'
          }`}
        >
          {formatPrice(meal.price)}
        </span>
      </div>
      {isSelected && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
          <span>✓</span> Selected
        </div>
      )}
    </button>
  );
}

