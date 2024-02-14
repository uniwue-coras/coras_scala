import { ReactElement } from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';

export function App(): ReactElement {
  return (
    <div className="flex flex-row h-screen">
      <aside className="h-screen bg-slate-600">
        <NavBar />
      </aside>
      <div className="h-screen flex-grow overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
}
