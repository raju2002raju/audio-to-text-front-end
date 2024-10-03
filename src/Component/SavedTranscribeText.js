import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Recorder from './Recorder';

let gumStream = null;
let recorder = null;
let audioContext = null;

const SavedTranscribeText = () => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [selectedTranscript, setSelectedTranscript] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isStartRecording, setIsStartRecording] = useState(false);
    const [rewrittenTranscript, setRewrittenTranscript] = useState('');
    const [currentTranscriptId, setCurrentTranscriptId] = useState(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const [status, setStatus] = useState(true);
    const [transcript, setTranscript] = useState('');
    const popupRef = useRef(null);
    const [deleteError, setDeleteError] = useState(null);

    const baseUrl = 'https://audio-to-text-back-end.onrender.com';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/save-transcript`);
                if (Array.isArray(response.data.contacts)) {
                    console.log('Fetched data:', response.data.contacts);
                    setData(response.data.contacts);
                } else {
                    throw new Error('Data format is incorrect or contacts array is missing');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            }
        };

        fetchData();
    }, []);


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

    const handleTranscriptClick = (transcript, id) => {
        console.log("Clicked transcript:", transcript);
        console.log("Clicked transcript ID:", id);
        setSelectedTranscript(transcript);
        setCurrentTranscriptId(id);
        setIsPopupOpen(true);
    };

    const handleAppendNote = () => {
        startRecording(true);
        console.log("Append note for transcript:", selectedTranscript);
    };

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
        const headers = {
            Authorization: `Bearer YOUR_TOKEN`, // Replace with your token
            'Content-Type': 'application/json',
        };
    
        const userEmail = localStorage.getItem('userEmail'); 
    
        if (currentTranscriptId) {
            axios.post(
                `${baseUrl}/auth/append-transcript`,
                { id: currentTranscriptId, transcript, userEmail }, 
                { headers }
            )
            .then(response => {
                console.log("Transcript appended successfully");
            })
            .catch(error => {
                console.error("Error appending transcript:", error);
            });
        } else {
            axios.post(
                `${baseUrl}/save-transcript`,
                { transcript, userEmail },  
                { headers }
            )
            .then(response => {
                console.log("Transcript saved successfully");
                setCurrentTranscriptId(response.data.id);
            })
            .catch(error => {
                console.error("Error saving transcript:", error);
            });
        }
    };
    

    const handleStop = () => {
        setIsRecording(false);
    };
    
    const handleDelete = async () => {
        console.log("Current transcript ID at deletion:", currentTranscriptId);
        if (currentTranscriptId) {
            try {
                console.log('Attempting to delete transcript with ID:', currentTranscriptId);
                const response = await axios.delete(`${baseUrl}/auth/delete-transcript/${currentTranscriptId}`);
                console.log('Delete response:', response);

                if (response.status === 200) {
                    setData(prevData => prevData.filter(item => item._id !== currentTranscriptId));
                    setIsPopupOpen(false);
                    setSelectedTranscript(null);
                    setCurrentTranscriptId(null);
                    setDeleteError(null);
                    console.log('Transcript deleted successfully');
                } else {
                    setDeleteError('Failed to delete transcript. Please try again.');
                    console.error('Unexpected response status:', response.status);
                }
            } catch (error) {
                console.error("Error deleting transcript:", error);
                setDeleteError(`Error deleting transcript: ${error.response?.data?.message || error.message}`);
            }
        } else {
            console.error('No currentTranscriptId set');
            setDeleteError('No transcript selected for deletion');
        }
    };


    const handleCopyClick = () => {
        if (selectedTranscript) {
            navigator.clipboard.writeText(selectedTranscript).then(() => {
                alert('Text copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            alert('No text to copy');
        }
    };

    const handleDownloadAudio = () => {
        if (recorder && recorder.exportWAV) {
            recorder.exportWAV(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'recording.mp3';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            });
        } else {
            alert('No recording available to download');
        }
    };

    return (
        <div className="saved-transcribe-text">
            {data.map((item) => (
                <div 
                    key={item._id} 
                    className="table-row" 
                    onClick={() => handleTranscriptClick(item.transcript, item._id)}
                >
                    <div>{item.transcript.substring(0, 50)}...</div>
                    <div>{new Date(item.createdAt).toLocaleString()}</div>

                </div>
            ))}

            {isPopupOpen && selectedTranscript && (
                <div className="popup-overlay">
                    <div className="popup-content" ref={popupRef}>
                        <button className="close-button" onClick={() => setIsPopupOpen(false)}>×</button>
                        <div className='box-container'> 
                        <div className="transcript-text">{selectedTranscript}</div>
                        <button className="append-note-button" onClick={handleAppendNote}>Append a note</button>
                        </div>
                        <div className='btn-container-div'>
                            <img  src='./Images/delete-btn.png' style={{width:'30px'}} onClick={handleDelete}/>
                            <img  src='./Images/Copy_button.png' style={{width:'30px'}} onClick={handleCopyClick}/>
                         <img src='./Images/Pause_Btn.png' onClick={() => { setStatus(false); stopRecording(); handleStop(); }} style={{ cursor: 'pointer', width:'80px' }}/>
                            <img src='./Images/Download.png' onClick={handleDownloadAudio} style={{width:'40px'}}/>
                        </div>
                        {deleteError && <div className="error-message">{deleteError}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedTranscribeText;