import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { topUp } from '../controllers/UserController';
import { useUser } from "@clerk/clerk-react";

export default function TopUpPage() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [fbUser, setFbUser] = useState(null)
  const { user } = useUser()


  const amounts = [
    '50.000',
    '100.000',
    '200.000',
    '500.000',
    '1.000.000'
  ];

  const paymentMethods = {
    'E-Wallet': [
      { name: 'GoPay', id: 'gopay' },
      { name: 'OVO', id: 'ovo' },
      { name: 'DANA', id: 'dana' },
      { name: 'ShopeePay', id: 'shopeepay' }
    ],
    'Transfer Bank': [
      { name: 'BCA', id: 'bca' },
      { name: 'Mandiri', id: 'mandiri' },
      { name: 'BNI', id: 'bni' },
      { name: 'BRI', id: 'bri' }
    ]
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const formatAmount = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const handleConfirm = async () => {
    const amount = selectedAmount || customAmount;

    if (amount && selectedMethod) {
        try {
            const parsedAmount = parseFloat(amount.replace(/\./g, ''));
            const adminFee = 1500;
            const totalAmount = parsedAmount + adminFee;

            const userId = user.id;

            const result = await topUp(userId, parsedAmount, selectedMethod);

            if (result.success) {
                navigate('/success', {
                    state: {
                        type: 'topup',
                        transactionData: {
                            id: result.transactionId,
                            date: new Date().toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            }),
                            amount: parsedAmount.toLocaleString('id-ID'),
                            adminFee: adminFee.toLocaleString('id-ID'),
                            total: totalAmount.toLocaleString('id-ID'),
                            status: 'success',
                        },
                    },
                });
            } else {
                console.error('Top-up failed:', result.message);
            }
        } catch (error) {
            console.error('Error during top-up:', error);
        }
    }
};

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="bg-white p-4 flex items-center border-b">
        <button className="p-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} className="text-[#1e1e1e]" />
        </button>
        <h1 className="text-xl font-medium ml-2 text-[#1e1e1e]">Isi Saldo</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <div className="mb-6">
          <p className="text-sm text-[#595959]">Saldo</p>
          <p className="text-xl font-medium text-[#1e1e1e]">{fbUser?.balance}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-[#1e1e1e] mb-3">Pilih Nominal</p>
          <div className="grid grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={`p-3 rounded-lg border text-center transition-colors
                  ${selectedAmount === amount 
                    ? 'border-[#451dcd] bg-[#451dcd] bg-opacity-10 text-[#451dcd]' 
                    : 'border-gray-200 hover:border-[#451dcd] text-[#1e1e1e]'
                  }`}
              >
                Rp {amount}
              </button>
            ))}
          </div>
          
          <div className="mt-3">
            <p className="text-sm text-[#595959] mb-2">Atau masukkan nominal</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#595959]">Rp</span>
              <input
                type="text"
                value={formatAmount(customAmount)}
                onChange={handleCustomAmountChange}
                placeholder="Masukkan nominal"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#451dcd] focus:ring-1 focus:ring-[#451dcd] text-[#1e1e1e]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-[#1e1e1e]">Pilih Metode Pembayaran</p>
          
          {Object.entries(paymentMethods).map(([category, methods]) => (
            <div key={category} className="space-y-2">
              <p className="text-xs text-[#595959]">{category}</p>
              <div className="bg-white rounded-lg border border-gray-200 divide-y">
                {methods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-3 flex items-center space-x-3 hover:bg-[#451dcd] hover:bg-opacity-5 transition-colors
                      ${selectedMethod === method.id ? 'bg-[#451dcd] bg-opacity-10' : ''}`}
                  >
                    <div className="w-8 h-8 bg-[#f8f8f8] rounded flex items-center justify-center">
                      <img 
                        src={`/api/placeholder/32/32`} 
                        alt={method.name}
                        className="w-6 h-6"
                      />
                    </div>
                    <span className="flex-1 text-left text-sm text-[#1e1e1e]">{method.name}</span>
                    {selectedMethod === method.id && (
                      <div className="w-4 h-4 rounded-full bg-[#451dcd]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className={`w-full py-3 rounded-lg mt-6 text-white font-medium transition-colors
            ${(selectedAmount || customAmount) && selectedMethod
              ? 'bg-[#451dcd] hover:bg-[#451dcd]/90'
              : 'bg-[#595959] cursor-not-allowed'}`}
          disabled={!((selectedAmount || customAmount) && selectedMethod)}
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}