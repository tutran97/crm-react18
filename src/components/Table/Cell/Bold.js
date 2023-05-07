import PropTypes from 'prop-types';
import React from 'react';

export const TableCellBold = ({ text }) => {
  return (
    <div className="flex px-2 py-1">
      <div className="flex flex-col justify-center">
        <h6 className="mb-0 leading-normal text-sm">{text}</h6>
      </div>
    </div>
  );
};

TableCellBold.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
