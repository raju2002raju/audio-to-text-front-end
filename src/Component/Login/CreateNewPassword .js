import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
  
    const email = localStorage.getItem('forgotEmail');
    const otp = localStorage.getItem('isOtpVerified');
  
    try {
      const response = await fetch('https://audio-to-text-back-end.onrender.com/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
  
      const result = await response.json();
      if (result.success) {
        localStorage.removeItem('forgotEmail');
        localStorage.removeItem('isOtpVerified');
  
        navigate('/password-changed-successfully');
      } else {
        setError(result.message || 'Error resetting password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('An error occurred while resetting the password');
    }
  };
  
  return (
    <div className='Login-main-container'>
    <div className='reset'>
      <h2>Create New Password</h2>
      <h4>Your new password must be unique from those <br/> previously used.</h4>
      <form onSubmit={handleSubmit}>
        <div className='create-newPassword'>
          <input
            className="input-field"
            type='password'
            required
            placeholder='New Password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            className="input-field"
            type='password'
            required
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className='error-message'>{error}</p>}
        <div className='login-btn send-btn'>
          <button type="submit">Reset Password</button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default CreateNewPassword;
