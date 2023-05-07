import PropTypes from 'prop-types';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { TableFilterInput } from './Input';
import { TableFilterChoice } from './Choice';
import { TableFilterDateRange } from './DateRange';
import { TableFilterSite } from './Site';

const FilterType = (type) => {
  switch (type) {
    case 'Input':
      return TableFilterInput;
    case 'Choice':
      return TableFilterChoice;
    case 'DateRange':
      return TableFilterDateRange;
    case 'Site':
      return TableFilterSite;
  }
};
export const TableFilter = ({ items, name, children, emitReset }) => {
  const [, setSearchParams] = useSearchParams();
  const resetFilter = () => {
    setSearchParams({});
    emitReset();
  };

  return (
    <>
      <div className="p-4 pb-0 mb-0 rounded-t-2xl">
        <h6>{name}</h6>
      </div>
      <div className="p-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {items &&
          items.map((item, index) => {
            const Filter = FilterType(item.type);
            return <Filter key={`filter${index}`} {...item.options} />;
          })}
        {children}
      </div>
      <div className="flex items-center p-4 pt-0 rounded-b-2xl">
        <div className="ml-auto text-right">
          <button
            type="button"
            onClick={resetFilter}
            className="inline-block px-6 py-3 mb-0 ml-auto font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

TableFilter.propTypes = {
  items: PropTypes.array,
  name: PropTypes.string,
  children: PropTypes.any,
  emitReset: PropTypes.func
};
