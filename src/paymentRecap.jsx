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

        payments.forEach(payment => {
            if (payment.status === 'Paid') {
                paidCount++;
            } else {
                unpaidCount++;
                unpaidTotal += payment.total;
            }
        });

        setSummary({
            paid: paidCount,
            unpaid: unpaidCount,
            unpaidTotal
        });
    };

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <button onClick={() => navigate('/')} className="text-indigo-700 mb-4">Home</button>
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Recap Payment</h2>
            <p className="text-center text-gray-600 mb-4">{scanDate}</p>
            <div className="mb-8">
                {payments.map((payment, index) => (
                    <div key={index} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{payment.name}</h3>
                            <span>{`Rp ${payment.total.toLocaleString()}`}</span>
                            <span className={`ml-2 ${payment.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                                {payment.status === 'Paid' ? 'Sudah bayar' : 'Belum bayar'}
                            </span>
                        </div>
                        {payment.status === 'Paid' && (
                            <div className="pl-4 text-gray-600 text-sm">
                                <p>Bakso 1x Rp 40.000</p>
                                <p>+ Pajak Rp 230</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-md">Sudah bayar: {summary.paid}</p>
                <p className="text-md">Belum bayar: {summary.unpaid}</p>
                <p className="text-md">Tagihan belum terbayar: Rp {summary.unpaidTotal.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default PaymentRecap;
