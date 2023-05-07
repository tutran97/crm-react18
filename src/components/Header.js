import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBarsStaggered, faBell } from '@fortawesome/free-solid-svg-icons';
import { Breadcrumb } from './Breadcrumb';
import { layoutActions } from '../actions';

export const Header = () => {
  const user = useSelector((state) => state.user);
  const layout = useSelector((state) => state?.layout);
  const dispatch = useDispatch();

  const handleToggleRightBar = (e) => {
    e.preventDefault();
    dispatch(layoutActions.toggleRightBar());
  };

  const handleToggleSideBar = (e) => {
    e.preventDefault();
    dispatch(layoutActions.toggleSideBar());
  };

  return (
    <nav className="mt-4 mb-2 bg-white relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start">
      <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
        <div onClick={handleToggleSideBar} className="hidden sm:inline w-4.5 pt-1 mr-4">
          {layout.sideBar ? (
            <FontAwesomeIcon className="cursor-pointer" icon={faBars} />
          ) : (
            <FontAwesomeIcon className="cursor-pointer" icon={faBarsStaggered} />
          )}
        </div>
        <Breadcrumb />
        <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
          <div className="flex items-center md:ml-auto md:pr-4"></div>
          <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
            <li className="flex items-center hover:scale-102">
              {user.id && (
                <Link
                  onClick={handleToggleRightBar}
                  className="block px-0 py-2 font-semibold transition-all ease-nav-brand text-sm text-slate-500">
                  <i className="fa fa-user sm:mr-1" aria-hidden="true" />
                  <span className="hidden sm:inline">{user.fullName || user.username}</span>
                </Link>
              )}
            </li>
            <li className="relative flex items-center px-4 hover:scale-102">
              <p className="hidden transform-dropdown-show"></p>
              <a
                href="#"
                className="block p-0 transition-all text-sm ease-nav-brand text-slate-500"
                aria-expanded="false">
                <FontAwesomeIcon className="cursor-pointer" icon={faBell} />
              </a>

              <ul className="text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease-soft lg:shadow-soft-3xl duration-250 min-w-44 before:sm:right-7.5 before:text-5.5 pointer-events-none absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 opacity-0 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-6 lg:absolute lg:right-0 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer">
                <li className="relative mb-2">
                  <a
                    className="ease-soft py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-700"
                    href="/">
                    <div className="flex py-1">
                      <div className="my-auto">
                        <img
                          src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/small-logos/logo-spotify.svg"
                          className="inline-flex items-center justify-center mr-4 text-white text-sm bg-gradient-to-tl from-gray-900 to-slate-800 h-9 w-9 max-w-none rounded-xl"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h6 className="mb-1 font-normal leading-normal text-sm">
                          <span className="font-semibold">New album</span> by Travis Scott
                        </h6>
                        <p className="mb-0 leading-tight text-xs text-slate-400">
                          <i className="mr-1 fa fa-clock" aria-hidden="true" />1 day
                        </p>
                      </div>
                    </div>
                  </a>
                </li>

                <li className="relative">
                  <a
                    className="ease-soft py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-700"
                    href="/">
                    <div className="flex py-1">
                      <div className="inline-flex items-center justify-center my-auto mr-4 text-white transition-all duration-200 ease-nav-brand text-sm bg-gradient-to-tl from-slate-600 to-slate-300 h-9 w-9 rounded-xl">
                        <svg
                          width="12px"
                          height="12px"
                          viewBox="0 0 43 36"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink">
                          <title>credit-card</title>
                          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g
                              transform="translate(-2169.000000, -745.000000)"
                              fill="#FFFFFF"
                              fillRule="nonzero">
                              <g transform="translate(1716.000000, 291.000000)">
                                <g transform="translate(453.000000, 454.000000)">
                                  <path
                                    className="color-background"
                                    d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z"
                                    opacity="0.593633743"></path>
                                  <path
                                    className="color-background"
                                    d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                                </g>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h6 className="mb-1 font-normal leading-normal text-sm">
                          Payment successfully completed
                        </h6>
                        <p className="mb-0 leading-tight text-xs text-slate-400">
                          <i className="mr-1 fa fa-clock" aria-hidden="true" />2 days
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </li>
            <li className="flex items-center  cursor-pointer hover:scale-102">
              <div onClick={handleToggleSideBar} className="inline sm:hidden w-4.5">
                {layout.sideBar ? (
                  <FontAwesomeIcon className="cursor-pointer" icon={faBars} />
                ) : (
                  <FontAwesomeIcon className="cursor-pointer" icon={faBarsStaggered} />
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
