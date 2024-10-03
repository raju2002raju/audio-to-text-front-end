import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Component/Signup/Signup'
import './App.css';
import Setting from './Component/Setting';
import TranscribeAi from './Component/TranscirbeAi';
import SavedTranscribeText from './Component/SavedTranscribeText';
import Login from './Component/Login/Login'
import CreateNewPassword from './Component/Login/CreateNewPassword ';
import OTPVerification from './Component/Login/OTPVerification'
import ForgotPassword from './Component/Login/ForgotPassword'
import PasswordChanged from './Component/Login/PasswordChanged'
import Home from './Component/Home/Home';
import Profile from './Component/Profile/Profile';
import SubscriptionPlans from './Component/Plans/SubscriptionPlans';
import PlanDetails from './Component/Plans/PlanDetails';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const App = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const stripePromise = loadStripe('your-publishable-key-from-stripe');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/audio_to_text' element={<TranscribeAi />} />
        <Route path='/saved-transcript' element={<SavedTranscribeText />} />
        <Route path='/setting' element={<Setting />} />
        <Route path='/login' element={<Login />} />
        <Route path='/create-new-password' element={<CreateNewPassword />} />
        <Route path='/otp-verification' element={<OTPVerification />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/password-changed' element={<PasswordChanged />} />
        <Route path='/profile-update' element={<Profile />} />
        <Route path='/plans' element={<SubscriptionPlans selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />} />
      </Routes>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/plan-details" element={<PlanDetails selectedPlan={selectedPlan} />} />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
};

export default App;
