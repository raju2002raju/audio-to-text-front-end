import axios from 'axios';
import React, { useEffect, useState } from 'react'



const Setting = () => {
    const [ghlApiKey, setGhlApiKey] = useState('');
    const [openAiApiKey, setOpenAiApiKey] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [inputLanguage, setInputLanguage] = useState('');
    const [outputLanguage, setOutputLanguage] = useState('');


    const handleOpenSetting = () => {
        setIsOpen(!isOpen)
    }

    const closePopup = () => {
        setIsOpen(false)
    }

    const handleInputLanguageChange = (event) => {
        setInputLanguage(event.target.value);
    };

    const handleOutputLanguageChange = (event) => {
        setOutputLanguage(event.target.value);
    };

    const sendLanguagesToBackend = async () => {
        try {
            const response = await axios.post('https://audio-to-text-back-end.onrender.com/language/send-languages', {
                inputLanguage,
                outputLanguage
            });
    
            if (response.status === 200) {
                console.log('Languages sent successfully');
            } else {
                console.error('Failed to send languages:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending languages:', error);
        }
    };
    useEffect(() => {
        sendLanguagesToBackend();

    }, [inputLanguage, outputLanguage]);

    useEffect(() => {
        const storedGhlApiKey = localStorage.getItem('ghlApiKey');
        if (storedGhlApiKey) setGhlApiKey(storedGhlApiKey);
    }, []);


    return (
        <div className='setting_main_container'>
            <div className='setting_container'>

                <div className='savedTranscribePopup'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                        <div className='language_div'>
                            <h4>Input Language</h4>
                            <p>Choose the language you will be speaking in. Leave blank for auto detection.</p>
                            <select value={inputLanguage} onChange={handleInputLanguageChange}>
                                <option value="English">English</option>
                                <option value="">Auto Detect</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Arabic">Arabic</option>
                                <option value="Russian">Russian</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Italian">Italian</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Korean">Korean</option>
                                <option value="Turkish">Turkish</option>
                                <option value="Vietnamese">Vietnamese</option>
                                <option value="Polish">Polish</option>
                                <option value="Ukrainian">Ukrainian</option>
                                <option value="Dutch">Dutch</option>
                                <option value="Swedish">Swedish</option>
                                <option value="Czech">Czech</option>
                                <option value="Greek">Greek</option>
                                <option value="Hebrew">Hebrew</option>
                                <option value="Indonesian">Indonesian</option>
                                <option value="Malay">Malay</option>
                                <option value="Persian">Persian</option>
                                <option value="Romanian">Romanian</option>
                                <option value="Thai">Thai</option>
                                <option value="Finnish">Finnish</option>
                                <option value="Norwegian">Norwegian</option>
                                <option value="Danish">Danish</option>
                                <option value="Hungarian">Hungarian</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Kannada">Kannada</option>
                                <option value="Malayalam">Malayalam</option>
                                <option value="Gujarati">Gujarati</option>
                                <option value="Urdu">Urdu</option>
                                <option value="Punjabi">Punjabi</option>
                            </select>
                          

                        </div>
                        <div className='language_div'>
                            <h4>Output Language</h4>
                            <p>Generate written content in almost any language you can think of.</p>
                            <select value={outputLanguage} onChange={handleOutputLanguageChange}>
                                <option value="English">English</option>
                                <option value="">Auto Detect</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Japanese">Japanese</option>
                                <option value="Arabic">Arabic</option>
                                <option value="Russian">Russian</option>
                                <option value="Portuguese">Portuguese</option>
                                <option value="Italian">Italian</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Korean">Korean</option>
                                <option value="Turkish">Turkish</option>
                                <option value="Vietnamese">Vietnamese</option>
                                <option value="Polish">Polish</option>
                                <option value="Ukrainian">Ukrainian</option>
                                <option value="Dutch">Dutch</option>
                                <option value="Swedish">Swedish</option>
                                <option value="Czech">Czech</option>
                                <option value="Greek">Greek</option>
                                <option value="Hebrew">Hebrew</option>
                                <option value="Indonesian">Indonesian</option>
                                <option value="Malay">Malay</option>
                                <option value="Persian">Persian</option>
                                <option value="Romanian">Romanian</option>
                                <option value="Thai">Thai</option>
                                <option value="Finnish">Finnish</option>
                                <option value="Norwegian">Norwegian</option>
                                <option value="Danish">Danish</option>
                                <option value="Hungarian">Hungarian</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Telugu">Telugu</option>
                                <option value="Marathi">Marathi</option>
                                <option value="Kannada">Kannada</option>
                                <option value="Malayalam">Malayalam</option>
                                <option value="Gujarati">Gujarati</option>  
                                <option value="Urdu">Urdu</option>
                                <option value="Punjabi">Punjabi</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>


            <div>




            </div>

        </div>
    )
}

export default Setting
