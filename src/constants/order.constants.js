export const orderConstants = {
  GETALL_REQUEST: 'ORDERS_GETALL_REQUEST',
  GETALL_SUCCESS: 'ORDERS_GETALL_SUCCESS',
  GETALL_FAILURE: 'ORDERS_GETALL_FAILURE'
};

export const ORDER_STATUS = {
  all: {
    text: 'All'
  },
  'wc-completed': {
    text: 'Completed'
  },
  'wc-checkout-draft': {
    text: 'Checkout Draft'
  },
  'wc-processing': {
    text: 'Processing'
  },
  'wc-pending': {
    text: 'Pending'
  },
  'wc-on-hold': {
    text: 'On hold'
  },
  'wc-failed': {
    text: 'Failed'
  },
  'wc-refunded': {
    text: 'Refunded'
  },
  'wc-cancelled': {
    text: 'Cancelled'
  }
};
