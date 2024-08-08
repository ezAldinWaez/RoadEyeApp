import React from 'react';  
import VideoUpload from "../VideoUpload";  
import './UploadSection.css';  

const UploadSection = ({ onUploadSuccess }) => {  
    return (  
        <div className='main' id='try-it'>  
            <h2>Try It</h2>  
            <div className='upf' style={{margin: 'auto'}}>  
                <VideoUpload onUploadSuccess={onUploadSuccess} />  
            </div>  
        </div>  
    );  
};

export default UploadSection;