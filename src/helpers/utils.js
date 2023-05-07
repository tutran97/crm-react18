const formatPrice = (price, currency = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(price);
};

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};

export { formatPrice, precisionRound };
