import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './Onboarding.css'

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1)
  }

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className='onboarding-container'>
           <div className="mobile-h1"><h1><span>Lorem ipsum</span> dolor sit amet</h1></div>
            <img src='./Images/splash-image1.png' className='vector-img m-image' />
           <div>
            <div className='onboarding-main-container'>
              <div className='onboarding_container'>
                <div className='desktop-text-div'>
                  <div className="desktop-h1"><h1><span>Lorem ipsum</span> dolor sit amet</h1></div>  
                  <p className='m-text'>Scribes play a crucial role in optimizing healthcare delivery, enabling doctors to see more patients and improve overall productivity.</p>
                 <div className='m-btn'>
                 <button onClick={handleNext} className='splash-Btn'>NEXT</button>
                 </div>
                  </div>
              </div>
            </div>
           </div>
          </div> 
        )
      case 1:
        return (
          <div className='onboarding-container'>
           <div className="mobile-h1"><h1><span>Enhancing</span> Workflow Efficiency</h1></div>
            <img src='./Images/splash-image2.png' className='vector-img m-image' />
           <div>
            <div className='onboarding-main-container'>
              <div className='onboarding_container'>
                <div><img src="./Images/girl_icon.png" alt="" /></div>
                <div className='desktop-text-div'>
                  <div className="desktop-h1"><h1><span>Lorem ipsum</span> dolor sit amet</h1></div>  

                  <p className='m-text'>Scribes play a crucial role in optimizing healthcare delivery, enabling doctors to see more patients and improve overall productivity.</p>
                  <div className='m-btn'>
                  <button onClick={handleNext} className='splash-Btn'>NEXT</button>
                  </div>
           
                </div>
              </div>
            </div>
           </div>
          </div> 
        )
      case 2:
        return (
          <div className='LoginSignup-onboarding-container'>
            <img src='./Images/logo.png' className='vector-img m-image'/>
            <div className="mobile-h1">

                  <h1>Welcome to 
                  <br></br>
                  <span className='on-med-scribe'>Audio To Text</span>
                  </h1>

                  </div>
            <div className='signup-signin-main-container'>
              <div className='signup-signin_container'>
                <div className='text'>
                  <div className="desktop-h1 desktop-onboarding-loginSignup-h1">

                  <h1>Welcome to <span className='on-med-scribe'>Audio To Text</span>
                  </h1>

                  </div>
                  <div className='signup-signin-btn'>
                  <Link to='/login'><button className='sign-in'>Sign in</button></Link>
                  <Link to='/signup'><button className='sign-up'>Sign up</button></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {renderStep()}
    </div>
  )
}

export default Onboarding;