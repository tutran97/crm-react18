import PropTypes from 'prop-types';

const STATUSES = {
  'wc-completed': {
    text: 'Completed',
    color: 'lime-500',
    icon: 'fas fa-check'
  },
  'wc-checkout-draft': {
    text: 'Checkout Draft',
    color: 'amber-500',
    icon: 'fas fa-cart-shopping'
  },
  'wc-processing': {
    text: 'Processing',
    color: 'yellow-600',
    icon: 'fas fa-forward'
  },
  'wc-pending': {
    text: 'Pending',
    color: 'amber-500',
    icon: 'fas fa-pause'
  },
  'wc-on-hold': {
    text: 'On hold',
    color: 'amber-500',
    icon: 'fas fa-pause'
  },
  'wc-failed': {
    text: 'Failed',
    color: 'red-500',
    icon: 'fas fa-ban'
  },
  'wc-refunded': {
    text: 'Refunded',
    color: 'amber-500',
    icon: 'fas fa-undo'
  },
  'wc-cancelled': {
    text: 'Cancelled',
    color: 'red-500',
    icon: 'fas fa-times'
  }
};

export const OrderStatus = ({ status }) => {
  if (!STATUSES[status]) {
    return status;
  }
  const { text, color, icon } = STATUSES[status];
  return (
    <>
      <span
        className={`active:shadow-soft-xs active:opacity-85 ease-soft-in leading-pro text-xs bg-150 bg-x-25 rounded-3.5xl p-1.2 h-6 w-6 mb-0 cursor-pointer border border-solid border-${color} bg-transparent text-center align-middle font-bold text-${color} shadow-none transition-all hover:bg-transparent hover:text-${color} hover:opacity-75 hover:shadow-none active:bg-${color} active:text-black hover:active:bg-transparent hover:active:text-${color} hover:active:opacity-75 hover:active:shadow-none mr-2 flex items-center justify-center`}>
        <i className={`text-3xs ${icon}`} aria-hidden="true" />
      </span>{' '}
      <span className="mb-0 leading-tight text-sm text-slate-800">{text}</span>
    </>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.string
};
