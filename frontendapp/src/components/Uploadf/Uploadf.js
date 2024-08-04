import React, { useState } from 'react';  
import axios from 'axios';  
import ProcessingSection from '../ProcessingSection/ProcessingSection';  
import VideoPlayer from '../VideoPlayer';  
import './Upload.css';  

function Uploadf() {  
    const [taskId, setTaskId] = useState(null);  
    const [videoUrl, setVideoUrl] = useState(null);  
    const [progressbar, setProgressbar] = useState(0);  

    const handleUploadSuccess = (newTaskId) => {  
        console.log('Upload success, taskId:', newTaskId);  
        setTaskId(newTaskId);  
        setVideoUrl(null);  
        setProgressbar(0);   
    };  

    const handleFileChange = (event) => {  
        const file = event.target.files[0];  
        const formData = new FormData();  
        formData.append('file', file);  

        // Replace 'url' with your actual backend URL  
        axios.post('url', formData, {  
            headers: {  
                "Content-Type": "multipart/form-data"  
            },  
            onUploadProgress: (event) => {  
                const percent = Math.round((100 * event.loaded) / event.total);  
                setProgressbar(percent);  
            }  
        })  
        .then(response => {  
            handleUploadSuccess(response.data.taskId);   
        })  
        .catch(err => console.log(err));  
    };  

    const handleProcessingComplete = (url) => {  
        console.log('Processing complete, video URL:', url);  
        setVideoUrl(url);  
    };  

    return (  
        <div className='upload-container'>  
            <h2 className='upload-title'>Upload Your Video</h2>  
            <div className='upload-area'>  
                <div className='upload-prompt'>Select an MP4 file to upload:</div>  
                <label className='custom-file-upload'>  
                    <input  
                        type='file'  
                        accept="video/mp4"  
                        onChange={handleFileChange}  
                    />  
                    <span className='upload-button'>Choose File</span>  
                </label>  
                <div className='progress-container'>  
                    <div className='progress' style={{ height: '12px' }}>  
                        <div  
                            className='progress-bar'  
                            style={{ width: `${progressbar}%` }}  
                        />  
                    </div>  
                    <span className='progress-text'>{progressbar}%</span>  
                </div>  
            </div>  
            {taskId && !videoUrl && (  
                <ProcessingSection   
                    taskId={taskId}   
                    onProcessingComplete={handleProcessingComplete}   
                />  
            )}  
            {videoUrl && <VideoPlayer videoUrl={videoUrl} />}  
        </div>    
    );

}

export default Uploadf;