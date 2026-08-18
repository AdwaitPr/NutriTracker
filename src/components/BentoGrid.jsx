import { MacroWidget } from './MacroWidget';
import { HealthBadgeWidget } from './HealthBadgeWidget';

export const BentoGrid = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
      {/* Primary Macro (Usually Calories) */}
      {data.primaryMacro && (
        <MacroWidget
          label={data.primaryMacro.label}
          value={data.primaryMacro.value}
          unit={data.primaryMacro.unit}
          colorTheme="primary"
          isPrimary={true}
        />
      )}

      {/* Sub Macros */}
      {data.subMacros &&
        data.subMacros.map((macro, index) => (
          <MacroWidget
            key={`macro-${index}`}
            label={macro.label}
            value={macro.value}
            unit={macro.unit}
            colorTheme={macro.status}
          />
        ))}

      {/* Health Insights */}
      {data.healthInsights &&
        data.healthInsights.map((insight, index) => (
          <HealthBadgeWidget
            key={`insight-${index}`}
            text={insight.text}
            icon={insight.icon}
            colorTheme={insight.colorTheme}
          />
        ))}
    </div>
  );
};
