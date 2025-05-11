'use client';

import { useState } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSearch, 
  FaFilter,
  FaEye,
  FaEnvelope,
  FaUserShield
} from 'react-icons/fa';
import Link from 'next/link';

// Interface for Profile data
interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  avatar: string;
  messageCount: number;
  isActive: boolean;
  isPremium: boolean;
  createdAt: string;
  lastLogin: string;
}

export default function AdminProfiles() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  
  // Tar bort alla dummy profiler och ersätter med tom array
  const profiles: Profile[] = [];
  
  // Filter and search profiles
  const filteredProfiles = profiles.filter(profile => {
    // Apply search term filter
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply active filter if set
    const matchesActiveFilter = filterActive === null || profile.isActive === filterActive;
    
    return matchesSearch && matchesActiveFilter;
  });
  
  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowEditModal(true);
  };
  
  const handleCreateProfile = () => {
    setShowCreateModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 min-h-screen fixed">
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            
            <nav className="space-y-1">
              <Link 
                href="/admin"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
                <span>Översikt</span>
              </Link>
              
              <Link 
                href="/admin/users"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
                <span>Användare</span>
              </Link>
              
              <Link 
                href="/admin/profiles"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors bg-primary text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                </svg>
                <span>Profiler</span>
              </Link>
              
              <Link 
                href="/admin/messages"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                </svg>
                <span>Meddelanden</span>
              </Link>
              
              <Link 
                href="/admin/statistics"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
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
                <p className="text-gray-400 text-xs">admin</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="ml-64 flex-1">
          <header className="bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Hantera Profiler</h1>
              <button 
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                onClick={handleCreateProfile}
              >
                <FaPlus className="w-4 h-4" />
                <span>Skapa ny profil</span>
              </button>
            </div>
          </header>
          
          <main className="p-6">
            {/* Filters and search */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Sök profiler..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Status:</span>
                  <button 
                    className={`px-3 py-1.5 rounded-md ${filterActive === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setFilterActive(null)}
                  >
                    Alla
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md ${filterActive === true ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setFilterActive(true)}
                  >
                    Aktiva
                  </button>
                  <button 
                    className={`px-3 py-1.5 rounded-md ${filterActive === false ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setFilterActive(false)}
                  >
                    Inaktiva
                  </button>
                </div>
              </div>
            </div>
            
            {/* Profiles table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profil
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ålder / Ort
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Meddelanden
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skapad
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Åtgärder
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={profile.avatar} alt={profile.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                            {profile.isPremium && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Premium
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{profile.age} år</div>
                        <div className="text-sm text-gray-500">{profile.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.messageCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {profile.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            className="text-primary hover:text-primary-dark"
                            title="Visa profil"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-800"
                            title="Skicka meddelande"
                          >
                            <FaEnvelope className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Redigera profil"
                            onClick={() => handleEditProfile(profile)}
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            title="Ta bort profil"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      
      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Skapa ny profil</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowCreateModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Namn
                </label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ange namn"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Ålder
                  </label>
                  <input 
                    type="number" 
                    id="age" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ålder"
                    min="18"
                    max="99"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Ort
                  </label>
                  <input 
                    type="text" 
                    id="location" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ange ort"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  Profilbild URL
                </label>
                <input 
                  type="text" 
                  id="avatar" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Profilen är aktiv
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isPremium" 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isPremium" className="ml-2 block text-sm text-gray-700">
                  Premium-profil
                </label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setShowCreateModal(false)}
                >
                  Avbryt
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Skapa profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Profile Modal */}
      {showEditModal && selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Redigera profil</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Namn
                </label>
                <input 
                  type="text" 
                  id="edit-name" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue={selectedProfile.name}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-age" className="block text-sm font-medium text-gray-700 mb-1">
                    Ålder
                  </label>
                  <input 
                    type="number" 
                    id="edit-age" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    defaultValue={selectedProfile.age}
                    min="18"
                    max="99"
                  />
                </div>
                <div>
                  <label htmlFor="edit-location" className="block text-sm font-medium text-gray-700 mb-1">
                    Ort
                  </label>
                  <input 
                    type="text" 
                    id="edit-location" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    defaultValue={selectedProfile.location}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="edit-avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  Profilbild URL
                </label>
                <input 
                  type="text" 
                  id="edit-avatar" 
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  defaultValue={selectedProfile.avatar}
                />
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="edit-isActive" 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  defaultChecked={selectedProfile.isActive}
                />
                <label htmlFor="edit-isActive" className="ml-2 block text-sm text-gray-700">
                  Profilen är aktiv
                </label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="edit-isPremium" 
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  defaultChecked={selectedProfile.isPremium}
                />
                <label htmlFor="edit-isPremium" className="ml-2 block text-sm text-gray-700">
                  Premium-profil
                </label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setShowEditModal(false)}
                >
                  Avbryt
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Spara ändringar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 