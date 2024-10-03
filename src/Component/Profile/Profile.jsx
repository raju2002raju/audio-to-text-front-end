import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'

import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const baseUrl = 'https://audio-to-text-back-end.onrender.com';

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await axios.get(`${baseUrl}/auth/user`, {
          headers: {
            'user-email': email,
          },
        });
        setUserData(response.data[0]);
        setProfileName(response.data[0].name);
        setProfileEmail(response.data[0].email);
        setProfileImage(response.data[0].profileImage);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('name', profileName);
    formData.append('email', profileEmail);

    if (profileImage instanceof File) {
      formData.append('profileImage', profileImage);
    }
  
    try {
      const email = localStorage.getItem('userEmail');
      const response = await axios.post( `${baseUrl}/api/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'user-email': email,
        },
      });
  
      if (response.status === 200) {
        const updatedImageUrl = response.data.profileImageUrl;
        setProfileImage(updatedImageUrl); 
        alert('Profile updated successfully!');
        window.location.href = '/profile-update'; 
      } else {
        console.error('Failed to update profile:', response.statusText);
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

 

  const handleBackClick = () => {
    navigate('/audio_to_text')
  }

  const getProfileImageSrc = () => {
    if (profileImage instanceof File) {
      return URL.createObjectURL(profileImage); 
    }
    return profileImage || '../Images/Ellipse 232.png'; 
  };
  return (
 <div className='profile-main-container'>
    <div className='d-flex-j-c'>
        <div className='profile'>
          <img onClick={handleBackClick} src='../Images/back (2).png' alt="back Icon" />
          <p>Profile</p>
        </div>
    </div>
      <div className='p-update'>
      <div className='d-profile-container'>

        <div className='profile-image-container'>
          <img
            src={getProfileImageSrc()}
            alt="Profile"
            className='profile-image'
          />
          <label htmlFor="profile-pic-upload" className='edit-icon'>
            <input type="file" id="profile-pic-upload" accept="image/*" onChange={handleImageChange} hidden />
            <img src='../Images/edit.png' alt="Edit" className='edit-icon' />
          </label>
        </div>

        <div className='profile-info'>
          <input
            className='input_w_500'
            type='text'
            placeholder='Name'
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <input
            className='input_w_500'
            type='email'
            placeholder='Email'
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
          />
      
      <div className='search-div-button'>
        <button onClick={handleProfileUpdate}>Update</button>

      </div>
        </div>
      </div>
  </div>
 </div>
  )
}

export default Profile
