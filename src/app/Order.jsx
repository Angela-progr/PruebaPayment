import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Order = ({ order, token }) => {
  const navigate = useNavigate();
  
  const [address, setAddress] = useState(order.address);
  const [invoiceType, setInvoiceType] = useState(order.invoice_type);
  const [documentNumber, setDocumentNumber] = useState(order.document_number);

  // const saveOrder = async () => {
  //   const updatedOrder = {
  //     address,
  //     invoice_type: invoiceType,
  //     document_number: documentNumber
  //   };
  //   const response = await fetch(`http://localhost:8000/bff-b2c/v1/order/${order.id}`, {
  //   //const response = await fetch(`https://dev.agents4future.com/bff-b2c/v1/order/${order.id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(updatedOrder),
  //   });
  
  //   if (!response.ok) {
  //     throw new Error(`Error al actualizar la orden: ${response.status}`);
  //   }
  
  //   return response.json();
  // };
  
  const handlePay = async () => {
    try {
      //await saveOrder(); 
      navigate(`/Checkout/${order.id}/${token}`);
    } catch (error) {
      console.error('Error al guardar la orden:', error);
      // Aquí podrías mostrar un mensaje al usuario si lo deseas
    }
  };

  return (
    <div>
      <h2>Detalles de la Orden</h2>
      <p><strong>Product ID: </strong> {order.product_id}</p>
      <p><strong>Duración: </strong> {order.months_duration}</p>
      <p><strong>User ID: </strong> {order.user_id}</p>
      <p><strong>Total Amount: </strong> {order.amount}</p>
      <p><strong>Currency: </strong> {order.currency}</p>
      
      <label>
        <strong>Address: </strong>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
        />
      </label>
      <br />

      <label>
        <strong>Invoice type: </strong>
        <input 
          type="text" 
          value={invoiceType} 
          onChange={(e) => setInvoiceType(e.target.value)} 
        />
      </label>
      <br />

      <label>
        <strong>Document Number: </strong>
        <input 
          type="text" 
          value={documentNumber} 
          onChange={(e) => setDocumentNumber(e.target.value)} 
        />
      </label>
      <br />

      <button onClick={handlePay}>Pagar</button>
    </div>
  );
};

export default Order;
