'use client';

import { useState } from 'react';
import { FaStar, FaComment } from 'react-icons/fa';

interface Profile {
  id: number;
  name: string;
  avatar: string;
  age: number;
  location: string;
  interests: string[];
  isVIP?: boolean;
  isOnline?: boolean;
}

export default function RecommendedProfiles() {
  const [profiles] = useState<Profile[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Rekommenderade för dig</h2>
        <button className="text-sm text-primary hover:underline">Se alla</button>
      </div>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-custom transition-shadow">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className={`h-14 w-14 rounded-full object-cover ${profile.isVIP ? 'ring-2 ring-secondary' : ''}`}
                />
                {profile.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900">
                    {profile.name}, {profile.age}
                    {profile.isVIP && (
                      <span className="ml-1 inline-flex items-center">
                        <FaStar className="h-3 w-3 text-secondary" />
                      </span>
                    )}
                  </h3>
                </div>
                <p className="text-xs text-gray-500">{profile.location}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {profile.interests.slice(0, 2).map((interest, index) => (
                    <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {interest}
                    </span>
                  ))}
                  {profile.interests.length > 2 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{profile.interests.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <button className="flex-1 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                <FaComment className="inline mr-1 h-3 w-3" /> Chatta
              </button>
              <button className="flex-1 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Profil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Banner */}
      <div className="mt-6 bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-white text-center">
        <h3 className="text-lg font-bold">Premium-medlemskap</h3>
        <p className="text-sm mt-1 mb-3">Få obegränsad tillgång till alla VIP-profiler</p>
        <button className="w-full py-2 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Uppgradera nu
        </button>
      </div>
    </div>
  );
} 