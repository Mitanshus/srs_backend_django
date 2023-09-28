from rest_framework import serializers
from location.models import Locations

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Locations
        fields='__all__'
        read_only_fields = 'id',

    def create(self,validated_data):
        return Locations.objects.create(**validated_data)