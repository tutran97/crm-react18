import PropTypes from 'prop-types';
import React from 'react';

export const TableCellText = ({ text }) => {
  return (
    <p className="whitespace-pre-wrap  max-w-64 mb-0 leading-tight text-xs text-slate-400">
      {text}
    </p>
  );
};

TableCellText.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
