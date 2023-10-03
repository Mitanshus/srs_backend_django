from django.contrib import admin
from django.urls import path
from .views import create_user,create_role,view_all_roles,view_all_users,user_login,view_profile,is_schedule_restricted

urlpatterns = [
    path('create/', create_user.as_view()),
    path('createrole/', create_role.as_view()),
    path('viewallroles/',view_all_roles.as_view()),
    path('viewallusers/',view_all_users.as_view()),
    path('login/',user_login.as_view()),
    path('delete/<uuid:pk>/',create_user.as_view()),
    path('delete/<uuid:pk>/',create_user.as_view()),
    path('profile/',view_profile.as_view()),
    path('isschedulerestricted/',is_schedule_restricted.as_view())


]