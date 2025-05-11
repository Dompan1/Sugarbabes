'use client';

import { useState } from 'react';
import { FaCheck, FaCrown, FaLock, FaRegCreditCard, FaPaypal } from 'react-icons/fa';

type PlanType = 'premium' | 'vip';
type BillingCycle = 'monthly' | 'yearly';

export default function Premium() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('premium');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [paymentStep, setPaymentStep] = useState(1);
  
  // Calculate prices
  const prices = {
    premium: {
      monthly: 149,
      yearly: 999
    },
    vip: {
      monthly: 299,
      yearly: 1999
    }
  };
  
  // Calculate savings for yearly plans
  const premiumSavings = Math.round(100 - (prices.premium.yearly / (prices.premium.monthly * 12)) * 100);
  const vipSavings = Math.round(100 - (prices.vip.yearly / (prices.vip.monthly * 12)) * 100);
  
  // Features for each plan
  const features = {
    premium: [
      'Obegränsade meddelanden',
      'Tillgång till alla profiler',
      'Prioriterad support',
      'Inga annonser',
      'Diskretion garanterad'
    ],
    vip: [
      'Alla Premium-fördelar',
      'Profilboost i sökresultat',
      'Exklusiv VIP-märkning',
      'Privatflöde med VIP-profiler',
      'Prioriterad matchmaking',
      'Personlig assistent 24/7'
    ]
  };

  const handleNextStep = () => {
    setPaymentStep(2);
  };
  
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Uppgradera din upplevelse</h1>
        <p className="mt-3 text-lg text-gray-600">
          Lås upp alla funktioner och få tillgång till exklusiva profiler
        </p>
      </div>
      
      {paymentStep === 1 ? (
        <>
          {/* Billing toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-md inline-flex">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  billingCycle === 'monthly' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Månadsvis
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium flex items-center ${
                  billingCycle === 'yearly' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Årsvis <span className="ml-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Spara {selectedPlan === 'premium' ? premiumSavings : vipSavings}%</span>
              </button>
            </div>
          </div>
          
          {/* Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Premium plan */}
            <div 
              className={`bg-white rounded-xl overflow-hidden shadow-lg transition-transform transform ${selectedPlan === 'premium' ? 'ring-2 ring-primary scale-105' : 'hover:scale-105'}`}
              onClick={() => setSelectedPlan('premium')}
            >
              <div className="p-6 bg-gradient-to-r from-primary-dark to-primary text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Premium</h2>
                  <FaCrown className="w-6 h-6" />
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{prices.premium[billingCycle]} kr</span>
                  <span className="text-sm opacity-80">/{billingCycle === 'monthly' ? 'månad' : 'år'}</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {features.premium.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheck className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`mt-6 w-full py-3 rounded-lg transition-colors ${
                    selectedPlan === 'premium'
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlan('premium')}
                >
                  {selectedPlan === 'premium' ? 'Vald plan' : 'Välj plan'}
                </button>
              </div>
            </div>
            
            {/* VIP plan */}
            <div 
              className={`bg-white rounded-xl overflow-hidden shadow-lg transition-transform transform ${selectedPlan === 'vip' ? 'ring-2 ring-secondary scale-105' : 'hover:scale-105'}`}
              onClick={() => setSelectedPlan('vip')}
            >
              <div className="p-6 bg-gradient-to-r from-secondary-dark to-secondary text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">VIP</h2>
                  <div className="bg-white bg-opacity-20 rounded-md px-2 py-1 text-xs font-semibold">
                    EXKLUSIVT
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{prices.vip[billingCycle]} kr</span>
                  <span className="text-sm opacity-80">/{billingCycle === 'monthly' ? 'månad' : 'år'}</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {features.vip.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheck className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`mt-6 w-full py-3 rounded-lg transition-colors ${
                    selectedPlan === 'vip'
                      ? 'bg-secondary text-white hover:bg-secondary-dark'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlan('vip')}
                >
                  {selectedPlan === 'vip' ? 'Vald plan' : 'Välj plan'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Continue button */}
          <div className="mt-10 text-center">
            <button 
              onClick={handleNextStep}
              className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              Fortsätt till betalning
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Payment information */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Betalningsinformation</h2>
              <p className="text-gray-600 mt-1">
                Säker betalning via krypterad anslutning
              </p>
            </div>
            
            <div className="p-6">
              {/* Order summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Din order</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    {selectedPlan === 'premium' ? 'Premium' : 'VIP'} ({billingCycle === 'monthly' ? 'Månadsvis' : 'Årsvis'})
                  </span>
                  <span className="font-medium">
                    {selectedPlan === 'premium' 
                      ? prices.premium[billingCycle] 
                      : prices.vip[billingCycle]} kr
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium">Totalt</span>
                  <span className="font-bold text-primary">
                    {selectedPlan === 'premium' 
                      ? prices.premium[billingCycle] 
                      : prices.vip[billingCycle]} kr
                  </span>
                </div>
              </div>
              
              {/* Payment methods */}
              <h3 className="font-medium text-gray-900 mb-4">Välj betalningsmetod</h3>
              <div className="space-y-3 mb-6">
                <div className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer hover:border-primary">
                  <input 
                    type="radio" 
                    id="card" 
                    name="payment" 
                    className="mr-3" 
                    defaultChecked 
                  />
                  <label htmlFor="card" className="flex items-center flex-1 cursor-pointer">
                    <FaRegCreditCard className="w-5 h-5 text-gray-600 mr-2" />
                    <span>Kredit/Betalkort</span>
                  </label>
                </div>
                
                <div className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer hover:border-primary">
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="payment" 
                    className="mr-3" 
                  />
                  <label htmlFor="paypal" className="flex items-center flex-1 cursor-pointer">
                    <FaPaypal className="w-5 h-5 text-blue-600 mr-2" />
                    <span>PayPal</span>
                  </label>
                </div>
                
                <div className="border border-gray-300 rounded-lg p-4 flex items-center cursor-pointer hover:border-primary">
                  <input 
                    type="radio" 
                    id="swish" 
                    name="payment" 
                    className="mr-3" 
                  />
                  <label htmlFor="swish" className="flex items-center flex-1 cursor-pointer">
                    <span className="text-lg font-bold text-blue-500 mr-2">S</span>
                    <span>Swish</span>
                  </label>
                </div>
              </div>
              
              {/* Credit card form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Kortnummer
                  </label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Utgångsdatum
                    </label>
                    <input 
                      type="text" 
                      id="expiryDate" 
                      placeholder="MM/ÅÅ" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input 
                      type="text" 
                      id="cvc" 
                      placeholder="123" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                    Kortinnehavarens namn
                  </label>
                  <input 
                    type="text" 
                    id="cardName" 
                    placeholder="Förnamn Efternamn" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <button 
                  className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Slutför köp
                </button>
                
                <button 
                  onClick={() => setPaymentStep(1)}
                  className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tillbaka
                </button>
                
                <p className="text-xs text-gray-500 text-center flex justify-center items-center">
                  <FaLock className="w-3 h-3 mr-1" /> Säker betalning via 256-bit SSL kryptering
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 