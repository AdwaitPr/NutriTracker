import { Flame, Beef, Wheat, Droplets, Leaf, Activity, Info } from 'lucide-react';

const ICON_MAP = {
  Calories: Flame,
  Protein: Beef,
  Carbs: Wheat,
  Fats: Droplets,
  Leaf: Leaf,
  Activity: Activity,
  Info: Info,
};

const THEME_MAP = {
  optimal: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  neutral: 'bg-blue-100 text-blue-800 border-blue-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  primary: 'bg-purple-100 text-purple-900 border-purple-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
};

const ICON_COLOR_MAP = {
  optimal: 'text-emerald-600',
  neutral: 'text-blue-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
  primary: 'text-purple-700',
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
};

export const MacroWidget = ({ label, value, unit, colorTheme = 'neutral', icon, isPrimary = false }) => {
  const IconComponent = ICON_MAP[icon] || ICON_MAP[label] || Info;
  const themeClasses = THEME_MAP[colorTheme] || THEME_MAP['neutral'];
  const iconColor = ICON_COLOR_MAP[colorTheme] || ICON_COLOR_MAP['neutral'];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 flex flex-col justify-between border ${themeClasses} ${
        isPrimary ? 'col-span-2 row-span-2' : 'col-span-1'
      }`}
    >
      <div className="flex items-center gap-2 mb-2 z-10">
        <IconComponent className={`w-5 h-5 ${iconColor}`} />
        <span className="text-sm font-semibold opacity-90">{label}</span>
      </div>
      <div className="z-10 flex items-baseline gap-1">
        <span className={`${isPrimary ? 'text-4xl' : 'text-2xl'} font-black tracking-tight`}>
          {value}
        </span>
        <span className="text-sm font-bold opacity-80">{unit}</span>
      </div>
    </div>
  );
};
