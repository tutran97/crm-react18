import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const Modal = ({ title, subTitle, content, isShow = false, onClose }) => {
  const [showModal, setShowModal] = useState(isShow);

  useEffect(() => {
    setShowModal(isShow);
  }, [isShow]);

  const handleClose = () => {
    setShowModal(false);
    onClose && onClose();
  };

  return showModal ? (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-5/12 my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <div>
                <h3 className="text-3xl font-semibold">{title}</h3>
                {subTitle}
                {/*<div>{currentItem.product.name}</div>*/}
                {/*<div>{formatPrice(currentItem.price)}</div>*/}
              </div>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleClose}>
                <div className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  x{' '}
                </div>
              </button>
            </div>
            {content}
            {/*<Table items={currentItem.bids} column={bidListColumn} />*/}
            {/*<BidForm onSuccess={handleCloseModal} item={currentItem} />*/}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  ) : null;
};

Modal.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.element,
  content: PropTypes.element,
  onClose: PropTypes.func,
  isShow: PropTypes.bool
};
