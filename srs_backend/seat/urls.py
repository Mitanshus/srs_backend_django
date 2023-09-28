from django.contrib import admin
from django.urls import path
from seat.views import create_seat, view_all_seats, delete_seat
urlpatterns = [
    path('create/', create_seat.as_view()),
    path("viewallseats/", view_all_seats.as_view()),
    path('delete/', delete_seat.as_view())
]
