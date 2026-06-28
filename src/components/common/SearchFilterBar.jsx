import React from 'react';

const SearchFilterBar = ({ placeholder, filterOptions, onSearch, onFilter, selectedFilter }) => {
  return (
    <div className="search-filter-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={placeholder || 'Search...'}
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      {filterOptions && filterOptions.length > 0 && (
        <div className="filter-select-wrapper">
          <select
            value={selectedFilter || 'ALL'}
            onChange={(e) => onFilter && onFilter(e.target.value)}
          >
            <option value="ALL">All States</option>
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilterBar;
