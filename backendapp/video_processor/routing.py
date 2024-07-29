from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/video/(?P<task_id>[\w-]+)/$', consumers.VideoProcessingConsumer.as_asgi()),
]