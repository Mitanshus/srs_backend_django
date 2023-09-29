from rest_framework import serializers
from user_schedule.models import UserSchedule


class user_schedule_serializer (serializers.ModelSerializer):

    user_name = serializers.SerializerMethodField()

    class Meta:
        model = UserSchedule
        fields = ['__all__','user_name']
        read_only_fields = 'id',

    def create(self, validated_data):
        return UserSchedule.objects.create(**validated_data)
    
    def get_user_name(self, obj):
        return f"{obj.user_id.first_name} {obj.user_id.last_name}"
