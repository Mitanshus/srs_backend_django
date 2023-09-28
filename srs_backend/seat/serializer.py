from rest_framework import serializers
from seat.models import Seat


class seat_serializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'
        read_only_fields = 'id',

    def create(self, validate_data):
        return Seat.objects.create(** validate_data)
