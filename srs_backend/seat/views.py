from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from seat.models import Seat
from seat.serializer import seat_serializer
# Create your views here.


class create_seat(APIView):
    def post(self, request, *args, **kwargs):
        serializer = seat_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_all_seats(APIView):
    def get(self, request, *args, **kwargs):
        seats = Seat.objects.all()
        serializer = seat_serializer(seats, many=True)
        return Response(serializer.data)


class delete_seat(APIView):
    def delete(self, request):
        seat_id = request.query_params.get('seat_id')
        try:
            seat = Seat.objects.get(id=seat_id)
            seat.delete()
            return Response({"message": "Deleted Successfully!"})
        except Seat.DoesNotExist:
            return Response({"message": "Seat does not exist !"})
