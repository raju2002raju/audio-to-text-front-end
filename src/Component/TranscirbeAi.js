import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Recorder from './Recorder';
import SoundWave from './SoundWave/SoundWave';
import SavedTranscribeText from './SavedTranscribeText';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowRightFromBracket, faArrowsRotate, faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



let gumStream = null;
let recorder = null;
let audioContext = null;


function TranscribeAi() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [rewrittenTranscript, setRewrittenTranscript] = useState('');
    const [isStartRecording, setIsStartRecording] = useState(false);
    const [currentTranscriptId, setCurrentTranscriptId] = useState(null);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [userData, setUserData] = useState(null);
    const [status, setStatus] = useState(true);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const popupRef = useRef(null);
    const navigate = useNavigate();
    const [showpopup , setShowPopup] = useState(false);

    const baseUrl = 'https://audio-to-text-back-end.onrender.com';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsPopupOpen(false);
               
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                const response = await axios.get(`${baseUrl}/auth/user`, { 
                    headers: {
                        'user-email': email 
                    }
                 });
                setUserData(response.data[0]);  
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRecording]);

    const handleStop = () => {
        setIsRecording(false);
    };

    const handleLogout = async () => {
        try {         
            await axios.post(`${baseUrl}/auth/logout`); 
    
            localStorage.removeItem('userEmail'); 
            window.location.href = '/login'; 
        } catch (error) {
            console.error('Error during logout:', error);
       
        }
    };

    const handleShowPopup = () => {
        setShowPopup(!showpopup)
    }

    const startRecording = async (isAppending = false) => {
        setIsRecording(true);
        setIsPopupOpen(true);
        setIsStartRecording(true);
        if (!isAppending) {
            setRewrittenTranscript('');
        }
        let constraints = { audio: true, video: false };

        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            gumStream = stream;
            let input = audioContext.createMediaStreamSource(stream);
            recorder = new Recorder(input, { numChannels: 1 });
            recorder.record();
        } catch (err) {
            console.error("Error getting user media:", err);
        }
    };

    const stopRecording = async () => {
        setIsRecording(false);
        setLoadingStep(1);
        try {
            recorder.stop();
            gumStream.getAudioTracks()[0].stop();
            recorder.exportWAV(onStop);
        } catch (err) {
            console.error("Error stopping recording:", err);
            setLoadingStep(0);
        }
    };

    const onStop = (blob) => {
        let data = new FormData();
        data.append('wavfile', blob, "recording.wav");
        const config = { headers: { 'content-type': 'multipart/form-data' } };
        axios.post(`${baseUrl}/asr`, data, config)
            .then(response => {
                console.log("File uploaded successfully:", response.data);
                setLoadingStep(2);
                setTranscript(response.data.transcript);
                rewriteTranscript(response.data.transcript);
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                setLoadingStep(0);
            });
    };
    const rewriteTranscript = (newTranscript) => {
        setLoadingStep(3);
        axios.post(`${baseUrl}/rewrite-transcript`, { transcript: newTranscript })
            .then(response => {
                const rewrittenText = response.data.rewritten;
                setRewrittenTranscript(prev => {
                    if (prev) {
                        return prev + '\n\n---\n\n' + rewrittenText;
                    } else {
                        return rewrittenText;
                    }
                });
                saveTranscriptToDatabase(rewrittenText);
                setLoadingStep(0);
                setStatus(false);
            })
            .catch(error => {
                console.error("Error rewriting transcript:", error);
                setLoadingStep(0);
            });
    };

    const saveTranscriptToDatabase = (transcript) => {
        const userEmail = localStorage.getItem('userEmail');
        if (currentTranscriptId) {
            axios.post(`${baseUrl}/auth/append-transcript`, { 
                id: currentTranscriptId, 
                transcript,
                userEmail 
            })
            .then(response => {
                console.log("Transcript appended successfully");
            })
            .catch(error => {
                console.error("Error appending transcript:", error);
            });
        } else {
            axios.post(`${baseUrl}/save-transcript`, { 
                transcript,
                userEmail 
            })
            .then(response => {
                console.log("Transcript saved successfully");
                setCurrentTranscriptId(response.data.id);
            })
            .catch(error => {
                console.error("Error saving transcript:", error);
            });
        }
    };

    const handleCopyClick = (text) => {
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Text copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            alert('No text to copy');
        }
    };

    const handleReset = () => {
        setIsRecording(false);
        setTime(0);
        setTranscript('');
        setRewrittenTranscript('');
        setIsStartRecording(false);
    };

    const handleCrossIcon = () => {
        setIsPopupOpen(false);
    };

    const handleAppendNote = () => {
        startRecording(true);
    };


      


        // for greeting related  
    let timeOfDay;
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
      timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 15) {
      timeOfDay = 'afternoon';
    } else {
      timeOfDay = 'evening';
    }

    return (
        <div className='main-container'>
            <div className='transcribe-container'>
               <img  src='./Images/logo.png' className='transcribe-logo'/>
            <h1>Audio <span className='logo-text'>To</span> Text</h1>
            <header className="profile-header">
                    {userData && (
                        <>
                            <img
                                src={userData.profileImage || './Images/Ellipse 232.png'} 
                                alt="Profile"
                                className="profile-pic"
                                onClick={handleShowPopup}
                            />
                   
                        </>
                    )}
                  </header>
        </div>
            <div>
            <div className='mic-btn'>
                    <img src='./Images/mic_button.png' onClick={() => startRecording(false)} type="button" alt="Start recording" />
                </div>
                {isPopupOpen && (
                    <div className='popup-container2' ref={popupRef}>
                        {isRecording && (
                            <>
                                <div className='timer'>{new Date(time * 1000).toISOString().substr(11, 8)}</div>
                                <SoundWave />
                            </>
                        )}
                        {!isRecording && rewrittenTranscript && (
                            <div style={{overflowY: 'scroll'}}>
                                <h3>Transcript:</h3>
                                <pre style={{ whiteSpace: 'pre-wrap' }}>{rewrittenTranscript}</pre>
                                <div className='Btn-div'>
                                    <button className='append-note-button' onClick={handleAppendNote}>Append a note</button>
                                </div>
                            </div>
                        )}
                        <div>
                            {status ? (
                                <>
                                    <div className='TranscribeAI_icons'>
                                        <div style={{ cursor: 'pointer' }}><img src='./Images/refresh_icon.png' style={{ width: '30px' }} alt='refresh icon' onClick={handleReset} /></div>
                                        <div style={{ cursor: 'pointer' }} onClick={() => { setStatus(false); stopRecording(); handleStop(); }}><img src='./Images/pause_Btn.png' style={{ width: '100px' }} alt="Stop recording" /></div>
                                        <div onClick={handleCrossIcon}><img style={{ width: '40px' }} src='./Images/cross_icon.png' alt='closs'/></div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='TranscribeAI_icons'>
                                        <div style={{ cursor: 'pointer' }}><img src='./Images/refresh_icon.png' style={{ width: '30px' }} alt='refresh icon' onClick={handleReset} /></div>
                                        <div style={{ cursor: 'pointer' }} onClick={() => { setStatus(false); stopRecording(); handleStop(); }}><img src='./Images/Pause_Btn.png' style={{ width: '40px' }} alt="Stop recording" /></div>
                                        <div style={{ cursor: 'pointer' }} onClick={() => handleCopyClick(rewrittenTranscript)}><img src='./Images/Copy_button.png' style={{ width: '30px' }} alt='copy icon' /></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
               
            </div>
           <div className='saved-transcript'>
                <div className='greeting-div'>
                <h1 className='greeting-container'>Good {timeOfDay}, {userData && (<p>{userData.name}</p>)} <img src='./Images/Star.png' style={{width:'30px'}}/></h1>
                </div>
           <SavedTranscribeText onTranscriptSelect={(id) => setCurrentTranscriptId(id)} />
           </div>

       {showpopup && (

<div className='profile-edit-container'>
<div className='edit-profile'>
{userData && (
<div>
    <p>{userData.name}</p>
    <p>{userData.email}</p>
</div>
)}
    <hr/>
    <button onClick={() => {navigate('/profile-update')}}><FontAwesomeIcon icon={faPenToSquare} />Edit Profile</button>
    <hr/>
    <button onClick={() => {navigate('/plans')}}><FontAwesomeIcon icon={faArrowsRotate} />Upgrade Plan</button>
    <hr/>
    <button onClick={handleLogout}><FontAwesomeIcon icon={faArrowRightFromBracket} /> Log Out</button>
</div>
</div>
       )}
        </div>
    );
}

export default TranscribeAi;
