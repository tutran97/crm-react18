import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { Table } from '../../components/Table';
import { buildFilter } from '../../helpers/graphql';
import { cleanParams } from '../../helpers/searchParams';
import { TableLimit, TablePagination } from '../../components';
import { TableCellBold, TableCellText, TableCellLink } from '../../components/Table/Cell';

const MySwal = withReactContent(Swal);

const column = [
  {
    name: 'Email',
    render: ({ node: item }) => <TableCellBold text={item?.email} />
  },
  {
    name: 'Event Name',
    render: ({ node: item }) => <TableCellText text={item?.eventName} />
  },
  {
    name: 'Created At',
    render: ({ node: item }) => (
      <TableCellText text={moment(item?.createdAt).format('DD/MM/YYYY')} />
    )
  },
  {
    name: 'Page',
    render: ({ node: item }) => (
      <TableCellLink
        link={
          JSON.stringify(item?.eventData?.properties?.page) ??
          JSON.stringify(item?.eventData?.properties?.Url)
        }
      />
    )
  },
  // {
  //   name: 'First Page',
  //   render: ({ node: item }) => (
  //     <TableCellLink
  //       text={JSON.stringify(item?.eventData?.customer_properties?.$last_referrer?.first_page)}
  //     />
  //   )
  // },
  {
    name: 'OS',
    render: ({ node: item }) => (
      <TableCellText text={JSON.stringify(item?.eventData?.properties?.os)} />
    )
  },
  {
    name: 'Title Name',
    render: ({ node: item }) => (
      <TableCellText text={JSON.stringify(item?.eventData?.properties?.Title)} />
    )
  },
  {
    name: 'Categories',
    render: ({ node: item }) => (
      <TableCellText text={JSON.stringify(item?.eventData?.properties?.Categories)} />
    )
  },
  // {
  //   name: 'Url',
  //   render: ({ node: item }) => (
  //     <TableCellLink text={JSON.stringify(item?.eventData?.properties?.Url)} />
  //   )
  // },
  {
    name: 'Metadata',
    render: ({ node: item }) => (
      <TableCellText text={JSON.stringify(item?.eventData?.properties?.Metadata)} />
    )
  }
  // {
  //   name: 'Image Url',
  //   render: ({ node: item }) => (
  //     <TableCellLink text={JSON.stringify(item?.eventData?.properties?.ImageUrl)} />
  //   )
  // }
];

const CustomerActionLogs = () => {
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  // const navigate = useNavigate();

  const { limit, offset, sort, filter } = buildFilter(searchParams);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($limit: Int, $offset:Int) {
          customerActionLogs(first: $limit,offset: $offset) {
              edges {
                  cursor,
                  node {
                      email,
                      eventName,
                      eventData,
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
                items={data?.data?.customerActionLogs?.edges}
                // onClick={({ node: item }) => navigate(`/customers/${item.id}`)}
              />
            </div>
            <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {(offset || 0) + 1} to{' '}
                {(offset || 0) + (limit || data?.data?.customerActionLogs?.totalCount)} of{' '}
                {data?.data?.customerActionLogs?.totalCount} entries
              </div>
              <TablePagination
                className="dataTable-pagination"
                containerClassName="dataTable-pagination-list"
                totalItem={data?.data?.customerActionLogs?.totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerActionLogs;
