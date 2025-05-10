import React, { useState } from 'react';
import Order from './Order';
import axios from 'axios';

const API_URL = 'http://localhost:8000/bff-b2c/v1';

const App = () => {
  const [token, setToken] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [client_secret, setClientSecret] = useState(null);

  const invoice_type = '1';
  const document_number = '10722809357';

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const data = response.data;
      console.log(data);
      setToken(data.access_token);
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      alert('Credenciales inválidas o error del servidor');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product_id = e.target.product_id.value;

    try {
      const orderResponse = await axios.post(
        `${API_URL}/orders`,
        {
          invoice_type,
          document_number,
          product_id:product_id,
          payment_provider:"stripe",
          address:"default"
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setOrderData(orderResponse.data);

      const customerResponse = await axios.post(`${API_URL}/payment`,
      {email:"practicante2@agents4future.com"},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setCustomerId(customerResponse.data.customer_id);
      setClientSecret(customerResponse.data.client_secret);
    } catch (error) {
      console.error('Error al procesar la compra:', error.response?.data || error.message);
      alert('Error al realizar la compra. Intente nuevamente.');
    }
  };

  return (
    <div>
      {!token ? (
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
          <br />
          <button type="submit">Iniciar sesión</button>
        </form>
      ) : !orderData ? (
        <form onSubmit={handleSubmit}>
          <label>
            Product ID:
            <input type="text" name="product_id" required />
          </label>
          <br />
          <button type="submit">Comprar</button>
        </form>
      ) : customerId ? (
        <Order customerId={customerId} order={orderData} token={token} client_secret={client_secret} />
      ) : (
        <p>Cargando datos del cliente...</p>
      )}
    </div>
  );
};

export default App;

// App.jsx
// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import SubscribeForm from "./SuscribeForm";
// import axios from "axios";

// const stripePromise = loadStripe("pk_test_51RJguqChvSbzAl3jLleQS7fTKz7YjE0C4KY59T1wlxdOakLdL1qoHhmLixGtzeYxrSJMHvRQt2FTgeh3cc2fJUZW00C0QYLW1D");
// const API_URL = "http://localhost:4000/api-billing/v1/transactions";

// function App() {
//   const [clientSecret, setClientSecret] = useState(null);
//   const [customerId, setCustomerId] = useState(null);
  

//   useEffect(() => {
//     const createSetupFlow = async () => {
//       const { data: customer } = await axios.post(`${API_URL}/stripe/customer`, {
//         email: "practicante2@agents4future.com",
//       });
//       setCustomerId(customer.customer_id);

//       const { data: intent } = await axios.post(`${API_URL}/stripe/setup-intent`, {
//         customer_id: customer.customer_id, // pasa el customer aquí
//       });
//       setClientSecret(intent.client_secret);
//     };

//     createSetupFlow();
//   }, []);

//   const options = {
//     clientSecret,
//     appearance: { theme: "stripe" },
//   };

//   return (
//     <>
//       {clientSecret && customerId && (
//         <Elements stripe={stripePromise} options={options}>
//           <SubscribeForm clientSecret={clientSecret} customerId={customerId} />
//         </Elements>
//       )}
//     </>
//   );
// }

// export default App;
