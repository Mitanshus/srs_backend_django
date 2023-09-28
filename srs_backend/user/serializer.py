from rest_framework import serializers
from user.models import User,Role
from django.db import transaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields='__all__'
        read_only_fields = 'id',

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