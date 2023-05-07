import React from 'react';
import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import { cleanParams } from '../../helpers/searchParams';

export const TablePagination = ({ className = '', containerClassName = '', totalItem }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });

  const limit = parseInt(searchParams.get('limit'));
  const offset = parseInt(searchParams.get('offset'));
  const totalPage = Math.ceil(totalItem / limit);
  const currentPage = offset / limit + 1;

  let startPage = currentPage - 2;
  if (startPage <= 0) {
    startPage = 1;
  }
  if (startPage > totalPage) {
    startPage = totalPage;
  }
  let endPage = currentPage + 2;
  if (endPage > totalPage) {
    endPage = totalPage;
  }
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handleChangePage = (e, pageNumber) => {
    e.preventDefault();
    const params = {};
    for (const [paramKey, paramValue] of searchParams.entries()) {
      params[paramKey] = paramValue;
    }
    params['offset'] = limit * (pageNumber - 1);
    setSearchParams(cleanParams(params));
  };

  return (
    <nav className={className}>
      <ul className={containerClassName}>
        {currentPage > 1 && (
          <li className="pager">
            <Link onClick={(event) => handleChangePage(event, currentPage - 1)}>‹</Link>
          </li>
        )}
        {pages.map((page, index) => (
          <li key={`page_${index}_${page}`} className={page === currentPage ? 'active' : ''}>
            <Link onClick={(event) => handleChangePage(event, page)}>{page}</Link>
          </li>
        ))}
        {currentPage < totalPage && (
          <li className="pager">
            <Link onClick={(event) => handleChangePage(event, currentPage + 1)}>›</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

TablePagination.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  totalItem: PropTypes.number
};
