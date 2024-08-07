import React from 'react';  
import VideoUpload from "../VideoUpload";  
import './UploadSection.css';  

const UploadSection = ({ onUploadSuccess }) => {  
    return (  
        <div className='main' id='try-it'>  
            <h2>Try It</h2>  
            <div className='upf'>  
                <div className='text'>  
                    Upload your video here to start processing. Our system will analyze the footage and provide you with detailed insights on vehicle detection and tracking.  
                </div>  
                <div>  
                    <VideoUpload onUploadSuccess={onUploadSuccess} />  
                </div>  
            </div>  
        </div>  
    );  
};

export default UploadSection;