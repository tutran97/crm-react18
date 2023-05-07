import React from 'react';
import PropTypes from 'prop-types';

export const AddressDetail = ({ data, title }) => {
  return (
    <>
      <h6 className="mt-6 mb-4 dark:text-white">{title}</h6>
      <ul className="flex flex-col pl-0 mb-0 rounded-lg">
        <li className="relative flex p-6 mb-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-inherit">
          <div className="flex flex-col">
            <h6 className="mb-4 leading-normal dark:text-white text-sm">
              {data.firstName} {data.lastName}
            </h6>
            {data.company && (
              <span className="mb-2 leading-tight text-xs">
                Company Name:
                <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                  {data.company}
                </span>
              </span>
            )}
            <span className="mb-2 leading-tight text-xs">
              Address:
              <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                {data.address1}
              </span>
            </span>
            {data.address2 && (
              <span className="mb-2 leading-tight text-xs">
                {/*Address 2:*/}
                <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                  {data.address2}
                </span>
              </span>
            )}

            <span className="mb-2 leading-tight text-xs">
              {/*Address 2:*/}
              <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                {data.city}, {data.state} {data.postcode}
              </span>
            </span>
            {data.email && (
              <span className="mb-2 leading-tight text-xs">
                Email Address:
                <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                  {data.email}
                </span>
              </span>
            )}
            {data.phoneNumber && (
              <span className="leading-tight text-xs">
                Phone:
                <span className="ml-2 font-semibold text-slate-700 dark:text-white/70">
                  {data.phoneNumber}
                </span>
              </span>
            )}
          </div>
        </li>
      </ul>
    </>
  );
};

AddressDetail.propTypes = {
  title: PropTypes.string,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postcode: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    company: PropTypes.string
  })
};
