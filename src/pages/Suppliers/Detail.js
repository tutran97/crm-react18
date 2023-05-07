import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useAxios from 'axios-hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import PropTypes from 'prop-types';

import { Table, TableLimit, TablePagination } from '../../components';
import SupplierForm from '../../components/SupplierForm';
import UserForm from '../../components/UserForm';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { buildFilter } from '../../helpers/graphql';
import { cleanParams } from '../../helpers/searchParams';
import { Modal } from '../../components/Modal';

const MySwal = withReactContent(Swal);

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

const UserList = ({ supplier }) => {
  const { supplierId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { limit, offset, sort } = buildFilter(searchParams);
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
          supplierId: parseInt(supplierId)
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

  const handleAddUser = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseAddUser = () => {
    setShowModal(false);
  };
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="p-0 overflow-x-auto table-responsive">
        <div className="dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns">
          <div className="dataTable-top">
            <div className="dataTable-dropdown">
              <TableLimit />
            </div>
            <div>
              <Link
                onClick={handleAddUser}
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
      <Modal
        title="Add Supplier User"
        isShow={showModal}
        content={<UserForm supplier={supplier} onSuccess={handleCloseAddUser} />}
        onClose={handleCloseAddUser}
      />
    </div>
  );
};

UserList.propTypes = {
  supplier: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    code: PropTypes.string,
    status: PropTypes.string
  })
};

const SupplierDetail = () => {
  const { supplierId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    type: 'info'
  });

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
          supplier(id: $id) {
              id,
              name,
              code,              
              status,          
              createdAt
          }
      }`,
      variables: {
        id: parseInt(supplierId)
      }
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
    <div className="w-full p-6 py-4 mx-auto my-4">
      <div className="flex flex-wrap mb-12 -mx-3">
        <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 lg:w-3/12">
          <div className="sticky flex flex-col min-w-0 break-words bg-white border-0 top-1/100 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
            <ul className="flex flex-col flex-wrap p-4 mb-0 list-none rounded-xl">
              <li>
                <span
                  onClick={() => {
                    setSearchParams({
                      ...searchParams,
                      type: 'info'
                    });
                  }}
                  className="cursor-pointer block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200">
                  <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
                    <i className="fas fa-id-badge text-lg" aria-hidden="true"></i>
                  </div>
                  <span className="leading-normal text-sm dark:text-white">Info</span>
                </span>
              </li>
              <li className="pt-2">
                <span
                  onClick={() => {
                    setSearchParams({
                      ...searchParams,
                      type: 'users'
                    });
                  }}
                  className=" cursor-pointer block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200">
                  <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
                    <i className="fas fa-file-invoice-dollar text-lg" aria-hidden="true"></i>
                  </div>
                  <span className="leading-normal text-sm dark:text-white">Users</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 lg:w-9/12">
          {searchParams.get('type') === 'info' && data && (
            <SupplierForm supplier={data?.data?.supplier} />
          )}
          {searchParams.get('type') === 'users' && <UserList supplier={data?.data?.supplier} />}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
