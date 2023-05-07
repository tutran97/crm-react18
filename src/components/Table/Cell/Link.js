import PropTypes from 'prop-types';
import React from 'react';

export const TableCellLink = ({ link }) => {
  const linkFinal = link.split('"')[1];

  const isLink = (link) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(link);
  };

  return (
    <p className="max-w-[250px] mb-0 leading-tight link-xs link-slate-400">
      {isLink(linkFinal) && (
        <a href={link.split('"')[1]} rel="noreferrer" target="_blank">
          {link}
        </a>
      )}
    </p>
  );
};

TableCellLink.propTypes = {
  link: PropTypes.string
};
