from rest_framework import serializers
from location.models import Locations

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model=Locations
        fields='__all__'
        read_only_fields = 'id',

    def create(self,validated_data):
        return Locations.objects.create(**validated_data)
    
class LocationDeleteSerializer(serializers.Serializer):
    id = serializers.UUIDField()

    def validate_id(self, value):
        """
        Check if the user with the provided ID exists in the database.
        """
        try:
            user = Locations.objects.get(pk=value)
        except Locations.DoesNotExist:
            raise serializers.ValidationError("User with this ID does not exist.")
        return value