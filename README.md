# RoadEyeApp

Full-stack web application for real-time road monitoring and analysis using computer vision.

## Features

- **Django REST API** with async video processing via Celery
- **React Frontend** with interactive video upload and ROI selection
- **Real-time Updates** via WebSocket (Django Channels)
- **YOLOv8 Detection** with object tracking and motion analysis

## Tech Stack

- Backend: Django, Celery, Redis, Django Channels
- Frontend: React
- Computer Vision: YOLOv8, OpenCV, NumPy
- Database: SQLite3

## Quick Start

### Backend

```bash
cd backendapp
conda create -n roadeye python=3.10 && conda activate roadeye
conda install pytorch torchvision torchaudio cpuonly -c pytorch
conda install -c conda-forge ultralytics django celery djangorestframework django-cors-headers redis
pip install channels-redis
python manage.py migrate
```

### Run (4 terminals)

1. `redis-server`
2. `cd backendapp && celery -A backendapp worker --pool=solo`
3. `cd backendapp && daphne backendapp.asgi:application`
4. `cd frontendapp && npm install && npm start`

## Project Structure

```
backendapp/
├── video_processor/
│   ├── models.py       # Video metadata
│   ├── views.py        # Upload API
│   ├── tasks.py        # Celery processing task
│   └── consumers.py    # WebSocket for progress updates
├── static/             # YOLO model files
└── manage.py

frontendapp/           # React app
```

## How It Works

1. Upload video and select ROI (React frontend)
2. Backend queues processing task (Celery)
3. Worker detects & tracks objects in video
4. Real-time progress via WebSocket
5. Download processed video with annotations

## Related

[RoadEyeModel](https://github.com/ezAldinWaez/RoadEyeModel) - Model training