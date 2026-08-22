import { NavLink } from 'react-router-dom';
import { MdAccountCircle, MdLogout } from 'react-icons/md';
import { InitiateSignIn, InitiateSignOut } from '../services/authService';

export default function TopNavBar({ navLinks, user }) {
  const SignIn = () => (
    <button onClick={InitiateSignIn} className="text-black flex items-center px-6 py-4 rounded-lg hover:bg-slate-200">
      <MdAccountCircle size={25} />
    </button>
  );

  const SignOut = () => (
    <button onClick={InitiateSignOut} className="text-black flex items-center px-6 py-4 rounded-lg hover:bg-slate-200">
      <MdLogout size={25} />
    </button>
  );

  return <>
    <div id="sidebar" className="sm:hidden justify-between items-center border selection:border-b-2 bg-slate-100">
      <div className="p-4 flex justify-between text-center items-center">
        {
          navLinks.map(n => (
            <NavLink
              key={n.name}
              to={n.path}
              className={({ isActive }) =>
                isActive ? "text-white bg-blue-500 px-6 py-4 rounded-lg"
                  : "text-black px-6 py-4 rounded-lg hover:bg-slate-200"
              }
            >
              {n.icon}
            </NavLink>
          ))
        }
        {!user ? <SignIn /> : <SignOut />}
      </div>
    </div>
  </>;
}