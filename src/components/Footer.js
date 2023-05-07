export const Footer = () => {
  return (
    <footer className="pt-4">
      <div className="w-full px-6 mx-auto">
        <div className="flex flex-wrap items-center -mx-3 lg:justify-between">
          <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
            <div className="leading-normal text-center text-sm text-slate-500 lg:text-left">
              © 2022, made with <i className="fa fa-heart" aria-hidden="true" /> by{' '}
              <a href="#qwez" className="font-semibold text-slate-700" target="_blank">
                BoxGates
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
