import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SubscribeForm from "./SuscribeForm";

// Cargar tu clave pública de Stripe
const stripePromise = loadStripe('pk_test_51RJguqChvSbzAl3jLleQS7fTKz7YjE0C4KY59T1wlxdOakLdL1qoHhmLixGtzeYxrSJMHvRQt2FTgeh3cc2fJUZW00C0QYLW1D');

const Checkout = ({order, token ,customerId,client_secret}) => {

  const appearance = {
    theme: 'stripe', // o 'flat', 'night', etc.
  };

  const options = {
    clientSecret:client_secret,
    appearance,
  };

  return (
    <>{client_secret ? (
      <Elements stripe={stripePromise} options={options}>
        <SubscribeForm token={token} order={order} customerId={customerId} />
      </Elements>
    ):(
      <h3>Cargando ...</h3>
    )}
      
      
    </>
  );
};

export default Checkout;