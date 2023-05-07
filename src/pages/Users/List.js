import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
      name: 'Username',
      param: 'username',
      placeHolder: 'Find username...'
    }
  },
  {
    type: 'Input',
    options: {
      name: 'Full name',
      param: 'fullName',
      placeHolder: 'Find full name...'
    }
  },
  {
    type: 'Input',
    options: {
      name: 'Email',
      param: 'email',
      placeHolder: 'Find email...'
    }
  },
  {
    type: 'Choice',
    options: {
      id: 'filterStatus',
      name: 'Status',
      param: 'status',
      options: [
        {
          value: '',
          label: 'All',
          default: true
        },
        {
          value: 'ACTIVE',
          label: 'Active'
        },
        {
          value: 'SUSPENDED',
          label: 'Suspended'
        },
        {
          value: 'CLOSED',
          label: 'Closed'
        }
      ]
    }
  },
  {
    type: 'DateRange',
    options: {
      param: 'CreatedAt',
      name: 'Date Registered'
    }
  }
];

const column = [
  {
    name: 'Username',
    render: ({ node: item }) => <TableCellBold text={item.username} />
  },
  {
    name: 'Full Name',
    render: ({ node: item }) => <TableCellText text={item?.fullName} />
  },
  {
    name: 'Status',
    render: ({ node: item }) => (
      <p className="mb-0 leading-tight text-xs text-slate-400">{item.status}</p>
    )
  },
  {
    name: 'Email',
    render: ({ node: item }) => <TableCellText text={item?.email} />
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

const UserList = () => {
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const navigate = useNavigate();

  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: UsersFilterArgs, $sort: UsersSortArgs, $limit: Int, $offset:Int) {
          users(first: $limit,offset: $offset, filter: $filter, sort : $sort) {
              edges {
                  cursor,
                  node {
                      id,
                      fullName,
                      username,
                      status,                      
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
        filter: {
          ...filter,
          supplierId: null
        },
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
              <div>
                <Link
                  to={'/users/add'}
                  className="inline-block px-6 py-3 mb-0 ml-auto font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                  Add User
                </Link>
              </div>
            </div>
            <div className="dataTable-container">
              <Table
                column={column}
                items={data?.data?.users?.edges}
                onClick={({ node: item }) => navigate(`/users/${item.id}`)}
              />
            </div>
            <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {(offset || 0) + 1} to{' '}
                {(offset || 0) + (limit || data?.data?.users?.totalCount)} of{' '}
                {data?.data?.users?.totalCount} entries
              </div>
              <TablePagination
                className="dataTable-pagination"
                containerClassName="dataTable-pagination-list"
                totalItem={data?.data?.users?.totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
