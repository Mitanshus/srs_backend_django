from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from user.models import User
from user.serializer import UserSerializer
from user_schedule.serializer import user_schedule_serializer
from user_schedule.models import UserSchedule
# Create your views here.


class user_schedule_view(APIView):
    def post(self, request, *args, **kwargs):
        serializer = user_schedule_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_all_user_schedule (APIView):
    def get(self, request, *args, **kwargs):
        company_id = request.query_params.get('company_id')
        user_id = request.query_params.get('user_id')
        if company_id:
            user_schedule = UserSchedule.objects.filter(company_id=company_id)
        elif user_id:
            user_schedule = UserSchedule.objects.filter(user_id=user_id)
        elif user_id and company_id:
            user_schedule = UserSchedule.objects.filter(
                company_id=company_id, user_id=user_id)
        else:
            user_schedule = UserSchedule.objects.all()
        serializer = user_schedule_serializer(user_schedule, many=True)
        return Response({"data": serializer.data})


class delete_user_schedule(APIView):
    def delete(self, request):
        user_schedule_id = request.query_params.get('user_schedule_id')
        try:
            user_schedule = UserSchedule.objects.get(id=user_schedule_id)
            user_schedule.delete()
            return Response({"message": "Deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except UserSchedule.DoesNotExist:
            return Response({"message": "Schedule Not Found !"}, status=status.HTTP_404_NOT_FOUND)


class view_all_not_scheduled_users (APIView):
    def get(self, request, *args, **kwargs):
        company_id = request.query_params.get('company_id')

        # Get a list of user IDs that have schedules for the specified company_id
        users_with_schedule_ids = UserSchedule.objects.filter(company_id=company_id).values_list(
            'user_id', flat=True).distinct()

        # Exclude users with schedules from the queryset for the specified company_id
        queryset = User.objects.exclude(id__in=users_with_schedule_ids)

        # Serialize the queryset and return the response
        serializer = UserSerializer(queryset, many=True)
        return Response({"data": serializer.data})
