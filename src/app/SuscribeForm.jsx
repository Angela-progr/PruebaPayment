// SubscribeForm.jsx
import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const API_URL = "http://localhost:8000/bff-b2c/v1";

function SubscribeForm({token, order, customerId }) {
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: "https://example.com/success",
      },
      redirect: "if_required",
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      const paymentMethodId = result.setupIntent.payment_method;

      const res = await axios.post(`${API_URL}/payment/subscription`, {
        order_id: order.id,
        customer_id: customerId,
        product_id : order.product_id,
        payment_method_id: paymentMethodId,
        user_fullname: "Test Angela",
        user_email: "practicante2@agents4future.com",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert("Suscripción creada 🎉");
      console.log(res.data);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button type="submit" disabled={!stripe}>
          Suscribirse
        </button>
      </form>
    </div>
  );
}

export default SubscribeForm;
