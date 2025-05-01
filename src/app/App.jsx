import React, { useState } from 'react';
import Order from './Order';

const App = () => {
  const [token, setToken] = useState(null);
  const [orderData, setOrderData] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    // const response = await fetch('http://localhost:8000/bff-b2c/v1/auth/login', {
      const response = await fetch('https://dev.agents4future.com/bff-b2c/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    console.log(data);
    console.log(data.access_token);
    
    setToken(data.access_token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const product_id = e.target.product_id.value;
    const duration = parseInt(e.target.duration.value, 10);

    const response = await fetch('https://dev.agents4future.com/bff-b2c/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ detail: {
        product_id,
        duration
      } }),
    });

    const data = await response.json();
    setOrderData(data);
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
          <label>
            Duración:
            <input type="text" name="duration" required />
          </label>
          <br />
          <button type="submit">Comprar</button>
        </form>
      ) : (
        <Order order={orderData} token={token} />
      )}
    </div>
  );
}  

export default App;
