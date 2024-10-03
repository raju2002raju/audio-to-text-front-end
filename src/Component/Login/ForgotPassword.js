import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://audio-to-text-back-end.onrender.com/api/forgot-password", {
        email
      });

      setMessage(response.data.message);
      if (response.data.success) {
        // Redirect to OTP verification page with email in state
        navigate('/verify-otp', { state: { email } });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className='Login-main-container'>
          <div className='forgot-password'>
            <h2>Forgot Password</h2>
            <p>Enter your email and we'll send you a code to <br/> reset your password</p>
            <form onSubmit={handleSubmit} className='form-container'>
              <div className='email_container input-icons'>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder='Enter your email'
                />
              </div>
              <div className='login-btn send-btn'>
                <button type="submit">Send Code</button>
              </div>
              <div className='link_login'>
                
                  <Link to='/login' className="back-to-login-link">
                    {/* <img className="back-to-login-img" src='../Images/back.png' alt="" /> */}
                    Back to Login
                  </Link>
           
              </div>
            </form>
            {message && <p>{message}</p>}
          </div>
    </div>
  );
};

export default ForgotPassword;
