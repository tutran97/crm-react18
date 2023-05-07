import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { Table, TableFilter, TablePagination, TableLimit } from '../../components';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { cleanParams } from '../../helpers/searchParams';
import { buildFilter } from '../../helpers/graphql';

const MySwal = withReactContent(Swal);

const filters = [
  {
    type: 'Input',
    options: {
      name: 'Name',
      param: 'name',
      placeHolder: 'Find site name...'
    }
  },
  {
    type: 'Input',
    options: {
      name: 'Domain',
      param: 'domain',
      placeHolder: 'Find site domain...'
    }
  }
];

const column = [
  {
    name: 'Id',
    render: ({ node: item }) => <TableCellBold text={item.id} />
  },
  {
    name: 'Name',
    render: ({ node: item }) => <TableCellBold text={item.name} />
  },
  {
    name: 'Domain',
    render: ({ node: item }) => <TableCellText text={item?.domain} />
  },
  {
    name: 'Path',
    render: ({ node: item }) => (
      <p className="mb-0 leading-tight text-xs text-slate-400">{item.path}</p>
    )
  },
  {
    name: 'Date Registered',
    sortKey: 'createdAt',
    render: ({ node: item }) => <TableCellText text={moment(item.createdAt).format('lll')} />
  },
  {
    name: ''
  }
];

const SiteList = () => {
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const navigate = useNavigate();

  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: SitesFilterArgs, $sort: SitesSortArgs, $limit: Int, $offset:Int) {
          sites(first: $limit,offset: $offset, filter: $filter, sort : $sort) {
              edges {
                  cursor,
                  node {
                      id,
                      name,
                      domain,
                      path,                      
                      createdAt
                  }
              },
              pageInfo {
                  startCursor,
                  endCursor
              },
              totalCount,        
          }
      }`,
      variables: cleanParams({
        limit,
        offset,
        filter,
        sort
      })
    }
  });

  useEffect(() => {
    if (loading) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading(null);
        }
      });
    } else {
      MySwal.close();
    }
  }, [loading]);

  return (
    <div className="flex-auto px-0 pt-0 pb-2">
      <div className="relative mb-5 flex flex-col h-full min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <TableFilter name="Filters" items={filters} />
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-0 overflow-x-auto table-responsive">
          <div className="dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns">
            <div className="dataTable-top">
              <div className="dataTable-dropdown">
                <TableLimit />
              </div>
            </div>
            <div className="dataTable-container">
              <Table
                column={column}
                items={data?.data?.sites?.edges}
                onClick={({ node: item }) => navigate(`/sites/${item.id}`)}
              />
            </div>
            <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {(offset || 0) + 1} to{' '}
                {(offset || 0) + (limit || data?.data?.sites?.totalCount)} of{' '}
                {data?.data?.sites?.totalCount} entries
              </div>
              <TablePagination
                className="dataTable-pagination"
                containerClassName="dataTable-pagination-list"
                totalItem={data?.data?.sites?.totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteList;
