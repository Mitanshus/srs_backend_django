from rest_framework import serializers
from user_schedule.models import UserSchedule


class user_schedule_serializer (serializers.ModelSerializer):

    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()


    class Meta:
        model = UserSchedule
        fields = ['id','user_id','company_id','monday','tuesday','wednesday','thursday','saturday','sunday','first_name','last_name']
        read_only_fields = 'id',

    def create(self, validated_data):
        return UserSchedule.objects.create(**validated_data)
    
    def get_first_name(self, obj):
        return f"{obj.user_id.first_name}"
    
    def get_last_name(self, obj):
        return f"{obj.user_id.last_name}"

