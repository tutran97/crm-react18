import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../SideBar';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useSelector } from 'react-redux';

export const LayoutDefault = () => {
  const layout = useSelector((state) => state.layout);

  return (
    <>
      <Sidebar />
      <main
        className={`${
          layout.sideBar ? 'ml-0 lg:ml-64' : null
        } ease-soft-in-out relative h-full max-h-screen rounded-xl transition-all duration-200`}>
        <Header />
        <div className="w-full px-6 py-6 mx-auto">
          <Outlet />
          <Footer />
        </div>
      </main>
    </>
  );
};
