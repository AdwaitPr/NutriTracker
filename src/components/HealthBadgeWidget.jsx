import { Leaf, Activity, Info } from 'lucide-react';

const ICON_MAP = {
  Leaf: Leaf,
  Activity: Activity,
  Info: Info,
};

const THEME_MAP = {
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  red: 'bg-red-50 border-red-200 text-red-800',
};

const ICON_COLOR_MAP = {
  emerald: 'text-emerald-600',
  blue: 'text-blue-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
};

export const HealthBadgeWidget = ({ text, icon, colorTheme = 'blue' }) => {
  const IconComponent = ICON_MAP[icon] || Info;
  const themeClasses = THEME_MAP[colorTheme] || THEME_MAP['blue'];
  const iconColor = ICON_COLOR_MAP[colorTheme] || ICON_COLOR_MAP['blue'];

  return (
    <div className={`col-span-2 sm:col-span-3 flex items-center gap-3 p-3 rounded-xl border shadow-sm ${themeClasses}`}>
      <div className={`p-2 bg-white rounded-lg shadow-sm ${iconColor}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="text-sm font-bold">{text}</span>
    </div>
  );
};
