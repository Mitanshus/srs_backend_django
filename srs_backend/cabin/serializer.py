from rest_framework import serializers
from cabin.models import Cabin


class cabin_serializer (serializers.ModelSerializer):
    class Meta:
        model = Cabin
        fields = '__all__'
        read_only_fields = 'id',

    def create(self, validated_data) :
        return Cabin.objects.create(**validated_data)