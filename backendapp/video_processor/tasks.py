import json
from celery import shared_task
from .models import Video
from django.utils import timezone
import time
import subprocess
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task(bind=True)
def process_video(self, file_path, video_id):
    channel_layer = get_channel_layer()
    try:
        video = Video.objects.get(id=video_id)
        
        # Simulate video processing steps
        total_steps = 5
        for step in range(total_steps):
            time.sleep(2)  # Simulate work
            progress = (step + 1) / total_steps * 100
            update = {'progress': progress, 'details': f'Processing step {step + 1} of {total_steps}'}
            
            # Send update through WebSocket
            async_to_sync(channel_layer.group_send)(
                f'video_{self.request.id}',
                {
                    'type': 'processing_update',
                    'message': update
                }
            )
            
            self.update_state(state='PROGRESS', meta=update)

        # Get video information using ffprobe
        info = get_video_info(file_path)
        
        # Perform actual video processing (e.g., compression, format conversion)
        output_path = process_video_file(file_path)
        
        # Update video object with processed information
        video.processed = True
        video.duration = info.get('duration')
        video.resolution = info.get('resolution')
        video.format = info.get('format')
        video.processed_at = timezone.now()
        video.file.name = output_path.rsplit('/', 1)[-1]
        video.save()

        async_to_sync(channel_layer.group_send)(
            f'video_{video.task_id}',
            {
                'type': 'processing_update',
                'message': {
                    'progress': 100,
                    'details': 'Processing complete',
                    'video_url': f'http://localhost:8000/media/videos/{video.file.name}'
                }
            }
        )
        return {'details': 'Video processing completed', 'progress': 100}
    except Video.DoesNotExist:
        return {'details': 'Video not found'}
    except Exception as e:
        return {'details': f'Error occurred: {str(e)}'}

def get_video_info(file_path):
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        file_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    data = json.loads(result.stdout)

    video_stream = next((s for s in data['streams'] if s['codec_type'] == 'video'), None)
    
    return {
        'duration': float(data['format']['duration']),
        'resolution': f"{video_stream['width']}x{video_stream['height']}",
        'format': data['format']['format_name']
    }

def process_video_file(input_path):
    output_path = input_path.rsplit('.', 1)[0] + '_processed.mp4'
    cmd = [
        'ffmpeg',
        '-i', input_path,
        '-vcodec', 'libx264',
        '-acodec', 'aac',
        output_path
    ]
    subprocess.run(cmd, check=True)
    return output_path