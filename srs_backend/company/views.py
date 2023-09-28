
from rest_framework.response import Response


from rest_framework.views import APIView
from .serializer import CompanySerializer
from .models import Company

class create_company(APIView):
    def post(self, request, *args, **kwargs):
        serializer=CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
class view_all_company(APIView):
    def get(self, request, *args, **kwargs):
        roles = Company.objects.all()  # Retrieve all roles from the database
        serializer =CompanySerializer(roles, many=True)  # Serialize the roles
        return Response(serializer.data)
