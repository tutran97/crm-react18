import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import { cleanParams } from '../../helpers/searchParams';
// import { useState } from 'react';

export const Table = ({ column, items, onClick }) => {
  const [searchParams, setSearchParams] = useSearchParams({
    sort: ''
  });
  const [sortKey, sortDirection] = searchParams.get('sort').split('-', 2);
  // const [direction, setDirection] = useState(sortBy && sortBy.length === 2 ? sortBy : []);

  const handleSort = (e, columnSortKey) => {
    e.preventDefault();
    if (columnSortKey) {
      let newDirection = '';
      switch (sortKey === columnSortKey ? sortDirection : '') {
        case 'desc':
        default:
          newDirection = 'asc';
          break;
        case 'asc':
          newDirection = 'desc';
          break;
      }
      const params = {};
      for (const [paramKey, paramValue] of searchParams.entries()) {
        params[paramKey] = paramValue;
      }
      params['sort'] = `${columnSortKey}-${newDirection}`;
      setSearchParams(cleanParams(params));
    }
  };

  return (
    <table className="table border border-gray-200 border-solid border-1 items-center w-full mb-0 dataTable-table ">
      <thead className="thead-light bg-slate-50">
        <tr>
          {column.map((col, index) => (
            <th key={`th_${index}`} className={sortKey === col.sortKey ? sortDirection : ''}>
              <Link
                onClick={(e) => handleSort(e, col.sortKey)}
                className={col.sortKey ? 'dataTable-sorter' : ''}>
                {col.name}
              </Link>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items &&
          items.map((item, index) => (
            <tr
              key={`tr_${index}`}
              className="cursor-pointer"
              onClick={() => onClick && onClick(item)}>
              {column.map(
                (col, i) =>
                  col.render && (
                    <td key={`td_${index}_${i}`} className="text-xs">
                      {col.render(item)}
                    </td>
                  )
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  column: PropTypes.array,
  items: PropTypes.array,
  onClick: PropTypes.func
};
