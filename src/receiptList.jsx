import React, { useState } from 'react'

const receiptList = ({ items, onConfirm }) => {
    const [receiptItems, setReceiptItems] = useState(items)

    const handleChange = (index, field, value) => {
        const newItems = [...receiptItems]
        newItems[index][field] = value
        setReceiptItems(newItems)
    }

    const handleConfirm = () => {
        onConfirm(receiptItems)
    }

    return (
        <div>
            <h1>Edit Receipt Items</h1>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {receiptItems.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type='text'
                                    value={item.name}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                />
                            </td>
                            <td> 
                                <input 
                                    type="number" 
                                    value={item.price} 
                                    onChange={(e) => handleChange(index, 'price', e.target.value)} 
                                /> 
                            </td>
                            <td> 
                                <input 
                                    type="number" 
                                    value={item.quantity} 
                                    onChange={(e) => handleChange(index, 'quantity', e.target.value)} 
                                /> 
                            </td>
                            <td>{item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleConfirm}>Konfirmasi</button>
        </div>
    )
}

export default receiptList