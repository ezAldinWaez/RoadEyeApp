import React, { useState } from 'react';
import axios from 'axios';
import { Button, LinearProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const VideoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    let modelName = 'pretrained_e50' //TODO: Set it from user

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('model', modelName)

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData);
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        accept="video/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" color="primary" component="span">
          <CloudUpload /> 
          <span style={{marginLeft: '10px'}}>Select Video</span>
        </Button>
      </label>
      <span style={{margin: '10px'}}></span>
      {file && (
        <Button onClick={handleUpload} disabled={uploading} variant="contained" color="secondary">
          Upload
        </Button>
      )}
      <span style={{display: 'block', margin: '10px'}}></span>
      {uploading && <LinearProgress />}
    </div>
  );
};

export default VideoUpload;
