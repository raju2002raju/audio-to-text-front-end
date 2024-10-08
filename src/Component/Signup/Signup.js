import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLoginComponent from "../LoginLogout/FacebookLogin";
import LoginButton from "../LoginLogout/Login";
import '../Login/Login.css'

const Signup = () => {
    const clientId = '799149964193-3m34unf2976di4du1omj7g02v27g1164.apps.googleusercontent.com';
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const baseUrl = 'https://audio-to-text-back-end.onrender.com';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isValidLength = password.length >= 8;
        return { hasUpperCase, hasNumber, isValidLength };
    };

    const validateForm = () => {
        const newErrors = {};
        if (!userName.trim()) newErrors.userName = "Username is required";
        if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";

        const passwordStrength = validatePassword(password);
        if (!passwordStrength.hasUpperCase) newErrors.password = "Password must contain at least one uppercase letter";
        else if (!passwordStrength.hasNumber) newErrors.password = "Password must contain at least one number";
        else if (!passwordStrength.isValidLength) newErrors.password = "Password must be at least 8 characters long";

        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("name", userName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        try {
            const response = await axios.post(`${baseUrl}/auth/signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.status === "exist") {
                alert("User already exists");
            } else if (response.data.status === "success") {
                alert("Signup successful!");
                localStorage.setItem('userEmail', email);
                setUserName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setProfileImage(null);
                setPreviewImage(null);
                navigate("/audio_to_text", { state: { id: email } });
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrors({ ...errors, submit: "An error occurred during signup. Please try again." });
        }
    };

    return (
        <div className='Login-main-container'>
            <div className='d-flex m-d-flex'>
                <div className='file_upload_container'>
                    <div className='w-text profile-upload-document'>
                        <p>Hello! Register To
                            <br/><span>Get Started</span></p>
                        <div className='mobile-p-5'>
                            <div className='hover-upload-document'>
                                <p>Hello! Register To
                                <br/><span>Get Started</span></p>
                            </div>
                        </div>
                    </div>
                    <div className='w-525-bg'></div>
                </div>
            </div>
            <div className='signup-container'>
                <div className='profile-container'>
                    <div className="profile-img-div">
                        <label htmlFor="profile-pic-upload" className='signup-image-uploader'>
                            <img
                                src={previewImage || "./Images/Ellipse 232.png"}
                                alt="Profile"
                                className='profile-image-signup'
                            />
                            <input
                                type="file"
                                id="profile-pic-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='email-pass-container'>
                        <div className='email_container input-icons'>
                            <input
                                type="text"
                                className='input-field'
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Enter Username"
                                required
                            />
                            {errors.userName && <p className="error-message">{errors.userName}</p>}
                        </div>
                        <div className='email_container input-icons'>
                            <input
                                className='input-field'
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder='Enter Your Email'
                            />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        <div className='password_container input-icons'>
                            <div className="password-field">
                                <input
                                    className='input-field'
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder='Enter Your Password'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="show-password-btn"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                        <div className='password_container input-icons'>
                            <div className="password-field">
                                <input
                                    className='input-field'
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="show-password-btn"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                        </div>
                    </div>
                    <div className='login-btn'>
                        <button type="submit">SIGN UP</button>
                    </div>
                </form>
                <div className="login-divider">
                    <span>Or Login with</span>
                </div>
                <div className="g-f-signup-button">
                    <GoogleOAuthProvider clientId={clientId}>
                        <LoginButton />
                    </GoogleOAuthProvider>
                    <FacebookLoginComponent />
                </div>
                <div className="already-div">
                    <p className="already-d-g">Already have an account? <Link style={{ textDecoration: 'none', color: 'rebeccapurple' }} to='/login'>SIGN IN</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;