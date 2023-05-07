import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Choices from 'choices.js';

export const TableFilterMultiChoice = ({ id, param, name, options, emitChange, value, reset }) => {
  const [choices, setChoices] = useState(null);
  useEffect(() => {
    const initChoices = new Choices(`#${id}`, {
      searchEnabled: false,
      delimiter: ',',
      editItems: true,
      removeItemButton: true,
      choices: options
    });
    initChoices.setChoiceByValue(value);
    setChoices(initChoices);
  }, []);

  useEffect(() => {
    if (reset > 0) {
      resetChoices();
    }
  }, [reset]);

  const handleChangeParams = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    emitChange(selectedOptions);
  };

  function resetChoices() {
    choices.clearStore();
    choices.setChoices(options);
    choices.setChoiceByValue(null);
  }

  return (
    <div>
      <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
        {name}
      </label>
      <div>
        <select
          id={id}
          name={param}
          value={value}
          multiple
          onChange={(evt) => handleChangeParams(evt)}
          className="">
          {/* {options?.map((option) => (
            <option key={`options${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))} */}
        </select>
      </div>
    </div>
  );
};

TableFilterMultiChoice.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  param: PropTypes.string,
  options: PropTypes.array,
  emitChange: PropTypes.func,
  value: PropTypes.array,
  reset: PropTypes.number
};
