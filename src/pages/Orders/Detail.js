import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import useAxios from 'axios-hooks';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';

import { formatPrice, precisionRound } from '../../helpers/utils';

import { Table } from '../../components';
import { TableCellBold, TableCellText } from '../../components/Table/Cell';
import { AddressDetail } from '../../components/AddressDetail';
import { Modal } from '../../components/Modal';
import * as Yup from 'yup';

const MySwal = withReactContent(Swal);

const orderProductFragment = `
quantity,
subtotal,
subtotalTax,
total,
totalTax,
price,
product {
    id,
    name,
    image,
    price,
    sku
},
bidStatus
supplierBidId,
supplierPrice,
supplierId,
supplier {                    
  name
},
bidAt,
bids {
  id,
  supplierId,
  supplier {
    name
  },
  supplierPrice
}`;

const DetailForm = ({ data = {} }) => {
  const noteSchema = Yup.object().shape({
    noteText: Yup.string().required('Please enter a note !')
  });

  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(data.notes);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [errors, setErrors] = useState(null);
  const [{ data: newData, loading }, exec] = useAxios(
    {},
    {
      manual: true
    }
  );

  const [{ data: orderProductData, loading: loadingBid }, execBid] = useAxios(
    {},
    {
      manual: true
    }
  );

  useEffect(() => {
    if (newData?.data?.addOrderNote?.notes) {
      setNotes(newData?.data?.addOrderNote?.notes);
    }
  }, [newData]);

  useEffect(() => {
    if (loading || loadingBid) {
      void MySwal.fire({
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading(null);
        }
      });
    } else {
      MySwal.close();
    }
  }, [loading, loadingBid]);

  console.log(orderProductData);
  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await noteSchema.validate({ noteText });
      await exec({
        method: 'post',
        data: {
          query: `mutation ($input: CreateOrdersNoteInput!){
            addOrderNote(createOrdersNoteInput: $input) {
                notes {
                  id,
                  user {
                    username
                  },
                  content,
                  createdAt
                }
            }
        }`,
          variables: {
            input: {
              orderId: data.id,
              content: noteText
            }
          }
        }
      });
      console.log('succ');
      setNoteText('');
      setErrors(null);
    } catch (err) {
      setErrors(err.errors[0]);
    }
  };

  const handleShowModal = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectBid = async (item) => {
    await execBid({
      method: 'post',
      data: {
        query: `mutation ($orderId : Int!, $productId : Int!, $supplierBidId : Int!){
            selectBid(orderId: $orderId,productId: $productId,supplierBidId: $supplierBidId) {
              ${orderProductFragment}
            }
        }`,
        variables: {
          orderId: data.id,
          productId: currentItem.product.id,
          supplierBidId: item.id
        }
      }
    });
  };

  const column = [
    {
      name: '',
      render: (item) => (
        <img
          className="mr-4 w-28 h-28 text-base ease-soft-in-out inline-flex items-center justify-center rounded-xl text-white transition-all duration-200"
          src={item.product.image}
          alt={item.product.name}
        />
      )
    },
    {
      name: 'Item',
      render: (item) => (
        <>
          <h6 className="w-full mt-2 mb-0 dark:text-white text-lg">{item.product.name}</h6>
          <div className="leading-normal text-sm">SKU: {item.product.sku}</div>
          <div className="leading-normal text-sm">Variation ID: {item.variation_id}</div>
          {item.meta_data && (
            <div
              key={`meta_data_${item.meta_data.id}_${item.meta_data.value}`}
              className="leading-normal text-sm">
              {item.meta_data.key}: {item.meta_data.display_value}
            </div>
          )}
          {item.supplierBidId && (
            <>
              <div className="leading-normal text-sm text-red-500">
                Supplier: {item.supplier.name}
              </div>
              <div className="leading-normal text-sm text-red-500">
                Supplier Price: {formatPrice(item.supplierPrice)}
              </div>
            </>
          )}
        </>
      )
    },
    {
      name: 'Cost',
      render: (item) => <TableCellText text={`${formatPrice(item.subtotal)}`} />
    },
    {
      name: 'Qty',
      render: (item) => <TableCellText text={item.quantity} />
    },
    {
      name: 'Bids',
      render: (item) => (
        <Link
          onClick={() => handleShowModal(item)}
          className="inline-block px-8 py-2 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs hover:scale-102 active:shadow-soft-xs tracking-tight-soft border-fuchsia-500 text-fuchsia-500 hover:border-fuchsia-500 hover:bg-transparent hover:text-fuchsia-500 hover:opacity-75 hover:shadow-none active:bg-fuchsia-500 active:text-white active:hover:bg-transparent active:hover:text-fuchsia-500">
          {item?.bids?.length || 0}
        </Link>
      )
    },
    {
      name: 'Total',
      render: (item) => (
        <div className="w-24">
          <TableCellBold text={`${formatPrice(item.total)}`} />
          {item.subtotal - item.total > 0 && (
            <TableCellText
              text={`${formatPrice(precisionRound(item.subtotal - item.total, 2))} discount`}
            />
          )}
        </div>
      )
    }
  ];

  const bidListColumn = [
    {
      name: 'ID',
      render: (item) => <TableCellText text={item.id} />
    },
    {
      name: 'Supplier',
      render: (item) => <TableCellBold text={item.supplier.name} />
    },
    {
      name: 'Supplier Price',
      render: (item) => <TableCellBold text={formatPrice(item.supplierPrice)} />
    },
    {
      name: '',
      render: (item) => (
        <Link
          onClick={() => handleSelectBid(item)}
          className="inline-block px-8 py-2 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs hover:scale-102 active:shadow-soft-xs tracking-tight-soft border-fuchsia-500 text-fuchsia-500 hover:border-fuchsia-500 hover:bg-transparent hover:text-fuchsia-500 hover:opacity-75 hover:shadow-none active:bg-fuchsia-500 active:text-white active:hover:bg-transparent active:hover:text-fuchsia-500">
          Select
        </Link>
      )
    }
  ];
  return (
    <>
      <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 dark:bg-gray-950 dark:shadow-soft-dark-xl shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-4 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <h6 className="dark:text-white">Order Details</h6>
              <p className="mb-0 leading-normal text-sm">
                Order no.
                <b>#{data.originalOrderId}</b> paid on{' '}
                <b>{data.paidAt && moment(data.paidAt).format('lll')}</b>
              </p>
              <p className="mb-0 leading-normal text-sm">Site: {data.site.name}</p>
              <p className="mb-0 leading-normal text-sm">
                Customer IP: <b>{data.customerIpAddress}</b>
              </p>
              <p className="leading-normal text-sm">
                Customer Email: <b>{data.email}</b>
              </p>
            </div>
            {/*<a*/}
            {/*  href="#"*/}
            {/*  className="inline-block px-6 py-3 mb-0 ml-auto font-bold text-center text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs bg-gradient-to-tl from-slate-600 to-slate-300 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">*/}
            {/*  Invoice*/}
            {/*</a>*/}
          </div>
        </div>
        <div className="flex-auto p-4 pt-0">
          <hr className="h-px mt-0 mb-6 bg-gradient-to-r from-transparent via-black/40 to-transparent" />
          <Table column={column} items={data.ordersProducts} />
          <hr className="h-px mt-0 mb-6 bg-gradient-to-r from-transparent via-black/40 to-transparent" />
          <div className="flex flex-wrap -mx-3">
            <div className="w-full max-w-full px-3 lg:w-4/12 flex-0 md:w-6/12">
              <h6 className="mb-4 dark:text-white">Payment details</h6>
              <div className="relative flex flex-row items-center flex-auto min-w-0 p-6 break-words bg-transparent border border-solid shadow-none rounded-xl border-slate-100 bg-clip-border dark:border-slate-700">
                {/*<img*/}
                {/*  className="mb-0 mr-4 w-1/10"*/}
                {/*  src="../../../assets/img/logos/mastercard.png"*/}
                {/*  alt="logo"*/}
                {/*/>*/}
                <h6 className="mb-0 dark:text-white">
                  {data.paymentMethodTitle}
                  {/*****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;****&nbsp;&nbsp;&nbsp;7852*/}
                </h6>
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="active:shadow-soft-xs active:opacity-85 ease-soft-in leading-pro text-xs bg-150 bg-x-25 rounded-3.5xl p-1.2 h-6 w-6 mb-0 ml-auto flex cursor-pointer items-center justify-center border border-solid border-slate-400 bg-transparent text-center align-middle font-bold text-slate-400 shadow-none transition-all hover:bg-transparent hover:text-slate-400 hover:opacity-75 hover:shadow-none active:bg-slate-400 active:text-black hover:active:bg-transparent hover:active:text-slate-400 hover:active:opacity-75 hover:active:shadow-none">*/}
                {/*  <i className="fas fa-info text-3xs" aria-hidden="true" />*/}
                {/*</button>*/}
              </div>
              <AddressDetail title="Billing Information" data={data.billingOrderAddress} />
              <AddressDetail title="Shipping Information" data={data.shippingOrderAddress} />
            </div>
            <div className="w-full max-w-full px-3 flex-0 md:w-6/12 lg:w-4/12">
              <h6 className="mb-4 dark:text-white">Order Summary</h6>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Items Subtotal:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  {formatPrice(data.ordersProducts.reduce((acc, cur) => acc + cur.subtotal, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Coupon(s):</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  -{formatPrice(data.discountTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Shipping:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  {formatPrice(data.shippingTotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Order Total:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  {formatPrice(data.total)}
                </span>
              </div>
              <div className="flex justify-between mt-6">
                <span className="mb-2 text-lg">Paid:</span>
                <span className="ml-2 font-semibold text-lg text-slate-700 dark:text-white">
                  {formatPrice(data.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">
                  {data.paidAt && moment(data.paidAt).format('lll')} via {data.paymentMethodTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Stripe Fee:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  ${data.paymentFee}
                </span>
              </div>
              {/* <div className="flex justify-between">
                <span className="mb-2 leading-normal text-sm">Stripe Payout:</span>
                <span className="ml-2 font-semibold text-slate-700 dark:text-white">
                  ${data.cs_stripe_payout}
                </span>
              </div> */}
            </div>
            <div className="w-full max-w-full px-3 ml-auto lg:w-3/12 flex-0">
              <h6 className="mb-4 dark:text-white">Order notes</h6>
              <div className="relative before:left-4 before:-ml-px before:content-[''] before:absolute before:top-0 before:h-full before:border-r-2 before:border-solid before:border-r-slate-100 ">
                {notes && notes.length ? (
                  notes.map(({ id, content, user, createdAt }) => (
                    <div key={`comment_${id}`} className="relative mb-4">
                      <span className="left-4 absolute inline-flex items-center justify-center w-6.5 h-6.5 rounded-circle bg-white text-center -translate-x-1/2 text-base font-semibold z-1">
                        <i className="fas fa-comment text-lg" />
                      </span>
                      <div className="ml-12 pt-1.4 relative -top-1.5 w-auto lg:max-w-120">
                        <h6 className="mb-0 font-semibold leading-normal dark:text-white text-sm text-slate-700">
                          {user.username}: {content}
                        </h6>
                        <p className="mt-1 mb-0 font-semibold leading-tight text-xs text-slate-400">
                          {moment(createdAt).format('lll')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}
              </div>
              <div>
                <textarea
                  id="noteText"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="focus:shadow-soft-primary-outline dark:bg-gray-950 dark:placeholder:text-white/80 dark:text-white/80 min-h-unset text-sm leading-5.6 ease-soft block h-auto w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
                />
                {errors && <div className="text-red-500 text-xs">{errors}</div>}
                <button
                  onClick={handleAddNote}
                  className="mt-5 inline-block px-6 py-3 mb-0 ml-auto font-bold text-right text-white uppercase align-middle transition-all border-0 rounded-lg cursor-pointer hover:scale-102 active:opacity-85 hover:shadow-soft-xs dark:bg-gradient-to-tl dark:from-slate-850 dark:to-gray-850 bg-gradient-to-tl from-gray-900 to-slate-800 leading-pro text-xs ease-soft-in tracking-tight-soft shadow-soft-md bg-150 bg-x-25">
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Bids"
        subTitle={
          <>
            <div>{currentItem?.product?.name}</div>
            <div>{formatPrice(currentItem?.price)}</div>
          </>
        }
        isShow={showModal}
        onClose={handleCloseModal}
        content={<Table items={currentItem?.bids} column={bidListColumn} />}
      />
    </>
  );
};

const OrderDetail = () => {
  const { orderId } = useParams();

  // TODO : create lib call api
  const [{ data, loading }] = useAxios({
    method: 'post',
    data: {
      query: `query ($id: Int!) {
          order(id: $id) {
              id,
              status,
              site {
                  name
              },
              billingOrderAddress {                                           
                  address1,
                  address2,
                  company,
                  city,
                  state,
                  country,
                  postcode
                  phoneNumber,
                  firstName,
                  lastName
              },
              shippingOrderAddress {                                
                  address1,
                  address2,
                  company,
                  city,
                  state,
                  country,
                  postcode
                  phoneNumber,
                  firstName,
                  lastName
              }, 
              ordersProducts {
                  ${orderProductFragment}
              },
              notes {
                id,
                user {
                  username
                },
                content,
                createdAt
              },
              total,
              totalTax,
              discountTotal,
              discountTax,
              shippingTotal,
              shippingTax,
              originalOrderId,
              customerIpAddress,
              paymentMethodTitle,
              paidAt,
              paymentFee,
              createdAt,
              total,
              email
          }
      }`,
      variables: {
        id: parseInt(orderId)
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
    <div className="flex flex-wrap -mx-3">
      <div className="w-full max-w-full px-3 mx-auto lg:flex-0 shrink-0">
        {data && <DetailForm data={data?.data?.order} />}
      </div>
    </div>
  );
};

DetailForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    paymentMethodTitle: PropTypes.string,
    paidAt: PropTypes.string,
    paymentFee: PropTypes.number,
    customerIpAddress: PropTypes.string,
    total: PropTypes.number,
    totalTax: PropTypes.number,
    discountTotal: PropTypes.number,
    discountTax: PropTypes.number,
    shippingTax: PropTypes.number,
    shippingTotal: PropTypes.number,
    status: PropTypes.string,
    billingOrderAddress: PropTypes.object,
    shippingOrderAddress: PropTypes.object,
    ordersProducts: PropTypes.arrayOf(
      PropTypes.shape({
        quantity: PropTypes.number,
        subtotal: PropTypes.number,
        subtotalTax: PropTypes.number,
        total: PropTypes.number,
        totalTax: PropTypes.number,
        product: PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          sku: PropTypes.string,
          image: PropTypes.string,
          price: PropTypes.number
        })
      })
    ),
    notes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        content: PropTypes.string,
        createAt: PropTypes.string,
        user: PropTypes.shape({
          username: PropTypes.string
        })
      })
    )
  })
};

export default OrderDetail;
