'use client';

import { useState } from 'react';
import { 
  FaUser, 
  FaBell, 
  FaLock, 
  FaPalette, 
  FaGlobe, 
  FaSignOutAlt, 
  FaCreditCard,
  FaTrash,
  FaSave,
  FaCheck,
  FaCamera
} from 'react-icons/fa';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [language, setLanguage] = useState('sv');

  // User profile state
  const [formData, setFormData] = useState({
    name: 'Erik Andersson',
    username: 'erikandersson',
    email: 'erik.andersson@example.com',
    bio: 'Gillar att koda, resa och lyssna på musik.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs: SettingsTab[] = [
    {
      id: 'profile',
      label: 'Profil',
      icon: <FaUser className="w-5 h-5" />
    },
    {
      id: 'notifications',
      label: 'Notifikationer',
      icon: <FaBell className="w-5 h-5" />
    },
    {
      id: 'privacy',
      label: 'Sekretess',
      icon: <FaLock className="w-5 h-5" />
    },
    {
      id: 'appearance',
      label: 'Utseende',
      icon: <FaPalette className="w-5 h-5" />
    },
    {
      id: 'language',
      label: 'Språk',
      icon: <FaGlobe className="w-5 h-5" />
    },
    {
      id: 'premium',
      label: 'Premium',
      icon: <FaCreditCard className="w-5 h-5" />
    },
    {
      id: 'account',
      label: 'Konto',
      icon: <FaSignOutAlt className="w-5 h-5" />
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Här skulle du normalt skicka uppdateringarna till din server
    alert('Inställningar sparade!');
  };

  const handleDeleteAccount = () => {
    if (confirm('Är du säker på att du vill radera ditt konto? Denna åtgärd kan inte ångras.')) {
      // Logik för att radera konto
      alert('Konto raderat! Du kommer nu att loggas ut.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inställningar</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-3 w-full text-left rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-light text-primary font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow p-6">
          {/* Profil */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profilinställningar</h2>
              
              {/* Profile Picture */}
              <div className="mb-6 flex items-center">
                <div className="relative">
                  <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-primary-light"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profilbild"
                  />
                  <button className="absolute bottom-0 right-0 bg-primary rounded-full p-2 text-white shadow-md">
                    <FaCamera size={14} />
                  </button>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{formData.name}</h3>
                  <p className="text-sm text-gray-500">@{formData.username}</p>
                  <button className="mt-2 text-sm text-primary hover:underline">Byt profilbild</button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Namn
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Användarnamn
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      E-post
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Biografi
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Kort beskrivning om dig som visas på din profil.</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Byt lösenord</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Nuvarande lösenord
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Nytt lösenord
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Bekräfta nytt lösenord
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <FaSave className="mr-2" />
                    Spara ändringar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifikationer */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Notifikationsinställningar</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">E-postnotifikationer</h3>
                    <p className="text-sm text-gray-500">Ta emot notifikationer via e-post</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`${
                      emailNotifications ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none`}
                  >
                    <span 
                      className={`${
                        emailNotifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push-notifikationer</h3>
                    <p className="text-sm text-gray-500">Ta emot push-notifikationer i webbläsaren</p>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`${
                      pushNotifications ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none`}
                  >
                    <span 
                      className={`${
                        pushNotifications ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Notifikationstyper</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        id="new-messages" 
                        type="checkbox" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                      />
                      <label htmlFor="new-messages" className="ml-3 text-sm text-gray-700">
                        Nya meddelanden
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="friend-requests" 
                        type="checkbox" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                      />
                      <label htmlFor="friend-requests" className="ml-3 text-sm text-gray-700">
                        Vänförfrågningar
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="post-likes" 
                        type="checkbox" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                      />
                      <label htmlFor="post-likes" className="ml-3 text-sm text-gray-700">
                        Gillningar på dina inlägg
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="post-comments" 
                        type="checkbox" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                      />
                      <label htmlFor="post-comments" className="ml-3 text-sm text-gray-700">
                        Kommentarer på dina inlägg
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="mentions" 
                        type="checkbox" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" 
                      />
                      <label htmlFor="mentions" className="ml-3 text-sm text-gray-700">
                        Omnämnanden (@)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2" />
                  Spara ändringar
                </button>
              </div>
            </div>
          )}

          {/* Sekretess */}
          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Sekretessinställningar</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Aktivitetsstatus</h3>
                    <p className="text-sm text-gray-500">Visa när du senast var aktiv</p>
                  </div>
                  <button 
                    onClick={() => setActivityStatus(!activityStatus)}
                    className={`${
                      activityStatus ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none`}
                  >
                    <span 
                      className={`${
                        activityStatus ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Vem kan se din profil</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Profilsynlighet
                      </label>
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Alla</option>
                        <option>Endast vänner</option>
                        <option>Privat (endast du)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Vem kan skicka vänförfrågningar
                      </label>
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Alla</option>
                        <option>Vänners vänner</option>
                        <option>Ingen</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Vem kan se dina inlägg
                      </label>
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Alla</option>
                        <option>Endast vänner</option>
                        <option>Anpassad</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Blockerade användare</h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Du har för närvarande 0 blockerade användare.
                  </p>
                  
                  <button className="text-primary hover:text-primary-dark text-sm font-medium">
                    Hantera blockerade användare
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2" />
                  Spara ändringar
                </button>
              </div>
            </div>
          )}

          {/* Utseende */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Utseendeinställningar</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mörkt läge</h3>
                    <p className="text-sm text-gray-500">Aktivera mörkt tema för appen</p>
                  </div>
                  <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`${
                      darkMode ? 'bg-primary' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none`}
                  >
                    <span 
                      className={`${
                        darkMode ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                    />
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Textinställningar</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Textstorlek
                      </label>
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Liten</option>
                        <option selected>Medium</option>
                        <option>Stor</option>
                        <option>Mycket stor</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Färgtema</h3>
                  
                  <div className="flex space-x-4">
                    <button className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-blue-500 ring-offset-2"></button>
                    <button className="w-8 h-8 rounded-full bg-purple-500"></button>
                    <button className="w-8 h-8 rounded-full bg-pink-500"></button>
                    <button className="w-8 h-8 rounded-full bg-green-500"></button>
                    <button className="w-8 h-8 rounded-full bg-yellow-500"></button>
                    <button className="w-8 h-8 rounded-full bg-red-500"></button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2" />
                  Spara ändringar
                </button>
              </div>
            </div>
          )}

          {/* Språk */}
          {activeTab === 'language' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Språkinställningar</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Välj språk
                  </label>
                  <select 
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="sv">Svenska</option>
                    <option value="en">Engelska</option>
                    <option value="fi">Finska</option>
                    <option value="no">Norska</option>
                    <option value="da">Danska</option>
                    <option value="de">Tyska</option>
                    <option value="fr">Franska</option>
                    <option value="es">Spanska</option>
                  </select>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-4">Datumformat</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        id="date-format-1" 
                        name="date-format" 
                        type="radio" 
                        defaultChecked={true}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                      />
                      <label htmlFor="date-format-1" className="ml-3 text-sm text-gray-700">
                        DD/MM/ÅÅÅÅ (31/12/2023)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="date-format-2" 
                        name="date-format" 
                        type="radio" 
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                      />
                      <label htmlFor="date-format-2" className="ml-3 text-sm text-gray-700">
                        MM/DD/ÅÅÅÅ (12/31/2023)
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        id="date-format-3" 
                        name="date-format" 
                        type="radio" 
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300" 
                      />
                      <label htmlFor="date-format-3" className="ml-3 text-sm text-gray-700">
                        ÅÅÅÅ-MM-DD (2023-12-31)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FaSave className="mr-2" />
                  Spara ändringar
                </button>
              </div>
            </div>
          )}

          {/* Premium */}
          {activeTab === 'premium' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Premium-medlemskap</h2>
              
              <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white mb-6">
                <h3 className="text-xl font-bold mb-2">Uppgradera till Premium</h3>
                <p className="mb-4">Få tillgång till exklusiva funktioner och förmåner!</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-300" />
                    Inga annonser
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-300" />
                    Prioriterad kundtjänst
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-300" />
                    Exklusiva teman och bakgrunder
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="mr-2 text-green-300" />
                    Detaljerad statistik
                  </li>
                </ul>
                <button className="bg-white text-primary font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
                  Uppgradera nu för 59 kr/mån
                </button>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Medlemskapshistorik</h3>
                <p className="text-gray-500 text-sm">
                  Du har för närvarande inget aktivt Premium-medlemskap.
                </p>
              </div>
            </div>
          )}

          {/* Konto */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Kontoinställningar</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Ladda ner dina data</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Ladda ner all information som är kopplad till ditt konto.
                  </p>
                  <button className="text-primary hover:text-primary-dark text-sm font-medium">
                    Begär nedladdning av dina data
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium mb-2 text-red-600">Radera konto</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    När du raderar ditt konto tas all din data och ditt innehåll bort permanent. Denna åtgärd kan inte ångras.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-2" />
                    Radera mitt konto
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 