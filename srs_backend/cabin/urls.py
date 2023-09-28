from django.contrib import admin
from django.urls import path
from cabin.views import create_cabin, view_all_cabins, delete_cabin

urlpatterns = [
    path('create/', create_cabin.as_view()),
    path('viewallcabin/', view_all_cabins.as_view()),
    path('delete/', delete_cabin.as_view())
]
