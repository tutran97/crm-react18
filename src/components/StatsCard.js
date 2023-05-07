import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export const StatsCard = ({ cardTitle, statNumber, statPercent, icon }) => {
  return (
    <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
      <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
        <div className="flex-auto p-4">
          <div className="flex flex-row -mx-3">
            <div className="flex-none w-2/3 max-w-full px-3">
              <div>
                <p className="mb-0 font-sans font-semibold leading-normal text-sm">{cardTitle}</p>
                <h5 className="mb-0 font-bold">
                  {statNumber}
                  {statPercent ? (
                    <span className="leading-normal text-sm font-weight-bolder text-lime-500">
                      {' '}
                      +{statPercent}%
                    </span>
                  ) : (
                    ''
                  )}
                </h5>
              </div>
            </div>
            <div className="px-3 text-right basis-1/3">
              <div className="inline-block w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                <FontAwesomeIcon icon={icon} className="text-lg relative top-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  cardTitle: PropTypes.string,
  statNumber: PropTypes.string,
  statPercent: PropTypes.string,
  icon: PropTypes.any
};
