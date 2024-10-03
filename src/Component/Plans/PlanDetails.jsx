import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PlanDetails.css';


const CheckoutForm = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message || 'An error occurred');
        setProcessing(false);
      } else {
        console.log('PaymentMethod', paymentMethod);
        setProcessing(false);
        alert('Payment successful!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement className="card-element" />
      {error && <div className="error-message">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="submit-button"
      >
        {processing ? 'Processing...' : `Pay $${plan.price}`}
      </button>
    </form>
  );
};

const PlanDetails = ({ selectedPlan }) => {
  const navigate = useNavigate();

  if (!selectedPlan) {
    return (
      <div className="container">
        <div className="text-center">
          <p className="text-muted">Please select a plan to view payment options</p>
          <button
            onClick={() => navigate('/plans')}
            className="btn-back"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="plan-details-header">
        <div className="plan-name">{selectedPlan.name} Plan</div>
        <button
          onClick={() => navigate('/plans')}
          className="btn-back"
        >
          Back to Plans
        </button>
      </div>
      <div className="plan-price">${selectedPlan.price}/month</div>

      {/* Debit Card/Credit Card Payment Section */}
      <div className="payment-section">
        <h3>Debit Card/Credit Card</h3>
        <CheckoutForm plan={selectedPlan} />
      </div>
    </div>
  );
};

export default PlanDetails;
