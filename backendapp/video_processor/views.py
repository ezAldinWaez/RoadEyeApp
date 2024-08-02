from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Video
from .tasks import process_video
from django.core.files.storage import default_storage
from celery.result import AsyncResult
import os

import os
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.uploadedfile import UploadedFile

class VideoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        video_file = request.FILES.get('video')
        if not video_file:
            return Response({'error': 'No video file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate file type and size
        if not self.is_valid_video(video_file):
            return Response({'error': 'Invalid video file'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the video file
        file_name = default_storage.save(f'videos/{video_file.name}', video_file)
        file_path = os.path.join(default_storage.location, file_name)
        
        # Create a Video object
        video = Video.objects.create(file=file_name)
        
        # Start the processing task
        task = process_video.delay(file_path, video.id)
        
        # Update the Video object with the task ID
        video.task_id = task.id
        video.save()
        
        return Response({'task_id': task.id}, status=status.HTTP_202_ACCEPTED)

    def is_valid_video(self, file: UploadedFile) -> bool:
        # Check file type
        valid_types = ['video/mp4', 'video/avi', 'video/mov']
        if file.content_type not in valid_types:
            return False
        
        # Check file size (e.g., max 100 MB)
        if file.size > 100 * 1024 * 1024:
            return False
        
        return True

class ProcessingStatusView(APIView):
    def get(self, request, task_id):
        task = AsyncResult(task_id)
        
        if task.state == 'PENDING':
            response = {
                'state': 'Pending',
                'details': 'Video processing is queued.',
                'progress': 0
            }
        elif task.state == 'PROGRESS':
            response = {
                'state': 'Processing',
                'details': task.info.get('details', ''),
                'progress': task.info.get('progress', 0)
            }
        elif task.state == 'SUCCESS':
            response = {
                'state': 'Completed',
                'details': 'Video processing is complete.',
                'progress': 100
            }
        else:
            response = {
                'state': 'Error',
                'details': str(task.info),
                'progress': 0
            }
        
        return Response(response)


class ResultView(APIView):
    def get(self, request, task_id):
        try:
            video = Video.objects.get(task_id=task_id)
            if video.processed:
                return Response({
                    'video_url': request.build_absolute_uri(video.file.url),
                    'processed': True,
                    'duration': video.duration,
                    'resolution': video.resolution,
                    'format': video.format,
                    'created_at': video.created_at,
                    'processed_at': video.processed_at
                })
            else:
                return Response({'processed': False, 'message': 'Video is still processing'})
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)