from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.VideoUploadView.as_view(), name='video-upload'),
    path('status/<str:task_id>/', views.ProcessingStatusView.as_view(), name='processing-status'),
    path('result/<str:task_id>/', views.ResultView.as_view(), name='result'),
]