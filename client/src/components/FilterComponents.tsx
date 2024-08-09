import React from "react";

const FilterComponent = ({
  filter,
  index,
  updateFilter,
  removeFilter,
}: {
  filter: any;
  index: number;
  updateFilter: Function;
  removeFilter: Function;
}) => {
  const handleFieldChange = (e: any) => {
    updateFilter(index, { ...filter, field: e.target.value });
  };

  const handleConditionChange = (e: any) => {
    updateFilter(index, { ...filter, condition: e.target.value });
  };

  const handleValueChange = (e: any) => {
    updateFilter(index, { ...filter, value: e.target.value });
  };

  return (
    <div className="filter">
      <select value={filter.field} onChange={handleFieldChange}>
        <option value="totalSpend">Total Spend</option>
        <option value="noOfVisits">Number of Visits</option>
        <option value="lastVisit">Last Visit</option>
      </select>
      <select value={filter.condition} onChange={handleConditionChange}>
        <option value="gt">Greater Than</option>
        <option value="lt">Less Than</option>
        <option value="eq">Equal To</option>
        <option value="gte">Greater Than or Equal</option>
        <option value="lte">Less Than or Equal</option>
      </select>
      <input
        type="text"
        value={filter.value}
        onChange={handleValueChange}
        placeholder="Value"
      />
      <button onClick={() => removeFilter(index)}>Remove</button>
    </div>
  );
};

export default FilterComponent;
