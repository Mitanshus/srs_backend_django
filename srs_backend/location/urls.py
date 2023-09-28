from django.contrib import admin
from django.urls import path
from .views import location,view_all_location,LocationByCompanyView

urlpatterns = [
    path('create/',location.as_view()),
    path('viewalllocation/',view_all_location.as_view()),
    path('delete/<uuid:pk>/',location.as_view()),
    path('company/<uuid:company_id>/', LocationByCompanyView.as_view(), name='location-by-company')


]