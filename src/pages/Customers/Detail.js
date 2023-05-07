import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Input } from '../../components/Form';
import { OrderStatus, Table, TableLimit, TablePagination } from '../../components';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import moment from 'moment/moment';
import { buildFilter } from '../../helpers/graphql';
import { cleanParams } from '../../helpers/searchParams';

const MySwal = withReactContent(Swal);

const column = [
  {
    name: 'Order',
    sortKey: 'id',
    render: ({ node: item }) => <TableCellBold text={`#${item.id}`} />
  },
  {
    name: 'Site',
    render: ({ node: item }) => <TableCellText text={item.site.name} />
  },
  {
    name: 'Date',
    sortKey: 'createdAt',
    render: ({ node: item }) => <TableCellText text={moment(item.createdAt).format('lll')} />
  },
  {
    name: 'Status',
    render: ({ node: item }) => (
      <div className="flex items-center">
        <OrderStatus status={item.status} />
      </div>
    )
  },
  {
    name: 'Total',
    sortKey: 'total',
    render: ({ node: item }) => <TableCellBold text={`$${item.total}`} />
  },
  {
    name: ''
  }
];
const DetailForm = ({ data = {} }) => {
  return (
    <>
      <div className="relative flex flex-col flex-auto min-w-0 p-4 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="flex flex-wrap items-center justify-center -mx-3">
          <div className="w-full max-w-full px-3 my-auto flex-0 sm:w-auto">
            <div className="h-full">
              <h5 className="mb-1 font-bold dark:text-white">
                {data.firstName} {data.lastName}
              </h5>
              <p className="mb-0 font-semibold leading-normal text-sm">#{data.id}</p>
            </div>
          </div>
          <div className="flex max-w-full px-3 mt-4 sm:flex-0 shrink-0 sm:mt-0 sm:ml-auto sm:w-auto"></div>
        </div>
      </div>
      <div className="relative flex flex-col min-w-0 mt-6 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-6 mb-0 rounded-t-2xl">
          <h5 className="dark:text-white">Basic Info</h5>
        </div>
        <div className="flex-auto p-6 pt-0">
          <div className="flex flex-wrap -mx-3">
            <div className="w-6/12 max-w-full px-3 flex-0">
              <Input value={data.firstName} label={'First Name'} disabled={true} />
            </div>
            <div className="w-6/12 max-w-full px-3 flex-0">
              <Input value={data.lastName} label={'Last Name'} disabled={true} />
            </div>
          </div>
          <Input value={data.site.name} label={'From Site'} disabled={true} />
          <Input value={data.email} label={'Email'} disabled={true} />
          <Input value={data.phoneNumber} label={'Phone number'} disabled={true} />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full max-w-full px-3 mt-6 md:w-7/12 md:flex-none">
          <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
              <h5 className="dark:text-white">Addresses</h5>
            </div>
            <div className="flex-auto p-4 pt-6">
              <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                {data.addresses.map((address, index) => (
                  <div
                    key={`address_${index}`}
                    className="relative flex p-6 mb-2 border-0 rounded-t-inherit rounded-xl bg-gray-50 dark:bg-transparent">
                    <div className="flex flex-col">
                      {index == 0 ? (
                        <h5>Billing info</h5>
                      ) : index == 1 ? (
                        <h5>Shiping info</h5>
                      ) : null}
                      <h6 className="mb-4 leading-normal text-sm dark:text-white">
                        {address.firstName} {address.lastName}
                      </h6>
                      <span className="mb-2 leading-tight text-xs">
                        Company Name:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.company}
                        </span>
                      </span>
                      <span className="mb-2 leading-tight text-xs">
                        Email Address:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.email}
                        </span>
                      </span>
                      <span className="leading-tight text-xs">
                        PhoneNumber:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.phoneNumber}
                        </span>
                      </span>
                      <span className="leading-tight text-xs">
                        Address 1:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.address1}
                        </span>
                      </span>
                      <span className="leading-tight text-xs">
                        Address 2:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.address2}
                        </span>
                      </span>
                      <span className="leading-tight text-xs">
                        Location:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.city}, {address.state} {address.postcode}
                        </span>
                      </span>
                      <span className="leading-tight text-xs">
                        Country:{' '}
                        <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                          {address.country}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full px-3 mt-6 md:w-5/12 md:flex-none">
          <div className="relative flex flex-col h-full min-w-0 mb-6 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
            <div className="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
              <div className="flex flex-wrap -mx-3">
                <div className="max-w-full px-3 md:w-1/2 md:flex-none">
                  <h6 className="mb-0 dark:text-white">Statistic</h6>
                </div>
              </div>
            </div>
            <div className="flex-auto p-4 pt-6">
              <h6 className="mb-4 font-bold leading-tight uppercase text-xs text-slate-500">
                Order
              </h6>
              <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-t-inherit text-inherit rounded-xl">
                  <div className="flex items-center">
                    <span className="leading-pro ease-soft-in text-xs bg-150 w-6 h-6 p-1.2 rounded-3.5xl tracking-tight-soft bg-x-25 mr-4 mb-0 flex items-center justify-center border border-solid border-lime-500 border-transparent bg-transparent text-center align-middle font-bold uppercase text-lime-500 transition-all hover:opacity-75">
                      <i className="fas fa-check text-3xs" aria-hidden="true"></i>
                    </span>
                    <div className="flex flex-col">
                      <h6 className="mb-1 leading-normal text-sm text-slate-700 dark:text-white">
                        Total Order
                      </h6>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="relative z-10 inline-block m-0 font-semibold leading-normal text-transparent bg-gradient-to-tl from-green-600 to-lime-400 text-sm bg-clip-text">
                      {data.totalOrder}
                    </p>
                  </div>
                </li>
                <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-t-inherit text-inherit rounded-xl">
                  <div className="flex items-center">
                    <span className="leading-pro ease-soft-in text-xs bg-150 w-6 h-6 p-1.2 rounded-3.5xl tracking-tight-soft bg-x-25 mr-4 mb-0 flex items-center justify-center border border-solid border-lime-500 border-transparent bg-transparent text-center align-middle font-bold uppercase text-lime-500 transition-all hover:opacity-75">
                      <i className="fas fa-check text-3xs" aria-hidden="true"></i>
                    </span>
                    <div className="flex flex-col">
                      <h6 className="mb-1 leading-normal text-sm text-slate-700 dark:text-white">
                        Total Spend
                      </h6>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="relative z-10 inline-block m-0 font-semibold leading-normal text-transparent bg-gradient-to-tl from-green-600 to-lime-400 text-sm bg-clip-text">
                      ${data.totalSpend}
                    </p>
                  </div>
                </li>
                <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-t-inherit text-inherit rounded-xl">
                  <div className="flex items-center">
                    <span className="leading-pro ease-soft-in text-xs bg-150 w-6 h-6 p-1.2 rounded-3.5xl tracking-tight-soft bg-x-25 mr-4 mb-0 flex items-center justify-center border border-solid border-lime-500 border-transparent bg-transparent text-center align-middle font-bold uppercase text-lime-500 transition-all hover:opacity-75">
                      <i className="fas fa-check text-3xs" aria-hidden="true"></i>
                    </span>
                    <div className="flex flex-col">
                      <h6 className="mb-1 leading-normal text-sm text-slate-700 dark:text-white">
                        AOV
                      </h6>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="relative z-10 inline-block m-0 font-semibold leading-normal text-transparent bg-gradient-to-tl from-green-600 to-lime-400 text-sm bg-clip-text">
                      ${data.aov}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

DetailForm.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    site: PropTypes.shape({
      name: PropTypes.string
    }),
    addresses: PropTypes.array
  })
};

const Orders = () => {
  const [searchParams] = useSearchParams();
  const { customerId } = useParams();
  const navigate = useNavigate();

  const { limit, offset, sort, filter } = buildFilter(searchParams, []);

  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: OrdersFilterArgs, $sort: OrdersSortArgs, $limit: Int, $offset:Int){
          orders(first: $limit,offset: $offset, filter: $filter, sort : $sort)  {
              edges {
                  cursor,
                  node {
                      id,
                      status,
                      site {
                          name
                      },
                      createdAt,
                      total
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
          customerId
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
    <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="p-6 mb-0 rounded-t-2xl">
        <h5 className="dark:text-white">Orders</h5>
      </div>
      <div className="flex-auto p-6 pt-0">
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
                items={data?.data?.orders?.edges}
                onClick={({ node: item }) => navigate(`/orders/${item.id}`)}
              />
            </div>
            <div className="dataTable-bottom">
              <div className="dataTable-info">
                Showing {(offset || 0) + 1} to{' '}
                {(offset || 0) + (limit || data?.data?.orders?.totalCount)} of{' '}
                {data?.data?.orders?.totalCount} entries
              </div>
              <TablePagination
                className="dataTable-pagination"
                containerClassName="dataTable-pagination-list"
                totalItem={data?.data?.orders?.totalCount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const CustomerDetail = () => {
  const { customerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    type: 'profile'
  });

  // TODO : create lib call api
  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
          customer(id: $id) {
              id,
              firstName,
              lastName,
              email,
              phoneNumber,
              addresses {
                firstName,
                lastName,
                email,
                phoneNumber,
                company,
                address1,
                address2,
                postcode,
                city,
                state,
                country,
              },
              orders {
                id,
                status,
                orderKey,
                originalOrderId,
                createdAt,
                total
              },
              site {
                name
              },
              totalOrder,
              totalSpend,
              aov,
              createdAt        
              updatedAt        
          }
      }`,
      variables: {
        id: parseInt(customerId)
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
                      type: 'profile'
                    });
                  }}
                  className="cursor-pointer block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200">
                  <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
                    <i className="fas fa-id-badge text-lg" aria-hidden="true"></i>
                  </div>
                  <span className="leading-normal text-sm dark:text-white">Profile</span>
                </span>
              </li>
              <li className="pt-2">
                <span
                  onClick={() => {
                    setSearchParams({
                      ...searchParams,
                      type: 'orders'
                    });
                  }}
                  className=" cursor-pointer block px-4 py-2 transition-colors rounded-lg ease-soft-in-out text-slate-500 hover:bg-gray-200">
                  <div className="inline-block mr-2 text-black fill-current h-4 w-4 stroke-none">
                    <i className="fas fa-file-invoice-dollar text-lg" aria-hidden="true"></i>
                  </div>
                  <span className="leading-normal text-sm dark:text-white">Orders</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 lg:w-9/12">
          {searchParams.get('type') === 'profile' && data && (
            <DetailForm data={data?.data?.customer} />
          )}
          {searchParams.get('type') === 'orders' && data && <Orders />}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
