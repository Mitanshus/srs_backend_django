from django.contrib import admin
from django.urls import path
from reservation.views import create_reservation_view, view_reservation_view, delete_reservation_view

urlpatterns = [
    path('create/', create_reservation_view.as_view()),
    path('viewallreservations/', view_reservation_view.as_view()),
    path('delete/', delete_reservation_view.as_view())
]
