// SubscribeForm.jsx
import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const API_URL = "http://localhost:4000/api-billing/v1/transactions";

function SubscribeForm({ clientSecret, customerId }) {
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

      const res = await axios.post(`${API_URL}/stripe/subscription`, {
        customer_id: customerId,
        payment_method_id: paymentMethodId,
      });

      alert("Suscripción creada 🎉");
      console.log(res.data.subscription);
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
