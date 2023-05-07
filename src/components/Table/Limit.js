import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { cleanParams } from '../../helpers/searchParams';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

export const TableLimit = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10
  });

  const handleChangeParams = (key, value) => {
    const params = {};
    for (const [paramKey, paramValue] of searchParams.entries()) {
      params[paramKey] = paramValue;
    }
    params[key] = value;
    setSearchParams(cleanParams(params));
  };
  return (
    <label>
      <select
        name="limit"
        onChange={(evt) => handleChangeParams(evt.target.name, evt.target.value)}
        value={searchParams.get('limit')}
        className="dataTable-selector">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>{' '}
      entries per page
    </label>
  );
};

TableLimit.propTypes = {};
