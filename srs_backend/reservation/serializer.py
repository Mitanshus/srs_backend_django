from rest_framework import serializers
from reservation.models import Reservations


class reservation_serializer(serializers.ModelSerializer):
    class Meta:
        model = Reservations
        fields = '__all__'
        read_only_fields = 'id',

    def create(self, validated_data):
        return Reservations.objects.create(validated_data)
