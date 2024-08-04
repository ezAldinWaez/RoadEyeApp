import numpy as np
import cv2 as cv
from celery import shared_task
from .models import Video
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ultralytics import YOLO
from collections import defaultdict


@shared_task(bind=True)
def process_video(self, file_path: str, video_id):
    try:
        video = Video.objects.get(id=video_id)
    except Video.DoesNotExist:
        return {'details': 'Video not found'}
    except Exception as e:
        return {'details': f'Error occurred: {str(e)}'}

    channel_layer = get_channel_layer()
    track_history = defaultdict(lambda: [])

    capture = cv.VideoCapture(file_path)
    capFps = capture.get(cv.CAP_PROP_FPS)
    capFrameCount = capture.get(cv.CAP_PROP_FRAME_COUNT)
    capFrameWidth = int(capture.get(cv.CAP_PROP_FRAME_WIDTH))
    capFrameHight = int(capture.get(cv.CAP_PROP_FRAME_HEIGHT))

    output_path = file_path.rsplit('.', 1)[0] + '_processed.mp4'
    writer = cv.VideoWriter(
        filename=output_path,
        fourcc=cv.VideoWriter_fourcc(*'XVID'),
        fps=capFps,
        frameSize=(capFrameWidth, capFrameHight))

    # Load the model
    model = YOLO("/backendapp/static/models/pretrained_e50.pt")

    count = 0
    while capture.isOpened():
        count += 1

        statistics = {
            "frame_num": int(count),
            "time_in_video": float(count / capFps),
            "objects": []
        }

        success, frame = capture.read()

        if not success:
            break

        roi_x, roi_y = 0, 200
        roi_w, roi_h = 1100, 1080
        roi = frame[roi_y:roi_h, roi_x:roi_w]

        cv.rectangle(
            img=frame,
            pt1=(int(roi_x), int(roi_y)),
            pt2=(int(roi_w), int(roi_h)),
            color=(95, 150, 124),
            thickness=2)

        results = model.track(source=roi, persist=True)

        if (len(results) > 0) & (results[0].boxes.id != None):
            scores = results[0].boxes.conf.cpu().numpy()
            track_ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xywh.cpu()
            detections = np.hstack((boxes, scores[:, np.newaxis]))

            speeds = calculate_speed(track_history, capFps)
            accelerations = calculate_acceleration(track_history, capFps)
            directions = calculate_direction(track_history)

            for track_id, (x, y, w, h) in zip(track_ids, boxes):
                track_history[track_id].append((float(x), float(y)))

                x1 = int(x) - int(w / 2)
                x2 = x1 + w
                y1 = int(y) - int(h / 2)
                y2 = y1 + h

                speed = speeds.get(track_id, 0)
                acceleration = accelerations.get(track_id, 0)
                direction = directions.get(track_id, 0)

                detection_idx = np.where(
                    (np.abs(detections[:, :4] - [x, y, w, h]) < 1).all(axis=1))[0]
                confidence = detections[detection_idx,
                                        4][0] if detection_idx.size > 0 else 0
                # Draw the object frame
                cv.rectangle(
                    img=roi,
                    pt1=(int(x1), int(y1)),
                    pt2=(int(x2), int(y2)),
                    color=(0, 0, 255),
                    thickness=2)

                # Put the id above the frame
                text = f"ID: {track_id}"
                fontFace = cv.FONT_HERSHEY_SIMPLEX
                fontScale = 1
                text_width = cv.getTextSize(
                    text, fontFace, fontScale, thickness=2)[0][0]
                cv.putText(
                    img=roi,
                    text=text,
                    org=(int((x1 + w / 2 - text_width / 2)), int(y1 - 10)),
                    fontFace=fontFace,
                    fontScale=fontScale,
                    color=(0, 0, 255),
                    thickness=2)

                # Draw the tracking lines
                history_points = np.hstack(track_history[track_id]).astype(
                    np.int32).reshape((-1, 1, 2))
                cv.polylines(
                    img=roi,
                    pts=[history_points],
                    isClosed=False,
                    color=(0, 0, 255),
                    thickness=2)

                # Draw the speed vector
                speed_v = (int(x + speed * np.cos(direction * np.pi / 180)),
                           int(y + speed * np.sin(direction * np.pi / 180)))
                cv.arrowedLine(
                    img=roi,
                    pt1=(int(x), int(y)),
                    pt2=speed_v,
                    color=(0, 0, 0),
                    thickness=2)
                
                # Save the statistics
                statistics["objects"].append({
                    "id": int(track_id),
                    "cntr_x": int(x),
                    "cntr_y": int(y),
                    "width": int(w),
                    "hight": int(h),
                    "conf": float(confidence),
                    "speed": float(speed),
                    "speed_angle": float(direction),
                    "accel": float(abs(acceleration)),
                    "accel_angle": float(direction) if acceleration > 0 else float(direction + 180),
                    })

        writer.write(frame)

        update = {
            'progress': (count + 1) / capFrameCount * 100,
            'details': str(statistics)
        }

        # Send update through WebSocket
        async_to_sync(channel_layer.group_send)(
            f'video_{video.task_id}',
            {
                'type': 'processing_update',
                'message': update
            }
        )
        self.update_state(state='PROGRESS', meta=update)

    capture.release()
    writer.release()

    video.processed = True
    video.processed_at = timezone.now()
    video.file.name = output_path.rsplit('/', 1)[-1]
    video.save()

    async_to_sync(channel_layer.group_send)(
        f'video_{video.task_id}',
        {
            'type': 'processing_update',
            'message': {
                'progress': 100.0,
                'video_url': f'http://localhost:8000/media/videos/{video.file.name}'
            }
        }
    )

    return {'details': 'Video processing completed', 'progress': 100}


def calculate_speed(track_history, fps):
    speeds = {}
    for track_id, history in track_history.items():
        if len(history) >= 2:
            x1, y1 = history[-2]
            x2, y2 = history[-1]
            distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
            speed = distance * fps
            speeds[track_id] = speed
    return speeds


def calculate_acceleration(track_history, fps):
    acceleration = {}
    for track_id, track in track_history.items():
        if len(track) > 1:
            speeds = []
            for i in range(1, len(track)):
                x1, y1 = track[i - 1]
                x2, y2 = track[i]
                distance = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
                speed = distance * fps
                speeds.append(speed)
            if len(speeds) > 1:
                acceleration_values = []
                for i in range(1, len(speeds)):
                    acc = (speeds[i] - speeds[i - 1]) * fps
                    acceleration_values.append(acc)
                acceleration[track_id] = acceleration_values[-1]
            else:
                acceleration[track_id] = 0
        else:
            acceleration[track_id] = 0
    return acceleration


def calculate_direction(track_history):
    directions = {}
    for track_id, history in track_history.items():
        if len(history) >= 2:
            x1, y1 = history[-2]
            x2, y2 = history[-1]
            dx, dy = x2 - x1, y2 - y1
            angle = np.arctan2(dy, dx) * 180 / np.pi
            directions[track_id] = angle
    return directions
