import React, { useEffect, useState } from 'react';
import useAxios from 'axios-hooks';
import moment from 'moment';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Table } from '../../components/Table';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { TableFilter } from '../../components';
import { useSearchParams } from 'react-router-dom';
import { buildFilter } from '../../helpers/graphql';
import { TableFilterMultiChoice } from '../../components/Table/Filter/MultiChoice';

const MySwal = withReactContent(Swal);

const filters = [
  {
    type: 'Site',
    options: {
      id: 'filterSiteId',
      name: 'Site',
      param: 'siteId'
    }
  }
];

const options = [
  {
    value: 'Clicked Email',
    label: 'Clicked Email'
  },
  {
    value: 'Opened Email',
    label: 'Opened Email'
  },
  {
    value: 'Received SMS',
    label: 'Received SMS'
  },
  {
    value: 'Viewed Product',
    label: 'Viewed Product'
  },
  {
    value: 'Added to Cart',
    label: 'Added to Cart'
  },
  {
    value: 'Active on Site',
    label: 'Active on Site'
  }
];

const column = [
  {
    name: 'Person',
    render: (item) => <TableCellText text={JSON.stringify(item?.person?.$email)} />
  },
  {
    name: 'Event Name',
    render: (item) => <TableCellText text={JSON.stringify(item?.event_name)} />
  },
  {
    name: 'Datetime',
    render: (item) => <TableCellText text={moment(item?.datetime).format('lll')} />
  },
  {
    name: 'Title',
    render: (item) => (
      <TableCellText
        text={
          item?.event_name === 'Added to Cart'
            ? JSON.stringify(item?.event_properties?.AddedItemProductName)
            : JSON.stringify(item?.event_properties?.Title)
        }
      />
    )
  },
  {
    name: 'SKU',
    render: (item) => <TableCellText text={JSON.stringify(item?.event_properties?.AddedItemSKU)} />
  },
  {
    name: 'Campaign Name',
    render: (item) => (
      <TableCellText text={JSON.stringify(item?.event_properties['Campaign Name'])} />
    )
  },
  {
    name: 'Check Out',
    render: (item) => (
      <div className="whitespace-pre-wrap max-w-64">
        {item?.event_properties?.ItemNames?.map((e, index) => (
          <div key={index}>
            <strong>{index + 1}</strong>. {e}
          </div>
        ))}
      </div>
    )
  },
  {
    name: 'Total Value',
    render: (item) => <TableCellBold text={JSON.stringify(item?.event_properties?.$value)} />
  }
];

const KlaviyoLogs = () => {
  const [searchParams] = useSearchParams();
  const [reset, setReset] = useState(0);
  const { filter } = buildFilter(searchParams, filters);
  const { siteId } = filter;
  const [status, setStatus] = useState([]);
  const [items, setItems] = useState([]);
  const [{ data: responseData, loading, error }, reFetch] = useAxios(
    `https://devboxgates.com/wp-json/bgx/v1/klaviyo?site_id=${filter.siteId ?? 0}`
  );
  const handleDataReload = (e) => {
    e.preventDefault();
    reFetch();
  };

  useEffect(() => {
    reFetch();
  }, [siteId]);

  function returnFilterData(items, arr) {
    const result = items.filter((item) => !arr.includes(item.event_name));
    return result;
  }

  useEffect(() => {
    if (status?.length > 0 && responseData?.data) {
      const newItems = returnFilterData(responseData.data, status);
      setItems(newItems);
    } else {
      reFetch();
    }
  }, [status]);

  useEffect(() => {
    if (responseData?.data) {
      if (status?.length > 0) {
        const newItems = returnFilterData(responseData.data, status);
        setItems(newItems);
      } else {
        setItems(responseData.data);
      }
    }
    if (error) {
      setItems([]);
      if (responseData?.data?.length > 0) {
        responseData.data = [];
      }
    }
  }, [responseData, error]);

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

  function handleEmitChange(data) {
    setStatus(data);
  }

  function handleEmitReset() {
    setStatus([]);
    setReset((state) => state + 1);
  }

  return (
    <div className="flex-auto px-0 pt-0 pb-2">
      <div className="relative mb-5 flex flex-col h-full min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <TableFilter name="Filters" items={filters} emitReset={handleEmitReset}>
          <TableFilterMultiChoice
            id={'filterExclusion'}
            name={'Exclusion'}
            param={'status'}
            value={status}
            options={options}
            reset={reset}
            emitChange={handleEmitChange}
          />
        </TableFilter>
      </div>
      <div className="relative flex flex-col min-w-0 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="p-0 overflow-x-auto table-responsive">
          <div className="dataTable-wrapper dataTable-loading no-footer sortable searchable fixed-columns">
            <div className="dataTable-top">
              <div className="dataTable-dropdown"></div>
              <div className="actions">
                <button
                  onClick={handleDataReload}
                  type="button"
                  className="inline-block px-6 py-3 font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                  Reload
                </button>
              </div>
            </div>
            <div className="dataTable-container">
              <Table column={column} items={items} />
            </div>
            <div className="dataTable-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KlaviyoLogs;
