import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import App from './App.jsx';
import ScanReceipt from './scanReceipt.jsx';
import ReceiptList from './receiptList.jsx';
import SelectItem from './selectItem.jsx';
// import PaymentRecap from './paymentRecap.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className='m-10'>
        <App />
        <Outlet />
      </div>
    ),
    children: [
      { path: '/', element: <ScanReceipt /> },
      { path: 'receiptList', element: <ReceiptList /> },
      { path: 'selectItem', element: <SelectItem /> },
      // { path: 'paymentRecap', element: <PaymentRecap /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);