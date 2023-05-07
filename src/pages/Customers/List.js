import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { Table } from '../../components/Table';
import { buildFilter } from '../../helpers/graphql';
import { cleanParams } from '../../helpers/searchParams';
import { TableFilter, TableLimit, TablePagination } from '../../components';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { formatPrice, precisionRound } from '../../helpers/utils';

const MySwal = withReactContent(Swal);

const filters = [
  {
    type: 'Input',
    options: {
      name: 'First Name',
      param: 'firstName',
      placeHolder: 'Find first name...'
    }
  },
  {
    type: 'Input',
    options: {
      name: 'Last Name',
      param: 'lastName',
      placeHolder: 'Find last name...'
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
    type: 'DateRange',
    options: {
      param: 'CreatedAt',
      name: 'Date Registered'
    }
  }
];

const column = [
  {
    name: 'Name',
    render: ({ node: item }) => (
      <TableCellBold text={`#${item.id} ${item?.firstName} ${item?.lastName}`} />
    )
  },
  {
    name: 'Email',
    render: ({ node: item }) => <TableCellText text={item?.email} />
  },
  {
    name: 'Last Update',
    sortKey: 'updatedAt',
    render: ({ node: item }) => <TableCellText text={moment(item?.updatedAt).format('lll')} />
  },
  {
    name: 'Date Registered',
    sortKey: 'createdAt',
    render: ({ node: item }) => <TableCellText text={moment(item?.createdAt).format('lll')} />
  },
  {
    name: 'Orders',
    sortKey: 'totalOrder',
    render: ({ node: item }) => <TableCellText text={item?.totalOrder} />
  },
  {
    name: 'Total Spend',
    sortKey: 'totalSpend',
    render: ({ node: item }) => <TableCellText text={`${formatPrice(item?.totalSpend)}`} />
  },
  {
    name: 'AOV',
    sortKey: 'aov',
    render: ({ node: item }) => (
      <TableCellText text={`${formatPrice(precisionRound(item?.aov, 2))}`} />
    )
  },
  {
    name: ''
  }
];

const CustomerList = () => {
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const navigate = useNavigate();

  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: CustomersFilterArgs, $sort: CustomersSortArgs, $limit: Int, $offset:Int) {
          customers(first: $limit,offset: $offset, filter: $filter, sort : $sort) {
              edges {
                  cursor,
                  node {
                      id,
                      firstName,
                      lastName,
                      email,
                      phoneNumber,
                      site {
                        name
                      },      
                      totalOrder,
                      totalSpend,             
                      aov,             
                      createdAt,
                      updatedAt
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
                items={data?.data?.customers?.edges}
                onClick={({ node: item }) => navigate(`/customers/${item.id}`)}
              />
            </div>
            <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {(offset || 0) + 1} to{' '}
                {(offset || 0) + (limit || data?.data?.customers?.totalCount)} of{' '}
                {data?.data?.customers?.totalCount} entries
              </div>
              <TablePagination
                className="dataTable-pagination"
                containerClassName="dataTable-pagination-list"
                totalItem={data?.data?.customers?.totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
