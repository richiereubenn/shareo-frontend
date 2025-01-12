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

    const items = [ 
        { name: 'Richie', amount: '40.230', description: 'Bakso', paid: true }, 
        { name: 'Joko', amount: '', description: '', paid: false }, 
        { name: 'Joko', amount: '', description: '', paid: false }, 
    ];

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
        <div className="p-8 bg-white">
            <button onClick={() => navigate('/')} className="mb-4 flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg> 
                <span>Home</span>
            </button>
            <h1 className="text-3xl font-bold mb-2 text-left">Recap Payment</h1>
            <p className="text-center text-gray-600 mb-4">{scanDate}</p>
            {/* <p className="text-left text-gray-600 mb-6">3 Januari 2025</p> */}
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
            {/* {items.map((item, index) => (
                <div key={index} className="border-b border-gray-300 pb-4 mb-4"> 
                    <div className="flex items-center mb-2"> 
                        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div> 
                        <div> 
                            <p className="font-semibold">{item.name}</p> 
                            {item.amount && <p>Rp. {item.amount}</p>} 
                        </div> 
                        <p className={`ml-auto ${item.paid ? 'text-green-500' : 'text-red-500'}`}> 
                            {item.paid ? 'Sudah bayar' : 'Belum bayar'} 
                        </p> 
                    </div> 
                    <div className="flex justify-between text-center text-gray-500">
                        {item.description && <p>{item.description}</p>} 
                        {item.paid && item.amount && ( 
                            <> 
                                <p>1x</p>  
                                <p>Rp {item.amount}</p>
                            </> 
                        )} 
                    </div>
                    <div className="flex justify-between text-center text-gray-500">
                        <p>+ Pajak</p>
                        <p>Rp. 230</p>
                    </div>
                </div>
            ))} */}
            <div className="mt-8 text-center">
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-md">Sudah bayar: {summary.paid}</p>
                <p className="text-md">Belum bayar: {summary.unpaid}</p>
                <p className="text-md">Tagihan belum terbayar: Rp {summary.unpaidTotal.toLocaleString()}</p>
            </div>
            {/* <div className='flex justify-between font-semibold'>
                <p>Sudah bayar </p>
                <p>1</p>
            </div>
            <div className='flex justify-between font-semibold'>
                <p>Belum bayar </p>
                <p>2</p>
            </div>
            <div className='flex justify-between text-indigo-700 font-bold'>
                <p>Tagihan belum terbayar</p>
                <p>Rp 230.000</p>
            </div> */}
        </div>
    );
};

export default PaymentRecap;
