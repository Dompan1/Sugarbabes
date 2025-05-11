'use client';

import { FaBars, FaSearch, FaBell, FaEnvelope } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const router = useRouter();

  // Dummy data för notifikationer
  const notifications = [
    { id: 1, content: 'Sofia kommenterade på ditt inlägg', time: '5 min sedan', read: false },
    { id: 2, content: 'Johan skickade en vänförfrågan', time: '1 timme sedan', read: false },
    { id: 3, content: 'Nytt meddelande från Anna', time: '3 timmar sedan', read: true }
  ];

  // Dummy data för meddelanden
  const messages = [
    { id: 1, sender: 'Anna Svensson', content: 'Hej! Hur är läget?', time: '10 min sedan', read: false, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80' },
    { id: 2, sender: 'Johan Lindberg', content: 'Har du tid att ses?', time: '1 timme sedan', read: true, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80' }
  ];

  const handleProfileClick = (path: string) => {
    router.push(path);
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              className="md:hidden mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaBars className="h-6 w-6" />
            </button>
            
            {/* Logo */}
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">SugarBabes</h1>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 justify-center px-2 lg:ml-6 lg:justify-center pt-4">
            <div className="max-w-lg w-full lg:max-w-xs">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
                  placeholder="Sök användare..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right side - Icons */}
          <div className="flex items-center">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowDropdown(false);
                }}
              >
                <FaBell className="h-6 w-6" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Notifikationer</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <Link 
                            href="/dashboard/notifications" 
                            key={notification.id}
                            className="block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150"
                            onClick={() => setShowNotifications(false)}
                          >
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-2 h-2 mt-1 rounded-full ${notification.read ? 'bg-gray-300' : 'bg-primary'}`}></div>
                              <div className="ml-3 w-full">
                                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                                  {notification.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500">Inga notifikationer än</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link 
                        href="/dashboard/notifications" 
                        className="block text-xs text-center text-primary font-medium hover:underline"
                        onClick={() => setShowNotifications(false)}
                      >
                        Visa alla notifikationer
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Messages */}
            <div className="relative">
              <button 
                className="p-2 rounded-full text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowDropdown(false);
                }}
              >
                <FaEnvelope className="h-6 w-6" />
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </button>
              
              {/* Messages Dropdown */}
              {showMessages && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900">Meddelanden</h3>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {messages.length > 0 ? (
                        messages.map(message => (
                          <Link 
                            href="/dashboard/messages" 
                            key={message.id}
                            className="block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150"
                            onClick={() => setShowMessages(false)}
                          >
                            <div className="flex items-start">
                              <img 
                                src={message.avatar}
                                alt={message.sender}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                                  <p className="text-xs text-gray-400">{message.time}</p>
                                </div>
                                <p className={`text-sm ${message.read ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {message.content}
                                </p>
                              </div>
                              {!message.read && (
                                <div className="ml-2 flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-gray-500">Inga meddelanden än</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100">
                      <Link
                        href="/dashboard/messages"
                        className="block text-xs text-center text-primary font-medium hover:underline"
                        onClick={() => setShowMessages(false)}
                      >
                        Visa alla meddelanden
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    setShowNotifications(false);
                    setShowMessages(false);
                  }}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <img
                    className="h-8 w-8 rounded-full border-2 border-primary object-cover"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Användare"
                  />
                </button>
              </div>
              
              {showDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button onClick={() => handleProfileClick('/dashboard/profile')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Din profil
                  </button>
                  <button onClick={() => handleProfileClick('/dashboard/friends')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Vänner
                  </button>
                  <button onClick={() => handleProfileClick('/dashboard/favorites')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Favoriter
                  </button>
                  <button onClick={() => handleProfileClick('/dashboard/settings')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Inställningar
                  </button>
                  <button onClick={() => handleProfileClick('/')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logga ut
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search - only visible on mobile */}
      <div className="md:hidden p-2 border-t border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
            placeholder="Sök användare..."
            type="search"
          />
        </div>
      </div>
    </nav>
  );
} 