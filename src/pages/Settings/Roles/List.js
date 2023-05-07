import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
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
    name: 'Permission',
    render: ({ node: item }) => (
      <div className="whitespace-pre-wrap max-w-64">
        {item?.permissions.map((e) => (
          <div key={e.id}>
            <strong>-{e.name}</strong>
          </div>
        ))}
      </div>
    )
  }
];

export default function RolesList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: RolesFilterArgs, $sort: RolesSortArgs, $limit: Int, $offset:Int){
        roles(first: $limit,offset: $offset, filter: $filter, sort : $sort)  {
              edges {
                  cursor,
                  node {
                    id,
                    name,
                    description,
                    permissions {
                      id,
                      name,
                      subject,
                      action,
                      conditions
                  }
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
          <h6>List Role</h6>
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
                    to={'/roles/add'}
                    className="inline-block px-4 py-2 mb-0 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                    add
                  </Link>
                </div>
              </div>
              <div className="dataTable-container mb-2">
                <Table
                  column={column}
                  items={data?.data?.roles?.edges}
                  onClick={({ node: item }) => navigate(`/roles/${item.id}`)}
                />
              </div>
              <div className="dataTable-bottom">
                <div className="dataTable-info">
                  Showing {(offset || 0) + 1} to{' '}
                  {(offset || 0) + (limit || data?.data?.roles?.totalCount)} of{' '}
                  {data?.data?.roles?.totalCount} entries
                </div>
                <TablePagination
                  className="dataTable-pagination"
                  containerClassName="dataTable-pagination-list"
                  totalItem={data?.data?.roles?.totalCount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
