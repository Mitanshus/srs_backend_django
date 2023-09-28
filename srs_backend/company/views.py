
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializer import CompanySerializer
from .models import Company


class create_company(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_all_company(APIView):
    def get(self, request, *args, **kwargs):
        roles = Company.objects.all()  # Retrieve all roles from the database
        serializer = CompanySerializer(roles, many=True)  # Serialize the roless
        return Response(serializer.data)


class delete_company(APIView):
    def delete(self, request):
        company_id = request.query_params.get('company_id')
        try:
            company = Company.objects.get(id=company_id)
            company.delete()
            return Response({"message": "Deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Company.DoesNotExist:
            return Response({"message" : "Company Not Found !"},status=status.HTTP_404_NOT_FOUND)
