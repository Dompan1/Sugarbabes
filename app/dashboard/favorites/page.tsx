'use client';

import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';

interface FavoritePost {
  id: number;
  author: {
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isFavorite: boolean;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulerar datahämtning
    setTimeout(() => {
      setFavorites([
        {
          id: 1,
          author: {
            name: 'Lisa Andersson',
            username: '@lisaandersson',
            avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80'
          },
          content: 'Vilken fantastisk dag på stranden! 🏖️ Njuter av sol och bad med familjen. Sommaren är verkligen här!',
          imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          likes: 234,
          comments: 42,
          timestamp: '3 tim sedan',
          isFavorite: true
        },
        {
          id: 2,
          author: {
            name: 'Erik Johansson',
            username: '@erikjohansson',
            avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80'
          },
          content: 'Äntligen klar med nya projektet! 💻 Tack till alla som hjälpte till. Nu är det dags för en välförtjänt semester.',
          likes: 189,
          comments: 28,
          timestamp: '8 tim sedan',
          isFavorite: true
        },
        {
          id: 3,
          author: {
            name: 'Sofia Karlsson',
            username: '@sofiakarlsson',
            avatarUrl: 'https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80'
          },
          content: 'Dagens tips: 5 enkla sätt att bli mer produktiv på jobbet utan att bränna ut sig. Den tredje är min favorit! #produktivitet #balans #arbetsliv',
          imageUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          likes: 321,
          comments: 56,
          timestamp: '1 dag sedan',
          isFavorite: true
        },
        {
          id: 4,
          author: {
            name: 'Johan Lindberg',
            username: '@johanlindberg',
            avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80'
          },
          content: 'Har någon testat den nya restaurangen i stan? Hörde att deras surdegspizza ska vara fantastisk! #matochvin #restaurangtips',
          likes: 98,
          comments: 34,
          timestamp: '2 dagar sedan',
          isFavorite: true
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleToggleFavorite = (id: number) => {
    setFavorites(favorites.map(post => 
      post.id === id ? { ...post, isFavorite: !post.isFavorite } : post
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dina favoriter</h1>
      
      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{favorites.length}</p>
            <p className="text-sm text-gray-500">Sparade favoriter</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">3</p>
            <p className="text-sm text-gray-500">Favoriserade användare</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">7</p>
            <p className="text-sm text-gray-500">Dagar aktiv</p>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                {/* Author Info */}
                <div className="flex items-center mb-4">
                  <img 
                    src={post.author.avatarUrl} 
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover" 
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-xs text-gray-500">{post.author.username} • {post.timestamp}</p>
                  </div>
                </div>
                
                {/* Content */}
                <p className="text-sm text-gray-800 mb-4">{post.content}</p>
                
                {/* Image (if any) */}
                {post.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt="Post image" 
                      className="w-full h-auto object-cover" 
                    />
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button className="flex items-center text-gray-500 hover:text-primary">
                      <FaComment className="mr-1" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-primary">
                      <FaShare className="mr-1" />
                      <span className="text-xs">Dela</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleToggleFavorite(post.id)}
                    className={`flex items-center ${post.isFavorite ? 'text-red-500' : 'text-gray-500'}`}
                  >
                    {post.isFavorite ? <FaHeart className="mr-1" /> : <FaRegHeart className="mr-1" />}
                    <span className="text-xs">{post.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {favorites.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FaHeart className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Inga favoriter än</h3>
              <p className="mt-1 text-sm text-gray-500">
                När du favoriserar inlägg dyker de upp här för enkel åtkomst.
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  Utforska flödet
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 