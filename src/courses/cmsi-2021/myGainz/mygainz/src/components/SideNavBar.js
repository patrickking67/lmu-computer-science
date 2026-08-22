import { NavLink } from 'react-router-dom';
import { MdAccountCircle, MdLogout } from 'react-icons/md';
import { InitiateSignIn, InitiateSignOut } from '../services/authService';
import logo from '../logo.png';

export default function SideNavBar({ navLinks, user }) {
  const SignIn = () => (
    <button onClick={InitiateSignIn} className="flex gap-2 items-center">
      <MdAccountCircle size={25} className="fill-blue-600" />
      <h1 className="font-medium text-blue-600 text-lg">Sign In</h1>
    </button>
  );

  const SignOut = () => (
    <button onClick={InitiateSignOut} className="flex gap-2 items-center">
      <MdLogout size={25} className="fill-blue-600" />
      <h1 className="font-medium text-blue-600 text-lg">Sign Out</h1>
    </button>
  );

  return <>
    <div id="sidebar" className="hidden sm:flex pb-10 flex-col w-48 md:w-64 items-center border-r-2 bg-slate-100 h-full">
      <div className="bg-gray-100 w-full h-20 grid place-content-center border-b-2">
        <h1 className="font-bold text-3xl text-blue-600 p-8 select-none grid place-items-center"><img  src={logo} /></h1>
      </div>
      <div className="py-8 px-6 flex flex-col text-center items-center w-full gap-6">
        {
          navLinks.map(n => (
            <NavLink
              key={n.name}
              to={n.path}
              className={({ isActive }) =>
                isActive ? "text-white bg-blue-500 px-8 py-4 rounded-lg w-full"
                  : "text-black px-8 py-4 rounded-lg w-full hover:bg-slate-200"
              }
            >
              {n.name}
            </NavLink>
          ))
        }
      </div>
      <div className="mt-auto">
        {!user ? <SignIn /> : <SignOut />}
      </div>
    </div>
  </>;
}