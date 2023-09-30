from imaplib import _Authenticator
from rest_framework.response import Response
from tokenize import generate_tokens
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from .models import Role,User
from company.models import Company
from user_schedule.models import UserSchedule
from user.serializer import UserDeleteSerializer, UserSerializer,RoleSerializer
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.decorators import  permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import generics
from django.views.decorators.csrf import csrf_exempt  # Import the csrf_exempt decorator

# Your other imports...




# Create your views here.

#@csrf_exempt
class user_login(generics.GenericAPIView):
     
     def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print('^^^^^^^^^^^^^^^^^^^^^^^^email and password^^^^^^^^^^^^^^^^^^^^^^',email, password)

        # Authenticate the user
        user = authenticate( username=email, password=password)
        
        print('^^^^^^^^^^^^^^^^^^^^^^^^coming here^^^^^^^^^^^^^^^^^^^^^^',user)

        if user is not None:
            if user.is_active:
                # Log the user in
                login(request, user)

                # Create the payload
                payload = {
                    'role_name': user.role_id.name,
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'primary_location': user.primary_location.id,
                    'role_id': user.role_id.id,
                    'company_id': user.company_id.id,
                    'location':{
                    'id': user.primary_location.id,
                    'name': user.primary_location.name
                    }
                }
                # userr = User.objects.get(email=email)

                # serializer = UserSerializer(userr)

                return Response({"data":payload}, status=status.HTTP_200_OK)  # Return a valid response
            else:
                return Response({'message': 'Account is not activated'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
        

class create_user(APIView):
    def post(self, request, *args, **kwargs):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    def delete(self, request, pk):
        serializer = UserDeleteSerializer(data={'id': pk})
        if serializer.is_valid():
            user_id = serializer.validated_data['id']
            user = User.objects.get(pk=user_id)
            user.delete()
            return Response({'message': 'User Deleted'},status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class view_all_users(APIView):
    def get(self, request, *args, **kwargs):
        # Check if a query parameter called 'company_id' is provided
        company_id = request.GET.get('company_id')

        # If 'company_id' parameter is provided, filter the queryset by 'company_id'
        if company_id:
            users = User.objects.filter(company_id=company_id)
        else:
            users = User.objects.all()  # Retrieve all users

        serializer = UserSerializer(users, many=True)  # Serialize the users
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

class view_all_roles(APIView):
    def get(self, request, *args, **kwargs):
        roles = Role.objects.all()  # Retrieve all roles from the database
        serializer = RoleSerializer(roles, many=True)  # Serialize the roles
        return Response(serializer.data)
        

    
class create_role(APIView):
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class AllScheduleView(APIView):
    def get(self, request):
        try:
            company_id = request.GET.get('company_id')
            existing_company = Company.objects.filter(id=company_id).first()
            
            if not existing_company:
                return Response({'message': 'Company not found'}, status=404)

            schedules = UserSchedule.objects.filter(company_id=company_id).select_related('user')
            
            schedule_data = []
            for schedule in schedules:
                schedule_data.append({
                    'user': {
                        'first_name': schedule.user.first_name,
                        'last_name': schedule.user.last_name,
                    },
                    # Add other schedule attributes as needed
                })

            return Response({'message': 'Schedule data fetched successfully', 'data': schedule_data}, status=200)

        except Exception as error:
            print('Error getting Schedules:', error)
            return JsonResponse({'error': 'Internal server error'}, status=500)
