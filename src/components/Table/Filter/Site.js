import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Choices from 'choices.js';
import { cleanParams } from '../../../helpers/searchParams';
import { useSearchParams } from 'react-router-dom';
import useAxios from 'axios-hooks';
import './style.scss';

export const TableFilterSite = ({ id, param, name }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    [param]: ''
  });
  const [choices, setChoices] = useState(null);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query {
          sites(first: 1000) {
              edges {
                  cursor,
                  node {
                      id,
                      name
                  }
              },
              pageInfo {
                  startCursor,
                  endCursor
              },
              totalCount,        
          }
      }`
    }
  });

  useEffect(() => {
    if (data) {
      const listChoices = data?.data?.sites?.edges.map((site) => ({
        value: site.node.id,
        label: site.node.name,
        id: site.node.id
      }));
      const choices = new Choices(`#${id}`, {
        searchEnabled: true,
        delimiter: ',',
        editItems: true,
        // placeholder: true,
        // placeholderValue: 'Site...',
        choices: listChoices
      });
      choices.setChoiceByValue(parseInt(searchParams.get(param)));
      setChoices(choices);
    }
  }, [loading, data]);
  useEffect(() => {
    if (!searchParams.get(param) && data && choices) {
      choices.setChoiceByValue('');
    }
  }, [searchParams, data]);
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
          <option value="">Site...</option>
        </select>
      </div>
    </div>
  );
};

TableFilterSite.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  param: PropTypes.string
};
