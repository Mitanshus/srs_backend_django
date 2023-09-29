from django.contrib import admin
from django.urls import path
from user_schedule.views import *

urlpatterns = [
    path('create/', user_schedule_view.as_view()),
    path('viewallschedule/', view_all_user_schedule.as_view()),
    path('delete/', delete_user_schedule.as_view()),
    path('viewnonschedule/', view_all_not_scheduled_users.as_view())
]
