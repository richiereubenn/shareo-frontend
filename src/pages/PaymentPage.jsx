import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentPage({ 
  recipientName = "Julius",
  amount = "50.000",
  balance = "100.000"
}) {
  const navigate = useNavigate();
  const [isBalanceSelected, setIsBalanceSelected] = useState(false);
  const isBalanceSufficient = parseFloat(balance.replace(/\./g, '')) >= parseFloat(amount.replace(/\./g, ''));

  const generateTransactionId = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
    return `TRX${timestamp}${random}${sequence}`;
  };

  const handlePayment = () => {
    if (isBalanceSufficient && isBalanceSelected) {
      const transactionData = {
        id: generateTransactionId(),
        date: new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        amount: amount,
        adminFee: '1.000',
        total: (parseFloat(amount.replace(/\./g, '')) + 1000).toLocaleString('id-ID'),
        status: 'success',
        recipientName: recipientName
      };
      navigate('/success', { state: { type: 'payment', transactionData } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white pt-6 pb-4 px-4 flex items-center gap-3">
        <button className="p-1" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-[#1e1e1e]" />
        </button>
        <h1 className="text-lg font-semibold text-[#1e1e1e]">Pilih Metode Transfer</h1>
      </div>

      <div className="mt-4 mx-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#451dcd] flex items-center justify-center text-white font-medium">
                {recipientName.charAt(0)}
              </div>
              <div>
                <h2 className="font-medium text-[#1e1e1e]">{recipientName}</h2>
                <p className="text-[#595959]">Rp{amount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#1e1e1e]">Metode Transfer</h2>
          <button className="text-[#451dcd] text-sm font-medium">
            Lihat Semua
          </button>
        </div>

        <button
          onClick={() => isBalanceSufficient && setIsBalanceSelected(!isBalanceSelected)}
          className={`w-full bg-white rounded-2xl p-4 shadow-sm transition-colors ${
            isBalanceSelected ? 'bg-[#451dcd] bg-opacity-5 border-2 border-[#451dcd]' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isBalanceSelected ? 'bg-[#451dcd] bg-opacity-10' : 'bg-gray-100'
              }`}>
                <svg 
                  className={`w-6 h-6 ${isBalanceSelected ? 'text-[#451dcd]' : 'text-[#595959]'}`} 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                </svg>
              </div>
              <div className='flex flex-col items-start px-2'>
                <h3 className={`font-medium leading-5 ${isBalanceSelected ? 'text-[#451dcd]' : 'text-[#1e1e1e]'}`}>
                  Saldo
                </h3>
                <p className="text-sm text-[#595959] mt-0.5">Rp{balance}</p>
                {!isBalanceSufficient && (
                  <p className="text-xs text-red-600 mt-0.5">
                    Saldo tidak cukup.
                  </p>
                )}
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isBalanceSelected 
                ? 'border-[#451dcd] bg-[#451dcd]' 
                : 'border-[#595959]'
            }`}>
              {isBalanceSelected && (
                <div className="w-3 h-3 rounded-full bg-white" />
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col px-2">
            <span className="text-[#595959] text-base">Total Transfer</span>
            <span className="text-[#1e1e1e] text-lg font-semibold">Rp{amount}</span>
          </div>
        </div>

        <button 
          onClick={handlePayment}
          className={`w-full py-3.5 rounded-lg text-white font-medium transition-colors ${
            isBalanceSufficient && isBalanceSelected
              ? 'bg-[#451dcd] hover:bg-[#451dcd]/90' 
              : 'bg-[#595959] cursor-not-allowed'
          }`}
          disabled={!isBalanceSufficient || !isBalanceSelected}
        >
          {isBalanceSufficient 
            ? 'Bayar' 
            : 'Saldo Tidak Mencukupi'}
        </button>
      </div>
    </div>
  );
}