import React, { useState } from 'react';
import axios from 'axios';
import { Button, LinearProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const VideoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modelName, setModelName] = useState('none');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleModelChange = (e) => {
    setModelName(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('model', modelName);

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
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
          <span style={{ marginLeft: '10px' }}>Select The Video</span>
        </Button>
      </label>
      <div style={{ margin: '10px 0' }}>
        <select
          name='model-selection'
          className="select"
          value={modelName}
          onChange={handleModelChange}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '206px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          <option selected hidden> Select The Model</option>
          <option value="pretrained_e50">pretrained_e50</option>
          <option value="non_pretrained_50">non_pretrained_50</option>
          <option value="preprocessed_pretrained_e50">preprocessed_pretrained_e50</option>
        </select>
      </div>
      {file && modelName !== 'none' &&(
        <Button
          onClick={handleUpload}
          disabled={uploading}
          variant="contained"
          color="secondary"
          style={{ margin: '10px' }}
        >
          Upload
        </Button>
      )}
      <div style={{width: '80%', margin: 'auto'}}>
        {uploading && <LinearProgress />}
      </div>
    </div>
  );
};

export default VideoUpload;
