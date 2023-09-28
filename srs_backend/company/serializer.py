from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model=Company
        fields='__all__'
        read_only_fields = 'id',

    def create(self,validated_data):
        return Company.objects.create(**validated_data)