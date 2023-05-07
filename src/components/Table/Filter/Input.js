import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cleanParams } from '../../../helpers/searchParams';

export const TableFilterInput = ({ param, name, placeHolder, defaultValue = '' }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    [param]: defaultValue
  });
  const [inputValue, setInputValue] = useState(searchParams.get(param));
  const [timeoutID, setTimeoutID] = useState();

  useEffect(() => {
    setInputValue(searchParams.get(param));
  }, [searchParams]);

  const handleChangeParams = (e) => {
    setInputValue(e.target.value);
    clearTimeout(timeoutID);
    setTimeoutID(
      setTimeout(() => {
        const params = {};
        for (const [paramKey, paramValue] of searchParams.entries()) {
          params[paramKey] = paramValue;
        }
        params[param] = e.target.value;
        setSearchParams({ ...cleanParams(params), offset: 0 });
      }, 1000)
    );
  };

  return (
    <div>
      <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
        {name}
      </label>
      <div>
        <input
          type="text"
          placeholder={placeHolder}
          value={inputValue}
          onChange={handleChangeParams}
          className="w-full focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"></input>
      </div>
    </div>
  );
};

TableFilterInput.propTypes = {
  name: PropTypes.string,
  param: PropTypes.string,
  defaultValue: PropTypes.string,
  placeHolder: PropTypes.string
};
