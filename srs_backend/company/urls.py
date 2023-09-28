from django.contrib import admin
from django.urls import path

from.views import create_company,view_all_company

urlpatterns = [
    path('create/',create_company.as_view()),
    path('viewallcompany/',view_all_company.as_view())
]