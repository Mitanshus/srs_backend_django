from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from cabin.serializer import cabin_serializer
from cabin.models import Cabin
# Create your views here.


class create_cabin(APIView):
    def post(self, request, *args, **kwargs):
        serializer = cabin_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_all_cabins(APIView):
    def get(self, request, *args, **kwargs):
        cabin = Cabin.objects.all()
        serializer = cabin_serializer(cabin, many=True)
        return Response(serializer.data)


class delete_cabin(APIView):
    def delete(self, request):
        cabin_id = request.query_params.get('cabin_id')
        try:
            cabin = Cabin.objects.get(id=cabin_id)
            cabin.delete()
            return Response({"message": "Deleted Successfully !"})
        except Cabin.DoesNotExist:
            return Response({"message": "Cabin does not exist !"})
