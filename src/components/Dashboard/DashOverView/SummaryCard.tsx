type ValueType = {
  label?: string | number;
  value: number | string;
};

interface SummaryCardProps {
  children?: React.ReactNode;
  title: string;
  value?: number | string;           // single value
  values?: ValueType[];              // multiple values
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ children, title, value, values, className }) => {
  const displayValues = value !== undefined ? [{ value }] : values;

  return (
    <div className={`bg-white shadow-lg shadow-gray-800 rounded p-4 min-w-[200px] w-full ${className}`}>
      <div className="flex items-center gap-2 mb-3 text-lg font-semibold py-2 border-b-2 border-brandPrimary">
        {children}
        <span>{title}</span>
      </div>
      <div className="space-y-1 flex md:flex-row flex-col items-center gap-3 justify-between">
        {displayValues?.map((item, i) => (
          <div key={i}>
            <p className="font-bold">{item.value}</p>
            {item.label && <p className="text-gray-600 text-sm">{item.label}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryCard;
