// import React, { useState } from 'react';  
// import axios from 'axios';  
// import ProcessingStatus from '../ProcessingStatus';  
// import VideoPlayer from '../VideoPlayer';  
// import './Upload.css';  

// function Uploadf() {  
//     const [taskId, setTaskId] = useState(null);  
//     const [videoUrl, setVideoUrl] = useState(null);  
//     const [progressbar, setProgressbar] = useState(0);  

//     const handleUploadSuccess = (newTaskId) => {  
//         console.log('Upload success, taskId:', newTaskId);  
//         setTaskId(newTaskId);
//         setVideoUrl(null);
//         setProgressbar(0);   
//     };  

//     const handleFileChange = (event) => {  
//         event.preventDefault();  
//         const file = event.target.files[0];  
//         const formData = new FormData();  
//         formData.append('video', file);  

//         axios.post('http://localhost:8000/api/upload/', formData, {  
//             headers: {  
//                 "Content-Type": "multipart/form-data"  
//             },  
//             onUploadProgress: (event) => {  
//                 const percent = Math.round((100 * event.loaded) / event.total);  
//                 setProgressbar(percent);  
//             }  
//         })  
//         .then(response => {  
//             console.log('Response from server:', response.data); // Log the entire response  
//             handleUploadSuccess(response.data.taskId);   
//         })
//         .catch(err => console.error(err));  
//     };  

//     const handleProcessingComplete = (url) => {  
//         console.log('Processing complete, video URL:', url);  
//         setVideoUrl(url); // Set the video URL when processing is complete  
//     };  

//     return (  
//         <div className='upload-container'>  
//             <h2 className='upload-title'>Upload Your Video</h2>  
//             <div className='upload-area'>  
//                 <div className='upload-prompt'>Select an MP4 file to upload:</div>  
//                 <label className='custom-file-upload'>  
//                     <input  
//                         type='file'  
//                         accept="video/mp4"  
//                         onChange={handleFileChange}  
//                     />  
//                     <span className='upload-button'>Choose File</span>  
//                 </label>  
//                 <div className='progress-container'>  
//                     <div className='progress' style={{ height: '12px' }}>  
//                         <div  
//                             className='progress-bar'  
//                             style={{ width: `${progressbar}%` }}  
//                         />  
//                     </div>  
//                     <span className='progress-text'>{progressbar}%</span>  
//                 </div>  
//             </div> 
//             {console.log(taskId, videoUrl)}
//             {taskId && !videoUrl && (  
//                 <ProcessingStatus   
//                     taskId={taskId}   
//                     onProcessingComplete={handleProcessingComplete}   
//                 />  
//             )}  
//             {videoUrl && <VideoPlayer videoUrl={videoUrl} />}  
//         </div>    
//     );  
// }  

// export default Uploadf;

// import React, { useState } from 'react';  
// import axios from 'axios';  
// import ProcessingStatus from '../ProcessingStatus';  
// import VideoPlayer from '../VideoPlayer';  
// import './Upload.css';  

// function Uploadf() {  
//     const [taskId, setTaskId] = useState(null);  
//     const [videoUrl, setVideoUrl] = useState(null);  
//     const [progressbar, setProgressbar] = useState(0);  

//     const handleUploadSuccess = (newTaskId) => {  
//         if (!newTaskId) {  
//             console.error('Received undefined taskId');  
//             return; // You may set an error state here if needed  
//         }  
//         console.log('Upload success, taskId:', newTaskId);  
//         setTaskId(newTaskId);  
//         setVideoUrl(null);  
//         setProgressbar(0);   
//     };  

//     const handleFileChange = (event) => {  
//         event.preventDefault();  
//         const file = event.target.files[0];  

//         // Check if the file is selected  
//         if (!file) {  
//             console.error('No file selected');  
//             return;  
//         }  

//         const formData = new FormData();  
//         formData.append('video', file);  

//         axios.post('http://localhost:8000/api/upload/', formData, {  
//             headers: {  
//                 "Content-Type": "multipart/form-data"  
//             },  
//             onUploadProgress: (event) => {  
//                 const percent = Math.round((100 * event.loaded) / event.total);  
//                 setProgressbar(percent);  
//             }  
//         })  
//         .then(response => {  
//             // Log the entire response for debugging  
//             console.log('Response from server:', response.data.task_id); 
//             if (response.data.task_id) {
//                 console.log('Response from server: if', response.data.task_id);   
//                 handleUploadSuccess(response.data.task_id);   
//             } else {  
//                 console.error('No taskId returned from server');  
//             }  
//         })  
//         .catch(err => {  
//             console.error('Error uploading video:', err);  
//         });  
//     };  

//     const handleProcessingComplete = (url) => {  
//         console.log('Processing complete, video URL:', url);  
//         setVideoUrl(url); // Set the video URL when processing is complete  
//     };  

//     return (  
//         <div className='upload-container'>  
//             <h2 className='upload-title'>Upload Your Video</h2>  
//             <div className='upload-area'>  
//                 <div className='upload-prompt'>Select an MP4 file to upload:</div>  
//                 <label className='custom-file-upload'>  
//                     <input  
//                         type='file'  
//                         accept="video/mp4"  
//                         onChange={handleFileChange}  
//                     />  
//                     <span className='upload-button'>Choose File</span>  
//                 </label>  
//                 <div className='progress-container'>  
//                     <div className='progress' style={{ height: '12px' }}>  
//                         <div  
//                             className='progress-bar'  
//                             style={{ width: `${progressbar}%` }}  
//                         />  
//                     </div>  
//                     <span className='progress-text'>{progressbar}%</span>  
//                 </div>  
//             </div>   
//             {taskId && !videoUrl && (  
//                 <ProcessingStatus   
//                     taskId={taskId}   
//                     onProcessingComplete={handleProcessingComplete}   
//                 />  
//             )}  
//             {videoUrl && <VideoPlayer videoUrl={videoUrl} />}  
//         </div>    
//     );  
// }  

// export default Uploadf;

import React, { useState } from 'react';  
import axios from 'axios';  
import ProcessingStatus from '../ProcessingStatus';  
import VideoPlayer from '../VideoPlayer';  
import './Upload.css';  

function Uploadf() {  
    const [taskId, setTaskId] = useState(null);  
    const [videoUrl, setVideoUrl] = useState(null);  
    const [progressbar, setProgressbar] = useState(0);  

    const handleUploadSuccess = (newTaskId) => {  
        if (!newTaskId) {  
            console.error('Received undefined taskId');  
            return;  
        }  
        console.log('Upload success, taskId:', newTaskId);  
        setTaskId(newTaskId);  
        setVideoUrl(null);  
        setProgressbar(0);   
    };  

    const handleFileChange = (event) => {  
        event.preventDefault();  
        const file = event.target.files[0];  

        if (!file) {  
            console.error('No file selected');  
            return;  
        }  

        const formData = new FormData();  
        formData.append('video', file);  

        axios.post('http://localhost:8000/api/upload/', formData, {  
            headers: {  
                "Content-Type": "multipart/form-data"  
            },  
            onUploadProgress: (event) => {  
                const percent = Math.round((100 * event.loaded) / event.total);  
                setProgressbar(percent);  
            }  
        })  
        .then(response => {  
            console.log('Response from server:', response.data.task_id);   
            if (response.data.task_id) {  
                console.log('Response from server: if', response.data.task_id);   
                handleUploadSuccess(response.data.task_id);   
            } else {  
                console.error('No taskId returned from server');  
            }  
        })  
        .catch(err => {  
            console.error('Error uploading video:', err);  
        });  
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
                <ProcessingStatus   
                    taskId={taskId}   // Using taskId correctly  
                    onProcessingComplete={handleProcessingComplete}   
                />  
            )}  
            {videoUrl && <VideoPlayer videoUrl={videoUrl} />}  
        </div>    
    );  
}  

export default Uploadf;