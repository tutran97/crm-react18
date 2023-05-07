import PropTypes from 'prop-types';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useSearchParams } from 'react-router-dom';
import { cleanParams } from '../../../helpers/searchParams';

export const TableFilterDateRange = ({ param, name, defaultValue = [] }) => {
  const [startValue, endValue] = defaultValue;
  const [searchParams, setSearchParams] = useSearchParams({
    [`start${param}`]: startValue || '',
    [`end${param}`]: endValue || ''
  });
  const handleChangeParams = ([from, to]) => {
    const params = {};
    for (const [paramKey, paramValue] of searchParams.entries()) {
      params[paramKey] = paramValue;
    }
    params[`start${param}`] = from?.toISOString();
    params[`end${param}`] = to?.toISOString();
    setSearchParams({ ...cleanParams(params), offset: 0 });
  };
  return (
    <div>
      <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
        {name}
      </label>
      <div>
        <Flatpickr
          className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
          data-enable-time
          options={{
            mode: 'range',
            altInput: true,
            altFormat: 'F j, Y'
            // dateFormat: 'Z'
          }}
          value={[searchParams.get(`start${param}`), searchParams.get(`end${param}`)]}
          onChange={handleChangeParams}
        />
      </div>
    </div>
  );
};

TableFilterDateRange.propTypes = {
  param: PropTypes.string,
  name: PropTypes.string,
  defaultValue: PropTypes.array
};
