import { Outlet } from 'react-router-dom';
import SideNavBar from '../components/SideNavBar';
import TopNavBar from '../components/TopNavBar';
import { useAuthentication } from "../services/authService";
import { FaDumbbell } from 'react-icons/fa';
import { MdArticle, MdHome } from 'react-icons/md';

export default function Root() {
  const user = useAuthentication();

  const navLinks = [
    {
      name: 'Home',
      path: '',
      icon: <MdHome size={25} />
    },
    {
      name: 'Exercises',
      path: 'exercises',
      icon: <FaDumbbell size={25} />
    },
    {
      name: 'Programs',
      path: 'programs',
      icon: <MdArticle size={25} />
    },
    // {
    //   name: 'Progress',
    //   path: 'progress',
    //   icon: <FaChartLine />
    // }
  ];

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <SideNavBar navLinks={navLinks} user={user} />
      <TopNavBar navLinks={navLinks} user={user} />
      <div id="detail" className="w-full h-[calc(100%-6rem)] sm:h-full p-7 sm:p-12">
        <Outlet context={user} />
      </div>
    </div>
  );
}