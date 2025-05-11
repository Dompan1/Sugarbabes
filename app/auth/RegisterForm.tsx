'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../components/UserContext';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { register } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError('Vänligen fyll i alla fält');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }
    
    if (!acceptTerms) {
      setError('Du måste acceptera användarvillkoren');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await register(name, email, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('E-postadressen används redan');
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Namn
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ditt namn"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
          E-post
        </label>
        <input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="din@email.com"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
          Lösenord
        </label>
        <input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Min. 8 tecken"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Bekräfta lösenord
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ange lösenord igen"
        />
      </div>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">
            Jag accepterar <a href="#" className="text-primary hover:underline">användarvillkoren</a>
          </span>
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full bg-primary text-white py-3 rounded-lg font-medium ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
        }`}
      >
        {isLoading ? 'Registrerar...' : 'Skapa konto'}
      </button>
    </form>
  );
} 