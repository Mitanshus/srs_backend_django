from django.shortcuts import render
from location.models import Locations
from cabin.models import Cabin
from django.db.models import Q
from company.models import Company
from reservation.models import Reservations
from seat.models import Seat
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from reservation.models import Reservations
from reservation.serializer import reservation_serializer
from datetime import datetime# Create your views here.


class create_reservation_view(APIView):
    def post(self, request, *args, **kwargs):
        serializer = reservation_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)


class view_reservation_view(APIView):
    def get(self, request, *args, **kwargs):
        reservation = Reservations.objects.all()
        serializer = reservation_serializer(reservation, many=True)
        return Response(serializer.data)


class delete_reservation_view(APIView):
    def delete(self, request):
        reservation_id = request.query_params.get('reservation_id')
        try:
            reservation = Reservations.objects.get(id=reservation_id)
            reservation.delete()
            return Response({"message": "Deleted Successfully !"})
        except Reservations.DoesNotExist:
            return Response({"message": "Reservation does not exist !"})
        
class AvailableSeatsView(APIView):
    def get(self, request, company_id, location_id, start_date, end_date):
        try:
            # Find the company
            existing_company = Company.objects.filter(id=company_id).first()
            if not existing_company:
                return Response({'message': 'Company not found'}, status=404)

            # Find the location
            existing_location = Locations.objects.filter(id=location_id).first()
            if not existing_location:
                return Response({'message': 'Location not found'}, status=404)

            current_time = datetime.now()

            if start_date < current_time or end_date < current_time:
                return Response({'message': 'Cannot select a previous time for booking'}, status=400)

            if start_date > end_date:
                return Response({'message': 'End Date & time cannot be prior to start date & time'}, status=400)

            booked_reservations = Reservations.objects.filter(
                Q(reservation_start_date__lt=end_date, reservation_end_date__gte=start_date) |
                Q(reservation_start_date__lte=start_date, reservation_end_date__gte=end_date) |
                Q(reservation_start_date__lte=start_date, reservation_end_date__gte=end_date),
                status='BOOKED'
            ).values_list('seat_id', flat=True)

            available_seats = Seat.objects.filter(
                cabin__location_id=location_id
            ).select_related('cabin').values('cabin__id', 'cabin__location_id', 'cabin__name', 'cabin__code', 'id', 'status', 'cabin_id', 'code')

            cabins_with_seats = {}
            for seat in available_seats:
                cabin_id = seat['cabin__id']
                if cabin_id not in cabins_with_seats:
                    cabins_with_seats[cabin_id] = {
                        'Cabin': {
                            'id': seat['cabin__id'],
                            'location_id': seat['cabin__location_id'],
                            'name': seat['cabin__name'],
                            'code': seat['cabin__code'],
                        },
                        'Seats': [],
                    }
                cabins_with_seats[cabin_id]['Seats'].append({
                    'id': seat['id'],
                    'status': seat['status'],
                    'cabin_id': seat['cabin_id'],
                    'code': seat['code'],
                    'isBooked': seat['id'] in booked_reservations,
                    'isReserved': seat['status'] == 'RESERVED',
                })

            result = list(cabins_with_seats.values())

            return Response({'message': 'Available seats fetched successfully', 'data': result}, status=200)

        except Exception as error:
            print('Error getting available seats:', error)
            return Response({'error': 'Internal server error'}, status=500)
        
class DashboardSeatsView(APIView):
    def get(self, request):
        try:
            # Access query parameters 
            company_id = request.GET.get('company_id')
            location_id = request.GET.get('location_id')

            if not company_id or not location_id:
                return Response({'message': 'Company ID and Location ID are required query parameters'}, status=400)

            cur_datetime = datetime.now()

            # Find company and location
            existing_company = Company.objects.filter(id=company_id).first()
            if not existing_company:
                return Response({'message': 'Company not found'}, status=404)

            existing_location = Locations.objects.filter(id=location_id).first()
            if not existing_location:
                return Response({'message': 'Location not found'}, status=404)

            # Get booked reservations
            booked_reservations = Reservations.objects.filter(
                reservation_start_date__lte=cur_datetime, 
                reservation_end_date__gte=cur_datetime,
                status='BOOKED'
            ).values_list('seat_id', flat=True)

            # Get available seats
            available_seats = Seat.objects.filter(cabin__location_id=location_id).values(
                'cabin__id', 
                'cabin__location_id',
                'cabin__name', 
                'cabin__code', 
                'id', 
                'status', 
                'cabin__id', 
                'code'
            )
            
            # Structure response
            cabins_with_seats = {}
            for seat in available_seats:
                cabin_id = seat['cabin__id']
                if cabin_id not in cabins_with_seats:
                    cabins_with_seats[cabin_id] = {
                        'Cabin': {
                            'id': seat['cabin__id'],
                            'location_id': seat['cabin__location_id'],
                            'name': seat['cabin__name'],
                            'code': seat['cabin__code']
                        },
                        'Seats': []
                    }
                
                cabins_with_seats[cabin_id]['Seats'].append({
                    'id': seat['id'],
                    'status': seat['status'],
                    'cabin_id': seat['cabin__id'],
                    'code': seat['code'],
                    'isBooked': seat['id'] in booked_reservations,
                    'isReserved': seat['status'] == 'RESERVED' 
                })

            result = list(cabins_with_seats.values())
            
            return Response({'message': 'Available seats fetched successfully', 'data': result}, status=200)

        except Exception as error:
            print('Error getting available seats:', error)
            return Response({'error': 'Internal server error'}, status=500)