import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  faHouse,
  faFile,
  faUsers,
  faPeopleRoof,
  faSitemap,
  faBoxesPacking,
  faGear,
  faList,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Disclosure } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { RightBar } from './RightBar';
import { useSelector } from 'react-redux';

const MENU = [
  {
    title: 'Dashboard',
    icon: faHouse,
    slug: '/'
  },
  {
    title: 'Order',
    icon: faFile,
    children: [
      {
        title: 'List Order',
        slug: '/orders',
        icon: faList
      }
    ]
  },
  {
    title: 'Customers',
    icon: faUsers,
    children: [
      {
        title: 'List Customers',
        slug: '/customers',
        icon: faList
      }
    ]
  },
  {
    title: 'Users',
    icon: faPeopleRoof,
    children: [
      {
        title: 'List Users',
        slug: '/users',
        icon: faList
      }
    ]
  },
  {
    title: 'Sites',
    icon: faSitemap,
    children: [
      {
        title: 'List Sites',
        slug: '/sites',
        icon: faList
      }
    ]
  },
  {
    title: 'Suppliers',
    icon: faBoxesPacking,
    children: [
      {
        title: 'List Suppliers',
        slug: '/suppliers',
        icon: faList
      }
    ]
  },
  {
    title: 'Settings',
    icon: faGear,
    children: [
      {
        title: 'Customer Action Logs',
        slug: '/customer-action-logs'
      },
      {
        title: 'Klaviyo Logs',
        slug: '/klaviyo-logs'
      },
      {
        title: 'Roles',
        slug: '/roles'
      },
      {
        title: 'Permission',
        slug: '/permission'
      }
    ]
  }
];

const ActiveMenuItem = ({ item, open }) => (
  <>
    {item.children ? (
      <Disclosure.Button
        as="a"
        to={item.slug}
        className={`cursor-pointer ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-all after:ease-soft-in-out after:font-awesome after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 after:content-['\f107'] after:text-slate-800/50  dark:text-white dark:opacity-80  ${
          open ? 'after:rotate-180' : null
        }`}>
        <div className="stroke-none shadow-soft-sm bg-gradient-to-tl from-purple-700 to-pink-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
          <FontAwesomeIcon icon={item.icon} inverse />
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft text-slate-700">
          {item.title}
        </span>
      </Disclosure.Button>
    ) : (
      <Link
        to={item.slug}
        className="after:ease-soft-in-out after:font-awesome ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-all after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 after:rotate-180 dark:text-white dark:opacity-80 after:text-slate-800/50">
        <div className="stroke-none shadow-soft-sm bg-gradient-to-tl from-purple-700 to-pink-500 mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center fill-current p-2.5 text-center text-black">
          <FontAwesomeIcon icon={item.icon} inverse />
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft text-slate-700">
          {item.title}
        </span>
      </Link>
    )}
  </>
);

const InactiveMenuItem = ({ item, open }) => (
  <>
    {item.children ? (
      <Disclosure.Button
        as="a"
        className={`cursor-pointer ease-soft-in-out text-sm py-2.7 active xl:shadow-soft-xl my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-all after:ease-soft-in-out after:font-awesome after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 after:content-['\\f107'] after:text-slate-800/50  dark:text-white dark:opacity-80  ${
          open ? 'after:rotate-180' : null
        }`}
        to={item.slug}>
        <div className=" shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5">
          <FontAwesomeIcon icon={item.icon} />
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">
          {item.title}
        </span>
      </Disclosure.Button>
    ) : (
      <Link
        className="ease-soft-in-out text-sm py-2.7 active after:ease-soft-in-out after:font-awesome my-0 mx-4 flex items-center whitespace-nowrap px-4 font-medium text-slate-500 shadow-none transition-colors after:ml-auto after:inline-block after:font-bold after:antialiased after:transition-all after:duration-200 dark:text-white dark:opacity-80  after:text-slate-800 dark:after:text-white"
        to={item.slug}>
        <div className="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5">
          <FontAwesomeIcon icon={item.icon} />
        </div>
        <span className="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">
          {item.title}
        </span>
      </Link>
    )}
  </>
);

const InactiveMenuChild = ({ item }) => (
  <li className="w-full">
    <Link
      className="ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm relative my-0 mr-4 flex items-center whitespace-nowrap bg-transparent pr-4 font-medium text-slate-800/50 shadow-none transition-colors  dark:text-white dark:opacity-60"
      to={item.slug}>
      <div className="mr-[22px]">
        <FontAwesomeIcon icon={item.icon ? item.icon : faCircleInfo} />
      </div>
      <span className="transition-all duration-100 pointer-events-none ease-soft">
        {item.title}
      </span>
    </Link>
  </li>
);

const ActiveMenuChild = ({ item }) => (
  <li className="w-full">
    <Link
      className=" ease-soft-in-out py-1.6 ml-5.4 pl-4 text-sm relative my-0 mr-4 flex items-center whitespace-nowrap rounded-lg bg-transparent pr-4 font-semibold text-slate-800 shadow-none transition-colors dark:text-white dark:opacity-100 "
      to={item.slug}>
      <div className="mr-[22px]">
        <FontAwesomeIcon icon={item.icon ? item.icon : faCircleInfo} />
      </div>
      <span className="transition-all duration-100 pointer-events-none ease-soft">
        {item.title}
      </span>
    </Link>
  </li>
);

export const Sidebar = () => {
  const layout = useSelector((state) => state?.layout);
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs();
  const paths = breadcrumbs.map((breadcrumb) => breadcrumb.key);
  return (
    <>
      <aside
        className={`${
          layout.sideBar ? 'translate-x-0' : '-translate-x-full'
        }  max-w-62.5 ease-nav-brand z-990 fixed inset-y-0 my-4 block w-full  flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0`}>
        <div className="h-19.5">
          <i
            className="absolute top-0 right-0 hidden p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 xl:hidden"
            aria-hidden="true"
          />
          <Link className="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700" to="/">
            <img
              src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/logo-ct.png"
              className="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8"
              alt="main_logo"
            />
            <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">
              BoxGates CRM
            </span>
          </Link>
        </div>
        <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        <div className="items-center block w-auto max-h-screen overflow-auto grow basis-full">
          <ul className="flex flex-col pl-0 mb-0">
            {MENU.map((item) => (
              <li key={item.title} className="mt-0.5 w-full">
                <Disclosure
                  defaultOpen={
                    item.slug === location.pathname ||
                    item?.children?.find((child) => paths.includes(child.slug))
                  }>
                  {({ open }) => (
                    <>
                      {item.slug === location.pathname ||
                      item?.children?.find((child) => paths.includes(child.slug)) ? (
                        <ActiveMenuItem item={item} open={open} />
                      ) : (
                        <InactiveMenuItem item={item} open={open} />
                      )}
                      {item.children && (
                        <Disclosure.Panel
                          as="div"
                          className="h-auto overflow-hidden transition-all duration-200 ease-soft-in-out"
                          id="dashboardsExamples">
                          <ul className="flex flex-wrap pl-4 mb-0 ml-2 list-none transition-all duration-200 ease-soft-in-out">
                            {item.children.map((child) =>
                              paths.includes(child.slug) ? (
                                <ActiveMenuChild key={child.title} item={child} />
                              ) : (
                                <InactiveMenuChild key={child.title} item={child} />
                              )
                            )}
                          </ul>
                        </Disclosure.Panel>
                      )}
                    </>
                  )}
                </Disclosure>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <RightBar />
    </>
  );
};
ActiveMenuItem.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string,
    icon: PropTypes.any,
    title: PropTypes.string,
    children: PropTypes.array
  }),
  open: PropTypes.bool
};
InactiveMenuItem.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string,
    icon: PropTypes.any,
    title: PropTypes.string,
    children: PropTypes.array
  }),
  open: PropTypes.bool
};
InactiveMenuChild.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string,
    icon: PropTypes.any,
    title: PropTypes.string
  })
};
ActiveMenuChild.propTypes = {
  item: PropTypes.shape({
    slug: PropTypes.string,
    icon: PropTypes.any,
    title: PropTypes.string
  })
};
