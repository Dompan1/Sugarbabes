'use client';

import { useState, useEffect } from 'react';
import { FaImage, FaSmile, FaPaperPlane } from 'react-icons/fa';

// Definiera typer för meddelanden och profiler
interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
  seen: boolean;
}

interface Profile {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isPremium: boolean;
}

// Tomma arrays med korrekta typer
const initialMessages: Message[] = [];
const profiles: Profile[] = [];

// Placeholder för tom profil
const emptyProfile: Profile = {
  id: 0,
  name: "",
  avatar: "",
  lastMessage: "",
  lastMessageTime: "",
  unread: 0,
  isPremium: false
};

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeProfile, setActiveProfile] = useState<Profile>(emptyProfile);
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(4); // Initial message count
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // Check if user has reached the free message limit
    if (messageCount >= 5 && !activeProfile.isPremium) {
      setShowPremiumPopup(true);
      return;
    }
    
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      seen: false
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage('');
    setMessageCount(prev => prev + 1);
    
    // Simulate response after some time
    setTimeout(() => {
      const profileResponse = {
        id: messages.length + 2,
        sender: 'profile',
        text: `Det låter intressant! Berätta mer om dig själv...`,
        timestamp: new Date().toISOString(),
        seen: false
      };
      
      setMessages(prev => [...prev, profileResponse]);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-xl shadow-custom p-0 mb-6 flex flex-col h-[calc(100vh-150px)]">
      <div className="flex flex-1 h-full">
        {/* Left sidebar - Conversation list */}
        <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Meddelanden</h2>
            <div className="mt-2 relative">
              <input 
                type="text" 
                placeholder="Sök konversationer..."
                className="w-full p-2 pl-8 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg className="w-4 h-4 absolute left-2.5 top-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${activeProfile.id === profile.id ? 'bg-gray-100' : ''}`}
                onClick={() => setActiveProfile(profile)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src={profile.avatar} 
                      alt={profile.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                    />
                    {profile.unread > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {profile.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{profile.name}</h3>
                      <span className="text-xs text-gray-500">{profile.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{profile.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right side - Chat */}
        <div className="flex-1 flex flex-col h-full">
          {/* Chat header */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center">
            <img 
              src={activeProfile.avatar} 
              alt={activeProfile.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary mr-3"
            />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{activeProfile.name}</h3>
              {isTyping && <p className="text-xs text-gray-500">Skriver...</p>}
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-tl-none shadow-sm px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-primary">
                <FaImage className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-primary">
                <FaSmile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Skriv något charmigt..."
                className="flex-1 rounded-full border border-gray-300 p-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 flex items-center justify-center"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium popup */}
      {showPremiumPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Uppgradera till Premium</h3>
            <p className="text-gray-700 mb-4">
              Du har nått gränsen för gratis meddelanden (5 per dag). Uppgradera till Premium för att fortsätta konversationen med {activeProfile.name}.
            </p>
            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setShowPremiumPopup(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Avbryt
              </button>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={() => {
                  setShowPremiumPopup(false);
                  window.location.href = '/dashboard/premium';
                }}
              >
                Uppgradera nu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 