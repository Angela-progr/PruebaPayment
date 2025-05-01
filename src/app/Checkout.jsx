import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useParams } from 'react-router-dom';

// Cargar tu clave pública de Stripe
const stripePromise = loadStripe('pk_test_51RJguqChvSbzAl3jLleQS7fTKz7YjE0C4KY59T1wlxdOakLdL1qoHhmLixGtzeYxrSJMHvRQt2FTgeh3cc2fJUZW00C0QYLW1D');

const Checkout = () => {
  const { order_id, token } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const transaction_status = "pendiente";

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        // const response = await fetch(`http://localhost:8000/bff-b2c/v1/payment`, {
          const response = await fetch(`https://dev.agents4future.com/bff-b2c/v1/payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ order_id, transaction_status }),
          });
  
          if (!response.ok) {
            throw new Error(`Error al obtener clientSecret: ${response.status}`);
          }
  
          const data = await response.json();
          setClientSecret(data.client_secret);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      if (order_id && token) {
        fetchClientSecret();
      }
    }, [order_id, token]);

  const appearance = {
    theme: 'stripe', // o 'flat', 'night', etc.
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          {/* Aquí insertas tu componente de pago, como PaymentElement o CheckoutForm */}
          <div>
            <CheckoutForm />
          </div>
        </Elements>
      ) : (
        <p>Cargando...</p>
      )}
    </>
  );
};

export default Checkout;