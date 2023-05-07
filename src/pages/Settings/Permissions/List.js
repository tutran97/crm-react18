import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment';
import { TableCellBold, TableCellText } from '../../../components/Table/Cell';
import useAxios from 'axios-hooks';
import { buildFilter } from '../../../helpers/graphql';
import { Table, TableLimit, TablePagination } from '../../../components';
import { cleanParams } from '../../../helpers/searchParams';

const MySwal = withReactContent(Swal);

const filters = [];

const column = [
  {
    name: 'Id',
    sortKey: 'id',
    render: ({ node: item }) => <TableCellBold text={`${item.id}`} />
  },
  {
    name: 'Name',
    render: ({ node: item }) => <TableCellText text={item.name} />
  },
  {
    name: 'Description',
    render: ({ node: item }) => <TableCellText text={item.description} />
  },
  {
    name: 'Subject',
    render: ({ node: item }) => <TableCellText text={item.subject} />
  },
  {
    name: 'Create Date',
    sortKey: 'createdAt',
    render: ({ node: item }) => <TableCellText text={moment(item.createdAt).format('lll')} />
  },
  {
    name: 'Update Date',
    sortKey: 'updatedAt',
    render: ({ node: item }) => <TableCellText text={moment(item.updatedAt).format('lll')} />
  }
];

export default function PermissionList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: PermissionsFilterArgs, $sort: PermissionsSortArgs, $limit: Int, $offset:Int){
        permissions(first: $limit,offset: $offset, filter: $filter, sort : $sort)  {
              edges {
                  cursor,
                  node {
                    id,
                    name,
                    description,
                    subject,
                    action,
                    conditions,
                    updatedAt,
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
    <div className=" flex flex-wrap sm:flex-nowrap gap-4 ">
      <div className="relative flex flex-col w-full min-w-0 mb-0 break-words bg-white border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="header p-6 pb-0 mb-0 bg-white rounded-t-2xl flex justify-between">
          <h6>List Permission</h6>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-0 overflow-x-auto table-responsive">
            <div className="dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns">
              <div className="dataTable-top">
                <div className="dataTable-dropdown p-0">
                  <TableLimit />
                </div>
                <div className="actions">
                  <Link
                    to={'/permission/add'}
                    className="inline-block px-4 py-2 mb-0 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                    add
                  </Link>
                </div>
              </div>
              <div className="dataTable-container mb-2">
                <Table
                  column={column}
                  items={data?.data?.permissions?.edges}
                  onClick={({ node: item }) => navigate(`/permission/${item.id}`)}
                />
              </div>
              <div className="dataTable-bottom">
                <div className="dataTable-info">
                  Showing {(offset || 0) + 1} to{' '}
                  {(offset || 0) + (limit || data?.data?.permissions?.totalCount)} of{' '}
                  {data?.data?.permissions?.totalCount} entries
                </div>
                <TablePagination
                  className="dataTable-pagination"
                  containerClassName="dataTable-pagination-list"
                  totalItem={data?.data?.permissions?.totalCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
