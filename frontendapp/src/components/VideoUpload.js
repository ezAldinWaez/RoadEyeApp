import React, { useState } from 'react';
import axios from 'axios';
import { Button, LinearProgress } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import RectangleDrawing from './RectangleDrawing'

const VideoUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modelName, setModelName] = useState('none');
  const [uploaded, setUploaded] = useState(false);
  const [roi, setRoi] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleROIChange = (startPoint, endPoint) => {
    setRoi({
      'startPoint': startPoint,
      'endPoint': endPoint
    });
  }

  const handleModelChange = (e) => {
    setModelName(e.target.value);
  };

  const handelResetClick = (e) => {
    setFile(null);
    setUploading(false);
    setModelName('none');
    setUploaded(false);
    setRoi(null);
  }

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('model', modelName);
    formData.append('x1', roi.startPoint.x);
    formData.append('y1', roi.startPoint.y);
    formData.append('x2', roi.endPoint.x);
    formData.append('y2', roi.endPoint.y);

    try {
      const response = await axios.post('http://localhost:8000/api/upload/', formData);
      onUploadSuccess(response.data.task_id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploaded(true);
    }
  };

  return (
    <div style={{ padding: '20px', margin: 'auto', textAlign: 'center' }}>
      <input
        accept="video/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file" style={{margin: '10px'}}>
        <Button variant="contained" color="primary" component="span">
          <CloudUpload />
          <span style={{ marginLeft: '10px' }}>Select The Video</span>
        </Button>
      </label>
      <input type='text' disabled value={file?.name || ' '} style={{border: 'none', textAlign: 'center'}}/>
      <div/>
      <span>
        <select
          name='model-selection'
          className="select"
          value={modelName}
          onChange={handleModelChange}
          style={{
            margin: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            width: '206px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          <option selected hidden> Select The Model</option>
          <option value="pretrained_e50">Pretrained</option>
          <option value="non_pretrained_e50">Non-Pretrained</option>
          <option value="preprocessed_pretrained_e50">Preprocessed Pretrained</option>
        </select>
      </span>
      <label htmlFor="reset-button" style={{margin: '10px'}}>
        <Button variant="contained" component="span" onClick={handelResetClick}>
            <CloudUpload />
            <span style={{ marginRight: '20px', marginLeft: '20px'}}>Reset</span>
          </Button>
      </label>
      { file && !uploaded &&
        <div style={{margin: '20px'}}>
          <h4>Select The Region of Interest 👇🏻</h4>
          <RectangleDrawing videoFile={file} onRectangleDrawn={handleROIChange}/>
        </div>
      }
      <div/>
      {file && roi &&modelName !== 'none'&& !uploading && !uploaded &&(
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
