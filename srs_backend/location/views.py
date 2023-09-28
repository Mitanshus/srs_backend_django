from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import LocationDeleteSerializer, LocationSerializer
from .models import Locations
from rest_framework import status


class location(APIView):
    def post(self, request, *args, **kwargs):
        serializer=LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    def delete(self, request, pk):
        serializer = LocationDeleteSerializer(data={'id': pk})
        if serializer.is_valid():
            user_id = serializer.validated_data['id']
            user = Locations.objects.get(pk=user_id)
            user.delete()
            return Response({'message': 'location  Deleted'},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class view_all_location(APIView):
    def get(self, request, *args, **kwargs):
        roles = Locations.objects.all()  # Retrieve all roles from the database
        serializer =LocationSerializer(roles, many=True)  # Serialize the roles
        return Response(serializer.data)
        