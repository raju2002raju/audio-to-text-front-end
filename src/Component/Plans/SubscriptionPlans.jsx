import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  { id: 1, name: 'Basic', price: 9.99, features: ['Feature 1', 'Feature 2'] },
  { id: 2, name: 'Pro', price: 19.99, features: ['Feature 1', 'Feature 2', 'Feature 3'] },
  { id: 3, name: 'Premium', price: 29.99, features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] },
];

const SubscriptionPlans = ({ setSelectedPlan }) => {
  const [localSelectedPlan, setLocalSelectedPlan] = useState(null);
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    setLocalSelectedPlan(plan);
    setSelectedPlan(plan); 
    navigate('/plan-details');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
      {plans.map((plan) => (
        <div key={plan.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
          <h3>{plan.name}</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${plan.price}/month</p>
          <ul>
            {plan.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <button
            onClick={() => handleSelectPlan(plan)}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: localSelectedPlan?.id === plan.id ? '#007bff' : 'white',
              color: localSelectedPlan?.id === plan.id ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {localSelectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;