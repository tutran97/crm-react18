export const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto transition-opacity ease-linear z-[1000] outline-0 block bg-black opacity-50">
      <div className="relative w-auto m-2 transition-transform duration-300 pointer-events-none sm:m-7 sm:max-w-[500px] sm:mx-auto lg:mt-48 ease-out -translate-y-13 -translate-y-[52px] transform-none">
        <div className="relative flex flex-col w-full bg-white border border-solid pointer-events-auto dark:bg-grey-950 bg-clip-padding border-black/20 rounded-xl outline-0">
          <div className="relative flex-auto p-4">
            <svg
              className="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>{' '}
            Loading
          </div>
        </div>
      </div>
    </div>
  );
};
