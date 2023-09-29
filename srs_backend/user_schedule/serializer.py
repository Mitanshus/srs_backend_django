from rest_framework import serializers
from user_schedule.models import UserSchedule


class user_schedule_serializer (serializers.ModelSerializer):
    class Meta:
        model = UserSchedule
        fields = '__all__'
        read_only_fields = 'id',

    def create(self, validated_data):
        return UserSchedule.objects.create(validated_data)
