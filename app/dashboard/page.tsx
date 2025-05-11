'use client';

export default function Dashboard() {
  return (
    <div className="bg-white rounded-xl shadow-custom p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Välkommen tillbaka!</h1>
      <p className="text-gray-700 mb-4">
        Här är din SugarBabes dashboard. Kolla in dina senaste meddelanden eller utforska nya matchningar.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-primary bg-opacity-10 rounded-lg p-4 flex items-center">
          <div className="bg-primary rounded-full w-12 h-12 flex items-center justify-center text-white mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Nya meddelanden</h3>
            <p className="text-gray-700">Kolla in dina nya matchningar och meddelanden</p>
          </div>
        </div>
        <div className="bg-secondary bg-opacity-10 rounded-lg p-4 flex items-center">
          <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center text-white mr-4">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814l-4.419-4.419-4.419 4.419A1 1 0 014 16V4zm5 0a1 1 0 00-1 1v6.586l.293-.293a1 1 0 011.414 0l.293.293V5a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Gå till flödet</h3>
            <p className="text-gray-700">Se de senaste inläggen från andra användare</p>
          </div>
        </div>
      </div>
    </div>
  );
} 