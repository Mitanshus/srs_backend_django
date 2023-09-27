import uuid
from django.db import models
from user.models import User
from seat.models import Seat

class BookingStatus(models.TextChoices):
    BOOKED = 'BOOKED'
    CANCELLED = 'CANCELLED' 
    OCCUPIED = 'OCCUPIED'
    PENDING = 'PENDING'

class ApprovalStatus(models.TextChoices):
    PENDING='PENDING'
    APPROVED='APPROVED'
    REJECTED = 'REJECTED'

class Reservations(models.Model):
    id=models.UUIDField(default=uuid.uuid4,primary_key=True,auto_created=True)
    user_id=models.ForeignKey(to=User,on_delete=models.CASCADE)
    seat_id=models.ForeignKey(to=Seat,on_delete=models.CASCADE)
    reservation_start_date=models.DateField(null=False)
    reservation_end_date=models.DateField(null=False)
    status=models.CharField(max_length= 10,choices=BookingStatus.choices)
    approval_status=models.CharField(max_length=10,choices=ApprovalStatus.choices)