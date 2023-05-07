import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Choices from 'choices.js';

export const MultiChoice = ({
  name,
  id,
  label,
  className,
  choices = [],
  value,
  onChange = () => {}
}) => {
  const [choicesObj, setChoicesObj] = useState(null);
  useEffect(() => {
    const choicesObj = new Choices(`#${id}`, {
      searchEnabled: false,
      delimiter: ',',
      editItems: true,
      removeItemButton: true,
      choices: choices
    });
    setChoicesObj(choicesObj);
  }, []);

  useEffect(() => {
    choicesObj && choicesObj.setChoiceByValue(value);
  }, [value, choicesObj]);

  useEffect(() => {
    if (choices?.length > 0) {
      choicesObj.clearStore();
      choicesObj.setChoices(choices);
      choicesObj && choicesObj.setChoiceByValue(value);
    }
  }, [choices]);

  return (
    <div className={className}>
      <label className="mb-2 ml-1 font-bold text-xs text-slate-700 dark:text-white/80">
        {label}
      </label>
      <div>
        <select id={id} name={name} multiple onChange={onChange} value={value}></select>
      </div>
    </div>
  );
};
MultiChoice.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  choices: PropTypes.array,
  onChange: PropTypes.func
};
