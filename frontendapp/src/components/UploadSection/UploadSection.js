import React from 'react';
import VideoUpload from "../VideoUpload"

const UploadSection = ({ onUploadSuccess }) => {
    return (
        <VideoUpload onUploadSuccess={onUploadSuccess} />

    );
};  

export default UploadSection;