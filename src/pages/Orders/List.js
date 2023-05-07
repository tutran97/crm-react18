import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
// import _ from 'lodash';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

import { OrderStatus, Table, TableFilter, TableLimit, TablePagination } from '../../components';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { buildFilter } from '../../helpers/graphql';
import { cleanParams } from '../../helpers/searchParams';
import { ORDER_STATUS } from '../../constants';

const MySwal = withReactContent(Swal);

const filters = [
  {
    type: 'Input',
    options: {
      name: 'Order ID',
      param: 'id',
      placeHolder: 'Find order id...'
    }
  },
  {
    type: 'Input',
    options: {
      name: 'Order Key',
      param: 'orderKey',
      placeHolder: 'Find order key...'
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
    type: 'Site',
    options: {
      id: 'filterSiteId',
      name: 'Site',
      param: 'siteId'
    }
  },
  {
    type: 'DateRange',
    options: {
      param: 'CreatedAt',
      name: 'Date Created'
    }
  }
];

const column = [
  {
    name: 'Order',
    sortKey: 'id',
    render: ({ node: item }) => (
      <TableCellBold
        text={`#${item.id} ${item?.billingOrderAddress?.firstName} ${item?.billingOrderAddress?.lastName}`}
      />
    )
  },
  {
    name: 'Email',
    render: ({ node: item }) => <TableCellText text={item.billingOrderAddress?.email} />
  },
  {
    name: 'Site',
    render: ({ node: item }) => <TableCellText text={item.site.name} />
  },
  {
    name: 'Order Key',
    render: ({ node: item }) => <TableCellText text={item.orderKey} />
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
    name: 'Payment Fee',
    sortKey: 'paymentFee',
    render: ({ node: item }) => <TableCellBold text={`$${item.paymentFee}`} />
  }
];

const OrderList = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
    offset: 0
  });
  const navigate = useNavigate();

  const status = searchParams.get('status');
  const { limit, offset, sort, filter } = buildFilter(searchParams, filters);

  if (status) {
    filter.status = status;
  }
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
                      orderKey,
                      site {
                          name
                      },
                      billingOrderAddress {
                          firstName,
                          lastName,
                          email
                      },
                      originalOrderId,
                      createdAt,
                      paymentFee,
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

  const handleChangeParams = (key, value) => {
    const params = {};
    for (const [paramKey, paramValue] of searchParams.entries()) {
      params[paramKey] = paramValue;
    }
    params[key] = value;

    setSearchParams({ ...cleanParams(params), offset: 0 });
  };

  const [{ data: dataExport }, getDataExport] = useAxios({
    method: 'post',
    data: {
      query: `query ($filter: OrdersFilterArgs, $sort: OrdersSortArgs, $limit: Int, $offset:Int){
          orders(first: $limit,offset: $offset, filter: $filter, sort : $sort)  {
              edges {
                  cursor,
                  node {
                      id,
                      status,
                      orderKey,
                      site {
                          name
                      },
                      billingOrderAddress {
                          firstName,
                          lastName,
                          email
                      },
                      originalOrderId,
                      createdAt,
                      paymentFee,
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
      variables: cleanParams({ filter, sort })
    }
  });

  const convertToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const convertDataExport = (data) => {
    const result = [];
    data.forEach((e) => {
      let item = e.node;
      let obj = {
        'No.': item.id,
        'Order Code': item.orderKey,
        Status: ORDER_STATUS[item.status].text,
        Customer: `${item.billingOrderAddress.firstName} ${item.billingOrderAddress.lastName}`,
        'Billing Email': item.billingOrderAddress.email,
        // 'Gross Sales': null,
        Currency: 'USD',
        'Net Sales': item.paymentFee + item.total,
        'Payment Fee': item.paymentFee,
        'Total Sale': item.total
      };
      result.push(obj);
    });
    return result;
  };

  const handleExportCSV = async () => {
    await getDataExport();
    if (dataExport?.data?.orders?.edges) {
      const dataFinal = await convertDataExport(dataExport?.data?.orders?.edges);
      const csvData = await convertToCSV(dataFinal);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8,' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'data.csv');
      link.click();
    }
  };

  return (
    <>
      <div className="flex-auto px-0 pt-0 pb-2">
        <div className="relative mb-5 flex flex-col h-full min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <TableFilter name="Filters" items={filters} />
        </div>
        <div className="relative mb-5 flex flex-col h-full min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="m-5 justify-between sm:flex">
            <div>
              {Object.keys(ORDER_STATUS)
                .filter((e) => e !== 'wc-checkout-draft')
                .map((selectedStatus, index) => (
                  <span key={`status_filter_${selectedStatus}`}>
                    {index > 0 ? ' | ' : ''}
                    <Link
                      onClick={(event) => {
                        event.preventDefault();
                        handleChangeParams(
                          'status',
                          selectedStatus === 'all' ? '' : selectedStatus
                        );
                        // handleChangeParams('status', status === 'all' ? '' : status);
                      }}
                      className={
                        (!status && selectedStatus === 'all') || status === selectedStatus
                          ? 'font-bold text-blue-500'
                          : ''
                      }>
                      {ORDER_STATUS[selectedStatus].text}
                    </Link>
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-0 overflow-x-auto table-responsive">
            <div className="dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns">
              <div className="dataTable-top">
                <div className="dataTable-dropdown">
                  <TableLimit />
                </div>
                <div className="actions">
                  <button
                    onClick={handleExportCSV}
                    type="button"
                    className="inline-block px-6 py-3 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                    Export
                  </button>
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
    </>
  );
};
export default OrderList;
