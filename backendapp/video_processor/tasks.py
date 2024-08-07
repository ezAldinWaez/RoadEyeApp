import numpy as np
import cv2 as cv
from celery import shared_task
from .models import Video
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ultralytics import YOLO
from collections import defaultdict
from django.core.files.storage import default_storage
from scipy.signal import savgol_filter
from math import atan2, degrees


@shared_task(bind=True)
def process_video(self, file_path: str, video_id, model_name:str):
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
    capFrameCount = int(capture.get(cv.CAP_PROP_FRAME_COUNT))
    capFrameWidth = int(capture.get(cv.CAP_PROP_FRAME_WIDTH))
    capFrameHight = int(capture.get(cv.CAP_PROP_FRAME_HEIGHT))
    capTimeStep = 1 / capFps

    output_path = file_path.rsplit('.', 1)[0] + '_predected.mp4'
    writer = cv.VideoWriter(
        filename=output_path,
        fourcc=cv.VideoWriter_fourcc(*'XVID'),
        fps=capFps,
        frameSize=(capFrameWidth, capFrameHight))

    model = YOLO(f"../static/models/{model_name}.pt")
    # model = YOLO(f"C:/Users/Mohammad_Ghannam/Desktop/RoadEyeApp/backendapp/static/models/{model_name}.pt")

    count = 0
    while capture.isOpened():
        count += 1

        success, frame = capture.read()
        if not success:
            break

        timestamp = count * capTimeStep

        statistics = {
            "frame_num": int(count),
            "time_in_video": float(count / capFps),
            "objects": []
        }

        roi_x, roi_y = 0, 100
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
            track_ids = results[0].boxes.id.int().cpu().tolist()
            boxes = results[0].boxes.xywh.cpu()
            # scores = results[0].boxes.conf.cpu().numpy()
            # detections = np.hstack((boxes, scores[:, np.newaxis]))

            speeds, angles = calculate_current_motions(track_history, num_points=5)

            for track_id, (x, y, w, h) in zip(track_ids, boxes):
                track_history[track_id].append((timestamp, float(x), float(y)))

                x1 = int(x) - int(w / 2)
                x2 = x1 + w
                y1 = int(y) - int(h / 2)
                y2 = y1 + h

                # Draw the tracking lines
                track_history_points = np.array([(x, y) for _, x, y in track_history[track_id]])
                history_points = np.hstack(track_history_points).astype(np.int32).reshape((-1, 1, 2))
                cv.polylines(
                    img=roi,
                    pts=[history_points],
                    isClosed=False,
                    color=(0, 0, 255),
                    thickness=3)

                # Draw the smoothed tracking lines
                track_history_points_smoothed = np.array([(x, y) for _, x, y in smooth_path(track_history[track_id])])
                history_points_smoothed = np.hstack(track_history_points_smoothed).astype(np.int32).reshape((-1, 1, 2))
                cv.polylines(
                    img=roi,
                    pts=[history_points_smoothed],
                    isClosed=False,
                    color=(0, 255, 0),
                    thickness=2)

                cv.rectangle(
                    img=roi,
                    pt1=(int(x1), int(y1)),
                    pt2=(int(x2), int(y2)),
                    color=(0, 0, 255),
                    thickness=2)

                text = f"ID: {track_id}"
                fontFace = cv.FONT_HERSHEY_SIMPLEX
                fontScale = 1
                text_width = cv.getTextSize(
                    text, fontFace, fontScale, thickness=2)[0][0]
                cv.putText(
                    img=frame,
                    text=text,
                    org=(int((roi_x + x1 + w / 2 - text_width / 2)), int(roi_y + y1 - 10)),
                    fontFace=fontFace,
                    fontScale=fontScale,
                    color=(0, 0, 255),
                    thickness=2)

                speed = speeds.get(track_id, 0)
                angle = angles.get(track_id, 0)

                # Draw the speed vector
                speed_v_end = (
                    int(x + .5 * speed * np.cos(angle * np.pi / 180)),
                    int(y + .5 * speed * np.sin(angle * np.pi / 180)))
                cv.arrowedLine(
                    img=roi,
                    pt1=(int(x), int(y)),
                    pt2=speed_v_end,
                    color=(0, 0, 0),
                    thickness=2)
                
                # Save the statistics
                statistics["objects"].append({
                    "id": int(track_id),
                    "cntr_x": int(x),
                    "cntr_y": int(y),
                    "width": int(w),
                    "hight": int(h),
                    # "conf": float(confidence),
                    "speed": float(speed),
                    "speed_angle": float(angle),
                    # "accel": float(abs(acceleration)),
                    # "accel_angle": float(direction) if acceleration > 0 else float(direction + 180),
                    })

        writer.write(frame)
        frame_file_name = f'frame_{count}.jpg'
        cv.imwrite(f"{default_storage.location}/images/{frame_file_name}", frame)

        update = {
            'progress': (count + 1) / capFrameCount * 100,
            'frame_url': f'http://localhost:8000/media/images/{frame_file_name}',
            'details': statistics
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


    org_video_name = file_path.rsplit('/', 1)[-1]
    out_video_name = output_path.rsplit('/', 1)[-1]
    
    async_to_sync(channel_layer.group_send)(
        f'video_{video.task_id}',
        {
            'type': 'processing_update',
            'message': {
                'progress': 100.0,
                'frame_url': f'http://localhost:8000/media/images/frame_{capFrameCount}.jpg',
                'video_url_org': f'http://localhost:8000/media/videos/{org_video_name}',
                'video_url_out': f'http://localhost:8000/media/videos/{out_video_name}'
            }
        }
    )
    
    video.processed = True
    video.processed_at = timezone.now()
    video.file.name = out_video_name
    video.save()


    return {'details': 'Video processing completed', 'progress': 100}


def calculate_current_motions(track_history, num_points=5):
    speeds = {}
    angles = {}
    for track_id, data in track_history.items():
        if len(data) <= num_points:
            continue
        smoothed_data = smooth_path(data)
        speeds[track_id], angles[track_id] = calculate_current_motion(smoothed_data, num_points)
    return speeds, angles


def calculate_current_motion(data, num_points):
    num_points = min(num_points, len(data))
    recent_data = data[-num_points:]

    timestamps = np.array([point[0] for point in recent_data])
    positions = np.array([(point[1], point[2]) for point in recent_data])

    time_intervals = np.diff(timestamps)
    displacements = np.diff(positions, axis=0)

    velocities = displacements / time_intervals[:, np.newaxis]

    weights = np.arange(1, len(velocities) + 1)
    weighted_velocity = np.average(velocities, axis=0, weights=weights)

    speed = np.linalg.norm(weighted_velocity)

    direction = degrees(atan2(weighted_velocity[1], weighted_velocity[0]))

    return speed, direction

def smooth_path(data, window_length=10, poly_order=2):
    
    if window_length > len(data) or window_length <= poly_order:
        window_length = len(data) - 1

    if window_length <= poly_order:
            return data        

    timestamps = np.array([point[0] for point in data])
    positions = np.array([(point[1], point[2]) for point in data])
    
    smoothed_x = savgol_filter(positions[:, 0], window_length, poly_order)
    smoothed_y = savgol_filter(positions[:, 1], window_length, poly_order)
    
    return list(zip(timestamps, smoothed_x, smoothed_y))


# def calculate_speed(track_history, fps):
#     speeds = {}
#     for track_id, history in track_history.items():
#         if len(history) >= 2:
#             x1, y1 = history[-2]
#             x2, y2 = history[-1]
#             distance = np.sqrt((x2 - x1)**2 + (y2 - y1)**2)
#             speed = distance * fps
#             speeds[track_id] = speed
#     return speeds


# def calculate_acceleration(track_history, fps):
#     acceleration = {}
#     for track_id, track in track_history.items():
#         if len(track) > 1:
#             speeds = []
#             for i in range(1, len(track)):
#                 x1, y1 = track[i - 1]
#                 x2, y2 = track[i]
#                 distance = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
#                 speed = distance * fps
#                 speeds.append(speed)
#             if len(speeds) > 1:
#                 acceleration_values = []
#                 for i in range(1, len(speeds)):
#                     acc = (speeds[i] - speeds[i - 1]) * fps
#                     acceleration_values.append(acc)
#                 acceleration[track_id] = acceleration_values[-1]
#             else:
#                 acceleration[track_id] = 0
#         else:
#             acceleration[track_id] = 0
#     return acceleration


# def calculate_direction(track_history):
#     directions = {}
#     for track_id, history in track_history.items():
#         if len(history) >= 2:
#             x1, y1 = history[-2]
#             x2, y2 = history[-1]
#             dx, dy = x2 - x1, y2 - y1
#             angle = np.arctan2(dy, dx) * 180 / np.pi
#             directions[track_id] = angle
#     return directions
