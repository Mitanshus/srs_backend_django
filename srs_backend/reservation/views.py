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
    
      start_datetime = datetime.strptime(start_date, "%Y-%m-%d")  
      end_datetime = datetime.strptime(end_date, "%Y-%m-%d")
      
      company = Company.objects.get(id=company_id)
      
      # Get all cabins for this location
      cabins = Cabin.objects.filter(location_id=location_id)  
      
      # Get list of locations from cabins
      locations = [cabin.location_id for cabin in cabins]  
      
      booked_reservations = Reservations.objects.filter(
        Q(reservation_start_date__lt=end_datetime, reservation_end_date__gte=start_datetime) | 
        Q(reservation_start_date__lte=start_datetime, reservation_end_date__gte=end_datetime),
        status='BOOKED'
      ).values_list('seat_id', flat=True)

      available_seats = Seat.objects.filter(cabin__in=cabins).values()
      
      cabins_with_seats = {}
      for seat in available_seats:
            
        cabin = cabins.get(id=seat['cabin_id'])
            
        if seat['cabin_id'] not in cabins_with_seats:
            
          cabins_with_seats[seat['cabin_id']] = {
            "Cabin": {
              "id": cabin.id,
              "location_id": cabin.location_id,
              "name": cabin.name,  
              "code": cabin.code
            },
            "Seats": []
          }
          
        is_partially_booked = Reservations.objects.filter(
          seat_id=seat['id'],
          reservation_start_date__lt=end_datetime,
          reservation_end_date__gt=start_datetime
        ).exists()

        is_reserved = seat['status'] == 'RESERVED'
        
        cabins_with_seats[seat['cabin_id']]['Seats'].append({
          "id": seat['id'],
          "status": seat['status'],
          "cabin_id": seat['cabin_id'], 
          "code": seat['code'],
          "isBooked": is_partially_booked,
          "isReserved": is_reserved 
        })

      result = list(cabins_with_seats.values())
      
      return Response({
        "message": "Available seats fetched successfully",
        "data": result  
      })

    except Exception as e:
      return Response({"error": str(e)}, status=500)

        
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