from rest_framework import serializers
from user.models import User,Role
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    
    role_name = serializers.CharField(source='role_id.name')  # Use source to access the role name

    class Meta:
        model=User
        fields='__all__'
        read_only_fields =  ('id', 'role_name') 

    def create(self,validated_data):
        password=validated_data.pop('password',None)
        user =  User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
    

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Role
        fields='__all__'
        read_only_fields = 'id',

    def create(self,validated_data):
        return Role.objects.create(**validated_data)
    

class UserDeleteSerializer(serializers.Serializer):
    id = serializers.UUIDField()

    def validate_id(self, value):
        """
        Check if the user with the provided ID exists in the database.
        """
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this ID does not exist.")
        return value