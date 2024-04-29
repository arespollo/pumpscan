import React, { useState } from "react";
import { InputNumber, Button, Space, Checkbox } from "antd";

interface NumberRangeFilterProps {
  onFilter: (min?: number, max?: number, includeNA?: boolean) => void;
  confirm: () => void;
  clearFilters?: () => void;
  onReset?: () => void;
  minPlaceholder?: string; // New prop for minimum value placeholder
  maxPlaceholder?: string; // New prop for maximum value placeholder
  showNACheckbox?: boolean; // New prop to conditionally render the N/A checkbox
}

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({
  onFilter,
  clearFilters,
  onReset,
  confirm,
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  showNACheckbox = false,
}) => {
  const [min, setMin] = useState<number | undefined>();
  const [max, setMax] = useState<number | undefined>();
  const [includeNA, setIncludeNA] = useState<boolean>(true); // State to manage N/A checkbox

  const handleMinChange = (value: number | null) => {
    setMin(value !== null ? value : undefined);
  };

  const handleMaxChange = (value: number | null) => {
    setMax(value !== null ? value : undefined);
  };

  const handleFilter = () => {
    onFilter(min, max, includeNA);
  };

  const handleReset = () => {
    setMin(undefined);
    setMax(undefined);
    setIncludeNA(true); // Reset N/A checkbox
    clearFilters?.();
    onReset?.();
    confirm();
  };

  return (
    <div className="p-4 w-96 bg-white shadow-lg rounded">
      <div className="flex flex-wrap gap-2 mb-2">
        <InputNumber
          className="flex-grow"
          placeholder={minPlaceholder}
          value={min}
          onChange={handleMinChange}
        />
        <InputNumber
          className="flex-grow"
          placeholder={maxPlaceholder}
          value={max}
          onChange={handleMaxChange}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {showNACheckbox && (
          <Checkbox
            checked={includeNA}
            onChange={(e) => setIncludeNA(e.target.checked)}
            className="flex-grow"
          >
            Display N/A
          </Checkbox>
        )}
        <Button
          type="primary"
          onClick={handleFilter}
          size="small"
          className="flex-grow"
        >
          Filter
        </Button>
        <Button onClick={handleReset} size="small" className="flex-grow">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default NumberRangeFilter;
