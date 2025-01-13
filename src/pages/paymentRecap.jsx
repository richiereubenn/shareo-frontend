import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentRecap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [summary, setSummary] = useState({
        paid: 0,
        unpaid: 0,
        unpaidTotal: 0
    });
    const [scanDate, setScanDate] = useState('');

    useEffect(() => {
        if (location.state) {
            const { payments = [], scanDate = '' } = location.state;
            setPayments(payments);
            setScanDate(scanDate);
            calculateSummary(payments);
        }
    }, [location.state]);

    const calculateSummary = (payments) => {
        let paidCount = 0;
        let unpaidCount = 0;
        let unpaidTotal = 0;

        payments.forEach((payment) => {
            if (payment.status === 'Paid') {
                paidCount++;
            } else {
                unpaidCount++;
                unpaidTotal += payment.total || 0;
            }
        });

        setSummary({
            paid: paidCount,
            unpaid: unpaidCount,
            unpaidTotal,
        });
    };

    return (
        <div className="p-8 bg-white">
            <button onClick={() => navigate('/home')} className="mb-4 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Home</span>
            </button>

            {/* Header */}
            <h1 className="text-3xl font-bold mb-4 text-left">Recap Payment</h1>
            <p className="text-left text-gray-600 mb-6">
                {scanDate || 'Tanggal tidak tersedia'}
            </p>

            {/* Payment Details */}
            <div className="mb-8">
                {payments.length > 0 ? (
                    payments.map((payment, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-300 pb-4 mb-4"
                        >
                            <div className="flex items-center mb-2">
                                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                                <div>
                                    <p className="font-semibold">{payment.name}</p>
                                    {payment.total && <p>Rp {payment.total.toLocaleString()}</p>}
                                </div>
                                <p
                                    className={`ml-auto ${payment.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {payment.status === 'Paid' ? 'Sudah bayar' : 'Belum bayar'}
                                </p>
                            </div>
                            {/* Payment breakdown */}
                            {payment.status === 'Paid' && (
                                <div className="pl-4 text-gray-600 text-sm">
                                    <p>{payment.description || 'Item tidak tersedia'} 1x Rp {payment.total?.toLocaleString()}</p>
                                    <p>+ Pajak Rp 230</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Tidak ada pembayaran tersedia.</p>
                )}
            </div>

            {/* Summary */}
            <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <div className="flex justify-between font-semibold">
                    <p>Sudah bayar</p>
                    <p>{summary.paid}</p>
                </div>
                <div className="flex justify-between font-semibold">
                    <p>Belum bayar</p>
                    <p>{summary.unpaid}</p>
                </div>
                <div className="flex justify-between text-indigo-700 font-bold">
                    <p>Tagihan belum terbayar</p>
                    <p>Rp {summary.unpaidTotal.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentRecap;
