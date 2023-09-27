from imaplib import _Authenticator
from tokenize import generate_tokens
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from user.serializer import UserSerializer
# Create your views here.
class user_login(APIView):
    def post(self, request, *args, **kwargs) :
        try:
            email = request.POST.get('email')
            password = request.POST.get('password')
            
            user = _Authenticator(request, email=email, password=password)
            
            if user is None:
                return JsonResponse({'message': 'User does not exist'}, status=400)
            
            if not user.is_activated:
                return JsonResponse({'message': 'You have not set a password yet. Please check your email for instructions on how to set a password.'}, status=401)
            
            token = generate_tokens(user)
            payload = {
                'role_name': user.role.name,
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'primary_location': user.primary_location,
                'role_id': user.role_id,
                'company_id': user.company_id,
                'location': user.location
            }
            
            return JsonResponse({'message': 'Logged in successfully', 'token': token, 'data': payload}, status=200)
        
        except Exception as e:
            print('Error logging:', e)
            return JsonResponse({'error': 'Internal server error'}, status=500)
        

class create_user(APIView):
    def post(self, request, *args, **kwargs):
        serializer=UserSerializer(request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors)