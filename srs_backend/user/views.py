from imaplib import _Authenticator
from rest_framework.response import Response
from tokenize import generate_tokens
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from .models import Role,User
from user.serializer import UserSerializer,RoleSerializer
from rest_framework import status
from django.contrib.auth import authenticate, login
from rest_framework.decorators import  permission_classes
from rest_framework.permissions import AllowAny


# Create your views here.

class user_login(APIView):
     @permission_classes([AllowAny])
     def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email, password)

        # Authenticate the user
        user = authenticate(request, email=email, password=password)
        print(user)

        if user is not None:
            if user.is_active:
                # Log the user in
                login(request, user)

                # Create the payload
                payload = {
                    # 'role_name': user.role.name,
                    'id': user.id,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'primary_location': user.primary_location.id,
                    'role_id': user.role_id.id,
                    'company_id': user.company_id.id,
                    'location': user.primary_location.name
                }

                return Response(payload, status=status.HTTP_200_OK)  # Return a valid response
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


class view_all_users(APIView):
    def get(self, request, *args, **kwargs):
        roles = User.objects.all()  # Retrieve all roles from the database
        serializer = UserSerializer(roles, many=True)  # Serialize the roles
        return Response(serializer.data)
        

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

