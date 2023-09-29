from django.contrib import admin
from django.urls import path
from reservation.views import create_reservation_view, view_reservation_view, delete_reservation_view,AvailableSeatsView,DashboardSeatsView,GetAllBookingsView,ConfirmPresenceBtnView

urlpatterns = [
    path('create/', create_reservation_view.as_view()),
    path('viewallreservations/', view_reservation_view.as_view()),
    path('delete/', delete_reservation_view.as_view()),
    path('availseats/<uuid:company_id>/<uuid:location_id>/<str:start_date>/<str:end_date>/', AvailableSeatsView.as_view()),
    path('dashboardbookings/',DashboardSeatsView.as_view()),
    path('booking/',GetAllBookingsView.as_view()),
    path('confirmpresence/',ConfirmPresenceBtnView.as_view())

]
