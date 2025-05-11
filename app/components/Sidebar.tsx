'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHome, 
  FaUserFriends, 
  FaEnvelope, 
  FaStream, 
  FaCog, 
  FaSignOutAlt,
  FaHeart
} from 'react-icons/fa';

interface NavItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

export default function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      icon: <FaHome className="w-5 h-5" />,
      name: 'Hem',
      path: '/dashboard'
    },
    {
      icon: <FaStream className="w-5 h-5" />,
      name: 'Flöde',
      path: '/dashboard/feed'
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      name: 'Meddelanden',
      path: '/dashboard/messages'
    },
    {
      icon: <FaUserFriends className="w-5 h-5" />,
      name: 'Vänner',
      path: '/dashboard/friends'
    },
    {
      icon: <FaHeart className="w-5 h-5" />,
      name: 'Favoriter',
      path: '/dashboard/favorites'
    }
  ];

  const secondaryNavItems: NavItem[] = [
    {
      icon: <FaCog className="w-5 h-5" />,
      name: 'Inställningar',
      path: '/dashboard/settings'
    },
    {
      icon: <FaSignOutAlt className="w-5 h-5" />,
      name: 'Logga ut',
      path: '/'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-full border-2 border-primary object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Användare"
          />
          <div>
            <h2 className="text-sm font-medium text-gray-900">Erik Andersson</h2>
            <p className="text-xs text-gray-500">erik.andersson@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Huvudmeny
        </p>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === item.path 
                ? 'text-primary bg-primary-light bg-opacity-10 border-l-4 border-primary pl-2' 
                : 'text-gray-700 hover:text-primary hover:bg-gray-100'
            }`}
          >
            <span className="mr-3">
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
        
        <div className="pt-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Användarkonto
          </p>
          {secondaryNavItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === item.path 
                  ? 'text-primary bg-primary-light bg-opacity-10 border-l-4 border-primary pl-2' 
                  : 'text-gray-700 hover:text-primary hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Premium Banner */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-primary to-secondary p-3 rounded-lg text-white text-center shadow-md">
          <p className="font-semibold text-sm">Uppgradera till Premium</p>
          <p className="text-xs mt-1">Lås upp alla funktioner</p>
          <button className="mt-2 px-3 py-1 bg-white text-primary text-xs font-semibold rounded-md">
            Utforska nu
          </button>
        </div>
      </div>
    </div>
  );
} 