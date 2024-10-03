import React from 'react'
import '../UpGradePlan/UpGradePlan.css'

const UpGradePlan = () => {
  return (
    <div className="upgradeplane-main-container"> 
     <div className='upgrade-h1'> 
     <h1>Upgrade Your Plan</h1>
     </div>
      <div className="upgradeplane-container">
            <div className="pricing-container">
                <div className='free-plan'>
                    <h3>Free</h3>
                    <p>USD $0/month</p>
                    <div className='free-plan-button'>
                    <button>You Current Plan</button>
                    </div>
                    <p>Assistance with writing, problem solving and more</p>
                    <p>Access to GPT-4o mini</p>
                    <p>Limited access to GPT‑4o</p>
                    <p>Limited access to data analysis, file uploads</p>
                    <p>Use custom GPTs</p>
                </div>
                <div className='upgrade-plan'>
                    <h3>Plus</h3>
                    <p>USD $50/month</p>
                    <div className='free-plan-button'>
                    <button>Upgrade to Plus</button>
                    </div>
                    <p>Access to OpenAI o1-preview, OpenAI o1-mini</p>
                    <p>Access to GPT-4o, GPT-4o mini, GPT-4</p>
                    <p>Limited access to GPT‑4o</p>
                    <p>Access to data analysis, file uploads, vision, web browsing, and image generation</p>
                    <p>Use custom GPTs</p>
                </div>
            </div>
      </div>
    </div>
  )
}

export default UpGradePlan
