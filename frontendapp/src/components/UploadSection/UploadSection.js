import React from 'react';
import VideoUpload from "../VideoUpload"
import './UploadSection.css'

const UploadSection = ({ onUploadSuccess }) => {
    return (
        <div className='main'>
            <h2>Try It</h2>
            <VideoUpload onUploadSuccess={onUploadSuccess} />
        </div>
    );
};  

export default UploadSection;