import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import checkedIcon from '../assets/icons/checked.png';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type = 'payment', transactionData } = location.state || {};
  
  const isTopUp = type === 'topup';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="mb-10 mt-14">
          <img
            src={checkedIcon}
            alt="Success"
            className="w-24 h-24"
          />
        </div>

        <h1 className="text-xl font-semibold text-[#1e1e1e] mb-1">
          {isTopUp ? 'Top Up Berhasil!' : 'Pembayaran Berhasil!'}
        </h1>
        <p className="text-sm text-[#595959] mb-8">
          {isTopUp ? 'Berhasil mengisi saldo' : 'Berhasil melakukan pembayaran'}
        </p>

        <div className="w-full max-w-sm bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-sm font-medium text-[#1e1e1e] mb-3">
            Detail Transaksi
          </h2>

          <div className="space-y-6">
            <div className="flex justify-between">
              <span className="text-sm text-[#595959]">ID Transaksi</span>
              <span className="text-sm text-[#1e1e1e]">
                {transactionData?.id || '12345678910'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-[#595959]">Tanggal</span>
              <span className="text-sm text-[#1e1e1e]">
                {transactionData?.date || '10 May 2023'}
              </span>
            </div>

            {!isTopUp && transactionData?.recipientName && (
              <div className="flex justify-between">
                <span className="text-sm text-[#595959]">Penerima</span>
                <span className="text-sm text-[#1e1e1e]">
                  {transactionData.recipientName}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-sm text-[#595959]">
                {isTopUp ? 'Nominal' : 'Jumlah'}
              </span>
              <span className="text-sm text-[#1e1e1e]">
                Rp {transactionData?.amount || '250.000'}
              </span>
            </div>

            {!isTopUp && (
              <div className="flex justify-between">
                <span className="text-sm text-[#595959]">Biaya Admin</span>
                <span className="text-sm text-[#1e1e1e]">
                  Rp {transactionData?.adminFee || '1.000'}
                </span>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-[#1e1e1e]">Total</span>
                <span className="text-sm font-medium text-[#1e1e1e]">
                  Rp {transactionData?.total || '251.000'}
                </span>
              </div>
            </div>

            {transactionData?.status && (
              <div className="flex justify-between">
                <span className="text-sm text-[#595959]">Status</span>
                <span className="text-sm text-green-600">Berhasil</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Home Button */}
      <div className="p-6">
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-[#451dcd] text-white py-3 rounded-lg font-medium hover:bg-[#451dcd]/90 transition-colors"
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}