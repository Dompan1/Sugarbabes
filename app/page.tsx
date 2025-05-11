'use client';

import { useState } from 'react';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <main className="min-h-screen gradient-bg flex flex-col md:flex-row items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-custom">
        {/* Branding/Left side */}
        <div className="w-full md:w-1/2 bg-primary p-8 md:p-12 text-white flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">SugarBabes</h1>
          <p className="text-xl md:text-2xl mb-8">Möt henne som får dig att glömma alla andra</p>
          <div className="hidden md:block">
            <p className="mb-4">✓ Exklusivt urval av profiler</p>
            <p className="mb-4">✓ Personlig matchning</p>
            <p className="mb-4">✓ Säkra och diskreta samtal</p>
          </div>
        </div>

        {/* Login/Register Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-12">
          <div className="mb-6 flex rounded-lg overflow-hidden">
            <button 
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-3 font-medium ${activeTab === 'login' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Logga in
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`w-1/2 py-3 font-medium ${activeTab === 'register' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Registrera
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </main>
  );
} 