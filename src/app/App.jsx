// import React, { useState } from 'react';
// import Order from './Order';
// import SubscribeForm from './SuscribeForm.jsx';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const App = () => {
//   const stripePromise = loadStripe('pk_test_51RJguqChvSbzAl3jLleQS7fTKz7YjE0C4KY59T1wlxdOakLdL1qoHhmLixGtzeYxrSJMHvRQt2FTgeh3cc2fJUZW00C0QYLW1D');
  // const [token, setToken] = useState(null);
  // const [orderData, setOrderData] = useState(null);
  // const invoice_type = "1";
  // const document_number = "10722809357";

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const email = e.target.email.value;
  //   const password = e.target.password.value;
  
  //   const response = await fetch('http://localhost:8000/bff-b2c/v1/auth/login', {
  //   //const response = await fetch('https://dev.agents4future.com/bff-b2c/v1/auth/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email, password }),
  //   });
  
  //   const data = await response.json();
  //   console.log(data);
  //   console.log(data.access_token);
    
  //   setToken(data.access_token);
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const product_id = e.target.product_id.value;
  //   const duration = parseInt(e.target.duration.value, 10);

  //   const response = await fetch('http://localhost:8000/bff-b2c/v1/order', {
  //   //const response = await fetch('https://dev.agents4future.com/bff-b2c/v1/order', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({invoice_type,document_number, detail: {
  //       product_id,
  //       duration
  //     } }),
  //   });

  //   const data = await response.json();
  //   setOrderData(data);
  // };

  // return (
    // <div>
    //   {!token ? (
    //     <form onSubmit={handleLogin}>
    //       <label>
    //         Email:
    //         <input type="email" name="email" required />
    //       </label>
    //       <br />
    //       <label>
    //         Password:
    //         <input type="password" name="password" required />
    //       </label>
    //       <br />
    //       <button type="submit">Iniciar sesión</button>
    //     </form>
    //   ) : !orderData ? (
    //     <form onSubmit={handleSubmit}>
    //       <label>
    //         Product ID:
    //         <input type="text" name="product_id" required />
    //       </label>
    //       <br />
    //       <label>
    //         Duración:
    //         <input type="text" name="duration" required />
    //       </label>
    //       <br />
    //       <button type="submit">Comprar</button>
    //     </form>
    //   ) : (
    //     <Order order={orderData} token={token} />
    //   )}
//     // </div>
//   );
// }  

// export default App;
// App.jsx
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SubscribeForm from "./SuscribeForm";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51RJguqChvSbzAl3jLleQS7fTKz7YjE0C4KY59T1wlxdOakLdL1qoHhmLixGtzeYxrSJMHvRQt2FTgeh3cc2fJUZW00C0QYLW1D");
const API_URL = "http://localhost:4000/api-billing/v1/transactions";

function App() {
  const [clientSecret, setClientSecret] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  

  useEffect(() => {
    const createSetupFlow = async () => {
      const { data: customer } = await axios.post(`${API_URL}/stripe/customer`, {
        email: "practicante2@agents4future.com",
      });
      setCustomerId(customer.customer_id);

      const { data: intent } = await axios.post(`${API_URL}/stripe/setup-intent`, {
        customer_id: customer.customer_id, // pasa el customer aquí
      });
      setClientSecret(intent.client_secret);
    };

    createSetupFlow();
  }, []);

  const options = {
    clientSecret,
    appearance: { theme: "stripe" },
  };

  return (
    <>
      {clientSecret && customerId && (
        <Elements stripe={stripePromise} options={options}>
          <SubscribeForm clientSecret={clientSecret} customerId={customerId} />
        </Elements>
      )}
    </>
  );
}

export default App;
