'use client';

import { useState } from 'react';
import { 
  FaUsers, 
  FaComments, 
  FaCreditCard, 
  FaUserShield,
  FaUsersCog,
  FaUserEdit,
  FaCommentDots,
  FaChartBar 
} from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dummy statistics data
  const stats = {
    users: 1254,
    activeUsers: 487,
    messages: 3789,
    payments: 234,
    premium: 158,
    vip: 76,
    revenue: 45690
  };
  
  // Dummy recent activity data
  const recentActivity = [
    { id: 1, action: 'Ny användare registrerad', user: 'Martin Larsson', time: '10 minuter sedan' },
    { id: 2, action: 'Premium köp', user: 'Anna Lindberg', time: '25 minuter sedan' },
    { id: 3, action: 'Nytt meddelande flaggat', user: 'Olle Svensson', time: '1 timme sedan' },
    { id: 4, action: 'VIP köp', user: 'Kristina Johansson', time: '2 timmar sedan' },
    { id: 5, action: 'Användare inaktiverad', user: 'Erik Norberg', time: '3 timmar sedan' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen fixed">
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            
            <nav className="space-y-1">
              <button 
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <FaChartBar />
                <span>Översikt</span>
              </button>
              
              <Link 
                href="/admin/users"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <FaUsersCog />
                <span>Användare</span>
              </Link>
              
              <Link 
                href="/admin/profiles"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <FaUserEdit />
                <span>Profiler</span>
              </Link>
              
              <Link 
                href="/admin/messages"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <FaCommentDots />
                <span>Meddelanden</span>
              </Link>
              
              <Link 
                href="/admin/statistics"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <FaChartBar />
                <span>Statistik</span>
              </Link>
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                <FaUserShield />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Admin</h3>
                <p className="text-gray-400 text-xs">Johan Karlsson</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1">
          <header className="bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="text-gray-500 relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      3
                    </span>
                  </button>
                </div>
                
                <div className="w-px h-6 bg-gray-300"></div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                  <span className="text-gray-700 text-sm font-medium">Admin</span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Totalt antal användare</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.users}</h3>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+12%</span> senaste månaden
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-500">
                    <FaUsers className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Aktiva användare</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.activeUsers}</h3>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+5%</span> senaste veckan
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-500">
                    <FaUsers className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Meddelanden idag</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.messages}</h3>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+18%</span> vs igår
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-500">
                    <FaComments className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Intäkter (kr)</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.revenue}</h3>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+8%</span> senaste månaden
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-500">
                    <FaCreditCard className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Premium prenumerationer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">Premium</p>
                    <h4 className="text-2xl font-bold text-primary mt-2">{stats.premium}</h4>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+15%</span> vs föregående månad
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm">VIP</p>
                    <h4 className="text-2xl font-bold text-secondary mt-2">{stats.vip}</h4>
                    <p className="text-sm text-green-500 mt-2">
                      <span className="font-bold">+22%</span> vs föregående månad
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Betalningar (senaste 30 dagar)</h3>
                <div className="relative w-full h-40">
                  {/* Placeholder for chart */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-400">Betalningsstatistik grafdiagram</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Senaste aktivitet</h3>
                <button className="text-primary text-sm font-medium">Visa alla</button>
              </div>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Händelse
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Användare
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity.action}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{activity.user}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{activity.time}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 