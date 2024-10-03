import React, { useEffect, useState } from 'react'
import './Home.css'
import Onboarding from '../Onboarding/Onboarding'


const Home = () => {
  return (
    <div className='home-main-container'>
      <div className='soundwave-container d-soundwave'>
        <img  src='./Images/soundwave.png'/>
      </div>
      <div className='text-container'>
        <img  src='./Images/logo.png'/>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </div>
      <div className='footer-image'>
        <img src='./Images/footer-image.png'/>
      </div>
    </div>
  )
}

const App = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOnboarding(true);
    },5000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      {showOnboarding ? <Onboarding /> : <Home />}
    </>
  );
}

export default App;
