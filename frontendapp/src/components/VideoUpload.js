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

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);

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
          <CloudUpload /> Select Video
        </Button>
      </label>
      {file && (
        <Button onClick={handleUpload} disabled={uploading} variant="contained" color="secondary">
          Upload
        </Button>
      )}
      {uploading && <LinearProgress />}
    </div>
  );
};

export default VideoUpload;
