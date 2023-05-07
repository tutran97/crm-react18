import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import Choices from 'choices.js';
import { cleanParams } from '../../../helpers/searchParams';
import { useSearchParams } from 'react-router-dom';

export const TableFilterChoice = ({ id, param, name, options }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    [param]: options.find((option) => option.default)?.value
  });

  useEffect(() => {
    new Choices(`#${id}`, {
      searchEnabled: false,
      delimiter: ',',
      editItems: true
    });
  }, []);

  const handleChangeParams = (key, value) => {
    const params = {};
    for (const [paramKey, paramValue] of searchParams.entries()) {
      params[paramKey] = paramValue;
    }
    params[key] = value;
    setSearchParams({ ...cleanParams(params), offset: 0 });
  };
  return (
    <div>
      <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
        {name}
      </label>
      <div>
        <select
          id={id}
          name={param}
          onChange={(evt) => handleChangeParams(evt.target.name, evt.target.value)}
          value={searchParams.get(param)}
          className="">
          {options?.map((option) => (
            <option key={`options${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

TableFilterChoice.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  param: PropTypes.string,
  options: PropTypes.array
};
