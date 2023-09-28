from django.contrib import admin
from django.urls import path
from .views import create_location,view_all_location

urlpatterns = [
    path('create/',create_location.as_view()),
    path('viewalllocation/',view_all_location.as_view()),
]