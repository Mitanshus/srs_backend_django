from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from reservation.models import Reservations
from reservation.serializer import reservation_serializer
# Create your views here.


class create_reservation_view(APIView):
    def post(self, request, *args, **kwargs):
        serializer = reservation_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_reservation_view(APIView):
    def get(self, request, *args, **kwargs):
        reservation = Reservations.objects.all()
        serializer = reservation_serializer(reservation, many=True)
        return Response(serializer.data)


class delete_reservation_view(APIView):
    def delete(self, request):
        reservation_id = request.query_params.get('reservation_id')
        try:
            reservation = Reservations.objects.get(id=reservation_id)
            reservation.delete()
            return Response({"message": "Deleted Successfully !"})
        except Reservations.DoesNotExist:
            return Response({"message": "Reservation does not exist !"})
        