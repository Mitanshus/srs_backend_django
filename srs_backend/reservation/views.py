from django.shortcuts import render
from location.models import Locations
from cabin.models import Cabin
from django.db.models import Q
from company.models import Company
from reservation.models import Reservations
from cabin.serializer import cabin_serializer
from seat.models import Seat
from user.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from reservation.models import Reservations,Confirmreservation
from django.shortcuts import get_object_or_404
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
        
        start_datetime = datetime.strptime(start_date, "%Y-%m-%d %H:%M")
        end_datetime = datetime.strptime(end_date, "%Y-%m-%d %H:%M")
        
        booked_seats = Reservations.objects.filter(
            Q(reservation_start_date__lt=end_datetime, 
              reservation_end_date__gte=start_datetime) |
            Q(reservation_start_date__lte=start_datetime,
              reservation_end_date__gte=end_datetime),  
            status='BOOKED'
        ).values_list('seat_id', flat=True)  
        
        seats = Seat.objects.filter(
            cabin__location_id=location_id
        ).select_related('cabin')
        
        cabins = {}
        result = []
        for seat in seats:
            cabin = seat.cabin
            
            if cabin.id not in cabins:
                cabins[cabin.id] = {
                   'id': cabin.id,  
                   'locationId': cabin.location_id.id,
                   'cabinName': cabin.name,
                   'cabinCode': cabin.code,
                   'seats': []
                }
                
            is_booked = seat.id in booked_seats    
            
            cabins[cabin.id]['seats'].append({
                'id': seat.id,
                'status': seat.status,   
                'isReserved': seat.status == 'RESERVED',
                'isBooked': is_booked
            })
        
        
            
        
            for cabin in cabins.values():
             obj = {
                'id': cabin['id'],
                'locationId': cabin['locationId'],
                'cabinName': cabin['cabinName'],
                'cabinCode': cabin['cabinCode'],
                'totalSeats': len(cabin['seats']),
                'availableSeats': len([seat for seat in cabin['seats'] if not seat['isBooked']]),
                'seats': cabin['seats']
            }
            
            result.append(obj)
         
        return Response({
            'message': 'Available seats fetched successfully',
            'data': result
        })

        
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
        

class GetAllBookingsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user_id = request.GET.get('user_id')
            company_id = request.GET.get('company_id')
            location_id = request.GET.get('location_id')

            existing_user = get_object_or_404(User, id=user_id, company_id=company_id)

            bookings = Reservations.objects.filter(
                user_id=user_id,
                seat_id__cabin__location_id=location_id
            ).select_related('seat_id__cabin')

            data = [
                {
                    'id': booking.id,
                    'seat': {
                        'code': booking.seat.code,
                        'cabin': {
                            'id': booking.seat.cabin.id,
                            'name': booking.seat.cabin.name,
                            'code': booking.seat.cabin.code,
                            'location_id': booking.seat.cabin.location_id,
                        }
                    }
                }
                for booking in bookings
            ]

            return Response({'message': 'Bookings fetched successfully', 'data': data}, status=200)

        except Exception as err:
            print('Error while fetching Booking Data:', err)
            return Response({'error': 'Internal server error'}, status=500)
        
class ConfirmPresenceBtnView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user_id = request.POST.get('user_id')
            cur_datetime = datetime.now().strftime('%Y-%m-%d')
            cur_date = cur_datetime.split(' ')[0]

            existing_reservation = Reservations.objects.filter(
                Q(reservation_start_date__lte=cur_datetime) &
                Q(reservation_end_date__gte=cur_datetime) &
                Q(user_id=user_id) &
                Q(status='BOOKED')
            )

            if not existing_reservation.exists():
                return Response({'message': 'No Reservation found for current time.', 'isFound': False}, status=200)

            reservation_id = existing_reservation[0].id

            existing_confirmation = Confirmreservation.objects.filter(
                Q(reservation_id=reservation_id) &
                Q(date__date=cur_date) &
                Q(present=True)
            )

            if existing_confirmation.exists():
                return Response({'message': 'Seat already confirmed for selected booking', 'isPresent': True}, status=200)
            else:
                return Response({'isPresent': False}, status=200)

        except Exception as e:
            print('Error while handling confirm presence button:', e)
            return Response({'error': 'Internal server error'}, status=404)