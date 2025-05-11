'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../components/UserContext';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Vänligen fyll i alla fält');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Ogiltiga inloggningsuppgifter');
      }
    } catch (err) {
      setError('Ett fel uppstod. Försök igen senare.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Användarnamn
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Användarnamn"
        />
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Lösenord
          </label>
          <a href="#" className="text-sm text-primary hover:underline">
            Glömt lösenord?
          </a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
      </div>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Kom ihåg mig</span>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-primary text-white py-3 rounded-lg font-medium ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
        }`}
      >
        {isLoading ? 'Loggar in...' : 'Logga in'}
      </button>
      
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          För demo: Använd <span className="font-medium">admin</span> med lösenord <span className="font-medium">1422</span>
        </p>
      </div>
    </form>
  );
} 