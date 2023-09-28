from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import generics
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
    
class LocationByCompanyView(generics.ListAPIView):
    serializer_class = LocationSerializer

    def get(self, request, company_id):
        try:
            # Use the 'company_id' parameter to filter locations by company
            locations = Locations.objects.filter(company_id=company_id)

            # Create a list of location data, assuming Location has a 'serialize' method
            location_data = [location.serialize() for location in locations]

            return Response({'data': location_data}, status=200)

        except Exception as error:
            print('Error getting locations by company:', error)
            return Response({'error': 'Internal server error'}, status=500)
        