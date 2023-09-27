from django.contrib import admin
from django.urls import path
from .views import create_user

urlpatterns = [
    path('create/', create_user.as_view()),
]