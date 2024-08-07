// import React, { useRef, useEffect, useState } from 'react';  

// const RectangleDrawing = ({ videoUrl, onRectanglesSubmit }) => {  
//   const canvasRef = useRef(null);  
//   const [rectangles, setRectangles] = useState([]);  
//   const [drawing, setDrawing] = useState(false);  
//   const [startPoint, setStartPoint] = useState(null);  

//   useEffect(() => {  
//     const canvas = canvasRef.current;  
//     const context = canvas.getContext('2d');  

//     const drawRect = (rect) => {  
//       context.strokeStyle = 'red';  
//       context.strokeRect(rect.x, rect.y, rect.width, rect.height);  
//     };  

//     const clearCanvas = () => {  
//       context.clearRect(0, 0, canvas.width, canvas.height);  
//       rectangles.forEach(drawRect);  
//     };  

//     clearCanvas();  
//   }, [rectangles]);  

//   const handleMouseDown = (e) => {  
//     const canvas = canvasRef.current;  
//     const rect = canvas.getBoundingClientRect();  
//     const x = e.clientX - rect.left;  
//     const y = e.clientY - rect.top;  
//     setStartPoint({ x, y });  
//     setDrawing(true);  
//   };  

//   const handleMouseMove = (e) => {  
//     if (!drawing || !startPoint) return;  

//     const canvas = canvasRef.current;  
//     const context = canvas.getContext('2d');  
//     const rect = canvas.getBoundingClientRect();  
//     const x = e.clientX - rect.left;  
//     const y = e.clientY - rect.top;  

//     context.clearRect(0, 0, canvas.width, canvas.height);  
//     rectangles.forEach((rect) => drawRect(rect));  
//     context.strokeStyle = 'red';  
//     context.strokeRect(startPoint.x, startPoint.y, x - startPoint.x, y - startPoint.y);  
//   };  

//   const handleMouseUp = (e) => {  
//     if (!drawing || !startPoint) return;  

//     const canvas = canvasRef.current;  
//     const rect = canvas.getBoundingClientRect();  
//     const x = e.clientX - rect.left;  
//     const y = e.clientY - rect.top;  

//     const width = x - startPoint.x;  
//     const height = y - startPoint.y;  

//     setRectangles((prev) => [  
//       ...prev,  
//       {  
//         x: startPoint.x,  
//         y: startPoint.y,  
//         width,  
//         height,  
//       },  
//     ]);  
    
//     setDrawing(false);  
//     setStartPoint(null);  
//   };  

//   const handleSubmit = () => {  
//     onRectanglesSubmit(rectangles);  
//     setRectangles([]); // Clear rectangles after submission  
//   };  

//   return (  
//     <div>  
//       <h3>Draw Rectangles on First Frame</h3>  
//       <canvas  
//         ref={canvasRef}  
//         width={640}  
//         height={360}  
//         style={{ border: '1px solid black' }}  
//         onMouseDown={handleMouseDown}  
//         onMouseMove={handleMouseMove}  
//         onMouseUp={handleMouseUp}  
//       />  
//       <div style={{ marginTop: '10px' }}>  
//         <button onClick={handleSubmit}>Submit Rectangles</button>  
//       </div>  
//       <img src={videoUrl} alt="First Frame" style={{ maxWidth: '100%', marginTop: '10px' }} />  
//     </div>  
//   );  
// };  

// export default RectangleDrawing;

import React, { useRef, useEffect, useState } from 'react';  

const RectangleDrawer = ({ videoFile, onRectangleDrawn }) => {  
  const canvasRef = useRef(null);  
  const videoRef = useRef(null);  
  const [drawing, setDrawing] = useState(false);  
  const [startPoint, setStartPoint] = useState(null);  
  const [endPoint, setEndPoint] = useState(null);  

  useEffect(() => {  
    const videoElement = videoRef.current;  
    const canvasElement = canvasRef.current;  
    const context = canvasElement.getContext('2d');  

    if (videoElement) {  
      videoElement.addEventListener('loadeddata', () => {  
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);  
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);  
      });  
    }  
  }, [videoFile]);  

  const handleMouseDown = (e) => {  
    const rect = canvasRef.current.getBoundingClientRect();  
    const x = e.clientX - rect.left;  
    const y = e.clientY - rect.top;  
    setStartPoint({ x, y });  
    setDrawing(true);  
  };  

  const handleMouseMove = (e) => {  
    if (!drawing) return;  
    const rect = canvasRef.current.getBoundingClientRect();  
    const x = e.clientX - rect.left;  
    const y = e.clientY - rect.top;  
    setEndPoint({ x, y });  
  };  

  const handleMouseUp = () => {  
    setDrawing(false);  
    if (startPoint && endPoint) {  
      onRectangleDrawn(startPoint, endPoint);  
    }  
  };  

  return (  
    <div>  
      <video ref={videoRef} src={URL.createObjectURL(videoFile)} style={{ display: 'none' }} />  
      <canvas  
        ref={canvasRef}  
        width={640}  
        height={360}  
        onMouseDown={handleMouseDown}  
        onMouseMove={handleMouseMove}  
        onMouseUp={handleMouseUp}  
        style={{ border: '1px solid black', cursor: 'crosshair' }}  
      />  
      {drawing && startPoint && endPoint && (  
        <canvas  
          ref={canvasRef}  
          width={640}  
          height={360}  
          style={{ position: 'absolute', top: 0, left: 0 }}  
        >  
          {ctx => {  
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  
            ctx.drawImage(videoRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);  
            ctx.beginPath();  
            ctx.rect(startPoint.x, startPoint.y, endPoint.x - startPoint.x, endPoint.y - startPoint.y);  
            ctx.strokeStyle = 'red';  
            ctx.lineWidth = 2;  
            ctx.stroke();  
          }}  
        </canvas>  
      )}  
    </div>  
  );  
};  

export default RectangleDrawer;