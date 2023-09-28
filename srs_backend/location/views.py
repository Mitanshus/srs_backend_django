from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import LocationSerializer
from .models import Locations

class create_location(APIView):
    def post(self, request, *args, **kwargs):
        serializer=LocationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    

class view_all_location(APIView):
    def get(self, request, *args, **kwargs):
        roles = Locations.objects.all()  # Retrieve all roles from the database
        serializer =LocationSerializer(roles, many=True)  # Serialize the roles
        return Response(serializer.data)
        