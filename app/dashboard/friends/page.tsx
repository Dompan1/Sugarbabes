'use client';

import { useState, useEffect } from 'react';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';

interface Friend {
  id: number;
  name: string;
  username: string;
  avatarUrl: string;
  mutualFriends: number;
  isFriend: boolean;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulerar datahämtning
    setTimeout(() => {
      setFriends([
        {
          id: 1,
          name: 'Anna Svensson',
          username: '@annasvensson',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
          mutualFriends: 12,
          isFriend: true
        },
        {
          id: 2,
          name: 'Johan Lindberg',
          username: '@johanlindberg',
          avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
          mutualFriends: 5,
          isFriend: true
        },
        {
          id: 3,
          name: 'Sofia Karlsson',
          username: '@sofiakarlsson',
          avatarUrl: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
          mutualFriends: 8,
          isFriend: true
        },
        {
          id: 4,
          name: 'Markus Nilsson',
          username: '@markusnilsson',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
          mutualFriends: 3,
          isFriend: false
        },
        {
          id: 5,
          name: 'Elsa Johansson',
          username: '@elsajohansson',
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80',
          mutualFriends: 15,
          isFriend: false
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleToggleFriend = (id: number) => {
    setFriends(friends.map(friend => 
      friend.id === id ? { ...friend, isFriend: !friend.isFriend } : friend
    ));
  };

  const filteredFriends = activeTab === 'all' 
    ? friends 
    : friends.filter(friend => friend.isFriend);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Vänner</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`mr-8 py-4 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Alla användare
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`mr-8 py-4 text-sm font-medium ${
              activeTab === 'friends'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dina vänner
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Sök efter vänner..."
          />
        </div>
      </div>

      {/* Friends List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFriends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={friend.avatarUrl}
                  alt={friend.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h2 className="text-lg font-medium text-gray-900">{friend.name}</h2>
                  <p className="text-sm text-gray-500">{friend.username}</p>
                  <p className="text-xs text-gray-400 mt-1">{friend.mutualFriends} gemensamma vänner</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleFriend(friend.id)}
                className={`flex items-center py-2 px-3 rounded-md text-sm font-medium ${
                  friend.isFriend
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-primary-light text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {friend.isFriend ? (
                  <>
                    <FaUserMinus className="mr-1" />
                    Ta bort vän
                  </>
                ) : (
                  <>
                    <FaUserPlus className="mr-1" />
                    Lägg till vän
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 