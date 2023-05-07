import { NavLink } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

export const Breadcrumb = () => {
  const breadcrumbs = useBreadcrumbs();
  const styleFirst = 'leading-normal text-sm breadcrumb-item hover:text-gray-700';
  const styleNext =
    "text-sm pl-2 leading-normal hover:text-gray-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']";
  const styleLast =
    "text-sm pl-2 capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/'] dark:text-white dark:before:text-white";
  return (
    <nav>
      <ol className="flex flex-wrap pt-1 mr-12 cursor-pointer bg-transparent rounded-lg sm:mr-16">
        {breadcrumbs.map(({ match, breadcrumb }, index) => (
          <NavLink
            key={match.pathname}
            to={match.pathname}
            className={
              !index ? styleFirst : index < breadcrumbs.length - 1 ? styleNext : styleLast
            }>
            {breadcrumb}
          </NavLink>
        ))}
      </ol>
    </nav>
  );
};
